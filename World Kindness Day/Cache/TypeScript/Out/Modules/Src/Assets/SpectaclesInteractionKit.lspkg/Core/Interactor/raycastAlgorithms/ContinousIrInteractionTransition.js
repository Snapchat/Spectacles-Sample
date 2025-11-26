"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathUtils_1 = require("../../../Utils/mathUtils");
const ContinousIrInteractionTransitionConfigDefault = {
    maximumRotationXDegrees: 25,
    minNeckHandDifference: 10,
    maxNeckHandDifference: 45,
    enableGazeControl: false,
    minGazePitchDegrees: 25,
    maxGazePitchDegrees: 40
};
/**
 * Class to implement Directly controlled continuous IR Transition Strategy
 */
class ContinuousIrInteractionTransition {
    /** @inheritdoc */
    computeXRotationInDegrees(gazePitchInDegrees, toWorldFromSituationSpace, handPoint) {
        const transformedHandPoint = toWorldFromSituationSpace.inverse().multiplyPoint(handPoint);
        const rotationInDegrees = this.computeMultiplier(transformedHandPoint, gazePitchInDegrees) *
            ContinousIrInteractionTransitionConfigDefault.maximumRotationXDegrees;
        return rotationInDegrees;
    }
    /** @inheritdoc */
    computeXRotationInRadians(gazePitchInRadians, toWorldFromSituationSpace, handPoint) {
        return (MathUtils.DegToRad *
            this.computeXRotationInDegrees(MathUtils.RadToDeg * gazePitchInRadians, toWorldFromSituationSpace, handPoint));
    }
    /**
     * Computes the multiplier for the Ir interaction additional rotation in continuous transition mode
     * @param handPoint - hand point used for height estimation
     * @param gazePitchInDegrees - gaze pitch given in degrees
     * @returns multiplier for the Ir interaction interaction rotation
     */
    computeMultiplier(handPoint, gazePitchInDegrees) {
        const effect = MathUtils.clamp((0, mathUtils_1.inverseLerp)(-ContinousIrInteractionTransitionConfigDefault.minNeckHandDifference, -ContinousIrInteractionTransitionConfigDefault.maxNeckHandDifference, handPoint.y), 0, 1);
        const counterEffect = ContinousIrInteractionTransitionConfigDefault.enableGazeControl
            ? MathUtils.clamp((0, mathUtils_1.inverseLerp)(-ContinousIrInteractionTransitionConfigDefault.minGazePitchDegrees, -ContinousIrInteractionTransitionConfigDefault.maxGazePitchDegrees, gazePitchInDegrees), 0, 1)
            : 0;
        return MathUtils.clamp(effect - counterEffect, 0, 1);
    }
}
exports.default = ContinuousIrInteractionTransition;
//# sourceMappingURL=ContinousIrInteractionTransition.js.map