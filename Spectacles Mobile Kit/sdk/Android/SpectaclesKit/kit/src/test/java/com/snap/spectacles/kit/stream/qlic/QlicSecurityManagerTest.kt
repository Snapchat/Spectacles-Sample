package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.security.AndroidAuthenticationManager
import com.snap.spectacles.kit.stream.security.AuthenticationManager
import com.snap.spectacles.kit.stream.security.EncryptionManager
import com.snap.spectacles.kit.stream.security.KeyExchangeManager
import com.snap.spectacles.kit.stream.security.KeyManager
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import java.security.SecureRandom

@RunWith(JUnit4::class)
class QlicSecurityManagerTest : KitBaseTest() {

    private val authenticationManagerFactory = mock<AndroidAuthenticationManager.Factory> {
        on { create(any(), any(), any()) } doReturn mock()
    }

    private val trustManager = mock<SpectaclesStreamTrustManager>()

    private val keyManager = mock<KeyManager>()

    private val secureRandom = mock<SecureRandom>()

    private val factory = QlicSecurityManager.Factory().also {
        it.authenticationManagerFactory = authenticationManagerFactory
    }

    @Test
    fun `Factory create(), allowedNewAttestation, noHandshake`() {
        val manager = factory.create(
            true, trustManager, keyManager, true, false, secureRandom
        )
        verify(authenticationManagerFactory).create(trustManager, keyManager, false)
        assertEquals(false, manager.noHandshake)
        assertEquals(secureRandom, manager.secureRandom)
        manager.authenticationManager
        manager.encryptionManager
        manager.transcriptHashManager
        manager.keyExchangeManager
    }

    @Test
    fun `Factory create(), allowedNewAttestation, secureMode`() {
        val manager = factory.create(
            true, trustManager, keyManager, true, true, secureRandom
        )
        verify(authenticationManagerFactory).create(trustManager, keyManager, false)
        assertEquals(true, manager.noHandshake)
        assertEquals(secureRandom, manager.secureRandom)
        manager.authenticationManager
        manager.encryptionManager
        manager.transcriptHashManager
        manager.keyExchangeManager
    }

    @Test
    fun `Factory create(), disallowedNewAttestation, noHandshake`() {
        val manager = factory.create(
            true, trustManager, keyManager, false, false, secureRandom
        )
        verify(authenticationManagerFactory).create(trustManager, keyManager, true)
        assertEquals(false, manager.noHandshake)
        assertEquals(secureRandom, manager.secureRandom)
        manager.authenticationManager
        manager.encryptionManager
        manager.transcriptHashManager
        manager.keyExchangeManager
    }

    @Test
    fun `Factory create(), disallowedNewAttestation, secureMode`() {
        val manager = factory.create(
            true, trustManager, keyManager, false, true, secureRandom
        )
        verify(authenticationManagerFactory).create(trustManager, keyManager, true)
        assertEquals(true, manager.noHandshake)
        assertEquals(secureRandom, manager.secureRandom)
        manager.authenticationManager
        manager.encryptionManager
        manager.transcriptHashManager
        manager.keyExchangeManager
    }

    @Test
    fun `PseudoFactory create(), noHandshake`() {
        val manager = QlicSecurityManager.PseudoFactory.create(
            true, trustManager, keyManager, false, false, secureRandom
        )
        assertEquals(false, manager.noHandshake)
        assertEquals(secureRandom, manager.secureRandom)
        assertEquals(AuthenticationManager.Noop, manager.authenticationManager)
        assertEquals(EncryptionManager.Noop, manager.encryptionManager)
        assertEquals(KeyExchangeManager.Noop, manager.keyExchangeManager)
    }

    @Test
    fun `PseudoFactory create(), secureMode`() {
        val manager = QlicSecurityManager.PseudoFactory.create(
            true, trustManager, keyManager, false, true, secureRandom
        )
        assertEquals(true, manager.noHandshake)
        assertEquals(secureRandom, manager.secureRandom)
        assertEquals(AuthenticationManager.Noop, manager.authenticationManager)
        assertEquals(EncryptionManager.Noop, manager.encryptionManager)
        assertEquals(KeyExchangeManager.Noop, manager.keyExchangeManager)
    }
}
