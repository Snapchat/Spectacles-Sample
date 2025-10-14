package com.snap.spectacles.kit.stream

import java.io.Closeable

/**
 * Represents a single stream within a QUIC-like connection.
 * This stream is capable of sending data, handling closure, and notifying listeners of its state.
 */
interface SpectaclesStream : Closeable {

    /**
     * Closes this stream. Once closed, no more data can be sent or received.
     */
    override fun close()

    /**
     * Checks whether the stream is closed.
     * This method can be used to determine if the stream has been closed, either
     * by the local or remote peer, or if the connection has been terminated.
     *
     * @return `true` if the stream is closed, `false` otherwise.
     */
    fun isClosed(): Boolean

    /**
     * Sends the specified data through the stream.
     *
     * @param data The data to be transmitted over the stream.
     * @param onSent Optional callback invoked when the data has been sent.
     * @return A callback that can be called to cancel the transmission.
     */
    fun send(data: SpectaclesStreamDataUnit, onSent: (() -> Unit)? = null): () -> Unit
}
