"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delta = void 0;
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const AxisAngle_1 = require("./AxisAngle");
const TimeDataContainer_1 = require("./TimeDataContainer");
const TimeScalarContainer_1 = require("./TimeScalarContainer");
const TAG = "RgbIrTransitionJumpSuppressor";
const DEFAULT_DECAY_DURATION_SEC = 3;
const RgbIrTransitionJumpSuppressorConfigDefault = {
    boneRatioChangeLimit: 0.1,
    boneLengthAverageWindowFrames: 5,
    maxCapacity: 50,
    decayDurationSec: 3,
    maxTimespentWithoutDecaying: -1,
    enableDecayImmediately: false,
    registerOnlySignedPairs: true
};
class Delta {
    constructor(config) {
        this.config = config;
        this.id = Delta.nextId++;
        this._canDecay = RgbIrTransitionJumpSuppressorConfigDefault.enableDecayImmediately;
        this.decayStartTime = undefined;
        this.decayStopTime = undefined;
        this.creationTime = getTime();
        this.decayDurationSec =
            RgbIrTransitionJumpSuppressorConfigDefault.decayDurationSec > 0
                ? RgbIrTransitionJumpSuppressorConfigDefault.decayDurationSec
                : DEFAULT_DECAY_DURATION_SEC;
    }
    /**
     * Helper method to create a new delta object instance
     * @param detection - handover detection object to get sign (handover direction) metadata from it
     * @param modifiedValues - targeting directin and locus (origin) on the previous and current frame to measure delta between them
     * @returns the created delta instance
     */
    static createDelta(detection, modifiedValues) {
        return new Delta({
            direction: AxisAngle_1.default.getRotationBetween(modifiedValues.currentDirection, modifiedValues.previousDirection),
            locus: modifiedValues.previousLocus.sub(modifiedValues.currentLocus),
            sign: detection.sign,
            multiplier: 1
        });
    }
    /**
     * @returns the direction of the detected handover when the delta is measured
     *  1: from UL to HLMT
     * -1: from HLMT to UL
     */
    get sign() {
        return this.config.sign;
    }
    /**
     * @returns if the delta can be decayed
     */
    get canDecay() {
        return this._canDecay;
    }
    /**
     * Sets if the delta can be decayed
     */
    set canDecay(value) {
        if (this._canDecay === false && value === true) {
            this.decayStartTime = getTime();
        }
        this._canDecay = value;
    }
    /**
     * Steps the decay
     */
    decay() {
        if (this.canDecay === false) {
            return;
        }
        this.config.multiplier -= getDeltaTime() / this.decayDurationSec;
        if (this.decayStopTime === undefined && this.config.multiplier <= 0) {
            this.decayStopTime = getTime();
        }
    }
    /**
     * @returns the current duration of the decaying in seconds
     * Returns zero seconds if the decaying hasn't been started.
     * Stops increasing after the delta is completely decayed.
     */
    decayDuration() {
        if (this.decayStartTime === undefined) {
            return 0;
        }
        else if (this.decayStopTime === undefined) {
            return getTime() - this.decayStartTime;
        }
        else {
            return this.decayStopTime - this.decayStartTime;
        }
    }
    /**
     * @returns the elapsed time in seconds since the delta object was created
     */
    timeSinceCreated() {
        return getTime() - this.creationTime;
    }
    isValid() {
        return this.config.multiplier > 0;
    }
    /**
     * Applies the delta on the targeting direction to suppress jumps because of the handover
     * @param direction - targeting direction
     * @returns targeting direction with the delta applied on it
     */
    applyDirectionDelta(direction) {
        if (!this.isValid()) {
            return direction;
        }
        return AxisAngle_1.default.applyRotation(this.config.direction.multipliedBy(this.config.multiplier), direction);
    }
    /**
     * Applies the delta on the targeting locus to suppress jumps because of the handover
     * @param locus - targeting locus
     * @returns targeting locus with the delta applied on it
     */
    applyLocusDelta(locus) {
        if (!this.isValid()) {
            return locus;
        }
        return locus.add(this.config.locus.uniformScale(this.config.multiplier));
    }
}
exports.Delta = Delta;
Delta.nextId = 0;
/*
 * Because of the hand tracking differences between
 * the Ul and HLMT models running on the different camera types (IR - UL, RGB - HLMT)
 * there is a clearly visible jump in the targeting direction and origin (locus) point
 * which interfere with user's interaction intentions and results in bad user experience.
 * This class implements a logic to suppress the targeting jumps on IR-RGB hand tracking handover.
 */
