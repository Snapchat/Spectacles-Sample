package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.readBytes
import java.io.InputStream
import java.util.concurrent.Executor

/**
 * Servlet class to handle [SmkpMessage.DOWNLOAD] requests, particularly for downloading content in chunks.
 *
 * @property delegate The delegate responsible for processing content requests.
 * @param executor The executor used for asynchronous operations.
 */
@RequiresApi(Build.VERSION_CODES.N)
class SmkpDownloadStreamServlet(
    tokenManager: SmkpLensTokenManager,
    executor: Executor,
    private val delegate: Delegate,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack
) : SmkpBaseStreamServlet(tokenManager, executor, unpack, pack) {

    companion object {
        internal const val HEADER_VERSION = "v"
        internal const val HEADER_RANGE_FROM = "f"
        internal const val HEADER_CHUNK_SIZE = "c"
        internal const val HEADER_TOTAL_SIZE = "s"

        private const val MAX_CHUNK_SIZE = 64 * 1024

        internal const val NOT_MODIFIED = 304 // HTTP status code, "Not Modified"
    }

    /**
     * Data class representing the content available for download.
     *
     * @param inputStream The input stream of the content to be downloaded.
     * @param size The total size of the content.
     * @param version The optional version identifier of the content.
     */
    data class Content(
        val inputStream: InputStream,
        val size: Long,
        val version: String?
    )

    /**
     * Delegate interface for processing incoming [SmkpMessage.DOWNLOAD] requests.
     */
    fun interface Delegate {

        /**
         * Callback interface for handling successful content retrieval.
         */
        fun interface OnSuccess {
            fun invoke(content: Content, priority: Int)
        }

        /**
         * Callback interface for handling cases where the requested content has not been modified.
         */
        fun interface OnNotModified {
            fun invoke()
        }

        /**
         * Callback interface for handling errors during content retrieval.
         */
        fun interface OnError {
            fun invoke(error: Exception)
        }

        /**
         * Processes an incoming request.
         */
        fun process(
            path: String,
            cachedVersion: String?,
            priority: Int,
            onSuccess: OnSuccess,
            onNotModified: OnNotModified,
            onError: OnError
        )
    }

    // Holds the content being downloaded
    private var content: Content? = null

    // Tracks current position in the content stream
    private var contentPointer = 0L

    override fun onReceiveRequest(request: SmkpMessage.Request, priority: Int, last: Boolean) {
        validateTrust(request)

        if (SmkpMessage.DOWNLOAD != request.type) {
            throw SpectaclesStreamException(
                SpectaclesStreamException.NOT_IMPLEMENTED, "Unsupported method: ${request.type}"
            )
        }

        // Load content if not already loaded; otherwise, resume download.
        if (null == content) {
            // HEADER_RANGE_FROM being non-null indicates a download resumption. If absent, it means that
            // the requester already downloads the complete content for the specified version.
            val from = request.header.get(HEADER_RANGE_FROM)
            val version = if (null == from) request.header.get(HEADER_VERSION)?.getStringValue() else null
            delegate.process(
                path = request.path,
                cachedVersion = version,
                priority = priority,
                onSuccess = { c, p -> onSuccess(request, c, p) },
                onNotModified = { onNotModified(priority) },
                onError = ::sendError
            )
        } else {
            sendResponse(request, content!!, priority)
        }
    }

    private fun onSuccess(request: SmkpMessage.Request, content: Content, priority: Int) {
        this.content = content
        attachClosable(content.inputStream)

        sendResponse(request, content, priority)
    }

    /**
     * Sends chunked content data.
     */
    private fun sendResponse(request: SmkpMessage.Request, content: Content, priority: Int) {
        // Determine start position and chunk size from the request
        var start = request.header.get(HEADER_RANGE_FROM)?.getIntValue() ?: 0
        val chunk = (request.header.get(HEADER_CHUNK_SIZE)?.getIntValue() ?: MAX_CHUNK_SIZE)
            .coerceAtMost(MAX_CHUNK_SIZE)

        // Initialize the response header, including the version and total size only in the first response.
        val header = SmkpMessage.Header()
        if (0L == contentPointer) {
            if (!content.version.isNullOrEmpty()) {
                header.add(HEADER_VERSION, content.version)
            }
            header.add(HEADER_TOTAL_SIZE, content.size.toInt())

            // Set the start pointer to 0 for new version content, irrespective of the request field.
            if (content.version.isNullOrEmpty() ||
                content.version != request.header.get(HEADER_VERSION)?.getStringValue()
            ) {
                start = 0
            }
        }

        while (start > contentPointer) {
            val ret = content.inputStream.skip(start - contentPointer)
            if (ret <= 0) {
                sendError(SpectaclesStreamException(SpectaclesStreamException.INTERNAL_ERROR))
                return
            }
            contentPointer += ret
        }
        header.add(HEADER_RANGE_FROM, contentPointer.toInt())

        val body = content.inputStream.readBytes(chunk.coerceAtMost((content.size - contentPointer).toInt()))
        contentPointer += body.size

        val message = SmkpMessage.Response(SmkpMessage.RESPONSE, 0, header, SpectaclesStreamBytesPayload(body))
        send(message, priority, contentPointer >= content.size)
    }

    /**
     * Sends a "Not Modified" response when the requested content is already up-to-date.
     */
    private fun onNotModified(priority: Int) {
        val message = SmkpMessage.Response(
            SmkpMessage.RESPONSE, NOT_MODIFIED, SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        send(message, priority, true)
    }
}
