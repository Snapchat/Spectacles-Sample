package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class QlicStreamIdTest : KitBaseTest() {

    @Test
    fun `compact()`() {
        assertEquals(0, QlicStreamId.compact(0, 0, false, false))
        assertEquals(0x2009, QlicStreamId.compact(0x80, 0x02, false, true))
        assertEquals(0x405E, QlicStreamId.compact(0x101, 0x07, true, false))
    }

    @Test
    fun `constructor(), compact()`() {
        val s1 = QlicStreamId(0)
        assertEquals(0, s1.id)
        assertEquals(0, s1.urgency)
        assertEquals(false, s1.isUnidirectional)
        assertEquals(false, s1.isClientInitiated)
        assertEquals(0, s1.compact)

        val s2 = QlicStreamId(0x2009)
        assertEquals(128, s2.id)
        assertEquals(2, s2.urgency)
        assertEquals(false, s2.isUnidirectional)
        assertEquals(true, s2.isClientInitiated)
        assertEquals(0x2009, s2.compact)

        val s3 = QlicStreamId(0x405E)
        assertEquals(257, s3.id)
        assertEquals(7, s3.urgency)
        assertEquals(true, s3.isUnidirectional)
        assertEquals(false, s3.isClientInitiated)
        assertEquals(0x405E, s3.compact)
    }

    @Test
    fun `constructor(), detailed()`() {
        val s1 = QlicStreamId(0, 0, false, false)
        assertEquals(0, s1.id)
        assertEquals(0, s1.urgency)
        assertEquals(false, s1.isUnidirectional)
        assertEquals(false, s1.isClientInitiated)
        assertEquals(0, s1.compact)

        val s2 = QlicStreamId(128, 2, false, true)
        assertEquals(128, s2.id)
        assertEquals(2, s2.urgency)
        assertEquals(false, s2.isUnidirectional)
        assertEquals(true, s2.isClientInitiated)
        assertEquals(0x2009, s2.compact)

        val s3 = QlicStreamId(257, 7, true, false)
        assertEquals(257, s3.id)
        assertEquals(7, s3.urgency)
        assertEquals(true, s3.isUnidirectional)
        assertEquals(false, s3.isClientInitiated)
        assertEquals(0x405E, s3.compact)
    }

    @Test
    fun `hashCode() different id`() {
        val s1 = QlicStreamId(257, 7, true, false)
        val s2 = QlicStreamId(256, 7, true, false)
        assertNotEquals(s1.hashCode(), s2.hashCode())
    }

    @Test
    fun `hashCode() different isClientInitiated`() {
        val s1 = QlicStreamId(257, 7, true, false)
        val s2 = QlicStreamId(257, 7, true, true)
        assertNotEquals(s1.hashCode(), s2.hashCode())
    }

    @Test
    fun `hashCode() same with different ugency`() {
        val s1 = QlicStreamId(257, 5, true, false)
        val s2 = QlicStreamId(257, 7, true, false)
        assertEquals(s1.hashCode(), s2.hashCode())
    }

    @Test
    fun `hashCode() same with different isUnidirectional`() {
        val s1 = QlicStreamId(257, 6, true, true)
        val s2 = QlicStreamId(257, 6, false, true)
        assertEquals(s1.hashCode(), s2.hashCode())
    }

    @Test
    fun `hashCode() same all`() {
        val s1 = QlicStreamId(257, 6, false, false)
        val s2 = QlicStreamId(257, 6, false, false)
        assertEquals(s1.hashCode(), s2.hashCode())
    }

    @Test
    fun `equals() different id`() {
        val s1 = QlicStreamId(257, 7, true, false)
        val s2 = QlicStreamId(256, 7, true, false)
        assertNotEquals(s1, s2)
    }

    @Test
    fun `equals() different isClientInitiated`() {
        val s1 = QlicStreamId(257, 7, true, false)
        val s2 = QlicStreamId(257, 7, true, true)
        assertNotEquals(s1, s2)
    }

    @Test
    fun `equals() same with different ugency`() {
        val s1 = QlicStreamId(257, 5, true, false)
        val s2 = QlicStreamId(257, 7, true, false)
        assertEquals(s1, s2)
    }

    @Test
    fun `equals() same with different isUnidirectional`() {
        val s1 = QlicStreamId(257, 6, true, true)
        val s2 = QlicStreamId(257, 6, false, true)
        assertEquals(s1, s2)
    }

    @Test
    fun `equals() same all`() {
        val s1 = QlicStreamId(257, 6, false, false)
        val s2 = QlicStreamId(257, 6, false, false)
        assertEquals(s1, s2)
    }

    @Test
    fun `equals() non-QlicStreamId`() {
        val s1 = QlicStreamId(257, 7, true, false)
        assertNotEquals(s1, Unit)
    }
}
