package com.snap.spectacles.kit.stream

/**
 * Represents a unit of data for streaming to Spectacles, containing information about whether this
 * is the last unit in a sequence, the priority level of the data, and the payload to be transmitted.
 *
 * @property last Boolean flag indicating if this is the last data unit in the sequence.
 * @property priority Defines the priority of the data unit; higher values represent higher priority.
 * @property payload The actual payload data for streaming.
 */
data class SpectaclesStreamDataUnit(
    val last: Boolean,
    val priority: Int,
    val payload: SpectaclesStreamPayload
)
