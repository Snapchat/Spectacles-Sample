package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStream
import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.util.Log
import java.util.concurrent.atomic.AtomicBoolean

private const val TAG = "QlicStream"

/**
 * Manages a data stream within the QLIC protocol.
 *
 * @param streamId Unique identifier for this stream.
 * @param streamDataHandler Callback invoked when a [SpectaclesStreamDataUnit] is received.
 * @param streamCloseHandler Callback invoked when the stream is fully closed.
 * @param startedByPeer Indicates if the stream was initiated by the peer.
 */
internal class QlicStream(
    val streamId: QlicStreamId,
    private val streamDataHandler: (SpectaclesStreamDataUnit) -> Unit,
    private val streamCloseHandler: () -> Unit,
    startedByPeer: Boolean,
    private val outgoingQueue: QlicFlowQueue = QlicFlowQueue.DynamicPriorityQueue(),
    private val unpack: (QlicFrame.StreamData) -> SpectaclesStreamDataUnit? =
        QlicStreamDataAssembler()::assembleStreamData,
) : SpectaclesStream, QlicFlowQueue by outgoingQueue {

    object Factory {
        fun create(
            streamId: QlicStreamId,
            streamDataHandler: (SpectaclesStreamDataUnit) -> Unit,
            streamCloseHandler: () -> Unit,
            startedByPeer: Boolean
        ) = QlicStream(streamId, streamDataHandler, streamCloseHandler, startedByPeer)
    }

    private val log = Log.get(TAG)

    // Tracks whether the stream has been fully closed.
    private val isClosed = AtomicBoolean(false)

    // Tracks if the input side (receiving) of the stream is shut down.
    // This flag is set after a FIN StreamData or StreamReset is received.
    @Volatile
    private var isInputShutdown = streamId.isUnidirectional && !startedByPeer

    // Tracks if the output side (sending) of the stream is shut down.
    // This flag is set after a FIN StreamData or StreamReset is sent.
    @Volatile
    private var isOutputShutdown = streamId.isUnidirectional && startedByPeer

    override fun toString(): String {
        return "QlicStream($streamId, $isInputShutdown, $isOutputShutdown, ${getPriority()})"
    }

    override fun close() {
        log.debug { "close(), this = $this" }

        shutdown(true)
    }

    override fun isClosed(): Boolean {
        return isClosed.get()
    }

    override fun send(data: SpectaclesStreamDataUnit, onSent: (() -> Unit)?): () -> Unit {
        log.debug { "send($data), this = $this" }

        synchronized(lock = this) {
            if (isOutputShutdown) {
                throw SpectaclesStreamException(
                    SpectaclesStreamException.INTERNAL_ERROR, "The stream output has already been shutdown"
                )
            }

            if (data.last) {
                isOutputShutdown = true
            }
        }

        return outgoingQueue.addLast(QlicPendingFrame.StreamData(streamId, data), onSent)
            .also {
                if (data.last) {
                    shutdownCheck()
                }
            }
    }

    /**
     * Shuts down the stream.
     */
    fun shutdown(graceful: Boolean = false) {
        log.debug { "shutdown($graceful), this = $this" }

        if (isClosed.get()) {
            return
        }

        val (output, input) = synchronized(lock = this) {
            if (!graceful) {
                isOutputShutdown = true
                isInputShutdown = true
                false to false
            } else if (isOutputShutdown) {
                false to !isInputShutdown
            } else {
                isOutputShutdown = true
                true to !isInputShutdown
            }
        }

        // Send a reset frame to mark the stream as closed on the output side.
        if (output) {
            outgoingQueue.addLast(QlicPendingFrame.StreamReset(streamId, 0), null)
        }
        // Request the peer to stop sending data
        if (input) {
            outgoingQueue.addLast(QlicPendingFrame.StreamStopSending(streamId, 0), null)
        }

        shutdownCheck()
    }

    /**
     * Processes an incoming frame based on its type.
     */
    fun handleIncomingFrame(frame: QlicFrame) {
        log.debug { "handleIncomingFrame($frame), this = $this" }

        when (frame) {
            is QlicFrame.StreamReset -> handleStreamReset(frame)
            is QlicFrame.StreamStopSending -> handleStreamStopSending(frame)
            is QlicFrame.StreamData -> handleStreamData(frame)
            else -> {}
        }
    }

    /**
     * Handles incoming data frames and processes them if they are complete.
     */
    private fun handleStreamData(frame: QlicFrame.StreamData) {
        if (isInputShutdown) {
            log.warn { "The stream input has already been shutdown, this = $this" }
            return
        }

        val data = unpack(frame)
        if (data != null) {
            streamDataHandler.invoke(data)
        }

        if (frame.fin) {
            isInputShutdown = true
            shutdownCheck()
        }
    }

    /**
     * Handles stream reset frames, marking the input as shut down.
     */
    private fun handleStreamReset(frame: QlicFrame.StreamReset) {
        isInputShutdown = true
        shutdownCheck()
    }

    /**
     * Handles stop-sending frames by responding with a stream reset if necessary.
     */
    private fun handleStreamStopSending(frame: QlicFrame.StreamStopSending) {
        synchronized(lock = this) {
            if (isOutputShutdown) {
                return
            }

            isOutputShutdown = true
        }

        // Responses with a 'StreamReset'.
        outgoingQueue.addLast(QlicPendingFrame.StreamReset(streamId, 0), null)

        shutdownCheck()
    }

    /**
     * Checks if both input and output sides are shut down, closing the stream if so.
     */
    private fun shutdownCheck() {
        if (isOutputShutdown && isInputShutdown && isClosed.compareAndSet(false, true)) {
            log.warn { "The stream is fully shutdown, this = $this" }
            streamCloseHandler.invoke()
        }
    }
}
