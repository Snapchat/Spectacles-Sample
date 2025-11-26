"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RaycastBase_1 = require("./RaycastBase");
/**
 * RaycastProxy forwards the TargetingData received from LensCore's Gesture Module.
 */
class RaycastProxy extends RaycastBase_1.default {
    constructor(hand) {
        super(hand);
    }
    /**
     * Forwards the TargetingData received from LensCore's Gesture Module.
     *
     * @returns RaycastInfo (locus and direction of the ray) filled with
     * the data received from LensCore's Gesture Module.
     * If no data has been received (e.g.: couldn't subscribe because the API is not yet present in LensCore), it can return null.
     */
    getRay() {
        const targetingData = this.hand.targetingData;
        if (targetingData !== null) {
            return {
                locus: targetingData.targetingLocusInWorld,
                direction: targetingData.targetingDirectionInWorld
            };
        }
        else {
            return null;
        }
    }
}
exports.default = RaycastProxy;
//# sourceMappingURL=RaycastProxy.js.map