// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation

extension HandshakeEngine {
    /**
     Runs the client handshake.
     - parameters:
        - authVerifiers: List of verifiers that can verify the server identity
        - authProviders: List of providers that can attest the client identity
        - clientRandomOverride: Optional override for the client random. Only used for unit testing
        - keyAgreementOverride: Optional override for the random ECDH private key. Only used for unit testing
     */
    func runClientHandshake(
        authVerifiers: [any HandshakeAuthVerifier],
        authProviders: [any HandshakeAuthProvider],
        clientRandomOverride: Data? = nil,
        keyAgreementOverride: P384.KeyAgreement.PrivateKey? = nil
    ) async throws(QLICError) {
        // Send client hello
        Log.info("[Handshake] Client handshake started, sending client hello")
        let clientRandom: Data
        do {
            clientRandom = try clientRandomOverride ?? secureRandom(count: 32)
        } catch {
            throw .cryptoError(code: .internalError, reason: "Insufficient entropy", underlying: error)
        }
        let keyAgreement = keyAgreementOverride ?? P384.KeyAgreement.PrivateKey()

        let clientKeyShare = keyAgreement.publicKey.derRepresentation
        try sendCryptoFrame(record: .clientHello(
            clientRandom: clientRandom,
            keyShare: clientKeyShare,
            clientAuthenticationAlgorithms: authProviders.map(\.algorithm),
            serverAuthenticationAlgorithms: authVerifiers.map(\.algorithm)
        ), signalsKeyUpdate: true)

        // Receive server hello and calculate shared secret
        Log.info("[Handshake] Client hello sent, awaiting server hello")
        guard case let .serverHello(serverRandom: _, keyShare: keyShare) = try await receiveCryptoFrame() else {
            Log.error("[Handshake] Received unexpected record \(String(describing: lastRecord))")
            throw unexpectedCryptoRecordError("server hello")
        }
        let sharedSecret: SharedSecret
        do {
            sharedSecret = try keyAgreement.sharedSecretFromKeyAgreement(with: .init(derRepresentation: keyShare))
        } catch {
            Log.error("[Handshake] Failed to generate shared secret: \(error)")
            throw .cryptoError(code: .decryptError, reason: "ECDH Failed", underlying: error)
        }

        // Extract root secret from shared secret
        let helloHash = transcriptHasher.finalize()
        let rootSecret = RootSecret<Hasher>(
            inputKeyMaterial: SymmetricKey(data: sharedSecret),
            transcriptHash: transcriptHasher.finalize()
        )

        // Use root secret to calculate handshake keys.
        let handshakePeerSecrets = rootSecret.expandPeerSecrets(type: .handshake, transcriptHash: helloHash)
        try updateTxKey(handshakePeerSecrets.clientSecret.expandKeys(securityLevel: .handshake))
        updateRxKey(handshakePeerSecrets.serverSecret.expandKeys(securityLevel: .handshake))

        // Receive authentication request and extract authentication algorithms
        Log.info("[Handshake] Handshake secrets derived successfully, awaiting authentication request")
        guard case let .authenticationRequest(clientAlgorithmIndex, serverAlgorithmIndex) = try await receiveCryptoFrame() else {
            Log.error("[Handshake] Received unexpected record \(String(describing: lastRecord))")
            throw unexpectedCryptoRecordError("auth request")
        }
        guard
            authProviders.indices.contains(clientAlgorithmIndex - 1),
            authVerifiers.indices.contains(serverAlgorithmIndex - 1)
        else {
            Log.error("[Handshake] Invalid auth algorithm requested")
            throw .cryptoError(
                code: .illegalParameter,
                reason: "Invalid auth algorithm requested",
                underlying: HandshakeError.malformedRecord(lastRecord)
            )
        }

        // Use the chosen server algorithm to verify the server's identity
        try await verifyIdentity(verifier: authVerifiers[serverAlgorithmIndex - 1])

        // Then use the chosen client algorithm to attest the client's identity
        try await attestIdentity(provider: authProviders[clientAlgorithmIndex - 1])

        // Now that the handshake is complete, calculate the app secrets
        let appPeerSecrets = rootSecret.expandPeerSecrets(type: .app, transcriptHash: transcriptHasher.finalize())
        try updateTxKey(appPeerSecrets.clientSecret.expandKeys(securityLevel: .app))
        updateRxKey(appPeerSecrets.serverSecret.expandKeys(securityLevel: .app))

        Log.info("[Handshake] Final key update issued, handshake is complete")

        // Handshake is now complete, and we start processing key update events.
        try await handleKeyUpdates(txSecret: appPeerSecrets.clientSecret, rxSecret: appPeerSecrets.serverSecret)
    }

