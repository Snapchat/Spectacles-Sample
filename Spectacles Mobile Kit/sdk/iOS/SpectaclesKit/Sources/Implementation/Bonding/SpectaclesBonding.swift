// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

struct BondingIdentifier: Equatable {
    /// The bonding ID assigned by the Spectacles when creating a bonding
    let assignedId: UUID
    /// BLE address of the Spectacles
    let deviceAddress: UUID

    enum Keys: String {
        case assignedId = "bondingId"
        case deviceAddress = "address"
    }
}

struct SpectaclesBonding: Bonding, Equatable {
    public let id: String

    let identifier: BondingIdentifier
    let deviceId: String
    let lensId: String
    var publicKey: SecKey?
    var keyAlgorithm: String?
}
