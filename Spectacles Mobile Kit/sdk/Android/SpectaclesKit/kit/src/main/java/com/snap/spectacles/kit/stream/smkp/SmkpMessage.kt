package com.snap.spectacles.kit.stream.smkp

import android.os.Build
import androidx.annotation.RequiresApi
import com.snap.spectacles.kit.stream.SpectaclesStreamException
import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamLdrPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamSequencePayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamVarintPayload
import com.snap.spectacles.kit.stream.utils.readLengthDelimitedRecord
import com.snap.spectacles.kit.stream.utils.readVarint
import com.snap.spectacles.kit.stream.utils.toVarintBytes
import com.snap.spectacles.kit.stream.utils.writeLengthDelimitedRecord
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.io.OutputStream

/**
 * Spectacles Mobile Kit Protocol message definition.
 */
@RequiresApi(Build.VERSION_CODES.N)
interface SmkpMessage {

    companion object {

        const val CALL = 0x01
        const val NOTIFY = 0x02
        const val DOWNLOAD = 0x03
        const val ATTEST = 0x10
        const val RESPONSE = 0X20

        /**
         * Unpack the provided SpectaclesStreamPayload into a SmkpMessage
         * @param payload the SpectaclesStreamPayload from which the message is unpacked.
         * @return the unpacked SmkpMessage.
         */
        fun unpack(payload: SpectaclesStreamPayload): SmkpMessage {
            return payload.getInputStream().use { input ->
                val type = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Type missing")
                if (type < RESPONSE) {
                    Request.deserialize(type, input)
                } else {
                    Response.deserialize(type, input)
                }
            }
        }

        /**
         * Extracts the SMKP message type identifier from the provided payload without altering it.
         * @param payload The payload from which to read the message type.
         * @return The integer representation of the message type, or 0 if unavailable.
         */
        fun extractMessageType(payload: SpectaclesStreamPayload): Int {
            return payload.getInputStream().use { input ->
                input.readVarint() ?: 0
            }
        }
    }

    /**
     * Packs the message to a SpectaclesStreamPayload.
     */
    fun pack(): SpectaclesStreamPayload

    /**
     * Represents a request in the SMKP protocol.
     */
    class Request(
        val type: Int,
        val path: String,
        val header: Header,
        val body: SpectaclesStreamPayload
    ) : SmkpMessage {

        companion object {

            /**
             * Deserializes the input stream into a Request object.
             * @param type The request type (integer value)
             * @param input The InputStream to read the data from
             * @return The deserialized Request object
             * @throws SpectaclesStreamException If the request body is missing
             */
            fun deserialize(type: Int, input: InputStream): Request {
                val path = input.readLengthDelimitedRecord()?.toString(Charsets.UTF_8)
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Path missing")
                val header = Header.deserialize(input)
                val body = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Body missing")
                return Request(type, path, header, SpectaclesStreamBytesPayload(body))
            }
        }

        override fun pack(): SpectaclesStreamPayload {
            return SpectaclesStreamSequencePayload(
                SpectaclesStreamVarintPayload(type),
                SpectaclesStreamLdrPayload(path.toByteArray(Charsets.UTF_8)),
                header.pack(),
                SpectaclesStreamLdrPayload(body)
            )
        }

        override fun toString(): String {
            return "Request(type = $type, path = $path, header = $header, body=$body)"
        }
    }

    /**
     * Represents a response in the SMKP protocol.
     */
    class Response(
        val type: Int,
        val status: Int,
        val header: Header,
        val body: SpectaclesStreamPayload
    ) : SmkpMessage {

        companion object {

            /**
             * Deserializes the input stream into a Response object.
             * @param type The response type (integer value)
             * @param input The InputStream to read the data from
             * @return The deserialized Response object
             * @throws SpectaclesStreamException If status or body is missing
             */
            fun deserialize(type: Int, input: InputStream): Response {
                val status = input.readVarint()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Status missing")
                val header = Header.deserialize(input)
                val body = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Body missing")
                return Response(type, status, header, SpectaclesStreamBytesPayload(body))
            }

            /**
             * Build an error Response.
             */
            fun error(error: SpectaclesStreamException) =
                Response(RESPONSE, error.code, Header(), SpectaclesStreamBytesPayload.Empty)
        }

        override fun pack(): SpectaclesStreamPayload {
            return SpectaclesStreamSequencePayload(
                SpectaclesStreamVarintPayload(type),
                SpectaclesStreamVarintPayload(status),
                header.pack(),
                SpectaclesStreamLdrPayload(body)
            )
        }

        override fun toString(): String {
            return "Response(type = $type, status = $status, header = $header, body=$body)"
        }
    }

    /**
     * Represents a collection of key-value pairs (headers) for a request or response.
     */
    class Header(
        private val items: MutableList<KeyValue> = mutableListOf()
    ) : Iterable<KeyValue> by items {

        companion object {

            /**
             * Deserializes the input stream into a Header object.
             * @param input The InputStream to read the header data from
             * @return The deserialized Header object
             * @throws SpectaclesStreamException If any key-value pair is missing
             */
            fun deserialize(input: InputStream): Header {
                val fields = mutableListOf<KeyValue>()
                ByteArrayInputStream(input.readLengthDelimitedRecord()).use { header ->
                    while (true) {
                        val field = KeyValue.deserialize(header) ?: break
                        fields.add(field)
                    }
                }
                return Header(fields)
            }
        }

        fun get(key: String): KeyValue? {
            return items.firstOrNull { it.getKey() == key }
        }

        fun add(key: String, value: ByteArray) {
            items.add(KeyValue(key, value))
        }

        fun add(key: String, value: String) {
            items.add(KeyValue(key, value.toByteArray(Charsets.UTF_8)))
        }

        fun add(key: String, value: Int) {
            items.add(KeyValue(key, value.toVarintBytes()))
        }

        fun remove(key: String) {
            items.removeIf { it.getKey() == key }
        }

        internal fun pack(): SpectaclesStreamPayload {
            val header = ByteArrayOutputStream().use { buf ->
                items.forEach { it.serialize(buf) }
                buf.toByteArray()
            }
            return SpectaclesStreamLdrPayload(header)
        }

        override fun toString(): String {
            return joinToString(prefix = "{", postfix = "}")
        }
    }

    /**
     * Represents a key-value pair in the header
     */
    class KeyValue(
        private val key: String,
        private val value: ByteArray,
    ) {

        companion object {

            /**
             * Deserializes the input stream into a Field object.
             * @param input The InputStream to read the header data from
             * @return The deserialized Header object
             * @throws SpectaclesStreamException If any key-value pair is missing
             */
            fun deserialize(input: InputStream): KeyValue? {
                val key = input.readLengthDelimitedRecord()?.toString(Charsets.UTF_8) ?: return null
                val value = input.readLengthDelimitedRecord()
                    ?: throw SpectaclesStreamException(
                        SpectaclesStreamException.BAD_REQUEST, "Value missing for key: $key"
                    )
                return KeyValue(key, value)
            }
        }

        fun getKey() = key

        fun getValue() = value

        fun getStringValue(): String = value.toString(Charsets.UTF_8)

        fun getIntValue(): Int {
            return ByteArrayInputStream(value).use {
                it.readVarint() ?: 0
            }
        }

        internal fun serialize(output: OutputStream) {
            output.writeLengthDelimitedRecord(key.toByteArray(Charsets.UTF_8))
            output.writeLengthDelimitedRecord(value)
        }

        override fun toString(): String {
            return "$key: ${value.joinToString(" ", "[", "]") { "%02x".format(it) }}"
        }
    }
}
