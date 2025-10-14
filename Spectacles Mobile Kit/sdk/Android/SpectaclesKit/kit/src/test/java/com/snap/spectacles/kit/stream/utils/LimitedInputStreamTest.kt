package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.ArgumentMatchers.eq
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.io.InputStream

@RunWith(JUnit4::class)
class LimitedInputStreamTest : KitBaseTest() {

    private val underlying = mock<InputStream>()

    @Test
    fun `close(), closing underlying`() {
        val subject = LimitedInputStream(underlying, 100, true)
        subject.close()
        verify(underlying).close()
    }

    @Test
    fun `close(), not closing underlying`() {
        val subject = LimitedInputStream(underlying, 100, false)
        subject.close()
        verify(underlying, never()).close()
    }

    @Test
    fun `available(), within limit`() {
        whenever(underlying.available()).thenReturn(10)
        val subject = LimitedInputStream(underlying, 100, false)
        assertEquals(10, subject.available())
    }

    @Test
    fun `available(), beyond limit`() {
        whenever(underlying.available()).thenReturn(1000)
        val subject = LimitedInputStream(underlying, 100, false)
        assertEquals(100, subject.available())
    }

    @Test
    fun `read()`() {
        whenever(underlying.read()).thenReturn(11)
        val subject = LimitedInputStream(underlying, 100, false)
        assertEquals(11, subject.read())
    }

    @Test
    fun `read(), EOF`() {
        whenever(underlying.read()).thenReturn(-1)
        val subject = LimitedInputStream(underlying, 100, false)
        assertEquals(-1, subject.read())
    }

    @Test
    fun `read(), beyond limit`() {
        whenever(underlying.read()).thenReturn(10)
        val subject = LimitedInputStream(underlying, 0, false)
        assertEquals(-1, subject.read())
    }

    @Test
    fun `read(bytes)`() {
        whenever(underlying.read(any(), any(), any())).thenReturn(10)
        val subject = LimitedInputStream(underlying, 100, false)
        assertEquals(10, subject.read(ByteArray(10), 0, 10))
        verify(underlying).read(any(), eq(0), eq(10))
    }

    @Test
    fun `read(bytes), partially`() {
        whenever(underlying.read(any(), any(), any())).thenReturn(13)
        val subject = LimitedInputStream(underlying, 13, false)
        assertEquals(13, subject.read(ByteArray(10), 0, 20))
        verify(underlying).read(any(), eq(0), eq(13))
    }

    @Test
    fun `read(bytes), EOF`() {
        whenever(underlying.read(any(), any(), any())).thenReturn(-1)
        val subject = LimitedInputStream(underlying, 100, false)
        assertEquals(-1, subject.read(ByteArray(10), 0, 20))
    }

    @Test
    fun `read(bytes), beyond limit`() {
        whenever(underlying.read(any(), any(), any())).thenReturn(10)
        val subject = LimitedInputStream(underlying, 0, false)
        assertEquals(-1, subject.read(ByteArray(10), 0, 20))
    }
}
