"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
/**
 * The severity of a log message.
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Fatal"] = 0] = "Fatal";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Warning"] = 4] = "Warning";
    LogLevel[LogLevel["Info"] = 6] = "Info";
    LogLevel[LogLevel["Debug"] = 7] = "Debug";
    LogLevel[LogLevel["Verbose"] = 8] = "Verbose";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
//# sourceMappingURL=LogLevel.js.map