// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/// Spectacles Mobile Kit Protocol message
struct SMKPMessage: Sendable, Equatable {
    enum RequestType: Int, Sendable, Equatable {
        case call = 0x01
        case notify = 0x02
        case download = 0x03
        case attest = 0x10
    }

    enum ResponseType: Int, Sendable, Equatable {
        case response = 0x20
    }

    enum StartLine: Sendable, Equatable {
        case request(type: RequestType, path: String)
        case response(type: ResponseType, status: Int)
    }

    let startLine: StartLine
    var header: SMKPMessageHeader?
    let body: Data
}

struct SMKPMessageHeader: Sendable, Equatable {
    var header: [String: Data] = [:]

    func getHeaderStringValue(_ key: String) -> String? {
        return header[key].flatMap { String(data: $0, encoding: .utf8) }
    }

    mutating func setHeaderStringValue(_ key: String, value: String) {
        header[key] = value.data(using: .utf8)
    }

    func getHeaderIntValue(_ key: String) -> Int? {
        guard var data = header[key] else { return nil }
        return try? data.dequeueVarInt()
    }

    mutating func setHeaderIntValue(_ key: String, value: Int) {
        var ret = Data()
        try? QLICVarInt.appendVarInt(value, to: &ret)
        header[key] = ret
    }
}
