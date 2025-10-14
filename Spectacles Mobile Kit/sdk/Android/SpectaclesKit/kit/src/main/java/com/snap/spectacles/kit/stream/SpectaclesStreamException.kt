package com.snap.spectacles.kit.stream

/**
 * Represents an exception that is thrown during stream-related operations.
 *
 * This exception extends from `IOException`, indicating that it deals with issues related to input/output
 * operations, specifically in the context of streams. The `code` property can be used to categorize the
 * type of error that occurred.
 *
 * @property code An integer code representing the specific error condition.
 * @property message An optional message providing more details about the exception.
 * @property cause An optional cause (which is saved for later retrieval by the [Throwable.cause]).
 */
open class SpectaclesStreamException(
    val code: Int,
    message: String? = null,
    cause: Throwable? = null
) : Exception(message, cause) {

    companion object {
        const val BAD_REQUEST = 400
        const val UNAUTHORIZED = 401
        const val FORBIDDEN = 403
        const val INTERNAL_ERROR = 500
        const val NOT_IMPLEMENTED = 501
    }
}
