// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation

/**
 Implements unidirectional authenticated encryption

 Uses AES-GCM-128 with 12 byte nonces. Nonces are constructed by xor'ing together a 12-byte initial value (IV) and an 8-byte big-endian counter. The counter starts at 0 and automatically increments each time data is encrypted or decrypted.

 Each `Encryptor` instance should be used to provide either encryption or decryption, but not both. For bidirectional encryption, two separate `Encryptor` instances with separate traffic keys must be used.
 */
struct Encryptor {
    /// The 16 byte pseudo-random encryption key
    private let key: SymmetricKey
    /// The lower 8 bytes of the IV, extracted as a UInt64 to make xor'ing easier
    private let ivLower: UInt64
    /// Auto-incrementing 8 byte counter
    private(set) var counter: UInt64 = 0
    /**
     12 byte buffer used to construct the nonce

     The top 4 bytes are equal to the top 4 bytes of the IV. The bottom 8 bytes are set to `ivLower ^ counter` to construct the new nonce value.
     */
    private var nonceBuffer: Data

    init(trafficKey: EncryptionEngine.TrafficKey) {
        self.key = trafficKey.key
        self.ivLower = trafficKey.iv.withUnsafeBytes {
            UInt64(bigEndian: $0.loadUnaligned(fromByteOffset: 4, as: UInt64.self))
        }
        self.nonceBuffer = trafficKey.iv.withUnsafeBytes { Data($0) }
    }

    /// Generates a new nonce, and increments the counter.
    private mutating func nextNonce() throws -> AES.GCM.Nonce {
        // Could technically get another record out of this, but we should've rotated the key ages ago.
        guard counter < .max else { throw EncryptionEngine.EncryptionError.nonceOverflow }
        let nonceLower = ivLower ^ counter
        counter += 1
        nonceBuffer.withUnsafeMutableBytes {
            $0.storeBytes(of: nonceLower.bigEndian, toByteOffset: 4, as: UInt64.self)
        }

        return try AES.GCM.Nonce(data: nonceBuffer)
    }

    /// Encrypts and attests a plaintext
    mutating func seal(plaintext: Data) throws -> (ciphertext: Data, tag: Data) {
        let box = try AES.GCM.seal(plaintext, using: key, nonce: nextNonce())
        return (box.ciphertext, box.tag)
    }

    /// Decrypts and verifies a ciphertext
    mutating func open(ciphertext: Data, tag: Data) throws -> Data {
        let box = try AES.GCM.SealedBox(nonce: nextNonce(), ciphertext: ciphertext, tag: tag)
        Log.print("keyHexString =", key)
        return try AES.GCM.open(box, using: key)
    }
}
