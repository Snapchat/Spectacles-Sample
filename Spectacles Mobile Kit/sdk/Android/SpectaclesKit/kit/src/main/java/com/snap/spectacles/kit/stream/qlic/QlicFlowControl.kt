package com.snap.spectacles.kit.stream.qlic

import android.os.SystemClock
import com.snap.spectacles.kit.stream.utils.CompositeCallback
import com.snap.spectacles.kit.util.Log
import java.io.OutputStream
import java.util.LinkedList
import java.util.TreeMap
import java.util.concurrent.Semaphore
import java.util.concurrent.TimeUnit

private const val TAG = "QlicFlowControl"

/**
 * Interface for managing the flow control of data transmission, allowing for prioritized data
 * sending and coordinated management of multiple data providers.
 */
internal interface QlicFlowControl {

    /**
     * Factory
     */
    interface Factory {
        fun create(): QlicFlowControl
    }

    /**
     * Represents a source of data to be managed by the flow control system.
     */
    interface DataSource {

        /**
         * Retrieves the priority of the data that this sender intends to send.
         * A higher integer value indicates a higher priority.
         * @return The priority level, or null if there is no data to send.
         */
        fun getPriority(): Int?

        /**
         * Writes outgoing data into the provided output stream, limited by the specified size.
         * Implementations should respect the size limit to prevent overflow.
         * @param output The output stream to be filled with data.
         * @param sizeLimit The maximum size of data to fill into the output stream.
         * @return The number of bytes written to the output stream, along with a callback that
         *         will be triggered once the data has been sent.
         */
        fun writeDataToStream(output: OutputStream, sizeLimit: Int): Pair<Int, (() -> Unit)?>
    }

    /**
     * Represents a token that manages the registration of a sender with the flow control system.
     * This token allows the sender to notify the flow control of new data that is available for sending.
     */
    interface Token {

        /**
         * Signals to the flow control system that this source has data ready to send.
         * This method should be called when the sender has data ready to be processed,
         * allowing the flow control system to take appropriate action.
         */
        fun notifyDataAvailable()

        /**
         * Unregisters this source from the flow control system, preventing further data notifications.
         */
        fun unregister()
    }

    /**
     * Registers a DataSource with this flow control mechanism.
     * @param dataSource The Provider to be registered.
     * @return A Token to manage the registration and allow for status updates or unregistration.
     */
    fun registerDataSource(dataSource: DataSource): Token

    /**
     * Waits for data to become available within the specified timeout or until the flow control system is shut down.
     * @param timeoutMs The maximum time to wait, in milliseconds, for data to become available.
     * @return `null` if the flow control system has been shut down, `true` if data is available,
     *         or `false` if the waiting time elapsed without data becoming available.
     */
    fun waitForData(timeoutMs: Long): Boolean?

    /**
     * Writes data from registered sources to the specified output stream up to the specified size limit.
     * @param output The output stream to fill with data.
     * @param sizeLimit The maximum size of data to fill into the output stream.
     * @return The number of bytes written to the output stream, along with a callback that
     *         will be triggered once the data has been sent.
     */
    fun writeDataToStream(output: OutputStream, sizeLimit: Int): Pair<Int, (() -> Unit)?>

    /**
     * Starts flow throttling: stops sending messages with a priority lower than the specified priority.
     */
    fun startThrottling(priority: Int)

    /**
     * Stops flow throttling.
     */
    fun stopThrottling()

    /**
     * Stops the flow control operation and releases any associated resources.
     */
    fun shutdown()

