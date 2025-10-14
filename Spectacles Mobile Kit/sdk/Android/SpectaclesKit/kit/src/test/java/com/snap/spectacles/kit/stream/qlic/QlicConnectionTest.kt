package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamRoute
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamHandler
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.io.Closeable
import java.util.concurrent.TimeoutException

@RunWith(JUnit4::class)
class QlicConnectionTest : KitBaseTest() {

    private val securityManager = mock<QlicSecurityManager>()
    private val requestRoute = mock<SpectaclesStreamRoute>()

    private val protocolEngine = mock<QlicProtocolEngine> {
        on { start(any()) } doReturn true
    }
    private lateinit var peerStreamHandlerFactory: () -> SpectaclesStreamHandler
    private lateinit var onStop: () -> Unit
    private val protocolEngineFactory = mock<QlicProtocolEngine.Factory> {
        on { create(any(), any(), any(), any(), any()) } doAnswer {
            peerStreamHandlerFactory = it.getArgument(2)
            onStop = it.getArgument(3)
            protocolEngine
        }
    }

    private val socket = mock<QlicEndpoint.Socket>()
    private val endpoint = mock<QlicEndpoint> {
        on { connect(any()) } doReturn socket
    }

    private val subject = QlicConnection(
        securityManager,
        requestRoute,
        true,
        protocolEngineFactory
    )

    @Test
    fun `connect(), success`() {
        subject.connect(endpoint, 1000)
        verify(endpoint).connect(1000)
        verify(protocolEngineFactory).create(
            eq(socket), eq(securityManager), any(), any(), eq(true)
        )
        verify(protocolEngine).start(1000)
        assertTrue(peerStreamHandlerFactory.invoke() is SpectaclesStreamHandler.Default)
    }

    @Test(expected = TimeoutException::class)
    fun `connect(), timeout`() {
        whenever(protocolEngine.start(any())).thenReturn(false)

        subject.connect(endpoint, 1000)
    }

    @Test
    fun `close()`() {
        subject.connect(endpoint, 1000)

        subject.close()

        verify(protocolEngine).shutdown(true)
    }

    @Test
    fun `getRemoteAddress(), before connect()`() {
        assertEquals(null, subject.getRemoteAddress())
    }

    @Test
    fun `getRemoteAddress(), after connect()`() {
        subject.connect(endpoint, 1000)
        assertEquals(endpoint, subject.getRemoteAddress())
    }

    @Test
    fun `attach()`() {
        subject.connect(endpoint, 1000)

        val closeable = mock<Closeable>()
        subject.attach(closeable)
        onStop.invoke()

        verify(closeable).close()
    }

    @Test
    fun `setOnDisconnectedListener(), before disconnected`() {
        subject.connect(endpoint, 1000)

        val listener = mock<(Int) -> Unit>()
        subject.setOnDisconnectedListener(listener)
        verify(listener, never()).invoke(any())

        onStop.invoke()
        verify(listener).invoke(0)
    }

    @Test
    fun `setOnDisconnectedListener(), disconnected`() {
        subject.connect(endpoint, 1000)
        onStop.invoke()

        val listener = mock<(Int) -> Unit>()
        subject.setOnDisconnectedListener(listener)
        verify(listener).invoke(0)
    }

    @Test
    fun `setOnDisconnectedListener(), One-off call`() {
        subject.connect(endpoint, 1000)
        onStop.invoke()

        val listener = mock<(Int) -> Unit>()
        subject.setOnDisconnectedListener(listener)
        clearInvocations(listener)

        onStop.invoke()
        verify(listener, never()).invoke(any())
    }

    @Test
    fun `isConnected(), started`() {
        subject.connect(endpoint, 1000)

        assertTrue(subject.isConnected())
    }

    @Test
    fun `isConnected(), not-started`() {
        assertFalse(subject.isConnected())
    }

    @Test
    fun `isConnected(), start-failed`() {
        whenever(protocolEngine.start(any())).thenReturn(false)
        try { subject.connect(endpoint, 1000) } catch (_: Exception) {}

        assertFalse(subject.isConnected())
    }

    @Test
    fun `isConnected(), shutdown`() {
        subject.connect(endpoint, 1000)
        onStop.invoke()

        assertFalse(subject.isConnected())
    }

    @Test
    fun `startStream(), bidirectional`() {
        subject.connect(endpoint, 1000)

        val request = mock<SpectaclesStreamDataUnit>()
        val onReceive = mock<(SpectaclesStreamDataUnit) -> Unit>()
        val onClose = mock<() -> Unit>()
        subject.startStream(onReceive, onClose)

        verify(protocolEngine).startLocalStream(false, onReceive, onClose)
    }

    @Test
    fun `startStream(), unidirectional`() {
        subject.connect(endpoint, 1000)

        val onClose = mock<() -> Unit>()
        subject.startStream(onClose)

        val captor = argumentCaptor<(SpectaclesStreamDataUnit) -> Unit>()
        verify(protocolEngine).startLocalStream(eq(true), captor.capture(), eq(onClose))
        captor.firstValue.invoke(mock())
    }

    @Test
    fun `setLowLatencyMode(true)`() {
        subject.connect(endpoint, 1000)

        subject.setLowLatencyMode(true)
        verify(protocolEngine).setLowLatencyMode(true)
    }

    @Test
    fun `setLowLatencyMode(false)`() {
        subject.connect(endpoint, 1000)

        subject.setLowLatencyMode(false)
        verify(protocolEngine).setLowLatencyMode(false)
    }

    @Test
    fun `setKeepAliveTime()`() {
        subject.connect(endpoint, 1000)

        subject.setKeepAliveTime(5000)
        verify(protocolEngine).setKeepAliveTime(5000)
    }

    @Test
    fun `Factory create()`() {
        QlicConnection.Factory.create(
            securityManager, requestRoute, true
        )
    }
}
