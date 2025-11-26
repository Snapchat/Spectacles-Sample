"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandVisual = exports.HandVisualOverride = exports.HandVisualOverrideItem = exports.HandVisualOverrideType = exports.HandVisualSelection = exports.HandMeshType = void 0;
var __selfType = requireType("./HandVisual");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const HandInputData_1 = require("../../../Providers/HandInputData/HandInputData");
const LensConfig_1 = require("../../../Utils/LensConfig");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const SceneObjectUtils_1 = require("../../../Utils/SceneObjectUtils");
const validate_1 = require("../../../Utils/validate");
const GlowEffectView_1 = require("./GlowEffectView");
const TAG = "HandVisual";
var HandMeshType;
(function (HandMeshType) {
    HandMeshType["Full"] = "Full";
    HandMeshType["IndexThumb"] = "IndexThumb";
})(HandMeshType || (exports.HandMeshType = HandMeshType = {}));
var HandVisualSelection;
(function (HandVisualSelection) {
    HandVisualSelection["Default"] = "Default";
    HandVisualSelection["AlwaysOn"] = "AlwaysOn";
    HandVisualSelection["Occluder"] = "Occluder";
    HandVisualSelection["None"] = "None";
})(HandVisualSelection || (exports.HandVisualSelection = HandVisualSelection = {}));
var HandVisualOverrideType;
(function (HandVisualOverrideType) {
    HandVisualOverrideType[HandVisualOverrideType["ForcePinchVisual"] = 0] = "ForcePinchVisual";
    HandVisualOverrideType[HandVisualOverrideType["ForcePokeVisual"] = 1] = "ForcePokeVisual";
    HandVisualOverrideType[HandVisualOverrideType["DisablePinchVisual"] = 2] = "DisablePinchVisual";
    HandVisualOverrideType[HandVisualOverrideType["DisablePokeVisual"] = 3] = "DisablePokeVisual";
    HandVisualOverrideType[HandVisualOverrideType["PinchDistanceOverride"] = 4] = "PinchDistanceOverride";
    HandVisualOverrideType[HandVisualOverrideType["PokeDistanceOverride"] = 5] = "PokeDistanceOverride";
})(HandVisualOverrideType || (exports.HandVisualOverrideType = HandVisualOverrideType = {}));
class HandVisualOverrideItem {
}
exports.HandVisualOverrideItem = HandVisualOverrideItem;
class HandVisualOverride {
}
exports.HandVisualOverride = HandVisualOverride;
class frustumVec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
const HAND_MODEL_INDEX = 0;
const HAND_MESH_INDEX_THUMB_INDEX = 1;
const HAND_MESH_FULL_INDEX = 2;
const HAND_MESH_PIN_INDEX = 3;
/**
 * This class provides a visual representation of the hand, with the ability to automatically wire joints to the hand
 * mesh. It also provides the ability to add a radial gradient occlusion effect and a glow effect to the hand mesh.
 */
