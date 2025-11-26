"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notEmpty = notEmpty;
/**
 * Checks for null or undefined and asserts that the value is neither.
 * Designed to be used as part of a {@link Array.Filter} call.
 *
 * @param value - Value to be tested.
 * @returns - True if it is neither null not undefined.
 */
function notEmpty(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=notEmpty.js.map