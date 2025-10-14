package com.snap.spectacles.kit.stream

import java.io.Closeable

/**
 * Represents a connection that supports QUIC-like communication.
 */
interface SpectaclesStreamConnection : Closeable {

    /**
     * Closes the connection gracefully, ensuring all streams are terminated.
     */
    override fun close()

    /**
     * Establishes a connection to the remote peer.
     * This method attempts to connect to the given [SpectaclesStreamAddress] with a specified timeout.
     *
     * @param endpoint The remote endpoint to connect to.
     * @param timeout The timeout (in milliseconds) to wait for the connection to be established.
     */
    fun connect(endpoint: SpectaclesStreamAddress, timeout: Int)

    /**
     * Retrieves the remote address of the connected peer.
     * @return A [SpectaclesStreamAddress] representing the remote endpoint.
     */
    fun getRemoteAddress(): SpectaclesStreamAddress?

    /**
     * Checks if the connection is active and open.
     *
     * @return `true` if connected, `false` otherwise.
     */
    fun isConnected(): Boolean

    /**
     * Registers a listener to be invoked when the connection is disconnected.
     * This method allows the user to specify a callback that will be triggered when the connection is lost,
     * either due to an intentional closure, network failure, or an error.
     * The listener will receive an integer code that provides additional information about the reason for
     * the disconnection.
     *
     * @param onDisconnected A `Consumer` that accepts an integer code, representing the reason for disconnection.
     */
    fun setOnDisconnectedListener(onDisconnected: (Int) -> Unit)

    /**
     * Starts a bidirectional stream over this connection.
     *
     * @param onReceive A callback invoked when a new packet is received on the stream.
     * @param onClose A callback invoked when the stream is closed.
     * @return A [SpectaclesStream] representing the active stream.
     */
    fun startStream(
        onReceive: (SpectaclesStreamDataUnit) -> Unit,
        onClose: () -> Unit
    ): SpectaclesStream

    /**
     * Starts an unidirectional stream over this connection.
     *
     * @param onClose A callback invoked when the stream is closed.
     * @return A [SpectaclesStream] representing the active stream.
     */
    fun startStream(
        onClose: () -> Unit
    ): SpectaclesStream

    /**
     * Enables or disables low latency mode.
     *
     * @param enable If true, enables low latency mode; if false, disables it.
     */
    fun setLowLatencyMode(enable: Boolean)

    /**
     * Sets the duration for the Keep-Alive mechanism.
     *
     * @param duration The duration (in milliseconds) for which the connection can stay idle before
     *                 the Keep-Alive check.
     */
    fun setKeepAliveTime(duration: Long)
}
