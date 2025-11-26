"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PalmState = exports.TrackingEvent = void 0;
const Event_1 = require("../../Utils/Event");
const FunctionTimingUtils_1 = require("../../Utils/FunctionTimingUtils");
const NativeLogger_1 = require("../../Utils/NativeLogger");
const PinchDetector_1 = require("./GestureProvider/PinchDetection/PinchDetector");
const Joints_1 = require("./Joints");
const mathUtils_1 = require("../../Utils/mathUtils");
const validate_1 = require("../../Utils/validate");
const WorldCameraFinderProvider_1 = require("../CameraProvider/WorldCameraFinderProvider");
const DefaultHandTrackingAssetProvider_1 = require("./DefaultHandTrackingAssetProvider");
const GestureModuleProvider_1 = require("./GestureProvider/GestureModuleProvider");
const PalmTapDetector_1 = require("./GestureProvider/PalmTapDetection/PalmTapDetector");
const Keypoint_1 = require("./Keypoint");
const LandmarkNames_1 = require("./LandmarkNames");
var TrackingEvent;
(function (TrackingEvent) {
    TrackingEvent["OnTrackingStarted"] = "OnTrackingStarted";
    TrackingEvent["OnTrackingLost"] = "OnTrackingLost";
})(TrackingEvent || (exports.TrackingEvent = TrackingEvent = {}));
const TAG = "TrackedHand";
const HAND_FACING_THRESHOLD = 40.0;
const FLAT_JOINT_ANGLE_THRESHOLD = Math.cos(150 * mathUtils_1.DegToRad);
const BENT_JOINT_ANGLE_THRESHOLD = Math.cos(80 * mathUtils_1.DegToRad);
const POINTING_PITCH_THRESHOLD = -60.0;
// GestureModule can take up to 350ms to determine if a pinch has been sustained.
const OBJECT_TRACKING_3D_TIMEOUT_MS = 400;
var PalmState;
(function (PalmState) {
    PalmState[PalmState["None"] = 0] = "None";
    PalmState[PalmState["Flat"] = 1] = "Flat";
    PalmState[PalmState["Closed"] = 2] = "Closed";
})(PalmState || (exports.PalmState = PalmState = {}));
/**
 * Manages a tracked hand, instantiates fingers and wrists.
 * Also manages the {@link ObjectTracking3D} and creates
 * the needed scene object hierarchy to achieve hand mesh visualization as well as landmarks tracking
 */
