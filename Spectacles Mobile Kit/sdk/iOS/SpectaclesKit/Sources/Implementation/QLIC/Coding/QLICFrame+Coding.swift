// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

extension QLICFrame: VisitorEncodable {
    var type: Int {
        switch self {
        case .padding:
            0x0
        case .ping:
            0x1
        case .ack:
            0x2
        case .resetStream:
            0x4
        case .stopSending:
            0x5
        case .crypto:
            0x6
        case let .stream(_, _, fin, endsOnMessageBoundary):
            0x8 + (fin ? 0x1 : 0) + (endsOnMessageBoundary ? 0x2 : 0)
        case .protocolConnectionClose:
            0x1C
        case .applicationConnectionClose:
            0x1D
        }
    }

    /**
     Encodes this frame into a visitor.
     */
    func encode(into visitor: inout some EncodingVisitor) throws {
        try visitor.visit(type)
        switch self {
        case .padding, .ping:
            break
        case let .ack(bytesSinceLastAck):
            try visitor.visit(bytesSinceLastAck)
        case let .resetStream(streamId, applicationErrorCode), let .stopSending(streamId, applicationErrorCode):
            try visitor.visit(streamId)
            try visitor.visit(applicationErrorCode)
        case let .crypto(cryptoData):
            try visitor.visit(cryptoData.count)
            visitor.visit(cryptoData)
        case let .stream(streamId, streamData, _, _):
            try visitor.visit(streamId)
            try visitor.visit(streamData.count)
            visitor.visit(streamData)
        case let .protocolConnectionClose(protocolErrorCode, frameType, reason):
            try visitor.visit(protocolErrorCode)
            try visitor.visit(frameType)
            try visitor.visit(reason.count)
            visitor.visit(reason)
        case let .applicationConnectionClose(applicationErrorCode, reason):
            try visitor.visit(applicationErrorCode)
            try visitor.visit(reason.count)
            visitor.visit(reason)
        }
    }

    /**
     Parses a single frame from some data, removes those bytes from the data, and returns the frame.

     See `encode(into:)` for format details.
     */
    static func dequeueFrame(from data: inout Data) throws(QLICError) -> QLICFrame {
        var type = 0
        do {
            type = try data.dequeueVarInt()
            switch type {
            case 0x0:
                return .padding
            case 0x1:
                return .ping
            case 0x2:
                return try .ack(bytesSinceLastAck: data.dequeueVarInt())
            case 0x4:
                let streamId = try data.dequeueVarInt()
                let appErrorCode = try data.dequeueVarInt()
                return .resetStream(streamId: streamId, applicationErrorCode: appErrorCode)
            case 0x5:
                let streamId = try data.dequeueVarInt()
                let appErrorCode = try data.dequeueVarInt()
                return .stopSending(streamId: streamId, applicationErrorCode: appErrorCode)
            case 0x6:
                return try .crypto(cryptoData: data.dequeueData(count: data.dequeueVarInt()))
            case 0x8 ... 0xB:
                let fin = (type & 0x1) != 0
                let endsOnMessageBoundary = (type & 0x2) != 0
                let streamId = try data.dequeueVarInt()
                let streamDataSize = try data.dequeueVarInt()
                let streamData = try data.dequeueData(count: streamDataSize)
                return .stream(
                    streamId: streamId,
                    streamData: streamData,
                    fin: fin,
                    endsOnMessageBoundary: endsOnMessageBoundary
                )
            case 0x1C:
                let errorCode = try data.dequeueVarInt()
                let frameType = try data.dequeueVarInt()
                let reason = try data.dequeueData(count: data.dequeueVarInt())
                return .protocolConnectionClose(protocolErrorCode: errorCode, frameType: frameType, reason: reason)
            case 0x1D:
                let errorCode = try data.dequeueVarInt()
                let reason = try data.dequeueData(count: data.dequeueVarInt())
                return .applicationConnectionClose(applicationErrorCode: errorCode, reason: reason)
            default:
                throw UnrecognizedTypeError(type: type)
            }
        } catch {
            throw .localProtocolError(
                code: .frameEncodingError,
                frameType: type,
                reason: "Failed to decode frame",
                underlying: error
            )
        }
    }
}
