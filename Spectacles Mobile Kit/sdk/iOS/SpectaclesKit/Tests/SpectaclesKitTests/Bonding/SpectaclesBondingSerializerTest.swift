// Copyright © 2024 Snap, Inc. All rights reserved.

import Security
@testable import SpectaclesKit
import XCTest

private let TEST_IDENTIFIER = "E52EFEB2-E3E9-4101-7712-AD17D5E5D260"
private let TEST_DEVICE_ID = "AA55AA55-AA55-AA55-5655-AA554E55AA55"
private let TEST_LENS_ID = "MobileKitTest"
private let TEST_SERIALIZED_PUBLIC_KEY = "public_key"
private let TEST_KEY_ALGORITHM = "ALGO"
private let serializedIdentifier = "\(TEST_DEVICE_ID)#\(TEST_IDENTIFIER)"
private let bondingIdentifier = BondingIdentifier(
    assignedId: UUID(uuidString: TEST_IDENTIFIER)!,
    deviceAddress: UUID(uuidString: TEST_DEVICE_ID)!
)

private func generateECKeyPair() -> SecKey {
    // Key pair attributes
    let keyPairAttributes: [String: Any] = [
        kSecAttrKeyType as String: kSecAttrKeyTypeEC,
        kSecAttrKeySizeInBits as String: 256,
        kSecAttrIsPermanent as String: false, // Set to true if you want to store the keys in the keychain
    ]

    var publicKey: SecKey!
    var error: Unmanaged<CFError>?

    // Generate the key pair
    let privateKey = SecKeyCreateRandomKey(keyPairAttributes as CFDictionary, &error)

    if let privateKey {
        // Extract the public key from the private key
        publicKey = SecKeyCopyPublicKey(privateKey)
    }

    return publicKey
}

class SpectaclesBondingSerializerImplTest: XCTestCase {
    let subject = SpectaclesBondingSerializer()

    func deserializedError(for invalidData: String) -> String {
        return "Failed to deserialize: \(invalidData). Reason: Invalid serialized data"
    }

    let spectaclesBonding = SpectaclesBonding(
        id: serializedIdentifier,
        identifier: bondingIdentifier,
        deviceId: TEST_DEVICE_ID,
        lensId: TEST_LENS_ID,
        publicKey: generateECKeyPair(),
        keyAlgorithm: TEST_KEY_ALGORITHM
    )

    let spectaclesBondingWithoutPublicKey = SpectaclesBonding(
        id: serializedIdentifier,
        identifier: bondingIdentifier,
        deviceId: TEST_DEVICE_ID,
        lensId: TEST_LENS_ID,
        publicKey: nil,
        keyAlgorithm: nil
    )

    func testSerializeDeserialize() async throws {
        let bondingString = try subject.serialize(source: spectaclesBonding)
        let bonding = try subject.deserialize(serialized: bondingString)

        XCTAssertEqual(bonding == spectaclesBonding, true)

        let bondingStringWithoutPublicKey = try subject.serialize(source: spectaclesBondingWithoutPublicKey)
        let bondingWithoutPublicKey = try subject.deserialize(serialized: bondingStringWithoutPublicKey)

        XCTAssertEqual(bondingWithoutPublicKey == spectaclesBondingWithoutPublicKey, true)
    }

    func testDeserializeInvalidRawString() async throws {
        let invalid = "invalid json"
        XCTAssertThrowsError(try subject.deserialize(serialized: "\(invalid)")) { error in
            XCTAssertTrue(error is BondingError)
            if let bondingError = error as? BondingError {
                XCTAssertEqual(bondingError.localizedDescription, deserializedError(for: "\(invalid)"))
            }
        }
    }

    func testDeserializeInvalidIdentifier() async throws {
        var serialized = try subject.serialize(source: spectaclesBonding)
        let invalid = "invalid#identifier"
        serialized = serialized.replacingOccurrences(of: TEST_IDENTIFIER, with: "\(invalid)")
        XCTAssertThrowsError(try subject.deserialize(serialized: serialized)) { error in
            XCTAssertTrue(error is BondingError)
            if let bondingError = error as? BondingError {
                XCTAssertEqual(bondingError.localizedDescription, deserializedError(for: "\(TEST_DEVICE_ID)#\(invalid)"))
            }
        }
    }

    func testDeserializeInvalidPublicKey() async throws {
        var serialized = try subject.serialize(source: spectaclesBonding)

        let publicKeySerializer = PublicKeySerializer(algorithm: TEST_KEY_ALGORITHM)
        let publicKey = try publicKeySerializer.serialize(source: spectaclesBonding.publicKey!)
        let invalidPublicKey = publicKey.replacingOccurrences(of: publicKey.prefix(5), with: "invalid")
        let prefix = publicKey.prefix(5).replacingOccurrences(of: "/", with: "\\/")
        serialized = serialized.replacingOccurrences(of: prefix, with: "invalid")

        XCTAssertThrowsError(try subject.deserialize(serialized: serialized)) { error in
            XCTAssertTrue(error is BondingError)
            if let bondingError = error as? BondingError {
                XCTAssertEqual(bondingError.localizedDescription, deserializedError(for: "\(invalidPublicKey)"))
            }
        }
    }
}
