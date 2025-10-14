package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamConnection
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import org.json.JSONObject
import java.util.concurrent.Executor

/**
 * Client class for initiating [SmkpMessage.ATTEST] requests.
 */
@RequiresApi(Build.VERSION_CODES.N)
class SmkpAttestStreamClient(
    connection: SpectaclesStreamConnection,
    executor: Executor,
    onClose: () -> Unit,
    onResponse: OnResponse,
    unpack: (SpectaclesStreamPayload) -> SmkpMessage = SmkpMessage.Companion::unpack,
    pack: (SmkpMessage) -> SpectaclesStreamPayload = SmkpMessage::pack
) : SmkpBaseStreamClient(onResponse, onClose, connection, executor, unpack, pack) {

    fun attest(token: String, provision: SpectaclesStreamTrustManager.LensProvision) {
        val request = SmkpMessage.Request(
            SmkpMessage.ATTEST,
            "",
            SmkpMessage.Header().apply {
                add(SmkpBaseStreamServlet.HEADER_LENS_TOKEN, token)
            },
            getProvisionPayload(provision)
        )
        send(request, 7, true)
    }

    private fun getProvisionPayload(
        provision: SpectaclesStreamTrustManager.LensProvision
    ): SpectaclesStreamBytesPayload {
        val json = JSONObject().apply {
            put(SmkpAttestStreamServlet.BODY_LENS_ID, provision.lensId)
            put(SmkpAttestStreamServlet.BODY_LENS_VERSION, provision.version)
            put(SmkpAttestStreamServlet.BODY_LENS_SOURCE, provision.source)
            put(SmkpAttestStreamServlet.BODY_LENS_CREATOR, provision.creator)
        }
        return SpectaclesStreamBytesPayload(json.toString().toByteArray(Charsets.UTF_8))
    }
}
