package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import java.io.ByteArrayInputStream
import java.io.InputStream

/**
 * A class that wraps an integer value and encodes it as a varint, which can then be used as a payload.
 * The class implements [SpectaclesStreamPayload], meaning it provides an input stream for the encoded varint value.
 *
 * @param value The integer value to be encoded as a varint.
 */
class SpectaclesStreamVarintPayload(
    private val value: Int
) : SpectaclesStreamPayload {

    private val varint = value.toVarintBytes()

    override val size: Int = varint.size

    override fun getInputStream(): InputStream {
        return ByteArrayInputStream(varint)
    }

    override fun toString(): String {
        return "SpectaclesStreamVarintPayload(value = $value)"
    }
}
