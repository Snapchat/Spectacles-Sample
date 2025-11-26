"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinchJumpSuppressor = exports.SuppressionState = exports.DeltaMode = void 0;
const mathUtils_1 = require("../../../Utils/mathUtils");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const OneEuroFilter_1 = require("../../../Utils/OneEuroFilter");
const AxisAngle_1 = require("./AxisAngle");
const TimeDataContainer_1 = require("./TimeDataContainer");
const TimedVec2Container_1 = require("./TimedVec2Container");
const TimeScalarContainer_1 = require("./TimeScalarContainer");
const TAG = "PinchJumpSuppressor";
const PinchJumpSuppressorConfigDefault = {
    knuckleSmoothingSpace: "DeviceCenter",
    minPinchDistanceCm: 3.5,
    maxPinchDistanceCm: 4,
    maxPinchSpeedCmPerSec: 60,
    pinchDistanceTimeSeriesWindowSizeFrame: 4,
    stableFingerRootsAverageDistanceWindowSizeSec: 0.66,
    stableFingerKnuckleVelocityWindowSizeSec: 0.3,
    transformStableKnucklesBackToWorld: true,
    minKnuckleSpeedCmPerSec: 10.0,
    maxKnuckleSpeedCmPerSec: 20.0,
    useCombinedIntensityAtActiveStateLeave: false,
    activeStateEnterIntensityThreshold: 0.6,
    activeStateLeaveIntensityThreshold: 0.2,
    suppressionBuildUpInterval: 0.5,
    suppressionTearDownInterval: 0.5,
    pinchJumpSuppressionDeltaEnabled: true,
    gradualDeltaReleaseEnabled: true,
    verbosePinchJumpSuppressor: false
};
var DeltaMode;
(function (DeltaMode) {
    DeltaMode[DeltaMode["IDLE"] = 0] = "IDLE";
    DeltaMode[DeltaMode["MEASURE"] = 1] = "MEASURE";
    DeltaMode[DeltaMode["APPLY"] = 2] = "APPLY";
})(DeltaMode || (exports.DeltaMode = DeltaMode = {}));
var SuppressionState;
(function (SuppressionState) {
    SuppressionState[SuppressionState["NOT_ACTIVE"] = 0] = "NOT_ACTIVE";
    SuppressionState[SuppressionState["ACTIVE"] = 1] = "ACTIVE";
})(SuppressionState || (exports.SuppressionState = SuppressionState = {}));
/**
 * A major issue with far field targetging is that the ray
 * jumps during pinching even if the hand remains still
 * (aside from the movement of the fingers performing the pinch).
 *
 * This class contains the logic to suppress this undesirable jump effect.
 * It aims to handle this problem without freezing the ray
 * so when the pinch is held out for longer periods,
 * the possibility to drag or move the targeted object is still retained.
 */
