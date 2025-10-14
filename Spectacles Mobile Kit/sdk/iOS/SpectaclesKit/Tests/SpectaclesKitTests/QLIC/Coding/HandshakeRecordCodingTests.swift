// Copyright © 2024 Snap, Inc. All rights reserved.

@testable import SpectaclesKit
import XCTest

final class HandshakeRecordCodingTests: XCTestCase {
    func testCodings() throws {
        let chunk1 = Data(0 ..< 32)
        let chunk2 = Data(64 ..< 96)
        let noAuthVarint = Data([0xC0]) + "no auth".data(using: .utf8)!
        let noAuthAlgorithm = Data([0x01]) + noAuthVarint + Data([0x00])
        let testCases: [(HandshakeRecord, Data)] = [
            (
                .clientHello(
                    clientRandom: chunk1,
                    keyShare: chunk2,
                    clientAuthenticationAlgorithms: [.unauthenticated],
                    serverAuthenticationAlgorithms: [.unauthenticated]
                ),
                Data([0x01]) + Data([0x20]) + chunk1 + Data([0x20]) + chunk2 + noAuthAlgorithm + noAuthAlgorithm
            ),
            (
                .serverHello(serverRandom: chunk1, keyShare: chunk2),
                Data([0x02]) + Data([0x20]) + chunk1 + Data([0x20]) + chunk2
            ),
            (
                .authenticationRequest(clientAlgorithmIndex: 0x11, serverAlgorithmIndex: 0x22),
                Data([0x0D, 0x11, 0x22])
            ),
            (
                .authenticationShare(shareData: .unauthenticated(identity: "hello world")),
                Data([0x0B]) + noAuthVarint + Data([0xB]) + "hello world".data(using: .utf8)!
            ),
            (.authenticationVerify(signature: chunk1), Data([0x0F, 0x20]) + chunk1),
            (.keyUpdate(updateRequested: true), Data([0x18, 0x01])),
            (.keyUpdate(updateRequested: false), Data([0x18, 0x00])),
        ]

        var encodeBuffer = Data()

        for (key, value) in testCases {
            try XCTAssertEqual(key.encode(), value)
            encodeBuffer += value
        }

        for (key, _) in testCases {
            try XCTAssertEqual(HandshakeRecord.dequeueRecord(from: &encodeBuffer), key)
        }
    }
}
