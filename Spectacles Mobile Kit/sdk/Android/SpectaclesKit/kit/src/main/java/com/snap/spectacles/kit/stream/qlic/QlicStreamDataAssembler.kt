package com.snap.spectacles.kit.stream.qlic

import com.snap.spectacles.kit.stream.SpectaclesStreamDataUnit
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamBytesPayload
import com.snap.spectacles.kit.stream.utils.SpectaclesStreamSequencePayload

/**
 * Assembles fragmented [QlicFrame.StreamData] frames into a complete [SpectaclesStreamDataUnit] message.
 */
internal class QlicStreamDataAssembler {

    // Stores pending fragments until the last fragment is received
    private val cachedFragments = mutableListOf<ByteArray>()

    /**
     * Processes received [QlicFrame.StreamData] frames and assembles them into a complete
     * [SpectaclesStreamDataUnit] message.
     * It caches the non-last fragments and assembles them when the last fragment arrives.
     *
     * @param frame The received [QlicFrame.StreamData] frame containing a fragment of the handshake message.
     * @return A [SpectaclesStreamDataUnit] if the last fragment is received, null otherwise.
     */
    fun assembleStreamData(frame: QlicFrame.StreamData): SpectaclesStreamDataUnit? {
        cachedFragments.add(frame.payload)
        return if (frame.lastFragment) {
            val payload = SpectaclesStreamSequencePayload(
                cachedFragments.map { SpectaclesStreamBytesPayload(it) }
            )
            cachedFragments.clear()
            SpectaclesStreamDataUnit(frame.fin, QlicStreamId(frame.id).urgency, payload)
        } else {
            null
        }
    }
}
