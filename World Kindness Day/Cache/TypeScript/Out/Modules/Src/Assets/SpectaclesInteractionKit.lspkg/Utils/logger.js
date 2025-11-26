"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWithTag = exports.formatWithTag = exports.formatLogMessage = void 0;
const printFn = print;
const formatLogMessage = (tag, args) => {
    let result = `${tag}:`;
    for (const arg of args) {
        result += " " + arg;
    }
    return result;
};
exports.formatLogMessage = formatLogMessage;
const formatWithTag = (tag) => (...args) => {
    return (0, exports.formatLogMessage)(tag, args);
};
exports.formatWithTag = formatWithTag;
const logWithTag = (tag) => (...args) => {
    const message = (0, exports.formatLogMessage)(tag, args);
    printFn(message);
};
exports.logWithTag = logWithTag;
//# sourceMappingURL=logger.js.map