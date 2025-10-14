// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Security
@testable import SpectaclesKit
import XCTest

extension P256.Signing.PrivateKey: P256SigningKey {}
@SecurityActor
func createPretrustedAuthPair(isClient: Bool) throws -> (PretrustedAuthProvider, PretrustedAuthVerifier) {
    let privateKey = P256.Signing.PrivateKey()
    let attributes = [
        kSecAttrKeyClass: kSecAttrKeyClassPublic,
        kSecAttrKeyType: kSecAttrKeyTypeECSECPrimeRandom,
    ] as CFDictionary
    let publicKey = SecKeyCreateWithData(privateKey.publicKey.x963Representation as CFData, attributes, nil)!
    let provider = PretrustedAuthProvider(key: privateKey, isClient: isClient)
    let verifier = try PretrustedAuthVerifier(peerPublicKey: publicKey, isClient: !isClient)
    return (provider, verifier)
}

/// Test certificates taken from a sample spectacles pairing run.
final class CertificateValidationTests: XCTestCase {
    func getCertData(name: String) throws -> Data {
        try Data(contentsOf: Bundle.module.url(forResource: name, withExtension: "der")!)
    }

    @SecurityActor
    func getCert(name: String) throws -> SecCertificate {
        try SecCertificate.create(data: getCertData(name: name))
    }

    func testDecodeAttestationChallenge() throws {
        let leafData = try getCertData(name: "specs0")
        let keyDescription = try leafData.getAttestationKeyDescription()!
        XCTAssertEqual(keyDescription.attestationSecurityLevel, .trustedEnvironment)
        XCTAssertEqual(keyDescription.keyMintSecurityLevel, .trustedEnvironment)
        XCTAssertEqual(
            keyDescription.attestationChallenge,
            data(hexString: "7717A734F622A972E92CF4650B07B8789B9E3CEBCE093C9070E3B9020A1A3521267AEEDAA01FA563620D442DBFA47F23")
        )
        XCTAssertFalse(keyDescription.deviceLocked)
        XCTAssertEqual(keyDescription.bootState, .unverified)
    }

    @SecurityActor
    func testVerifyChain() async throws {
        let devRoot = try getCert(name: "avalon_dev_root")
        let certs = [
            try getCert(name: "specs0"),
            try getCert(name: "specs1"),
            try getCert(name: "specs2"),
            try getCert(name: "specs3"),
        ]
        let trust = try SecTrust.create(certificates: certs)
        try trust.setAnchorCertificates([devRoot])
        try trust.evaluate()
        let expectedKey = data(hexString: "04F2549A9062FE516CFFDD6D71CCB97CAA97FDFFD6F2DBC166FC84F6F52B53334DC7655FF986A40F2F8B6570383B479392D14101F8F8AA6B68EFF49BE28A91DE80")
        let key = try trust.copyKey().copyExternalRepresentation()
        XCTAssertEqual(key, expectedKey)
    }

    @SecurityActor
    func testVerifyChainFailsWithWrongAnchor() async throws {
        let root = try getCert(name: "avalon_root")
        let certs = [
            try getCert(name: "specs0"),
            try getCert(name: "specs1"),
            try getCert(name: "specs2"),
            try getCert(name: "specs3"),
        ]
        let trust = try SecTrust.create(certificates: certs)
        try trust.setAnchorCertificates([root])
        XCTAssertThrowsError(try trust.evaluate())
    }

    @SecurityActor
    func testPretrustedSigning() async throws {
        // Signing is inherently random, so we can't compare the data. Instead, we can only run the pretrusted
        // algorithms against each other.
        let (provider, verifier) = try createPretrustedAuthPair(isClient: true)
        XCTAssertEqual(provider.algorithm, verifier.algorithm)

        let helloHash = Data(0 ..< 32)
        let authShare = try await provider.makeShareData(transcriptHash: helloHash)
        try verifier.verify(shareData: authShare, transcriptHash: helloHash)

        let handshakeHash = Data(32 ..< 64)
        let signature = try provider.makeVerifySignature(transcriptHash: handshakeHash)
        try verifier.verify(signature: signature, transcriptHash: handshakeHash)
    }
}
