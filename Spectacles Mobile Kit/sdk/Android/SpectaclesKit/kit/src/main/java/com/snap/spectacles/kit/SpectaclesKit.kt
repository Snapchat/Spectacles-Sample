package com.snap.spectacles.kit

import androidx.annotation.CheckResult
import java.io.Closeable
import java.util.concurrent.Executor
import java.util.function.Consumer

/**
 * Represents the entry point for interacting with the SpectaclesKit SDK.
 * Typically, an app has only one SpectaclesKit instance, but a SpectaclesKit can create multiple Sessions.
 * The SpectaclesKit must be successfully bound before it can interact with Lens via Sessions.
 * The binding status is communicated through [SpectaclesKit.BondingResult].
 */
interface SpectaclesKit {

    /**
     * Identifies a unique SpectaclesKit
     */
    data class ClientIdentifier(
        val value: String,
    ) {
        init { check(value.isNotBlank()) }
    }

    /**
     * Builder interface for constructing a SpectaclesKit.
     * The required identifier/authentication is obtained through authorization,
     * which is used to initialize the SpectaclesKit and manage the connection, communication,
     * and authentication between the App and the Spectacles/Lens.
     */
    interface Builder {

        fun setIdentifier(identifier: ClientIdentifier): Builder

        fun setVersion(version: String): Builder

        fun setRequestExecutor(executor: Executor): Builder

        /**
         * Builds and returns the SpectaclesKit instance.
         *
         * @return The constructed SpectaclesKit.
         */
        fun build(): SpectaclesKit
    }

    /**
     * Represents a binding between a SpectaclesKit and a specific Spectacles.
     * The id serves as a unique identifier for the binding
     */
    interface Bonding {

        val id: String
    }

    sealed class UnbindingResult {

        /**
         * Presents a successful unbinding a Bonding.
         */
        data object Success : UnbindingResult()

        /**
         * Called when Unbinding fails.
         *
         * @param exception The exception that caused the failure.
         */
        data class Failure(
            val exception: Exception
        ) : UnbindingResult()
    }

    sealed class BondingResult {

        /**
         * Presents a successful binding, returning a Bonding instance.
         *
         * @param bonding The successfully created Bonding instance.
         */
        data class Success(
            val bonding: Bonding,
        ) : BondingResult()

        /**
         * Called when binding fails.
         *
         * @param exception The exception that caused the failure.
         */
        data class Failure(
            val exception: Exception
        ) : BondingResult()
    }

    sealed class BondingRequest {

        /**
         * Request to bind to a single Lens, identified by its lensId.
         *
         * @param lensId The unique identifier of the Lens.
         */
        data class SingleLensByLensId(val lensId: String): BondingRequest()

        /**
         * Request to bind to a single Lens, identified by its lensName.
         *
         * @param lensName The name of the Lens.
         */
        data class SingleLensByLensName(val lensName: String) : BondingRequest()

        @Deprecated("Use SingleLensByLensId instead", ReplaceWith("SingleLensByLensId"))
        data class SingleLens(val lensId: String) : BondingRequest()
    }

    sealed class SessionRequest {

        /**
         * If set to true, the SpectaclesSession will automatically attempt to reconnect
         * when the connection with the device is lost; otherwise, the session will automatically close.
         */
        abstract val autoReconnect: Boolean

        /**
         * Indicates whether connections with an unfused (debug) Spectacles are permitted.
         */
        abstract val acceptUnfusedSpectacles: Boolean

        /**
         * An optional pre-shared secret used for encryption.
         *  - The first `ByteArray`: A secret or identifier component.
         *  - The second `ByteArray`: A salt.
         */
        abstract val preSharedSecret: Pair<ByteArray, ByteArray>?

        /**
         * Indicates whether requests from untrusted lens are permitted.
         */
        abstract val acceptUntrustedLens: Boolean

        /**
         * Default session request with optional auto-reconnect capability.
         *
         * @param autoReconnect Whether to automatically reconnect on connection loss.
         */
        data class Default(
            override val autoReconnect: Boolean = true,
            override val acceptUnfusedSpectacles: Boolean = false,
            override val preSharedSecret: Pair<ByteArray, ByteArray>? = null,
            override val acceptUntrustedLens: Boolean = false
        ) : SessionRequest()
    }

    /**
     * Binds the SpectaclesKit to the given BondingRequest, and the result is handled by [onResult].
     *
     * @param request The BondingRequest to process.
     * @param onResult The handler to notify the binding status.
     * @return A Closeable instance that represents the binding operation.
     */
    @CheckResult
    fun bind(request: BondingRequest, onResult: Consumer<BondingResult>): Closeable

    /**
     * Unbinds the SpectaclesKit from a specific Bonding, and the result is handled by [onResult].
     *
     * @param id The identifier of the Bonding to be removed.
     */
    fun unbind(id: String, onResult: Consumer<UnbindingResult>, graceful: Boolean = true): Closeable

    /**
     * Get all available Bondings.
     *
     * @return A list of saved Bonding instances.
     */
    fun availableBondings(): List<Bonding>

    /**
     * Query the Bonding info of the specific [id].
     *
     * @return Bonding info of the given [id], null if bonding is not available.
     */
    fun getBonding(id: String): Bonding?

    fun createSession(
        bonding: Bonding,
        request: SessionRequest,
        delegateBuilder: (SpectaclesSession) -> SpectaclesRequestDelegate,
    ): SpectaclesSession
}
