// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
@testable import SpectaclesKit
import XCTest

final class ClientHandshakeTests: XCTestCase, @unchecked Sendable {
    var clientEngine: HandshakeEngine!
    var serverEngine: HandshakeEngine!
    var task: Task<Void, any Error>!

    override func setUp() {
        let clientTxSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        let clientRxSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        clientEngine = HandshakeEngine(txSignal: clientTxSignal.continuation, rxSignal: clientRxSignal.continuation)
        let serverTxSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        let serverRxSignal = AsyncStream<Void>.makeStream(bufferingPolicy: .bufferingNewest(1))
        serverEngine = HandshakeEngine(txSignal: serverTxSignal.continuation, rxSignal: serverRxSignal.continuation)
        task = Task {
            async let clientTask: Void = {
                do {
                    try await forwardFrames(
                        from: clientEngine,
                        to: serverEngine,
                        txSignal: clientTxSignal.stream,
                        rxSignal: serverRxSignal.stream
                    )
                } catch {
                    if !Task.isCancelled {
                        XCTFail("client sent bad frame \(error)")
                    }
                }
            }()
            async let serverTask: Void = {
                do {
                    try await forwardFrames(
                        from: serverEngine,
                        to: clientEngine,
                        txSignal: serverTxSignal.stream,
                        rxSignal: clientRxSignal.stream
                    )
                } catch {
                    if !Task.isCancelled {
                        XCTFail("server sent bad frame \(error)")
                    }
                }
            }()
            _ = await (clientTask, serverTask)
        }
    }

    override func tearDown() {
        task.cancel()
        clientEngine = nil
        serverEngine = nil
        task = nil
    }

    func testClientHandshake() async throws {
        async let _: Void = {
            do {
                try await clientEngine.runClientHandshake(
                    authVerifiers: [UnauthenticatedAuthVerifier(identity: "server-identity")],
                    authProviders: [UnauthenticatedAuthProvider(identity: "client-identity")],
                    clientRandomOverride: Data(0 ..< 32),
                    keyAgreementOverride: .init(rawRepresentation: Data(0 ..< 48))
                )
            } catch {
                if !Task.isCancelled {
                    XCTFail("client handshake threw \(error)")
                }
            }
        }()
        try await serverEngine.runUnauthenticatedServerHandshake(
            authProvider: UnauthenticatedAuthProvider(identity: "server-identity"),
            authVerifier: UnauthenticatedAuthVerifier(identity: "client-identity")
        )
    }

    @SecurityActor
    func testPretrustedClientHandshake() async throws {
        let (clientProvider, serverVerifier) = try createPretrustedAuthPair(isClient: true)
        let (serverProvider, clientVerifier) = try createPretrustedAuthPair(isClient: false)

        async let _: Void = {
            do {
                try await clientEngine.runClientHandshake(
                    authVerifiers: [clientVerifier],
                    authProviders: [clientProvider]
                )
            } catch {
                if !Task.isCancelled {
                    XCTFail("client handshake threw \(error)")
                }
            }
        }()
        try await serverEngine.runServerHandshake(authVerifier: serverVerifier, authProvider: serverProvider)
    }

    func forwardFrames(
        from txEngine: HandshakeEngine,
        to rxEngine: HandshakeEngine,
        txSignal: AsyncStream<Void>,
        rxSignal: AsyncStream<Void>
    ) async throws {
        var txEngineKey: EncryptionEngine.TrafficKey?
        var rxEngineKey: EncryptionEngine.TrafficKey?
        while !Task.isCancelled {
            // First ensure the rx engine is ready for new frames
            switch await rxEngine.getRxStateUpdate() {
            case .pause:
                for await _ in rxSignal { break }
                continue
            case let .updateKey(newRxEngineKey):
                rxEngineKey = newRxEngineKey
            case nil:
                break
            }

            // Now that it is, wait until the tx engine has data to send
            while await !txEngine.hasMoreCryptoData() {
                for await _ in txSignal { break }
                try Task.checkCancellation()
            }

            // Process any tx state update, and ensure that the tx and rx keys match before sending more data
            switch await txEngine.getTxStateUpdate() {
            case .pause:
                XCTFail("TX can't be paused if we have pending data")
            case let .updateKey(newTxEngineKey):
                txEngineKey = newTxEngineKey
            case nil:
                break
            }
            XCTAssertEqual(txEngineKey, rxEngineKey)

            for frame in try await txEngine.dequeueDataToSend() {
                try await rxEngine.onCryptoFrame(cryptoData: frame)
            }
        }
    }
}

