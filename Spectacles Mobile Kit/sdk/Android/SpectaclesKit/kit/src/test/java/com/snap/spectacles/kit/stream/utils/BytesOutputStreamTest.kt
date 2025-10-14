package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class BytesOutputStreamTest : KitBaseTest() {

    private val bytes = ByteArray(30)

    private val subject = BytesOutputStream(bytes, 2)

    @Test
    fun `getSpace(), init`() {
        assertEquals(28, subject.getSpace())
    }

    @Test
    fun `getAvailable(), init`() {
        assertEquals(0, subject.getAvailable())
    }

    @Test
    fun `write(), 1 byte`() {
        subject.write(1)
        assertEquals(0, bytes[0].toInt())
        assertEquals(0, bytes[1].toInt())
        assertEquals(1, bytes[2].toInt())

        assertEquals(1, subject.getAvailable())
        assertEquals(27, subject.getSpace())
    }

    @Test
    fun `write(), bytes`() {
        subject.write(byteArrayOf(1, 2, 3), 0, 2)
        assertEquals(0, bytes[0].toInt())
        assertEquals(0, bytes[1].toInt())
        assertEquals(1, bytes[2].toInt())
        assertEquals(2, bytes[3].toInt())
        assertEquals(0, bytes[4].toInt())

        assertEquals(2, subject.getAvailable())
        assertEquals(26, subject.getSpace())
    }

    @Test
    fun `write(), multiple`() {
        subject.write(1)
        subject.write(byteArrayOf(1, 2, 3), 1, 2)
        subject.write(4)
        assertEquals(0, bytes[0].toInt())
        assertEquals(0, bytes[1].toInt())
        assertEquals(1, bytes[2].toInt())
        assertEquals(2, bytes[3].toInt())
        assertEquals(3, bytes[4].toInt())
        assertEquals(4, bytes[5].toInt())
        assertEquals(0, bytes[6].toInt())

        assertEquals(4, subject.getAvailable())
        assertEquals(24, subject.getSpace())
    }
}
