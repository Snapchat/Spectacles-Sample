package com.snap.spectacles.kit

/**
 * Base exception class for SpectaclesSession-related errors.
 *
 * @param message The error message.
 * @param cause The underlying cause of the error, if any.
 */
open class SessionException(
    message: String,
    cause: Exception? = null
) : Exception(message, cause) {

    /**
     * Exception thrown when a connection attempt fails.
     */
    class ConnectionFailed(message: String) : SessionException(message)
}
