package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.utils.BytesOutputStream
import com.snap.spectacles.kit.stream.utils.getVarintSize
import com.snap.spectacles.kit.stream.utils.readLengthDelimitedRecord
import com.snap.spectacles.kit.stream.utils.toVarintBytes
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.io.OutputStream

/**
 * A sealed interface representing a QLIC (Quick Low-Intensity Communication) packet.
 * A packet can either be an incoming (In) or outgoing (Out) message, each represented as a subclass.
 */
internal sealed interface QlicPacket {

    /**
     * Represents an incoming QLIC packet.
     *
     * @param body The payload of the packet.
     */
    class In(private val body: ByteArray) : QlicPacket {

        companion object {

            /**
             * Reads a QLIC packet from the provided [InputStream].
             * This method deserializes the packet's body and returns an instance of [QlicPacket].
             *
             * @param input The input stream from which the packet is read.
             * @return An instance of [QlicPacket] containing the deserialized payload,
             *         or 'null' if the end of the stream has been reached.
             */
            fun readFrom(input: InputStream): In? {
                val body = input.readLengthDelimitedRecord()
                return if (body?.isNotEmpty() == true) In(body) else null
            }
        }

        /**
         * Return an [InputStream] associated with the packet body.
         */
        fun getBody(): InputStream {
            return ByteArrayInputStream(body)
        }

        /**
         * Returns the size of the packet in bytes.
         */
        fun size(): Int {
            return body.size.getVarintSize() + body.size
        }

        override fun toString(): String {
            return "QlicPacket.In(body.size = ${body.size})"
        }
    }

    /**
     * Represents an outgoing QLIC packet.
     * This class provides methods for writing the packet into an output stream.
     *
     * @param capacity The maximum size of the packet, which determines how much data can be stored in the packet.
     */
    class Out(capacity: Int) : QlicPacket {

        private val bytes = ByteArray(capacity)

        private val reserved = capacity.getVarintSize()

        /**
         * The output stream associated with the outgoing packet.
         * Data written to this stream is stored in the `bytes` array, starting at the header length.
         */
        private val stream = BytesOutputStream(bytes, reserved)

        /**
         * Return an [OutputStream] associated with the packet body.
         */
        fun getBody(): BytesOutputStream {
            return stream
        }

        /**
         * Returns the size of the packet in bytes.
         */
        fun size(): Int {
            val bodySize = stream.getAvailable()
            return bodySize.getVarintSize() + bodySize
        }

        /**
         * Writes the current QLIC packet to the provided [OutputStream].
         * This method serializes the packet's body and writes it to the output stream.
         *
         * @param outputStream The output stream to which the packet will be written.
         * @throws SpectaclesStreamException If writing to the output stream fails.
         */
        fun writeTo(outputStream: OutputStream) {
            val bodySize = stream.getAvailable()
            val headerLength = bodySize.getVarintSize()
            bodySize.toVarintBytes().copyInto(bytes, reserved - headerLength)
            outputStream.write(bytes, reserved - headerLength, headerLength + bodySize)
        }

        override fun toString(): String {
            return "QlicPacket.Out(body.size = ${stream.getAvailable()})"
        }
    }
}
