package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.stream.SpectaclesStreamException
import java.io.InputStream
import java.io.OutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder

/**
 * Returns the size in bytes required to encode this integer as a QLIC variable-length integer (varint).
 *
 * QLIC varints use a size-optimized encoding where smaller values use fewer bytes:
 * - 1 byte for values less than 0x40
 * - 2 bytes for values less than 0x4000
 * - 4 bytes for values less than 0x40000000
 * - 8 bytes for larger values
 *
 * @return The number of bytes required to encode the integer as a QLIC varint.
 */
fun Int.getVarintSize(): Int {
    val value = toUInt()
    return when {
        value < 0x40u -> 1
        value < 0x4000u -> 2
        value < 0x40000000u -> 4
        else -> 8
    }
}

/**
 * Converts this integer into a byte array representation as a QLIC variable-length integer (varint).
 *
 * @return A byte array representing this integer in QLIC varint format.
 */
fun Int.toVarintBytes(): ByteArray {
    val value = this.toUInt()
    return when {
        value < 0x40u ->
            ByteBuffer.allocate(1)
                .order(ByteOrder.BIG_ENDIAN)
                .put(this.toByte())
                .array()
        value < 0x4000u ->
            ByteBuffer.allocate(2)
                .order(ByteOrder.BIG_ENDIAN)
                .putShort((this or 0x4000).toShort())
                .array()
        value < 0x40000000u ->
            ByteBuffer.allocate(4)
                .order(ByteOrder.BIG_ENDIAN)
                .putInt(this or 0x80000000.toInt())
                .array()
        else ->
            ByteBuffer.allocate(8)
                .order(ByteOrder.BIG_ENDIAN)
                .putInt(0xC0000000.toInt())
                .putInt(this)
                .array()
    }
}

/**
 * Reads a QLIC variable-length integer (varint) from the input stream.
 *
 * @return The decoded integer value, or `null` if there is no more data.
 */
fun InputStream.readVarint(): Int? {
    var value = read()
    if (value == -1) {
        return null
    }

    val (begin, end) = when (value and 0xC0) {
        0x00 -> 1 to 1
        0x40 -> 1 to 2
        0x80 -> 1 to 4
        else -> 4 to 8
    }

    value = value and 0x3F
    for (i in 1.. end - 1) {
        val next = read()
        if (next == -1) {
            throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "Incomplete varint($i)")
        }
        if (i >= begin) {
            value = (value shl 8) + next
        }
    }
    return value
}

/**
 * Encodes the given integer value as a variable-length integer (varint) and writes it to the OutputStream.
 *
 * @param value The integer value to encode and write as a varint.
 */
fun OutputStream.writeVarint(value: Int) {
    write(value.toVarintBytes())
}

/**
 * Returns the total size of a length-delimited record, which includes
 * the size of the varint encoding the length of the byte array, plus the byte array itself.
 *
 * @return The total size of the length-delimited record.
 */
fun ByteArray.getLengthDelimitedRecordSize(): Int {
    return size.getVarintSize() + size
}

/**
 * Reads a length-delimited record from the InputStream.
 * The record is prefixed with its length, encoded as a variable-width integer (varint).
 * This function first reads the length of the record, and then reads the corresponding number
 * of bytes to retrieve the entire record.
 *
 * @return A ByteArray containing the length-delimited record data, or `null` if there is no more data.
 */
fun InputStream.readLengthDelimitedRecord(): ByteArray? {
    val size = readVarint() ?: return null
    if (size > 0x200000) {
        throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "DLR size limit exceeded($size)")
    }
    return readBytes(size)
}

/**
 * Writes a length-delimited record to the OutputStream.
 * The record consists of two parts:
 * 1. The length of the data, encoded as a varint.
 * 2. The actual data as a byte array.
 *
 * @param value The byte array to be written as the record.
 */
fun OutputStream.writeLengthDelimitedRecord(value: ByteArray) {
    writeVarint(value.size)
    write(value)
}

/**
 * Reads a specific number of bytes from the input stream into a byte array.
 * This method ensures that the exact number of requested bytes are read,
 * or throws an exception if the end of the stream is reached before reading the full size.
 *
 * @param size The number of bytes to read from the InputStream.
 * @return A [ByteArray] containing the read bytes.
 */
fun InputStream.readBytes(size: Int): ByteArray {
    val result = ByteArray(size)
    var bytesRead = 0
    while (bytesRead < size) {
        val read = read(result, bytesRead, size - bytesRead)
        if (read <= 0) {
            throw SpectaclesStreamException(SpectaclesStreamException.BAD_REQUEST, "EOF($bytesRead/$size)")
        }
        bytesRead += read
    }
    return result
}
