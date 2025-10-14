package com.snap.spectacles.kit.stream.utils

import java.io.OutputStream

/**
 * A custom OutputStream that writes to a pre-allocated byte array.
 * This class wraps a byte array and allows writing bytes into it sequentially.
 * The write position is managed internally by the `count` property, which starts at the given `offset`.
 *
 * @param bytes The byte array to which data will be written.
 * @param offset The initial position in the byte array to start writing. Defaults to 0.
 */
class BytesOutputStream(
    private val bytes: ByteArray,
    private val offset: Int = 0
) : OutputStream() {

    // Number of bytes written to the stream
    private var writtenBytes = 0

    /**
     * Returns the number of bytes that have been written to the stream
     */
    fun getAvailable(): Int {
        return writtenBytes
    }

    /**
     * Returns the remaining space in the byte array for writing
     */
    fun getSpace(): Int {
        return bytes.size - offset - writtenBytes
    }

    override fun write(b: ByteArray, off: Int, len: Int) {
        b.copyInto(bytes, offset + writtenBytes, off, off + len)
        writtenBytes += len
    }

    override fun write(b: Int) {
        bytes[offset + writtenBytes] = b.toByte()
        writtenBytes += 1
    }
}
