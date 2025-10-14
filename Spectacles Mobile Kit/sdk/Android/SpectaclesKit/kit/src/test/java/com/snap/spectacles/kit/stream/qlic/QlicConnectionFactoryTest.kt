package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamRoute
import com.snap.spectacles.kit.stream.SpectaclesStreamTrustManager
import com.snap.spectacles.kit.stream.security.EncryptionManager
import com.snap.spectacles.kit.stream.security.KeyManager
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.security.SecureRandom

@RunWith(JUnit4::class)
class QlicConnectionFactoryTest : KitBaseTest() {

    private val connection = mock<QlicConnection>()
    private val connectionFactory = mock<QlicConnection.Factory> {
        on { create(any(), any(), any()) } doReturn connection
    }

    private val encryptionManager = mock<EncryptionManager>()
    private val securityManager = mock<QlicSecurityManager> {
        on { encryptionManager } doReturn encryptionManager
    }
    private val securityManagerFactory = mock<QlicSecurityManager.Factory> {
        on { create(any(), any(), any(), any(), any(), any()) } doReturn securityManager
    }

    private val remoteAddress = mock<QlicEndpoint>()
    private val requestRoute = mock<SpectaclesStreamRoute>()

    private val trustManager = mock<SpectaclesStreamTrustManager>()

    private val keyManager = mock<KeyManager>()

    private val secureRandom = mock<SecureRandom>()

    @Before
    fun setup() {
        QlicConnectionFactory.connectionFactory = connectionFactory
        QlicConnectionFactory.securityManagerFactory = securityManagerFactory
    }

    @Test
    fun `openConnection()`() {
        QlicConnectionFactory.usePseudoSecurityManager = false

        val result = QlicConnectionFactory.openConnection(
            remoteAddress,
            requestRoute,
            trustManager,
            keyManager,
            secureRandom,
            QlicConnectionConfig(
                isClient = true,
                keepAliveTime = 10,
                connectionTimeout = 1234
            )
        )
        assertEquals(connection, result)
        verify(securityManagerFactory).create(
            true, trustManager, keyManager, true, false, secureRandom
        )
        verify(encryptionManager, never()).setSecret(any(), any())
        verify(encryptionManager, never()).update(any())
        verify(connectionFactory).create(
            securityManager, requestRoute, true
        )
        verify(connection).connect(remoteAddress, 1234)
        verify(connection).setLowLatencyMode(true)
        verify(connection).setKeepAliveTime(10)
    }

    @Test
    fun `openConnection(), pre-shared secret`() {
        QlicConnectionFactory.usePseudoSecurityManager = false

        val preSharedSecret = byteArrayOf(10) to byteArrayOf(5)
        val result = QlicConnectionFactory.openConnection(
            remoteAddress,
            requestRoute,
            trustManager,
            keyManager,
            secureRandom,
            QlicConnectionConfig(
                isClient = true,
                keepAliveTime = 10,
                connectionTimeout = 1234,
                preSharedSecret = preSharedSecret
            )
        )
        assertEquals(connection, result)
        verify(securityManagerFactory).create(
            true, trustManager, keyManager, true, true, secureRandom
        )
        verify(encryptionManager).setSecret(preSharedSecret.first, preSharedSecret.second)
        verify(encryptionManager).update(preSharedSecret.second)
        verify(connectionFactory).create(
            securityManager, requestRoute, true
        )
        verify(connection).connect(remoteAddress, 1234)
        verify(connection).setLowLatencyMode(true)
        verify(connection).setKeepAliveTime(10)
    }

    @Test
    fun `openConnection(), pseudo security`() {
        QlicConnectionFactory.usePseudoSecurityManager = true

        val result = QlicConnectionFactory.openConnection(
            remoteAddress,
            requestRoute,
            trustManager,
            keyManager,
            secureRandom,
            QlicConnectionConfig(
                isClient = false,
                lowLatencyMode = false,
                connectionTimeout = 200
            )
        )
        assertEquals(connection, result)
        verify(securityManagerFactory, never()).create(any(), any(), any(), any(), any(), any())
        verify(connectionFactory).create(
            any(),
            eq(requestRoute),
            eq(false)
        )
        verify(connection).connect(remoteAddress, 200)
        verify(connection).setLowLatencyMode(false)
        verify(connection, never()).setKeepAliveTime(any())
    }

    @Test
    fun `openConnection(), exception`() {
        whenever(connection.connect(any(), any())).thenAnswer { throw Exception() }

        try {
            QlicConnectionFactory.openConnection(
                remoteAddress,
                requestRoute,
                trustManager,
                keyManager,
                mock(),
                QlicConnectionConfig()
            )
        } catch (_: Exception) {
        }

        verify(connection).close()
    }
}
