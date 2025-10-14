package com.snap.spectacles.kit.stream

import com.snap.spectacles.kit.stream.utils.CompositeCloseable
import com.snap.spectacles.kit.util.Log
import java.io.Closeable
import java.util.LinkedList
import java.util.concurrent.Executor

private const val TAG = "SpectaclesStreamWorker"

/**
 * Abstract class responsible for managing and processing messages over a stream.
 *
 * This class coordinates sending and receiving messages by using an executor to process incoming data
 * sequentially and ensures safe access to the stream.
 *
 * @param executor The executor used to run message processing tasks.
 */
abstract class SpectaclesStreamWorker<T : Any>(
    private val executor: Executor,
    private val unpack: (SpectaclesStreamPayload) -> T,
    private val pack: (T) -> SpectaclesStreamPayload,
    private val format: (SpectaclesStreamException) -> T
) {

    private val log = Log.get(TAG)

    @Volatile
    private var stream: SpectaclesStream? = null

    private val pendingIncomingData = LinkedList<SpectaclesStreamDataUnit>()

    private val compositeCloseable = CompositeCloseable()

    /**
     * Attaches a Spectacles stream to this worker.
     *
     * @param stream The [SpectaclesStream] to attach.
     */
    fun attach(stream: SpectaclesStream) {
        log.debug { "attach($stream), this = $this" }

        this.stream = stream
        attachClosable {
            this.stream = null
            stream.close()
        }
    }

    /**
     * Attaches an individual Closable object, ensuring it is closed when this worker is closed.
     */
    fun attachClosable(closeable: Closeable) {
        compositeCloseable.add(closeable)
    }

    /**
     * Closes the current Spectacles stream, stopping further transmissions.
     */
    open fun close() {
        log.debug { "close(), this = $this" }

        compositeCloseable.close()
    }

    /**
     * Processes incoming data units and initiates handling if the stream is active.
     *
     * @param data The data unit received from the stream.
     */
    fun process(data: SpectaclesStreamDataUnit) {
        synchronized(lock = this) {
            if (stream != null) {
                pendingIncomingData.addLast(data)
                if (pendingIncomingData.size == 1) {
                    doService()
                }
            } else {
                log.debug { "$data is discarded, this = $this" }
            }
        }
    }

    /**
     * Starts a stream based on the provided request.
     */
    protected abstract fun startStream(
        onReceive: (SpectaclesStreamDataUnit) -> Unit,
        onClose: () -> Unit
    ): SpectaclesStream

    /**
     * To process each incoming message.
     *
     * @param message The message to handle.
     * @param priority The priority level of the message.
     * @param last Indicates if this is the final message in the sequence.
     */
    protected abstract fun onReceive(message: T, priority: Int, last: Boolean)

    /**
     * Processes an error by sending a formatted error message.
     *
     * @param error The exception to handle.
     */
    protected open fun sendError(error: Exception) {
        log.warn(error) { "sendError(), this = $this" }

        if (null != stream) {
            val streamError = error as? SpectaclesStreamException
                ?: SpectaclesStreamException(SpectaclesStreamException.INTERNAL_ERROR, error.message, error)
            send(format(streamError), 0, true)
        }
    }

    /**
     * Sends a message to the peer.
     *
     * @param message The message to send.
     * @param priority The priority level of the message.
     * @param last Indicates if this is the final message in the sequence.
     * @param onSent Optional callback invoked when the data has been sent.
     * @return A callback that can be called to cancel the transmission.
     */
    protected fun send(message: T, priority: Int, last: Boolean, onSent: (() -> Unit)? = null): () -> Unit {
        val data = SpectaclesStreamDataUnit(last, priority, pack(message))
        val currentStream = stream ?: synchronized(lock = this) {
            stream ?: startStream(::process, ::close).apply { attach(this) }
        }
        return currentStream.sendAndCloseIfLast(data, onSent)
    }

    /**
     * Continuously processes pending data in the queue until empty, handling errors if they occur.
     */
    private fun doService() {
        executor.execute {
            // Retrieve but do not remove the first element of pendingIncomingData. The element should only
            // be removed after it has been fully processed to ensure messages are handled in order.
            val data = synchronized(lock = this) {
                pendingIncomingData.peekFirst()
            }

            if (null != data) {
                try {
                    val message = unpack(data.payload)
                    onReceive(message, data.priority, data.last)

                    synchronized(this) {
                        pendingIncomingData.removeAt(0)
                        if (pendingIncomingData.size > 0) {
                            doService()
                        }
                    }
                } catch (error: Exception) {
                    sendError(error)

                    synchronized(this) {
                        pendingIncomingData.clear()
                    }
                }
            }
        }
    }

    private fun SpectaclesStream.sendAndCloseIfLast(
        data: SpectaclesStreamDataUnit,
        onSent: (() -> Unit)?
    ): () -> Unit {
        return send(data, onSent).also {
            if (data.last) {
                close()
            }
        }
    }
}