extension HandshakeEngine {
    func runUnauthenticatedServerHandshake(
        authProvider: UnauthenticatedAuthProvider,
        authVerifier: UnauthenticatedAuthVerifier
    ) async throws {
        // Receive client hello and validate that it has the expected parameters
        guard
            case let .clientHello(
                clientRandom: clientRandom,
                keyShare: keyShare,
                clientAuthenticationAlgorithms: clientAuthenticationAlgorithms,
                serverAuthenticationAlgorithms: serverAuthenticationAlgorithms
            ) = try await receiveCryptoFrame()
        else {
            throw TestFailureError()
        }
        XCTAssertEqual(clientRandom, Data(0 ..< 32))
        XCTAssertEqual(
            hexString(keyShare),
            "3076301006072a8648ce3d020106052b8104002203620004e62a3a94e407b16bff82947b56a30380269da64a130371cb641501d9b90b226a93d2e8c059b26530f025bd8d83d55613cc96e994d700581e2d9785cb2974e5e0a0937e71f09c7b51178b40cadb28e1444e387b9c2b967add040b087157c39836"
        )

        // Send server hello
        let serverRandom = Data(64 ..< 96)
        let keyAgreement = try P384.KeyAgreement.PrivateKey(rawRepresentation: Data(96 ..< 144))
        try sendCryptoFrame(
            record: .serverHello(serverRandom: serverRandom, keyShare: keyAgreement.publicKey.derRepresentation),
            signalsKeyUpdate: true
        )

        print(hexString(transcriptHasher.finalize()))

        // Update keys using calculations from KeyDerivationTests.testKeyDerivation()
        let clientHandshakeKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.clientHandshakeKey)),
            iv: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.clientHandshakeIV)),
            securityLevel: .handshake
        )
        let serverHandshakeKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.serverHandshakeKey)),
            iv: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.serverHandshakeIV)),
            securityLevel: .handshake
        )
        try updateTxKey(serverHandshakeKey)
        updateRxKey(clientHandshakeKey)

        // Send authentication request
        XCTAssertEqual(clientAuthenticationAlgorithms, [authVerifier.algorithm])
        XCTAssertEqual(serverAuthenticationAlgorithms, [authProvider.algorithm])
        try sendCryptoFrame(record: .authenticationRequest(clientAlgorithmIndex: 1, serverAlgorithmIndex: 1))

        // Send server auth share and auth verify records
        try await attestIdentity(provider: authProvider)

        // Receive client auth share and auth verify records, and validate them
        try await verifyIdentity(verifier: authVerifier)

        print(hexString(transcriptHasher.finalize()))

        // Update keys using calculations from KeyDerivationTests.testKeyDerivation()
        let clientAppKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.clientAppKey)),
            iv: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.clientAppIV)),
            securityLevel: .app
        )
        let serverAppKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.serverAppKey)),
            iv: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.serverAppIV)),
            securityLevel: .app
        )
        try updateTxKey(serverAppKey)
        updateRxKey(clientAppKey)

        // Now that the handshake is complete, try sending one round of key updates using  calculations from
        // KeyDerivationTests.testKeyDerivation()
        try sendCryptoFrame(record: .keyUpdate(updateRequested: true), signalsKeyUpdate: true)
        let updatedServerAppKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.serverUpdateKey)),
            iv: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.serverUpdateIV)),
            securityLevel: .app
        )
        try updateTxKey(updatedServerAppKey)

        guard case .keyUpdate(updateRequested: false) = try await receiveCryptoFrame() else {
            throw HandshakeError.badRecordType(lastRecord)
        }
        let updatedClientAppKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.clientUpdateKey)),
            iv: SymmetricKey(data: data(hexString: UnauthenticatedHandshakeSecrets.clientUpdateIV)),
            securityLevel: .app
        )
        updateRxKey(updatedClientAppKey)
    }

    func runServerHandshake(authVerifier: any HandshakeAuthVerifier, authProvider: any HandshakeAuthProvider) async throws {
        guard
            case let .clientHello(
                clientRandom: _,
                keyShare: keyShare,
                clientAuthenticationAlgorithms: clientAuthenticationAlgorithms,
                serverAuthenticationAlgorithms: serverAuthenticationAlgorithms
            ) = try await receiveCryptoFrame()
        else {
            throw TestFailureError()
        }

        // Send server hello and calculate shared secret
        let keyAgreement = P384.KeyAgreement.PrivateKey()
        try sendCryptoFrame(
            record: .serverHello(
                serverRandom: secureRandom(count: 32),
                keyShare: keyAgreement.publicKey.derRepresentation
            ),
            signalsKeyUpdate: true
        )
        let sharedSecret = try keyAgreement.sharedSecretFromKeyAgreement(with: .init(derRepresentation: keyShare))

        // Extract root secret from shared secret
        let helloHash = transcriptHasher.finalize()
        let rootSecret = RootSecret<Hasher>(
            inputKeyMaterial: SymmetricKey(data: sharedSecret),
            transcriptHash: transcriptHasher.finalize()
        )

        // Use root secret to calculate handshake keys.
        let handshakePeerSecrets = rootSecret.expandPeerSecrets(type: .handshake, transcriptHash: helloHash)
        try updateTxKey(handshakePeerSecrets.serverSecret.expandKeys(securityLevel: .handshake))
        updateRxKey(handshakePeerSecrets.clientSecret.expandKeys(securityLevel: .handshake))

        // Send authentication request
        let clientAlgorithmIndex = clientAuthenticationAlgorithms.firstIndex(of: authVerifier.algorithm)!
        let serverAlgorithmIndex = serverAuthenticationAlgorithms.firstIndex(of: authProvider.algorithm)!
        try sendCryptoFrame(record: .authenticationRequest(
            clientAlgorithmIndex: clientAlgorithmIndex + 1,
            serverAlgorithmIndex: serverAlgorithmIndex + 1
        ))

        // Send server auth share and auth verify records
        try await attestIdentity(provider: authProvider)

        // Receive client auth share and auth verify records, and validate them
        try await verifyIdentity(verifier: authVerifier)

        // Calculate app secret
        let appPeerSecrets = rootSecret.expandPeerSecrets(type: .app, transcriptHash: transcriptHasher.finalize())
        try updateTxKey(appPeerSecrets.serverSecret.expandKeys(securityLevel: .app))
        updateRxKey(appPeerSecrets.clientSecret.expandKeys(securityLevel: .app))
    }
}
