package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.KitBaseTest
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.mockito.kotlin.any
import org.mockito.kotlin.clearInvocations
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import java.util.LinkedList

@RunWith(JUnit4::class)
class QlicFlowQueueTest : KitBaseTest() {

    private val token = mock<QlicFlowControl.Token>()
    private val flowControl = mock<QlicFlowControl> {
        on { registerDataSource(any()) } doReturn token
    }

    private val underlying = LinkedList<Pair<QlicPendingFrame, (() -> Unit)?>>()

    private val subjectDynamic = QlicFlowQueue.DynamicPriorityQueue(underlying)

    private val subjectFixed = QlicFlowQueue.FixedPriorityQueue(10, underlying)

    @Before
    fun setup() {
        subjectDynamic.attach(flowControl)
        subjectFixed.attach(flowControl)
    }

    @Test
    fun `FixedPriorityQueue init()`() {
        assertEquals(null, subjectFixed.getPriority())
        assertEquals(0, underlying.size)
        verify(flowControl).registerDataSource(subjectFixed)
    }

    @Test
    fun `FixedPriorityQueue detach()`() {
        subjectFixed.detach()
        verify(token).unregister()
    }

    @Test
    fun `FixedPriorityQueue addFirst(), first empty`() {
        val item1 = mock<QlicPendingFrame>()
        subjectFixed.addFirst(item1, null)

        assertEquals(10, subjectFixed.getPriority())
        assertEquals(1, underlying.size)
        assertEquals(item1, underlying.first.first)
    }

    @Test
    fun `FixedPriorityQueue addFirst(), non-empty`() {
        val item1 = mock<QlicPendingFrame>()
        subjectFixed.addFirst(item1, null)

        val item2 = mock<QlicPendingFrame>()
        subjectFixed.addFirst(item2, null)

        assertEquals(10, subjectFixed.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.first.first)
    }

    @Test
    fun `FixedPriorityQueue addLast(), empty`() {
        val item1 = mock<QlicPendingFrame>()
        subjectFixed.addLast(item1, null)

        assertEquals(10, subjectFixed.getPriority())
        assertEquals(1, underlying.size)
        assertEquals(item1, underlying.first.first)
    }

    @Test
    fun `FixedPriorityQueue addLast(), non-empty`() {
        val item1 = mock<QlicPendingFrame>()
        subjectFixed.addLast(item1, null)

        val item2 = mock<QlicPendingFrame>()
        subjectFixed.addLast(item2, null)

        assertEquals(10, subjectFixed.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.last.first)
    }

