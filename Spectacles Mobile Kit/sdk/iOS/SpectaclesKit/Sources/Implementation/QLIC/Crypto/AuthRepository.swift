// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import DeviceCheck
import Foundation

/// Protocol abstracting the peer public key storage so that it can be mocked for testing
@SecurityActor
protocol AuthRepository {
    /// Stores a newly trusted peer public key for future reuse
    func store(peerPublicKey: SecKey) throws
}

/// Authentication repository backed by the keychain and `BondingRepository`
final class KeychainAuthRepository: AuthRepository {
    /// Keychain account used to store the secure enclave private signing key
    static let signingKeyAccount = "SecureEnclave.P256.Signing.PrivateKey"

    enum AuthRepositoryError: Error {
        /// A required certificate wasn't found in the package bundle
        case certificateMissing
        /// A required certificate couldn't be decoded
        case certificateInvalid
        /// The device doesn't support SecureEnclave APIs
        case secureEnclaveUnsupported
    }

    /// The bonding for the current connection
    var bonding: SpectaclesBonding
    /// The bonding repository the bonding is stored in
    let bondingRepository: BondingRepository

    init(bonding: SpectaclesBonding, bondingRepository: BondingRepository) {
        self.bonding = bonding
        self.bondingRepository = bondingRepository
    }

    /**
     Loads all compatible auth providers

     Currently supports Pretrusted, Device Check, and Unauthenticated providers
     */
    func loadAuthProviders() throws -> [any HandshakeAuthProvider] {
        let key = try loadSigningPrivateKey()
        var providers: [any HandshakeAuthProvider] = [
            PretrustedAuthProvider(key: key, isClient: true),
            DeviceCheckAuthProvider(key: key),
        ]
        return providers
    }

    /**
     Loads all compatible auth providers

     Currently supports Pretrusted, X509 Certificate, and Unauthenticated providers
     */
    func loadAuthVerifiers(acceptUnfusedSpectacles: Bool) throws -> [any HandshakeAuthVerifier] {
        var certs = try [Self.loadCert(name: "avalon_root")]
        if acceptUnfusedSpectacles, let devCert = try? Self.loadCert(name: "avalon_dev_root") {
            certs.append(devCert)
        }

        var verifiers: [any HandshakeAuthVerifier] = [
            X509CertAuthVerifier(
                authRepository: self,
                skipEnvironmentCheck: acceptUnfusedSpectacles,
                rootCerts: certs
            ),
        ]
        if let key = bonding.publicKey {
            try? verifiers.append(PretrustedAuthVerifier(peerPublicKey: key, isClient: true))
        }
        return verifiers
    }

    /// Loads the signing private key from the keychain, or creates a new one if unavailable
    private func loadSigningPrivateKey() throws -> SecureEnclave.P256.Signing.PrivateKey {
        guard SecureEnclave.isAvailable else { throw AuthRepositoryError.secureEnclaveUnsupported }
        if
            let data = try Keychain.copyItem(account: Self.signingKeyAccount),
            let signingKey = try? SecureEnclave.P256.Signing.PrivateKey(dataRepresentation: data)
        {
            return signingKey
        }

        let signingKey = try SecureEnclave.P256.Signing.PrivateKey()
        try Keychain.addItem(account: Self.signingKeyAccount, data: signingKey.dataRepresentation)
        return signingKey
    }

    /// Updates the stored peer public key
    func store(peerPublicKey: SecKey) throws {
        bonding.publicKey = peerPublicKey
        bondingRepository.saveBonding(bonding: bonding)
    }

    /// Loads a certificate from the bundle resources
    private static func loadCert(name: String) throws -> SecCertificate {
        guard let url = Bundle.module.url(forResource: name, withExtension: "der") else {
            throw AuthRepositoryError.certificateMissing
        }
        let data = try Data(contentsOf: url)
        guard let cert = SecCertificateCreateWithData(kCFAllocatorDefault, data as CFData) else {
            throw AuthRepositoryError.certificateInvalid
        }
        return cert
    }
}
