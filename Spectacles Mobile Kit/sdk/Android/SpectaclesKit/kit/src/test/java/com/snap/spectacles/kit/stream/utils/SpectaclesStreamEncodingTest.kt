package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.ArgumentMatchers.eq
import org.mockito.kotlin.any
import org.mockito.kotlin.argThat
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.io.OutputStream

@RunWith(JUnit4::class)
class SpectaclesStreamEncodingTest : KitBaseTest() {

    @Test
    fun `getVarintSize()`() {
        assertEquals(1, 0x3F.getVarintSize())
        assertEquals(2, 0x40.getVarintSize())
        assertEquals(2, 0x3FFF.getVarintSize())
        assertEquals(4, 0x4000.getVarintSize())
        assertEquals(4, 0x3FFFFFFF.getVarintSize())
        assertEquals(8, 0x40000000.getVarintSize())
    }

    @Test
    fun `toVarintBytes(), 1 byte`() {
        assertTrue(
            1.toVarintBytes().contentEquals(byteArrayOf(1))
        )
    }

    @Test
    fun `toVarintBytes(), 2 bytes`() {
        assertTrue(
            0x110.toVarintBytes().contentEquals(byteArrayOf(0x41, 0x10))
        )
    }

    @Test
    fun `toVarintBytes(), 4 bytes`() {
        assertTrue(
            0x20000000.toVarintBytes().contentEquals(byteArrayOf(0xA0.toByte(), 0x00, 0x00, 0x00))
        )
    }

    @Test
    fun `toVarintBytes(), 8 bytes`() {
        assertTrue(
            0x50000000.toVarintBytes()
                .contentEquals(byteArrayOf(0xC0.toByte(), 0x00, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00))
        )
    }

    @Test
    fun `toVarintBytes(), negative`() {
        assertTrue(
            (-1).toVarintBytes().contentEquals(
                byteArrayOf(
                    0xC0.toByte(), 0x00, 0x00, 0x00, 0xFF.toByte(), 0xFF.toByte(), 0xFF.toByte(), 0xFF.toByte()
                )
            )
        )
    }

    @Test
    fun `readVarint(), 1 byte`() {
        val varint = ByteArrayInputStream(byteArrayOf(1))
            .readVarint()
        assertEquals(1, varint)
    }

    @Test
    fun `readVarint(), 2 bytes`() {
        val varint = ByteArrayInputStream(byteArrayOf(0x41, 0x10))
            .readVarint()
        assertEquals(0x110, varint)
    }

    @Test
    fun `readVarint(), 4 bytes`() {
        val varint = ByteArrayInputStream(byteArrayOf(0xA0.toByte(), 0x00, 0x00, 0x00))
            .readVarint()
        assertEquals(0x20000000, varint)
    }

    @Test
    fun `readVarint(), 8 bytes`() {
        val varint = ByteArrayInputStream(byteArrayOf(0xC0.toByte(), 0x00, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00))
            .readVarint()
        assertEquals(0x50000000, varint)
    }

    @Test
    fun `readVarint(), negative`() {
        val varint = ByteArrayInputStream(
            byteArrayOf(
                0xC0.toByte(), 0x00, 0x00, 0x00, 0xFF.toByte(), 0xFF.toByte(), 0xFF.toByte(), 0xFF.toByte()
            )
        )
            .readVarint()
        assertEquals(-1, varint)
    }

    @Test
    fun `readVarint(), EOF`() {
        assertEquals(null, ByteArrayInputStream(byteArrayOf()).readVarint())
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `readVarint(), malformed`() {
        ByteArrayInputStream(byteArrayOf(0xC0.toByte(), 0x00, 0x00, 0x00, 0x50))
            .readVarint()
    }

    @Test
    fun `writeVarint()`() {
        val output = mock<OutputStream>()
        output.writeVarint(0x20000000)

        val captor = argumentCaptor<ByteArray>()
        verify(output).write(captor.capture())
        assertTrue(captor.firstValue.contentEquals(byteArrayOf(0xA0.toByte(), 0x00, 0x00, 0x00)))
    }

    @Test
    fun `getLengthDelimitedRecordSize()`() {
        assertEquals(3, byteArrayOf(1, 2).getLengthDelimitedRecordSize())
    }

    @Test
    fun `readLengthDelimitedRecord()`() {
        val input = ByteArrayInputStream(byteArrayOf(2, 1, 2))
        assertTrue(input.readLengthDelimitedRecord().contentEquals(byteArrayOf(1, 2)))
    }

    @Test
    fun `readLengthDelimitedRecord(), EOF`() {
        val input = ByteArrayInputStream(byteArrayOf())
        assertEquals(null, input.readLengthDelimitedRecord())
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `readLengthDelimitedRecord(), beyond limit`() {
        val input = ByteArrayInputStream(byteArrayOf(0xA0.toByte(), 0x00, 0x00, 0x00, 0, 0))
        assertEquals(null, input.readLengthDelimitedRecord())
    }

    @Test
    fun `writeLengthDelimitedRecord()`() {
        val output = mock<OutputStream>()
        val data = byteArrayOf(1, 2)
        output.writeLengthDelimitedRecord(data)
        verify(output).write(
            argThat<ByteArray> { contentEquals(byteArrayOf(2)) }
        )
        verify(output).write(data)
    }

    @Test
    fun `readBytes()`() {
        val input = mock<InputStream>()
        whenever(input.read(any(), any(), any())).thenReturn(5, 5, 5)
        val result = input.readBytes(10)
        assertEquals(10, result.size)
        verify(input).read(any(), any(), eq(10))
        verify(input).read(any(), any(), eq(5))
    }

    @Test(expected = SpectaclesStreamException::class)
    fun `readBytes(), EOF`() {
        val input = mock<InputStream>()
        whenever(input.read(any(), any(), any())).thenReturn(5, -1)
        input.readBytes(10)
    }
}
