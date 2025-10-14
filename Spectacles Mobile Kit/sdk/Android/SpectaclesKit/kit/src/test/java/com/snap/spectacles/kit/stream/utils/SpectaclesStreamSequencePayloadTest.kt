package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify

@RunWith(JUnit4::class)
class SpectaclesStreamSequencePayloadTest : KitBaseTest() {

    private val c1 = mock<SpectaclesStreamPayload> {
        on { size } doReturn 10
        on { getInputStream() } doReturn mock()
    }

    private val c2 = mock<SpectaclesStreamPayload> {
        on { size } doReturn 101
        on { getInputStream() } doReturn mock()
    }

    private val subject = SpectaclesStreamSequencePayload(c1, c2)

    @Test
    fun `getInputStream()`() {
        subject.getInputStream()
        verify(c1).getInputStream()
        verify(c2).getInputStream()
    }

    @Test
    fun `get size`() {
        assertEquals(111, subject.size)
        verify(c1).size
        verify(c2).size
    }

    @Test
    fun `toString()`() {
        subject.toString()
    }
}
