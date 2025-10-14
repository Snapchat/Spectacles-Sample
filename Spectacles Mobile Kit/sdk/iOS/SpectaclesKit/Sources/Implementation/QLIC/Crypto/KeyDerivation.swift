// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation

/**
 A root secret for the handshake, created using the ECDH shared secret and the hello hash.

 Exactly two rounds of expansion should be performed on this secret. First, expand the handshake secret using the hello hash. Then, expand the app secret using full transcript hash.

 ```swift
 var rootSecret = RootSecret(inputKeyMaterial: ecdhSharedSecret, transcriptHash: transcriptHasher.finalize())
 var handshakeSecrets = rootSecret.expandPeerSecrets(type: .handshake, transcriptHash: transcriptHasher.finalize())
 ...
 var appSecrets = rootSecret.expandPeerSecrets(type: .app, transcriptHash: transcriptHasher.finalize())
 ```
 */
struct RootSecret<H: HashFunction> {
    /// Secret type, along with associated labels for HDKF-Expand-Label
    enum SecretType {
        case handshake
        case app

        var secretLabel: String {
            switch self {
            case .handshake: "Handshakederived"
            case .app: "Sessionderived"
            }
        }

        var clientLabel: String {
            switch self {
            case .handshake: "c hs traffic"
            case .app: "c ap traffic"
            }
        }

        var serverLabel: String {
            switch self {
            case .handshake: "s hs traffic"
            case .app: "s ap traffic"
            }
        }
    }

    /// Underlying secret data
    let secret: SymmetricKey

    init(inputKeyMaterial: SymmetricKey, transcriptHash: some ContiguousBytes) {
        let pseudoRandomKey = HKDF<H>.extract(
            inputKeyMaterial: inputKeyMaterial,
            salt: Data(count: H.Digest.byteCount)
        )
        self.secret = HKDF<H>.expand(
            pseudoRandomKey: pseudoRandomKey,
            label: "derived",
            transcriptHash: transcriptHash,
            outputByteCount: H.Digest.byteCount
        )
    }

    /// Expands peer secrets using HKDF-Expand-Label
    func expandPeerSecrets(type: SecretType, transcriptHash: some ContiguousBytes) -> (
        clientSecret: PeerTrafficSecret<H>,
        serverSecret: PeerTrafficSecret<H>
    ) {
        let sharedTrafficSecret = HKDF<H>.expand(
            pseudoRandomKey: secret,
            label: type.secretLabel,
            transcriptHash: transcriptHash,
            outputByteCount: H.Digest.byteCount
        )
        let clientSecret = HKDF<H>.expand(
            pseudoRandomKey: sharedTrafficSecret,
            label: type.clientLabel,
            transcriptHash: Data(),
            outputByteCount: H.Digest.byteCount
        )
        let serverSecret = HKDF<H>.expand(
            pseudoRandomKey: sharedTrafficSecret,
            label: type.serverLabel,
            transcriptHash: Data(),
            outputByteCount: H.Digest.byteCount
        )

        return (PeerTrafficSecret(secret: clientSecret), PeerTrafficSecret(secret: serverSecret))
    }
}

/**
 Secret used to encrypt one half of the connection

 Rather than use this secret directly as the encryption key, we extract pseudorandom key and IV material from this secret, which are then used for encryption.
 */
struct PeerTrafficSecret<H: HashFunction> {
    /// Underlying secret bytes
    var secret: SymmetricKey

    /// Uses HKDF-Expand-Label to extract key and IV material from the underlying secret
    func expandKeys(
        keyLength: Int = EncryptionEngine.TrafficKey.keyLength,
        ivLength: Int = EncryptionEngine.TrafficKey.ivLength,
        securityLevel: SecurityLevel
    ) -> EncryptionEngine.TrafficKey {
        let key = HKDF<H>.expand(
            pseudoRandomKey: secret,
            label: "key",
            transcriptHash: Data(),
            outputByteCount: keyLength
        )
        let iv = HKDF<H>.expand(
            pseudoRandomKey: secret,
            label: "iv",
            transcriptHash: Data(),
            outputByteCount: ivLength
        )
        return EncryptionEngine.TrafficKey(key: key, iv: iv, securityLevel: securityLevel)
    }

    /**
     Updates the traffic secret using HKDF-Expand-Label

     Allows rotating traffic keys once the encryption IV space is close to exhaustion. Should only be called on the final app traffic secrets.
     */
    mutating func update() {
        secret = HKDF<H>.expand(
            pseudoRandomKey: secret,
            label: "traffic upd",
            transcriptHash: Data(),
            outputByteCount: H.Digest.byteCount
        )
    }
}
