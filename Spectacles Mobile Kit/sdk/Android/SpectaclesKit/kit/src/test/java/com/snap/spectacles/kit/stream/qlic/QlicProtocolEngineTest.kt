package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamHandler
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.ArgumentMatchers.eq
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argThat
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions
import org.mockito.kotlin.whenever
import java.io.OutputStream

@RunWith(JUnit4::class)
class QlicProtocolEngineTest : KitBaseTest() {

    private val encryptionManager = mock<QlicEncryptionManager> {
        on { createDecryptedStream(any()) } doAnswer { it.getArgument(0) }
        on { createEncryptedStream(any()) } doAnswer { it.getArgument(0) }
    }

    private val securityManager = mock<QlicSecurityManager> {
        on { encryptionManager } doReturn encryptionManager
        on { authenticationManager } doReturn mock()
        on { keyExchangeManager } doReturn mock()
        on { transcriptHashManager } doReturn mock()
        on { noHandshake } doReturn false
        on { secureRandom } doReturn mock()
    }

    private lateinit var onHandshakeCompleted: () -> Unit
    private lateinit var handshakeResponseSender: QlicFrameSender
    private val handshakeHandler = mock<QlicHandshakeHandler>()
    private val handshakeHandlerFactory = mock<QlicHandshakeHandler.Factory> {
        on { create(any(), any(), any(), any(), any(), any(), any(), any()) } doAnswer {
            handshakeResponseSender = it.getArgument(5)
            onHandshakeCompleted = it.getArgument(6)
            handshakeHandler
        }
    }

    private lateinit var onReceive: (QlicPacket.In) -> Unit
    private lateinit var onConnectionErrorForReader: (Exception) -> Unit
    private lateinit var shutdownForReader: () -> Unit
    private val reader = mock<QlicPacketReader>()
    private val readerFactory = mock<QlicPacketReader.Factory> {
        on { create(any(), any(), any(), any()) } doAnswer {
            onReceive = it.getArgument(1)
            onConnectionErrorForReader = it.getArgument(2)
            shutdownForReader = it.getArgument(3)
            reader
        }
    }

    private lateinit var pollOutgoing: () -> Pair<QlicPacket.Out, () -> Unit>?
    private lateinit var onConnectionErrorForWriter: (Exception) -> Unit
    private lateinit var shutdownForWriter: () -> Unit
    private val writer = mock<QlicPacketWriter>()
    private val writerFactory = mock<QlicPacketWriter.Factory> {
        on { create(any(), any(), any(), any()) } doAnswer {
            pollOutgoing = it.getArgument(1)
            onConnectionErrorForWriter = it.getArgument(2)
            shutdownForWriter = it.getArgument(3)
            writer
        }
    }

    private val peerStreamHandlerFactory = object : () -> SpectaclesStreamHandler {
        override fun invoke(): SpectaclesStreamHandler = mock()
    }

    private val streamManager = mock<QlicStreamManager>()
    private val streamManagerFactory = mock<QlicStreamManager.Factory> {
        on { create(any(), any(), any()) } doReturn streamManager
    }

    private val flowControl = mock<QlicFlowControl> {
        on { waitForData(any()) } doReturn true
    }
    private val flowContrlFactory = mock<QlicFlowControl.Factory> {
        on { create() } doReturn flowControl
    }

    private val outgoingQueue = mock<QlicFlowQueue>()

    private val clock = mock<() -> Long> {
        onGeneric { invoke() } doReturn 0L
    }
    private lateinit var trafficManager: QlicTrafficManager
    private val trafficManagerFactory = mock<QlicTrafficManager.Factory> {
        on { create(any(), any()) } doAnswer {
            trafficManager = QlicTrafficManager(it.getArgument(0), it.getArgument(1), clock)
            trafficManager
        }
    }

    private val socket = mock<QlicEndpoint.Socket> {
        on { inputStream } doReturn mock()
        on { outputStream } doReturn mock()
        on { preferredTransmitPacketSize } doReturn 1024
    }

    private val onStop = mock<() -> Unit>()

