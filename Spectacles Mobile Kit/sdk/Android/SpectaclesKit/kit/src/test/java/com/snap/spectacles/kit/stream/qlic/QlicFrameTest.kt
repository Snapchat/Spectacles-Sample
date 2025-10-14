package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

@RunWith(JUnit4::class)
class QlicFrameTest : KitBaseTest() {

    @Test
    fun `deserialize, EOF`() {
        val input = ByteArrayInputStream(byteArrayOf())
        assertEquals(null, QlicFrame.deserialize(input))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, unsupported`() {
        val input = ByteArrayInputStream(byteArrayOf(30))
        assertEquals(null, QlicFrame.deserialize(input))
    }

    @Test
    fun `deserialize, Padding`() {
        val input = ByteArrayInputStream(byteArrayOf(0))
        val frame = QlicFrame.deserialize(input)
        assertEquals(QlicFrame.Padding, frame)
    }

    @Test
    fun `deserialize, Ping`() {
        val input = ByteArrayInputStream(byteArrayOf(1))
        val frame = QlicFrame.deserialize(input)
        assertEquals(QlicFrame.Ping, frame)
    }

    @Test
    fun `deserialize, Ack`() {
        val input = ByteArrayInputStream(byteArrayOf(2, 10))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.Ack)
        assertEquals(10, (frame as QlicFrame.Ack).bytesSinceLastAck)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, Ack, malformed`() {
        val input = ByteArrayInputStream(byteArrayOf(2))
        QlicFrame.deserialize(input)
    }

    @Test
    fun `deserialize, Crypto`() {
        val input = ByteArrayInputStream(byteArrayOf(6, 2, 2, 1))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.Crypto)
        assertTrue((frame as QlicFrame.Crypto).data.contentEquals(byteArrayOf(2, 1)))
        assertTrue(frame.lastFragment)
    }

