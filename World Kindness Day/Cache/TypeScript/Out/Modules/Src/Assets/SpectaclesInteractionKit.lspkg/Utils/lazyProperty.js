"use strict";
/**
 * This can be used to delay the fetching of a property until needed
 *
 * @param getPropertyFunction The function to get the value of the property, when needed.
 * @returns a function that will return the value of getPropertyFunction, which will only be called once
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyProperty = lazyProperty;
/**
 * @param getPropertyFunction
 */
function lazyProperty(getPropertyFunction) {
    let lazyProperty;
    return () => {
        if (lazyProperty === undefined) {
            lazyProperty = getPropertyFunction();
        }
        return lazyProperty;
    };
}
//# sourceMappingURL=lazyProperty.js.map