class PinchJumpSuppressor {
    constructor(hand) {
        this.hand = hand;
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.stableFingerRootsAverageDistance = new TimeScalarContainer_1.TimedScalarContainer(TimeDataContainer_1.WindowMode.TIME, PinchJumpSuppressorConfigDefault.stableFingerRootsAverageDistanceWindowSizeSec);
        this.stableFingerRootsTimeSeries = [];
        this.pinchDistance = null;
        this.pinchDistanceTimeSeries = new TimeScalarContainer_1.TimedScalarContainer(TimeDataContainer_1.WindowMode.FRAME, PinchJumpSuppressorConfigDefault.pinchDistanceTimeSeriesWindowSizeFrame);
        this.pinchSpeed = null;
        this.deltaMode = DeltaMode.IDLE;
        this.deltaMultiplier = 1;
        this.directionDelta = new AxisAngle_1.default(vec3.zero(), 0);
        this.locusDelta = vec3.zero();
        this.directionLowpassFilter = new OneEuroFilter_1.LowPassFilterVec3_v2(1.0);
        this.locusLowpassFilter = new OneEuroFilter_1.LowPassFilterVec3_v2(1.0);
        this.lastActivationTimestampInSecond = null;
        this.lastDeactivationTimestampInSecond = null;
        this.suppressionState = SuppressionState.NOT_ACTIVE;
        this.deltaEnabled = PinchJumpSuppressorConfigDefault.pinchJumpSuppressionDeltaEnabled;
        this.gradualDeltaReleaseEnabled = PinchJumpSuppressorConfigDefault.gradualDeltaReleaseEnabled;
        this.verboseMode = PinchJumpSuppressorConfigDefault.verbosePinchJumpSuppressor;
        this.minKnuckleSpeedCmPerSec = PinchJumpSuppressorConfigDefault.minKnuckleSpeedCmPerSec;
        this.maxKnuckleSpeedCmPerSec = PinchJumpSuppressorConfigDefault.maxKnuckleSpeedCmPerSec;
        this.minPinchDistanceCm = PinchJumpSuppressorConfigDefault.minPinchDistanceCm;
        this.maxPinchDistanceCm = PinchJumpSuppressorConfigDefault.maxPinchDistanceCm;
        this.maxPinchSpeedCmPerSec = PinchJumpSuppressorConfigDefault.maxPinchSpeedCmPerSec;
        this.useCombinedIntensityAtActiveStateLeave = PinchJumpSuppressorConfigDefault.useCombinedIntensityAtActiveStateLeave;
        this.activeStateEnterIntensity = PinchJumpSuppressorConfigDefault.activeStateEnterIntensityThreshold;
        this.activeStateLeaveIntensity = PinchJumpSuppressorConfigDefault.activeStateLeaveIntensityThreshold;
        this.suppressionBuildUpInterval = PinchJumpSuppressorConfigDefault.suppressionBuildUpInterval;
        this.suppressionTearDownInterval = PinchJumpSuppressorConfigDefault.suppressionTearDownInterval;
        this._knuckleSmoothingSpace = PinchJumpSuppressorConfigDefault.knuckleSmoothingSpace;
        for (let i = 0; i < this.stableKnuckleKeypoints.length; i++) {
            const series = new TimedVec2Container_1.TimedVec2Container(TimeDataContainer_1.WindowMode.TIME, PinchJumpSuppressorConfigDefault.stableFingerKnuckleVelocityWindowSizeSec);
            this.stableFingerRootsTimeSeries.push(series);
        }
    }
    /**
     * @returns the name of the selected space
     * where knuckles are transformed from world to be smoothed.
     */
    get knuckleSmoothingSpace() {
        return this._knuckleSmoothingSpace;
    }
    /**
     * Determines the necessary suppression for the current frame
     * @param knuckleSmoothingSpaceFromWorld - smoothingSpace-from-world transformation
     */
    updateState(knuckleSmoothingSpaceFromWorld) {
        this.updatePinchDistance();
        this.updateSuppressionState();
        const stableKnuckleKeypoints = this.stableKnuckleKeypoints;
        const knucklesDistance = this.computeKnucklesDistanceFromSmootingSpaceOrigin(knuckleSmoothingSpaceFromWorld, stableKnuckleKeypoints);
        const maxKnuckleMoveIntensity = this.computeMaxKnuckleMoveIntensity(knucklesDistance, knuckleSmoothingSpaceFromWorld, stableKnuckleKeypoints);
        this.updateSuppressionParameters(maxKnuckleMoveIntensity);
    }
    /**
     * Applies suppression to the given ray by returning its modified value.
     * @param direction - the direction of the ray to work on
     * @param locus - the locus of the ray to work on
     * @returns the components of the ray after applying suppression to them.
     */
    applySuppression(direction, locus) {
        let modifiedDirection = this.applyDirectionLowpassFilter(direction);
        modifiedDirection = this.applyDirectionDelta(modifiedDirection);
        let modifiedLocus = this.applyLocusLowpassFilter(locus);
        modifiedLocus = this.applyLocusDelta(modifiedLocus);
        return {
            direction: modifiedDirection,
            locus: modifiedLocus
        };
    }
    /**
     * @returns the position of 4 knuckle landmarks if they are available
     */
    get stableKnuckleKeypoints() {
        return [this.hand.indexKnuckle, this.hand.middleKnuckle, this.hand.ringKnuckle, this.hand.pinkyKnuckle];
    }
    /**
     * Calculates average distance of knuckles relative to the smoothing space origin.
     * @param knuckleSmoothingSpaceFromWorld - smoothingSpace-from-world transformation
     * @param stableKnuckleKeypoints - position of 4 knuckle landmarks, assumed to be stable while pinching
     * @returns the calculated distance value
     */
    computeKnucklesDistanceFromSmootingSpaceOrigin(knuckleSmoothingSpaceFromWorld, stableKnuckleKeypoints) {
        let averageDistance = 0;
        let length = 0;
        for (const keypoint of stableKnuckleKeypoints) {
            if (keypoint === null) {
                continue;
            }
            const position = knuckleSmoothingSpaceFromWorld.multiplyPoint(keypoint.position);
            averageDistance += position.z;
            length++;
        }
        if (length > 0) {
            averageDistance /= length;
        }
        this.stableFingerRootsAverageDistance.pushData(getTime(), averageDistance);
        return this.stableFingerRootsAverageDistance.average();
    }
    /**
     * Calculates the movement intensity of each knuckles assumed to be stable while pinching
     * based on their 2D velocity. Returns the maximum of these intensities.
     * @param knucklesDistance - distance of knuckles relative to the smoothing space origin
     * @param knuckleSmoothingSpaceFromWorld - smoothingSpace-from-world transformation
     * @param stableKnuckleKeypoints - position of 4 knuckle landmarks, assumed to be stable while pinching
     * @returns the calculated maximum movement intensity value
     */
    computeMaxKnuckleMoveIntensity(knucklesDistance, knuckleSmoothingSpaceFromWorld, stableKnuckleKeypoints) {
        let maxKnuckleSpeed = null;
        if (knucklesDistance) {
            for (let i = 0; i < this.stableFingerRootsTimeSeries.length; i++) {
                const keyPoint = stableKnuckleKeypoints[i];
                const pointInWorld = keyPoint ? keyPoint.position : vec3.zero();
                const pointInSmoothingSpace = knuckleSmoothingSpaceFromWorld.multiplyPoint(pointInWorld);
                const depth = pointInSmoothingSpace.z;
                const stablePointSmoothingSpace = depth !== 0
                    ? new vec3((pointInSmoothingSpace.x / depth) * knucklesDistance, (pointInSmoothingSpace.y / depth) * knucklesDistance, knucklesDistance)
                    : new vec3(pointInSmoothingSpace.x, pointInSmoothingSpace.y, knucklesDistance);
                const usedStablePoint = PinchJumpSuppressorConfigDefault.transformStableKnucklesBackToWorld
                    ? knuckleSmoothingSpaceFromWorld.inverse().multiplyPoint(stablePointSmoothingSpace)
                    : stablePointSmoothingSpace;
                this.stableFingerRootsTimeSeries[i].pushData(getTime(), new vec2(usedStablePoint.x, usedStablePoint.y));
                const knuckleSpeedCmPerSec = this.stableFingerRootsTimeSeries[i].aggregateAbsoluteVelocity();
                if (knuckleSpeedCmPerSec !== null && (maxKnuckleSpeed === null || knuckleSpeedCmPerSec > maxKnuckleSpeed)) {
                    maxKnuckleSpeed = knuckleSpeedCmPerSec;
                }
            }
        }
        let maxKnuckleMoveIntensity = 1;
        if (maxKnuckleSpeed !== null) {
            maxKnuckleMoveIntensity = MathUtils.clamp((0, mathUtils_1.inverseLerp)(this.minKnuckleSpeedCmPerSec, this.maxKnuckleSpeedCmPerSec, maxKnuckleSpeed), 0, 1);
        }
        if (this.verboseMode) {
            this.log.d("MaxKnuckleSpeedCmPerSec: " + maxKnuckleSpeed?.toFixed(2));
            this.log.d("MaxKnuckleMoveIntensity: " + maxKnuckleMoveIntensity.toFixed(2));
        }
        return maxKnuckleMoveIntensity;
    }
    /**
     * Gets the intensity of the pinch based on the proximity of fingers
     * @returns the normalized position intensity
     */
    getPositionIntensity() {
        if (!this.pinchDistance) {
            return null;
        }
        if (this.verboseMode) {
            this.log.d("pinchDistance: " + this.pinchDistance.toFixed(2));
        }
        let normalizedRadius = (0, mathUtils_1.inverseLerp)(this.minPinchDistanceCm, this.maxPinchDistanceCm, this.pinchDistance);
        normalizedRadius = MathUtils.clamp(normalizedRadius, 0, 1);
        return 1 - normalizedRadius;
    }
    /**
     * Gets the intensity of the pinch based on the relative velocity of fingers
     * @returns a speed descriptor containing the normalized absolute velocity and its sign
     */
    getPinchSpeedDescriptor() {
        if (!this.pinchSpeed) {
            return null;
        }
        const normalizedSpeed = MathUtils.clamp(Math.abs(this.pinchSpeed) / this.maxPinchSpeedCmPerSec, 0, 1);
        if (this.verboseMode) {
            this.log.d("pinchSpeed: " + this.pinchSpeed.toFixed(2));
            this.log.d("normalizedSpeed: " + normalizedSpeed.toFixed(2));
        }
        return {
            isNegative: this.pinchSpeed < 0,
            absoluteValue: normalizedSpeed
        };
    }
    /**
     * Updates pinch radius which indicates how close fingers are to a pinch
     */
    updatePinchDistance() {
        if (this.hand.indexTip === null || this.hand.thumbTip === null) {
            this.pinchDistance = null;
            this.pinchSpeed = null;
            this.pinchDistanceTimeSeries.clear();
            return;
        }
        const newPinchDistance = this.hand.indexTip.position.distance(this.hand.thumbTip.position);
        this.pinchDistanceTimeSeries.pushData(getTime(), newPinchDistance);
        if (this.verboseMode) {
            this.log.d("newPinchDistance: " + newPinchDistance.toFixed(3));
            const deltaTime = getDeltaTime();
            this.log.d("deltaTime: " + deltaTime.toFixed(3));
        }
        this.pinchSpeed = this.pinchDistanceTimeSeries.aggregateSignedVelocity();
        this.pinchDistance = newPinchDistance;
    }
    /**
     * Executes the low-pass filter on the given targeting locus by returning its modified value.
     * @param locus - the locus to work on
     * @returns the modified locus
     */
    applyLocusLowpassFilter(locus) {
        const filteredLocus = this.locusLowpassFilter?.filter(locus);
        if (this.deltaMode === DeltaMode.MEASURE) {
            this.locusDelta = filteredLocus.sub(locus);
        }
        return filteredLocus;
    }
    /**
     * AExecutes the low-pass filter on the given targeting direction by returning its modified value.
     * @param direction - the direction to work on
     * @returns the modified direction
     */
    applyDirectionLowpassFilter(direction) {
        const filteredDirection = this.directionLowpassFilter.filter(direction);
        if (this.deltaMode === DeltaMode.MEASURE) {
            this.directionDelta = AxisAngle_1.default.getRotationBetween(direction, filteredDirection);
            if (this.verboseMode) {
                this.log.d("directionDelta: " + this.directionDelta.angle.toFixed(3) + ",  " + this.directionDelta.axis.toString());
            }
        }
        return filteredDirection;
    }
    /**
     * Adds the stored delta (partially or fully) to the given targeting locus by returning its modified value.
     * @param locus - the locus to work on
     * @returns the modified locus
     */
    applyLocusDelta(locus) {
        return this.deltaMode === DeltaMode.APPLY ? locus.add(this.locusDelta.uniformScale(this.deltaMultiplier)) : locus;
    }
    /**
     * Adds the stored delta (partially or fully) to the given targeting locus by returning its modified value.
     * @param direction - the direction to work on
     * @returns the modified direction
     */
    applyDirectionDelta(direction) {
        return this.deltaMode === DeltaMode.APPLY
            ? AxisAngle_1.default.applyRotation(this.directionDelta.multipliedBy(this.deltaMultiplier), direction)
            : direction;
    }
    /**
     * Determines the suppression state (active or not active) for the current frame.
     */
    updateSuppressionState() {
        const previousState = this.suppressionState;
        const pinchPositionIntensity = this.getPositionIntensity();
        const pinchSpeedDescriptor = this.getPinchSpeedDescriptor();
        if (pinchPositionIntensity === null || pinchSpeedDescriptor === null) {
            this.suppressionState = SuppressionState.NOT_ACTIVE;
            return;
        }
        if (this.verboseMode && pinchSpeedDescriptor) {
            this.log.d("pinchPositionIntensity: " + pinchPositionIntensity.toFixed(2));
            this.log.d("pinchSpeedDescriptor: " +
                (pinchSpeedDescriptor.isNegative ? "(-)" : "(+)") +
                pinchSpeedDescriptor.absoluteValue.toFixed(2));
        }
        const combinedPinchIntensity = MathUtils.clamp(pinchPositionIntensity + pinchSpeedDescriptor.absoluteValue, 0, 1);
        if (this.verboseMode) {
            this.log.d("combinedPinchIntensity: " + combinedPinchIntensity.toFixed(2));
        }
        let willBeActive;
        if (previousState === SuppressionState.NOT_ACTIVE) {
            willBeActive = combinedPinchIntensity >= this.activeStateEnterIntensity && pinchSpeedDescriptor.isNegative;
        }
        else {
            willBeActive =
                (this.useCombinedIntensityAtActiveStateLeave ? combinedPinchIntensity : pinchPositionIntensity) >=
                    this.activeStateLeaveIntensity || pinchSpeedDescriptor.isNegative;
        }
        this.suppressionState = willBeActive ? SuppressionState.ACTIVE : SuppressionState.NOT_ACTIVE;
        if (this.verboseMode) {
            this.log.d("suppressionState: " + this.suppressionState);
        }
        if (this.suppressionState === SuppressionState.ACTIVE) {
            if (previousState === SuppressionState.NOT_ACTIVE) {
                this.lastActivationTimestampInSecond = getTime();
                this.lastDeactivationTimestampInSecond = null;
                if (this.verboseMode) {
                    this.log.d("lastActivationTimestampInSecond was SET");
                }
            }
        }
        else {
            if (previousState === SuppressionState.ACTIVE) {
                this.lastDeactivationTimestampInSecond = getTime();
            }
            this.lastActivationTimestampInSecond = null;
            if (this.verboseMode) {
                this.log.d("lastActivationTimestampInSecond was RESET");
            }
        }
        if (this.verboseMode) {
            this.log.d("lastActivationTimestampInSecond: " + this.lastActivationTimestampInSecond?.toFixed(2));
            this.log.d("lastDeactivationTimestampInSecond: " + this.lastDeactivationTimestampInSecond?.toFixed(2));
        }
    }
    /**
     * Updates the suppression parameters (lowpass filter alpha; delta logic mode and multiplier) for the current frame
     * based on the suppression state and the calculated knuckle movement intensity.
     * @param knuckleMoveIntensity - the calculated knuckle movement intensity on the current frame
     */
    updateSuppressionParameters(knuckleMoveIntensity) {
        let alpha = 1;
        if (this.suppressionState === SuppressionState.ACTIVE) {
            const timeSinceLastActivation = getTime() - (this.lastActivationTimestampInSecond ?? getTime());
            const suppressionBuildUpIntervalHasElapsed = timeSinceLastActivation >= this.suppressionBuildUpInterval;
            if (this.deltaEnabled) {
                this.deltaMode = suppressionBuildUpIntervalHasElapsed ? DeltaMode.APPLY : DeltaMode.MEASURE;
                this.deltaMultiplier = 1;
            }
            const alphaBase = suppressionBuildUpIntervalHasElapsed ? 1 : knuckleMoveIntensity;
            alpha = Math.min(Math.pow(alphaBase, 4), 1);
            if (this.verboseMode) {
                this.log.d("timeSinceLastActivation: " + timeSinceLastActivation.toFixed(2));
                this.log.d("suppressionBuildUpIntervalHasElapsed: " + suppressionBuildUpIntervalHasElapsed);
                this.log.d("alphaBase: " + alphaBase.toFixed(2));
            }
        }
        else if (this.deltaEnabled && this.lastDeactivationTimestampInSecond !== null) {
            const timeSinceLastDeactivation = getTime() - this.lastDeactivationTimestampInSecond;
            if (this.gradualDeltaReleaseEnabled && timeSinceLastDeactivation < this.suppressionTearDownInterval) {
                const interpolationFactor = timeSinceLastDeactivation / this.suppressionTearDownInterval;
                this.deltaMode = DeltaMode.APPLY;
                this.deltaMultiplier = 1 - interpolationFactor;
            }
            else {
                this.deltaMode = DeltaMode.IDLE;
                this.deltaMultiplier = 1;
            }
        }
        if (this.verboseMode) {
            this.log.d("alpha: " + alpha.toFixed(2));
        }
        this.directionLowpassFilter.setAlpha(alpha);
        this.locusLowpassFilter.setAlpha(alpha);
    }
}
exports.PinchJumpSuppressor = PinchJumpSuppressor;
//# sourceMappingURL=PinchJumpSuppressor.js.map