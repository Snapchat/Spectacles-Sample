// Copyright © 2024 Snap, Inc. All rights reserved.

@testable import SpectaclesKit
import XCTest

final class QLICFrameCodingTests: XCTestCase {
    func testCodings() throws {
        let sampleData = Data([0xAA, 0xBB, 0xCC, 0xDD])
        let testCases: [(QLICFrame, Data)] = [
            (.padding, Data([0x00])),
            (.ping, Data([0x01])),
            (.ack(bytesSinceLastAck: 0x11), Data([0x02, 0x11])),
            (.resetStream(streamId: 0x11, applicationErrorCode: 0x22), Data([0x04, 0x11, 0x22])),
            (.stopSending(streamId: 0x11, applicationErrorCode: 0x22), Data([0x05, 0x11, 0x22])),
            (.crypto(cryptoData: sampleData), Data([0x06, 0x04, 0xAA, 0xBB, 0xCC, 0xDD])),
            (
                .protocolConnectionClose(protocolErrorCode: 0x11, frameType: 0x22, reason: sampleData),
                Data([0x1C, 0x11, 0x22, 0x04, 0xAA, 0xBB, 0xCC, 0xDD])
            ),
            (
                .applicationConnectionClose(applicationErrorCode: 0x11, reason: sampleData),
                Data([0x1D, 0x11, 0x04, 0xAA, 0xBB, 0xCC, 0xDD])
            ),
            (
                .stream(streamId: 0x11, streamData: sampleData, fin: false, endsOnMessageBoundary: true),
                Data([0x0A, 0x11, 0x04, 0xAA, 0xBB, 0xCC, 0xDD])
            ),
            (
                .stream(streamId: 0x11, streamData: sampleData, fin: true, endsOnMessageBoundary: true),
                Data([0x0B, 0x11, 0x04, 0xAA, 0xBB, 0xCC, 0xDD])
            ),
            (
                .stream(streamId: 0x11, streamData: sampleData, fin: false, endsOnMessageBoundary: false),
                Data([0x08, 0x11, 0x04, 0xAA, 0xBB, 0xCC, 0xDD])
            ),
        ]

        var encodeBuffer = Data()

        for (key, value) in testCases {
            try XCTAssertEqual(key.encodedSize(), value.count)
            try XCTAssertEqual(key.encode(), value)
            encodeBuffer += value
        }

        for (key, _) in testCases {
            try XCTAssertEqual(QLICFrame.dequeueFrame(from: &encodeBuffer), key)
        }
    }
}
