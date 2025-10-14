package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.readBytes
import java.util.concurrent.Executor

/**
 * Servlet class for handling [SmkpMessage.CALL] requests.
 *
 * @property delegate The delegate responsible for processing requests.
 * @param executor The executor used for asynchronous request processing.
 */
@RequiresApi(Build.VERSION_CODES.N)
class SmkpCallStreamServlet(
    tokenManager: SmkpLensTokenManager,
    executor: Executor,
    private val delegate: Delegate,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack
) : SmkpBaseStreamServlet(tokenManager, executor, unpack, pack) {

    /**
     * Delegate interface for processing incoming [SmkpMessage.CALL] requests.
     */
    fun interface Delegate {

        /**
         * Callback interface for handling successful request processing.
         */
        fun interface OnSuccess {
            fun invoke(status: Int, body: ByteArray, priority: Int, last: Boolean)
        }

        /**
         * Callback interface for handling errors that occur during processing.
         */
        fun interface OnError {
            fun invoke(error: Exception)
        }

        /**
         * Processes an incoming request.
         */
        fun process(
            path: String,
            header: SmkpMessage.Header,
            body: ByteArray,
            priority: Int,
            last: Boolean,
            onSuccess: OnSuccess,
            onError: OnError
        )
    }

    private var path: String = ""

    override fun onReceiveRequest(request: SmkpMessage.Request, priority: Int, last: Boolean) {
        validateTrust(request)

        if (SmkpMessage.CALL != request.type) {
            throw SpectaclesStreamException(
                SpectaclesStreamException.NOT_IMPLEMENTED, "Unsupported method: ${request.type}"
            )
        }

        if (request.path.isNotEmpty()) {
            path = request.path
        }

        val body = request.body.getInputStream().use {
            it.readBytes(request.body.size)
        }
        delegate.process(
            path = path,
            header = request.header,
            body = body,
            priority = priority,
            last = last,
            onSuccess = ::sendResponse,
            onError = ::sendError
        )
    }

    private fun sendResponse(status: Int, body: ByteArray, priority: Int, last: Boolean) {
        val message = SmkpMessage.Response(
            SmkpMessage.RESPONSE, status, SmkpMessage.Header(), SpectaclesStreamBytesPayload(body)
        )
        send(message, priority, last)
    }
}
