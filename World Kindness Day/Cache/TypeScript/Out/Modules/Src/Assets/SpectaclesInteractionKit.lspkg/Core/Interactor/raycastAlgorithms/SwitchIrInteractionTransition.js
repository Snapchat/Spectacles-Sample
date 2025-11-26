"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwitchIrInteractionTransitionConfigDefault = {
    rotationXDegrees: 35,
    neckHandHeightDifferenceToIr: 35,
    neckHandHeightDifferenceToDefault: 30,
    gazePitchDegreesToIr: 25,
    gazePitchDegreesToDefault: 25,
    transitionSeconds: 0.2,
    debounceToIrSeconds: 0.2,
    debounceToDefaultSeconds: 0.1
};
/**
 * Class to implement Switch-like IR Transition Strategy
 */
class SwitchIrInteractionTransition {
    constructor() {
        this.inIrMode = false;
        this.irModeSaturationProgress = 0;
        this.debounceProgress = 0;
        this.config = SwitchIrInteractionTransitionConfigDefault;
        this.transitionSeconds = this.config.transitionSeconds > 0 ? this.config.transitionSeconds : 0.2;
        this.debounceToIrSeconds = this.config.debounceToIrSeconds > 0 ? this.config.debounceToIrSeconds : 0.2;
        this.debounceToDefaultSeconds = this.config.debounceToDefaultSeconds > 0 ? this.config.debounceToDefaultSeconds : 0.1;
    }
    /** @inheritdoc */
    computeXRotationInDegrees(gazePitchInDegrees, toWorldFromSituationSpace, handPoint) {
        const transformedHandPoint = toWorldFromSituationSpace.inverse().multiplyPoint(handPoint);
        const rotationInDegrees = this.computeMultiplier(transformedHandPoint, gazePitchInDegrees) * this.config.rotationXDegrees;
        return rotationInDegrees;
    }
    /** @inheritdoc */
    computeXRotationInRadians(gazePitchInRadians, toWorldFromSituationSpace, handPoint) {
        return (MathUtils.DegToRad *
            this.computeXRotationInDegrees(MathUtils.RadToDeg * gazePitchInRadians, toWorldFromSituationSpace, handPoint));
    }
    /**
     * Computes the multiplier for the Ir interaction additional rotation in switch transition mode
     * @param handPoint - hand point used for height estimation
     * @param gazePitchInDegrees - gaze pitch given in degrees
     * @returns multiplier for the Ir interaction interaction rotation
     */
    computeMultiplier(handPoint, gazePitchInDegrees) {
        if (this.inIrMode === false) {
            this.switchTransitionStrategyInDefaultMode(handPoint, gazePitchInDegrees);
        }
        else {
            this.switchTransitionStrategyInIrMode(handPoint, gazePitchInDegrees);
        }
        return this.irModeSaturationProgress;
    }
    /**
     * Steps the switch transition strategy while in default mode
     * @param handPoint - hand point used for height estimation
     * @param gazePitchInDegrees - gaze pitch given in degrees
     */
    switchTransitionStrategyInDefaultMode(handPoint, gazePitchInDegrees) {
        if (handPoint.y < -this.config.neckHandHeightDifferenceToIr &&
            gazePitchInDegrees > -this.config.gazePitchDegreesToIr) {
            this.debounceProgress += getDeltaTime() / this.debounceToIrSeconds;
            this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1);
            if (this.debounceProgress === 1) {
                this.inIrMode = true;
                this.debounceProgress = 0;
            }
        }
        else {
            this.irModeSaturationProgress -= getDeltaTime() / this.transitionSeconds;
            this.irModeSaturationProgress = MathUtils.clamp(this.irModeSaturationProgress, 0, 1);
            this.debounceProgress -= getDeltaTime() / this.debounceToIrSeconds;
            this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1);
        }
    }
    /**
     * Steps the switch transition strategy while in IR mode
     * @param handPoint - hand point used for height estimation
     * @param gazePitchInDegrees - gaze pitch given in degrees
     */
    switchTransitionStrategyInIrMode(handPoint, gazePitchInDegrees) {
        if (handPoint.y >= -this.config.neckHandHeightDifferenceToDefault ||
            gazePitchInDegrees <= -this.config.gazePitchDegreesToDefault) {
            this.debounceProgress += getDeltaTime() / this.debounceToDefaultSeconds;
            this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1);
            if (this.debounceProgress === 1) {
                this.inIrMode = false;
                this.debounceProgress = 0;
            }
        }
        else {
            this.irModeSaturationProgress += getDeltaTime() / this.transitionSeconds;
            this.irModeSaturationProgress = MathUtils.clamp(this.irModeSaturationProgress, 0, 1);
            this.debounceProgress -= getDeltaTime() / this.debounceToDefaultSeconds;
            this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1);
        }
    }
}
exports.default = SwitchIrInteractionTransition;
//# sourceMappingURL=SwitchIrInteractionTransition.js.map