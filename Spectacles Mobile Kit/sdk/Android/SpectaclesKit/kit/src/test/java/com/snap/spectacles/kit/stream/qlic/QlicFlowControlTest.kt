package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import com.snap.spectacles.kit.util.Log
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@RunWith(JUnit4::class)
class QlicFlowControlTest : KitBaseTest() {

    private val clock = mock<() -> Long> {
        onGeneric { invoke() } doReturn 0L
    }
    private val subject = QlicFlowControl.Default(clock)

    private val source1 = mock<QlicFlowControl.DataSource>()
    private val token1 = subject.registerDataSource(source1)

    private val source2 = mock<QlicFlowControl.DataSource>()
    private val token2 = subject.registerDataSource(source2)

    private val source3 = mock<QlicFlowControl.DataSource>()
    private val token3 = subject.registerDataSource(source3)

    @Before
    fun setup() {
        Log.provider = {
            object : Log {
                override fun enabled(): Boolean = true
                override fun verbose(message: () -> String) {
                    message.invoke()
                }
                override fun info(message: () -> String) {
                    message.invoke()
                }
                override fun debug(message: () -> String) {
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
        }
    }

    @Test
    fun `writeDataToStream(), one time`() {
        whenever(source1.getPriority()).thenReturn(1)
        token1.notifyDataAvailable()
        verify(source1).getPriority()
        clearInvocations(source1)

        val callback = mock<() -> Unit>()
        whenever(source1.writeDataToStream(any(), any())).thenReturn(10 to callback)
        whenever(source1.getPriority()).thenReturn(null)

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 100)
        assertEquals(10, result.first)
        verify(source1).writeDataToStream(any(), eq(100))
        verify(source1).getPriority()

        result.second?.invoke()
        verify(callback).invoke()
    }

    @Test
    fun `writeDataToStream(), size limit`() {
        whenever(source1.getPriority()).thenReturn(1)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()

        whenever(source1.getPriority()).thenReturn(null)

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 100)
        assertEquals(100, result.first)
        verify(source1, never()).writeDataToStream(any(), any())
        verify(source2).writeDataToStream(any(), eq(100))
    }

    @Test
    fun `writeDataToStream(), zero`() {
        whenever(source1.getPriority()).thenReturn(1)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(0 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()

        whenever(source1.getPriority()).thenReturn(null)

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 100)
        assertEquals(100, result.first)
        verify(source1).writeDataToStream(any(), eq(100))
        verify(source2).writeDataToStream(any(), eq(100))
    }

    @Test
    fun `writeDataToStream(), sequence`() {
        whenever(source1.getPriority()).thenReturn(1)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()

        whenever(source1.getPriority()).thenReturn(null)
        whenever(source2.getPriority()).thenReturn(null)

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 100)
        assertEquals(100, result.first)
        verify(source1, never()).writeDataToStream(any(), any())
        verify(source2).writeDataToStream(any(), eq(100))

