import {PublicApi} from "../../Utils/Event"
import {LogLevel} from "../../Utils/LogLevel"
import ReplayEvent from "../../Utils/ReplayEvent"

/**
 * Provides the level of logging that we want to allow.
 * Provides properties to get and set the log level, and an event that is invoked when the log level changes.
 */
export default abstract class LogLevelProvider {
  private _logLevel: LogLevel = LogLevel.Verbose

  private onLogLevelChangedEvent = new ReplayEvent<LogLevel>(1)

  onLogLevelChanged: PublicApi<LogLevel> = this.onLogLevelChangedEvent.publicApi()

  /**
   * Get the level of logging that we want to allow from this provider.
   * @returns 3 for Error, 4 for Warning, 6 for Info, 7 for Debug, 8 for Verbose.
   */
  get logLevel(): LogLevel {
    return this._logLevel
  }

  /**
   * Set the level of logging that we want to allow from this provider.
   * @param logLevel - 3 for Error, 4 for Warning, 6 for Info, 7 for Debug, 8 for Verbose.
   */
  set logLevel(logLevel: LogLevel) {
    if (this._logLevel === logLevel) {
      return
    }

    this._logLevel = logLevel
    this.onLogLevelChangedEvent.invoke(this.logLevel)
  }
}
