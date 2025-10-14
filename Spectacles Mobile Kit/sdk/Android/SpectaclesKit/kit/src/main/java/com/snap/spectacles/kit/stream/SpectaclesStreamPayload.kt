package com.snap.spectacles.kit.stream

import java.io.InputStream

/**
 * Represents the payload for a stream request or response.
 */
interface SpectaclesStreamPayload {

    /**
     * Size of the payload in bytes.
     */
    val size: Int

    /**
     * Returns an InputStream for reading the payload data.
     *
     * @return An InputStream representing the payload data.
     */
    fun getInputStream(): InputStream
}
