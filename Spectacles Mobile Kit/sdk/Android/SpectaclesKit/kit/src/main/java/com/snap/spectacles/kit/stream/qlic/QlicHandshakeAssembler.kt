package com.snap.spectacles.kit.stream.qlic

import java.io.ByteArrayInputStream
import java.io.SequenceInputStream
import java.util.Vector

/**
 * Assembles fragmented [QlicFrame.Crypto] frames into a complete [QlicHandshake] message.
 */
internal class QlicHandshakeAssembler {

    // Stores pending fragments until the last fragment is received
    private val cachedFragments = mutableListOf<ByteArray>()

    /**
     * Processes received [QlicFrame.Crypto] frames and assembles them into a complete [QlicHandshake] message.
     * It caches the non-last fragments and assembles them when the last fragment arrives.
     *
     * @param frame The received [QlicFrame.Crypto] frame containing a fragment of the handshake message.
     * @return A [QlicHandshake] if the last fragment is received, null otherwise.
     */
    fun assembleHandshake(frame: QlicFrame.Crypto): QlicHandshake? {
        cachedFragments.add(frame.data)
        return if (frame.lastFragment) {
            val input = SequenceInputStream(
                Vector(cachedFragments.map { ByteArrayInputStream(it) }).elements()
            )
            cachedFragments.clear()
            QlicHandshake.deserialize(input)
        } else {
            null
        }
    }
}
