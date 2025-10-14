package com.snap.spectacles.kit.stream.security

import java.security.MessageDigest

/**
 * Interface for managing a transcript hash, allowing incremental updates and retrieval of the
 * current state of the transcript.
 */
interface TranscriptHashManager {

    /**
     * Adds a message to the transcript, which will be included in the next hash update.
     *
     * @param message The message to add to the transcript.
     */
    fun add(message: ByteArray)

    /**
     * Recalculates the transcript hash to reflect all messages added since the last calculation.
     * This method should be called to finalize updates to the transcript before calling [hash].
     */
    fun update()

    /**
     * Retrieves the current transcript hash, representing the state of the transcript at the
     * last [update] point.
     *
     * @return A byte array containing the transcript hash.
     */
    fun hash(): ByteArray

    /**
     * Default implementation.
     */
    class Default(private val digest: MessageDigest) : TranscriptHashManager {

        constructor(algorithm: String): this(MessageDigest.getInstance(algorithm))

        private var hash: ByteArray = digest.digest()

        override fun add(message: ByteArray) {
            digest.update(message)
        }

        override fun update() {
            hash = (digest.clone() as MessageDigest).digest()
        }

        override fun hash(): ByteArray {
            return hash
        }
    }
}
