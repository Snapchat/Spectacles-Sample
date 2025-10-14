// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

private let DEFAULT_PREFS_NAME = "com.spectacles.kit.bonding_repo"

/**
 * A UserDefaults-based BondingRepository implementation.
 */
final class BondingRepository: Sendable {
    private let userDefaults: UnsafeTransfer<UserDefaults>
    private let serializer: any SpectaclesBondingSerializable

    /// Initialize with UserDefaults and a serializer
    init(
        userDefaults: UserDefaults = .standard,
        serializer: any SpectaclesBondingSerializable = SpectaclesBondingSerializer()
    ) {
        self.userDefaults = UnsafeTransfer(value: userDefaults)
        self.serializer = serializer
    }

    private func getBondingDict() -> [String: String] {
        return userDefaults.value.dictionary(forKey: DEFAULT_PREFS_NAME) as? [String: String] ?? [:]
    }

    private func updateBondingDict(_ dict: [String: String]) {
        userDefaults.value.set(dict, forKey: DEFAULT_PREFS_NAME)
    }

    func getBonding(bondingId: String) -> SpectaclesBonding? {
        return getAllBondings().first { $0.id == bondingId }
    }

    func getAllBondings() -> [SpectaclesBonding] {
        return getBondingDict().compactMap { try? serializer.deserialize(serialized: $0.value) }
    }

    func saveBonding(bonding: SpectaclesBonding) {
        guard let serializedBonding = try? serializer.serialize(source: bonding) else { return }
        var dict = getBondingDict()
        dict[bonding.id] = serializedBonding
        updateBondingDict(dict)
    }

    func deleteBonding(bondingId: String) {
        var dict = getBondingDict()
        dict.removeValue(forKey: bondingId)
        updateBondingDict(dict)
    }
}