    /**
     * Default implementation of the QlicFlowControl, managing the flow of data
     * for multiple senders while handling priority-based data sending.
     */
    class Default(
        private val clock: () -> Long
    ) : QlicFlowControl {

        object Factory : QlicFlowControl.Factory {
            override fun create() = Default(SystemClock::elapsedRealtime)
        }

        /**
         * Inner class representing a token that manages the registration of a sender.
         */
        private inner class TokenImpl(
            val dataSource: DataSource
        ) : Token {

            // Priority level of the token
            var priority: Int? = null

            override fun notifyDataAvailable() {
                onDataSourceAvailable(this)
            }

            override fun unregister() {
                log.debug { "TokenImpl($dataSource) closed" }
            }
        }
        
        private val log = Log.get(TAG)

        // Priority queue managing the tokens based on their priority.
        private val prioritizedQueue = TreeMap<Int, LinkedList<TokenImpl>>()

        @Volatile
        private var isShutdown = false

        // Messages with a priority lower than this priority will be throttled.
        private var throttlingPriority = Int.MIN_VALUE

        private val semaphore = Semaphore(0)

        override fun registerDataSource(dataSource: DataSource): Token {
            log.debug { "registerDataSource($dataSource)" }

            return TokenImpl(dataSource)
        }

        override fun waitForData(timeoutMs: Long): Boolean? {
            val startTime = clock.invoke()
            while (true) {
                val permit = semaphore.tryAcquire(
                    timeoutMs - (clock.invoke() - startTime), TimeUnit.MILLISECONDS
                )
                synchronized(lock = this) {
                    if (isShutdown) return null
                    if (!permit) return false
                    if (null != prioritizedQueue.ceilingKey(throttlingPriority)) return true
                }
            }
        }

        override fun writeDataToStream(output: OutputStream, sizeLimit: Int): Pair<Int, (() -> Unit)?> {
            var count = 0
            val compositeCallback = CompositeCallback()

            synchronized(lock = this) {
                var entry = prioritizedQueue.lastEntry()
                while (null != entry && entry.key >= throttlingPriority && sizeLimit > count + 8) {
                    val (priority, queue) = entry
                    val requeue = LinkedList<TokenImpl>()

                    val iterator = queue.iterator()
                    while (iterator.hasNext() && sizeLimit > count + 8) {
                        val token = iterator.next()
                        val (size, callback) = token.dataSource.writeDataToStream(
                            output, sizeLimit - count
                        )
                        if (size <= 0) {
                            log.debug {
                                "$token($priority-${token.dataSource.getPriority()})" +
                                    ".writeDataToStream(${sizeLimit - count}) == $size"
                            }
                            continue
                        }

                        iterator.remove()
                        token.priority = token.dataSource.getPriority()
                        if (null != token.priority) {
                            if (priority == token.priority) {
                                requeue.add(token)
                            } else {
                                prioritizedQueue.add(token)
                            }
                        }

                        if (null != callback) {
                            compositeCallback.add(callback)
                        }
                        count += size
                    }

                    queue.addAll(requeue)
                    if (queue.isEmpty()) {
                        prioritizedQueue.remove(priority)
                    }
                    entry = prioritizedQueue.lowerEntry(priority)
                }

                if (null != prioritizedQueue.ceilingKey(throttlingPriority)) {
                    semaphore.release()
                }
            }

            return count to compositeCallback
        }

        override fun startThrottling(priority: Int) {
            log.debug { "startThrottling($priority)" }

            adjustThrottling(priority)
        }

        override fun stopThrottling() {
            log.debug { "stopThrottling()" }

            adjustThrottling(Int.MIN_VALUE)
        }

        override fun shutdown() {
            log.debug { "shutdown(), isShutdown = $isShutdown" }

            isShutdown = true
            semaphore.release()
        }

        /**
         * Sets the throttling priority level.
         * Messages with a priority lower than the specified priority will be throttled and not sent
         * until the priority level is adjusted.
         *
         * @param newPriority The minimum priority level for messages to be sent.
         */
        private fun adjustThrottling(newPriority: Int) {
            synchronized(lock = this) {
                val currentPriority = throttlingPriority
                throttlingPriority = newPriority
                if (newPriority < currentPriority &&
                    null == prioritizedQueue.ceilingKey(currentPriority) &&
                    null != prioritizedQueue.ceilingKey(newPriority)
                ) {
                    semaphore.release()
                }
            }
        }

        /**
         * Handles the signals that the DataSource has new data available.
         */
        private fun onDataSourceAvailable(token: TokenImpl) {
            synchronized(lock = this) {
                val new = token.dataSource.getPriority()
                val old = token.priority
                if (old != new) {
                    // 'wasEmpty' is used only when 'new' is not null.
                    val wasEmpty = null != new && null == prioritizedQueue.ceilingKey(throttlingPriority)

                    if (null != old) {
                        prioritizedQueue.remove(token)
                    }

                    token.priority = new
                    if (null != new) {
                        prioritizedQueue.add(token)

                        if (wasEmpty && new >= throttlingPriority) {
                            semaphore.release()
                        }
                    }
                }
            }
        }

        private fun TreeMap<Int, LinkedList<TokenImpl>>.add(token: TokenImpl) {
            val priority = token.priority!!
            val queue = get(priority) ?: LinkedList<TokenImpl>().also { put(priority, it) }
            queue.addLast(token)
        }

        private fun TreeMap<Int, LinkedList<TokenImpl>>.remove(token: TokenImpl) {
            val priority = token.priority
            get(priority)?.let { queue ->
                queue.remove(token)
                if (queue.isEmpty()) {
                    remove(priority)
                }
            }
        }
    }
}
