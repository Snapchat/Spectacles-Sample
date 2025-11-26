"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCallback = createCallback;
/**
 * Creates callbacks to be passed to UI Kit events from a script in the Inspector panel.
 * @param scriptComponent - the script to be used.
 * @param functionNames - the names of the functions within the script to be invoked during this callback.
 * @returns a callback that will invoke the specified functions in the script provided.
 */
function createCallback(scriptComponent, functionNames) {
    if (scriptComponent === undefined) {
        return () => { };
    }
    return (args) => {
        functionNames.forEach((name) => {
            if (scriptComponent[name]) {
                ;
                scriptComponent[name](args);
            }
        });
    };
}
//# sourceMappingURL=InspectorCallbacks.js.map