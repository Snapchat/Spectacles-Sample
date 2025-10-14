package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.doThrow
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import java.io.Closeable
import java.io.IOException

@RunWith(JUnit4::class)
class CompositeCloseableTest : KitBaseTest() {

    private val subject = CompositeCloseable()

    @Test
    fun `add(), and close()`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        verify(c1, never()).close()
        verify(c2, never()).close()

        subject.close()
        verify(c1).close()
        verify(c2).close()
    }

    @Test
    fun `add(), multiple times`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c1)
        subject.add(c2)
        subject.add(c1)
        verify(c1, never()).close()
        verify(c2, never()).close()

        subject.close()
        verify(c1).close()
        verify(c2).close()
    }

    @Test
    fun `add(), after close()`() {
        val c1 = mock<Closeable>()

        subject.close()
        subject.add(c1)
        verify(c1).close()
    }

    @Test
    fun `delete()`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        assertTrue(subject.delete(c1))

        subject.close()
        verify(c1, never()).close()
        verify(c2).close()
    }

    @Test
    fun `delete(), not-existent`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        assertFalse(subject.delete(mock()))

        subject.close()
        verify(c1).close()
        verify(c2).close()
    }

    @Test
    fun `delete(), after close()`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        subject.close()
        verify(c1).close()
        verify(c2).close()

        assertFalse(subject.delete(mock()))
    }

    @Test
    fun `remove()`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        subject.remove(c1)
        verify(c1).close()
        verify(c2, never()).close()
    }

    @Test
    fun `remove(), not-existent`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        subject.remove(mock())
        verify(c1, never()).close()
        verify(c2, never()).close()
    }

    @Test
    fun `clear()`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        subject.clear()
        verify(c1).close()
        verify(c2).close()

        val c3 = mock<Closeable>()
        subject.add(c3)
        verify(c3, never()).close()

        subject.clear()
        verify(c1).close()
        verify(c2).close()
        verify(c3).close()
    }

    @Test
    fun `close()`() {
        val c1 = mock<Closeable>()
        val c2 = mock<Closeable>()

        subject.add(c1)
        subject.add(c2)
        subject.close()
        verify(c1).close()
        verify(c2).close()

        subject.close()
        verify(c1).close()
        verify(c2).close()
    }

    @Test
    fun `safelyClose()`() {
        val c1 = mock<Closeable> {
            on { close() } doThrow IOException()
        }
        val c2 = mock<Closeable> {
            on { close() } doThrow IOException()
        }

        subject.add(c1)
        subject.add(c2)
        subject.close()
        verify(c1).close()
        verify(c2).close()
    }
}

