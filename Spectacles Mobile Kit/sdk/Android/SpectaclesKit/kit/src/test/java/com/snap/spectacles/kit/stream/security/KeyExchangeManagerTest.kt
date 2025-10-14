package com.snap.spectacles.kit.stream.security

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import java.security.KeyFactory
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.PrivateKey
import java.security.PublicKey
import javax.crypto.KeyAgreement

@RunWith(JUnit4::class)
class KeyExchangeManagerTest : KitBaseTest() {

    private val sharedSecret = ByteArray(16)
    private val keyAgreement = mock<KeyAgreement> {
        on { generateSecret() } doReturn sharedSecret
    }
    private val getKeyAgreement = mock<(String) -> KeyAgreement> {
        on { invoke(any()) } doReturn keyAgreement
    }

    private val encodedKey = ByteArray(8)
    private val publicKey = mock<PublicKey> {
        on { encoded } doReturn encodedKey
    }
    private val privateKey = mock<PrivateKey>()
    private val keyPair = mock<KeyPair> {
        on { public } doReturn publicKey
        on { private } doReturn privateKey
    }
    private val keyPairGenerator = mock<KeyPairGenerator> {
        on { generateKeyPair() } doReturn keyPair
    }
    private val getKeyPairGenerator = mock<(String) -> KeyPairGenerator> {
        on { invoke(any()) } doReturn keyPairGenerator
    }

    private val peerKey = mock<PublicKey>()
    private val keyFactory = mock<KeyFactory> {
        on { generatePublic(any()) } doReturn peerKey
    }
    private val getKeyFactory = mock<(String) -> KeyFactory> {
        on { invoke(any()) } doReturn keyFactory
    }

    private val subject = KeyExchangeManager.Default(
        "agr-alg", "key-alg", 16, getKeyAgreement, getKeyPairGenerator, getKeyFactory
    )

    @Test
    fun `Default, initiateKeyExchange()`() {
        assertEquals(encodedKey, subject.initiateKeyExchange())
        verify(getKeyPairGenerator).invoke("key-alg")
        verify(keyPairGenerator).initialize(16)
        verify(keyPairGenerator).generateKeyPair()
    }

    @Test
    fun `Default, completeKeyExchange()`() {
        subject.initiateKeyExchange()

        subject.completeKeyExchange(ByteArray(2))

        verify(getKeyFactory).invoke("key-alg")
        verify(keyFactory).generatePublic(any())

        verify(getKeyAgreement).invoke("agr-alg")
        verify(keyAgreement).init(privateKey)
        verify(keyAgreement).doPhase(peerKey, true)
        verify(keyAgreement).generateSecret()
    }

    @Test
    fun `Default, getSharedSecret()`() {
        assertEquals(encodedKey, subject.initiateKeyExchange())
        subject.completeKeyExchange(ByteArray(2))

        assertEquals(sharedSecret, subject.getSharedSecret())
    }

    @Test
    fun `Default, constructor()`() {
        KeyExchangeManager.Default("", "", 12)
    }

    @Test
    fun `Noop, all`() {
        val noop = KeyExchangeManager.Noop

        assertTrue(noop.initiateKeyExchange().contentEquals(ByteArray(0)))
        noop.completeKeyExchange(ByteArray(0))
        assertTrue(noop.getSharedSecret().contentEquals(ByteArray(0)))
    }
}
