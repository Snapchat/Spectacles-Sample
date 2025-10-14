package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class QlicTrafficManagerTest : KitBaseTest() {

    private var clock = 0L

    private val subject = QlicTrafficManager(200, 100) { clock }

    @Test
    fun `updateReceivedBytes()`() {
        clock = 10L
        subject.updateReceivedBytes(100)
        assertEquals(100, subject.updateAcknowledgedReceivedBytes())
        clock = 20L
        assertEquals(10, subject.getTrafficIdleDuration())
    }

    @Test
    fun `updateAcknowledgedReceivedBytes()`() {
        subject.updateReceivedBytes(100)
        assertEquals(100, subject.updateAcknowledgedReceivedBytes())
        assertEquals(0, subject.updateAcknowledgedReceivedBytes())
    }

    @Test
    fun `updateSentBytes()`() {
        clock = 10L
        subject.updateSentBytes(100)
        assertTrue(subject.isPingRequired())
        clock = 20L
        assertEquals(10, subject.getTrafficIdleDuration())
    }

    @Test
    fun `updateAcknowledgedSentBytes()`() {
        subject.updateSentBytes(200)
        assertTrue(subject.isThrottlingRequired())

        subject.updateAcknowledgedSentBytes(1)
        assertFalse(subject.isThrottlingRequired())
    }

    @Test
    fun `updatePingSentBytes()`() {
        subject.updateSentBytes(100)
        assertTrue(subject.isPingRequired())

        subject.updatePingSentBytes()
        assertFalse(subject.isPingRequired())
    }

    @Test
    fun `Factory create()`() {
        QlicTrafficManager.Factory.create(500, 200)
    }
}
