// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Header type for sealed QLIC packets

 QLIC data is sealed into packets before being sent over the wire. A packet consists of header bytes followed by payload bytes. This header only contains the size of the packet's payload, which is encoded as a single variable-length integer.
 */
struct QLICPacketHeader {
    /// Length of the payload
    let payloadLength: Int

    /// Length of the header given its first byte
    static func requiredLength(firstByte: UInt8) -> Int {
        QLICVarInt.decodeSize(from: firstByte)
    }

    /// Maximum payload length that fits in a packet of a given size.
    static func maxPayloadLength(packetSize: Int) -> Int {
        QLICVarInt.maxVectorSizeEncodable(in: packetSize)
    }

    /// Creates a header from a given payload length
    init(payloadLength: Int) {
        self.payloadLength = payloadLength
    }

    /// Creates a header from data
    init(bytes: Data) throws {
        self.payloadLength = try QLICVarInt.decode(from: bytes)
    }

    /// Encodes this header to data
    func encode() throws -> Data {
        var ret = Data()
        try QLICVarInt.appendVarInt(payloadLength, to: &ret)
        return ret
    }
}
