package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import java.io.ByteArrayInputStream
import java.security.cert.Certificate
import java.security.cert.CertificateFactory

@RunWith(JUnit4::class)
class DeviceTypeIdentifierTest : KitBaseTest() {

    private val android = """
        MIIFHDCCAwSgAwIBAgIJANUP8luj8tazMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNVBAUTEGY5MjAw
        OWU4NTNiNmIwNDUwHhcNMTkxMTIyMjAzNzU4WhcNMzQxMTE4MjAzNzU4WjAbMRkwFwYDVQQFExBm
        OTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHs
        K7Qui8xUFmOr75gvMsd/dTEDDJdSSxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfd
        nJLmN0pTy/4lj4/7tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL
        /ggjnar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGqC4FSYa04
        T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQoVJYnFPlXTcHYvASLu+R
        hhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+OJtvsBslHZvPBKCOdT0MS+tgSOIfga+z1
        Z1g7+DVagf7quvmag8jfPioyKvxnK/EgsTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgp
        Zrt3i5MIlCaY504LzSRiigHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6
        tUXHI/+MRPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9EaDK8
        Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5UmAGMCAwEAAaNjMGEw
        HQYDVR0OBBYEFDZh4QB8iAUJUYtEbEf/GkzJ6k8SMB8GA1UdIwQYMBaAFDZh4QB8iAUJUYtEbEf/
        GkzJ6k8SMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgIEMA0GCSqGSIb3DQEBCwUAA4IC
        AQBOMaBc8oumXb2voc7XCWnuXKhBBK3e2KMGz39t7lA3XXRe2ZLLAkLM5y3J7tURkf5a1SutfdOy
        XAmeE6SRo83Uh6WszodmMkxK5GM4JGrnt4pBisu5igXEydaW7qq2CdC6DOGjG+mEkN8/TA6p3cno
        L/sPyz6evdjLlSeJ8rFBH6xWyIZCbrcpYEJzXaUOEaxxXxgYz5/cTiVKN2M1G2okQBUIYSY6bjEL
        4aUN5cfo7ogP3UvliEo3Eo0YgwuzR2v0KR6C1cZqZJSTnghIC/vAD32KdNQ+c3N+vl2OTsUVMC1G
        iWkngNx1OO1+kXW+YTnnTUOtOIswUP/Vqd5SYgAImMAfY8U9/iIgkQj6T2W6FsScy94IN9fFhE1U
        tzmLoBIuUFsVXJMTz+Jucth+IqoWFua9v1R93/k98p41pjtFX+H8DslVgfP097vju4KDlqN64xV1
        grw3ZLl4CiOe/A91oeLm2UHOq6wn3esB4r2EIQKb6jTVGu5sYCcdWpXr0AUVqcABPdgL+H7qJguB
        w09ojm6xNIrw2OocrDKsudk/okr/AwqEyPKw9WnMlQgLIKw1rODG2NvU9oR3GVGdMkUBZutL8VuF
        kERQGt6vQ2OCw0sV47VMkuYbacK/xyZFiRcrPJPb41zgbQj9XAEyLKCHex0SdDrx+tWUDqG8At2J
        HA==
    """

    private val spectacles = """
        MIICWjCCAf+gAwIBAgIUVWto7oB8vuN8qazhUVbHxu30o1wwCgYIKoZIzj0EAwIw
        ejELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFTATBgNVBAcMDFNh
        bnRhIE1vbmljYTESMBAGA1UEChMJU25hcCBJbmMuMSswKQYDVQQDEyJQcm9kdWN0
        aW9uIEtleSBSb290IEF0dGVzdGF0aW9uIENBMB4XDTIzMTIzMTE4MDMwM1oXDTQ0
        MDIyNDE4MDMwM1owejELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWEx
        FTATBgNVBAcMDFNhbnRhIE1vbmljYTESMBAGA1UEChMJU25hcCBJbmMuMSswKQYD
        VQQDEyJQcm9kdWN0aW9uIEtleSBSb290IEF0dGVzdGF0aW9uIENBMFkwEwYHKoZI
        zj0CAQYIKoZIzj0DAQcDQgAEBskEoBAemM8yn7iJJts/ljvinOCSEjCH1M8AUMYo
        OKuEzAR8JWj0G/Rr+aPKK9tncL+cv35Gcn5Enp7uEoYue6NjMGEwDgYDVR0PAQH/
        BAQDAgIEMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFHcKw+VAfPp9D/T10ZGQ
        EQwDZDklMB8GA1UdIwQYMBaAFHcKw+VAfPp9D/T10ZGQEQwDZDklMAoGCCqGSM49
        BAMCA0kAMEYCIQC1PJzbtK38LXto3YBAEbINA8YK/Rqh3QRlRut0gO3aagIhAIdy
        Zv/wQ3mdJZObfLsQUc0wdXI6o99Pr2MBh9GvQUL6
    """