        assertEquals(true, subject.waitForData(1000))
        val result2 = subject.writeDataToStream(mock(), 100)
        assertEquals(100, result2.first)
        verify(source1).writeDataToStream(any(), eq(100))
        verify(source2).writeDataToStream(any(), any())
    }

    @Test
    fun `writeDataToStream(), requeue with same priority`() {
        whenever(source1.getPriority()).thenReturn(1)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source3.getPriority()).thenReturn(2)
        whenever(source3.writeDataToStream(any(), any())).thenReturn(3 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()
        token3.notifyDataAvailable()

        whenever(source2.getPriority()).thenReturn(4)
        whenever(source3.getPriority()).thenReturn(null)

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 408)
        assertEquals(203, result.first)
        verify(source2).writeDataToStream(any(), eq(408))
        verify(source3).writeDataToStream(any(), eq(308))
        verify(source1).writeDataToStream(any(), eq(305))
    }

    @Test
    fun `writeDataToStream(), requeue with next priority`() {
        whenever(source1.getPriority()).thenReturn(1)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source3.getPriority()).thenReturn(2)
        whenever(source3.writeDataToStream(any(), any())).thenReturn(3 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()
        token3.notifyDataAvailable()

        whenever(source2.getPriority()).thenReturn(3)
        whenever(source3.getPriority()).thenReturn(null)

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 208)
        assertEquals(200, result.first)
        verify(source2).writeDataToStream(any(), eq(208))
        verify(source2).writeDataToStream(any(), eq(108))
    }

    @Test
    fun `writeDataToStream(), requeue with lower existent priority`() {
        whenever(source1.getPriority()).thenReturn(1)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source3.getPriority()).thenReturn(2)
        whenever(source3.writeDataToStream(any(), any())).thenReturn(3 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()
        token3.notifyDataAvailable()

        whenever(source2.getPriority()).thenReturn(1)
        whenever(source3.getPriority()).thenReturn(null)

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 208)
        assertEquals(203, result.first)
        verify(source2).writeDataToStream(any(), eq(208))
        verify(source3).writeDataToStream(any(), eq(108))
        verify(source1).writeDataToStream(any(), eq(105))
        verify(source2).writeDataToStream(any(), any())
    }

    @Test
    fun `writeDataToStream(), throttling`() {
        whenever(source1.getPriority()).thenReturn(1)
        token1.notifyDataAvailable()
        verify(source1).getPriority()
        clearInvocations(source1)

        val callback = mock<() -> Unit>()
        whenever(source1.writeDataToStream(any(), any())).thenReturn(10 to callback)
        whenever(source1.getPriority()).thenReturn(null)

        subject.startThrottling(2)
        val latch = CountDownLatch(1)
        val thread = Thread {
            subject.waitForData(1000)
            latch.countDown()
        }
        thread.isDaemon = true
        thread.start()

        assertFalse(latch.await(200, TimeUnit.MILLISECONDS))
        subject.shutdown()
    }

    @Test
    fun `writeDataToStream(), stop throttling`() {
        whenever(source1.getPriority()).thenReturn(1)
        token1.notifyDataAvailable()
        verify(source1).getPriority()
        clearInvocations(source1)

        val callback = mock<() -> Unit>()
        whenever(source1.writeDataToStream(any(), any())).thenReturn(10 to callback)
        whenever(source1.getPriority()).thenReturn(null)

        subject.startThrottling(2)
        val latch = CountDownLatch(1)
        val thread = Thread {
            assertEquals(true, subject.waitForData(1000))
            val result = subject.writeDataToStream(mock(), 100)
            assertEquals(10, result.first)
            verify(source1).writeDataToStream(any(), eq(100))
            verify(source1).getPriority()

            latch.countDown()
        }
        thread.isDaemon = true
        thread.start()

        assertFalse(latch.await(200, TimeUnit.MILLISECONDS))
        subject.stopThrottling()
        assertTrue(latch.await(500, TimeUnit.MILLISECONDS))
    }

    @Test
    fun `waitForData(), timeout`() {
        assertEquals(false, subject.waitForData(1))
    }

    @Test
    fun `shutdown()`() {
        subject.shutdown()
        assertEquals(null, subject.waitForData(1000))
    }

    @Test
    fun `TokenImpl notifyDataAvailable(), higher priority`() {
        whenever(source1.getPriority()).thenReturn(1)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()

        whenever(source1.getPriority()).thenReturn(6)
        token1.notifyDataAvailable()

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 100)
        assertEquals(100, result.first)
        verify(source1).writeDataToStream(any(), eq(100))
        verify(source2, never()).writeDataToStream(any(), any())
    }

    @Test
    fun `TokenImpl notifyDataAvailable(), lower priority`() {
        whenever(source1.getPriority()).thenReturn(6)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()

        whenever(source1.getPriority()).thenReturn(1)
        token1.notifyDataAvailable()

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 100)
        assertEquals(100, result.first)
        verify(source2).writeDataToStream(any(), eq(100))
        verify(source1, never()).writeDataToStream(any(), any())
    }

    @Test
    fun `TokenImpl notifyDataAvailable(), same priority`() {
        whenever(source1.getPriority()).thenReturn(6)
        whenever(source1.writeDataToStream(any(), any())).thenReturn(100 to null)
        whenever(source2.getPriority()).thenReturn(4)
        whenever(source2.writeDataToStream(any(), any())).thenReturn(100 to null)
        token1.notifyDataAvailable()
        token2.notifyDataAvailable()

        whenever(source1.getPriority()).thenReturn(6)
        token1.notifyDataAvailable()

        assertEquals(true, subject.waitForData(1000))
        val result = subject.writeDataToStream(mock(), 100)
        assertEquals(100, result.first)
        verify(source2, never()).writeDataToStream(any(), any())
        verify(source1).writeDataToStream(any(), eq(100))
    }

    @Test
    fun `TokenImpl unregister()`() {
        token1.unregister()
    }

    @Test
    fun `Factory create()`() {
        QlicFlowControl.Default.Factory.create()
    }
}
