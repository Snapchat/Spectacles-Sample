package com.snap.spectacles.kit.util

import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class LogTest {

    private val message = mock<() -> String> {
        on { invoke() } doReturn "TEST"
    }

    @Test
    fun `test with Disable`() {
        Log.provider = null
        val log = Log.get("TEST")
        assertEquals(false, log.enabled())
        log.verbose(message)
        log.info(message)
        log.debug(message)
        log.warn(message)
        log.warn(Exception(), message)
        log.err(message)
        log.err(Exception(), message)
        verify(message, never()).invoke()
    }

    @Test
    fun `test with System`() {
        Log.provider = { it -> Log.System(it) }
        val log = Log.get("TEST")
        assertEquals(true, log.enabled())
        log.verbose(message)
        verify(message, times(1)).invoke()
        log.info(message)
        verify(message, times(2)).invoke()
        log.debug(message)
        verify(message, times(3)).invoke()
        log.warn(message)
        verify(message, times(4)).invoke()
        log.warn(Exception(), message)
        verify(message, times(5)).invoke()
        log.err(message)
        verify(message, times(6)).invoke()
        log.err(Exception(), message)
        verify(message, times(7)).invoke()
    }

    @Test
    fun `test with LogStub`() {
        Log.provider = { _ -> LogStub() }
        val log = Log.get("TEST")
        assertEquals(true, log.enabled())
        log.verbose(message)
        verify(message, times(1)).invoke()
        log.info(message)
        verify(message, times(2)).invoke()
        log.debug(message)
        verify(message, times(3)).invoke()
        log.warn(message)
        verify(message, times(4)).invoke()
        log.warn(Exception(), message)
        verify(message, times(5)).invoke()
        log.err(message)
        verify(message, times(6)).invoke()
        log.err(Exception(), message)
        verify(message, times(7)).invoke()
    }
}

class LogStub : Log {
    override fun enabled(): Boolean = true

    override fun verbose(message: () -> String) {
        message.invoke()
    }

    override fun info(message: () -> String) {
        message.invoke()
    }

    override fun debug(message: () -> String)  {
        message.invoke()
    }

    override fun warn(message: () -> String) {
        message.invoke()
    }

    override fun warn(throwable: Throwable, message: () -> String) {
        message.invoke()
    }

    override fun err(message: () -> String) {
        message.invoke()
    }

    override fun err(throwable: Throwable, message: () -> String) {
        message.invoke()
    }
}
