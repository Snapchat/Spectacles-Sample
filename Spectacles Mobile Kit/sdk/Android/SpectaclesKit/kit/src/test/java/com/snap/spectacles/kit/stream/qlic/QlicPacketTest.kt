package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

@RunWith(JUnit4::class)
class QlicPacketTest : KitBaseTest() {

    @Test
    fun `In readFrom(), not-null`() {
        val input = ByteArrayInputStream(byteArrayOf(2, 1, 3))
        assertNotNull(QlicPacket.In.readFrom(input))
    }
    @Test
    fun `In readFrom(), null`() {
        val input = ByteArrayInputStream(byteArrayOf())
        assertNull(QlicPacket.In.readFrom(input))
    }

    @Test
    fun `In getBody()`() {
        val buf = ByteArray(10)
        val data = byteArrayOf(1, 3, 5)
        val subject = QlicPacket.In(data)
        subject.getBody().use {
            assertEquals(3, it.read(buf))
        }
        assertTrue(buf.copyOfRange(0, 3).contentEquals(data))
    }

    @Test
    fun `In size()`() {
        val subject1 = QlicPacket.In(byteArrayOf(1, 3, 5))
        assertEquals(4, subject1.size())

        val subject2 = QlicPacket.In(ByteArray(100))
        assertEquals(102, subject2.size())
    }

    @Test
    fun `In toString()`() {
        QlicPacket.In(byteArrayOf(1, 3, 5)).toString()
    }

    @Test
    fun `Out size()`() {
        val subject = QlicPacket.Out(100)
        assertEquals(1, subject.size())

        subject.getBody().write(byteArrayOf(1, 2, 3))
        assertEquals(4, subject.size())
    }
    @Test
    fun `Out writeTo()`() {
        val subject = QlicPacket.Out(100)
        subject.getBody().write(byteArrayOf(1, 2, 3))

        val output = ByteArrayOutputStream()
        subject.writeTo(output)
        assertTrue(output.toByteArray().contentEquals(byteArrayOf(3, 1, 2, 3)))
    }

    @Test
    fun `Out toString()`() {
        QlicPacket.Out(100).toString()
    }
}