let HandVisual = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var HandVisual = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.debugModeEnabled = this.debugModeEnabled;
            /**
             * Specifies which hand (Left or Right) this visual representation tracks and renders.
             */
            this.handType = this.handType;
            this._meshType = this._meshType;
            /**
             * Sets the hand visual style. "Default" shows glowing fingertips during interactions. "AlwaysOn" always shows
             * glowing fingertips. "Occluder" blocks content behind the hand. "None" disables all hand visuals.
             */
            this.selectVisual = this.selectVisual;
            /**
             * Reference to the HandInteractor component that provides gesture recognition and tracking for this hand.
             */
            this.handInteractor = this.handInteractor;
            /**
             * Reference to the RenderMeshVisual of the full hand mesh.
             */
            this.handMeshFull = this.handMeshFull;
            /**
             * Reference to the RenderMeshVisual of the hand mesh with only an index & thumb for efficiency.
             */
            this.handMeshIndexThumb = this.handMeshIndexThumb;
            /**
             * Reference to the RenderMeshVisual of the full hand mesh to pin SceneObjects to.
             */
            this.handMeshPin = this.handMeshPin;
            /**
             * Sets the rendering priority of the handMesh. Higher values (e.g., 9999) make the hand render on top of objects
             * with lower values.
             */
            this.handMeshRenderOrder = this.handMeshRenderOrder;
            /** @inheritdoc */
            this.root = this.root;
            /**
             * When enabled, the system will automatically map tracking data to the hand model's joints. Disable only if you
             * need manual control over individual joint assignments.
             */
            this.autoJointMapping = this.autoJointMapping;
            this.wrist = this.wrist;
            this.thumbToWrist = this.thumbToWrist;
            this.thumbBaseJoint = this.thumbBaseJoint;
            this.thumbKnuckle = this.thumbKnuckle;
            this.thumbMidJoint = this.thumbMidJoint;
            this.thumbTip = this.thumbTip;
            this.indexToWrist = this.indexToWrist;
            this.indexKnuckle = this.indexKnuckle;
            this.indexMidJoint = this.indexMidJoint;
            this.indexUpperJoint = this.indexUpperJoint;
            this.indexTip = this.indexTip;
            this.middleToWrist = this.middleToWrist;
            this.middleKnuckle = this.middleKnuckle;
            this.middleMidJoint = this.middleMidJoint;
            this.middleUpperJoint = this.middleUpperJoint;
            this.middleTip = this.middleTip;
            this.ringToWrist = this.ringToWrist;
            this.ringKnuckle = this.ringKnuckle;
            this.ringMidJoint = this.ringMidJoint;
            this.ringUpperJoint = this.ringUpperJoint;
            this.ringTip = this.ringTip;
            this.pinkyToWrist = this.pinkyToWrist;
            this.pinkyKnuckle = this.pinkyKnuckle;
            this.pinkyMidJoint = this.pinkyMidJoint;
            this.pinkyUpperJoint = this.pinkyUpperJoint;
            this.pinkyTip = this.pinkyTip;
            this.unitPlaneMesh = this.unitPlaneMesh;
            /**
             * The material which will be manipulated to create the glow effect.
             */
            this.tipGlowMaterial = this.tipGlowMaterial;
            /**
             * The render order of the quad on which the tip glow effect occurs.
             */
            this.tipGlowRenderOrder = this.tipGlowRenderOrder;
            /**
             * The world scale of the quad on which the tip glow effect occurs.
             */
            this.tipGlowWorldScale = this.tipGlowWorldScale;
            /**
             * The color the glow will be when you are not pinching/poking.
             */
            this.hoverColor = this.hoverColor;
            /**
             * The color the glow will be when you are pinching/poking.
             */
            this.triggerColor = this.triggerColor;
            /**
             * Duration in seconds for transitioning between normal and triggered visual states.
             */
            this.triggeredLerpDurationSeconds = this.triggeredLerpDurationSeconds;
            /**
             * Duration in seconds for transitioning pinch effects when acquiring or losing valid targets.
             */
            this.pinchValidLerpDurationSeconds = this.pinchValidLerpDurationSeconds;
            /**
             * Duration in seconds for transitioning poke effects when acquiring or losing valid targets.
             */
            this.pokeValidLerpDurationSeconds = this.pokeValidLerpDurationSeconds;
            this.pinchBrightnessMax = this.pinchBrightnessMax;
            /**
             * Maximum brightness value for the pinch glow's outer radial effect.
             */
            this.pinchGlowBrightnessMax = this.pinchGlowBrightnessMax;
            /**
             * Multiplier applied to pinchBrightnessMax when user is actively pinching.
             */
            this.pinchTriggeredMult = this.pinchTriggeredMult;
            /**
             * The pinch strength threshold at which maximum brightness is reached.
             */
            this.pinchBrightnessMaxStrength = this.pinchBrightnessMaxStrength;
            /**
             * Default value for the pinch exponent uniform when not actively pinching.
             */
            this.pinchExponent = this.pinchExponent;
            /**
             * Target value for the pinch exponent uniform when actively pinching.
             */
            this.pinchExponentTriggered = this.pinchExponentTriggered;
            /**
             * Distance in cm at which pinch highlighting effects begin to fade in.
             */
            this.pinchHighlightThresholdFar = this.pinchHighlightThresholdFar;
            /**
             * Distance in cm at which pinch highlighting effects reach maximum intensity.
             */
            this.pinchHighlightThresholdNear = this.pinchHighlightThresholdNear;
            this.pokeBrightnessMax = this.pokeBrightnessMax;
            /**
             * Maximum brightness value for the poke glow's outer radial effect.
             */
            this.pokeGlowBrightnessMax = this.pokeGlowBrightnessMax;
            /**
             * Multiplier applied to pokeBrightnessMax when user is actively poking.
             */
            this.pokeTriggeredMult = this.pokeTriggeredMult;
            /**
             * Distance in cm at which poke highlighting effects begin to fade in.
             */
            this.pokeHighlightThresholdFar = this.pokeHighlightThresholdFar;
            /**
             * Distance in cm at which poke highlighting effects reach maximum intensity.
             */
            this.pokeHighlightThresholdNear = this.pokeHighlightThresholdNear;
            /**
             * Distance in cm at which poke occlusion effects begin to fade in.
             */
            this.pokeOccludeThresholdFar = this.pokeOccludeThresholdFar;
            /**
             * Distance in cm at which poke occlusion effects reach maximum intensity.
             */
            this.pokeOccludeThresholdNear = this.pokeOccludeThresholdNear;
            /**
             * Default value for the poke exponent uniform when not actively poking.
             */
            this.pokeExponent = this.pokeExponent;
            /**
             * Target value for the poke exponent uniform when actively poking.
             */
            this.pokeExponentTriggered = this.pokeExponentTriggered;
            this.handOccluderMaterial = this.handOccluderMaterial;
            this.overrides = this.overrides;
            this.overrideMap = new Map();
            // Dependencies
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this._isVisible = true;
            this._handVisualSelection = this.selectVisual;
            this._handMeshDefaultMaterialFull = null;
            this._handMeshDefaultMaterialIndexThumb = null;
            this.initialized = false;
            this._isHandAvailable = false;
            this._isPhoneInHand = false;
            this.frustumCull = {
                NUM_FULL_POSITIONS: 11,
                NUM_INDEX_THUMB_POSITIONS: 5,
                localMin: new frustumVec3(Infinity, Infinity, Infinity),
                localMax: new frustumVec3(-Infinity, -Infinity, -Infinity),
                isLeftHand: this.handType === "left",
                handPositions: [],
                frustumCullMin: new vec3(0, 0, 0),
                frustumCullMax: new vec3(0, 0, 0)
            };
            this.log = new NativeLogger_1.default(TAG);
        }
        __initialize() {
            super.__initialize();
            this.debugModeEnabled = this.debugModeEnabled;
            /**
             * Specifies which hand (Left or Right) this visual representation tracks and renders.
             */
            this.handType = this.handType;
            this._meshType = this._meshType;
            /**
             * Sets the hand visual style. "Default" shows glowing fingertips during interactions. "AlwaysOn" always shows
             * glowing fingertips. "Occluder" blocks content behind the hand. "None" disables all hand visuals.
             */
            this.selectVisual = this.selectVisual;
            /**
             * Reference to the HandInteractor component that provides gesture recognition and tracking for this hand.
             */
            this.handInteractor = this.handInteractor;
            /**
             * Reference to the RenderMeshVisual of the full hand mesh.
             */
            this.handMeshFull = this.handMeshFull;
            /**
             * Reference to the RenderMeshVisual of the hand mesh with only an index & thumb for efficiency.
             */
            this.handMeshIndexThumb = this.handMeshIndexThumb;
            /**
             * Reference to the RenderMeshVisual of the full hand mesh to pin SceneObjects to.
             */
            this.handMeshPin = this.handMeshPin;
            /**
             * Sets the rendering priority of the handMesh. Higher values (e.g., 9999) make the hand render on top of objects
             * with lower values.
             */
            this.handMeshRenderOrder = this.handMeshRenderOrder;
            /** @inheritdoc */
            this.root = this.root;
            /**
             * When enabled, the system will automatically map tracking data to the hand model's joints. Disable only if you
             * need manual control over individual joint assignments.
             */
            this.autoJointMapping = this.autoJointMapping;
            this.wrist = this.wrist;
            this.thumbToWrist = this.thumbToWrist;
            this.thumbBaseJoint = this.thumbBaseJoint;
            this.thumbKnuckle = this.thumbKnuckle;
            this.thumbMidJoint = this.thumbMidJoint;
            this.thumbTip = this.thumbTip;
            this.indexToWrist = this.indexToWrist;
            this.indexKnuckle = this.indexKnuckle;
            this.indexMidJoint = this.indexMidJoint;
            this.indexUpperJoint = this.indexUpperJoint;
            this.indexTip = this.indexTip;
            this.middleToWrist = this.middleToWrist;
            this.middleKnuckle = this.middleKnuckle;
            this.middleMidJoint = this.middleMidJoint;
            this.middleUpperJoint = this.middleUpperJoint;
            this.middleTip = this.middleTip;
            this.ringToWrist = this.ringToWrist;
            this.ringKnuckle = this.ringKnuckle;
            this.ringMidJoint = this.ringMidJoint;
            this.ringUpperJoint = this.ringUpperJoint;
            this.ringTip = this.ringTip;
            this.pinkyToWrist = this.pinkyToWrist;
            this.pinkyKnuckle = this.pinkyKnuckle;
            this.pinkyMidJoint = this.pinkyMidJoint;
            this.pinkyUpperJoint = this.pinkyUpperJoint;
            this.pinkyTip = this.pinkyTip;
            this.unitPlaneMesh = this.unitPlaneMesh;
            /**
             * The material which will be manipulated to create the glow effect.
             */
            this.tipGlowMaterial = this.tipGlowMaterial;
            /**
             * The render order of the quad on which the tip glow effect occurs.
             */
            this.tipGlowRenderOrder = this.tipGlowRenderOrder;
            /**
             * The world scale of the quad on which the tip glow effect occurs.
             */
            this.tipGlowWorldScale = this.tipGlowWorldScale;
            /**
             * The color the glow will be when you are not pinching/poking.
             */
            this.hoverColor = this.hoverColor;
            /**
             * The color the glow will be when you are pinching/poking.
             */
            this.triggerColor = this.triggerColor;
            /**
             * Duration in seconds for transitioning between normal and triggered visual states.
             */
            this.triggeredLerpDurationSeconds = this.triggeredLerpDurationSeconds;
            /**
             * Duration in seconds for transitioning pinch effects when acquiring or losing valid targets.
             */
            this.pinchValidLerpDurationSeconds = this.pinchValidLerpDurationSeconds;
            /**
             * Duration in seconds for transitioning poke effects when acquiring or losing valid targets.
             */
            this.pokeValidLerpDurationSeconds = this.pokeValidLerpDurationSeconds;
            this.pinchBrightnessMax = this.pinchBrightnessMax;
            /**
             * Maximum brightness value for the pinch glow's outer radial effect.
             */
            this.pinchGlowBrightnessMax = this.pinchGlowBrightnessMax;
            /**
             * Multiplier applied to pinchBrightnessMax when user is actively pinching.
             */
            this.pinchTriggeredMult = this.pinchTriggeredMult;
            /**
             * The pinch strength threshold at which maximum brightness is reached.
             */
            this.pinchBrightnessMaxStrength = this.pinchBrightnessMaxStrength;
            /**
             * Default value for the pinch exponent uniform when not actively pinching.
             */
            this.pinchExponent = this.pinchExponent;
            /**
             * Target value for the pinch exponent uniform when actively pinching.
             */
            this.pinchExponentTriggered = this.pinchExponentTriggered;
            /**
             * Distance in cm at which pinch highlighting effects begin to fade in.
             */
            this.pinchHighlightThresholdFar = this.pinchHighlightThresholdFar;
            /**
             * Distance in cm at which pinch highlighting effects reach maximum intensity.
             */
            this.pinchHighlightThresholdNear = this.pinchHighlightThresholdNear;
            this.pokeBrightnessMax = this.pokeBrightnessMax;
            /**
             * Maximum brightness value for the poke glow's outer radial effect.
             */
            this.pokeGlowBrightnessMax = this.pokeGlowBrightnessMax;
            /**
             * Multiplier applied to pokeBrightnessMax when user is actively poking.
             */
            this.pokeTriggeredMult = this.pokeTriggeredMult;
            /**
             * Distance in cm at which poke highlighting effects begin to fade in.
             */
            this.pokeHighlightThresholdFar = this.pokeHighlightThresholdFar;
            /**
             * Distance in cm at which poke highlighting effects reach maximum intensity.
             */
            this.pokeHighlightThresholdNear = this.pokeHighlightThresholdNear;
            /**
             * Distance in cm at which poke occlusion effects begin to fade in.
             */
            this.pokeOccludeThresholdFar = this.pokeOccludeThresholdFar;
            /**
             * Distance in cm at which poke occlusion effects reach maximum intensity.
             */
            this.pokeOccludeThresholdNear = this.pokeOccludeThresholdNear;
            /**
             * Default value for the poke exponent uniform when not actively poking.
             */
            this.pokeExponent = this.pokeExponent;
            /**
             * Target value for the poke exponent uniform when actively poking.
             */
            this.pokeExponentTriggered = this.pokeExponentTriggered;
            this.handOccluderMaterial = this.handOccluderMaterial;
            this.overrides = this.overrides;
            this.overrideMap = new Map();
            // Dependencies
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this._isVisible = true;
            this._handVisualSelection = this.selectVisual;
            this._handMeshDefaultMaterialFull = null;
            this._handMeshDefaultMaterialIndexThumb = null;
            this.initialized = false;
            this._isHandAvailable = false;
            this._isPhoneInHand = false;
            this.frustumCull = {
                NUM_FULL_POSITIONS: 11,
                NUM_INDEX_THUMB_POSITIONS: 5,
                localMin: new frustumVec3(Infinity, Infinity, Infinity),
                localMax: new frustumVec3(-Infinity, -Infinity, -Infinity),
                isLeftHand: this.handType === "left",
                handPositions: [],
                frustumCullMin: new vec3(0, 0, 0),
                frustumCullMax: new vec3(0, 0, 0)
            };
            this.log = new NativeLogger_1.default(TAG);
        }
        /**
         * Gets the full hand mesh visual.
         * @deprecated directly access `handMeshFull`, `handMeshIndexThumb`, or `handMeshPin` instead.
         */
        get handMesh() {
            return this.handMeshFull;
        }
        /**
         * Gets the current mesh type being displayed
         */
        get meshType() {
            return this.activeHandMesh === this.handMeshFull ? HandMeshType.Full : HandMeshType.IndexThumb;
        }
        /**
         * Sets the mesh type to display (Full or IndexThumb)
         */
        set meshType(newMeshType) {
            if (this.activeHandMesh && this.activeHandMesh.sceneObject) {
                this.activeHandMesh.sceneObject.enabled = false;
            }
            this.activeHandMesh = newMeshType === HandMeshType.Full ? this.handMeshFull : this.handMeshIndexThumb;
            this.activeHandMesh.setRenderOrder(this.handMeshRenderOrder);
        }
        /**
         * Sets the selection of the hand visual to present to user
         */
        set visualSelection(selection) {
            this._handVisualSelection = selection;
            const isOccluder = selection === HandVisualSelection.Occluder;
            if (this._handMeshDefaultMaterialFull) {
                this.handMeshFull.mainMaterial = isOccluder ? this.handOccluderMaterial : this._handMeshDefaultMaterialFull;
            }
            if (this._handMeshDefaultMaterialIndexThumb) {
                this.handMeshIndexThumb.mainMaterial = isOccluder
                    ? this.handOccluderMaterial
                    : this._handMeshDefaultMaterialIndexThumb;
            }
            this.glowEffectView?.setVisualSelection(selection);
        }
        /**
         * @returns the current selection of the hand visual to present to user
         */
        get visualSelection() {
            return this._handVisualSelection;
        }
        /**
         * Determines if the hand visual is visible based on tracking and phone-in-hand status.
         *
         * @returns {boolean} True if the hand is available and the phone is not in hand, otherwise false.
         */
        get isHandVisibleByStatus() {
            return this._isHandAvailable && !this._isPhoneInHand;
        }
        /**
         * Gets whether the hand visual is visible. When false, all hand visual components (mesh, glow effects, and wrist) will not be shown regardless of tracking status.
         */
        get isVisible() {
            return this._isVisible;
        }
        /**
         * Sets whether the hand visual is visible. When false, all hand visual components (mesh, glow effects, and wrist) will not be shown regardless of tracking status.
         */
        set isVisible(value) {
            this._isVisible = value;
        }
        /**
         * Gets the glow effect view that provides visual feedback for hand interactions.
         */
        get glowEffectView() {
            return this._glowEffectView;
        }
        defineScriptEvents() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
            this.createEvent("OnEnableEvent").bind(() => {
                this.defineOnEnableBehavior();
            });
            this.createEvent("OnDisableEvent").bind(() => {
                this.defineOnDisableBehavior();
            });
            this.createEvent("OnDestroyEvent").bind(() => {
                this.defineOnDestroyBehavior();
            });
        }
        defineOnEnableBehavior() {
            this._isVisible = true;
        }
        defineOnDisableBehavior() {
            this._isVisible = false;
        }
        defineOnDestroyBehavior() {
            if (this.glowEffectView !== undefined) {
                this.glowEffectView.destroy();
            }
            this.hand?.detachHandVisuals(this);
        }
        defineHandEvents() {
            (0, validate_1.validate)(this.hand);
            this.hand.onHandFound.add(() => {
                this._isHandAvailable = true;
            });
            this.hand.onHandLost.add(() => {
                this._isHandAvailable = false;
            });
            this.hand.onPhoneInHandBegin.add(() => {
                this._isPhoneInHand = true;
            });
            this.hand.onPhoneInHandEnd.add(() => {
                this._isPhoneInHand = false;
            });
        }
        getJointSceneObject(targetSceneObjectName, root) {
            const sceneObject = (0, SceneObjectUtils_1.findSceneObjectByName)(root, targetSceneObjectName);
            if (sceneObject === null) {
                throw new Error(`${targetSceneObjectName} could not be found in children of SceneObject: ${this.root?.name}`);
            }
            return sceneObject;
        }
        onAwake() {
            this.fillOverrideMapFromArray();
            if (this.handType !== "right") {
                this.hand = this.handProvider.getHand("left");
            }
            else {
                this.hand = this.handProvider.getHand("right");
            }
            this.hand.attachHandVisuals(this);
            const handModel = this.sceneObject.getChild(HAND_MODEL_INDEX);
            if (handModel.children.length <= HAND_MESH_FULL_INDEX) {
                this.log.f(`Outdated HandVisual SceneObject detected. Please click on the SpectaclesInteractionKit SceneObject in the` +
                    ` Scene Hierarchy, then click Revert in the Inspector Panel.`);
            }
            // If handMeshFull and handMeshIndexThumb are not provided via script input, programmatically retrieve them.
            if (this.handMeshFull === undefined) {
                this.handMeshFull = handModel.getChild(HAND_MESH_FULL_INDEX).getComponent("RenderMeshVisual");
            }
            if (this.handMeshIndexThumb === undefined) {
                this.handMeshIndexThumb = handModel.getChild(HAND_MESH_INDEX_THUMB_INDEX).getComponent("RenderMeshVisual");
            }
            // For the left hand only, if handMeshPin is not provided via script input, programmatically retrieve it.
            if (this.handType === "left" && this.handMeshPin === undefined) {
                this.handMeshPin = handModel.getChild(HAND_MESH_PIN_INDEX).getComponent("RenderMeshVisual");
            }
            if (this.handMeshFull) {
                this._handMeshDefaultMaterialFull = this.handMeshFull.mainMaterial;
            }
            if (this.handMeshIndexThumb) {
                this._handMeshDefaultMaterialIndexThumb = this.handMeshIndexThumb.mainMaterial;
            }
            this.defineHandEvents();
            this.defineScriptEvents();
            this.meshType = this._meshType;
            if (this.handMeshFull && this.handMeshFull.mainMaterial) {
                const mainMaterial = this.handMeshFull.mainMaterial;
                for (let i = 0; i < mainMaterial.getPassCount(); i++) {
                    const pass = mainMaterial.getPass(i);
                    pass.frustumCullMode = FrustumCullMode.UserDefinedAABB;
                    pass.frustumCullMin = new vec3(-1, -1, -1);
                    pass.frustumCullMax = new vec3(1, 1, 1);
                }
            }
            if (this.handMeshIndexThumb && this.handMeshIndexThumb.mainMaterial) {
                const mainMaterial = this.handMeshIndexThumb.mainMaterial;
                for (let i = 0; i < mainMaterial.getPassCount(); i++) {
                    const pass = mainMaterial.getPass(i);
                    pass.frustumCullMode = FrustumCullMode.UserDefinedAABB;
                    pass.frustumCullMin = new vec3(-1, -1, -1);
                    pass.frustumCullMax = new vec3(1, 1, 1);
                }
            }
            this.frustumCull.handPositions = Array.from({ length: Math.max(this.frustumCull.NUM_FULL_POSITIONS, this.frustumCull.NUM_INDEX_THUMB_POSITIONS) }, () => new frustumVec3());
            const updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
            updateDispatcher.createUpdateEvent("HandVisualUpdateEvent").bind(() => this.onUpdate());
        }
        initialize() {
            if (this.initialized) {
                return;
            }
            (0, validate_1.validate)(this.hand);
            this.wrist = this.autoJointMapping ? this.getJointSceneObject("wrist", this.root) : this.wrist;
            this.thumbToWrist = this.autoJointMapping
                ? this.getJointSceneObject("wrist_to_thumb", this.root)
                : this.thumbToWrist;
            this.thumbBaseJoint = this.autoJointMapping ? this.getJointSceneObject("thumb-0", this.root) : this.thumbBaseJoint;
            this.thumbKnuckle = this.autoJointMapping ? this.getJointSceneObject("thumb-1", this.root) : this.thumbKnuckle;
            this.thumbMidJoint = this.autoJointMapping ? this.getJointSceneObject("thumb-2", this.root) : this.thumbMidJoint;
            this.thumbTip = this.autoJointMapping ? this.getJointSceneObject("thumb-3", this.root) : this.thumbTip;
            this.indexToWrist = this.autoJointMapping
                ? this.getJointSceneObject("wrist_to_index", this.root)
                : this.indexToWrist;
            this.indexKnuckle = this.autoJointMapping ? this.getJointSceneObject("index-0", this.root) : this.indexKnuckle;
            this.indexMidJoint = this.autoJointMapping ? this.getJointSceneObject("index-1", this.root) : this.indexMidJoint;
            this.indexUpperJoint = this.autoJointMapping ? this.getJointSceneObject("index-2", this.root) : this.indexUpperJoint;
            this.indexTip = this.autoJointMapping ? this.getJointSceneObject("index-3", this.root) : this.indexTip;
            this.middleToWrist = this.autoJointMapping
                ? this.getJointSceneObject("wrist_to_mid", this.root)
                : this.middleToWrist;
            this.middleKnuckle = this.autoJointMapping ? this.getJointSceneObject("mid-0", this.root) : this.middleKnuckle;
            this.middleMidJoint = this.autoJointMapping ? this.getJointSceneObject("mid-1", this.root) : this.middleMidJoint;
            this.middleUpperJoint = this.autoJointMapping ? this.getJointSceneObject("mid-2", this.root) : this.middleUpperJoint;
            this.middleTip = this.autoJointMapping ? this.getJointSceneObject("mid-3", this.root) : this.middleTip;
            this.ringToWrist = this.autoJointMapping ? this.getJointSceneObject("wrist_to_ring", this.root) : this.ringToWrist;
            this.ringKnuckle = this.autoJointMapping ? this.getJointSceneObject("ring-0", this.root) : this.ringKnuckle;
            this.ringMidJoint = this.autoJointMapping ? this.getJointSceneObject("ring-1", this.root) : this.ringMidJoint;
            this.ringUpperJoint = this.autoJointMapping ? this.getJointSceneObject("ring-2", this.root) : this.ringUpperJoint;
            this.ringTip = this.autoJointMapping ? this.getJointSceneObject("ring-3", this.root) : this.ringTip;
            this.pinkyToWrist = this.autoJointMapping
                ? this.getJointSceneObject("wrist_to_pinky", this.root)
                : this.pinkyToWrist;
            this.pinkyKnuckle = this.autoJointMapping ? this.getJointSceneObject("pinky-0", this.root) : this.pinkyKnuckle;
            this.pinkyMidJoint = this.autoJointMapping ? this.getJointSceneObject("pinky-1", this.root) : this.pinkyMidJoint;
            this.pinkyUpperJoint = this.autoJointMapping ? this.getJointSceneObject("pinky-2", this.root) : this.pinkyUpperJoint;
            this.pinkyTip = this.autoJointMapping ? this.getJointSceneObject("pinky-3", this.root) : this.pinkyTip;
            this.initialized = true;
            this.hand.initHandVisuals();
            this._glowEffectView = new GlowEffectView_1.GlowEffectView({
                debugModeEnabled: this.debugModeEnabled,
                handVisuals: this,
                handType: this.handType,
                unitPlaneMesh: this.unitPlaneMesh,
                handInteractor: this.handInteractor,
                handVisualSelection: this._handVisualSelection,
                style: {
                    hoverColor: this.hoverColor,
                    triggerColor: this.triggerColor,
                    tipGlowMaterial: this.tipGlowMaterial,
                    pinchBrightnessMax: this.pinchBrightnessMax,
                    pinchGlowBrightnessMax: this.pinchGlowBrightnessMax,
                    pinchBrightnessMaxStrength: this.pinchBrightnessMaxStrength,
                    pinchTriggeredMult: this.pinchTriggeredMult,
                    pinchExponent: this.pinchExponent,
                    pinchExponentTriggered: this.pinchExponentTriggered,
                    pinchHighlightThresholdFar: this.pinchHighlightThresholdFar,
                    pinchHighlightThresholdNear: this.pinchHighlightThresholdNear,
                    pokeBrightnessMax: this.pokeBrightnessMax,
                    pokeGlowBrightnessMax: this.pokeGlowBrightnessMax,
                    pokeTriggeredMult: this.pokeTriggeredMult,
                    pokeHighlightThresholdFar: this.pokeHighlightThresholdFar,
                    pokeHighlightThresholdNear: this.pokeHighlightThresholdNear,
                    pokeOccludeThresholdFar: this.pokeOccludeThresholdFar,
                    pokeOccludeThresholdNear: this.pokeOccludeThresholdNear,
                    pokeExponent: this.pokeExponent,
                    pokeExponentTriggered: this.pokeExponentTriggered,
                    tipGlowRenderOrder: this.tipGlowRenderOrder,
                    tipGlowWorldScale: this.tipGlowWorldScale,
                    triggeredLerpDurationSeconds: this.triggeredLerpDurationSeconds,
                    pinchValidLerpDurationSeconds: this.pinchValidLerpDurationSeconds,
                    pokeValidLerpDurationSeconds: this.pokeValidLerpDurationSeconds
                }
            });
            this.visualSelection = this._handVisualSelection;
        }
        /**
         * Adds a hand visual override for a specific interactable.
         * @param override - The HandVisualOverride to add.
         */
        addOverride(override) {
            this.overrideMap.set(override.interactableSceneObject, override);
        }
        /**
         * Removes a hand visual override by its unique ID.
         * @param id - The ID of the override to remove.
         * @returns True if removed, false if not found.
         */
        removeOverride(interactableObject) {
            const override = this.overrideMap.get(interactableObject);
            if (!override) {
                return false;
            }
            this.overrideMap.delete(interactableObject);
            return true;
        }
        fillOverrideMapFromArray() {
            for (const override of this.overrides) {
                if (override.interactableSceneObject) {
                    this.overrideMap.set(override.interactableSceneObject, override);
                }
            }
        }
        onUpdate() {
            this.updateFrustumCulling();
            this.updateVisualsEnabledState();
        }
        updateVisualsEnabledState() {
            const isNoneSelection = this.visualSelection === HandVisualSelection.None;
            const isGloballyVisible = this._isVisible && this.isHandVisibleByStatus && !isNoneSelection;
            if (this.wrist && this.wrist.enabled !== isGloballyVisible) {
                this.wrist.enabled = isGloballyVisible;
            }
            if (!this.glowEffectView) {
                const isVisible = isGloballyVisible && this.visualSelection !== HandVisualSelection.Occluder;
                if (this.handMeshFull.sceneObject.enabled !== isVisible) {
                    this.handMeshFull.sceneObject.enabled = isVisible;
                }
                if (this.handMeshIndexThumb.sceneObject.enabled !== isVisible) {
                    this.handMeshIndexThumb.sceneObject.enabled = isVisible;
                }
                return;
            }
            const finalMeshVisibility = isGloballyVisible && this.glowEffectView.isMeshVisibilityDesired;
            const finalIndexGlowVisibility = isGloballyVisible && this.glowEffectView.isIndexGlowVisible;
            const finalThumbGlowVisibility = isGloballyVisible && this.glowEffectView.isThumbGlowVisible;
            const showFullMesh = finalMeshVisibility && this.activeHandMesh === this.handMeshFull;
            const showIndexThumbMesh = finalMeshVisibility && this.activeHandMesh === this.handMeshIndexThumb;
            if (this.handMeshFull.sceneObject.enabled !== showFullMesh) {
                this.handMeshFull.sceneObject.enabled = showFullMesh;
            }
            if (this.handMeshIndexThumb.sceneObject.enabled !== showIndexThumbMesh) {
                this.handMeshIndexThumb.sceneObject.enabled = showIndexThumbMesh;
            }
            const indexGlowObject = this.glowEffectView.indexGlowSceneObject;
            if (indexGlowObject.enabled !== finalIndexGlowVisibility) {
                indexGlowObject.enabled = finalIndexGlowVisibility;
            }
            const thumbGlowObject = this.glowEffectView.thumbGlowSceneObject;
            if (thumbGlowObject.enabled !== finalThumbGlowVisibility) {
                thumbGlowObject.enabled = finalThumbGlowVisibility;
            }
        }
        updateFrustumCulling() {
            if (!this.activeHandMesh || !this.activeHandMesh.sceneObject.enabled) {
                return;
            }
            const hand = this.hand;
            const wrist = hand.wrist;
            const frustumCull = this.frustumCull;
            const wristPos = wrist.position;
            const wristRight = wrist.right;
            const wristUp = wrist.up;
            const wristForward = wrist.forward;
            const wristPosX = wristPos.x;
            const wristPosY = wristPos.y;
            const wristPosZ = wristPos.z;
            const wristRightX = wristRight.x;
            const wristRightY = wristRight.y;
            const wristRightZ = wristRight.z;
            const wristUpX = wristUp.x;
            const wristUpY = wristUp.y;
            const wristUpZ = wristUp.z;
            const wristForwardX = wristForward.x;
            const wristForwardY = wristForward.y;
            const wristForwardZ = wristForward.z;
            const handPositions = frustumCull.handPositions;
            handPositions[0] = hand.thumbKnuckle.position;
            handPositions[1] = hand.thumbTip.position;
            handPositions[2] = hand.indexKnuckle.position;
            handPositions[3] = hand.indexMidJoint.position;
            handPositions[4] = hand.indexTip.position;
            handPositions[5] = hand.wrist.position;
            handPositions[6] = hand.middleMidJoint.position;
            handPositions[7] = hand.middleTip.position;
            handPositions[8] = hand.ringTip.position;
            handPositions[9] = hand.pinkyKnuckle.position;
            handPositions[10] = hand.pinkyTip.position;
            const localMin = frustumCull.localMin;
            const localMax = frustumCull.localMax;
            const firstPos = handPositions[0];
            const firstRelX = firstPos.x - wristPosX;
            const firstRelY = firstPos.y - wristPosY;
            const firstRelZ = firstPos.z - wristPosZ;
            let minX = firstRelX * wristRightX + firstRelY * wristRightY + firstRelZ * wristRightZ;
            let minY = firstRelX * wristUpX + firstRelY * wristUpY + firstRelZ * wristUpZ;
            let minZ = firstRelX * wristForwardX + firstRelY * wristForwardY + firstRelZ * wristForwardZ;
            let maxX = minX;
            let maxY = minY;
            let maxZ = minZ;
            const isIndexThumbMesh = this.activeHandMesh === this.handMeshIndexThumb;
            const numPositionsToCheck = isIndexThumbMesh
                ? frustumCull.NUM_INDEX_THUMB_POSITIONS
                : frustumCull.NUM_FULL_POSITIONS;
            for (let i = 1; i < numPositionsToCheck; i++) {
                const worldPos = handPositions[i];
                const relX = worldPos.x - wristPosX;
                const relY = worldPos.y - wristPosY;
                const relZ = worldPos.z - wristPosZ;
                const localX = relX * wristRightX + relY * wristRightY + relZ * wristRightZ;
                const localY = relX * wristUpX + relY * wristUpY + relZ * wristUpZ;
                const localZ = relX * wristForwardX + relY * wristForwardY + relZ * wristForwardZ;
                if (localX < minX)
                    minX = localX;
                else if (localX > maxX)
                    maxX = localX;
                if (localY < minY)
                    minY = localY;
                else if (localY > maxY)
                    maxY = localY;
                if (localZ < minZ)
                    minZ = localZ;
                else if (localZ > maxZ)
                    maxZ = localZ;
            }
            const padding = 2.0;
            localMin.x = minX - padding;
            localMin.y = minY - padding;
            localMin.z = minZ - padding;
            localMax.x = maxX + padding;
            localMax.y = maxY + padding;
            localMax.z = maxZ + padding;
            const frustumCullMin = frustumCull.frustumCullMin;
            const frustumCullMax = frustumCull.frustumCullMax;
            const mainMaterial = this.activeHandMesh.mainMaterial;
            const passCount = mainMaterial.getPassCount();
            if (frustumCull.isLeftHand) {
                frustumCullMin.x = localMin.x;
                frustumCullMin.y = localMax.z * -1;
                frustumCullMin.z = localMin.y;
                frustumCullMax.x = localMax.x;
                frustumCullMax.y = localMin.z * -1;
                frustumCullMax.z = localMax.y;
                for (let i = 0; i < passCount; i++) {
                    const pass = mainMaterial.getPass(i);
                    pass.frustumCullMin = frustumCullMin;
                    pass.frustumCullMax = frustumCullMax;
                }
            }
            else {
                frustumCullMin.x = localMin.x;
                frustumCullMin.y = localMin.y;
                frustumCullMin.z = localMin.z;
                frustumCullMax.x = localMax.x;
                frustumCullMax.y = localMax.y;
                frustumCullMax.z = localMax.z;
                for (let i = 0; i < passCount; i++) {
                    const pass = mainMaterial.getPass(i);
                    pass.frustumCullMin = frustumCullMin;
                    pass.frustumCullMax = frustumCullMax;
                }
            }
            if (this.debugModeEnabled) {
                const actualMin = new vec3(frustumCullMin.x, frustumCullMin.y, frustumCullMin.z);
                const actualMax = new vec3(frustumCullMax.x, frustumCullMax.y, frustumCullMax.z);
                // Calculate center and extents in local space
                const localCenter = new vec3((actualMin.x + actualMax.x) * 0.5, (actualMin.y + actualMax.y) * 0.5, (actualMin.z + actualMax.z) * 0.5);
                const localExtents = new vec3((actualMax.x - actualMin.x) * 0.5, (actualMax.y - actualMin.y) * 0.5, (actualMax.z - actualMin.z) * 0.5);
                let worldCenter;
                if (frustumCull.isLeftHand) {
                    worldCenter = new vec3(wristPosX + localCenter.x * wristRightX + localCenter.z * wristUpX + -localCenter.y * wristForwardX, wristPosY + localCenter.x * wristRightY + localCenter.z * wristUpY + -localCenter.y * wristForwardY, wristPosZ + localCenter.x * wristRightZ + localCenter.z * wristUpZ + -localCenter.y * wristForwardZ);
                }
                else {
                    worldCenter = new vec3(wristPosX + localCenter.x * wristRightX + localCenter.y * wristUpX + localCenter.z * wristForwardX, wristPosY + localCenter.x * wristRightY + localCenter.y * wristUpY + localCenter.z * wristForwardY, wristPosZ + localCenter.x * wristRightZ + localCenter.y * wristUpZ + localCenter.z * wristForwardZ);
                }
                const corners = [
                    // Bottom face (min Z)
                    new vec3(-localExtents.x, -localExtents.y, -localExtents.z),
                    new vec3(+localExtents.x, -localExtents.y, -localExtents.z),
                    new vec3(+localExtents.x, +localExtents.y, -localExtents.z),
                    new vec3(-localExtents.x, +localExtents.y, -localExtents.z),
                    // Top face (max Z)
                    new vec3(-localExtents.x, -localExtents.y, +localExtents.z),
                    new vec3(+localExtents.x, -localExtents.y, +localExtents.z),
                    new vec3(+localExtents.x, +localExtents.y, +localExtents.z),
                    new vec3(-localExtents.x, +localExtents.y, +localExtents.z)
                ];
                // Transform all corners to world space
                const worldCorners = [];
                for (const corner of corners) {
                    let worldCorner;
                    if (frustumCull.isLeftHand) {
                        worldCorner = new vec3(worldCenter.x + corner.x * wristRightX + corner.z * wristUpX + -corner.y * wristForwardX, worldCenter.y + corner.x * wristRightY + corner.z * wristUpY + -corner.y * wristForwardY, worldCenter.z + corner.x * wristRightZ + corner.z * wristUpZ + -corner.y * wristForwardZ);
                    }
                    else {
                        worldCorner = new vec3(worldCenter.x + corner.x * wristRightX + corner.y * wristUpX + corner.z * wristForwardX, worldCenter.y + corner.x * wristRightY + corner.y * wristUpY + corner.z * wristForwardY, worldCenter.z + corner.x * wristRightZ + corner.y * wristUpZ + corner.z * wristForwardZ);
                    }
                    worldCorners.push(worldCorner);
                }
                const boxColor = new vec4(0, 1, 0.5, 1);
                // Bottom
                global.debugRenderSystem.drawLine(worldCorners[0], worldCorners[1], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[1], worldCorners[2], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[2], worldCorners[3], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[3], worldCorners[0], boxColor);
                // Top
                global.debugRenderSystem.drawLine(worldCorners[4], worldCorners[5], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[5], worldCorners[6], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[6], worldCorners[7], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[7], worldCorners[4], boxColor);
                // Sides
                global.debugRenderSystem.drawLine(worldCorners[0], worldCorners[4], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[1], worldCorners[5], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[2], worldCorners[6], boxColor);
                global.debugRenderSystem.drawLine(worldCorners[3], worldCorners[7], boxColor);
                const jointTransforms = [
                    hand.thumbKnuckle,
                    hand.thumbTip,
                    hand.indexKnuckle,
                    hand.indexMidJoint,
                    hand.indexTip,
                    hand.wrist,
                    hand.middleMidJoint,
                    hand.middleTip,
                    hand.ringTip,
                    hand.pinkyKnuckle,
                    hand.pinkyTip
                ];
                for (let i = 0; i < numPositionsToCheck; i++) {
                    const joint = jointTransforms[i];
                    const jointPos = joint.position;
                    const axisLength = 1.0;
                    const rightEnd = new vec3(jointPos.x + joint.right.x * axisLength, jointPos.y + joint.right.y * axisLength, jointPos.z + joint.right.z * axisLength);
                    global.debugRenderSystem.drawLine(jointPos, rightEnd, new vec4(1, 0, 0, 1));
                    const upEnd = new vec3(jointPos.x + joint.up.x * axisLength, jointPos.y + joint.up.y * axisLength, jointPos.z + joint.up.z * axisLength);
                    global.debugRenderSystem.drawLine(jointPos, upEnd, new vec4(0, 1, 0, 1));
                    const forwardEnd = new vec3(jointPos.x + joint.forward.x * axisLength, jointPos.y + joint.forward.y * axisLength, jointPos.z + joint.forward.z * axisLength);
                    global.debugRenderSystem.drawLine(jointPos, forwardEnd, new vec4(0, 0, 1, 1));
                }
            }
        }
    };
    __setFunctionName(_classThis, "HandVisual");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HandVisual = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HandVisual = _classThis;
})();
exports.HandVisual = HandVisual;
//# sourceMappingURL=HandVisual.js.map