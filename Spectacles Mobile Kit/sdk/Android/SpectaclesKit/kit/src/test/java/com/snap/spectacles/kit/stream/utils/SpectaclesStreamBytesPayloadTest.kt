package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class SpectaclesStreamBytesPayloadTest : KitBaseTest() {

    @Test
    fun `getInputStream()`() {
        val data = ByteArray(15) { it.toByte() }
        val subject = SpectaclesStreamBytesPayload(data, 5, 2)

        val result = ByteArray(15)
        assertEquals(2, subject.getInputStream().read(result))
        assertEquals(5, result[0].toInt())
        assertEquals(6, result[1].toInt())
    }

    @Test
    fun `toString()`() {
        SpectaclesStreamBytesPayload(byteArrayOf(1)).toString()
    }

    @Test
    fun `Empty check`() {
        assertEquals(0, SpectaclesStreamBytesPayload.Empty.size)
    }
}
