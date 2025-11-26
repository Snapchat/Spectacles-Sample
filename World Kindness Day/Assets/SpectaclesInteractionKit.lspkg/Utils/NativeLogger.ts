import LogLevelProvider from "../Providers/InteractionConfigurationProvider/LogLevelProvider"
import SIKLogLevelProvider from "../Providers/InteractionConfigurationProvider/SIKLogLevelProvider"
import {formatWithTag, logWithTag} from "./logger"
import {LogLevel} from "./LogLevel"

/**
 * A logger that outputs messages with filtering based on configurable log level thresholds.
 *
 * Each message is tagged with the identifier provided in the constructor for easier filtering when viewing logs.
 *
 * Log level can be configured through a LogLevelProvider passed to the constructor and dynamically responds to changes in the provider's level.
 * If no provider is specified, defaults to the shared SIKLogLevelProvider instance.
 */
export default class NativeLogger {
  private sikLogLevelProvider = SIKLogLevelProvider.getInstance()

  private tag: string
  private logger: (...args: any[]) => void
  private formatter: (...args: any[]) => string
  private logLevelFilter: LogLevel
  private logLevelProvider: LogLevelProvider

  constructor(tag: string, logLevelProvider?: LogLevelProvider) {
    this.tag = tag
    this.logger = logWithTag(tag)
    this.formatter = formatWithTag(tag)

    this.logLevelProvider = logLevelProvider ?? this.sikLogLevelProvider
    this.logLevelFilter = this.logLevelProvider.logLevel
    this.logLevelProvider.onLogLevelChanged.add(this.updateLogLevel.bind(this))
  }

  /**
   * Logs an Info message.
   * @param message The message to log.
   */
  i(message: string): void {
    if (!this.shouldLog(LogLevel.Info)) {
      return
    }

    this.logger(message)
  }

  /**
   * Logs a Debug message.
   * @param message The message to log.
   */
  d(message: string): void {
    if (!this.shouldLog(LogLevel.Debug)) {
      return
    }

    this.logger(message)
  }

  /**
   * Logs an Error message.
   * @param message The message to log.
   */
  e(message: string): void {
    if (!this.shouldLog(LogLevel.Error)) {
      return
    }

    this.logger(message)
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
  f(message: string): void {
    if (!this.shouldLog(LogLevel.Fatal)) {
      return
    }

    throw new Error(this.formatter(message))
  }

  /**
   * Logs a Warning message.
   * @param message The message to log.
   */
  w(message: string): void {
    if (!this.shouldLog(LogLevel.Warning)) {
      return
    }

    this.logger(message)
  }

  /**
   * Logs a Verbose message.
   * @param message The message to log.
   */
  v(message: string): void {
    if (!this.shouldLog(LogLevel.Verbose)) {
      return
    }

    this.logger(message)
  }

  private shouldLog(logLevel: LogLevel): boolean {
    return logLevel <= this.logLevelFilter
  }

  private updateLogLevel(logLevel: LogLevel): void {
    this.logLevelFilter = logLevel
  }
}
