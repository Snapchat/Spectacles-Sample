package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.SpectaclesStreamServlet
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.SpectaclesStreamWorker
import java.util.concurrent.Executor
import kotlin.jvm.Throws

/**
 * Abstract base class for handling stream requests in a servlet-like manner.
 */
@RequiresApi(Build.VERSION_CODES.N)
abstract class SmkpBaseStreamServlet(
    private val tokenManager: SmkpLensTokenManager,
    executor: Executor,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack,
    format: (SpectaclesStreamException) -> SmkpMessage = SmkpMessage.Response.Companion::error
) :
    SpectaclesStreamWorker<SmkpMessage>(executor, unpack, pack, format),
    SpectaclesStreamServlet {

    companion object {
        internal const val HEADER_LENS_TOKEN = "t"
    }

    private var servicedLens: SpectaclesStreamTrustManager.LensProvision? = null

    override fun service(request: SpectaclesStreamDataUnit) {
        process(request)
    }

    override fun startStream(
        onReceive: (SpectaclesStreamDataUnit) -> Unit,
        onClose: () -> Unit
    ): SpectaclesStream {
        throw SpectaclesStreamException(SpectaclesStreamException.INTERNAL_ERROR, "Not allowed")
    }

    override fun onReceive(message: SmkpMessage, priority: Int, last: Boolean) {
        if (message !is SmkpMessage.Request) {
            throw SpectaclesStreamException(
                SpectaclesStreamException.NOT_IMPLEMENTED, "Unsupported type: ${message::class}"
            )
        }

        onReceiveRequest(message, priority, last)
    }

    /**
     * Called when received a [SmkpMessage.Request]
     */
    protected abstract fun onReceiveRequest(request: SmkpMessage.Request, priority: Int, last: Boolean)

    /**
     * Validates the trustworthiness of the given [SmkpMessage.Request].
     */
    @Throws(SpectaclesStreamException::class)
    protected fun validateTrust(request: SmkpMessage.Request) {
        if (null == servicedLens) {
            servicedLens = tokenManager.getToken(
                request.header.get(HEADER_LENS_TOKEN)?.getStringValue()
            )
        }

        if (null == servicedLens) {
            throw SpectaclesStreamException(SpectaclesStreamException.UNAUTHORIZED, "Not trust")
        }
    }

    /**
     * Retrieves the lens this servlet is servicing.
     * @return The lens being serviced by this servlet, or null if no lens is associated.
     */
    protected fun getServicedLens(): SpectaclesStreamTrustManager.LensProvision? = servicedLens
}
