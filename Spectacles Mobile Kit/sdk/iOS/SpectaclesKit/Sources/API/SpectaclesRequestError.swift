// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

// MARK: - SpectaclesRequestError Enum

/// Enum representing possible errors that can occur during a request.
/// For more information, refer to the documentation at:
/// https://docs.snap.com/api/lens-studio/Classes/ScriptObjects#RemoteApiResponse--statusCode
public enum SpectaclesRequestError: Int, Error {
    /// Default state or unset.
    case unknown

    /// Redirected. Corresponds to the 3XX HTTP response status codes.
    case redirected

    /// Bad request. Corresponds to the 4XX HTTP response status codes other than 401, 403, 404, 408, 413, 414, and 431.
    case badRequest

    /// Access denied. Corresponds to the HTTP response status codes 401 and 403.
    case accessDenied

    /// Not found. Corresponds to the HTTP response status code 404.
    case notFound

    /// Timeout. Corresponds to the HTTP response status codes 408 and 504.
    case timeout

    /// Request too large. Corresponds to the HTTP response status codes 413, 414, and 431.
    case requestTooLarge

    /// Server error. Corresponds to the 5XX HTTP response status codes other than 504.
    case serverError

    /// Request cancelled by the caller.
    case requestCancelled

    /// Internal error in the remote API framework.
    case internalError
}
