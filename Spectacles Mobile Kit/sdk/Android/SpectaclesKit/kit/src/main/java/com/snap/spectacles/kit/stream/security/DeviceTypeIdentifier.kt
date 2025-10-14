package com.snap.spectacles.kit.stream.security

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import java.security.cert.Certificate
import java.util.Base64

@RequiresApi(Build.VERSION_CODES.O)
internal object DeviceTypeIdentifier {

    private const val SPECTACLES_PUBLIC_KEY = """
        MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBskEoBAemM8yn7iJJts/ljvinOCS
        EjCH1M8AUMYoOKuEzAR8JWj0G/Rr+aPKK9tncL+cv35Gcn5Enp7uEoYuew==
    """

    private const val SPECTACLES_UNFUSED_PUBLIC_KEY = """
        MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEZsMg4Dl0Ba2drJF226cWjCWTnxUv
        1ws1+v8P6NnoRolSVJXVK8d2hbt7jYGCuXL7BLbjLhwQRdWI6CPflSAx5g==
    """

    private const val ANDROID_GOOGLE_PUBLIC_KEY = """
        MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHsK7Qui8xU
        FmOr75gvMsd/dTEDDJdSSxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5j
        lRfdnJLmN0pTy/4lj4/7tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y
        //0rb+T+W8a9nsNL/ggjnar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73X
        pXyTqRxB/M0n1n/W9nGqC4FSYa04T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYI
        mQQcHtGl/m00QLVWutHQoVJYnFPlXTcHYvASLu+RhhsbDmxMgJJ0mcDpvsC4PjvB
        +TxywElgS70vE0XmLD+OJtvsBslHZvPBKCOdT0MS+tgSOIfga+z1Z1g7+DVagf7q
        uvmag8jfPioyKvxnK/EgsTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgp
        Zrt3i5MIlCaY504LzSRiigHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7
        gLiMm0jhO2B6tUXHI/+MRPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82
        ixPvZtXQpUpuL12ab+9EaDK8Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+
        NpUFgNPN9PvQi8WEg5UmAGMCAwEAAQ==
    """

    private val devicePublicKeyToType by lazy {
        listOf(
            SPECTACLES_PUBLIC_KEY.encoded() to SpectaclesStreamTrustManager.DeviceType.SPECTACLES,
            SPECTACLES_UNFUSED_PUBLIC_KEY.encoded() to SpectaclesStreamTrustManager.DeviceType.SPECTACLES_UNFUSED,
            ANDROID_GOOGLE_PUBLIC_KEY.encoded() to SpectaclesStreamTrustManager.DeviceType.ANDROID,
        )
    }

    /**
     * Resolves the device type based on the public key found in the provided X.509 certificate.
     */
    fun resolveDeviceType(certificate: Certificate): SpectaclesStreamTrustManager.DeviceType {
        val encoded = certificate.publicKey.encoded
        val mapping = devicePublicKeyToType.find { it.first.contentEquals(encoded) }
        return mapping?.second ?: SpectaclesStreamTrustManager.DeviceType.UNKNOWN
    }

    private fun String.encoded(): ByteArray {
        return Base64.getMimeDecoder().decode(this)
    }
}
