package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.utils.getLengthDelimitedRecordSize
import com.snap.spectacles.kit.stream.utils.getVarintSize
import com.snap.spectacles.kit.stream.utils.readLengthDelimitedRecord
import com.snap.spectacles.kit.stream.utils.readVarint
import com.snap.spectacles.kit.stream.utils.writeLengthDelimitedRecord
import com.snap.spectacles.kit.stream.utils.writeVarint
import java.io.InputStream
import java.io.OutputStream

/**
 * QlicFrame interface represents a QLIC (Quick L2CAP IoT Connections) frame, providing methods for
 * serializing the frame to an output stream and deserializing it from an input stream.
 */
internal sealed interface QlicFrame {

    /**
     * Calculates the size of the frame in bytes.
     * @return the size of the frame as an integer.
     */
    fun size(): Int

    /**
     * Serializes the frame into the provided OutputStream.
     * @param output the OutputStream to which the frame will be serialized.
     */
    fun serialize(output: OutputStream)

    companion object {

        // A map that associates frame types (as byte values) with their respective deserialization functions.
        private val typeMapping = mapOf(
            0x00 to Padding::deserialize,
            0x01 to Ping::deserialize,
            0x02 to Ack::deserialize,
            0x04 to StreamReset::deserialize,
            0x05 to StreamStopSending::deserialize,
            0x06 to Crypto::deserialize,
            0x07 to Crypto::deserialize,
            0x08 to StreamData::deserialize,
            0x09 to StreamData::deserialize,
            0x0A to StreamData::deserialize,
            0x0B to StreamData::deserialize,
            0x1C to ConnectionCloseProtocol::deserialize,
            0x1D to ConnectionCloseApplication::deserialize,
        )

        /**
         * Deserializes a QlicFrame from the provided InputStream.
         * The method reads the frame type and uses the corresponding deserialization function.
         * @param input the InputStream from which the frame is deserialized.
         * @return the deserialized QlicFrame, or null if the end of the stream is reached.
         */
        fun deserialize(input: InputStream): QlicFrame? {
            val type = input.read()
            if (type == -1) {
                return null
            }
            return typeMapping[type]?.invoke(type, input)
                ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Unsupported frame($type)")
        }
    }

    /**
     * Semantically meaningless padding used to increase the size of packets.
     * Used for bandwidth measurement, or to provide protection against traffic analysis.
     */
    object Padding : QlicFrame {

        fun deserialize(type: Int, input: InputStream) = Padding

        override fun size(): Int {
            return 1
        }

        override fun serialize(output: OutputStream) {
            output.write(0x00)
        }

        override fun toString(): String {
            return "Padding"
        }
    }

    /**
     * Requests acknowledgement of received data.
     * Ping frames must be acknowledged as soon as they are received with a byte count that includes
     * the ping frame's enclosing packet. Ping frames can also be used to prevent connection timeouts.
     */
    object Ping : QlicFrame {

        fun deserialize(type: Int, input: InputStream) = Ping

        override fun size(): Int {
            return 1
        }

        override fun serialize(output: OutputStream) {
            output.write(0x01)
        }

        override fun toString(): String {
            return "Ping"
        }
    }

    /**
     * Contains a count of received bytes.
     * Byte counts for ack frames are based on the total number of bytes received from the OS layer at a
     * given time before decryption or parsing have taken place. This allows ack frames to be used for
     * stream-level acknowledgements, keep-alives, and bandwidth measurement.
     */
    class Ack(val bytesSinceLastAck: Int) : QlicFrame {

        companion object {
            fun deserialize(type: Int, input: InputStream): Ack {
                val bytesSinceLastAck = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Ack.bytesSinceLastAck")
                return Ack(bytesSinceLastAck)
            }
        }

        override fun size(): Int {
            return 1 + bytesSinceLastAck.getVarintSize()
        }

