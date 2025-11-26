"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputChecker = void 0;
const lazyProperty_1 = require("./lazyProperty");
const NativeLogger_1 = require("./NativeLogger");
const TAG = "InputChecker";
/**
 *  Describes the input checker, that check if inputs are valid or not
 */
class InputChecker {
    constructor(sceneObjectName) {
        this.sceneObjectName = sceneObjectName;
        this.log = new NativeLogger_1.default(TAG);
    }
    /**
     * Throws an error if an input is undefined, otherwise, returns the input
     * without the undefined type
     * @param input the input value to check, can be either typed or undefined
     * @param inputName the input name for logging
     * @returns input with typing
     */
    checkUndefined(input, inputName) {
        if (input === undefined) {
            throw new Error(`${inputName} is not specified in SceneObject: ${this.sceneObjectName}`);
        }
        return input;
    }
    /**
     * This can be used to delay the fetching of a script property until needed, which is useful for showIf
     * properties that may be unused.
     * @param getPropertyFunction The function to get the value of the property, when needed.
     * @param propertyName The name of the property, for logging.
     * @returns a function that will return the value of getPropertyFunction, which will only be called once
     */
    lazyScriptProperty(getPropertyFunction, propertyName) {
        return (0, lazyProperty_1.lazyProperty)(() => {
            return this.checkUndefined(getPropertyFunction(), propertyName);
        });
    }
    /**
     * Log a warning if an input is undefined, otherwise, returns the input
     * without the undefined type
     * @param input the input value to check, can be either typed or undefined
     * @param inputName the input name for logging
     * @returns input with typing
     */
    warnIfUndefined(input, inputName) {
        if (input === undefined) {
            this.log.w(`${inputName} is not specified in SceneObject: ${this.sceneObjectName}`);
        }
        return input;
    }
}
exports.InputChecker = InputChecker;
//# sourceMappingURL=InputChecker.js.map