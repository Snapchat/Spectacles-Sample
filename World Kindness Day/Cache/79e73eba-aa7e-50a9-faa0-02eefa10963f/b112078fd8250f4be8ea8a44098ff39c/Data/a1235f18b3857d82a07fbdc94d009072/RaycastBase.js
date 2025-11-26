"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEFT_HAND = exports.RIGHT_HAND = void 0;
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const HandInputData_1 = require("../../../Providers/HandInputData/HandInputData");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const OneEuroFilter_1 = require("../../../Utils/OneEuroFilter");
const validate_1 = require("../../../Utils/validate");
const smoothedThumbScale = 0.4;
const smoothedMidScale = 0.6;
const locusIndexKnuckleScale = 0.6;
const locusThumbKnuckleScale = 0.4;
const defaultOneEuroFrequency = 60;
const defaultOneEuroDCutoff = 0.16;
const knuckleSmoothingEnabled = false;
const knuckleOneEuroMinCutoff = 1;
const knuckleOneEuroBeta = 0.0001;
const wristSmoothingEnabled = false;
const wristOneEuroMinCutoff = 3.5;
const wristOneEuroBeta = 0.0001;
const directionSmoothingEnabled = true;
const directionOneEuroMinCutoff = 0.5;
const directionOneEuroBeta = 0.2;
const locusSmoothingEnabled = true;
const locusOneEuroMinCutoff = 0.5;
const locusOneEuroBeta = 0.2;
const shoulderSmoothingEnabled = true;
const shoulderOneEuroMinCutoff = 0.1;
const shoulderOneEuroBeta = 0.0001;
const zSmoothingEnabled = false;
const zOneEuroDCutoff = 0.16;
const zOneEuroMinCutoff = 0.001;
const zOneEuroBeta = 0.2;
const TAG = "RaycastBase";
exports.RIGHT_HAND = "right";
exports.LEFT_HAND = "left";
const DEFAULT_ONE_EURO_PARAMS = {
    frequency: defaultOneEuroFrequency,
    dcutoff: defaultOneEuroDCutoff
};
const KNUCKLE_ONE_EURO_FILTER_CONFIG = {
    ...DEFAULT_ONE_EURO_PARAMS,
    minCutoff: knuckleOneEuroMinCutoff,
    beta: knuckleOneEuroBeta
};
const WRIST_ONE_EURO_FILTER_CONFIG = {
    ...DEFAULT_ONE_EURO_PARAMS,
    minCutoff: wristOneEuroMinCutoff,
    beta: wristOneEuroBeta
};
const DIRECTION_ONE_EURO_FILTER_CONFIG = {
    ...DEFAULT_ONE_EURO_PARAMS,
    minCutoff: directionOneEuroMinCutoff,
    beta: directionOneEuroBeta
};
const LOCUS_ONE_EURO_FILTER_CONFIG = {
    ...DEFAULT_ONE_EURO_PARAMS,
    minCutoff: locusOneEuroMinCutoff,
    beta: locusOneEuroBeta
};
const SHOULDER_ONE_EURO_FILTER_CONFIG = {
    ...DEFAULT_ONE_EURO_PARAMS,
    minCutoff: shoulderOneEuroMinCutoff,
    beta: shoulderOneEuroBeta
};
const Z_ONE_EURO_FILTER_CONFIG = {
    frequency: DEFAULT_ONE_EURO_PARAMS.frequency,
    dcutoff: zOneEuroDCutoff,
    minCutoff: zOneEuroMinCutoff,
    beta: zOneEuroBeta
};
const SMOOTHED_THUMB_SCALE = smoothedThumbScale;
const SMOOTHED_MID_SCALE = smoothedMidScale;
const LOCUS_INDEX_KNUCKLE_SCALE = locusIndexKnuckleScale;
const LOCUS_THUMB_KNUCKLE_SCALE = locusThumbKnuckleScale;
/**
 * Abstract base class for raycast calculation algorithms
 * Includes smoothing
 */
