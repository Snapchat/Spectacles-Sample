package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class QlicStreamDataAssemblerTest : KitBaseTest() {

    private val subject = QlicStreamDataAssembler()

    @Test
    fun `assembleStreamData(), single`() {
        val frame = QlicFrame.StreamData(1, false, true, byteArrayOf(1, 2, 3))
        val data = subject.assembleStreamData(frame)
        assertEquals(data!!.priority, 0)
        assertFalse(data.last)
        assertTrue(data.payload.getInputStream().readBytes().contentEquals(byteArrayOf(1, 2, 3)))
    }

    @Test
    fun `assembleStreamData(), single, not last`() {
        val frame = QlicFrame.StreamData(1, false, false, byteArrayOf(1, 2, 3))
        assertEquals(null, subject.assembleStreamData(frame))
    }

    @Test
    fun `assembleStreamData(), multiple, not last`() {
        val frame = QlicFrame.StreamData(1, false, false, byteArrayOf(1, 2, 3))
        assertEquals(null, subject.assembleStreamData(frame))
        val frame2 = QlicFrame.StreamData(1, false, false, byteArrayOf(1))
        assertEquals(null, subject.assembleStreamData(frame2))
    }

    @Test
    fun `assembleStreamData(), multiple`() {
        val frame = QlicFrame.StreamData(1, false, false, byteArrayOf(1, 2, 3))
        assertEquals(null, subject.assembleStreamData(frame))
        val frame2 = QlicFrame.StreamData(1, false, false, byteArrayOf(4))
        assertEquals(null, subject.assembleStreamData(frame2))

        val frame3 = QlicFrame.StreamData(2 * 4, true, true, byteArrayOf(5))
        val data = subject.assembleStreamData(frame3)
        assertEquals(data!!.priority, 2)
        assertTrue(data.last)
        assertTrue(data.payload.getInputStream().readBytes().contentEquals(byteArrayOf(1, 2, 3, 4, 5)))
    }

    @Test
    fun `assembleStreamData(), multiple, last`() {
        val frame = QlicFrame.StreamData(1, false, false, byteArrayOf(1, 2, 3))
        assertEquals(null, subject.assembleStreamData(frame))
        val frame2 = QlicFrame.StreamData(1, false, true, byteArrayOf(4))
        val data = subject.assembleStreamData(frame2)
        assertEquals(data!!.priority, 0)
        assertFalse(data.last)
        assertTrue(data.payload.getInputStream().readBytes().contentEquals(byteArrayOf(1, 2, 3, 4)))

        val frame3 = QlicFrame.StreamData(1, false, false, byteArrayOf(5))
        assertEquals(null, subject.assembleStreamData(frame3))
        val frame4 = QlicFrame.StreamData(2 * 4, true, true, byteArrayOf(6))
        val data2 = subject.assembleStreamData(frame4)
        assertEquals(data2!!.priority, 2)
        assertTrue(data2.last)
        assertTrue(data2.payload.getInputStream().readBytes().contentEquals(byteArrayOf(5, 6)))
    }
}
