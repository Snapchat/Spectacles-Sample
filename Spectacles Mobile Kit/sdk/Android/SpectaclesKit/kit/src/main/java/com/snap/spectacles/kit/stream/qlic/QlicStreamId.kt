package com.snap.spectacles.kit.stream.qlic

/**
 * A data class representing a QLIC stream identifier.
 *
 * @param compact The combined integer value representing the stream ID and its attributes.
 * @param id The unique identifier for the stream.
 * @param urgency The urgency level of the stream, represented as an integer.
 * @param isUnidirectional Indicates whether the stream is unidirectional.
 * @param isClientInitiated Indicates whether the stream was initiated by the client.
 */
internal data class QlicStreamId private constructor(
    val id: Int,
    val urgency: Int,
    val isUnidirectional: Boolean,
    val isClientInitiated: Boolean,
    val compact: Int,
) {

    companion object {

        /**
         * Compacts the given properties into a single integer value that represents the stream ID.
         *
         * @param id The unique identifier for the stream.
         * @param urgency The urgency level of the stream (default is 0).
         * @param unidirectional Indicates whether the stream is unidirectional (default is true).
         * @param clientInitiated Indicates whether the stream was initiated by the client (default is true).
         * @return The compacted integer representation of the stream ID.
         */
        fun compact(
            id: Int,
            urgency: Int,
            unidirectional: Boolean,
            clientInitiated: Boolean
        ): Int =
            (id shl 6) or (urgency and 7 shl 2) or (if (unidirectional) 2 else 0) or (if (clientInitiated) 1 else 0)
    }

    /**
     * Constructor that initializes the [QlicStreamId] from a combined value.
     *
     * @param value The combined integer value representing the stream ID and its attributes.
     */
    constructor(value: Int) : this(
        value ushr 6,
        value ushr 2 and 7,
        (value and 2) != 0,
        (value and 1) != 0,
        value
    )

    /**
     * Constructor to create a [QlicStreamId] using individual parameters.
     *
     * @param id The unique identifier for the stream.
     * @param urgency The urgency level of the stream, default is 0.
     * @param isUnidirectional Indicates whether the stream is unidirectional, default is true.
     * @param isClientInitiated Indicates whether the stream was initiated by the client, default is true.
     */
    constructor(
        id: Int,
        urgency: Int,
        isUnidirectional: Boolean,
        isClientInitiated: Boolean
    ) : this(
        id,
        urgency,
        isUnidirectional,
        isClientInitiated,
        compact(id, urgency, isUnidirectional, isClientInitiated)
    )

    private val hash = compact and 0b111110.inv()

    override fun equals(other: Any?): Boolean {
        return other is QlicStreamId && hash == other.hash
    }

    override fun hashCode(): Int {
        return hash
    }
}
