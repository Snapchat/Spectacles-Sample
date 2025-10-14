package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.security.PublicKey
import java.security.Signature
import java.security.cert.Certificate
import java.security.cert.X509Certificate

@RunWith(JUnit4::class)
class AndroidAuthenticationManagerTest : KitBaseTest() {

    private val trustManager = mock<SpectaclesStreamTrustManager> {}

    private val keyManager = mock<KeyManager>()

    private val securityAttributes = mock<SpectaclesStreamTrustManager.SecurityAttributes>()
    private val certificate = mock<Certificate>()
    private val extractAttestation = mock<(AuthenticationManager.Attestation, ByteArray) -> Attestation> {
        on { invoke(any(), any()) } doReturn (securityAttributes to certificate)
    }

    private val subject = AndroidAuthenticationManager(
        trustManager,
        keyManager,
        listOf(AuthenticationManager.Attestation.CertificateChain::class),
        listOf(AuthenticationManager.Attestation.CertificateChain::class),
        extractAttestation,
    )

    @Test
    fun `getSupportedLocalAttestationAlgorithms()`() {
        val algorithms = subject.getSupportedLocalAttestationAlgorithms()
        assertTrue(algorithms.contains(AuthenticationManager.Attestation.CertificateChain::class))
    }

    @Test
    fun `getSupportedRemoteAttestationAlgorithms()`() {
        val algorithms = subject.getSupportedRemoteAttestationAlgorithms()
        assertTrue(algorithms.contains(AuthenticationManager.Attestation.CertificateChain::class))
    }

    @Test
    fun `getLocalIdentity(), empty`() {
        whenever(keyManager.getLocalCertificateChain()).thenReturn(null)

        assertTrue(subject.getLocalIdentity().contentEquals(ByteArray(0)))
        verify(keyManager).getLocalCertificateChain()
    }

    @Test
    fun `getLocalIdentity(), exist`() {
        val encoded = ByteArray(2)
        val publicKey = mock<PublicKey> { on { getEncoded() } doReturn encoded }
        val certificate = mock<Certificate> { on { getPublicKey() } doReturn publicKey }
        val chain = listOf(certificate, mock())
        whenever(keyManager.getLocalCertificateChain()).thenReturn(chain)
        val subject = AndroidAuthenticationManager(
            trustManager,
            keyManager,
            listOf(AuthenticationManager.Attestation.CertificateChain::class),
            listOf(AuthenticationManager.Attestation.CertificateChain::class),
            extractAttestation
        )
        assertEquals(encoded, subject.getLocalIdentity())
    }

    @Test
    fun `getRemoteIdentity(), empty`() {
        whenever(keyManager.getPeerCertificate()).thenReturn(null)

        assertTrue(subject.getRemoteIdentity().contentEquals(ByteArray(0)))
        verify(keyManager).getPeerCertificate()
    }

    @Test
    fun `getRemoteIdentity(), exist`() {
        val encoded = ByteArray(2)
        val publicKey = mock<PublicKey> { on { getEncoded() } doReturn encoded }
        val certificate = mock<Certificate> { on { getPublicKey() } doReturn publicKey }
        whenever(keyManager.getPeerCertificate()).thenReturn(certificate)
        assertEquals(encoded, subject.getRemoteIdentity())
    }

    @Test
    fun `signWithLocalIdentity()`() {
        val output = byteArrayOf(1, 1)
        val signature = mock<Signature> {
            on { sign() } doReturn output
        }
        whenever(keyManager.getLocalSignature()).thenReturn(signature)

        val content = byteArrayOf(2)
        assertEquals(output, subject.signWithLocalIdentity(content))
        verify(signature).update(content)
        verify(signature).sign()
    }

    @Test
    fun `verifyWithRemoteIdentity()`() {
        val signature = mock<Signature> {
            on { verify(any()) } doReturn true
        }
        whenever(keyManager.getPeerSignature()).thenReturn(signature)

        val content = byteArrayOf(2)
        val signing = byteArrayOf(3, 2)
        assertTrue(subject.verifyWithRemoteIdentity(content, signing))
        verify(signature).update(content)
        verify(signature).verify(signing)
    }

    @Test
    fun `generateLocalIdentityAttestation()`() {
        val cert1 = mock<Certificate>()
        val cert2 = mock<Certificate>()
        val certificateChain = listOf(cert1, cert2)
        whenever(keyManager.getLocalCertificateChain()).thenReturn(certificateChain)

        val challenge = ByteArray(11)
        val result = subject.generateLocalIdentityAttestation(
            AuthenticationManager.Attestation.CertificateChain::class, challenge
        )

        verify(keyManager).updateLocalCertificate(challenge)
        verify(keyManager).getLocalCertificateChain()
        assertEquals(2, (result).chain.size)
        assertEquals(cert1, result.chain[0])
        assertEquals(cert2, result.chain[1])
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `generateLocalIdentityAttestation(), unsupported`() {
        val challenge = ByteArray(11)
        subject.generateLocalIdentityAttestation(
            AuthenticationManager.Attestation.IosSpecific::class, challenge
        )
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `validateRemoteIdentityAttestation(), unsupported`() {
        val challenge = ByteArray(11)
        val attestation = mock<AuthenticationManager.Attestation.IosSpecific>()
        subject.validateRemoteIdentityAttestation(challenge, attestation)
    }

    @Test
    fun `validateRemoteIdentityAttestation()`() {
        val challenge = ByteArray(11)
        val cert1 = mock<X509Certificate>()
        val cert2 = mock<X509Certificate>()
        val chain = listOf(cert1, cert2)
        val attestation = AuthenticationManager.Attestation.CertificateChain(chain)
        subject.validateRemoteIdentityAttestation(challenge, attestation)

        verify(extractAttestation).invoke(attestation, challenge)
        verify(trustManager).validatePeerTrust(securityAttributes)
        verify(keyManager).updatePeerCertificate(certificate, attestation)
    }

    @Test
    fun `Factory, create(), verifyOnly = true`() {
        val subject = AndroidAuthenticationManager.Factory.create(
            trustManager, keyManager, true
        )
        assertTrue(subject.getSupportedLocalAttestationAlgorithms().isEmpty())
        assertTrue(subject.getSupportedRemoteAttestationAlgorithms().isEmpty())
    }

    @Test
    fun `Factory, create(), verifyOnly = false`() {
        val subject = AndroidAuthenticationManager.Factory.create(
            trustManager, keyManager, false
        )
        assertTrue(subject.getSupportedLocalAttestationAlgorithms().isNotEmpty())
        assertTrue(subject.getSupportedRemoteAttestationAlgorithms().isNotEmpty())
    }
}
