// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

enum SMKPMessageCodingError: Error {
    case encodeError(description: String?)
    case decodeError(description: String?)

    static let pathError = "path error"
    static let messageTypeError = "messageType error"
    static let headerKeyError = "headerKey error"
    static let headerDuplicatedKeyError = "headerDuplicatedKey error"
    static let headerValueError = "headerValue error"
}

extension Data {
    mutating func lengthDelimitedRecord() throws -> Data {
        let length = try dequeueVarInt()
        return try dequeueData(count: length)
    }
}

protocol SMKPDataSource {
    func receiveVarInt() async throws -> Int
    func receive(exactLength: Int) async throws -> Data
}

extension SMKPMessage: VisitorEncodable {
    /// encode SMKPMessage into data
    func encode(into visitor: inout some EncodingVisitor) throws {
        switch startLine {
        case let .request(type, path):
            try visitor.visit(type.rawValue)
            if let pathData = path.data(using: .utf8) {
                try visitor.visit(pathData.count)
                visitor.visit(pathData)
            }
        case let .response(type, status):
            try visitor.visit(type.rawValue)
            try visitor.visit(status)
        }
        if let header {
            try visitor.visit(header.encodedSize())
            try header.encode(into: &visitor)
        } else {
            try visitor.visit(0)
        }
        try visitor.visit(body.count)
        visitor.visit(body)
    }

    /// Receives the SMKPMessage from the stream
    static func receiveMessage(from stream: some SMKPDataSource) async throws -> SMKPMessage {
        let type = try await stream.receiveVarInt()

        let startLine: StartLine
        if let type = ResponseType(rawValue: type) {
            let status = try await stream.receiveVarInt()
            startLine = StartLine.response(type: type, status: status)
        } else if let type = RequestType(rawValue: type) {
            let length = try await stream.receiveVarInt()
            let pathData = try await stream.receive(exactLength: length)
            if let path = String(data: pathData, encoding: .utf8) {
                startLine = StartLine.request(type: type, path: path)
            } else {
                throw SMKPMessageCodingError.decodeError(description: SMKPMessageCodingError.pathError)
            }
        } else {
            throw SMKPMessageCodingError.decodeError(description: SMKPMessageCodingError.messageTypeError)
        }

        let headerLength = try await stream.receiveVarInt()
        var headerData = try await stream.receive(exactLength: headerLength)
        let header = try SMKPMessageHeader.dequeueMessageHeader(from: &headerData)
        let bodyLength = try await stream.receiveVarInt()
        let body = try await stream.receive(exactLength: bodyLength)
        return SMKPMessage(startLine: startLine, header: header, body: body)
    }
}

extension QLICStream: SMKPDataSource {
    func receiveVarInt() async throws -> Int {
        let firstByte = try await receive(exactLength: 1).first!
        let varintSize = QLICVarInt.decodeSize(from: firstByte)
        guard varintSize > 1 else { return Int(firstByte) }
        let additionalBytes = try await receive(exactLength: varintSize - 1)
        var ret = Int(firstByte & 0x3F)
        for byte in additionalBytes {
            ret = ret << 8 | Int(byte)
        }
        return ret
    }

    func receive(exactLength: Int) async throws -> Data {
        let content = await receive(range: exactLength ... exactLength)
        switch content {
        case let .success(content):
            return content
        case let .closed(content):
            if content.count != exactLength { throw CancellationError() }
            return content
        case let .error(error):
            throw error
        }
    }
}

extension SMKPMessageHeader: VisitorEncodable {
    func encode(into visitor: inout some EncodingVisitor) throws {
        for (key, value) in header {
            guard let keyData = key.data(using: .utf8) else {
                throw SMKPMessageCodingError.encodeError(description: SMKPMessageCodingError.headerKeyError)
            }
            try visitor.visit(keyData.count)
            visitor.visit(keyData)
            try visitor.visit(value.count)
            visitor.visit(value)
        }
    }

    static func dequeueMessageHeader(from data: inout Data) throws -> SMKPMessageHeader? {
        var header: [String: Data] = [:]
        while let record = try? data.lengthDelimitedRecord() {
            if let key = String(data: record, encoding: .utf8) {
                if header.keys.contains(key) {
                    throw SMKPMessageCodingError.decodeError(description: SMKPMessageCodingError.headerDuplicatedKeyError)
                }
                if let value = try? data.lengthDelimitedRecord() {
                    header[key] = value
                } else {
                    throw SMKPMessageCodingError.decodeError(description: SMKPMessageCodingError.headerValueError)
                }
            } else {
                throw SMKPMessageCodingError.decodeError(description: SMKPMessageCodingError.headerKeyError)
            }
        }
        if header.isEmpty {
            return nil
        } else {
            return SMKPMessageHeader(header: header)
        }
    }
}