class RgbIrTransitionJumpSuppressor {
    constructor(hand) {
        this.hand = hand;
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.bones = [];
        this.deltas = [];
        this.previousLocus = undefined;
        this.previousDirection = undefined;
        /*
         * These two bones seemed the best for differentiating the different models
         * (largest change in relative length on successive frames when the handover happens)
         */
        const jointPairs = [
            [this.hand.indexKnuckle, this.hand.indexMidJoint],
            [this.hand.pinkyUpperJoint, this.hand.pinkyTip]
        ];
        for (const pair of jointPairs) {
            const begin = pair[0];
            const end = pair[1];
            if (begin === null || end === null) {
                throw new Error("Bone joints should not be null");
            }
            this.bones.push({
                begin: begin,
                end: end,
                smoothedLength: new TimeScalarContainer_1.TimedScalarContainer(TimeDataContainer_1.WindowMode.FRAME, RgbIrTransitionJumpSuppressorConfigDefault.boneLengthAverageWindowFrames),
                currentLength: undefined
            });
        }
    }
    isHandOverToRegister(sign) {
        const acceptBasedOnSign = this.deltas.length === 0 ||
            this.deltas[this.deltas.length - 1].sign !== sign ||
            RgbIrTransitionJumpSuppressorConfigDefault.registerOnlySignedPairs === false;
        const withinCapacity = RgbIrTransitionJumpSuppressorConfigDefault.maxCapacity < 1 ||
            this.deltas.length < RgbIrTransitionJumpSuppressorConfigDefault.maxCapacity;
        if (acceptBasedOnSign && withinCapacity) {
            return true;
        }
        this.log.d("Handover is not registered either because of wrong transition parity or delta capacity overflow");
        this.log.d(`Parity check: ${acceptBasedOnSign}`);
        this.log.d(`Capacity check: ${withinCapacity}`);
        return false;
    }
    detectHandOver() {
        let registerAsHandOver = false;
        let sign = 0;
        let avgRatio = 0;
        let count = 0;
        this.log.v("Change of relative bone lengths:");
        for (const bone of this.bones) {
            const currentLength = bone.begin.position.distance(bone.end.position);
            if (currentLength <= 0) {
                this.log.e("Bone length should be a positive value");
                continue;
            }
            bone.currentLength = currentLength;
            const previousLength = bone.smoothedLength.average();
            if (previousLength !== null) {
                if (previousLength <= 0) {
                    this.log.e("Bone length should be a positive value");
                    continue;
                }
                const ratio = bone.currentLength / previousLength;
                this.log.v(`${bone.begin.getAttachmentPoint().name} - ${bone.end.getAttachmentPoint().name}: ${((ratio - 1) * 100).toFixed(1)} %`);
                avgRatio += ratio;
                count++;
            }
        }
        this.log.v("------------------");
        if (count > 0) {
            avgRatio /= count;
        }
        else {
            avgRatio = 1;
        }
        const ratioDifference = avgRatio - 1;
        if (Math.abs(ratioDifference) >= RgbIrTransitionJumpSuppressorConfigDefault.boneRatioChangeLimit) {
            sign = Math.sign(ratioDifference);
            registerAsHandOver = this.isHandOverToRegister(sign);
            for (const bone of this.bones) {
                bone.smoothedLength.clear();
            }
            this.log.d(`Model swich detected: ${sign === 1 ? "HLMT" : "UL"}, diff: ${(ratioDifference * 100).toFixed(1)} %, Register: ${registerAsHandOver}`);
        }
        for (const bone of this.bones) {
            if (bone.currentLength === undefined) {
                this.log.e("Bone length should be defined at this point");
                continue;
            }
            bone.smoothedLength.pushData(getTime(), bone.currentLength);
        }
        return {
            isHandOver: registerAsHandOver,
            sign: sign
        };
    }
    decayAndRemoveInvalidDeltas() {
        const newDeltas = [];
        for (const delta of this.deltas) {
            delta.decay();
            if (delta.isValid()) {
                newDeltas.push(delta);
            }
        }
        this.deltas = newDeltas;
    }
    computeModifiedValues(currentDirection, previousDirection, currentLocus, previousLocus) {
        let modifiedCurrentDirection = currentDirection;
        let modifiedPreviousDirection = previousDirection;
        let modifiedCurrentLocus = currentLocus;
        let modifiedPreviousLocus = previousLocus;
        for (const delta of this.deltas) {
            modifiedCurrentDirection = delta.applyDirectionDelta(modifiedCurrentDirection);
            modifiedPreviousDirection = delta.applyDirectionDelta(modifiedPreviousDirection);
            modifiedCurrentLocus = delta.applyLocusDelta(modifiedCurrentLocus);
            modifiedPreviousLocus = delta.applyLocusDelta(modifiedPreviousLocus);
        }
        return {
            currentDirection: modifiedCurrentDirection,
            previousDirection: modifiedPreviousDirection,
            currentLocus: modifiedCurrentLocus,
            previousLocus: modifiedPreviousLocus
        };
    }
    startDecayOldLastDelta(maxTime) {
        if (this.deltas.length > 0) {
            const lastDelta = this.deltas[this.deltas.length - 1];
            const timeSinceCreated = lastDelta.timeSinceCreated();
            if (timeSinceCreated > maxTime) {
                lastDelta.canDecay = true;
            }
        }
    }
    storeDelta(delta) {
        this.deltas.push(delta);
        if (this.deltas.length % 2 === 0) {
            this.deltas[this.deltas.length - 1].canDecay = true;
            this.deltas[this.deltas.length - 2].canDecay = true;
        }
    }
    /**
     * Resets the state of the suppressor
     * Should be called when the hand is not tracked or targeting is blocked
     */
    reset() {
        this.previousLocus = undefined;
        this.previousDirection = undefined;
        this.deltas = [];
    }
    /**
     * Update the suppressor state by detecting handover and computing, storing deltas
     * @param currentDirection - targeting direction on the current frame
     * @param currentLocus - targeting locus on the current frame
     */
    update(currentDirection, currentLocus) {
        const detection = this.detectHandOver();
        this.decayAndRemoveInvalidDeltas();
        if (RgbIrTransitionJumpSuppressorConfigDefault.maxTimespentWithoutDecaying > 0) {
            this.startDecayOldLastDelta(RgbIrTransitionJumpSuppressorConfigDefault.maxTimespentWithoutDecaying);
        }
        if (detection.isHandOver === true && this.previousDirection !== undefined && this.previousLocus !== undefined) {
            const delta = Delta.createDelta(detection, this.computeModifiedValues(currentDirection, this.previousDirection, currentLocus, this.previousLocus));
            this.storeDelta(delta);
            this.log.d(`Delta registered, deltas size: ${this.deltas.length}`);
            for (const delta of this.deltas) {
                this.log.d(`decay: ${delta.canDecay}, id: ${delta.id}, to model: ${delta.sign === 1 ? "HLMT" : "UL"}, isValid: ${delta.isValid()}`);
            }
        }
        else if (detection.isHandOver === true) {
            this.log.d(`Cannot register because previous data is undefined: ${this.previousDirection}, ${this.previousLocus}`);
        }
        this.previousLocus = currentLocus;
        this.previousDirection = currentDirection;
    }
    /**
     * Applies the stored deltas on the targeting direction to suppress jumps because of the handover
     * @param currentDirection - targeting direction on the current frame
     * @returns targeting direction with deltas applied on it
     */
    applyDirectionDelta(currentDirection) {
        let direction = currentDirection;
        for (const delta of this.deltas) {
            direction = delta.applyDirectionDelta(direction);
        }
        return direction;
    }
    /**
     * Applies the stored deltas on the targeting locus to suppress jumps because of the handover
     * @param currentLocus - targeting locus on the current frame
     * @returns targeting locus with deltas applied on it
     */
    applyLocusDelta(currentLocus) {
        let locus = currentLocus;
        for (const delta of this.deltas) {
            locus = delta.applyLocusDelta(locus);
        }
        return locus;
    }
}
exports.default = RgbIrTransitionJumpSuppressor;
//# sourceMappingURL=RgbIrTransitionJumpSuppressor.js.map