    @Test
    fun `deserialize, Crypto, non last fragment`() {
        val input = ByteArrayInputStream(byteArrayOf(7, 2, 2, 1))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.Crypto)
        assertTrue((frame as QlicFrame.Crypto).data.contentEquals(byteArrayOf(2, 1)))
        assertFalse(frame.lastFragment)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, Crypto, malformed`() {
        val input = ByteArrayInputStream(byteArrayOf(6))
        QlicFrame.deserialize(input)
    }

    @Test
    fun `deserialize, ConnectionCloseProtocol`() {
        val input = ByteArrayInputStream(byteArrayOf(0x1C, 1, 2, 2, 1, 2))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.ConnectionCloseProtocol)
        assertEquals(1, (frame as QlicFrame.ConnectionCloseProtocol).errorCode)
        assertEquals(2, frame.frameType)
        assertTrue(frame.reason.contentEquals(byteArrayOf(1, 2)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, ConnectionCloseProtocol, malformed errorCode`() {
        val input = ByteArrayInputStream(byteArrayOf(0x1C))
        QlicFrame.deserialize(input)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, ConnectionCloseProtocol, malformed frameType`() {
        val input = ByteArrayInputStream(byteArrayOf(0x1C, 2))
        QlicFrame.deserialize(input)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, ConnectionCloseProtocol, malformed reason`() {
        val input = ByteArrayInputStream(byteArrayOf(0x1C, 2, 2))
        QlicFrame.deserialize(input)
    }

    @Test
    fun `deserialize, ConnectionCloseApplication`() {
        val input = ByteArrayInputStream(byteArrayOf(0x1D, 2, 1, 10))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.ConnectionCloseApplication)
        assertEquals(2, (frame as QlicFrame.ConnectionCloseApplication).errorCode)
        assertTrue(frame.reason.contentEquals(byteArrayOf(10)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, ConnectionCloseApplication, malformed errorCode`() {
        val input = ByteArrayInputStream(byteArrayOf(0x1D))
        QlicFrame.deserialize(input)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, ConnectionCloseApplication, malformed reason`() {
        val input = ByteArrayInputStream(byteArrayOf(0x1D, 2))
        QlicFrame.deserialize(input)
    }

    @Test
    fun `deserialize, StreamData`() {
        val input = ByteArrayInputStream(byteArrayOf(8, 3, 2, 2, 1))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.StreamData)
        assertEquals(3, (frame as QlicFrame.StreamData).id)
        assertTrue(frame.payload.contentEquals(byteArrayOf(2, 1)))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, StreamData, malformed streamId`() {
        val input = ByteArrayInputStream(byteArrayOf(9))
        QlicFrame.deserialize(input)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, StreamData, malformed payload`() {
        val input = ByteArrayInputStream(byteArrayOf(10, 2))
        QlicFrame.deserialize(input)
    }

    @Test
    fun `deserialize, StreamReset`() {
        val input = ByteArrayInputStream(byteArrayOf(4, 2, 1))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.StreamReset)
        assertEquals(2, (frame as QlicFrame.StreamReset).id)
        assertEquals(1, frame.errorCode)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, StreamReset, malformed streamId`() {
        val input = ByteArrayInputStream(byteArrayOf(4))
        QlicFrame.deserialize(input)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, StreamReset, malformed errorCode`() {
        val input = ByteArrayInputStream(byteArrayOf(4, 2))
        QlicFrame.deserialize(input)
    }

    @Test
    fun `deserialize, StreamStopSending`() {
        val input = ByteArrayInputStream(byteArrayOf(5, 2, 1))
        val frame = QlicFrame.deserialize(input)
        assertTrue(frame is QlicFrame.StreamStopSending)
        assertEquals(2, (frame as QlicFrame.StreamStopSending).id)
        assertEquals(1, frame.errorCode)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, StreamStopSending, malformed streamId`() {
        val input = ByteArrayInputStream(byteArrayOf(5))
        QlicFrame.deserialize(input)
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `deserialize, StreamStopSending, malformed errorCode`() {
        val input = ByteArrayInputStream(byteArrayOf(5, 2))
        QlicFrame.deserialize(input)
    }

    @Test
    fun `Padding, size()`() {
        assertEquals(1, QlicFrame.Padding.size())
    }

    @Test
    fun `Padding, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.Padding.serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(0)))
    }

    @Test
    fun `Padding, toString()`() {
        QlicFrame.Padding.toString()
    }

    @Test
    fun `Ping, size()`() {
        assertEquals(1, QlicFrame.Ping.size())
    }

    @Test
    fun `Ping, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.Ping.serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(1)))
    }

    @Test
    fun `Ping, toString()`() {
        QlicFrame.Ping.toString()
    }

    @Test
    fun `Ack, size()`() {
        assertEquals(2, QlicFrame.Ack(10).size())
    }

    @Test
    fun `Ack, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.Ack(10).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(2, 10)))
    }

    @Test
    fun `Ack, toString()`() {
        QlicFrame.Ack(10).toString()
    }

    @Test
    fun `Crypto, size()`() {
        assertEquals(4, QlicFrame.Crypto(false, byteArrayOf(1, 2)).size())
    }

    @Test
    fun `Crypto, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.Crypto(true, byteArrayOf(1, 2)).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(6, 2, 1, 2)))
    }

    @Test
    fun `Crypto, serialize(), non last fragment`() {
        val output = ByteArrayOutputStream()
        QlicFrame.Crypto(false, byteArrayOf(1, 2)).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(7, 2, 1, 2)))
    }

    @Test
    fun `Crypto, toString()`() {
        QlicFrame.Crypto(false, byteArrayOf(1, 2)).toString()
    }

    @Test
    fun `Crypto, calculateMaxDataSize(), bufferCapacity = 0`() {
        assertEquals(0, QlicFrame.Crypto.calculateMaxDataSize(0))
    }

    @Test
    fun `Crypto, calculateMaxDataSize(), bufferCapacity = 2`() {
        assertEquals(0, QlicFrame.Crypto.calculateMaxDataSize(2))
    }

    @Test
    fun `Crypto, calculateMaxDataSize(), bufferCapacity = 10`() {
        assertEquals(8, QlicFrame.Crypto.calculateMaxDataSize(10))
    }

    @Test
    fun `ConnectionCloseProtocol, size()`() {
        assertEquals(5, QlicFrame.ConnectionCloseProtocol(10, 1, byteArrayOf(1)).size())
    }

    @Test
    fun `ConnectionCloseProtocol, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.ConnectionCloseProtocol(10, 1, byteArrayOf(1)).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(0x1C, 10, 1, 1, 1)))
    }

    @Test
    fun `ConnectionCloseProtocol, toString()`() {
        QlicFrame.ConnectionCloseProtocol(10, 1, byteArrayOf(1)).toString()
    }

    @Test
    fun `ConnectionCloseApplication, size()`() {
        assertEquals(4, QlicFrame.ConnectionCloseApplication(10, byteArrayOf(1)).size())
    }

    @Test
    fun `ConnectionCloseApplication, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.ConnectionCloseApplication(10, byteArrayOf(1)).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(0x1D, 10, 1, 1)))
    }

    @Test
    fun `ConnectionCloseApplication, toString()`() {
        QlicFrame.ConnectionCloseApplication(10, byteArrayOf(1)).toString()
    }

    @Test
    fun `StreamData, size()`() {
        assertEquals(5, QlicFrame.StreamData(1, true, false, byteArrayOf(1, 2)).size())
    }

    @Test
    fun `StreamData, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.StreamData(1, true, false, byteArrayOf(1, 2)).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(9, 1, 2, 1, 2)))
    }

    @Test
    fun `StreamData, toString()`() {
        QlicFrame.StreamData(1, true, false, byteArrayOf(1, 2)).toString()
    }

    @Test
    fun `StreamData, calculateMaxPayloadSize(), bufferCapacity = 0`() {
        assertEquals(0, QlicFrame.StreamData.calculateMaxPayloadSize(1, 0))
    }

    @Test
    fun `StreamData, calculateMaxPayloadSize(), bufferCapacity = 3`() {
        assertEquals(0, QlicFrame.StreamData.calculateMaxPayloadSize(1, 3))
    }

    @Test
    fun `StreamData, calculateMaxPayloadSize(), bufferCapacity = 10`() {
        assertEquals(7, QlicFrame.StreamData.calculateMaxPayloadSize(1, 10))
    }

    @Test
    fun `StreamReset, size()`() {
        assertEquals(3, QlicFrame.StreamReset(10, 1).size())
    }

    @Test
    fun `StreamReset, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.StreamReset(10, 1).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(4, 10, 1)))
    }

    @Test
    fun `StreamReset, toString()`() {
        QlicFrame.StreamReset(10, 1).toString()
    }


    @Test
    fun `StreamStopSending, size()`() {
        assertEquals(3, QlicFrame.StreamStopSending(10, 1).size())
    }

    @Test
    fun `StreamStopSending, serialize()`() {
        val output = ByteArrayOutputStream()
        QlicFrame.StreamStopSending(10, 1).serialize(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(5, 10, 1)))
    }

    @Test
    fun `StreamStopSending, toString()`() {
        QlicFrame.StreamStopSending(10, 1).toString()
    }
}
