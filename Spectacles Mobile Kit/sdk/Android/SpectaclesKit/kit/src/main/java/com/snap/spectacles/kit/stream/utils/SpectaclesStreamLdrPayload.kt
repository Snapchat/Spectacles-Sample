package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.stream.SpectaclesStreamPayload

/**
 * Class that wraps an existing [SpectaclesStreamPayload] to prepend its size as a varint.
 * The class is responsible for:
 * 1. Encoding the size of the underlying payload (`ldr`) using a varint.
 * 2. Combining the varint size and the actual payload into a single stream.
 * 3. Providing an accurate total size (varint + payload).
 *
 * @param content The payload to be wrapped and prefixed with its size as a varint.
 */
class SpectaclesStreamLdrPayload(
    private val content: SpectaclesStreamPayload
) : SpectaclesStreamSequencePayload(SpectaclesStreamVarintPayload(content.size), content) {

    constructor(bytes: ByteArray) : this(SpectaclesStreamBytesPayload(bytes))

    override fun toString(): String {
        return "SpectaclesStreamSequencePayload(content = $content)"
    }
}
