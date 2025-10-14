// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

let BONDING_IDENTIFIER = "id"
let BONDING_DEVICE_ID = "deviceId"
let BONDING_LENS_ID = "lensId"
let BONDING_PUBLIC_KEY = "key"
let BONDING_KEY_ALGORITHM = "algo"

/**
 * A serializer protocol that can serialize and deserialize objects of type SourceType to and from
 * objects of type SerializedType.
 */
protocol Serializer: Sendable {
    associatedtype SourceType
    associatedtype SerializedType

    /// Serializes the given source object.
    /// - Parameter source: The object to serialize.
    /// - Returns: The serialized representation of the object.
    func serialize(source: SourceType) throws -> SerializedType

    /// Deserializes the given serialized object.
    /// - Parameter serialized: The serialized representation to deserialize.
    /// - Returns: The deserialized object.
    func deserialize(serialized: SerializedType) throws -> SourceType
}

protocol BondingIdentifierSerializable: Serializer where SourceType == BondingIdentifier, SerializedType == String {}
protocol PublicKeySerializable: Serializer where SourceType == SecKey, SerializedType == String {}
protocol SpectaclesBondingSerializable: Serializer where SourceType == SpectaclesBonding, SerializedType == String {}

enum BondingError: Error {
    case serializationError(reason: String)
    case deserializationError(serializedData: String, reason: String = "Invalid serialized data")
}

extension BondingError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case let .serializationError(reason):
            return "Failed to serialize: \(reason)"
        case let .deserializationError(serializedData, reason):
            return "Failed to deserialize: \(serializedData). Reason: \(reason)"
        }
    }
}

final class SpectaclesBondingSerializer: SpectaclesBondingSerializable {
    private let identifierSerializer: @Sendable () -> any BondingIdentifierSerializable
    private let publicKeySerializer: @Sendable (String) -> any PublicKeySerializable
    private let jsonBuilder: @Sendable (String?) -> [String: Any]

    /// Initializer with default values for serializers and JSON builder
    init(
        identifierSerializer: @escaping @Sendable () -> any BondingIdentifierSerializable = { BondingIdentifierSerializer() },
        publicKeySerializer: @escaping @Sendable (String) -> any PublicKeySerializable = { algo in PublicKeySerializer(algorithm: algo) },
        jsonBuilder: @escaping @Sendable (String?) -> [String: Any] = { rawValue in
            guard let value = rawValue, let data = value.data(using: .utf8) else {
                return [:]
            }
            return (try? JSONSerialization.jsonObject(with: data, options: [])) as? [String: Any] ?? [:]
        }
    ) {
        self.identifierSerializer = identifierSerializer
        self.publicKeySerializer = publicKeySerializer
        self.jsonBuilder = jsonBuilder
    }

    func serialize(source: SpectaclesBonding) throws -> String {
        let json = jsonBuilder(nil)

        do {
            var updatedJson = json
            updatedJson[BONDING_IDENTIFIER] = try identifierSerializer().serialize(source: source.identifier)
            updatedJson[BONDING_DEVICE_ID] = source.deviceId
            updatedJson[BONDING_LENS_ID] = source.lensId
            if let keyAlgorithm = source.keyAlgorithm, let publicKey = source.publicKey {
                let keySerializer = publicKeySerializer(keyAlgorithm)
                updatedJson[BONDING_PUBLIC_KEY] = try keySerializer.serialize(source: publicKey)
                updatedJson[BONDING_KEY_ALGORITHM] = keyAlgorithm
            }

            let jsonData = try JSONSerialization.data(withJSONObject: updatedJson, options: [])
            return String(data: jsonData, encoding: .utf8) ?? "{}"
        } catch {
            throw BondingError.serializationError(reason: error.localizedDescription)
        }
    }

    func deserialize(serialized: String) throws -> SpectaclesBonding {
        let json = jsonBuilder(serialized)

        guard let id = json[BONDING_IDENTIFIER] as? String else {
            throw BondingError.deserializationError(serializedData: serialized)
        }

        guard let deviceId = json[BONDING_DEVICE_ID] as? String else {
            throw BondingError.deserializationError(serializedData: serialized)
        }

        guard let lensId = json[BONDING_LENS_ID] as? String else {
            throw BondingError.deserializationError(serializedData: serialized)
        }

        if let keyAlgorithm = json[BONDING_KEY_ALGORITHM] as? String {
            let keySerializer = publicKeySerializer(keyAlgorithm)
            return SpectaclesBonding(
                id: id,
                identifier: try identifierSerializer().deserialize(serialized: id),
                deviceId: deviceId,
                lensId: lensId,
                publicKey: try keySerializer.deserialize(serialized: json[BONDING_PUBLIC_KEY] as? String ?? ""),
                keyAlgorithm: keyAlgorithm
            )
        } else {
            return SpectaclesBonding(
                id: id,
                identifier: try identifierSerializer().deserialize(serialized: id),
                deviceId: deviceId,
                lensId: lensId,
                publicKey: nil,
                keyAlgorithm: nil
            )
        }
    }
}

final class PublicKeySerializer: PublicKeySerializable {
    private let algorithm: String

    init(algorithm: String) {
        self.algorithm = algorithm
    }

    func serialize(source: SecKey) throws -> String {
        // Step 1: Export the SecKey to Data
        guard let keyData = SecKeyCopyExternalRepresentation(source, nil) else {
            let reason = "Failed to copy external representation of the SecKey."
            throw BondingError.serializationError(reason: reason)
        }

        // Step 2: Convert Data to Base64 String
        let base64String = (keyData as Data).base64EncodedString()
        return base64String
    }

    func deserialize(serialized: String) throws -> SecKey {
        guard let data = Data(base64Encoded: serialized) else {
            throw BondingError.deserializationError(serializedData: serialized)
        }

        // TODO: Adjust based on the algorithm
        let attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeEC,
            kSecAttrKeyClass as String: kSecAttrKeyClassPublic,
            kSecAttrKeySizeInBits as String: 256, // Adjust size as necessary
        ]

        var error: Unmanaged<CFError>?
        guard let publicKey = SecKeyCreateWithData(data as CFData, attributes as CFDictionary, &error) else {
            let reason = "Error creating public key: \(String(describing: error?.takeRetainedValue()))"
            throw BondingError.deserializationError(serializedData: serialized, reason: reason)
        }

        return publicKey
    }
}

final class BondingIdentifierSerializer: BondingIdentifierSerializable {
    private let delimiter: String

    init(delimiter: String = "#") {
        self.delimiter = delimiter
    }

    func serialize(source: BondingIdentifier) throws -> String {
        return "\(source.deviceAddress.uuidString)\(delimiter)\(source.assignedId.uuidString)"
    }

    func deserialize(serialized: String) throws -> BondingIdentifier {
        let parts = serialized.split(separator: Character(delimiter))
        guard parts.count == 2 else {
            throw BondingError.deserializationError(serializedData: serialized)
        }
        guard
            let deviceAddress = UUID(uuidString: String(parts[0])),
            let assignedId = UUID(uuidString: String(parts[1]))
        else {
            throw BondingError.deserializationError(serializedData: serialized)
        }
        return BondingIdentifier(assignedId: assignedId, deviceAddress: deviceAddress)
    }
}
