// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

extension Data {
    /// Error thrown when trying to parse data but it's too small
    struct TooSmallError: Error {
        let count: Int
        let expectedCount: Int
    }

    /// Parses a varint and removes it from the front
    mutating func dequeueVarInt() throws -> Int {
        let ret = try QLICVarInt.decode(from: self)
        let varIntBytes = QLICVarInt.decodeSize(from: self[startIndex])
        self = self[(startIndex + varIntBytes)...]
        return ret
    }

    /// Dequeues a data buffer of a given size
    mutating func dequeueData(count: Int) throws -> Data {
        guard count <= self.count else { throw TooSmallError(count: self.count, expectedCount: count) }
        let ret = self[..<(startIndex + count)]
        self = self[(startIndex + count)...]
        return ret
    }

    /// Dequeues the first byte of the data buffer
    mutating func dequeueFirst() throws -> UInt8 {
        guard let ret = first else { throw TooSmallError(count: 0, expectedCount: 1) }
        self = self[(startIndex + 1)...]
        return ret
    }
}
