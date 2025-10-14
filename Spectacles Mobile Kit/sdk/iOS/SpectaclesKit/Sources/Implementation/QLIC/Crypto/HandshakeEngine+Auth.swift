// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import DeviceCheck
import Foundation
import Security

enum HandshakeAuthError: Error {
    case wrongShareDataType(AuthenticationShareData)
    case missingAttestationChallenge
    case attestationChallengeMismatch
    case insufficentKeySecurity(KeyDescription)
}

/// Provides auth share data, and signs the handshake
@SecurityActor
protocol HandshakeAuthProvider: Sendable {
    /// The algorithm this auth provider uses for attestion
    nonisolated var algorithm: AuthenticationAlgorithm { get }

    /// Creates authentication share data that attests a signing identity
    func makeShareData(transcriptHash: Data) async throws -> AuthenticationShareData

    /// Uses the attested signing identity to sign the current handshake context
    func makeVerifySignature(transcriptHash: Data) throws -> Data
}

/// Verifies auth share data and handshake signatures
@SecurityActor
protocol HandshakeAuthVerifier: Sendable {
    /// The algorithm this auth provider can verify
    nonisolated var algorithm: AuthenticationAlgorithm { get }

    /// Verifies that received `authenticationShare` record contains an acceptable signing identity
    func verify(shareData: AuthenticationShareData, transcriptHash: Data) async throws(QLICError)

    /// Verifies the signature from the `authenticationVerify` record
    func verify(signature: Data, transcriptHash: Data) throws(QLICError)
}

extension QLICError {
    static func wrongShareDataType(_ shareData: AuthenticationShareData) -> QLICError {
        let underlying = HandshakeAuthError.wrongShareDataType(shareData)
        return .cryptoError(code: .illegalParameter, reason: "Wrong auth share data type", underlying: underlying)
    }
}

/**
 Protocol wrapping P256 signing key API.

 The secure enclave isn't available in unit tests, so we need to be able to substitute in normal private keys.
 */
@SecurityActor
protocol P256SigningKey {
    var publicKey: P256.Signing.PublicKey { get }
    func signature(for data: some Digest) throws -> P256.Signing.ECDSASignature
}
extension SecureEnclave.P256.Signing.PrivateKey: P256SigningKey {}

#if DEBUG

/// Debug provider that provides unauthenticated share data and a dummy verify signature
struct UnauthenticatedAuthProvider: HandshakeAuthProvider {
    var algorithm: AuthenticationAlgorithm { .unauthenticated }

    let identity: String

    func makeShareData(transcriptHash: Data) async throws -> AuthenticationShareData {
        .unauthenticated(identity: identity)
    }

    func makeVerifySignature(transcriptHash: Data) throws -> Data {
        Data(count: 32)
    }
}

/// Debug provider that accepts unauthenticated share data and accepts any signature
struct UnauthenticatedAuthVerifier: HandshakeAuthVerifier {
    var algorithm: AuthenticationAlgorithm { .unauthenticated }

    let identity: String?

    func verify(shareData: AuthenticationShareData, transcriptHash: Data) throws(QLICError) {
        guard case let .unauthenticated(peerIdentity) = shareData else {
            throw .wrongShareDataType(shareData)
        }
        if let identity, identity != peerIdentity {
            let underlying = HandshakeAuthError.attestationChallengeMismatch
            throw .cryptoError(code: .accessDenied, reason: "Identity mismatch", underlying: underlying)
        }
    }

    func verify(signature: Data, transcriptHash: Data) throws(QLICError) { }
}
#endif

extension Data {
    /**
     Called on transcript hashes to derive the challenge to be signed

     This consists of:
      * A string that consists of octet 32 (0x20) repeated 64 times
      * The context string (either "QLIC, client CertificateVerify" or "QLIC, server CertificateVerify")
      * A single 0 byte which serves as the separator
      * The content to be signed
     */
    func makeSignatureContent(isClientSignature: Bool) -> SHA384Digest {
        var hasher = SHA384()
        hasher.update(data: Data(repeating: 0x20, count: 64))
        let context = isClientSignature ? "QLIC, client CertificateVerify" : "QLIC, server CertificateVerify"
        hasher.update(data: context.data(using: .utf8)!)
        hasher.update(data: [0])
        hasher.update(data: self)
        return hasher.finalize()
    }
}

extension P256SigningKey {
    /// Signs a transcript hash using this signing key
    func signature(for transcriptHash: Data, isClient: Bool) throws -> Data {
        let hash = transcriptHash.makeSignatureContent(isClientSignature: isClient)
        Log.print("signature hash =", Data(hash))
        return try signature(for: hash).derRepresentation
    }
}

@SecurityActor
extension SecKey {
    /// Verifies that a signature is valid for a given transcript hash
    func verifySignature(_ signature: Data, for transcriptHash: Data, isClient: Bool) throws {
        try verifySignature(
            algorithm: .ecdsaSignatureDigestX962SHA384,
            signedData: Data(transcriptHash.makeSignatureContent(isClientSignature: !isClient)),
            signature: signature
        )
    }
}

/// Provider that signs using a pretrusted key from a prior connection without additional attestation
struct PretrustedAuthProvider: HandshakeAuthProvider {
    /// The local peer's signing key
    let key: any P256SigningKey
    /// Whether the local peer is acting as the client or server
    let isClient: Bool
    let algorithm: AuthenticationAlgorithm

    init(key: any P256SigningKey, isClient: Bool) {
        self.key = key
        self.isClient = isClient
        self.algorithm = .pretrusted(publicKey: key.publicKey.x963Representation)
    }

    func makeShareData(transcriptHash: Data) async throws -> AuthenticationShareData {
        .pretrusted
    }

