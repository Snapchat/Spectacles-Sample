"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = require("../../Utils/LogLevel");
const ReplayEvent_1 = require("../../Utils/ReplayEvent");
/**
 * Provides the level of logging that we want to allow.
 * Provides properties to get and set the log level, and an event that is invoked when the log level changes.
 */
class LogLevelProvider {
    constructor() {
        this._logLevel = LogLevel_1.LogLevel.Verbose;
        this.onLogLevelChangedEvent = new ReplayEvent_1.default(1);
        this.onLogLevelChanged = this.onLogLevelChangedEvent.publicApi();
    }
    /**
     * Get the level of logging that we want to allow from this provider.
     * @returns 3 for Error, 4 for Warning, 6 for Info, 7 for Debug, 8 for Verbose.
     */
    get logLevel() {
        return this._logLevel;
    }
    /**
     * Set the level of logging that we want to allow from this provider.
     * @param logLevel - 3 for Error, 4 for Warning, 6 for Info, 7 for Debug, 8 for Verbose.
     */
    set logLevel(logLevel) {
        if (this._logLevel === logLevel) {
            return;
        }
        this._logLevel = logLevel;
        this.onLogLevelChangedEvent.invoke(this.logLevel);
    }
}
exports.default = LogLevelProvider;
//# sourceMappingURL=LogLevelProvider.js.map