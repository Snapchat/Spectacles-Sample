import LogLevelProvider from "../Providers/InteractionConfigurationProvider/LogLevelProvider"
import SIKLogLevelProvider from "../Providers/InteractionConfigurationProvider/SIKLogLevelProvider"
import {logWithTag} from "./logger"
import {LogLevel} from "./LogLevel"

export default class NativeLogger {
  private sikLogLevelProvider = SIKLogLevelProvider.getInstance()

  private tag: string
  private logger: (...args: any[]) => void
  private logLevelFilter: LogLevel
  private logLevelProvider: LogLevelProvider

  constructor(tag: string, logLevelProvider?: LogLevelProvider) {
    this.tag = tag
    this.logger = logWithTag(tag)

    this.logLevelProvider = logLevelProvider ?? this.sikLogLevelProvider
    this.logLevelFilter = this.logLevelProvider.logLevel
    this.logLevelProvider.onLogLevelChanged.add(this.updateLogLevel.bind(this))
  }

  i(message: string): void {
    if (!this.shouldLog(LogLevel.Info)) {
      return
    }

    this.logger(this.tag, message)
  }

  d(message: string): void {
    if (!this.shouldLog(LogLevel.Debug)) {
      return
    }

    this.logger(this.tag, message)
  }

  e(message: string): void {
    if (!this.shouldLog(LogLevel.Error)) {
      return
    }

    this.logger(this.tag, message)
  }

  w(message: string): void {
    if (!this.shouldLog(LogLevel.Warning)) {
      return
    }

    this.logger(this.tag, message)
  }

  v(message: string): void {
    if (!this.shouldLog(LogLevel.Verbose)) {
      return
    }

    this.logger(this.tag, message)
  }

  private shouldLog(logLevel: LogLevel): boolean {
    return logLevel <= this.logLevelFilter
  }

  private updateLogLevel(logLevel: LogLevel): void {
    this.logLevelFilter = logLevel
  }
}
