// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Protocol providing the ability to encode data types using `EncodingVisitor`

 Provides encoding helper methods in an extension
 */
protocol VisitorEncodable {
    /// Encodes `self` into some generic encoding visitor
    func encode(into visitor: inout some EncodingVisitor) throws
}

extension VisitorEncodable {
    /// Total size of `self` when encoded
    func encodedSize() throws -> Int {
        var ret = 0
        try encode(into: &ret)
        return ret
    }

    /// Returns the encoded representation of `self`
    func encode() throws -> Data {
        var ret = try Data(capacity: encodedSize())
        try encode(into: &ret)
        return ret
    }
}