    func makeVerifySignature(transcriptHash: Data) throws -> Data {
        try key.signature(for: transcriptHash, isClient: isClient)
    }
}

struct PretrustedAuthVerifier: HandshakeAuthVerifier {
    /// The remove peer's signing public key
    let peerPublicKey: SecKey
    /// Whether the local peer is acting as the client or server
    let isClient: Bool
    let algorithm: AuthenticationAlgorithm

    init(peerPublicKey: SecKey, isClient: Bool) throws {
        self.peerPublicKey = peerPublicKey
        self.isClient = isClient
        self.algorithm = .pretrusted(publicKey: try peerPublicKey.copyExternalRepresentation())
    }

    func verify(shareData: AuthenticationShareData, transcriptHash: Data) throws(QLICError) {
        guard case .pretrusted = shareData else {
            throw .wrongShareDataType(shareData)
        }
    }

    func verify(signature: Data, transcriptHash: Data) throws(QLICError) {
        do {
            try peerPublicKey.verifySignature(signature, for: transcriptHash, isClient: isClient)
        } catch {
            throw .cryptoError(code: .decryptError, reason: "Signature mismatch", underlying: error)
        }
    }
}

/// Provider that attests a key using the device check framework, and then uses it for signing
struct DeviceCheckAuthProvider: HandshakeAuthProvider {
    /// The local peer's signing key
    let key: any P256SigningKey
    var algorithm: AuthenticationAlgorithm { .iosDeviceCheck }

    /// Error thrown when the device check framework is not supported
    struct UnsupportedError: Error {}

    func makeShareData(transcriptHash: Data) async throws -> AuthenticationShareData {
        let publicKeyData = key.publicKey.derRepresentation
        var hasher = SHA256()
        hasher.update(data: transcriptHash)
        hasher.update(data: publicKeyData)
        // App attest keys cannot be attested multiple times, so we need to generate a new one for each auth attempt
        let statement = try await DCAppAttestService.shared.attestKey(
            DCAppAttestService.shared.generateKey(),
            clientDataHash: Data(hasher.finalize())
        )
        Log.print("publicKey = ", publicKeyData)
        return .iosDeviceCheck(publicKey: publicKeyData, attestationObject: statement)
    }

    func makeVerifySignature(transcriptHash: Data) throws -> Data {
        Log.print("transcriptHash = ", transcriptHash)
        return try key.signature(for: transcriptHash, isClient: true)
    }
}

/**
 Verifies that a cert chain is rooted in of our root certs, and that the leaf cert contains the transcript hash as the attestaton challenge
 */
final class X509CertAuthVerifier: HandshakeAuthVerifier {
    /// Auth repository to store any newly trusted public keys to
    let authRepository: any AuthRepository
    /// Whether we should skip checking the attestation security environment
    let skipEnvironmentCheck: Bool
    /// Root certs we should check against
    let rootCerts: [SecCertificate]
    /// The newly trusted peer public key.
    var peerPublicKey: SecKey?
    var algorithm: AuthenticationAlgorithm { .x509Cert }

    init(authRepository: any AuthRepository, skipEnvironmentCheck: Bool = false, rootCerts: [SecCertificate]) {
        self.authRepository = authRepository
        self.skipEnvironmentCheck = skipEnvironmentCheck
        self.rootCerts = rootCerts
    }

    func verify(shareData: AuthenticationShareData, transcriptHash: Data) async throws(QLICError) {
        guard case let .x509Cert(certChain) = shareData else {
            throw .wrongShareDataType(shareData)
        }
        let trust: SecTrust
        do {
            let certs = try certChain.map {
                try SecCertificate.create(data: $0)
            }
            trust = try SecTrust.create(certificates: certs)
            try trust.setAnchorCertificates(rootCerts)
            try trust.evaluate()
        } catch {
            throw .cryptoError(code: .badCertificate, reason: "Bad certificate", underlying: error)
        }

        let keyDescription: KeyDescription?
        do {
            keyDescription = try certChain[0].getAttestationKeyDescription()
        } catch {
            throw .cryptoError(code: .badCertificate, reason: "Bad certificate", underlying: error)
        }
        guard let keyDescription else {
            let underlying = HandshakeAuthError.missingAttestationChallenge
            throw .cryptoError(code: .missingExtension, reason: "Missing extension", underlying: underlying)
        }
        guard keyDescription.attestationChallenge == Data(transcriptHash) else {
            let underlying = HandshakeAuthError.attestationChallengeMismatch
            throw .cryptoError(code: .badCertificate, reason: "Bad certificate", underlying: underlying)
        }
        if !skipEnvironmentCheck {
            guard
                keyDescription.attestationSecurityLevel == .trustedEnvironment,
                keyDescription.keyMintSecurityLevel == .trustedEnvironment,
                keyDescription.deviceLocked,
                keyDescription.bootState == .verified
            else {
                let underlying = HandshakeAuthError.insufficentKeySecurity(keyDescription)
                throw .cryptoError(code: .badCertificate, reason: "Untrusted environment", underlying: underlying)
            }
        }
        do {
            let key = try trust.copyKey()
            try authRepository.store(peerPublicKey: key)
            peerPublicKey = key
        } catch {
            throw .cryptoError(code: .internalError, reason: "Keychain error", underlying: error)
        }
    }

    func verify(signature: Data, transcriptHash: Data) throws(QLICError) {
        guard let peerPublicKey else {
            throw .cryptoStateError(message: "Peer public key missing")
        }
        do {
            try peerPublicKey.verifySignature(signature, for: transcriptHash, isClient: true)
        } catch {
            throw .cryptoError(code: .decryptError, reason: "Signature mismatch", underlying: error)
        }
    }
}
