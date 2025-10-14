// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Utility protocol for efficiently encoding data types to byte buffers

 To minimize copies while encoding data, we use a two pass approach where we first calculate the total size of the encoded data, and then write the encoded data into a buffer of that size. This protocol lets us use the same code for both passes.
 */
protocol EncodingVisitor {
    /// Provides an integer value to the visitor
    mutating func visit(_ value: Int) throws
    /// Provides a byte buffer to the visitor
    mutating func visit(_ buffer: Data)
}

/**
 Conformance of `Int` that allows calculating the encoded size of objects

 See ``VisitorEncodable/encodedSize()`` for example usage.
 */
extension Int: EncodingVisitor {
    /// Increments self by the varint encoded size of the value
    mutating func visit(_ value: Int) throws {
        self += try QLICVarInt.encodedSize(of: value)
    }

    /// Increments self by the size of the buffer
    mutating func visit(_ buffer: Data) {
        self += buffer.count
    }
}

/**
 Conformance of `Data` that allows calculating the encoded size of objects

 See ``VisitorEncodable/encode()`` for example usage.
 */
extension Data: EncodingVisitor {
    /// Encodes the value as a varint and appends it to `self`
    mutating func visit(_ value: Int) throws {
        try QLICVarInt.appendVarInt(value, to: &self)
    }

    /// Appends the buffer to `self`
    mutating func visit(_ buffer: Data) {
        self += buffer
    }
}

struct UnrecognizedTypeError: Error {
    let type: Int
}
