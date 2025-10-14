package com.snap.spectacles.kit.stream.qlic

/**
 * Interface for sending QLIC frames.
 *
 * This interface defines a method for sending a QlicFrame, with an optional callback
 * that can be executed after the frame has been sent. This is useful for asynchronous
 * operations where actions may need to be taken after sending a frame.
 */
internal fun interface QlicFrameSender {

    /**
     * Sends the specified [QlicPendingFrame].
     * This method initiates the sending of the frame. The sending process may be performed in a
     * separate thread, allowing the caller to continue execution without waiting for the operation
     * to complete.
     *
     * @param frame The [QlicPendingFrame] to be sent.
     * @param onSent An optional callback that will be executed after the frame is sent.
     */
    fun send(frame: QlicPendingFrame, onSent: (() -> Unit)?)
}
