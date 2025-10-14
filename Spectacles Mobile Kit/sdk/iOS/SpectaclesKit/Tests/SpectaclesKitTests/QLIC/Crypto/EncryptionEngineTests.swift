// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
@testable import SpectaclesKit
import XCTest

final class EncryptionEngineTests: XCTestCase {
    func testEncryption() throws {
        var engine = EncryptionEngine()

        let samplePayload = Data(32 ..< 64)

        // First, test that unencrypted packets just return the unmodified payload
        let unencryptedBox = try engine.seal(payload: samplePayload)
        XCTAssertEqual(unencryptedBox, [samplePayload])

        /*
         Now, test that encryption works on a few test cases.
         Test cases are generated using `scripts/aes-gcm-128`.
         */
        let trafficKey = EncryptionEngine.TrafficKey(
            key: SymmetricKey(data: Data(0 ..< 16)),
            iv: SymmetricKey(data: Data(16 ..< 28)),
            securityLevel: .app
        )
        /*
         $ ./aes-gcm-128.swift "000102030405060708090a0b0c0d0e0f" "101112131415161718191a1b" "" ""
         ciphertext:
         tag: 0ed7259add1011e159d00e61b1925410

         $ ./aes-gcm-128.swift "000102030405060708090a0b0c0d0e0f" "101112131415161718191a1a" "" "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
         ciphertext: 20d8712ca70f21a28294185fdd0cacb302828867a0e225f38377604a60368109
         tag: e74e10a824171d5a1f7ce4ca2d10d37f

         $ ./aes-gcm-128.swift "000102030405060708090a0b0c0d0e0f" "101112131415161718191a19" "" "202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f"
         ciphertext: bd93cb4a0b61345c125eecde1524bffc550fd3c9a218f3f007e20a66827fcff7
         tag: ed596c9de44163d1a4664a335fa24ed9

         $ ./aes-gcm-128.swift "000102030405060708090a0b0c0d0e0f" "101112131415161718191a18" "" "404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f"
         ciphertext: 9405e51fc2129235a6d45a3de3767c0575adb4b17f2558b6fb1dc7a6a8500aed
         tag: c5b92626e472a4924ea62db42f7603a4

         $ ./aes-gcm-128.swift "000102030405060708090a0b0c0d0e0f" "101112131415161718191a1f" "" "606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f"
         ciphertext: b9b47ddbbaf51fd0705ee7a07fdf4227b18b680b1ed08a10a10f35666826aec3
         tag: d70ce017aadb6686aaff17f38b4c9d9b
         */
        let testCases: [(plaintext: Data, expectedPayload: String)] = [
            (Data(), "0ed7259add1011e159d00e61b1925410"),
            (
                Data(0 ..< 32),
                "20d8712ca70f21a28294185fdd0cacb302828867a0e225f38377604a60368109e74e10a824171d5a1f7ce4ca2d10d37f"
            ),
            (
                Data(32 ..< 64),
                "bd93cb4a0b61345c125eecde1524bffc550fd3c9a218f3f007e20a66827fcff7ed596c9de44163d1a4664a335fa24ed9"
            ),
            (
                Data(64 ..< 96),
                "9405e51fc2129235a6d45a3de3767c0575adb4b17f2558b6fb1dc7a6a8500aedc5b92626e472a4924ea62db42f7603a4"
            ),
            (
                Data(96 ..< 128),
                "b9b47ddbbaf51fd0705ee7a07fdf4227b18b680b1ed08a10a10f35666826aec3d70ce017aadb6686aaff17f38b4c9d9b"
            ),
        ]
        engine.updateTxKey(trafficKey)
        engine.updateRxKey(trafficKey)
        for testCase in testCases {
            let payload = try engine.seal(payload: testCase.plaintext).reduce(Data(), +)
            XCTAssertEqual(hexString(payload), testCase.expectedPayload)
            XCTAssertEqual(try engine.open(payload: payload), testCase.plaintext)
        }

        // Finally, test that resetting the keys resets the nonce as well
        engine.updateTxKey(trafficKey)
        engine.updateRxKey(trafficKey)
        for testCase in testCases {
            let payload = try engine.seal(payload: testCase.plaintext).reduce(Data(), +)
            XCTAssertEqual(hexString(payload), testCase.expectedPayload)
            XCTAssertEqual(try engine.open(payload: payload), testCase.plaintext)
        }
    }
}
