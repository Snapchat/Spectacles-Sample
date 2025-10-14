package com.snap.spectacles.kit.stream.utils

import com.snap.spectacles.kit.stream.SpectaclesStreamPayload
import java.io.InputStream
import java.io.SequenceInputStream
import java.util.Vector

/**
 * Represents a payload composed of multiple sequential payloads.
 * This class allows treating multiple [SpectaclesStreamPayload] objects as a single continuous payload.
 *
 * @param items A collection of [SpectaclesStreamPayload] instances that are part of this composite payload.
 */
open class SpectaclesStreamSequencePayload(
    private val items: Iterable<SpectaclesStreamPayload>
) : SpectaclesStreamPayload {

    constructor(vararg args: SpectaclesStreamPayload) : this(args.asIterable())

    override val size: Int = items.sumOf { it.size }

    override fun getInputStream(): InputStream {
        return SequenceInputStream(
            Vector(items.map { it.getInputStream() }).elements()
        )
    }

    override fun toString(): String {
        return "SpectaclesStreamSequencePayload(size = $size)"
    }
}