    private val spectaclesUnfused = """
        MIICXDCCAgGgAwIBAgIUdNpo7Fxyu4aQn230TKoxC9/QfBswCgYIKoZIzj0EAwIw
        ezELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFTATBgNVBAcMDFNh
        bnRhIE1vbmljYTESMBAGA1UEChMJU25hcCBJbmMuMSwwKgYDVQQDEyNEZXZlbG9w
        bWVudCBLZXkgUm9vdCBBdHRlc3RhdGlvbiBDQTAeFw0yMzA5MjYxMzQ0NDVaFw00
        MzExMjAxMzQ0NDVaMHsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlh
        MRUwEwYDVQQHDAxTYW50YSBNb25pY2ExEjAQBgNVBAoTCVNuYXAgSW5jLjEsMCoG
        A1UEAxMjRGV2ZWxvcG1lbnQgS2V5IFJvb3QgQXR0ZXN0YXRpb24gQ0EwWTATBgcq
        hkjOPQIBBggqhkjOPQMBBwNCAARmwyDgOXQFrZ2skXbbpxaMJZOfFS/XCzX6/w/o
        2ehGiVJUldUrx3aFu3uNgYK5cvsEtuMuHBBF1YjoI9+VIDHmo2MwYTAOBgNVHQ8B
        Af8EBAMCAgQwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUTUtyG5G4zhLckuLG
        l4ZYpVU/tdAwHwYDVR0jBBgwFoAUTUtyG5G4zhLckuLGl4ZYpVU/tdAwCgYIKoZI
        zj0EAwIDSQAwRgIhANFoADf7aIVxCAuMWircdhIXOvrCxyVQWKQ03t61Xb9eAiEA
        0r4tpcT9j0dRiWyG++lHv69cFdeZktl9cSSU/7BuLUg=
    """

    private val unknown = """
        MIICQDCCAeWgAwIBAgIUDUdzOsUDX3qitjKOCQutmVIu7EUwCgYIKoZIzj0EAwIw
        aTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFDASBgNVBAcMC0xv
        cyBBbmdlbGVzMREwDwYDVQQKDAhTbmFwIEluYzEcMBoGA1UEAwwTUm9vdCBBdHRl
        c3RhdGlvbiBDQTAeFw0yMDA2MTkyMDE3MTJaFw0zMDA4MTYyMDE3MTJaMHExCzAJ
        BgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRQwEgYDVQQHDAtMb3MgQW5n
        ZWxlczERMA8GA1UECgwIU25hcCBJbmMxJDAiBgNVBAMMG0ludGVybWVkaWF0ZSBB
        dHRlc3RhdGlvbiBDQTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABL82AinnTMqS
        7L4anprSwYHqUrFPXJcaxvWwpEChQxM02VN5ZDl517nHmVDLKgeei7Jqq2Qdjxm+
        7EXu3nOIxBOjYzBhMA4GA1UdDwEB/wQEAwICBDAPBgNVHRMBAf8EBTADAQH/MB0G
        A1UdDgQWBBSCXHMFtVznR04QVxFKhrfBSy2+tDAfBgNVHSMEGDAWgBRQl9EMGRCr
        buzDV579yGeQoXBbtTAKBggqhkjOPQQDAgNJADBGAiEAtF/sY3SB5Hp2Oci3oH9x
        GZmofkYoLu2MElts+DuZv+ECIQCMWmk4VkHDXFL7WnJch9uuY/SQSwb7c8VVvnxT
        Xvkedw==
    """

    @Test
    fun `resolveDeviceType(), Spectacles`() {
        assertEquals(
            SpectaclesStreamTrustManager.DeviceType.SPECTACLES,
            DeviceTypeIdentifier.resolveDeviceType(loadCertificate(spectacles))
        )
    }

    @Test
    fun `resolveDeviceType(), Spectacles unfused`() {
        assertEquals(
            SpectaclesStreamTrustManager.DeviceType.SPECTACLES_UNFUSED,
            DeviceTypeIdentifier.resolveDeviceType(loadCertificate(spectaclesUnfused))
        )
    }

    @Test
    fun `resolveDeviceType(), android`() {
        assertEquals(
            SpectaclesStreamTrustManager.DeviceType.ANDROID,
            DeviceTypeIdentifier.resolveDeviceType(loadCertificate(android))
        )
    }

    @Test
    fun `resolveDeviceType(), unknown`() {
        assertEquals(
            SpectaclesStreamTrustManager.DeviceType.UNKNOWN,
            DeviceTypeIdentifier.resolveDeviceType(loadCertificate(unknown))
        )
    }

    private fun loadCertificate(str: String): Certificate {
        return ByteArrayInputStream(
            "-----BEGIN CERTIFICATE-----\n$str\n-----END CERTIFICATE-----".toByteArray(Charsets.UTF_8)
        ).use { certInputStream ->
            CertificateFactory.getInstance("X.509")
                .generateCertificate(certInputStream)
        }
    }
}
