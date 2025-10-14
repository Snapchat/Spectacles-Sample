package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.readBytes
import com.snap.spectacles.kit.util.Log
import org.json.JSONObject
import java.util.concurrent.Executor

private const val TAG = "SmkpAttestStreamServlet"

/**
 * Servlet class to handle lens attest requests, [SmkpMessage.ATTEST].
 */
@RequiresApi(Build.VERSION_CODES.N)
class SmkpAttestStreamServlet(
    private val trustManager: SpectaclesStreamTrustManager,
    private val tokenManager: SmkpLensTokenManager,
    executor: Executor,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack
) : SmkpBaseStreamServlet(tokenManager, executor, unpack, pack) {

    companion object {
        internal const val BODY_LENS_ID = "lens-id"
        internal const val BODY_LENS_VERSION = "lens-version"
        internal const val BODY_LENS_CREATOR = "creator"
        internal const val BODY_LENS_SOURCE = "source"
    }

    private val log = Log.get(TAG)
    
    override fun onReceiveRequest(request: SmkpMessage.Request, priority: Int, last: Boolean) {
        if (SmkpMessage.ATTEST != request.type) {
            throw SpectaclesStreamException(
                SpectaclesStreamException.NOT_IMPLEMENTED, "Unsupported method: ${request.type}"
            )
        }

        val lensToken = request.header.get(HEADER_LENS_TOKEN)?.getStringValue()
            ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Missing lens-token")
        val lensProvision = getLensProvision(request.body)

        log.debug { "onReceive: $lensToken = $lensProvision" }

        trustManager.validateLensTrust(lensProvision)
        tokenManager.addToken(lensToken, lensProvision)

        val response = SmkpMessage.Response(
            SmkpMessage.RESPONSE, 0, SmkpMessage.Header(), SpectaclesStreamBytesPayload.Empty
        )
        send(response, priority, true)
    }

    private fun getLensProvision(payload: SpectaclesStreamPayload): SpectaclesStreamTrustManager.LensProvision {
        val body = payload.getInputStream().readBytes(payload.size).toString(Charsets.UTF_8)
        val json = JSONObject(body)
        val id = json.opt(BODY_LENS_ID)?.toString()
            ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Missing lens-id")
        val version = json.optString(BODY_LENS_VERSION)
        val creator = json.optString(BODY_LENS_CREATOR)
        val source = json.optString(BODY_LENS_SOURCE)
        return SpectaclesStreamTrustManager.LensProvision(id, version, creator, source)
    }
}
