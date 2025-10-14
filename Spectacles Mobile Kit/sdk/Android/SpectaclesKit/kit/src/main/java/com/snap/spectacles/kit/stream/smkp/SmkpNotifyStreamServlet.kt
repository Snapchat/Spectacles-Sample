package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.readBytes
import java.util.concurrent.Executor

/**
 * Servlet class for handling [SmkpMessage.NOTIFY] requests.
 *
 * @property delegate The delegate responsible for processing requests.
 * @param executor The executor used for asynchronous request processing.
 */
@RequiresApi(Build.VERSION_CODES.N)
class SmkpNotifyStreamServlet(
    tokenManager: SmkpLensTokenManager,
    executor: Executor,
    private val delegate: Delegate,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack
) : SmkpBaseStreamServlet(tokenManager, executor, unpack, pack) {

    /**
     * Delegate interface for processing incoming [SmkpMessage.NOTIFY] requests.
     */
    fun interface Delegate {

        /**
         * Processes an incoming request.
         */
        fun process(
            path: String,
            header: SmkpMessage.Header,
            body: ByteArray,
            priority: Int,
            last: Boolean
        )
    }

    private var path: String = ""

    override fun onReceiveRequest(request: SmkpMessage.Request, priority: Int, last: Boolean) {
        validateTrust(request)

        if (SmkpMessage.NOTIFY != request.type) {
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
            last = last
        )
    }
}
