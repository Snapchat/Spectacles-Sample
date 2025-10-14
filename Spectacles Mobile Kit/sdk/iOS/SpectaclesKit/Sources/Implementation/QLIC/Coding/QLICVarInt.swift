// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 QLIC uses the same variable-length integer encoding as QUIC, as described in https://www.rfc-editor.org/rfc/rfc9000.html#name-variable-length-integer-enc

 To summarize, the 2 most significant bits are used to encode the base-2 logarithm of the total encoded length in bytes. The value is encoded in the remaining bits. Network byte order (big endian) is used.

 2MSB  | Length | Usable Bits | Range
 ----- | ------ | ----------- | -------------------------
 `00`  | `1`    | `6`         | `0..<64`
 `01`  | `2`    | `14`        | `0..<16384`
 `10`  | `4`    | `30`        | `0..<1073741824`
 `11`  | `8`    | `62`        | `0..<4611686018427387904`
 */
enum QLICVarInt {
    /// Errors encountered when encoding and decoding var ints
    enum VarintCodingError: Error {
        /// Thrown when an encoded value doesn't fit in 62 bits
        case outOfBounds(Int)
    }

    static var max1ByteVarint: Int { 1 << 6 - 1 }
    static var max2ByteVarint: Int { 1 << 14 - 1 }
    static var max4ByteVarint: Int { 1 << 30 - 1 }
    static var max: Int { 1 << 62 - 1 }

    /// Size needed to encode a value as a QLIC varint
    static func encodedSize(of value: Int) throws -> Int {
        if value < 0 {
            throw VarintCodingError.outOfBounds(value)
        } else if value <= max1ByteVarint {
            return 1
        } else if value <= max2ByteVarint {
            return 2
        } else if value <= max4ByteVarint {
            return 4
        } else if value <= max {
            return 8
        } else {
            throw VarintCodingError.outOfBounds(value)
        }
    }

    /// Size needed to store a length-prefixed vector
    static func encodedSizeOfVector(length: Int) throws -> Int {
        try length + encodedSize(of: length)
    }

    /// Maximum number of bytes that can be encoded in a length-prefixed vector with total size `length`
    static func maxVectorSizeEncodable(in length: Int) -> Int {
        guard length > 0 else { return -1 }
        if length <= max1ByteVarint + 2 {
            return min(length - 1, max1ByteVarint)
        } else if length <= max2ByteVarint + 4 {
            return min(length - 2, max2ByteVarint)
        } else if length <= max4ByteVarint + 8 {
            return min(length - 4, max4ByteVarint)
        } else {
            return min(length - 8, max)
        }
    }

    /// Appends an encoded value to some data
    static func appendVarInt(_ value: Int, to data: inout Data) throws {
        let bitsNeeded = value.bitWidth - value.leadingZeroBitCount
        if bitsNeeded <= 6 {
            let raw = UInt8(value)
            withUnsafeBytes(of: raw) {
                data.append(contentsOf: $0)
            }
        } else if bitsNeeded <= 14 {
            let raw = (UInt16(value) | (0x1 << 14)).bigEndian
            withUnsafeBytes(of: raw) {
                data.append(contentsOf: $0)
            }
        } else if bitsNeeded <= 30 {
            let raw = (UInt32(value) | (0x2 << 30)).bigEndian
            withUnsafeBytes(of: raw) {
                data.append(contentsOf: $0)
            }
        } else if bitsNeeded <= 62 {
            let raw = (UInt64(value) | (0x3 << 62)).bigEndian
            withUnsafeBytes(of: raw) {
                data.append(contentsOf: $0)
            }
        } else {
            throw VarintCodingError.outOfBounds(value)
        }
    }

    /// Size of the varint that begins with this byte
    static func decodeSize(from firstByte: UInt8) -> Int {
        1 << (firstByte >> 6)
    }

    /// Decodes a varint from the front of some data
    static func decode(from data: Data) throws -> Int {
        guard let firstByte = data.first else { throw Data.TooSmallError(count: 0, expectedCount: 1) }
        switch firstByte >> 6 {
        case 0:
            return Int(firstByte)
        case 1:
            return try Int(decode(from: data, as: UInt16.self))
        case 2:
            return try Int(decode(from: data, as: UInt32.self))
        case 3:
            return try Int(decode(from: data, as: UInt64.self))
        default:
            fatalError("Two-bit value shouldn't ever be more than 3")
        }
    }

    /// Decodes a varint from the front of some data assuming we know the byte count
    private static func decode<T: FixedWidthInteger>(from data: Data, as type: T.Type) throws -> Int {
        let byteCount = T.bitWidth / 8
        guard data.count >= byteCount else {
            throw Data.TooSmallError(count: data.count, expectedCount: byteCount)
        }
        let raw = data.withUnsafeBytes { $0.loadUnaligned(as: type) }
        return Int(T(bigEndian: raw) & ~(0x3 << (T.bitWidth - 2)))
    }
}
