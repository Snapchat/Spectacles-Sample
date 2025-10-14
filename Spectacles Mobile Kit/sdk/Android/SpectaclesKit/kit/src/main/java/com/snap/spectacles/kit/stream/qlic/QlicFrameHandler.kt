package com.snap.spectacles.kit.stream.qlic

/**
 * Interface for handling QLIC frames.
 *
 * This interface defines a single method to handle a QlicFrame. Implementations of this
 * interface are expected to process the frame and return a boolean indicating whether
 * the frame was handled successfully.
 */
internal fun interface QlicFrameHandler {

    /**
     * Handles the given [QlicFrame].
     *
     * @param frame The [QlicFrame] to be handled.
     * @return True if the frame was handled successfully; false otherwise.
     */
    fun handle(frame: QlicFrame): Boolean
}
