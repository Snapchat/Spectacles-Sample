package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class QlicHandshakeAssemblerTest : KitBaseTest() {

    private val subject = QlicHandshakeAssembler()

    @Test
    fun `assembleHandshake(), single`() {
        val frame = QlicFrame.Crypto(true, byteArrayOf(2, 1, 2, 3, 0, 1, 2))
        val handshake = subject.assembleHandshake(frame)
        assertTrue((handshake as QlicHandshake.ServerHello).serverNonce.contentEquals(byteArrayOf(2)))
        assertTrue(handshake.serverSessionKey.contentEquals(byteArrayOf(0, 1, 2)))
    }

    @Test
    fun `assembleHandshake(), single, not last`() {
        val frame = QlicFrame.Crypto(false, byteArrayOf(2, 1, 2))
        assertEquals(null, subject.assembleHandshake(frame))
    }

    @Test
    fun `assembleHandshake(), multiple, not last`() {
        val frame = QlicFrame.Crypto(false, byteArrayOf(2, 1, 2))
        assertEquals(null, subject.assembleHandshake(frame))
        val frame2 = QlicFrame.Crypto(false, byteArrayOf(3, 0, 1))
        assertEquals(null, subject.assembleHandshake(frame2))
    }

    @Test
    fun `assembleHandshake(), multiple`() {
        val frame = QlicFrame.Crypto(false, byteArrayOf(2, 1, 2))
        assertEquals(null, subject.assembleHandshake(frame))
        val frame2 = QlicFrame.Crypto(false, byteArrayOf(3, 0, 1))
        assertEquals(null, subject.assembleHandshake(frame2))

        val frame3 = QlicFrame.Crypto(true, byteArrayOf(2))
        val handshake = subject.assembleHandshake(frame3)
        assertTrue((handshake as QlicHandshake.ServerHello).serverNonce.contentEquals(byteArrayOf(2)))
        assertTrue(handshake.serverSessionKey.contentEquals(byteArrayOf(0, 1, 2)))
    }

    @Test
    fun `assembleHandshake(), multiple, last`() {
        val frame = QlicFrame.Crypto(false, byteArrayOf(2, 1, 2))
        assertEquals(null, subject.assembleHandshake(frame))
        val frame2 = QlicFrame.Crypto(true, byteArrayOf(3, 0, 1, 2))
        val handshake = subject.assembleHandshake(frame2)
        assertTrue((handshake as QlicHandshake.ServerHello).serverNonce.contentEquals(byteArrayOf(2)))
        assertTrue(handshake.serverSessionKey.contentEquals(byteArrayOf(0, 1, 2)))

        val frame3 = QlicFrame.Crypto(false, byteArrayOf(2, 1, 0))
        assertEquals(null, subject.assembleHandshake(frame3))
        val frame4 = QlicFrame.Crypto(true, byteArrayOf(2, 1, 2))
        val handshake2 = subject.assembleHandshake(frame4)
        assertTrue((handshake2 as QlicHandshake.ServerHello).serverNonce.contentEquals(byteArrayOf(0)))
        assertTrue(handshake2.serverSessionKey.contentEquals(byteArrayOf(1, 2)))
    }
}