        override fun serialize(output: OutputStream) {
            output.write(0x02)
            output.writeVarint(bytesSinceLastAck)
        }

        override fun toString(): String {
            return "Ack(bytesSinceLastAck = $bytesSinceLastAck)}"
        }
    }

    /**
     * Contains cryptographic handshake data.
     */
    class Crypto(
        val lastFragment: Boolean,
        val data: ByteArray
    ) : QlicFrame {

        companion object {
            fun deserialize(type: Int, input: InputStream): Crypto {
                val data = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Crypto.data")
                return Crypto(0x06 == type, data)
            }

            /**
             * Returns the maximum size of the data that can be encoded into the buffer,
             * considering the overhead for encoding metadata like the length prefix.
             *
             * @param bufferCapacity The total capacity of the buffer (in bytes).
             * @return The maximum size (in bytes) of the encoded payload that can fit into the buffer.
             */
            fun calculateMaxDataSize(bufferCapacity: Int): Int {
                val capacity = bufferCapacity - 1
                return if (capacity > 0) {
                    return (capacity - (capacity - 1).getVarintSize()).coerceAtLeast(0)
                } else {
                    0
                }
            }
        }

        override fun size(): Int {
            return 1 + data.getLengthDelimitedRecordSize()
        }

        override fun serialize(output: OutputStream) {
            output.write(if (lastFragment) 0x06 else 0x07)
            output.writeLengthDelimitedRecord(data)
        }

        override fun toString(): String {
            return "Crypto(data = ${data.size})}"
        }
    }

    /**
     * Sent to abruptly terminate the sending part of the stream.
     * After sending this frame, the sender will stop sending any new stream frames. The receiver
     * may discard any data that it has already received for that stream.
     */
    class StreamReset(val id: Int, val errorCode: Int) : QlicFrame {

