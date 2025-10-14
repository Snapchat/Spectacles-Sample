// Copyright © 2025 Snap, Inc. All rights reserved.

import Foundation

/// Errors that cause the QLIC connection to terminate
struct QLICError: Error, CustomStringConvertible {
    /**
     Error codes corresponding to TLS 1.3 fatal alert descriptions.

     See https://www.rfc-editor.org/rfc/rfc8446#section-6
     */
    enum CryptoErrorCode: Int {
        case unexpectedMessage = 10
        case badRecordMac = 20
        case recordOverflow = 22
        case handshakeFailure = 40
        case badCertificate = 42
        case unsupportedCertificate = 43
        case certificateRevoked = 44
        case certificateExpired = 45
        case certificateUnknown = 46
        case illegalParameter = 47
        case unknownCa = 48
        case accessDenied = 49
        case decodeError = 50
        case decryptError = 51
        case protocolVersion = 70
        case insufficientSecurity = 71
        case internalError = 80
        case inappropriateFallback = 86
        case userCanceled = 90
        case missingExtension = 109
        case unsupportedExtension = 110
        case unrecognizedName = 112
        case badCertificateStatusREsponse = 113
        case unknownPskIdentity = 115
        case certificateRequired = 116
        case noApplicationProtocol = 120
    }

    /**
     Base error codes taken from the QUIC specification

     See https://www.rfc-editor.org/rfc/rfc9000.html#name-transport-error-codes
     */
    enum BaseErrorCode: Int {
        case noError = 0x00
        case internalError = 0x01
        case connectionRefused = 0x02
        case flowControlError = 0x03
        case streamLimitError = 0x04
        case streamStateError = 0x05
        case finalSizeError = 0x06
        case frameEncodingError = 0x07
        case transportParameterError = 0x08
        case connectionIdLimitError = 0x09
        case protocolViolation = 0x0A
        case invalidToken = 0x0B
        case applicationError = 0x0C
        case cryptoBufferExceeded = 0x0D
        case keyUpdateError = 0x0E
        case aeadLimitReached = 0x0F
        case noViablePath = 0x10
    }

    /// Error code surfaced to the remote peer
    let qlicErrorCode: Int
    /**
     Error frame type surfaced to the remote peer.

     Will be `nil` for application errors, and non-nil for protocol errors
     */
    let qlicFrameType: Int?
    /// Error reason. Ideally a UTF-8 encoded string
    let qlicErrorReason: Data

    /**
     Internal error surfaced to the local app.

     Will be `nil` for remote peer errors, and non-nil for local errors
     */
    let internalError: (any Error)?

    var description: String {
        let reason = if let encoded = String(data: qlicErrorReason, encoding: .utf8) {
            "\"\(encoded)\""
        } else {
            "\(qlicErrorReason)"
        }

        if let qlicFrameType {
            if let internalError {
                return "QLICError.localProtocolError(code: \(qlicErrorCode), frameType: \(qlicFrameType), reason: \(reason), underlying: \(internalError)"
            } else {
                return "QLICError.remoteProtocolError(code: \(qlicErrorCode), frameType: \(qlicFrameType), reason: \(reason)"
            }
        } else {
            if let internalError {
                return "QLICError.localAppError(code: \(qlicErrorCode), reason: \(reason), underlying: \(internalError)"
            } else {
                return "QLICError.remoteAppError(code: \(qlicErrorCode), reason: \(reason)"
            }
        }
    }

    static func remoteAppError(code: Int, reason: Data) -> QLICError {
        QLICError(qlicErrorCode: code, qlicFrameType: nil, qlicErrorReason: reason, internalError: nil)
    }

    static func remoteProtocolError(code: Int, frameType: Int, reason: Data) -> QLICError {
        QLICError(qlicErrorCode: code, qlicFrameType: frameType, qlicErrorReason: reason, internalError: nil)
    }

    static func localAppError(code: Int, reason: Data) -> QLICError {
        QLICError(qlicErrorCode: code, qlicFrameType: nil, qlicErrorReason: reason, internalError: CancellationError())
    }

    static func localProtocolError(code: BaseErrorCode, frameType: Int, reason: String, underlying: any Error) -> QLICError {
        QLICError(
            qlicErrorCode: code.rawValue,
            qlicFrameType: frameType,
            qlicErrorReason: Data(reason.utf8),
            internalError: underlying
        )
    }

    static func cryptoError(code: CryptoErrorCode, reason: String, underlying: any Error) -> QLICError {
        QLICError(
            qlicErrorCode: code.rawValue + 0x100,
            qlicFrameType: 0x06,
            qlicErrorReason: Data(reason.utf8),
            internalError: underlying
        )
    }

    /// The close frame sent to signal that the connection is closing
    var closeFrame: QLICFrame {
        if let qlicFrameType {
            return .protocolConnectionClose(
                protocolErrorCode: qlicErrorCode,
                frameType: qlicFrameType,
                reason: qlicErrorReason
            )
        } else {
            return .applicationConnectionClose(applicationErrorCode: qlicErrorCode, reason: qlicErrorReason)
        }
    }
}
