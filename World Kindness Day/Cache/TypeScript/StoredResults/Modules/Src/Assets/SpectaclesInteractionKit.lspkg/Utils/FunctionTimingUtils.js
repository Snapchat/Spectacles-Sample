"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = exports.debounce = void 0;
exports.setTimeout = setTimeout;
exports.clearTimeout = clearTimeout;
const LensConfig_1 = require("./LensConfig");
/**
 * Debounces a function
 * @param debouncedFunction the function that needs debouncing
 * @param timeoutInMsecs the timeout for the debounce in milliseconds
 * @returns the debounced function
 */
const debounce = (debouncedFunction, timeoutInMsecs) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => debouncedFunction.apply(this, args), timeoutInMsecs);
    };
};
exports.debounce = debounce;
/**
 * Throttles a function
 * @param throttledFunction the function that needs throttling
 * @param delayMsecs the delay for the throttle in milliseconds
 * @returns the throttled function
 */
const throttle = (throttledFunction, delayMsecs) => {
    let timeoutId;
    let previousTime = 0;
    return (...args) => {
        const currentTime = Date.now();
        if (currentTime - previousTime < delayMsecs) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => throttledFunction.apply(this, args), delayMsecs);
        }
        else {
            previousTime = currentTime;
            throttledFunction.apply(this, args);
        }
    };
};
exports.throttle = throttle;
function setTimeout(callback, time) {
    const cancelToken = { cancelled: false };
    const updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
    updateDispatcher.createDelayedEvent("setTimeout", () => {
        if (!cancelToken.cancelled) {
            callback();
        }
    }, time / 1000);
    return cancelToken;
}
function clearTimeout(timeoutId) {
    if (timeoutId !== undefined && timeoutId.cancelled !== undefined) {
        timeoutId.cancelled = true;
    }
}
//# sourceMappingURL=FunctionTimingUtils.js.map