        companion object {
            fun deserialize(type: Int, input: InputStream): StreamReset {
                val streamId = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "StreamReset.streamId")
                val errorCode = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "StreamReset.errorCode")
                return StreamReset(streamId, errorCode)
            }
        }

        override fun size(): Int {
            return 1 + id.getVarintSize() + errorCode.getVarintSize()
        }

        override fun serialize(output: OutputStream) {
            output.write(0x04)
            output.writeVarint(id)
            output.writeVarint(errorCode)
        }

        override fun toString(): String {
            return "StreamReset(id = $id, errorCode = $errorCode)}"
        }
    }

    /**
     * Sent to terminate the receiving part of the stream.
     * After sending this frame, the sender is free to discard both newly incoming, and previously
     * received stream frames. The receiver should stop sending new stream frames for that stream.
     */
    class StreamStopSending(val id: Int, val errorCode: Int) : QlicFrame {

        companion object {
            fun deserialize(type: Int, input: InputStream): StreamStopSending {
                val streamId = input.readVarint()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "StreamStopSending.streamId"
                    )
                val errorCode = input.readVarint()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "StreamStopSending.errorCode"
                    )
                return StreamStopSending(streamId, errorCode)
            }
        }

        override fun size(): Int {
            return 1 + id.getVarintSize() + errorCode.getVarintSize()
        }

        override fun serialize(output: OutputStream) {
            output.write(0x05)
            output.writeVarint(id)
            output.writeVarint(errorCode)
        }

        override fun toString(): String {
            return "StreamStopSending(id = $id, errorCode = $errorCode)}"
        }
    }

    /**
     * Frames that implicitly create streams and carry stream data.
     * Streams are created implicitly when a stream frame is received with a given stream id, and are
     * closed explicitly by sending a frame with `fin = true`.
     */
    class StreamData(
        val id: Int,
        val fin: Boolean,
        val lastFragment: Boolean,
        val payload: ByteArray
    ) : QlicFrame {

        companion object {
            fun deserialize(type: Int, input: InputStream): StreamData {
                val streamId = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "StreamData.streamId")
                val payload = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "StreamData.payload")
                return StreamData(
                    streamId,
                    (type and 1) == 1,
                    (type and 2) == 2,
                    payload
                )
            }

            /**
             * Returns the maximum size of the payload that can be encoded into the buffer,
             * considering the overhead for encoding metadata like the length prefix.
             *
             * @param bufferCapacity The total capacity of the buffer (in bytes).
             * @return The maximum size (in bytes) of the encoded payload that can fit into the buffer.
             */
            fun calculateMaxPayloadSize(streamId: Int, bufferCapacity: Int): Int {
                val capacity = bufferCapacity - 1 - streamId.getVarintSize()
                return if (capacity > 0) {
                    return (capacity - (capacity - 1).getVarintSize()).coerceAtLeast(0)
                } else {
                    0
                }
            }
        }

        override fun size(): Int {
            return 1 + id.getVarintSize() + payload.getLengthDelimitedRecordSize()
        }

        override fun serialize(output: OutputStream) {
            output.write(0x08 or (if (fin) 1 else 0) or (if (lastFragment) 2 else 0))
            output.writeVarint(id)
            output.writeLengthDelimitedRecord(payload)
        }

        override fun toString(): String {
            return "StreamData(id = $id, fin = $fin, lastFragment = $lastFragment, payload.size = ${payload.size})}"
        }
    }

    /**
     * Signals that the a protocol error has closed the connection.
     * After sending this frame, peers should wait a small amount of time before closing the underlying
     * transport to ensure delivery of the close frame. Receivers are free to immediately close the
     * underlying transport upon receipt of this frame.
     */
    class ConnectionCloseProtocol(val errorCode: Int, val frameType: Int, val reason: ByteArray) : QlicFrame {

        companion object {
            fun deserialize(type: Int, input: InputStream): ConnectionCloseProtocol {
                val errorCode = input.readVarint()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "ConnectionCloseProtocol.errorCode"
                    )
                val frameType = input.readVarint()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "ConnectionCloseProtocol.frameType"
                    )
                val reason = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "ConnectionCloseProtocol.reason"
                    )
                return ConnectionCloseProtocol(errorCode, frameType, reason)
            }
        }

        override fun size(): Int {
            return 1 + errorCode.getVarintSize() + frameType.getVarintSize() + reason.getLengthDelimitedRecordSize()
        }

        override fun serialize(output: OutputStream) {
            output.write(0x1C)
            output.writeVarint(errorCode)
            output.writeVarint(frameType)
            output.writeLengthDelimitedRecord(reason)
        }

        override fun toString(): String {
            return "ConnectionCloseProtocol(errorCode = $errorCode, frameType = $frameType, " +
                    "reason = ${reason.toString(Charsets.UTF_8)}"
        }
    }

    /**
     * Signals that an application error has closed the connection.
     * After sending this frame, peers should wait a small amount of time before closing the underlying
     * transport to ensure delivery of the close frame. Receivers are free to immediately close the
     * underlying transport upon receipt of this frame.
     */
    class ConnectionCloseApplication(val errorCode: Int, val reason: ByteArray) : QlicFrame {

        companion object {
            fun deserialize(type: Int, input: InputStream): ConnectionCloseApplication {
                val errorCode = input.readVarint()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "ConnectionCloseApplication.errorCode"
                    )
                val reason = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "ConnectionCloseApplication.reason"
                    )
                return ConnectionCloseApplication(errorCode, reason)
            }
        }

        override fun size(): Int {
            return 1 + errorCode.getVarintSize() + reason.getLengthDelimitedRecordSize()
        }

        override fun serialize(output: OutputStream) {
            output.write(0x1D)
            output.writeVarint(errorCode)
            output.writeLengthDelimitedRecord(reason)
        }

        override fun toString(): String {
            return "ConnectionCloseApplication(errorCode = $errorCode, reason = ${reason.toString(Charsets.UTF_8)}"
        }
    }
}
