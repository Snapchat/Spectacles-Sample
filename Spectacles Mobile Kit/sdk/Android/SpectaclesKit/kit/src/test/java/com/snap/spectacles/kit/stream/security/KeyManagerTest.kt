package com.snap.spectacles.kit.stream.security

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argThat
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.KeyStore.PrivateKeyEntry
import java.security.PrivateKey
import java.security.Signature
import java.security.cert.Certificate
import java.security.spec.ECGenParameterSpec

@RunWith(JUnit4::class)
class KeyManagerTest : KitBaseTest() {

    private val keyStore = mock<KeyStore> {}
    private val getKeyStore = mock<(String) -> KeyStore> {
        on { invoke(any()) } doReturn keyStore
    }

    private val keyPairGenerator = mock<KeyPairGenerator> {}
    private val getKeyPairGenerator = mock<(String, String) -> KeyPairGenerator> {
        on { invoke(any(), any()) } doReturn keyPairGenerator
    }

    private val signature = mock<Signature> {
        on { sign() } doReturn byteArrayOf(1, 1)
        on { verify(any()) } doReturn true
    }
    private val getSignature = mock<(String) -> Signature> {
        on { invoke(any()) } doReturn signature
    }

    private val keyGenParameterSpec = mock<KeyGenParameterSpec>()
    private val keyGenParameterSpecBuilder = mock<KeyGenParameterSpec.Builder> {
        on { setDigests(any()) } doReturn mock
        on { setAlgorithmParameterSpec(any()) } doReturn mock
        on { setAttestationChallenge(any()) } doReturn mock
        on { build() } doReturn keyGenParameterSpec
    }
    private val getKeyGenParameterSpec = mock<(String, Int) -> KeyGenParameterSpec.Builder> {
        on { invoke(any(), any()) } doReturn keyGenParameterSpecBuilder
    }

    private val subject = KeyManager.Default(
        "authenticationId",
        getKeyStore,
        getKeyPairGenerator,
        getKeyGenParameterSpec,
        getSignature
    )

    @Test
    fun `updateLocalCertificate()`() {
        val challenge = ByteArray(11)
        subject.updateLocalCertificate(challenge)

        verify(keyGenParameterSpecBuilder).setAlgorithmParameterSpec(
            argThat<ECGenParameterSpec> { name == "secp384r1" }
        )
        verify(keyGenParameterSpecBuilder).setDigests(KeyProperties.DIGEST_SHA384)
        verify(keyGenParameterSpecBuilder).setAttestationChallenge(challenge)
        verify(getKeyPairGenerator).invoke(KeyProperties.KEY_ALGORITHM_EC, "AndroidKeyStore")

        verify(getKeyGenParameterSpec).invoke("authenticationId_local", KeyProperties.PURPOSE_SIGN)
        verify(keyPairGenerator).initialize(keyGenParameterSpec)
        verify(keyPairGenerator).generateKeyPair()
    }

    @Test
    fun `getLocalCertificateChain(), empty`() {
        assertNull(subject.getLocalCertificateChain())
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).getEntry("authenticationId_local", null)
    }

    @Test
    fun `getLocalCertificateChain(), exist`() {
        val chain = arrayOf<Certificate>(mock(), mock())
        val entry = mock<PrivateKeyEntry> {
            on { certificateChain } doReturn chain
        }
        whenever(keyStore.getEntry(any(), anyOrNull())).thenReturn(entry)

        val result = subject.getLocalCertificateChain()
        assertEquals(2, result!!.size)
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).getEntry("authenticationId_local", null)
    }

    @Test
    fun `getLocalSignature()`() {
        val key = mock<PrivateKey>()
        val entry = mock<PrivateKeyEntry> {
            on { privateKey } doReturn key
        }
        whenever(keyStore.getEntry(any(), anyOrNull())).thenReturn(entry)

        assertEquals(signature, subject.getLocalSignature())
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).getEntry("authenticationId_local", null)
        verify(getSignature).invoke("SHA384withECDSA")
        verify(signature).initSign(key)
    }

    @Test
    fun `updatePeerCertificate()`() {
        val certificate = mock<Certificate>()
        subject.updatePeerCertificate(certificate, mock())

        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).setCertificateEntry("authenticationId_remote", certificate)
    }

    @Test
    fun `getPeerCertificate(), empty`() {
        assertNull(subject.getPeerCertificate())
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).getCertificate("authenticationId_remote")
    }

    @Test
    fun `getPeerCertificate(), exist`() {
        val certificate = mock<Certificate>()
        whenever(keyStore.getCertificate(any())).thenReturn(certificate)

        assertEquals(certificate, subject.getPeerCertificate())
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).getCertificate("authenticationId_remote")
    }

    @Test
    fun `getPeerSignature()`() {
        val certificate = mock<Certificate>()
        whenever(keyStore.getCertificate(any())).thenReturn(certificate)

        assertEquals(signature, subject.getPeerSignature())
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).getCertificate("authenticationId_remote")
        verify(getSignature).invoke("SHA384withECDSA")
        verify(signature).initVerify(certificate)
    }

    @Test
    fun `clearCertificates(), local`() {
        whenever(keyStore.containsAlias("authenticationId_local")).thenReturn(true)

        subject.clearCertificates()
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).deleteEntry("authenticationId_local")
        verify(keyStore, never()).deleteEntry("authenticationId_remote")
    }

    @Test
    fun `clearCertificates(), remote`() {
        whenever(keyStore.containsAlias("authenticationId_remote")).thenReturn(true)

        subject.clearCertificates()
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).deleteEntry("authenticationId_remote")
        verify(keyStore, never()).deleteEntry("authenticationId_local")
    }

    @Test
    fun `clearCertificates(), all`() {
        whenever(keyStore.containsAlias(any())).thenReturn(true)

        subject.clearCertificates()
        verify(getKeyStore).invoke("AndroidKeyStore")
        verify(keyStore).load(null)
        verify(keyStore).deleteEntry("authenticationId_remote")
        verify(keyStore).deleteEntry("authenticationId_local")
    }

    @Test
    fun `constructor(), default`() {
        KeyManager.Default("123")
    }
}