    private val subject = QlicProtocolEngine(
        socket,
        securityManager,
        peerStreamHandlerFactory,
        onStop,
        true,
        readerFactory,
        writerFactory,
        streamManagerFactory,
        trafficManagerFactory,
        flowContrlFactory,
        outgoingQueue,
        handshakeHandlerFactory
    )

    @Test
    fun `init()`() {
        verify(streamManagerFactory).create(peerStreamHandlerFactory, flowControl, true)
    }

    @Test
    fun `start(), fully`() {
        whenever(handshakeHandler.start()).then {
            onHandshakeCompleted.invoke()
        }

        assertTrue(subject.start(5000))
        verify(outgoingQueue).attach(flowControl)
        verify(reader).start()
        verify(writer).start()
        verify(handshakeHandlerFactory).create(any(), any(), any(), any(), any(), any(), any(), eq(true))
        verify(handshakeHandler).start()

        val response = mock<QlicPendingFrame>()
        val callback = mock<() -> Unit>()
        handshakeResponseSender.send(response, callback)
        verify(outgoingQueue).addLast(response, callback)
    }

    @Test
    fun `start(), handshake failed`() {
        whenever(handshakeHandler.start()).then {
            onConnectionErrorForReader.invoke(Exception())
        }

        assertFalse(subject.start(5000))
        verify(handshakeHandler).close()
    }

    @Test
    fun `start(), shutdown from reader`() {
        whenever(handshakeHandler.start()).then {
            shutdownForReader.invoke()
        }

        assertFalse(subject.start(5000))
        verify(handshakeHandler).close()
    }

    @Test
    fun `start(), shutdown from writer`() {
        whenever(handshakeHandler.start()).then {
            shutdownForWriter.invoke()
        }

        assertFalse(subject.start(5000))
        verify(handshakeHandler).close()
    }

    @Test
    fun `start(), handshake timeout`() {
        assertFalse(subject.start(10))
        verify(handshakeHandler).close()
    }

    @Test
    fun `start(), insecure mode`() {
        whenever(securityManager.noHandshake).thenReturn(true)

        assertTrue(subject.start(5000))
        verifyNoMoreInteractions(handshakeHandlerFactory)
    }

    @Test
    fun `startLocalStream()`() {
        subject.startLocalStream(false, mock(), mock())
        verify(streamManager).startLocalStream(eq(false), any(), any())
    }

    @Test
    fun `setLowLatencyMode(true), no start throttling, no ping`() {
        subject.setLowLatencyMode(true)
        verify(flowControl, never()).startThrottling(any())
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `setLowLatencyMode(true), no start throttling, ping`() {
        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1)
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }
        pollOutgoing.invoke()?.second?.invoke()

