package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.utils.CompositeCallback
import java.io.OutputStream
import java.util.LinkedList

/**
 * QlicFlowQueue is responsible for managing a queue of pending frames that need to be sent in a
 * controlled manner, in coordination with a [QlicFlowControl].
 */
internal interface QlicFlowQueue : QlicFlowControl.DataSource {

    /**
     * Attaches this queue to a flow control, registering it for data flow management.
     *
     * @param flowControl The flow control instance to which this provider will be attached.
     */
    fun attach(flowControl: QlicFlowControl)

    /**
     * Detaches this provider from the flow control instance, unregistering it and releasing resources.
     */
    fun detach()

    /**
     * Adds a frame to the beginning of the queue.
     *
     * @param frame The QlicPendingFrame to be added to the front of the queue.
     * @param onSent A callback callback that will be triggered once the frame is sent.
     * @return A function that can be called to revoke (cancel) the added frame.
     */
    fun addFirst(frame: QlicPendingFrame, onSent: (() -> Unit)?): () -> Unit

    /**
     * Adds a frame to the end of the queue.
     *
     * @param frame The QlicPendingFrame to be added to the back of the queue.
     * @param onSent A callback callback that will be executed once the frame is sent.
     * @return A function that can be called to revoke (cancel) the added frame.
     */
    fun addLast(frame: QlicPendingFrame, onSent: (() -> Unit)?): () -> Unit

    /**
     * A queue for managing frames with a fixed priority level.
     *
     * @property priority The priority level associated with this queue, influencing its order
     *                    relative to other queues.
     * @property underlying The underlying LinkedList that stores pairs of frames and optional callbacks.
     */
    class FixedPriorityQueue(
        private val priority: Int,
        private val underlying: LinkedList<Pair<QlicPendingFrame, (() -> Unit)?>> = LinkedList()
    ) : QlicFlowQueue {

        // Control token registered with the flow control, used to manage registration and notification.
        private lateinit var controlToken: QlicFlowControl.Token

        override fun attach(flowControl: QlicFlowControl) {
            controlToken = flowControl.registerDataSource(this)
        }

        override fun detach() {
            controlToken.unregister()
        }

        override fun addFirst(frame: QlicPendingFrame, onSent: (() -> Unit)?): () -> Unit {
            val item = frame to onSent
            synchronized(lock = this) {
                underlying.addFirst(item)
            }
            controlToken.notifyDataAvailable()

            return { remove(item) }
        }

        override fun addLast(frame: QlicPendingFrame, onSent: (() -> Unit)?): () -> Unit {
            val item = frame to onSent
            synchronized(lock = this) {
                underlying.addLast(item)
            }
            controlToken.notifyDataAvailable()

            return { remove(item) }
        }

        override fun getPriority(): Int? {
            return synchronized(lock = this) {
                if (underlying.isEmpty()) null else priority
            }
        }

        override fun writeDataToStream(output: OutputStream, sizeLimit: Int): Pair<Int, (() -> Unit)?> {
            var count = 0
            val compositeCallback = CompositeCallback()
            synchronized(lock = this) {
                while (true) {
                    val (pending, callback) = underlying.peek() ?: break
                    val frame = pending.get(sizeLimit - count) ?: break
                    frame.serialize(output)
                    count += frame.size()

                    if (pending.hasRemainingData()) {
                        break
                    }

                    underlying.pop()
                    if (null != callback) {
                        compositeCallback.add(callback)
                    }
                }
            }

            return count to compositeCallback
        }

        private fun remove(item: Pair<QlicPendingFrame, (() -> Unit)?>) {
            val removed = synchronized(lock = this) {
                if (item.first.isCancelable()) {
                    val it = underlying.iterator()
                    while (it.hasNext()) {
                        if (it.next() === item) {
                            it.remove()
                            return@synchronized true
                        }
                    }
                }
                return@synchronized false
            }

            if (removed) {
                controlToken.notifyDataAvailable()
            }
        }
    }

    /**
     * A dynamic priority queue that manages frames based on changing conditions.
     *
     * @property underlying The underlying LinkedList that stores pairs of frames and optional callbacks.
     */
    class DynamicPriorityQueue(
        private val underlying: LinkedList<Pair<QlicPendingFrame, (() -> Unit)?>> = LinkedList()
    ) : QlicFlowQueue {

        // Control token registered with the flow control, used to manage registration and notification.
        private lateinit var controlToken: QlicFlowControl.Token

        // Tracks the item with the highest priority.
        @Volatile
        private var highestPriorityItem: Pair<QlicPendingFrame, (() -> Unit)?>? = null

        override fun attach(flowControl: QlicFlowControl) {
            controlToken = flowControl.registerDataSource(this)
        }

        override fun detach() {
            controlToken.unregister()
        }

        override fun addFirst(frame: QlicPendingFrame, onSent: (() -> Unit)?): () -> Unit {
            val item = frame to onSent
            synchronized(lock = this) {
                underlying.addFirst(item)
                if (null == highestPriorityItem || frame.priority > highestPriorityItem!!.first.priority) {
                    highestPriorityItem = item
                }
            }
            controlToken.notifyDataAvailable()

            return { remove(item) }
        }

        override fun addLast(frame: QlicPendingFrame, onSent: (() -> Unit)?): () -> Unit {
            val item = frame to onSent
            synchronized(lock = this) {
                underlying.addLast(item)
                if (null == highestPriorityItem || frame.priority >= highestPriorityItem!!.first.priority) {
                    highestPriorityItem = item
                }
            }
            controlToken.notifyDataAvailable()

            return { remove(item) }
        }

        override fun getPriority(): Int? {
            return highestPriorityItem?.first?.priority
        }

        override fun writeDataToStream(output: OutputStream, sizeLimit: Int): Pair<Int, (() -> Unit)?> {
            var count = 0
            val compositeCallback = CompositeCallback()
            synchronized(lock = this) {
                val priority = highestPriorityItem?.first?.priority
                do {
                    val pending = underlying.peek() ?: break
                    val frame = pending.first.get(sizeLimit - count) ?: break
                    frame.serialize(output)
                    count += frame.size()

                    if (pending.first.hasRemainingData()) {
                        break
                    }
                    if (pending.second != null) {
                        compositeCallback.add(pending.second!!)
                    }

                    underlying.pop()
                    if (pending === highestPriorityItem) {
                        highestPriorityItem = getHighestPriorityItemLocked()
                    }
                } while (priority == highestPriorityItem?.first?.priority)
            }

            return count to compositeCallback
        }

        private fun remove(item: Pair<QlicPendingFrame, (() -> Unit)?>) {
            val changed = synchronized(lock = this) {
                if (item.first.isCancelable()) {
                    val it = underlying.iterator()
                    while (it.hasNext()) {
                        if (it.next() === item) {
                            it.remove()
                            if (item === highestPriorityItem) {
                                highestPriorityItem = getHighestPriorityItemLocked()
                                return@synchronized true
                            } else {
                                return@synchronized false
                            }
                        }
                    }
                }
                return@synchronized false
            }

            if (changed) {
                controlToken.notifyDataAvailable()
            }
        }

        private fun getHighestPriorityItemLocked(): Pair<QlicPendingFrame, (() -> Unit)?>? {
            var highest: Pair<QlicPendingFrame, (() -> Unit)?>? = null
            underlying.forEach {
                if (null == highest || it.first.priority >= highest!!.first.priority) {
                    highest = it
                }
            }
            return highest
        }
    }
}
