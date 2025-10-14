package com.snap.spectacles.kit

/**
 * Base exception class for SpectaclesKit-related errors.
 *
 * @param message The error message.
 * @param cause The underlying cause of the error, if any.
 */
open class ClientException(
    message: String,
    cause: Exception? = null
) : Exception(message, cause) {

    /**
     * Exception thrown when the Lens SpectaclesKit is not installed.
     */
    class LensClientNotInstalled(message: String) : ClientException(message)

    /**
     * Exception thrown when the specified device is not found.
     */
    class DeviceNotFound(message: String): ClientException(message)

    /**
     * Exception thrown when the Spectacles app is not installed.
     */
    class SpectaclesAppNotInstalled(message: String): ClientException(message)

    /**
     * Exception thrown when the Spectacles app is not enabled.
     */
    class SpectaclesAppNotEnabled(message: String): ClientException(message)

    /**
     * Exception thrown when the Spectacles app needs to be updated.
     */
    class SpectaclesAppUpdateRequired(message: String): ClientException(message)
}
