"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SIKLogLevelProvider_1 = require("../Providers/InteractionConfigurationProvider/SIKLogLevelProvider");
const logger_1 = require("./logger");
const LogLevel_1 = require("./LogLevel");
/**
 * A logger that outputs messages with filtering based on configurable log level thresholds.
 *
 * Each message is tagged with the identifier provided in the constructor for easier filtering when viewing logs.
 *
 * Log level can be configured through a LogLevelProvider passed to the constructor and dynamically responds to changes in the provider's level.
 * If no provider is specified, defaults to the shared SIKLogLevelProvider instance.
 */
class NativeLogger {
    constructor(tag, logLevelProvider) {
        this.sikLogLevelProvider = SIKLogLevelProvider_1.default.getInstance();
        this.tag = tag;
        this.logger = (0, logger_1.logWithTag)(tag);
        this.formatter = (0, logger_1.formatWithTag)(tag);
        this.logLevelProvider = logLevelProvider ?? this.sikLogLevelProvider;
        this.logLevelFilter = this.logLevelProvider.logLevel;
        this.logLevelProvider.onLogLevelChanged.add(this.updateLogLevel.bind(this));
    }
    /**
     * Logs an Info message.
     * @param message The message to log.
     */
    i(message) {
        if (!this.shouldLog(LogLevel_1.LogLevel.Info)) {
            return;
        }
        this.logger(message);
    }
    /**
     * Logs a Debug message.
     * @param message The message to log.
     */
    d(message) {
        if (!this.shouldLog(LogLevel_1.LogLevel.Debug)) {
            return;
        }
        this.logger(message);
    }
    /**
     * Logs an Error message.
     * @param message The message to log.
     */
    e(message) {
        if (!this.shouldLog(LogLevel_1.LogLevel.Error)) {
            return;
        }
        this.logger(message);
    }
    /**
     * Throws an Error with a message for fatal conditions.
     * The Lens will be terminated if the exception is uncaught.
     * Unlike other logging methods, this doesn't directly write to logs but throws an exception.
     * When uncaught, the exception and its message will be written to log upon termination.
     *
     * @param message The message that is provided to the Exception.
     *
     * @example
     * const TAG = "MyTag"
     * const log = new NativeLogger(TAG)
     * try {
     *   log.f("This is a fatal error condition")
     * } catch (e) {
     *   // Handle the exception or perform cleanup
     *   console.log(e.message); // You could explicitly log the message if needed
     * }
     */
    f(message) {
        if (!this.shouldLog(LogLevel_1.LogLevel.Fatal)) {
            return;
        }
        throw new Error(this.formatter(message));
    }
    /**
     * Logs a Warning message.
     * @param message The message to log.
     */
    w(message) {
        if (!this.shouldLog(LogLevel_1.LogLevel.Warning)) {
            return;
        }
        this.logger(message);
    }
    /**
     * Logs a Verbose message.
     * @param message The message to log.
     */
    v(message) {
        if (!this.shouldLog(LogLevel_1.LogLevel.Verbose)) {
            return;
        }
        this.logger(message);
    }
    shouldLog(logLevel) {
        return logLevel <= this.logLevelFilter;
    }
    updateLogLevel(logLevel) {
        this.logLevelFilter = logLevel;
    }
}
exports.default = NativeLogger;
//# sourceMappingURL=NativeLogger.js.map