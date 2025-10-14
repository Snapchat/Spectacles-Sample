package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.annotation.VisibleForTesting
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.CloseGuard
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.readBytes
import java.io.Closeable
import java.util.concurrent.Executor

/**
 * Client class to download content from peer.
 */
@RequiresApi(Build.VERSION_CODES.N)
class SmkpDownloadStreamClient(
    connection: SpectaclesStreamConnection,
    executor: Executor,
    onClose: () -> Unit,
    private val onDownload: OnDownload,
    private val onNotModified: OnNotModified,
    private val onFailed: OnFailed,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack
) : SmkpBaseStreamClient(null, onClose, connection, executor, unpack, pack) {

    data class Source(
        val path: String, // The source path/URL of the content to be downloaded.
        val version: String? = null, // Optional version identifier for freshness validation.
        val start: Int = 0, // Allows resuming downloads from a specific byte position.
        val chunk: Int = 0, // Preferred chunk size
    )

    interface Writer : Closeable {
        fun write(content: ByteArray)
    }

    fun interface OnDownload {
        fun invoke(path: String, version: String?, size: Int, start: Int): Writer
    }

    fun interface OnNotModified {
        fun invoke(path: String)
    }

    fun interface OnFailed {
        fun invoke(path: String, status: Int, body: ByteArray)
    }

    var token: String? = null

    private var source: Source? = null
    private var priority = 0

    private var writerGuard: CloseGuard<Writer>? = null

    private var totalSize = 0

    private var downloaded = 0

    fun download(source: Source, priority: Int) {
        this.source = source
        this.priority = priority
        sendInitialRequest(source, priority)
    }

    @VisibleForTesting(VisibleForTesting.PROTECTED)
    public override fun onReceiveResponse(response: SmkpMessage.Response, priority: Int, last: Boolean) {
        if (null == writerGuard) {
            processInitialResponse(response, last)
        } else {
            processChunkResponse(response, last)
        }
    }

    private fun processInitialResponse(response: SmkpMessage.Response, last: Boolean) {
        if (SmkpDownloadStreamServlet.NOT_MODIFIED == response.status) {
            return onNotModified.invoke(source!!.path)
        }

        if (0 != response.status) {
            val body = response.body.getInputStream().use {
                it.readBytes(response.body.size)
            }
            return onFailed.invoke(source!!.path, response.status, body)
        }

        val version = response.header.get(SmkpDownloadStreamServlet.HEADER_VERSION)?.getStringValue()
        totalSize = response.header.get(SmkpDownloadStreamServlet.HEADER_TOTAL_SIZE)?.getIntValue() ?: 0
        downloaded = response.header.get(SmkpDownloadStreamServlet.HEADER_RANGE_FROM)?.getIntValue() ?: 0
        writerGuard = CloseGuard(
            onDownload.invoke(source!!.path, version, totalSize, downloaded).also {
                attachClosable(it)
            }
        )
        processChunkResponse(response, last)
    }

    private fun processChunkResponse(response: SmkpMessage.Response, last: Boolean) {
        val body = response.body.getInputStream().use {
            it.readBytes(response.body.size)
        }

        if (0 != response.status) {
            return onFailed.invoke(source!!.path, response.status, body)
        }

        downloaded += body.size
        if (!last && downloaded < totalSize) {
            sendChunkRequest(source!!, priority)
        }

        writerGuard!!.subject.write(body)
        if (last || downloaded >= totalSize) {
            writerGuard!!.close()
        }
    }

    private fun sendInitialRequest(source: Source, priority: Int) {
        val header = SmkpMessage.Header().apply {
            token?.let {
                add(SmkpBaseStreamServlet.HEADER_LENS_TOKEN, it)
            }

            if (source.start > 0) {
                add(SmkpDownloadStreamServlet.HEADER_RANGE_FROM, source.start)
            } else if (source.version != null) {
                add(SmkpDownloadStreamServlet.HEADER_VERSION, source.version)
            }

            if (source.chunk > 0) {
                add(SmkpDownloadStreamServlet.HEADER_CHUNK_SIZE, source.chunk)
            }
        }

        val request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            source.path,
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        send(request, priority, false)
    }

    private fun sendChunkRequest(source: Source, priority: Int) {
        val header = SmkpMessage.Header().apply {
            if (source.chunk > 0) {
                add(SmkpDownloadStreamServlet.HEADER_CHUNK_SIZE, source.chunk)
            }
        }
        val request = SmkpMessage.Request(
            SmkpMessage.DOWNLOAD,
            "",
            header,
            SpectaclesStreamBytesPayload.Empty
        )
        send(request, priority, false)
    }
}