class TrackedHand {
    constructor(config) {
        this.config = config;
        // Dependency injection
        this.handTrackingAssetProvider = DefaultHandTrackingAssetProvider_1.default.getInstance();
        this.sceneObjectManager = global.scene;
        this.worldCamera = WorldCameraFinderProvider_1.default.getInstance();
        this.gestureModuleProvider = GestureModuleProvider_1.default.getInstance();
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        // SceneObject
        this._enabled = true;
        this.isDestroyed = false;
        // Events
        this.onEnabledChangedEvent = new Event_1.default();
        this.onEnabledChanged = this.onEnabledChangedEvent.publicApi();
        this.onHandFoundEvent = new Event_1.default();
        this.onHandFound = this.onHandFoundEvent.publicApi();
        this.onHandLostEvent = new Event_1.default();
        this.onHandLost = this.onHandLostEvent.publicApi();
        this.objectTracking3DRecentlyFound = false;
        // Keypoints
        this.keypoints = new Map();
        this.allPoints = [];
        this.thumbFingerPoints = [];
        this.indexFingerPoints = [];
        this.middleFingerPoints = [];
        this.ringFingerPoints = [];
        this.pinkyFingerPoints = [];
        this._isDominantHand = this.config.isDominantHand;
        this._targetingData = null;
        this._isPhoneInHand = false;
        this.onPhoneInHandBeginEvent = new Event_1.default();
        this.onPhoneInHandBegin = this.onPhoneInHandBeginEvent.publicApi();
        this.onPhoneInHandEndEvent = new Event_1.default();
        this.onPhoneInHandEnd = this.onPhoneInHandEndEvent.publicApi();
        this.ownerSceneObject = this.sceneObjectManager.createSceneObject(this.handType === "left" ? "LeftHandModelOwner" : "RightHandModelOwner");
        this.cameraObject = this.worldCamera.getComponent().getSceneObject();
        this.ownerSceneObject.setParent(this.cameraObject);
        this.objectTracking3DComponent = this.ownerSceneObject.createComponent("Component.ObjectTracking3D");
        if (this.objectTracking3DComponent === undefined) {
            throw new Error("Failed to create Component.ObjectTracking3D");
        }
        const asset = this.handTrackingAssetProvider.get(this.config.handType);
        if (!isNull(asset)) {
            this.objectTracking3DComponent.trackingAsset = asset;
        }
        this.objectTracking3DComponent.objectIndex = 0;
        this.objectTracking3DComponent.trackingMode = ObjectTracking3D.TrackingMode.Attachment;
        const logObjectTrackingEvent = (eventName) => {
            this.log.d(`Received event from ObjectTracking3D: handType: ${this.config.handType}, eventType: ${eventName}`);
        };
        this.objectTracking3DComponent.onTrackingStarted = () => {
            this.objectTracking3DRecentlyFound = true;
            logObjectTrackingEvent(TrackingEvent.OnTrackingStarted);
            this.log.v("HandEvent : " + "Hand Found Event");
            this.onHandFoundEvent.invoke();
            this.objectTracking3DCancelToken = (0, FunctionTimingUtils_1.setTimeout)(() => {
                this.objectTracking3DRecentlyFound = false;
            }, OBJECT_TRACKING_3D_TIMEOUT_MS);
        };
        this.objectTracking3DComponent.onTrackingLost = () => {
            this.objectTracking3DRecentlyFound = false;
            if (this.objectTracking3DCancelToken !== undefined) {
                this.objectTracking3DCancelToken.cancelled = true;
            }
            this.objectTracking3DCancelToken = undefined;
            logObjectTrackingEvent(TrackingEvent.OnTrackingLost);
            this.onHandLostEvent.invoke();
            this.log.v("HandEvent : " + "Hand Lost Event");
        };
        this.attachJoints(Joints_1.JOINT_HIERARCHY.children);
        this.setKeypointCollections();
        this.pinchDetector = new PinchDetector_1.PinchDetector({
            handType: this.config.handType,
            onHandLost: this.onHandLost,
            isTracked: () => {
                return this.isTracked();
            },
            pinchDetectionSelection: PinchDetector_1.PinchDetectionSelection.LensCoreML
        });
        this.onPinchDown = this.pinchDetector.onPinchDown;
        this.onPinchUp = this.pinchDetector.onPinchUp;
        this.onPinchCancel = this.pinchDetector.onPinchCancel;
        const gestureModule = this.gestureModuleProvider.getModule();
        if (gestureModule !== undefined) {
            const gestureHandType = this.handType === "right" ? GestureModule.HandType.Right : GestureModule.HandType.Left;
            try {
                gestureModule.getTargetingDataEvent(gestureHandType).add((args) => {
                    const rayOriginInCameraParent = args.rayOriginInWorld;
                    const rayDirectionInCameraParent = args.rayDirectionInWorld;
                    const [rayOriginInWorld, rayDirectionInWorld] = this.rayToWorld(rayOriginInCameraParent, rayDirectionInCameraParent);
                    this._targetingData = {
                        targetingDirectionInWorld: rayDirectionInWorld,
                        targetingLocusInWorld: rayOriginInWorld,
                        intendsToTarget: args.handIntendsToTarget
                    };
                    this.log.v("HandEvent : " +
                        "Targeting Data Event" +
                        " rayOriginInWorld: " +
                        rayOriginInWorld +
                        " rayDirectionInWorld: " +
                        rayDirectionInWorld);
                });
            }
            catch (error) {
                this.log.e(`Error subscribing to targeting ray event: ${error}`);
            }
            try {
                gestureModule.getIsPhoneInHandBeginEvent(gestureHandType).add(() => {
                    this._isPhoneInHand = true;
                    this.onPhoneInHandBeginEvent.invoke();
                    this.log.i("HandEvent : " + "Phone In Hand Event" + " isPhoneInHand: " + this._isPhoneInHand);
                });
                gestureModule.getIsPhoneInHandEndEvent(gestureHandType).add(() => {
                    this._isPhoneInHand = false;
                    this.onPhoneInHandEndEvent.invoke();
                    this.log.i("HandEvent : " + "Phone In Hand Event" + " isPhoneInHand: " + this._isPhoneInHand);
                });
            }
            catch (error) {
                this.log.e(`Error subscribing to gesture phone in hand event: ${error}`);
            }
        }
        try {
            if (this.handType === "right") {
                this.palmTapDetector = new PalmTapDetector_1.default(GestureModule.HandType.Right);
            }
        }
        catch (error) {
            this.log.w(`PalmTapDetector is not supported: ${error}`);
        }
    }
    get enabled() {
        return this._enabled;
    }
    setEnabled(isEnabled) {
        if (this._enabled === isEnabled) {
            return;
        }
        this._enabled = isEnabled;
        this.objectTracking3DComponent.enabled = this.enabled;
        this.onEnabledChangedEvent.invoke(this._enabled);
        this.log.v("HandEvent : " + "Hand Enabled Changed Event" + " to " + this._enabled);
    }
    isFacingCamera() {
        if (!this.isTracked()) {
            return false;
        }
        const facingCameraAngle = this.getFacingCameraAngle();
        return Boolean(facingCameraAngle !== null && facingCameraAngle < HAND_FACING_THRESHOLD);
    }
    isInTargetingPose() {
        if (!this.isTracked()) {
            return false;
        }
        const pitchAngle = this.getPalmPitchAngle();
        return !this.isFacingCamera() && pitchAngle !== null && pitchAngle > POINTING_PITCH_THRESHOLD;
    }
    getPinchDirection() {
        if (!this.isTracked()) {
            return null;
        }
        const thumbTipPosition = this.thumbTip.position;
        const thumbKnucklePosition = this.thumbKnuckle.position;
        const indexMidJointPosition = this.indexMidJoint.position;
        const forward = thumbTipPosition.sub(thumbKnucklePosition).normalize();
        const right = indexMidJointPosition.sub(thumbKnucklePosition).normalize();
        const up = this.handType === "right" ? right.cross(forward) : forward.cross(right);
        return quat.lookAt(forward, up);
    }
    getHandOrientation() {
        /**
         * 1. Create a right vector between the index and middle distals
         * 2. Create a forward vector between the wrist and middle distal
         * 3. Derive an up vector from the previous two vectors
         */
        const handRightVector = this.indexMidJoint.position.sub(this.middleMidJoint.position).normalize();
        const handForwardVector = this.middleMidJoint.position.sub(this.wrist.position).normalize();
        const handUpVector = handRightVector.cross(handForwardVector);
        const handToCameraVector = this.worldCamera.getWorldPosition().sub(this.wrist.position).normalize();
        return {
            forward: handForwardVector,
            right: handRightVector,
            up: handUpVector,
            cameraForward: handToCameraVector
        };
    }
    getFacingCameraAngle() {
        if (!this.isTracked()) {
            return null;
        }
        /**
         * Apply the camera to wrist direction against the derived up vector to get facing angle
         */
        const handOrientationVectors = this.getHandOrientation();
        const dotHandCamera = handOrientationVectors.up.dot(handOrientationVectors.cameraForward);
        const angle = MathUtils.RadToDeg * Math.acos(this.config.handType === "right" ? dotHandCamera : -dotHandCamera);
        return angle;
    }
    get palmState() {
        const middleKnuckleBendDotProduct = this.getMiddleKnuckleBendDotProduct();
        if (middleKnuckleBendDotProduct === null) {
            return PalmState.None;
        }
        if (middleKnuckleBendDotProduct < FLAT_JOINT_ANGLE_THRESHOLD) {
            return PalmState.Flat;
        }
        else if (middleKnuckleBendDotProduct > BENT_JOINT_ANGLE_THRESHOLD) {
            return PalmState.Closed;
        }
        return PalmState.None;
    }
    getMiddleKnuckleBendDotProduct() {
        const middleUpperJointPosition = this.middleUpperJoint?.position ?? null;
        const middleMidJointPosition = this.middleMidJoint?.position ?? null;
        const middleKnucklePosition = this.middleKnuckle?.position ?? null;
        if (middleUpperJointPosition === null || middleMidJointPosition === null || middleKnucklePosition === null) {
            return null;
        }
        const midToUpperDirection = middleUpperJointPosition.sub(middleMidJointPosition).normalize();
        const midToKnuckleDirection = middleKnucklePosition.sub(middleMidJointPosition).normalize();
        return midToUpperDirection.dot(midToKnuckleDirection);
    }
    getPalmPitchAngle() {
        if (!this.isTracked()) {
            return null;
        }
        /**
         * Compare the hand's forward direction to world up
         */
        const handOrientationVectors = this.getHandOrientation();
        const dotHandUp = handOrientationVectors.forward.dot(vec3.up());
        const angle = 90 - MathUtils.RadToDeg * Math.acos(dotHandUp);
        return angle;
    }
    getPalmCenter() {
        if (!this.isTracked()) {
            return null;
        }
        return this.indexKnuckle.position
            .add(this.pinkyKnuckle.position)
            .add(this.middleToWrist.position)
            .uniformScale(1.0 / 3.0);
    }
    get wrist() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.WRIST);
    }
    get thumbProximal() {
        return this.thumbToWrist;
    }
    get thumbToWrist() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.WRIST_TO_THUMB);
    }
    get thumbIntermediate() {
        return this.thumbBaseJoint;
    }
    get thumbBaseJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.THUMB_0);
    }
    /** @inheritdoc */
    get thumbDistal() {
        return this.thumbKnuckle;
    }
    get thumbKnuckle() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.THUMB_1);
    }
    get thumbPad() {
        return this.thumbMidJoint;
    }
    get thumbMidJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.THUMB_2);
    }
    get thumbTip() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.THUMB_3);
    }
    get indexProximal() {
        return this.indexToWrist;
    }
    get indexToWrist() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.WRIST_TO_INDEX);
    }
    get indexIntermediate() {
        return this.indexKnuckle;
    }
    get indexKnuckle() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.INDEX_0);
    }
    get indexDistal() {
        return this.indexMidJoint;
    }
    get indexMidJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.INDEX_1);
    }
    get indexPad() {
        return this.indexUpperJoint;
    }
    get indexUpperJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.INDEX_2);
    }
    get indexTip() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.INDEX_3);
    }
    get middleProximal() {
        return this.middleToWrist;
    }
    get middleToWrist() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.WRIST_TO_MIDDLE);
    }
    get middleIntermediate() {
        return this.middleKnuckle;
    }
    get middleKnuckle() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.MIDDLE_0);
    }
    get middleDistal() {
        return this.middleMidJoint;
    }
    get middleMidJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.MIDDLE_1);
    }
    get middlePad() {
        return this.middleUpperJoint;
    }
    get middleUpperJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.MIDDLE_2);
    }
    get middleTip() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.MIDDLE_3);
    }
    get ringProximal() {
        return this.ringToWrist;
    }
    get ringToWrist() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.WRIST_TO_RING);
    }
    get ringIntermediate() {
        return this.ringKnuckle;
    }
    get ringKnuckle() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.RING_0);
    }
    get ringDistal() {
        return this.ringMidJoint;
    }
    get ringMidJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.RING_1);
    }
    get ringPad() {
        return this.ringUpperJoint;
    }
    get ringUpperJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.RING_2);
    }
    get ringTip() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.RING_3);
    }
    get pinkyProximal() {
        return this.pinkyToWrist;
    }
    get pinkyToWrist() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.WRIST_TO_PINKY);
    }
    get pinkyIntermediate() {
        return this.pinkyKnuckle;
    }
    get pinkyKnuckle() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.PINKY_0);
    }
    get pinkyDistal() {
        return this.pinkyMidJoint;
    }
    get pinkyMidJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.PINKY_1);
    }
    get pinkyPad() {
        return this.pinkyUpperJoint;
    }
    get pinkyUpperJoint() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.PINKY_2);
    }
    get pinkyTip() {
        return this.getKeypoint(LandmarkNames_1.LandmarkName.PINKY_3);
    }
    get thumbFinger() {
        return this.thumbFingerPoints;
    }
    get indexFinger() {
        return this.indexFingerPoints;
    }
    get middleFinger() {
        return this.middleFingerPoints;
    }
    get ringFinger() {
        return this.ringFingerPoints;
    }
    get pinkyFinger() {
        return this.pinkyFingerPoints;
    }
    get points() {
        return this.allPoints;
    }
    get handType() {
        return this.config.handType;
    }
    get isDominantHand() {
        return this._isDominantHand;
    }
    get objectTracking3D() {
        return this.objectTracking3DComponent;
    }
    get targetingData() {
        return this._targetingData;
    }
    get isPhoneInHand() {
        return this._isPhoneInHand;
    }
    isTracked() {
        return this.objectTracking3DComponent.isTracking();
    }
    isRecentlyFound() {
        return this.objectTracking3DRecentlyFound;
    }
    getSceneObject() {
        return this.ownerSceneObject;
    }
    setIsDominantHand(isDominantHand) {
        this._isDominantHand = isDominantHand;
    }
    isPinching() {
        return this.pinchDetector.isPinching();
    }
    isTapping() {
        if (this.palmTapDetector === undefined) {
            return {
                state: "unsupported"
            };
        }
        else {
            return {
                state: "available",
                data: {
                    isTapping: this.palmTapDetector.isTapping
                }
            };
        }
    }
    /**
     * Set if the hand's pinch detector should use filtered events or not.
     */
    set useFilteredPinch(useFilteredPinch) {
        if (useFilteredPinch === this.pinchDetector.useFilteredPinch) {
            return;
        }
        this.pinchDetector.useFilteredPinch = useFilteredPinch;
    }
    /**
     * Returns if the hand's pinch detector should use filtered events or not.
     */
    get useFilteredPinch() {
        return this.pinchDetector.useFilteredPinch;
    }
    getPinchStrength() {
        if (!this.isTracked()) {
            return null;
        }
        return this.pinchDetector.getPinchStrength();
    }
    /**
     * Sets the tracking mode for the hand.
     * @param trackingMode - The new mode.
     */
    setTrackingMode(trackingMode) {
        this.objectTracking3DComponent.trackingMode = trackingMode;
    }
    getHandVisuals() {
        if (this.handVisuals && !this.handVisuals.initialized) {
            this.handVisuals.initialize();
        }
        return this.handVisuals ?? null;
    }
    attachHandVisuals(handVisuals) {
        this.handVisuals = handVisuals;
    }
    initHandVisuals() {
        if (!this.handVisuals) {
            throw new Error("initHandVisuals called before attachHandVisuals");
        }
        this.objectTracking3DComponent.trackingMode = ObjectTracking3D.TrackingMode.ProportionsAndPose;
        (0, validate_1.validate)(this.handVisuals.root);
        this.handVisuals.root.setParent(this.ownerSceneObject);
        // Wrist
        this.wrist.addAttachmentPoint(this.handVisuals.wrist);
        // Thumb
        this.thumbToWrist.addAttachmentPoint(this.handVisuals.thumbToWrist);
        this.thumbBaseJoint.addAttachmentPoint(this.handVisuals.thumbBaseJoint);
        this.thumbKnuckle.addAttachmentPoint(this.handVisuals.thumbKnuckle);
        this.thumbMidJoint.addAttachmentPoint(this.handVisuals.thumbMidJoint);
        this.thumbTip.addAttachmentPoint(this.handVisuals.thumbTip);
        // Index
        this.indexToWrist.addAttachmentPoint(this.handVisuals.indexToWrist);
        this.indexKnuckle.addAttachmentPoint(this.handVisuals.indexKnuckle);
        this.indexMidJoint.addAttachmentPoint(this.handVisuals.indexMidJoint);
        this.indexUpperJoint.addAttachmentPoint(this.handVisuals.indexUpperJoint);
        this.indexTip.addAttachmentPoint(this.handVisuals.indexTip);
        // Middle
        this.middleToWrist.addAttachmentPoint(this.handVisuals.middleToWrist);
        this.middleKnuckle.addAttachmentPoint(this.handVisuals.middleKnuckle);
        this.middleMidJoint.addAttachmentPoint(this.handVisuals.middleMidJoint);
        this.middleUpperJoint.addAttachmentPoint(this.handVisuals.middleUpperJoint);
        this.middleTip.addAttachmentPoint(this.handVisuals.middleTip);
        // Ring
        this.ringToWrist.addAttachmentPoint(this.handVisuals.ringToWrist);
        this.ringKnuckle.addAttachmentPoint(this.handVisuals.ringKnuckle);
        this.ringMidJoint.addAttachmentPoint(this.handVisuals.ringMidJoint);
        this.ringUpperJoint.addAttachmentPoint(this.handVisuals.ringUpperJoint);
        this.ringTip.addAttachmentPoint(this.handVisuals.ringTip);
        // Pinky
        this.pinkyToWrist.addAttachmentPoint(this.handVisuals.pinkyToWrist);
        this.pinkyKnuckle.addAttachmentPoint(this.handVisuals.pinkyKnuckle);
        this.pinkyMidJoint.addAttachmentPoint(this.handVisuals.pinkyMidJoint);
        this.pinkyUpperJoint.addAttachmentPoint(this.handVisuals.pinkyUpperJoint);
        this.pinkyTip.addAttachmentPoint(this.handVisuals.pinkyTip);
    }
    detachHandVisuals(handVisuals) {
        if (this.handVisuals !== handVisuals) {
            return;
        }
        this.objectTracking3DComponent.trackingMode = ObjectTracking3D.TrackingMode.Attachment;
        this.keypoints.forEach((keypoint) => keypoint.clearAttachmentPoint());
        this.handVisuals = undefined;
    }
    /**
     * Destroys the hand and associated keypoints
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        this.ownerSceneObject.destroy();
        this.isDestroyed = true;
    }
    attachJoints(children) {
        for (const joint of children) {
            this.keypoints.set(joint.name, new Keypoint_1.Keypoint(joint.name, this.objectTracking3DComponent));
            this.attachJoints(joint.children);
        }
    }
    getKeypoint(landmarkName) {
        const keypoint = this.keypoints.get(landmarkName);
        if (!keypoint) {
            throw new Error(`Keypoint ${landmarkName} is not supported.`);
        }
        return keypoint;
    }
    setKeypointCollections() {
        this.thumbFingerPoints.push(this.thumbToWrist, this.thumbBaseJoint, this.thumbKnuckle, this.thumbMidJoint, this.thumbTip);
        this.indexFingerPoints.push(this.indexToWrist, this.indexKnuckle, this.indexMidJoint, this.indexUpperJoint, this.indexTip);
        this.middleFingerPoints.push(this.middleToWrist, this.middleKnuckle, this.middleMidJoint, this.middleUpperJoint, this.middleTip);
        this.ringFingerPoints.push(this.ringToWrist, this.ringKnuckle, this.ringMidJoint, this.ringUpperJoint, this.ringTip);
        this.pinkyFingerPoints.push(this.pinkyToWrist, this.pinkyKnuckle, this.pinkyMidJoint, this.pinkyUpperJoint, this.pinkyTip);
        this.allPoints.push(this.wrist, ...this.thumbFingerPoints, ...this.indexFingerPoints, ...this.middleFingerPoints, ...this.ringFingerPoints, ...this.pinkyFingerPoints);
    }
    rayToWorld(rayOriginInCameraRootSpace, rayDirectionInCameraRootSpace) {
        const cameraParent = this.cameraObject.getParent();
        if (!cameraParent) {
            return [rayOriginInCameraRootSpace, rayDirectionInCameraRootSpace];
        }
        const cameraRoot = cameraParent.getTransform().getWorldTransform();
        const rayEndPointCameraRootSpace = rayOriginInCameraRootSpace.add(rayDirectionInCameraRootSpace);
        const rayOriginInWorld = cameraRoot.multiplyPoint(rayOriginInCameraRootSpace);
        const rayEndInWorld = cameraRoot.multiplyPoint(rayEndPointCameraRootSpace);
        const rayDirectionInWorld = rayEndInWorld.sub(rayOriginInWorld);
        return [rayOriginInWorld, rayDirectionInWorld];
    }
}
exports.default = TrackedHand;
//# sourceMappingURL=TrackedHand.js.map