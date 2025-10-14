// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

// MARK: - SpectaclesSession Protocol

public protocol SpectaclesSession: Sendable {
    var connectionStatusStream: AsyncStream<ConnectionStatus> { get }
    var connectionStatus: ConnectionStatus { get }

    func close(reason: CloseReason?)
}

public enum CloseReason: Sendable {
    case incompatibleLens
}

public enum DisconnectReason: Sendable {
    case sessionClosed
    case connectionLost
}

public enum ConnectionStatus: Sendable {
    case connectStart
    case connected(Metadata)
    case error(any Error)
    case disconnected(DisconnectReason)
}

public struct Metadata: Sendable {
    public let lensId: String
    public let lensVersion: String
}
