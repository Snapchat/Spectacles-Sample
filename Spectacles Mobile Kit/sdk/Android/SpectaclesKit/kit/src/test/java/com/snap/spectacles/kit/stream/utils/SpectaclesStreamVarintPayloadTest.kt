package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class SpectaclesStreamVarintPayloadTest : KitBaseTest() {

    @Test
    fun `getInputStream()`() {
        val subject = SpectaclesStreamVarintPayload(0x14000)
        assertEquals(0x14000, subject.getInputStream().readVarint())
    }

    @Test
    fun `get size`() {
        val subject = SpectaclesStreamVarintPayload(0x2000)
        assertEquals(2, subject.size)
    }

    @Test
    fun `toString()`() {
        SpectaclesStreamVarintPayload(12).toString()
    }
}
