package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import java.io.InputStream

/**
 * A class representing a proxy for stream payloads.
 * It wraps an input stream provider and provides a mechanism to get the stream when needed.
 *
 * @param size The size of the payload in bytes.
 * @param provider A lambda function that provides the input stream when invoked.
 */
class SpectaclesStreamLazyPayload(
    override val size: Int,
    private val provider: () -> InputStream
) : SpectaclesStreamPayload {

    override fun getInputStream(): InputStream = provider.invoke()

    override fun toString(): String {
        return "SpectaclesStreamLazyPayload(size = $size)"
    }
}
