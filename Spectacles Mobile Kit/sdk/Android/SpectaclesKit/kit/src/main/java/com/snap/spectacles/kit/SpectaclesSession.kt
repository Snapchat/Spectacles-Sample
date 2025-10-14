package com.snap.spectacles.kit

import androidx.annotation.CheckResult
import java.io.Closeable
import java.util.function.Consumer

/**
 * Describes a Kit session responsible for connecting and interacting with a specified Lens.
 */
interface SpectaclesSession {

    /**
     * Describes the metadata of a session, including the Lens ID, version, etc.
     * This information is typically provided by the device upon successful connection.
     */
    data class Metadata(
        val lensId: String,
        val lensVersion: String,
    )

    /**
     * Describe all possible reasons for manually closing a session.
     */
    enum class CloseReason {
        INCOMPATIBLE_LENS,
    }

    /**
     * Describes possible reasons for a session disconnection.
     */
    enum class DisconnectReason {
        SESSION_CLOSED,
        CONNECTION_LOST,
    }

    sealed class ConnectionStatus {

        /**
         * When the connection to the Lens is starting.
         */
        object ConnectStart : ConnectionStatus()

        /**
         * When the connection to the Lens has been established.
         * [sessionMetadata] contains the metadata of the current Lens on the device,
         * which may differ on each successful connection.
         */
        data class Connected(val sessionMetadata: Metadata) : ConnectionStatus()

        /**
         * When the connection to the Lens fails. The exception specifies the possible reason for the failure.
         *
         * @param exception The exception that caused the connection error.
         */
        data class Error(val exception: Exception) : ConnectionStatus()

        /**
         * When the connection to the Lens is disconnected and provides the reason for disconnection.
         *
         * @param reason The reason for the disconnection.
         */
        data class Disconnected(val reason: DisconnectReason) : ConnectionStatus()
    }

    /**
     * Observe the connection status changes of the session.
     *
     * @return The returned [Closeable] allows to cancel the ongoing subscription by calling [Closeable.close].
     * If [Closeable] is ignored then subscription is cancelled once [SpectaclesSession] is closed.
     */
    @CheckResult
    fun observeConnectionStatus(onStatus: Consumer<ConnectionStatus>): Closeable

    /**
     * Queries the current instant connection status of the session.
     */
    fun connectionStatus(): ConnectionStatus

    /**
     * Close the session manually
     */
    fun close(reason: CloseReason?)
}
