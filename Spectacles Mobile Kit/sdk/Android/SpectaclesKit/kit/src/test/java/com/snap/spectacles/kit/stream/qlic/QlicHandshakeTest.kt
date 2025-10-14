package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.utils.getVarintSize
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.security.cert.Certificate
import java.security.cert.CertificateFactory

@RunWith(JUnit4::class)
class QlicHandshakeTest : KitBaseTest() {

    private val cert1 = """
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

    private val cert2 = """
        MIICYzCCAgqgAwIBAgIUPS++wn7scpTPE7gC9iVaf7uEba0wCgYIKoZIzj0EAwIw
        ezELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFTATBgNVBAcMDFNh
        bnRhIE1vbmljYTESMBAGA1UEChMJU25hcCBJbmMuMSwwKgYDVQQDEyNEZXZlbG9w
        bWVudCBLZXkgUm9vdCBBdHRlc3RhdGlvbiBDQTAeFw0yMzA5MjYxMzQ0NDVaFw0z
        ODExMjExMzQ0NDVaMIGDMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5p
        YTEVMBMGA1UEBwwMU2FudGEgTW9uaWNhMRIwEAYDVQQKEwlTbmFwIEluYy4xNDAy
        BgNVBAMTK0RldmVsb3BtZW50IEtleSBJbnRlcm1lZGlhdGUgQXR0ZXN0YXRpb24g
        Q0EwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASyUbLikXHoiJ1aKC8bb8q1Qaz6
        P6UCyTMQbo/sFiqEkVLMRrfVduA5tlfmsQvdJDYBUtvCDC1Lu/f0L0w9IXqlo2Mw
        YTAOBgNVHQ8BAf8EBAMCAgQwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU57sf
        E7t7jnVSW2KqTFxh/Blu5RMwHwYDVR0jBBgwFoAUTUtyG5G4zhLckuLGl4ZYpVU/
        tdAwCgYIKoZIzj0EAwIDRwAwRAIgP9ZFqWJIEXM3CWk3kTIItn/477Rtb3xpDi3q
        W7yWHdMCIG/5UMwHc64ae66wCptT6RmNb8UHw6t7LLIU2TXBq6dN
    """

    @Test
    fun `QlicHandShake, deserialize(), null`() {
        val frame = ByteArrayInputStream(byteArrayOf(5, 2, 3, 1))
        assertNull(QlicHandshake.deserialize(frame))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ClientHello, deserialize(), missing clientNonce`() {
        val frame = ByteArrayInputStream(byteArrayOf())
        QlicHandshake.ClientHello.deserialize(frame)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ClientHello, deserialize(), missing clientSessionKey`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 0))
        QlicHandshake.ClientHello.deserialize(frame)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ClientHello, deserialize(), missing clientIdentities count`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 0, 0))
        QlicHandshake.ClientHello.deserialize(frame)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ClientHello, deserialize(), missing clientIdentities`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 0, 0, 1))
        QlicHandshake.ClientHello.deserialize(frame)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ClientHello, deserialize(), missing serverIdentities count`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 0, 0, 1, 1, 2, 3, 3))
        QlicHandshake.ClientHello.deserialize(frame)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ClientHello, deserialize(), missing serverIdentities`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 0, 0, 1, 1, 2, 3, 3, 2))
        QlicHandshake.ClientHello.deserialize(frame)
    }

    @Test
    fun `ClientHello, deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 0, 0, 1, 1, 2, 3, 3, 2, 1, 0, 1, 1, 5))
        val message = QlicHandshake.ClientHello.deserialize(frame)
        assertTrue(message.clientNonce.contentEquals(byteArrayOf(0)))
        assertTrue(message.clientSessionKey.isEmpty())
        assertEquals(1, message.clientAuthAlgorithms.size)
        assertTrue(
            (message.clientAuthAlgorithms.first() as QlicHandshake.AuthAlgorithm.PreTrusted).publicKey
                .contentEquals(byteArrayOf(3, 3))
        )
        assertEquals(2, message.serverAuthAlgorithms.size)
        assertTrue(
            (message.serverAuthAlgorithms.first() as QlicHandshake.AuthAlgorithm.PreTrusted).publicKey
                .isEmpty()
        )
        assertTrue(
            (message.serverAuthAlgorithms.last() as QlicHandshake.AuthAlgorithm.PreTrusted).publicKey
                .contentEquals(byteArrayOf(5))
        )
    }

    @Test
    fun `ClientHello, QlicHandShake_deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 1, 0, 0, 1, 1, 2, 3, 3, 2, 1, 0, 1, 1, 5))
        val message = QlicHandshake.deserialize(frame)
        assertTrue(message is QlicHandshake.ClientHello)
    }

    @Test
    fun `ClientHello, serialize()`() {
        val message = QlicHandshake.ClientHello(
            byteArrayOf(8, 0),
            byteArrayOf(1),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(2))),
            listOf(QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 1)))
        )
        val frame = ByteArrayOutputStream().use {
            message.serialize(it)
            it.toByteArray()
        }
        assertTrue(frame.contentEquals(byteArrayOf(1, 2, 8, 0, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ServerHello, deserialize(), missing serverNonce`() {
        val frame = ByteArrayInputStream(byteArrayOf())
        QlicHandshake.ServerHello.deserialize(frame)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `ServerHello, deserialize(), missing serverSessionKey`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 0))
        QlicHandshake.ServerHello.deserialize(frame)
    }

    @Test
    fun `ServerHello, deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 2, 3, 0, 1, 2))
        val message = QlicHandshake.ServerHello.deserialize(frame)
        assertTrue(message.serverNonce.contentEquals(byteArrayOf(2)))
        assertTrue(message.serverSessionKey.contentEquals(byteArrayOf(0, 1, 2)))
    }

    @Test
    fun `ServerHello, QlicHandShake_deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(2, 1, 2, 3, 0, 1, 2))
        val message = QlicHandshake.deserialize(frame)
        assertTrue(message is QlicHandshake.ServerHello)
    }

    @Test
    fun `ServerHello, serialize()`() {
        val message = QlicHandshake.ServerHello(byteArrayOf(8, 0), byteArrayOf())
        val frame = ByteArrayOutputStream().use {
            message.serialize(it)
            it.toByteArray()
        }
        assertTrue(frame.contentEquals(byteArrayOf(2, 2, 8, 0, 0)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthRequest, deserialize(), missing validClientIdentity`() {
        val frame = ByteArrayInputStream(byteArrayOf())
        QlicHandshake.AuthRequest.deserialize(frame)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthRequest, deserialize(), missing validServerIdentity`() {
        val frame = ByteArrayInputStream(byteArrayOf(0))
        QlicHandshake.AuthRequest.deserialize(frame)
    }

    @Test
    fun `AuthRequest, deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(1, 2))
        val message = QlicHandshake.AuthRequest.deserialize(frame)
        assertEquals(1, message.chosenClientAlgorithm)
        assertEquals(2, message.chosenServerAlgorithm)
    }

    @Test
    fun `AuthRequest, QlicHandShake_deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(13, 1, 2))
        val message = QlicHandshake.deserialize(frame)
        assertTrue(message is QlicHandshake.AuthRequest)
    }

    @Test
    fun `AuthRequest, serialize()`() {
        val message = QlicHandshake.AuthRequest(7, 0)
        val frame = ByteArrayOutputStream().use {
            message.serialize(it)
            it.toByteArray()
        }
        assertTrue(frame.contentEquals(byteArrayOf(13, 7, 0)))
    }

    @Test
    fun `AuthAttestation, all`() {
        val c1 = loadCertificate(cert1)
        val c2 = loadCertificate(cert2)
        val message = QlicHandshake.AuthShare(
            QlicHandshake.AuthAttestation.CertificateChain(listOf(c1, c2))
        )

        val frame = ByteArrayOutputStream().use {
            message.serialize(it)
            it.toByteArray()
        }

        val gen = ByteArrayInputStream(frame).use {
            it.read()
            QlicHandshake.AuthShare.deserialize(it)
        }
        assertEquals(2, (gen.attestation as QlicHandshake.AuthAttestation.CertificateChain).chain.size)
        assertEquals(c1, gen.attestation.chain.first())
        assertEquals(c2, gen.attestation.chain.last())

        val gen2 = ByteArrayInputStream(frame).use {
            QlicHandshake.deserialize(it)
        }
        assertTrue(gen2 is QlicHandshake.AuthShare)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthVerification, deserialize(), missing signature`() {
        val frame = ByteArrayInputStream(byteArrayOf())
        QlicHandshake.AuthVerify.deserialize(frame)
    }

    @Test
    fun `AuthVerification, deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(2, 3, 1))
        val message = QlicHandshake.AuthVerify.deserialize(frame)
        assertTrue(message.signature.contentEquals(byteArrayOf(3, 1)))
    }

    @Test
    fun `AuthVerification, QlicHandShake_deserialize()`() {
        val frame = ByteArrayInputStream(byteArrayOf(15, 2, 3, 1))
        val message = QlicHandshake.deserialize(frame)
        assertTrue(message is QlicHandshake.AuthVerify)
    }

    @Test
    fun `AuthVerification, serialize()`() {
        val message = QlicHandshake.AuthVerify(byteArrayOf(1))
        val frame = ByteArrayOutputStream().use {
            message.serialize(it)
            it.toByteArray()
        }
        assertTrue(frame.contentEquals(byteArrayOf(15, 1, 1)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAlgorithm, deserialize(), unsupported type`() {
        QlicHandshake.AuthAlgorithm.deserialize(ByteArrayInputStream(byteArrayOf(5, 0)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAlgorithm, deserialize(), missing publicKey`() {
        QlicHandshake.AuthAlgorithm.deserialize(ByteArrayInputStream(byteArrayOf(1)))
    }

    @Test
    fun `AuthAlgorithm, PreTrusted, deserialize()`() {
        val message = QlicHandshake.AuthAlgorithm.deserialize(ByteArrayInputStream(byteArrayOf(1, 2, 0, 0)))
        assertTrue((message as QlicHandshake.AuthAlgorithm.PreTrusted).publicKey.contentEquals(byteArrayOf(0, 0)))
    }

    @Test
    fun `AuthAlgorithm, PreTrusted, serialize()`() {
        val message = QlicHandshake.AuthAlgorithm.PreTrusted(byteArrayOf(1, 2))
        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()
        assertTrue(bytes.contentEquals(byteArrayOf(1, 2, 1, 2)))
    }

    @Test
    fun `AuthAlgorithm, IosSpecific, deserialize()`() {
        val message = QlicHandshake.AuthAlgorithm.deserialize(ByteArrayInputStream(byteArrayOf(2, 0)))
        assertEquals(QlicHandshake.AuthAlgorithm.IosSpecific, message)
    }

    @Test
    fun `AuthAlgorithm, IosSpecific, serialize()`() {
        val message = QlicHandshake.AuthAlgorithm.IosSpecific
        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()
        assertTrue(bytes.contentEquals(byteArrayOf(2, 0)))
    }

    @Test
    fun `AuthAlgorithm, AndroidSpecific, deserialize()`() {
        val message = QlicHandshake.AuthAlgorithm.deserialize(ByteArrayInputStream(byteArrayOf(3, 0)))
        assertEquals(QlicHandshake.AuthAlgorithm.AndroidSpecific, message)
    }

    @Test
    fun `AuthAlgorithm, AndroidSpecific, serialize()`() {
        val message = QlicHandshake.AuthAlgorithm.AndroidSpecific
        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()
        assertTrue(bytes.contentEquals(byteArrayOf(3, 0)))
    }

    @Test
    fun `AuthAlgorithm, CertificateChain, deserialize()`() {
        val message = QlicHandshake.AuthAlgorithm.deserialize(ByteArrayInputStream(byteArrayOf(4, 0)))
        assertEquals(QlicHandshake.AuthAlgorithm.CertificateChain, message)
    }

    @Test
    fun `AuthAlgorithm, CertificateChain, serialize()`() {
        val message = QlicHandshake.AuthAlgorithm.CertificateChain
        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()
        assertTrue(bytes.contentEquals(byteArrayOf(4, 0)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAttestation, deserialize(), unsupported type`() {
        QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(20)))
    }

    @Test
    fun `AuthAttestation, PreTrusted, deserialize()`() {
        val message = QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(1)))
        assertEquals(QlicHandshake.AuthAttestation.PreTrusted, message)
    }

    @Test
    fun `AuthAttestation, PreTrusted, serialize()`() {
        val message = QlicHandshake.AuthAttestation.PreTrusted
        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()
        assertTrue(bytes.contentEquals(byteArrayOf(1)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAttestation, IosSpecific, deserialize(), missing publicKey`() {
        QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(2)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAttestation, IosSpecific, deserialize(), missing attestation`() {
        QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(2, 1, 1)))
    }

    @Test
    fun `AuthAttestation, IosSpecific, deserialize()`() {
        val message = QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(2, 1, 1, 1, 2)))
        assertTrue((message as QlicHandshake.AuthAttestation.IosSpecific).publicKey.contentEquals(byteArrayOf(1)))
        assertTrue(message.attestation.contentEquals(byteArrayOf(2)))
    }

    @Test
    fun `AuthAttestation, IosSpecific, serialize()`() {
        val message = QlicHandshake.AuthAttestation.IosSpecific(byteArrayOf(0), byteArrayOf(1, 1))
        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()

        assertTrue(bytes.contentEquals(byteArrayOf(2, 1, 0, 2, 1, 1)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAttestation, AndroidSpecific, deserialize(), missing chain`() {
        QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(3)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAttestation, AndroidSpecific, deserialize(), missing cert`() {
        QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(3, 2)))
    }

    @Test
    fun `AuthAttestation, AndroidSpecific, deserialize(), empty`() {
        val message = QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(3, 0)))
        assertEquals(0, (message as QlicHandshake.AuthAttestation.AndroidSpecific).chain.size)
    }

    @Test
    fun `AuthAttestation, AndroidSpecific, serialize()`() {
        val c1 = loadCertificate(cert1)
        val c2 = loadCertificate(cert2)
        val expectedSize = 1 + 1 + c1.encoded.size.getVarintSize() + c1.encoded.size +
                c2.encoded.size.getVarintSize() + c2.encoded.size
        val message = QlicHandshake.AuthAttestation.AndroidSpecific(listOf(c1, c2))

        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()
        assertEquals(expectedSize, bytes.size)

        val gen = QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(bytes))
        assertEquals(2, (gen as QlicHandshake.AuthAttestation.AndroidSpecific).chain.size)
        assertEquals(c1, gen.chain.first())
        assertEquals(c2, gen.chain.last())
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAttestation, CertificateChain, deserialize(), missing chain`() {
        QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(4)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `AuthAttestation, CertificateChain, deserialize(), missing cert`() {
        QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(4, 2)))
    }

    @Test
    fun `AuthAttestation, CertificateChain, deserialize(), empty`() {
        val message = QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(byteArrayOf(4, 0)))
        assertEquals(0, (message as QlicHandshake.AuthAttestation.CertificateChain).chain.size)
    }

    @Test
    fun `AuthAttestation, CertificateChain, serialize()`() {
        val c1 = loadCertificate(cert1)
        val c2 = loadCertificate(cert2)
        val expectedSize = 1 + 1 + c1.encoded.size.getVarintSize() + c1.encoded.size +
                c2.encoded.size.getVarintSize() + c2.encoded.size
        val message = QlicHandshake.AuthAttestation.CertificateChain(listOf(c1, c2))

        val output = ByteArrayOutputStream()
        message.serialize(output)
        val bytes = output.toByteArray()
        assertEquals(expectedSize, bytes.size)

        val gen = QlicHandshake.AuthAttestation.deserialize(ByteArrayInputStream(bytes))
        assertEquals(2, (gen as QlicHandshake.AuthAttestation.CertificateChain).chain.size)
        assertEquals(c1, gen.chain.first())
        assertEquals(c2, gen.chain.last())
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
