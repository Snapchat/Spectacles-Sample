package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class SpectaclesStreamLdrPayloadTest : KitBaseTest() {

    private val subject = SpectaclesStreamLdrPayload(ByteArray(30))

    @Test
    fun `getInputStream()`() {
        assertEquals(30, subject.getInputStream().read())
    }

    @Test
    fun `get size`() {
        assertEquals(31, subject.size)
    }

    @Test
    fun `toString()`() {
        subject.toString()
    }
}
