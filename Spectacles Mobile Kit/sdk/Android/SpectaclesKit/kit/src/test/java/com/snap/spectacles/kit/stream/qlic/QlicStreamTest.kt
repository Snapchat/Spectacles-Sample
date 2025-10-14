package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class QlicStreamTest : KitBaseTest() {

    private val outgoingQueue = mock<QlicFlowQueue>()

    private val streamDataHandler = mock<(SpectaclesStreamDataUnit) -> Unit>()
    private val streamCloseHandler = mock<() -> Unit>()

    @Test
    fun `send(), non-last`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, false, outgoingQueue)
        val data = SpectaclesStreamDataUnit(false, 0, mock())
        subject.send(data)

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamData)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `send(), unidirectional`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.send(mock())
    }

    @Test
    fun `receive(), non-last DATA`() {
        val streamId = QlicStreamId(0, 1, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, false, outgoingQueue)
        val frame = QlicFrame.StreamData(streamId.compact, false, true, byteArrayOf(1, 2))
        subject.handleIncomingFrame(frame)

        val captor = argumentCaptor<SpectaclesStreamDataUnit>()
        verify(streamDataHandler).invoke(captor.capture())
        assertEquals(1, captor.firstValue.priority)
        assertEquals(false, captor.firstValue.last)
        assertEquals(2, captor.firstValue.payload.size)
    }

    @Test
    fun `receive(), last DATA`() {
        val streamId = QlicStreamId(0, 1, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, false, outgoingQueue)
        val frame = QlicFrame.StreamData(
            QlicStreamId.compact(streamId.id, 5, false, false), true, true, byteArrayOf(1)
        )
        subject.handleIncomingFrame(frame)

        val captor = argumentCaptor<SpectaclesStreamDataUnit>()
        verify(streamDataHandler).invoke(captor.capture())
        assertEquals(5, captor.firstValue.priority)
        assertEquals(true, captor.firstValue.last)
        assertEquals(1, captor.firstValue.payload.size)
    }

    @Test
    fun `receive(), non-last DATA fragment`() {
        val streamId = QlicStreamId(0, 1, false, false)
        val subject =
            QlicStream(streamId, streamDataHandler, streamCloseHandler, false, outgoingQueue)
        val frame = QlicFrame.StreamData(streamId.compact, false, false, byteArrayOf(1))
        subject.handleIncomingFrame(frame)

        verify(streamDataHandler, never()).invoke(any())
    }

    @Test
    fun `receive(), DATA fragments`() {
        val streamId = QlicStreamId(0, 1, false, false)
        val subject =
            QlicStream(streamId, streamDataHandler, streamCloseHandler, false, outgoingQueue)
        val frame1 = QlicFrame.StreamData(streamId.compact, false, false, byteArrayOf(1))
        subject.handleIncomingFrame(frame1)

        val frame2 = QlicFrame.StreamData(streamId.compact, false, true, byteArrayOf(2, 3))
        subject.handleIncomingFrame(frame2)

        val captor = argumentCaptor<SpectaclesStreamDataUnit>()
        verify(streamDataHandler).invoke(captor.capture())
        assertEquals(1, captor.firstValue.priority)
        assertEquals(false, captor.firstValue.last)
        assertEquals(3, captor.firstValue.payload.size)
    }

    @Test
    fun `receive(), DATA input-closed`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, false, outgoingQueue)
        val frame = QlicFrame.StreamData(streamId.compact, false, true, byteArrayOf(1, 2))
        subject.handleIncomingFrame(frame)

        verify(streamDataHandler, never()).invoke(any())
    }

    @Test
    fun `receive(), RESET output-closed`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.handleIncomingFrame(QlicFrame.StreamReset(streamId.compact, 0))

        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `receive(), STOP`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.handleIncomingFrame(QlicFrame.StreamStopSending(streamId.compact, 0))

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamReset)
    }

    @Test
    fun `receive(), STOP output-closed`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.handleIncomingFrame(QlicFrame.StreamStopSending(streamId.compact, 0))

        verify(outgoingQueue, never()).addLast(any(), any())
    }

    @Test
    fun `receive(), unsupported`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.handleIncomingFrame(QlicFrame.Padding)
    }

    @Test
    fun `shutdown(), bidirectional`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.shutdown()

        verify(outgoingQueue, never()).addLast(any(), anyOrNull())
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `close(), bidirectional`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.close()

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue, times(2)).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamReset)
        assertTrue(captor.secondValue is QlicPendingFrame.StreamStopSending)
        verify(streamCloseHandler, never()).invoke()
        assertFalse(subject.isClosed())

        subject.handleIncomingFrame(QlicFrame.StreamReset(streamId.compact, 0))
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `half-close output, unidirectional`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        subject.close()

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamStopSending)
        verify(streamCloseHandler, never()).invoke()
        assertFalse(subject.isClosed())

        subject.handleIncomingFrame(QlicFrame.StreamReset(streamId.compact, 0))
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `half-close output, caused by sending last DATA`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)

        subject.send(SpectaclesStreamDataUnit(true, 0, mock()))
        clearInvocations(outgoingQueue)
        subject.close()

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamStopSending)
        verify(streamCloseHandler, never()).invoke()
        assertFalse(subject.isClosed())

        subject.handleIncomingFrame(QlicFrame.StreamReset(streamId.compact, 0))
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `half-close output, caused by receiving STOP`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)

        subject.handleIncomingFrame(QlicFrame.StreamStopSending(streamId.compact, 0))
        clearInvocations(outgoingQueue)
        subject.close()

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamStopSending)
        verify(streamCloseHandler, never()).invoke()
        assertFalse(subject.isClosed())

        subject.handleIncomingFrame(QlicFrame.StreamReset(streamId.compact, 0))
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `half-close input, unidirectional`() {
        val streamId = QlicStreamId(0, 0, true, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, false, outgoingQueue)
        subject.close()

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamReset)
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `half-close input, caused by receiving RESET`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)

        subject.handleIncomingFrame(QlicFrame.StreamReset(streamId.compact, 0))
        subject.close()

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamReset)
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `half-close input, caused by receiving last DATA`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)

        subject.handleIncomingFrame(QlicFrame.StreamData(0, true, true, byteArrayOf()))
        subject.close()

        val captor = argumentCaptor<QlicPendingFrame>()
        verify(outgoingQueue).addLast(captor.capture(), eq(null))
        assertTrue(captor.firstValue is QlicPendingFrame.StreamReset)
        verify(streamCloseHandler).invoke()
        assertTrue(subject.isClosed())
    }

    @Test
    fun `Factory create()`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream.Factory.create(streamId, streamDataHandler, streamCloseHandler, true)
    }

    @Test
    fun `toString()`() {
        val streamId = QlicStreamId(0, 0, false, false)
        val subject = QlicStream(streamId, streamDataHandler, streamCloseHandler, true, outgoingQueue)
        assertTrue(subject.toString().startsWith("QlicStream"))
    }
}
