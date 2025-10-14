package com.snap.spectacles.kit.stream.inet

import android.os.Build
import androidx.annotation.RequiresApi
import java.security.MessageDigest
import java.util.Base64

@RequiresApi(Build.VERSION_CODES.O)
internal object SpectaclesInetService {

    const val SERVICE_TYPE = "_qlic._tcp"
    const val SERVICE_NAME = "SpectaclesMobileKit"
    const val SERVICE_INFO_ID = "id"

    fun getServiceIdentity(port: Int, identity: ByteArray): String {
        val md = MessageDigest.getInstance("SHA-1")
        md.update(port.toString().toByteArray(Charsets.UTF_8))
        md.update(identity)
        return Base64.getEncoder().withoutPadding().encodeToString(md.digest())
    }
}