class RaycastBase {
    constructor(hand) {
        this.hand = hand;
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.handProvider = HandInputData_1.HandInputData.getInstance();
        this.knuckleOneEuroFilter = knuckleSmoothingEnabled
            ? new OneEuroFilter_1.OneEuroFilterVec3(KNUCKLE_ONE_EURO_FILTER_CONFIG)
            : null;
        this.wristOneEuroFilter = wristSmoothingEnabled ? new OneEuroFilter_1.OneEuroFilterVec3(WRIST_ONE_EURO_FILTER_CONFIG) : null;
        /**
         * Direction and locus filters can be dynamically adjusted together with the same magnitude, if pinch stabilization smoothing is turned on.
         */
        this.directionOneEuroFilter = directionSmoothingEnabled
            ? new OneEuroFilter_1.OneEuroFilterVec3(DIRECTION_ONE_EURO_FILTER_CONFIG)
            : null;
        this.locusOneEuroFilter = locusSmoothingEnabled ? new OneEuroFilter_1.OneEuroFilterVec3(LOCUS_ONE_EURO_FILTER_CONFIG) : null;
        this.shoulderOneEuroFilter = shoulderSmoothingEnabled
            ? new OneEuroFilter_1.OneEuroFilterVec3(SHOULDER_ONE_EURO_FILTER_CONFIG)
            : null;
        this.handZOneEuroFilter = zSmoothingEnabled ? new OneEuroFilter_1.OneEuroFilter(Z_ONE_EURO_FILTER_CONFIG) : null;
        this.hand.onHandLost.add(() => {
            if (this.knuckleOneEuroFilter)
                this.knuckleOneEuroFilter.reset();
            if (this.wristOneEuroFilter)
                this.wristOneEuroFilter.reset();
            if (this.directionOneEuroFilter)
                this.directionOneEuroFilter.reset();
            if (this.locusOneEuroFilter)
                this.locusOneEuroFilter.reset();
            if (this.shoulderOneEuroFilter)
                this.shoulderOneEuroFilter.reset();
            if (this.handZOneEuroFilter)
                this.handZOneEuroFilter.reset();
        });
    }
    /**
     * Calculates anchor for the raycast, used for calculating both wrist and shoulder targeting
     * Can toggle whether or not smoothing should be used for the raycast anchor in the Script UI.
     */
    calculateCastAnchor(thumbKnuckle, middleKnuckle) {
        const middleFingerThumbOffset = middleKnuckle.sub(thumbKnuckle);
        const rootMiddleFinger = this.knuckleOneEuroFilter
            ? thumbKnuckle.add(this.knuckleOneEuroFilter.filter(middleFingerThumbOffset, getTime()))
            : thumbKnuckle.add(middleFingerThumbOffset);
        return rootMiddleFinger.uniformScale(SMOOTHED_MID_SCALE).add(thumbKnuckle.uniformScale(SMOOTHED_THUMB_SCALE));
    }
    get stubbedKeypoints() {
        return [
            this.hand.indexKnuckle,
            this.hand.middleKnuckle,
            this.hand.ringKnuckle,
            this.hand.pinkyKnuckle,
            this.hand.thumbBaseJoint,
            this.hand.wrist
        ];
    }
    /**
     * Filters the palm landmark if pre-filtering is selected & returns its position in world space
     * This is used to help mitigate the increased jitter for Matador wrist landmarks
     */
    getWrist() {
        if (this.hand.wrist === null)
            return null;
        return this.wristOneEuroFilter?.filter(this.hand.wrist.position, getTime()) ?? null;
    }
    /**
     * Calculates the interaction locus, where the ray cursor base is placed.
     */
    calculateInteractionLocus(thumbKnuckle, indexKnuckle) {
        return indexKnuckle
            .uniformScale(LOCUS_INDEX_KNUCKLE_SCALE)
            .add(thumbKnuckle.uniformScale(LOCUS_THUMB_KNUCKLE_SCALE));
    }
    /**
     * Calculates the measured and filtered average Z value of stab hand landmarks
     */
    filterHandZAverage(cameraToWorld) {
        (0, validate_1.validate)(this.handZOneEuroFilter);
        let zAverage = 0;
        let length = 0;
        for (const keypoint of this.stubbedKeypoints) {
            if (keypoint === null) {
                continue;
            }
            let position = keypoint.position;
            if (cameraToWorld !== undefined) {
                position = cameraToWorld.inverse().multiplyPoint(position);
            }
            zAverage += position.z;
            length++;
        }
        if (length > 0) {
            zAverage /= length;
        }
        const filteredZAverage = this.handZOneEuroFilter.filter(zAverage, getTime());
        return { zAverage: zAverage, filteredZAverage: filteredZAverage };
    }
    /**
     * Calculates corrected hand landmark positions using the measured and smoothed average Z values of stub
     */
    getCorrectedHandLandmarkPosition(cameraToWorld, avgZ, filteredAvgZ, worldPos) {
        if (worldPos === null) {
            return null;
        }
        if (cameraToWorld === undefined) {
            return vec3.zero();
        }
        const cameraPos = cameraToWorld.inverse().multiplyPoint(worldPos);
        const newZ = cameraPos.z - avgZ + filteredAvgZ;
        const newCameraPos = new vec3((cameraPos.x / cameraPos.z) * newZ, (cameraPos.y / cameraPos.z) * newZ, newZ);
        return cameraToWorld.multiplyPoint(newCameraPos);
    }
    /**
     * Gets the corrected landmark positions and the device center to world transformation
     */
    getRayAlgorithmData() {
        // Get joints from hands api
        const thumb = this.hand.thumbBaseJoint?.position ?? null;
        const index = this.hand.indexKnuckle?.position ?? null;
        const mid = this.hand.middleKnuckle?.position ?? null;
        const wrist = this.hand.wrist?.position ?? null;
        const deviceCenterToWorld = this.camera.getWorldTransform();
        let cameraToDeviceCenter = mat4.identity();
        try {
            cameraToDeviceCenter = global.deviceInfoSystem.getTrackingCamera().pose;
        }
        catch (e) {
            this.log.e("Exception during accessing the tracking camera device: " + e);
        }
        const cameraToWorld = deviceCenterToWorld.mult(cameraToDeviceCenter);
        if (this.handZOneEuroFilter === null) {
            return {
                thumb: thumb,
                index: index,
                mid: mid,
                wrist: wrist,
                deviceCenterToWorld: deviceCenterToWorld,
                cameraToWorld: cameraToWorld
            };
        }
        const handZAverage = this.filterHandZAverage(cameraToWorld);
        const getCorrectedPosition = (position) => {
            return this.getCorrectedHandLandmarkPosition(cameraToWorld, handZAverage.zAverage, handZAverage.filteredZAverage, position);
        };
        return {
            thumb: getCorrectedPosition(thumb),
            index: getCorrectedPosition(index),
            mid: getCorrectedPosition(mid),
            wrist: getCorrectedPosition(wrist),
            deviceCenterToWorld: deviceCenterToWorld,
            cameraToWorld: cameraToWorld
        };
    }
    /**
     * Can be used to reset inner states
     * Should be called when the hand is not tracked or targeting is blocked
     */
    reset() { }
}
exports.default = RaycastBase;
//# sourceMappingURL=RaycastBase.js.map