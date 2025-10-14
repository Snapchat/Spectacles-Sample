// Copyright © 2025 Snap, Inc. All rights reserved.

import Foundation
import os

/// Used to configure how SpectaclesKit logs are written out.
public enum Log {
    /// Logging levels used by the framework. Correspond roughly to OSLogType
    public enum LogLevel: Int, Sendable {
        case debug
        case info
        case notice
        case error
        case fault
    }

    /// Protocol allowing client to inject custom logging implementations
    public protocol Logger: Sendable {
        func log(level: LogLevel, message: @autoclosure () -> String)
    }

    /// Default logger that logs messages to the os.Logger framework.
    public struct DefaultLogger: Logger {
        let logger = os.Logger(subsystem: "com.snap.spectacles.spectacles-kit-mobile", category: "SpectaclesKit")

        let logLevel: LogLevel
        let enablePublicLogging: Bool

        public init(logLevel: LogLevel = .info, enablePublicLogging: Bool = false) {
            self.logLevel = logLevel
            self.enablePublicLogging = enablePublicLogging
        }

        public func log(level: Log.LogLevel, message: () -> String) {
            guard level.rawValue >= logLevel.rawValue else { return }
            let (logType, tag): (OSLogType, String) = switch level {
            case .debug: (.debug, "debug")
            case .info: (.info, "info")
            case .notice: (.default, "notice")
            case .error: (.error, "error")
            case .fault: (.fault, "fault")
            }
            let message = message()
            if enablePublicLogging {
                logger.log(level: logType, "[\(tag, privacy: .public)] \(message, privacy: .public)")
            } else {
                logger.log(level: logType, "[\(tag, privacy: .public)] \(message)")
            }
        }
    }

    /**
     Logger used by the framework to write log events.

     Defaults to an instance of `DefaultLogger`. Set this to redirect logging to a custom logging framework, or to `nil` to disable logging entirely.
     */
    public static var logger: (any Logger)? {
        get {
            loggerStorage.withLock { $0 }
        }
        set {
            loggerStorage.withLock { $0 = newValue }
        }
    }

    /// Private thread-safe storage for the logger
    static let loggerStorage = Lock<(any Logger)?>(initialState: DefaultLogger())
}