    /**
     Uses the auth verifier to verify the remote peer's identity.

     Receives and verifies the auth share, auth verify, and finished records in that order
     */
    func verifyIdentity(verifier: any HandshakeAuthVerifier) async throws(QLICError) {
        Log.info("[Handshake] Verifying peer identity, waiting for authentication share")
        let shareHash = transcriptHasher.finalize()
        guard case let .authenticationShare(shareData: shareData) = try await receiveCryptoFrame() else {
            Log.error("[Handshake] Received unexpected record \(String(describing: lastRecord))")
            throw unexpectedCryptoRecordError("auth share")
        }
        do {
            try await verifier.verify(shareData: shareData, transcriptHash: Data(shareHash))
        } catch {
            Log.error("[Handshake] Could not verify authentication share data: \(error)")
            throw error
        }

        Log.info("[Handshake] Authentication share data verified, waiting for authentication verify")
        let verifyHash = transcriptHasher.finalize()
        guard case let .authenticationVerify(signature: signature) = try await receiveCryptoFrame() else {
            Log.error("[Handshake] Received unexpected record \(String(describing: lastRecord))")
            throw unexpectedCryptoRecordError("auth verify")
        }
        do {
            try await verifier.verify(signature: signature, transcriptHash: Data(verifyHash))
        } catch {
            Log.error("[Handshake] Could not verify authentication verify signature: \(error)")
            throw error
        }

        Log.info("[Handshake] Peer identity successfully verified")
    }

    /**
     Uses the auth provider to attest the local peer's identity

     Creates and sends the auth share, auth verify, and finished records
     */
    func attestIdentity(provider: any HandshakeAuthProvider) async throws(QLICError) {
        Log.info("[Handshake] Attesting local identity, sending authentication share")
        let shareData: AuthenticationShareData
        do {
            shareData = try await provider.makeShareData(transcriptHash: Data(transcriptHasher.finalize()))
        } catch {
            throw .cryptoError(code: .internalError, reason: "Failed to generate share data", underlying: error)
        }
        try sendCryptoFrame(record: .authenticationShare(shareData: shareData))

        Log.info("[Handshake] Authentication share sent, sending authentication verify")
        let signature: Data
        do {
            signature = try await provider.makeVerifySignature(transcriptHash: Data(transcriptHasher.finalize()))
        } catch {
            throw .cryptoError(code: .internalError, reason: "Failed to generate signature", underlying: error)
        }
        try sendCryptoFrame(record: .authenticationVerify(signature: signature), signalsKeyUpdate: true)

        Log.info("[Handshake] Local identity successfully attested")
    }

    /**
     Processes incoming key update requests and records once the handshake is complete
     */
    func handleKeyUpdates<H: HashFunction>(
        txSecret: consuming PeerTrafficSecret<H>,
        rxSecret: consuming PeerTrafficSecret<H>
    ) async throws(QLICError) {
        var isKeyUpdateInProgress = false
        while true {
            let event = try await receiveEvent()
            switch event {
            case let .cryptoFrame(recordData):
                guard case let .keyUpdate(updateRequested: updateRequested) = try parseCryptoFrame(recordData) else {
                    throw unexpectedCryptoRecordError("key update")
                }
                rxSecret.update()
                updateRxKey(rxSecret.expandKeys(securityLevel: .app))
                if updateRequested {
                    isKeyUpdateInProgress = true
                    try sendCryptoFrame(record: .keyUpdate(updateRequested: false), signalsKeyUpdate: true)
                    txSecret.update()
                    try updateTxKey(txSecret.expandKeys(securityLevel: .app))
                } else {
                    isKeyUpdateInProgress = false
                }
            case .keyUpdateRequested:
                guard !isKeyUpdateInProgress else { break }
                isKeyUpdateInProgress = true
                try sendCryptoFrame(record: .keyUpdate(updateRequested: true), signalsKeyUpdate: true)
                txSecret.update()
                try updateTxKey(txSecret.expandKeys(securityLevel: .app))
            }
        }
    }
}
