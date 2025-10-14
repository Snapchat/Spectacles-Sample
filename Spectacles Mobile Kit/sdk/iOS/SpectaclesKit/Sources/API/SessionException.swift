// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

// MARK: - Session Exception Class

public class SessionException: Error, @unchecked Sendable {
    public let message: String
    public let cause: (any Error)?

    public init(message: String, cause: (any Error)? = nil) {
        self.message = message
        self.cause = cause
    }

    public class ConnectionFailed: SessionException {}
}
