package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamLazyPayload
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.spy
import org.mockito.kotlin.verify
import java.io.ByteArrayInputStream
import java.io.InputStream

@RunWith(JUnit4::class)
class QlicPendingFrameTest : KitBaseTest() {

    @Test
    fun `MonolithicPendingFrame, within size limit`() {
        val frame = mock<QlicFrame> {
            on { size() } doReturn 10
        }
        val subject = object : QlicPendingFrame.MonolithicPendingFrame(frame, 1) {}
        assertEquals(frame, subject.get(10))
        assertFalse(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `MonolithicPendingFrame, beyond size limit`() {
        val frame = mock<QlicFrame> {
            on { size() } doReturn 10
        }
        val subject = object : QlicPendingFrame.MonolithicPendingFrame(frame, 1) {}
        assertEquals(null, subject.get(9))
        assertTrue(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `MonolithicPendingFrame, close()`() {
        val subject = object : QlicPendingFrame.MonolithicPendingFrame(mock<QlicFrame>(), 1) {}
        subject.close()
    }

    @Test
    fun `Ping, get()`() {
        val subject = QlicPendingFrame.Ping
        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.Ping)
    }

    @Test
    fun `Ack, get()`() {
        val subject = QlicPendingFrame.Ack(100)
        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.Ack)
    }

    @Test
    fun `StreamStopSending, get()`() {
        val subject = QlicPendingFrame.StreamStopSending(QlicStreamId(0), 0)
        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.StreamStopSending)
    }

    @Test
    fun `StreamReset, get()`() {
        val subject = QlicPendingFrame.StreamReset(QlicStreamId(0), 0)
        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.StreamReset)
    }

    @Test
    fun `ConnectionCloseProtocol, get()`() {
        val subject = QlicPendingFrame.ConnectionCloseProtocol(0, 0, byteArrayOf(1))
        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.ConnectionCloseProtocol)
    }

    @Test
    fun `ConnectionCloseApplication, get()`() {
        val subject = QlicPendingFrame.ConnectionCloseApplication(0, byteArrayOf(1))
        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.ConnectionCloseApplication)
    }

    @Test
    fun `Crypto, within size limit()`() {
        val subject = QlicPendingFrame.Crypto(ByteArray(100))
        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.Crypto)
        assertFalse(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `Crypto, beyond size limit()`() {
        val subject = QlicPendingFrame.Crypto(ByteArray(100))
        val frame = subject.get(50)
        assertTrue(frame is QlicFrame.Crypto)
        assertTrue(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `Crypto, beyond header size()`() {
        val subject = QlicPendingFrame.Crypto(ByteArray(100))
        val frame = subject.get(2)
        assertEquals(null, frame)
        assertTrue(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `StreamData, within size limit`() {
        val data = SpectaclesStreamDataUnit(false, 0, SpectaclesStreamBytesPayload(ByteArray(100)))
        val subject = QlicPendingFrame.StreamData(QlicStreamId(0), data)
        assertTrue(subject.isCancelable())

        val frame = subject.get(1000)
        assertTrue(frame is QlicFrame.StreamData)
        assertFalse(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `StreamData, exceed size limit, last`() {
        val data = SpectaclesStreamDataUnit(true, 0, SpectaclesStreamBytesPayload(ByteArray(100)))
        val subject = QlicPendingFrame.StreamData(QlicStreamId(0), data)
        assertFalse(subject.isCancelable())

        val frame = subject.get(50)
        assertTrue(frame is QlicFrame.StreamData)
        assertFalse((frame as QlicFrame.StreamData).fin)
        assertTrue(subject.hasRemainingData())
        assertFalse(subject.isCancelable())

        val frame2 = subject.get(60)
        assertTrue(frame2 is QlicFrame.StreamData)
        assertTrue((frame2 as QlicFrame.StreamData).fin)
        assertFalse(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `StreamData, exceed size limit, not last`() {
        val data = SpectaclesStreamDataUnit(false, 0, SpectaclesStreamBytesPayload(ByteArray(100)))
        val subject = QlicPendingFrame.StreamData(QlicStreamId(0), data)
        assertTrue(subject.isCancelable())

        val frame = subject.get(50)
        assertTrue(frame is QlicFrame.StreamData)
        assertFalse((frame as QlicFrame.StreamData).fin)
        assertTrue(subject.hasRemainingData())
        assertFalse(subject.isCancelable())

        val frame2 = subject.get(60)
        assertTrue(frame2 is QlicFrame.StreamData)
        assertFalse((frame2 as QlicFrame.StreamData).fin)
        assertFalse(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `StreamData, exceed header size`() {
        val data = SpectaclesStreamDataUnit(true, 0, SpectaclesStreamBytesPayload(ByteArray(100)))
        val subject = QlicPendingFrame.StreamData(QlicStreamId(0), data)
        assertFalse(subject.isCancelable())

        val frame = subject.get(2)
        assertEquals(null, frame)
        assertTrue(subject.hasRemainingData())
        assertFalse(subject.isCancelable())
    }

    @Test
    fun `StreamData, close`() {
        val input = spy<InputStream>(ByteArrayInputStream(ByteArray(100)))
        val data = SpectaclesStreamDataUnit(true, 0, SpectaclesStreamLazyPayload(100) { input })
        val subject = QlicPendingFrame.StreamData(QlicStreamId(0), data)

        subject.close()
        verify(input).close()
    }
}
