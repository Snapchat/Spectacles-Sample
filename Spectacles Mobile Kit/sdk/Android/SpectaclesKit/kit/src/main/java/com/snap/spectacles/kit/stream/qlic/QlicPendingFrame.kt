package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.utils.readBytes
import java.io.Closeable

/**
 * A sealed interface representing a QLIC frame pending to be sent in a queue.
 * Each frame has a priority and can provide its data in chunks, constrained by a given limit.
 */
internal sealed interface QlicPendingFrame : Closeable {

    /**
     * The priority of the frame, where higher numbers indicate higher priority.
     */
    val priority: Int

    /**
     * Retrieves a portion of the frame's data up to the specified size limit.
     * If the frame can fit within the limit, it returns the frame, otherwise, it returns null.
     */
    fun get(limit: Int): QlicFrame?

    /**
     * Indicates whether there is still remaining data in the frame that has not been processed.
     */
    fun hasRemainingData(): Boolean

    /**
     * Indicates whether the frame can be canceled (revoked).
     */
    fun isCancelable(): Boolean

    /**
     * Default close method, can be overridden by subclasses for resource management.
     */
    override fun close() {}

    /**
     * Represents a monolithic (indivisible) frame that does not require fragmentation.
     */
    abstract class MonolithicPendingFrame(
        private val frame: QlicFrame,
        override val priority: Int = 7
    ) : QlicPendingFrame {

        private var remaining = true

        /**
         * Returns the entire frame if it fits within the limit, otherwise null.
         */
        override fun get(limit: Int): QlicFrame? {
            return if (frame.size() <= limit) {
                remaining = false
                frame
            } else {
                null
            }
        }

        /**
         * Returns whether there is remaining data to be processed.
         * Always false for monolithic frames after their first retrieval.
         */
        override fun hasRemainingData(): Boolean = remaining

        /**
         * By default, all pending frames are not cancellable.
         */
        override fun isCancelable(): Boolean = false
    }

    object Ping : MonolithicPendingFrame(QlicFrame.Ping)

    class Ack(
        bytesSinceLastAck: Int
    ) : MonolithicPendingFrame(
        QlicFrame.Ack(bytesSinceLastAck)
    )

    class StreamStopSending(
        streamId: QlicStreamId,
        errorCode: Int
    ) : MonolithicPendingFrame(
        QlicFrame.StreamStopSending(
            QlicStreamId.compact(streamId.id, 0, streamId.isUnidirectional, streamId.isClientInitiated),
            errorCode
        ),
        0
    )

    class StreamReset(
        streamId: QlicStreamId,
        errorCode: Int
    ) : MonolithicPendingFrame(
        QlicFrame.StreamReset(
            QlicStreamId.compact(streamId.id, 0, streamId.isUnidirectional, streamId.isClientInitiated),
            errorCode
        ),
        0
    )

    class ConnectionCloseProtocol(
        errorCode: Int,
        frameType: Int,
        reason: ByteArray
    ) : MonolithicPendingFrame(
        QlicFrame.ConnectionCloseProtocol(errorCode, frameType, reason)
    )

    class ConnectionCloseApplication(
        errorCode: Int,
        reason: ByteArray
    ) : MonolithicPendingFrame(
        QlicFrame.ConnectionCloseApplication(errorCode, reason)
    )

    class Crypto(
        private val data: ByteArray
    ) : QlicPendingFrame {

        override val priority: Int = 7

        /**
         * The amount of data still remaining to be sent.
         */
        private var remaining = data.size

        override fun get(limit: Int): QlicFrame? {
            val fragmentSize = QlicFrame.Crypto.calculateMaxDataSize(limit).coerceAtMost(remaining)
            return if (fragmentSize > 0) {
                remaining -= fragmentSize
                val fragmentEnd = data.size - remaining
                val fragmentData = data.copyOfRange(fragmentEnd - fragmentSize, fragmentEnd)
                QlicFrame.Crypto(!hasRemainingData(), fragmentData)
            } else {
                null
            }
        }

        /**
         * Returns true if there is still data remaining to be processed in the stream.
         */
        override fun hasRemainingData(): Boolean = remaining > 0

        /**
         * Crypto frames are not cancellable.
         */
        override fun isCancelable(): Boolean = false
    }

    /**
     * Frame representing a portion of stream data that may need to be split into chunks.
     */
    class StreamData(
        streamId: QlicStreamId,
        private val data: SpectaclesStreamDataUnit
    ) : QlicPendingFrame {

        override val priority = data.priority

        /**
         * The compact form of the stream identifier, which includes priority and other attributes.
         */
        private val id = QlicStreamId.compact(
            streamId.id, priority.coerceIn(0, 7), streamId.isUnidirectional, streamId.isClientInitiated
        )

        /**
         * Lazy-loaded input stream for reading the frame's payload data.
         */
        private val input by lazy { data.payload.getInputStream() }

        /**
         * The amount of data still remaining to be sent.
         */
        private var remaining: Int = data.payload.size

        override fun close() {
            input.close()
        }

        /**
         * Retrieves up to a specified limit of data from the stream, or null if no data can be retrieved.
         */
        override fun get(limit: Int): QlicFrame? {
            val payloadSize = QlicFrame.StreamData.calculateMaxPayloadSize(id, limit)
                .coerceAtMost(remaining)
            return if (payloadSize > 0) {
                remaining -= payloadSize
                val lastFragment = !hasRemainingData()
                QlicFrame.StreamData(id, data.last and lastFragment, lastFragment, input.readBytes(payloadSize))
            } else {
                null
            }
        }

        /**
         * Returns true if there is still data remaining to be processed in the stream.
         */
        override fun hasRemainingData(): Boolean = remaining > 0

        /**
         * Only unprocessed, non-last frames can be cancelled.
         */
        override fun isCancelable(): Boolean = !data.last && remaining == data.payload.size
    }
}
