// Copyright © 2024 Snap, Inc. All rights reserved.

@preconcurrency import CryptoKit
import Foundation

/// Seals and opens packet payloads based on the encryption state.
struct EncryptionEngine {
    enum EncryptionError: Error {
        /// Thrown when trying to encrypt/decrypt a packet would lead to nonce reuse via overflow
        case nonceOverflow
        /// Thrown when packet payload is too small to contain a valid auth tag
        case payloadTooShort
    }

    /// Traffic key for encrypting a packet
    struct TrafficKey: Sendable, Equatable {
        /// The required length of the key
        static let keyLength = 16
        /// The required length of the iv
        static let ivLength = 12

        /// The 16 byte key to use
        let key: SymmetricKey
        /// The 12 byte IV
        let iv: SymmetricKey
        /// The security level of the key
        let securityLevel: SecurityLevel
    }

    /// Length of the authentication tag this encryptor adds
    static let tagLength = 16

    /// Encryptor for encrypting outgoing packets.
    private var txEncryptor: Encryptor?

    /// Encryptor for decrypting incoming packets
    private var rxDecryptor: Encryptor?

    /// Security level of outgoing packets
    private(set) var txSecurityLevel = SecurityLevel.insecure

    /// Security level of incoming packets
    private(set) var rxSecurityLevel = SecurityLevel.insecure

    /**
     Whether the encryption engine needs a key update soon.

     For now, we rotate the keys if we're within 1000 packets of overflowing a nonce counter
     */
    var shouldUpdateKey: Bool {
        if let txEncryptor, UInt64.max - txEncryptor.counter < 1000 {
            return true
        }
        if let rxDecryptor, UInt64.max - rxDecryptor.counter < 1000 {
            return true
        }
        return false
    }

    /// Sets a new TX key, resetting the current tx encryptor state
    mutating func updateTxKey(_ trafficKey: TrafficKey) {
        txEncryptor = Encryptor(trafficKey: trafficKey)
        txSecurityLevel = trafficKey.securityLevel
    }

    /// Sets a new RX key, resetting the current rx decryptor state
    mutating func updateRxKey(_ trafficKey: TrafficKey) {
        rxDecryptor = Encryptor(trafficKey: trafficKey)
        rxSecurityLevel = trafficKey.securityLevel
    }

    /**
     Optionally encrypts packet payloads before they are sent over the wire

     When encryption is disabled, returns the unmodified payload

     When encryption is enabled, encrypts the payload and returns the ciphertext followed by the 16 byte authentication tag.
     */
    mutating func seal(payload: Data) throws(QLICError) -> [Data] {
        if txEncryptor == nil {
            return [payload]
        } else {
            do {
                let sealed = try txEncryptor!.seal(plaintext: payload)
                return [sealed.ciphertext, sealed.tag]
            } catch {
                throw .cryptoError(code: .internalError, reason: "Encryption failed", underlying: error)
            }
        }
    }

    /**
     Optionally encrypts packet payloads before they are sent over the wire

     When encryption is disabled, returns the unmodified payload

     When encryption is enabled, slices the 16 byte authentication tag off the end of the payload, and decrypts the remainder.
     */
    mutating func open(payload: Data) throws(QLICError) -> Data {
        if rxDecryptor == nil {
            return payload
        } else {
            guard payload.count >= Self.tagLength else {
                throw .cryptoError(
                    code: .decodeError,
                    reason: "Payload too short",
                    underlying: EncryptionError.payloadTooShort
                )
            }
            do {
                return try rxDecryptor!.open(
                    ciphertext: payload[..<(payload.endIndex - Self.tagLength)],
                    tag: payload[(payload.endIndex - Self.tagLength)...]
                )
            } catch {
                throw .cryptoError(code: .badRecordMac, reason: "Decryption failed", underlying: error)
            }
        }
    }

    /**
     Returns the maximum amount of unencrypted data that can fit in a given packet payload

     When encryption is disabled, returns the unmodified payload size

     When encryption is enabled, subtracts the 16 byte authentication tag size
     */
    func maxUnencryptedPayloadSize(packetPayloadSize: Int) -> Int {
        if txEncryptor == nil {
            return packetPayloadSize
        } else {
            return packetPayloadSize - Self.tagLength
        }
    }

    /**
     Returns the total packet payload size for an unencrypted payload size

     When encryption is disabled, returns the unmodified payload size

     When encryption is enabled, adds the 16 byte authentication tag size
     */
    func packetPayloadSize(for unencryptedPayloadSize: Int) -> Int {
        if txEncryptor == nil {
            return unencryptedPayloadSize
        } else {
            return unencryptedPayloadSize + Self.tagLength
        }
    }
}
