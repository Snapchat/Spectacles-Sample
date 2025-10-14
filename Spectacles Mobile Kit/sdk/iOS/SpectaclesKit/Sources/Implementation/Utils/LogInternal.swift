// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation
import os

protocol HexStringConvertible {
    var hexString: String { get }
}

extension Data: HexStringConvertible {
    var hexString: String {
        map { String(format: "%02x", $0) }.joined()
    }
}

extension SymmetricKey: HexStringConvertible {
    var hexString: String {
        withUnsafeBytes { buffer in
            buffer.map { String(format: "%02x", $0) }.joined()
        }
    }
}

extension Log {
    static func assertionFailure(
        _ message: @autoclosure () -> String,
        file: StaticString = #file,
        line: UInt = #line
    ) {
        logger?.log(level: .fault, message: "assertion failure @\(file):\(line): \(message())")
        Swift.assertionFailure("[SpectaclesKit] \(message())", file: file, line: line)
    }

    static func fatalError(
        _ message: @autoclosure () -> String,
        file: StaticString = #file,
        line: UInt = #line
    ) -> Never {
        logger?.log(level: .fault, message: "fatal error @\(file):\(line): \(message())")
        Swift.fatalError("[SpectaclesKit] \(message())", file: file, line: line)
    }

    static func precondition(
        _ condition: @autoclosure () -> Bool,
        _ message: @autoclosure () -> String,
        file: StaticString = #file,
        line: UInt = #line
    ) {
        logger?.log(level: .fault, message: "precondition failure @\(file):\(line): \(message())")
        Swift.precondition(condition(), "[SpectaclesKit] \(message())", file: file, line: line)
    }

    static func print(_ items: Any...) {
        info(items.reduce("") { result, next in
            if let hex = next as? (any HexStringConvertible) {
                return result + String(describing: hex.hexString)
            } else {
                return result + String(describing: next)
            }
        })
    }

    /// Logs messages for debug and tracing purposes
    static func debug(_ message: @autoclosure () -> String) {
        logger?.log(level: .debug, message: message())
    }

    /// Logs messages that record normal system operation
    static func info(_ message: @autoclosure () -> String) {
        logger?.log(level: .info, message: message())
    }

    /// Logs messages that record normal operation, but may require further attention or monitoring
    static func notice(_ message: @autoclosure () -> String) {
        logger?.log(level: .notice, message: message())
    }

    /// Logs messages that indicate some sort of recoverable error
    static func error(_ message: @autoclosure () -> String) {
        logger?.log(level: .error, message: message())
    }
}
