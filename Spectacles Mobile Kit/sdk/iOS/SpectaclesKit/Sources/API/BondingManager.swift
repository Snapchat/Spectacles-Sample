// Copyright © 2024 Snap, Inc. All rights reserved.

public import Foundation

// MARK: - BondingManager Protocol

public protocol BondingManager: Sendable {
    func bind(request: BondingRequest, deeplinkAsyncStream: AsyncStream<URL>) async -> BondingResult
    func unbind(id: String, deeplinkAsyncStream: AsyncStream<URL>) async -> BondingResult
    func availableBondings() -> [any Bonding]
    func getBonding(id: String) -> (any Bonding)?
    func createSession(
        bonding: any Bonding,
        request: SessionRequest,
        delegateBuilder: @escaping (any SpectaclesSession) -> any SpectaclesRequestDelegate
    ) throws -> any SpectaclesSession
}

public struct ClientIdentifier: Sendable {
    public let clientId: String
    public let appName: String

    public enum ClientIdentifierError: Error {
        case emptyValue
    }

    public init?(clientId: String, appName: String) {
        guard !clientId.isEmpty else {
            return nil
        }
        self.clientId = clientId
        self.appName = appName
    }
}

public protocol Authentication: Sendable {
    // We haven't finalized the authentication solution yet,
    // and will provide the details once it's confirmed.
}

public protocol Bonding: Sendable {
    var id: String { get }
}

public typealias BondingResult = Result<any Bonding, any Error>

public enum BondingRequest: Sendable {
    case singleLens(lensId: String)
    case singleLensByName(lensName: String)
}

public struct SessionRequest: Sendable {
    public let autoReconnect: Bool
    public let acceptUnfusedSpectacles: Bool
    public let acceptUntrustedLenses: Bool

    public init(
        autoReconnect: Bool = true,
        acceptUnfusedSpectacles: Bool = false,
        acceptUntrustedLenses: Bool = false
    ) {
        self.autoReconnect = autoReconnect
        self.acceptUnfusedSpectacles = acceptUnfusedSpectacles
        self.acceptUntrustedLenses = acceptUntrustedLenses
    }
}