        subject.setLowLatencyMode(true)
        verify(flowControl, never()).startThrottling(any())
        verify(outgoingQueue).addLast(QlicPendingFrame.Ping, null)
    }

    @Test
    fun `setLowLatencyMode(true), start throttling, ping`() {
        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1)
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()

        subject.setLowLatencyMode(true)
        verify(flowControl).startThrottling(any())
        verify(outgoingQueue).addLast(QlicPendingFrame.Ping, null)
    }

    @Test
    fun `setLowLatencyMode(true), throttling`() {
        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1)
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()

        subject.setLowLatencyMode(true)
        clearInvocations(flowControl)
        clearInvocations(outgoingQueue)

        subject.setLowLatencyMode(true)
        verify(flowControl, never()).startThrottling(any())
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `setLowLatencyMode(false), lowLatencyMode, throttling`() {
        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1)
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()

        subject.setLowLatencyMode(true)
        clearInvocations(flowControl)
        clearInvocations(outgoingQueue)

        subject.setLowLatencyMode(false)
        verify(flowControl).stopThrottling()
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `setLowLatencyMode(false), lowLatencyMode, not throttling`() {
        subject.setLowLatencyMode(true)
        clearInvocations(flowControl)
        clearInvocations(outgoingQueue)

        subject.setLowLatencyMode(false)
        verify(flowControl, never()).stopThrottling()
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `setLowLatencyMode(false), not lowLatencyMode`() {
        subject.setLowLatencyMode(false)
        verify(flowControl, never()).stopThrottling()
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `setKeepAliveTime(), ping`() {
        whenever(clock.invoke()).thenReturn(1000)
        trafficManager.updateReceivedBytes(0)

        whenever(clock.invoke()).thenReturn(2000)
        subject.setKeepAliveTime(1000)
        verify(outgoingQueue).addLast(QlicPendingFrame.Ping, null)
    }

    @Test
    fun `setKeepAliveTime(), no ping`() {
        whenever(clock.invoke()).thenReturn(1000)
        trafficManager.updateReceivedBytes(0)

        whenever(clock.invoke()).thenReturn(2000)
        subject.setKeepAliveTime(1001)
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `pollOutgoingPacket(), null`() {
        whenever(flowControl.waitForData(any())).thenReturn(null)

        assertEquals(null, pollOutgoing.invoke())
        verify(flowControl).waitForData(any())
        verify(flowControl, never()).writeDataToStream(any(), any())
    }

    @Test
    fun `pollOutgoingPacket()`() {
        val callback = mock<() -> Unit>()
        whenever(flowControl.writeDataToStream(any(), any())).thenReturn(10 to callback)

        val result = pollOutgoing.invoke()
        verify(flowControl).waitForData(any())
        verify(flowControl).writeDataToStream(any(), any())

        result?.second?.invoke()
        verify(callback).invoke()
    }

    @Test
    fun `pollOutgoingPacket(), 0 first`() {
        val callback = mock<() -> Unit>()
        whenever(flowControl.writeDataToStream(any(), any())).thenReturn(
            0 to null,
            10 to callback
        )

        val result = pollOutgoing.invoke()
        verify(flowControl, times(2)).waitForData(any())
        verify(flowControl, times(2)).writeDataToStream(any(), any())

        result?.second?.invoke()
        verify(callback).invoke()
    }

    @Test
    fun `pollOutgoingPacket(), keep-alive`() {
        whenever(flowControl.waitForData(any())).thenReturn(false, null)

        subject.setKeepAliveTime(1000)
        assertEquals(null, pollOutgoing.invoke())
        verify(flowControl, times(2)).waitForData(1000)
        verify(outgoingQueue).addLast(QlicPendingFrame.Ping, null)
    }

    @Test
    fun `pollOutgoingPacket(), lowLatencyMode, no ping`() {
        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1) - 1
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }

        subject.setLowLatencyMode(true)
        pollOutgoing.invoke()?.second?.invoke()
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `pollOutgoingPacket(), lowLatencyMode, ping`() {
        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1)
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }

        subject.setLowLatencyMode(true)
        pollOutgoing.invoke()?.second?.invoke()
        verify(flowControl, never()).startThrottling(any())
        verify(outgoingQueue).addLast(QlicPendingFrame.Ping, null)
    }

    @Test
    fun `pollOutgoingPacket(), lowLatencyMode, start throttling`() {
        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1)
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }

        subject.setLowLatencyMode(true)
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()
        verify(flowControl, never()).startThrottling(any())
        verify(outgoingQueue, times(2)).addLast(QlicPendingFrame.Ping, null)

        pollOutgoing.invoke()?.second?.invoke()
        verify(flowControl).startThrottling(any())
        verify(outgoingQueue, times(3)).addLast(QlicPendingFrame.Ping, null)
    }

    @Test
    fun `handleIncomingPacket(), handshaking`() {
        whenever(handshakeHandler.start()).then {
            val packet = QlicPacket.In(byteArrayOf(0))
            onReceive.invoke(packet)
            onConnectionErrorForWriter.invoke(Exception())
        }

        assertFalse(subject.start(5000))
        verify(handshakeHandler).handle(QlicFrame.Padding)
        verify(streamManager, never()).handle(any())
    }

    @Test
    fun `handleIncomingPacket(), stream manager`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        whenever(streamManager.handle(any())).thenReturn(true)
        assertTrue(subject.start(5000))

        onReceive.invoke(QlicPacket.In(byteArrayOf(0, 1)))

        verify(streamManager).handle(QlicFrame.Padding)
        verify(streamManager).handle(QlicFrame.Ping)
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `handleIncomingPacket(), PING`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        assertTrue(subject.start(5000))

        onReceive.invoke(QlicPacket.In(byteArrayOf(1)))

        verify(outgoingQueue).addLast(
            argThat { this is QlicPendingFrame.Ack },
            anyOrNull()
        )
    }

    @Test
    fun `handleIncomingPacket(), ACK`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        assertTrue(subject.start(5000))

        onReceive.invoke(QlicPacket.In(byteArrayOf(2, 5)))
    }

    @Test
    fun `handleIncomingPacket(), ACK, stop throttling`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        assertTrue(subject.start(5000))

        whenever(flowControl.writeDataToStream(any(), any())).thenAnswer {
            val size = it.getArgument<Int>(1)
            it.getArgument<OutputStream>(0).write(ByteArray(size))
            size to null
        }
        subject.setLowLatencyMode(true)
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()
        pollOutgoing.invoke()?.second?.invoke()
        clearInvocations(flowControl)
        clearInvocations(outgoingQueue)

        onReceive.invoke(QlicPacket.In(byteArrayOf(2, 0x44, 0)))
        verify(flowControl).stopThrottling()
        verify(outgoingQueue, never()).addLast(any(), any())
    }

    @Test
    fun `handleIncomingPacket(), PROTOCOL CLOSE`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        assertTrue(subject.start(5000))

        onReceive.invoke(QlicPacket.In(byteArrayOf(0x1C, 0, 0, 0)))
        verify(onStop).invoke()
    }

    @Test
    fun `handleIncomingPacket(), APPLICATION CLOSE`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        assertTrue(subject.start(5000))

        onReceive.invoke(QlicPacket.In(byteArrayOf(0x1D, 0, 0)))
        verify(onStop).invoke()
    }

    @Test
    fun `handleIncomingPacket(), PADDING`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        assertTrue(subject.start(5000))

        onReceive.invoke(QlicPacket.In(byteArrayOf(0)))
    }

    @Test
    fun `shutdown(), graceful = false`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        whenever(streamManager.handle(any())).thenReturn(true)
        assertTrue(subject.start(5000))

        subject.shutdown(false)
        verify(reader).shutdown()
        verify(writer).shutdown()
        verify(outgoingQueue).detach()
        verify(flowControl).shutdown()
        verify(streamManager).shutdown()
        verify(onStop).invoke()
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `shutdown(), graceful = true`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        whenever(streamManager.handle(any())).thenReturn(true)
        assertTrue(subject.start(5000))

        subject.shutdown(true)
        verify(reader, never()).shutdown()
        verify(writer, never()).shutdown()
        verify(outgoingQueue, never()).detach()
        verify(flowControl, never()).shutdown()
        verify(streamManager, never()).shutdown()
        verify(onStop, never()).invoke()

        val captor = argumentCaptor<() -> Unit>()
        verify(outgoingQueue).addLast(any(), captor.capture())
        captor.firstValue.invoke()
        verify(reader).shutdown()
        verify(writer).shutdown()
        verify(outgoingQueue).detach()
        verify(flowControl).shutdown()
        verify(streamManager).shutdown()
        verify(socket).close()
        verify(onStop).invoke()
    }

    @Test
    fun `shutdown(), reentry, graceful = true`() {
        whenever(handshakeHandler.start()).thenAnswer {
            onHandshakeCompleted.invoke()
        }
        whenever(streamManager.handle(any())).thenReturn(true)
        assertTrue(subject.start(5000))

        subject.shutdown()
        clearInvocations(reader)

        subject.shutdown(true)
        verify(reader, never()).shutdown()
        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
    }

    @Test
    fun `Factory create()`() {
        QlicProtocolEngine.Factory.create(
            socket,
            securityManager,
            { mock() },
            onStop,
            false
        )
    }
}
