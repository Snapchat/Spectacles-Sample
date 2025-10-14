package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import java.io.Closeable

@RunWith(JUnit4::class)
class CloseGuardTest : KitBaseTest() {

    private val closeable = mock<Closeable>()

    private val subject = CloseGuard(closeable)

    @Test
    fun `close()`() {
        assertEquals(false, subject.isClosed())
        subject.close()
        verify(closeable).close()
        assertEquals(true, subject.isClosed())
    }

    @Test
    fun `close(), multiple`() {
        subject.close()
        verify(closeable).close()
        clearInvocations(closeable)

        subject.close()
        verify(closeable, never()).close()
    }
}
