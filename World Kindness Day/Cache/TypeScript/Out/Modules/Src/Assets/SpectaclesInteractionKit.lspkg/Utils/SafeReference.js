"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeReference = getSafeReference;
/**
 * Used to check if an Object reference has been destroyed on the LensCore side
 * @param reference - the reference to check, typically a SceneObject or Component
 * @returns - the same reference if not destroyed on the LensCore side, or null if destroyed
 */
function getSafeReference(reference) {
    if (reference && !isNull(reference)) {
        return reference;
    }
    return null;
}
//# sourceMappingURL=SafeReference.js.map