    @Test
    fun `FixedPriorityQueue writeDataToStream(), one`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame1
        }
        subjectFixed.addLast(item1, callback1)

        val (size, callback) = subjectFixed.writeDataToStream(mock(), 100)
        assertEquals(30, size)
        assertEquals(null, subjectFixed.getPriority())
        verify(item1).get(100)
        verify(frame1).serialize(any())
        callback!!.invoke()
        verify(callback1).invoke()
    }

    @Test
    fun `FixedPriorityQueue writeDataToStream(), one remaining`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn true
            on { get(any()) } doReturn frame1
        }
        subjectFixed.addLast(item1, callback1)

        val (size, callback) = subjectFixed.writeDataToStream(mock(), 100)
        assertEquals(30, size)
        assertEquals(10, subjectFixed.getPriority())
        verify(item1).get(100)
        verify(frame1).serialize(any())
        callback!!.invoke()
        verify(callback1, never()).invoke()
    }

    @Test
    fun `FixedPriorityQueue writeDataToStream(), multiple`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame1
        }
        subjectFixed.addLast(item1, callback1)

        val frame2 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback2 = mock<() -> Unit>()
        val item2 = mock<QlicPendingFrame> {
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame2
        }
        subjectFixed.addLast(item2, callback2)

        val (size, callback) = subjectFixed.writeDataToStream(mock(), 100)
        assertEquals(60, size)
        assertEquals(null, subjectFixed.getPriority())
        verify(item1).get(100)
        verify(item2).get(70)
        verify(frame1).serialize(any())
        verify(frame2).serialize(any())
        callback!!.invoke()
        verify(callback1).invoke()
        verify(callback2).invoke()
    }

    @Test
    fun `FixedPriorityQueue writeDataToStream(), remaining non-last`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame1
        }
        subjectFixed.addLast(item1, callback1)

        val frame2 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback2 = mock<() -> Unit>()
        val item2 = mock<QlicPendingFrame> {
            on { hasRemainingData() } doReturn true
            on { get(any()) } doReturn frame2
        }
        subjectFixed.addLast(item2, callback2)

        val item3 = mock<QlicPendingFrame>()
        subjectFixed.addLast(item3, null)

        val (size, callback) = subjectFixed.writeDataToStream(mock(), 100)
        assertEquals(60, size)
        assertEquals(10, subjectFixed.getPriority())
        verify(item1).get(100)
        verify(item2).get(70)
        verify(item3, never()).get(any())
        verify(frame1).serialize(any())
        verify(frame2).serialize(any())
        callback!!.invoke()
        verify(callback1).invoke()
        verify(callback2, never()).invoke()
    }

    @Test
    fun `FixedPriorityQueue remove(), non cancelable`() {
        val item1 = mock<QlicPendingFrame>()
        subjectFixed.addLast(item1, null)
        val item2 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn false
        }
        val removal = subjectFixed.addLast(item2, null)
        clearInvocations(token)

        removal.invoke()
        verify(token, never()).notifyDataAvailable()
        assertEquals(10, subjectFixed.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.last.first)
    }

    @Test
    fun `FixedPriorityQueue remove(), first`() {
        val item1 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn true
        }
        val removal = subjectFixed.addFirst(item1, null)
        val item2 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn false
        }
        subjectFixed.addLast(item2, null)
        clearInvocations(token)

        removal.invoke()
        verify(token).notifyDataAvailable()
        assertEquals(10, subjectFixed.getPriority())
        assertEquals(1, underlying.size)
        assertEquals(item2, underlying.first.first)
    }

    @Test
    fun `FixedPriorityQueue remove(), one`() {
        val item1 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn true
        }
        val removal = subjectFixed.addLast(item1, null)
        clearInvocations(token)

        removal.invoke()
        verify(token).notifyDataAvailable()
        assertEquals(null, subjectFixed.getPriority())
        assertEquals(0, underlying.size)
    }

    @Test
    fun `FixedPriorityQueue remove(), not exist`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val item1 = mock<QlicPendingFrame> {
            on { hasRemainingData() } doReturn false
            on { isCancelable() } doReturn true
            on { get(any()) } doReturn frame1
        }
        val removal = subjectFixed.addLast(item1, null)
        val item2 = mock<QlicPendingFrame>()
        subjectFixed.addLast(item2, null)

        subjectFixed.writeDataToStream(mock(), 100)
        assertEquals(10, subjectFixed.getPriority())
        assertEquals(1, underlying.size)
        clearInvocations(token)

        removal.invoke()
        verify(token, never()).notifyDataAvailable()
        assertEquals(10, subjectFixed.getPriority())
        assertEquals(1, underlying.size)
    }

    @Test
    fun `DynamicPriorityQueue init()`() {
        assertEquals(null, subjectDynamic.getPriority())
        assertEquals(0, underlying.size)
        verify(flowControl).registerDataSource(subjectDynamic)
    }

    @Test
    fun `DynamicPriorityQueue detach()`() {
        subjectDynamic.detach()
        verify(token).unregister()
    }

    @Test
    fun `DynamicPriorityQueue addFirst(), first element`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addFirst(item1, null)

        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(1, underlying.size)
        assertEquals(item1, underlying.first.first)
    }

    @Test
    fun `DynamicPriorityQueue addFirst(), new priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addFirst(item1, null)

        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 11
        }
        subjectDynamic.addFirst(item2, null)

        assertEquals(11, subjectDynamic.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.first.first)
    }

    @Test
    fun `DynamicPriorityQueue addFirst(), same priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addFirst(item1, null)

        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addFirst(item2, null)

        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.first.first)
    }

    @Test
    fun `DynamicPriorityQueue addFirst(), low priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addFirst(item1, null)

        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 7
        }
        subjectDynamic.addFirst(item2, null)

        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.first.first)
    }

    @Test
    fun `DynamicPriorityQueue addLast(), first element`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item1, null)

        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(1, underlying.size)
        assertEquals(item1, underlying.first.first)
    }

    @Test
    fun `DynamicPriorityQueue addLast(), new priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item1, null)

        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 11
        }
        subjectDynamic.addLast(item2, null)

        assertEquals(11, subjectDynamic.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.last.first)
    }

    @Test
    fun `DynamicPriorityQueue addLast(), same priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item1, null)

        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item2, null)

        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.last.first)
    }

    @Test
    fun `DynamicPriorityQueue addLast(), low priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item1, null)

        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 7
        }
        subjectDynamic.addLast(item2, null)

        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.last.first)
    }

    @Test
    fun `DynamicPriorityQueue writeDataToStream(), all`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame1
        }
        subjectDynamic.addLast(item1, callback1)

        val (size, callback) = subjectDynamic.writeDataToStream(mock(), 100)
        assertEquals(30, size)
        assertEquals(null, subjectDynamic.getPriority())
        verify(item1).get(100)
        verify(frame1).serialize(any())
        callback!!.invoke()
        verify(callback1).invoke()
    }

    @Test
    fun `DynamicPriorityQueue writeDataToStream(), remaining last`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn true
            on { get(any()) } doReturn frame1
        }
        subjectDynamic.addLast(item1, callback1)

        val (size, callback) = subjectDynamic.writeDataToStream(mock(), 100)
        assertEquals(30, size)
        assertEquals(10, subjectDynamic.getPriority())
        verify(item1).get(100)
        verify(frame1).serialize(any())
        callback!!.invoke()
        verify(callback1, never()).invoke()
    }

    @Test
    fun `DynamicPriorityQueue writeDataToStream(), all and switch to next priority`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame1
        }
        subjectDynamic.addLast(item1, callback1)

        val frame2 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback2 = mock<() -> Unit>()
        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame2
        }
        subjectDynamic.addLast(item2, callback2)

        val item3 = mock<QlicPendingFrame> {
            on { priority } doReturn 5
        }
        subjectDynamic.addLast(item3, null)

        val (size, callback) = subjectDynamic.writeDataToStream(mock(), 100)
        assertEquals(60, size)
        assertEquals(5, subjectDynamic.getPriority())
        verify(item1).get(100)
        verify(item2).get(70)
        verify(item3, never()).get(any())
        verify(frame1).serialize(any())
        verify(frame2).serialize(any())
        callback!!.invoke()
        verify(callback1).invoke()
        verify(callback2).invoke()
    }

    @Test
    fun `DynamicPriorityQueue writeDataToStream(), remaining non-last`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback1 = mock<() -> Unit>()
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn false
            on { get(any()) } doReturn frame1
        }
        subjectDynamic.addLast(item1, callback1)

        val frame2 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val callback2 = mock<() -> Unit>()
        val item2 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn true
            on { get(any()) } doReturn frame2
        }
        subjectDynamic.addLast(item2, callback2)

        val item3 = mock<QlicPendingFrame> {
            on { priority } doReturn 5
        }
        subjectDynamic.addLast(item3, null)

        val (size, callback) = subjectDynamic.writeDataToStream(mock(), 100)
        assertEquals(60, size)
        assertEquals(10, subjectDynamic.getPriority())
        verify(item1).get(100)
        verify(item2).get(70)
        verify(item3, never()).get(any())
        verify(frame1).serialize(any())
        verify(frame2).serialize(any())
        callback!!.invoke()
        verify(callback1).invoke()
        verify(callback2, never()).invoke()
    }

    @Test
    fun `DynamicPriorityQueue remove(), non cancelable`() {
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item1, null)
        val item2 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn false
            on { priority } doReturn 12
        }
        val removal = subjectDynamic.addLast(item2, null)
        clearInvocations(token)

        removal.invoke()
        verify(token, never()).notifyDataAvailable()
        assertEquals(12, subjectDynamic.getPriority())
        assertEquals(2, underlying.size)
        assertEquals(item2, underlying.last.first)
    }

    @Test
    fun `DynamicPriorityQueue remove(), highest priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn true
            on { priority } doReturn 12
        }
        val removal = subjectDynamic.addLast(item1, null)
        val item2 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn false
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item2, null)
        clearInvocations(token)

        removal.invoke()
        verify(token).notifyDataAvailable()
        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(1, underlying.size)
        assertEquals(item2, underlying.first.first)
    }

    @Test
    fun `DynamicPriorityQueue remove(), low priority`() {
        val item1 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn true
            on { priority } doReturn 8
        }
        val removal = subjectDynamic.addFirst(item1, null)
        val item2 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn false
            on { priority } doReturn 10
        }
        subjectDynamic.addLast(item2, null)
        clearInvocations(token)

        removal.invoke()
        verify(token, never()).notifyDataAvailable()
        assertEquals(10, subjectDynamic.getPriority())
        assertEquals(1, underlying.size)
        assertEquals(item2, underlying.first.first)
    }

    @Test
    fun `DynamicPriorityQueue remove(), one`() {
        val item1 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn true
        }
        val removal = subjectDynamic.addLast(item1, null)
        clearInvocations(token)

        removal.invoke()
        verify(token).notifyDataAvailable()
        assertEquals(null, subjectDynamic.getPriority())
        assertEquals(0, underlying.size)
    }

    @Test
    fun `DynamicPriorityQueue remove(), not exist`() {
        val frame1 = mock<QlicFrame> {
            on { size() } doReturn 30
        }
        val item1 = mock<QlicPendingFrame> {
            on { priority } doReturn 10
            on { hasRemainingData() } doReturn false
            on { isCancelable() } doReturn true
            on { get(any()) } doReturn frame1
        }
        val removal = subjectDynamic.addLast(item1, null)
        val item2 = mock<QlicPendingFrame> {
            on { isCancelable() } doReturn false
            on { priority } doReturn 8
        }
        subjectDynamic.addLast(item2, null)

        subjectDynamic.writeDataToStream(mock(), 100)
        assertEquals(8, subjectDynamic.getPriority())
        assertEquals(1, underlying.size)
        clearInvocations(token)

        removal.invoke()
        verify(token, never()).notifyDataAvailable()
        assertEquals(8, subjectDynamic.getPriority())
        assertEquals(1, underlying.size)
    }
}
