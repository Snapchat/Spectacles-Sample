// Copyright © 2024 Snap, Inc. All rights reserved.

/// The security level of the current connection
enum SecurityLevel {
    /// Connection is insecure
    case insecure
    /// Connection is encrypted, but the peer identity hasn't been established yet
    case handshake
    /// Connection is encrypted and the peer identity has been established
    case app

    /// Whether the connection is secure and can be used to transmit app data
    var isAppDataPermitted: Bool {
        switch self {
        case .insecure, .handshake:
            return false
        case .app:
            return true
        }
    }
}
