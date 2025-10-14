package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import java.io.ByteArrayInputStream
import java.io.InputStream

/**
 * A class representing a payload of bytes to be sent over a Spectacles stream.
 *
 * @param bytes The byte array containing the data to be sent.
 * @param offset The starting point within the byte array from which to read. Default is 0.
 * @param size The number of bytes to read from the byte array, starting from the offset.
 *             By default, this is the size of the byte array minus the offset.
 */
class SpectaclesStreamBytesPayload(
    private val bytes: ByteArray,
    private val offset: Int = 0,
    override val size: Int = bytes.size - offset
) : SpectaclesStreamPayload {

    companion object {
        val Empty = SpectaclesStreamBytesPayload(byteArrayOf(), 0, 0)
    }

    override fun getInputStream(): InputStream {
        return ByteArrayInputStream(bytes, offset, size)
    }

    override fun toString(): String {
        return "SpectaclesStreamBytesPayload(size = $size)"
    }
}
