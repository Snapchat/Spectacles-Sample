package com.snap.spectacles.kit

import com.snap.spectacles.kit.stream.SpectaclesStreamException

/**
 * Exception thrown when a request to the Spectacles fails.
 * For more information, refer to the documentation at:
 * https://docs.snap.com/api/lens-studio/Classes/ScriptObjects#RemoteApiResponse--statusCode
 */
open class SpectaclesRequestException(
    statusCode: Int
) : SpectaclesStreamException(statusCode) {

    /**
     * Default state or unset.
     */
    data object Unknown : SpectaclesRequestException(500)

    /**
     * Redirected. Corresponds to the 3XX HTTP response status codes.
     */
    data object Redirected : SpectaclesRequestException(302)

    /**
     * Bad request. Corresponds to the 4XX HTTP response status codes other than
    // 401, 403, 404, 408, 413, 414, and 431.
     */
    data object BadRequest : SpectaclesRequestException(400)

    /**
     * Access denied. Corresponds to the HTTP response status codes 401 and 403.
     */
    data object AccessDenied : SpectaclesRequestException(403)

    /**
     * Not found. Corresponds to the HTTP response status code 404.
     */
    data object NotFound : SpectaclesRequestException(404)

    /**
     * Timeout. Corresponds to the HTTP response status codes 408 and 504.
     */
    data object Timeout : SpectaclesRequestException(504)

    /**
     * Request too large. Corresponds to the HTTP response status codes 413, 414, and 431.
     */
    data object RequestTooLarge : SpectaclesRequestException(413)

    /**
     * Server error. Corresponds to the 5XX HTTP response status codes other than 504.
     */
    data object ServerError : SpectaclesRequestException(500)

    /**
     * Request cancelled by the caller.
     */
    data object RequestCancelled : SpectaclesRequestException(409)

    /**
     * Internal error in the remote API framework.
     */
    data object InternalError : SpectaclesRequestException(500)
}
