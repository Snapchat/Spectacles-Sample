// Copyright © 2024 Snap, Inc. All rights reserved.

@testable import SpectaclesKit
import XCTest

final class QLICVarIntTests: XCTestCase {
    func testValidCodings() throws {
        let testCases: [(Int, Data)] = [
            (0x00, Data([0x0])),
            (0x3F, Data([0x3F])),
            (0x40, Data([0x40, 0x40])),
            (0x3FFF, Data([0x7F, 0xFF])),
            (0x4000, Data([0x80, 0x00, 0x40, 0x00])),
            (0x3FFF_FFFF, Data([0xBF, 0xFF, 0xFF, 0xFF])),
            (0x4000_0000, Data([0xC0, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00])),
            (0x3FFF_FFFF_FFFF_FFFF, Data([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])),
        ]

        for (key, value) in testCases {
            try XCTAssertEqual(QLICVarInt.encodedSize(of: key), value.count)
            var data = Data()
            try QLICVarInt.appendVarInt(key, to: &data)
            XCTAssertEqual(data, value)
            XCTAssertEqual(QLICVarInt.decodeSize(from: value.first!), value.count)
            try XCTAssertEqual(QLICVarInt.decode(from: value), key)
        }
    }

    func testInvalidCodings() throws {
        let testCases = [
            0x4000_0000_0000_0000,
            -1,
        ]
        for testCase in testCases {
            XCTAssertThrowsError(try QLICVarInt.encodedSize(of: testCase))
            var data = Data()
            XCTAssertThrowsError(try QLICVarInt.appendVarInt(testCase, to: &data))
        }
    }

    func testInvalidDecodings() throws {
        let testCases = [
            Data(),
            Data([0x40]),
            Data([0x80, 0x00, 0x40]),
            Data([0xC0, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00]),
        ]
        for testCase in testCases {
            XCTAssertThrowsError(try QLICVarInt.decode(from: testCase))
        }
    }

    func testVectorSize() {
        let testCases: [(Int, Int)] = [
            (0, -1),
            (1, 0),

            (QLICVarInt.max1ByteVarint, QLICVarInt.max1ByteVarint - 1),
            (QLICVarInt.max1ByteVarint + 1, QLICVarInt.max1ByteVarint),
            (QLICVarInt.max1ByteVarint + 2, QLICVarInt.max1ByteVarint),
            (QLICVarInt.max1ByteVarint + 3, QLICVarInt.max1ByteVarint + 1),

            (QLICVarInt.max2ByteVarint + 1, QLICVarInt.max2ByteVarint - 1),
            (QLICVarInt.max2ByteVarint + 2, QLICVarInt.max2ByteVarint),
            (QLICVarInt.max2ByteVarint + 3, QLICVarInt.max2ByteVarint),
            (QLICVarInt.max2ByteVarint + 4, QLICVarInt.max2ByteVarint),
            (QLICVarInt.max2ByteVarint + 5, QLICVarInt.max2ByteVarint + 1),

            (QLICVarInt.max4ByteVarint + 3, QLICVarInt.max4ByteVarint - 1),
            (QLICVarInt.max4ByteVarint + 4, QLICVarInt.max4ByteVarint),
            (QLICVarInt.max4ByteVarint + 5, QLICVarInt.max4ByteVarint),
            (QLICVarInt.max4ByteVarint + 6, QLICVarInt.max4ByteVarint),
            (QLICVarInt.max4ByteVarint + 7, QLICVarInt.max4ByteVarint),
            (QLICVarInt.max4ByteVarint + 8, QLICVarInt.max4ByteVarint),
            (QLICVarInt.max4ByteVarint + 9, QLICVarInt.max4ByteVarint + 1),

            (QLICVarInt.max + 7, QLICVarInt.max - 1),
            (QLICVarInt.max + 8, QLICVarInt.max),
            (QLICVarInt.max + 9, QLICVarInt.max),
            (.max, QLICVarInt.max),
        ]
        for (key, value) in testCases {
            XCTAssertEqual(QLICVarInt.maxVectorSizeEncodable(in: key), value)
        }
    }
}
