package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.mock
import java.io.InputStream

@RunWith(JUnit4::class)
class SpectaclesStreamLazyPayloadTest : KitBaseTest() {

    @Test
    fun `getInputStream()`() {
        val inputStream = mock<InputStream>()
        val subject = SpectaclesStreamLazyPayload(12) { inputStream }

        assertEquals(inputStream, subject.getInputStream())
    }

    @Test
    fun `get size`() {
        val subject = SpectaclesStreamLazyPayload(12, mock())
        assertEquals(12, subject.size)
    }

    @Test
    fun `toString()`() {
        SpectaclesStreamLazyPayload(12, mock()).toString()
    }
}
