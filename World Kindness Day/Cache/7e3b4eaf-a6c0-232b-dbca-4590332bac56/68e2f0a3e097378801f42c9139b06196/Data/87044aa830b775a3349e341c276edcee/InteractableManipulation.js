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
exports.InteractableManipulation = exports.RotationAxis = void 0;
var __selfType = requireType("./InteractableManipulation");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const Event_1 = require("../../../Utils/Event");
const OneEuroFilter_1 = require("../../../Utils/OneEuroFilter");
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const StateMachine_1 = require("../../../Utils/StateMachine");
const SyncKitBridge_1 = require("../../../Utils/SyncKitBridge");
const validate_1 = require("../../../Utils/validate");
const ContainerFrame_1 = require("../../UI/ContainerFrame/ContainerFrame");
const Interactable_1 = require("../Interactable/Interactable");
var RotationAxis;
(function (RotationAxis) {
    RotationAxis["All"] = "All";
    RotationAxis["X"] = "X";
    RotationAxis["Y"] = "Y";
    RotationAxis["Z"] = "Z";
})(RotationAxis || (exports.RotationAxis = RotationAxis = {}));
const TAG = "InteractableManipulation";
const MOBILE_DRAG_MULTIPLIER = 0.5;
const STRETCH_SMOOTH_SPEED = 15;
const YAW_NEGATIVE_90 = quat.fromEulerAngles(0, -90, 0);
const MAX_USER_ARM_EXTENSION_CM = 100;
const MIN_DRAG_DISTANCE_CM = 0.0001; // Setting this > 0 to avoid division by 0
const MANIPULATION_VALUE_KEY = "ManipulationValue";
const CachedTransform = {
    transform: mat4.identity(),
    position: vec3.zero(),
    rotation: quat.quatIdentity(),
    scale: vec3.one()
};
/**
 * This class provides manipulation capabilities for interactable objects, including translation, rotation, and
 * scaling. It allows configuration of the manipulation root, scale limits, and rotation axes.
 */
let InteractableManipulation = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractableManipulation = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.manipulateRootSceneObject = this.manipulateRootSceneObject;
            /**
             * The smallest this object can scale down to, relative to its original scale.
             * A value of 0.5 means it cannot scale smaller than 50% of its original size.
             */
            this.minimumScaleFactor = this.minimumScaleFactor;
            /**
             * The largest this object can scale up to, relative to its original scale.
             * A value of 2 means it cannot scale larger than twice its original size.
             */
            this.maximumScaleFactor = this.maximumScaleFactor;
            /**
             * Controls whether the object can be moved (translated) in space.
             */
            this.enableTranslation = this.enableTranslation;
            /**
             * Controls whether the object can be rotated in space.
             */
            this.enableRotation = this.enableRotation;
            /**
             * Controls whether the object can be scaled in size.
             */
            this.enableScale = this.enableScale;
            /**
             * Enhances depth manipulation by applying a distance-based multiplier to Z-axis movement.
             * When enabled, objects that are farther away will move greater distances with the same hand movement,
             * making it easier to position distant objects without requiring excessive physical reach.
             */
            this.enableStretchZ = this.enableStretchZ;
            /**
             * Controls the visibility of advanced Z-stretch configuration options in the Inspector. When enabled, shows
             * additional properties that fine-tune the distance-based Z-axis movement multiplier (Z Stretch Factor Min and
             * Z Stretch Factor Max).
             */
            this.showStretchZProperties = this.showStretchZProperties;
            /**
             * The minimum multiplier applied to Z-axis movement when using stretch mode.
             * This value is used when objects are close to the user.
             * Higher values result in more responsive depth movement for nearby objects.
             */
            this.zStretchFactorMin = this.zStretchFactorMin;
            /**
             * The maximum multiplier applied to Z-axis movement when using stretch mode.
             * This value is used when objects are far away from the user.
             * Higher values allow faster positioning of distant objects with minimal hand movement.
             */
            this.zStretchFactorMax = this.zStretchFactorMax;
            /**
             * Applies filtering to smooth object manipulation movement. When enabled, a one-euro filter is applied to reduce
             * jitter and make translations, rotations, and scaling appear more stable and natural. Disable for immediate
             * 1:1 response to hand movements.
             */
            this.useFilter = this.useFilter;
            /**
             * Controls the visibility of advanced filtering options in the Inspector. When enabled, shows additional
             * properties for fine-tuning the one-euro filter (minCutoff, beta, dcutoff) that smooths object manipulation.
             */
            this.showFilterProperties = this.showFilterProperties;
            /**
             * Minimum cutoff frequency of the one-euro filter.
             * Lower values reduce jitter during slow movements but increase lag.
             * Adjust this parameter first with beta=0 to find a balance that removes jitter
             * while maintaining acceptable responsiveness during slow movements.
             */
            this.minCutoff = this.minCutoff;
            /**
             * Speed coefficient of the one-euro filter.
             * Higher values reduce lag during fast movements but may increase jitter.
             * Adjust this parameter after setting minCutoff to minimize lag during quick movements.
             */
            this.beta = this.beta;
            /**
             * Derivative cutoff frequency for the one-euro filter.
             * Controls how the filter responds to changes in movement speed.
             * Higher values make the filter more responsive to velocity changes.
             */
            this.dcutoff = this.dcutoff;
            /**
             * Controls the visibility of translation options in the Inspector.
             */
            this.showTranslationProperties = this.showTranslationProperties;
            /**
             * Enables translation along the world's X-axis.
             */
            this._enableXTranslation = this._enableXTranslation;
            /**
             * Enables translation along the world's Y-axis.
             */
            this._enableYTranslation = this._enableYTranslation;
            /**
             * Enables translation along the world's Z-axis.
             */
            this._enableZTranslation = this._enableZTranslation;
            /**
             * Controls the visibility of rotation options in the Inspector.
             */
            this.showRotationProperties = this.showRotationProperties;
            /**
             * Controls which axes the object can rotate around. "All" allows free rotation in any direction, while "X",
             * "Y", or "Z" constrains rotation to only that specific world axis.
             */
            this._rotationAxis = this._rotationAxis;
            this.isSynced = this.isSynced;
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            // Keep track of "Unsubscribe" functions when adding callbacks to Interactable Events, to ensure proper cleanup on destroy
            this.unsubscribeBag = [];
            this.interactable = null;
            // Native Logging
            this.log = new NativeLogger_1.default(TAG);
            this.state = {
                stateMachine: new StateMachine_1.default("InteractableManipulation"),
                triggeringInteractors: [],
                previousCapabilitiesState: {
                    enabled: true,
                    canTranslate: true,
                    canRotate: true,
                    canScale: true
                },
                activeEvents: {
                    translation: false,
                    rotation: false,
                    scale: false,
                    manipulation: false
                },
                states: {
                    Idle: "Idle",
                    Active: "Active"
                },
                signals: {
                    StartManipulation: "StartManipulation",
                    EndManipulation: "EndManipulation",
                    ChangeInteractors: "ChangeInteractors",
                    CapabilitiesChanged: "CapabilitiesChanged"
                }
            };
            this.originalWorldTransform = CachedTransform;
            this.originalLocalTransform = CachedTransform;
            this.startTransform = CachedTransform;
            this.offsetPosition = vec3.zero();
            this.offsetRotation = quat.quatIdentity();
            this.initialInteractorDistance = 0;
            this.startStretchInteractorDistance = 0;
            this.mobileStretch = 0;
            this.smoothedStretch = 0;
            this.initialObjectScale = vec3.zero();
            this.hitPointToTransform = vec3.zero();
            this.interactors = [];
            this.cachedTargetingMode = Interactor_1.TargetingMode.None;
            // Used to avoid gimbal lock when crossing the Y-axis during single-axis manipulation.
            this.currentRotationSign = 0;
            this.currentUp = vec3.zero();
            this.rayDistanceMap = new Map();
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced && !this.findContainerFrame(this.sceneObject.getParent())
                ? this.syncKitBridge.createSyncEntity(this)
                : null;
            // Callbacks
            this.onTranslationStartEvent = new Event_1.default();
            /**
             * Callback for when translation begins
             */
            this.onTranslationStart = this.onTranslationStartEvent.publicApi();
            this.onTranslationUpdateEvent = new Event_1.default();
            /**
             * Callback for when translation updates each frame
             */
            this.onTranslationUpdate = this.onTranslationUpdateEvent.publicApi();
            this.onTranslationEndEvent = new Event_1.default();
            /**
             * Callback for when translation has ended
             */
            this.onTranslationEnd = this.onTranslationEndEvent.publicApi();
            this.onRotationStartEvent = new Event_1.default();
            /**
             * Callback for when rotation begins
             */
            this.onRotationStart = this.onRotationStartEvent.publicApi();
            this.onRotationUpdateEvent = new Event_1.default();
            /**
             * Callback for when rotation updates each frame
             */
            this.onRotationUpdate = this.onRotationUpdateEvent.publicApi();
            this.onRotationEndEvent = new Event_1.default();
            /**
             * Callback for when rotation has ended
             */
            this.onRotationEnd = this.onRotationEndEvent.publicApi();
            this.onScaleLimitReachedEvent = new Event_1.default();
            /**
             * Callback for when scale has reached the minimum or maximum limit
             */
            this.onScaleLimitReached = this.onScaleLimitReachedEvent.publicApi();
            this.onScaleStartEvent = new Event_1.default();
            /**
             * Callback for when scale begins
             */
            this.onScaleStart = this.onScaleStartEvent.publicApi();
            this.onScaleUpdateEvent = new Event_1.default();
            /**
             * Callback for when scale updates each frame
             */
            this.onScaleUpdate = this.onScaleUpdateEvent.publicApi();
            this.onScaleEndEvent = new Event_1.default();
            /**
             * Callback for when scale has ended
             */
            this.onScaleEnd = this.onScaleEndEvent.publicApi();
            this.onManipulationStartEvent = new Event_1.default();
            /**
             * Callback for when any manipulation begins
             */
            this.onManipulationStart = this.onManipulationStartEvent.publicApi();
            this.onManipulationUpdateEvent = new Event_1.default();
            /**
             * Callback for when any manipulation updates
             */
            this.onManipulationUpdate = this.onManipulationUpdateEvent.publicApi();
            this.onManipulationEndEvent = new Event_1.default();
            /**
             * Callback for when any manipulation ends
             */
            this.onManipulationEnd = this.onManipulationEndEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            this.manipulateRootSceneObject = this.manipulateRootSceneObject;
            /**
             * The smallest this object can scale down to, relative to its original scale.
             * A value of 0.5 means it cannot scale smaller than 50% of its original size.
             */
            this.minimumScaleFactor = this.minimumScaleFactor;
            /**
             * The largest this object can scale up to, relative to its original scale.
             * A value of 2 means it cannot scale larger than twice its original size.
             */
            this.maximumScaleFactor = this.maximumScaleFactor;
            /**
             * Controls whether the object can be moved (translated) in space.
             */
            this.enableTranslation = this.enableTranslation;
            /**
             * Controls whether the object can be rotated in space.
             */
            this.enableRotation = this.enableRotation;
            /**
             * Controls whether the object can be scaled in size.
             */
            this.enableScale = this.enableScale;
            /**
             * Enhances depth manipulation by applying a distance-based multiplier to Z-axis movement.
             * When enabled, objects that are farther away will move greater distances with the same hand movement,
             * making it easier to position distant objects without requiring excessive physical reach.
             */
            this.enableStretchZ = this.enableStretchZ;
            /**
             * Controls the visibility of advanced Z-stretch configuration options in the Inspector. When enabled, shows
             * additional properties that fine-tune the distance-based Z-axis movement multiplier (Z Stretch Factor Min and
             * Z Stretch Factor Max).
             */
            this.showStretchZProperties = this.showStretchZProperties;
            /**
             * The minimum multiplier applied to Z-axis movement when using stretch mode.
             * This value is used when objects are close to the user.
             * Higher values result in more responsive depth movement for nearby objects.
             */
            this.zStretchFactorMin = this.zStretchFactorMin;
            /**
             * The maximum multiplier applied to Z-axis movement when using stretch mode.
             * This value is used when objects are far away from the user.
             * Higher values allow faster positioning of distant objects with minimal hand movement.
             */
            this.zStretchFactorMax = this.zStretchFactorMax;
            /**
             * Applies filtering to smooth object manipulation movement. When enabled, a one-euro filter is applied to reduce
             * jitter and make translations, rotations, and scaling appear more stable and natural. Disable for immediate
             * 1:1 response to hand movements.
             */
            this.useFilter = this.useFilter;
            /**
             * Controls the visibility of advanced filtering options in the Inspector. When enabled, shows additional
             * properties for fine-tuning the one-euro filter (minCutoff, beta, dcutoff) that smooths object manipulation.
             */
            this.showFilterProperties = this.showFilterProperties;
            /**
             * Minimum cutoff frequency of the one-euro filter.
             * Lower values reduce jitter during slow movements but increase lag.
             * Adjust this parameter first with beta=0 to find a balance that removes jitter
             * while maintaining acceptable responsiveness during slow movements.
             */
            this.minCutoff = this.minCutoff;
            /**
             * Speed coefficient of the one-euro filter.
             * Higher values reduce lag during fast movements but may increase jitter.
             * Adjust this parameter after setting minCutoff to minimize lag during quick movements.
             */
            this.beta = this.beta;
            /**
             * Derivative cutoff frequency for the one-euro filter.
             * Controls how the filter responds to changes in movement speed.
             * Higher values make the filter more responsive to velocity changes.
             */
            this.dcutoff = this.dcutoff;
            /**
             * Controls the visibility of translation options in the Inspector.
             */
            this.showTranslationProperties = this.showTranslationProperties;
            /**
             * Enables translation along the world's X-axis.
             */
            this._enableXTranslation = this._enableXTranslation;
            /**
             * Enables translation along the world's Y-axis.
             */
            this._enableYTranslation = this._enableYTranslation;
            /**
             * Enables translation along the world's Z-axis.
             */
            this._enableZTranslation = this._enableZTranslation;
            /**
             * Controls the visibility of rotation options in the Inspector.
             */
            this.showRotationProperties = this.showRotationProperties;
            /**
             * Controls which axes the object can rotate around. "All" allows free rotation in any direction, while "X",
             * "Y", or "Z" constrains rotation to only that specific world axis.
             */
            this._rotationAxis = this._rotationAxis;
            this.isSynced = this.isSynced;
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            // Keep track of "Unsubscribe" functions when adding callbacks to Interactable Events, to ensure proper cleanup on destroy
            this.unsubscribeBag = [];
            this.interactable = null;
            // Native Logging
            this.log = new NativeLogger_1.default(TAG);
            this.state = {
                stateMachine: new StateMachine_1.default("InteractableManipulation"),
                triggeringInteractors: [],
                previousCapabilitiesState: {
                    enabled: true,
                    canTranslate: true,
                    canRotate: true,
                    canScale: true
                },
                activeEvents: {
                    translation: false,
                    rotation: false,
                    scale: false,
                    manipulation: false
                },
                states: {
                    Idle: "Idle",
                    Active: "Active"
                },
                signals: {
                    StartManipulation: "StartManipulation",
                    EndManipulation: "EndManipulation",
                    ChangeInteractors: "ChangeInteractors",
                    CapabilitiesChanged: "CapabilitiesChanged"
                }
            };
            this.originalWorldTransform = CachedTransform;
            this.originalLocalTransform = CachedTransform;
            this.startTransform = CachedTransform;
            this.offsetPosition = vec3.zero();
            this.offsetRotation = quat.quatIdentity();
            this.initialInteractorDistance = 0;
            this.startStretchInteractorDistance = 0;
            this.mobileStretch = 0;
            this.smoothedStretch = 0;
            this.initialObjectScale = vec3.zero();
            this.hitPointToTransform = vec3.zero();
            this.interactors = [];
            this.cachedTargetingMode = Interactor_1.TargetingMode.None;
            // Used to avoid gimbal lock when crossing the Y-axis during single-axis manipulation.
            this.currentRotationSign = 0;
            this.currentUp = vec3.zero();
            this.rayDistanceMap = new Map();
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced && !this.findContainerFrame(this.sceneObject.getParent())
                ? this.syncKitBridge.createSyncEntity(this)
                : null;
            // Callbacks
            this.onTranslationStartEvent = new Event_1.default();
            /**
             * Callback for when translation begins
             */
            this.onTranslationStart = this.onTranslationStartEvent.publicApi();
            this.onTranslationUpdateEvent = new Event_1.default();
            /**
             * Callback for when translation updates each frame
             */
            this.onTranslationUpdate = this.onTranslationUpdateEvent.publicApi();
            this.onTranslationEndEvent = new Event_1.default();
            /**
             * Callback for when translation has ended
             */
            this.onTranslationEnd = this.onTranslationEndEvent.publicApi();
            this.onRotationStartEvent = new Event_1.default();
            /**
             * Callback for when rotation begins
             */
            this.onRotationStart = this.onRotationStartEvent.publicApi();
            this.onRotationUpdateEvent = new Event_1.default();
            /**
             * Callback for when rotation updates each frame
             */
            this.onRotationUpdate = this.onRotationUpdateEvent.publicApi();
            this.onRotationEndEvent = new Event_1.default();
            /**
             * Callback for when rotation has ended
             */
            this.onRotationEnd = this.onRotationEndEvent.publicApi();
            this.onScaleLimitReachedEvent = new Event_1.default();
            /**
             * Callback for when scale has reached the minimum or maximum limit
             */
            this.onScaleLimitReached = this.onScaleLimitReachedEvent.publicApi();
            this.onScaleStartEvent = new Event_1.default();
            /**
             * Callback for when scale begins
             */
            this.onScaleStart = this.onScaleStartEvent.publicApi();
            this.onScaleUpdateEvent = new Event_1.default();
            /**
             * Callback for when scale updates each frame
             */
            this.onScaleUpdate = this.onScaleUpdateEvent.publicApi();
            this.onScaleEndEvent = new Event_1.default();
            /**
             * Callback for when scale has ended
             */
            this.onScaleEnd = this.onScaleEndEvent.publicApi();
            this.onManipulationStartEvent = new Event_1.default();
            /**
             * Callback for when any manipulation begins
             */
            this.onManipulationStart = this.onManipulationStartEvent.publicApi();
            this.onManipulationUpdateEvent = new Event_1.default();
            /**
             * Callback for when any manipulation updates
             */
            this.onManipulationUpdate = this.onManipulationUpdateEvent.publicApi();
            this.onManipulationEndEvent = new Event_1.default();
            /**
             * Callback for when any manipulation ends
             */
            this.onManipulationEnd = this.onManipulationEndEvent.publicApi();
        }
        /**
         * Gets the transform of the root of the manipulated object(s).
         */
        getManipulateRoot() {
            return this.manipulateRoot;
        }
        /**
         * Sets the transform of the passed SceneObject as the root of the manipulated object(s).
         */
        setManipulateRoot(root) {
            this.manipulateRoot = root;
            this.cacheTransform();
        }
        /**
         * Returns true translation is enabled
         */
        canTranslate() {
            return this.enableTranslation;
        }
        /**
         * Toggle for allowing an object to translate
         */
        setCanTranslate(enabled) {
            if (this.enableTranslation !== enabled) {
                this.enableTranslation = enabled;
                this.notifyCapabilityChanged();
            }
        }
        /**
         * Returns true if any of rotation x, y, or z is enabled
         */
        canRotate() {
            return (this.enableRotation &&
                (this.state.triggeringInteractors.length === 2 ||
                    (this.state.triggeringInteractors.length === 1 && this.cachedTargetingMode === Interactor_1.TargetingMode.Direct)));
        }
        /**
         * Toggle for allowing an object to rotate
         */
        setCanRotate(enabled) {
            if (this.enableRotation !== enabled) {
                this.enableRotation = enabled;
                this.notifyCapabilityChanged();
            }
        }
        /**
         * Returns true if any of scale x, y, or z is enabled
         */
        canScale() {
            return this.enableScale && this.state.triggeringInteractors.length === 2;
        }
        /**
         * Toggle for allowing an object to scale
         */
        setCanScale(enabled) {
            if (this.enableScale !== enabled) {
                this.enableScale = enabled;
                this.notifyCapabilityChanged();
            }
        }
        /**
         * Set if translation along world X-axis is enabled.
         */
        set enableXTranslation(enabled) {
            this._enableXTranslation = enabled;
        }
        /**
         * Returns if translation along world X-axis is enabled.
         */
        get enableXTranslation() {
            return this._enableXTranslation;
        }
        /**
         * Set if translation along world Y-axis is enabled.
         */
        set enableYTranslation(enabled) {
            this._enableYTranslation = enabled;
        }
        /**
         * Returns if translation along world Y-axis is enabled.
         */
        get enableYTranslation() {
            return this._enableYTranslation;
        }
        /**
         * Set if translation along world Z-axis is enabled.
         */
        set enableZTranslation(enabled) {
            this._enableZTranslation = enabled;
        }
        /**
         * Returns if translation along world Z-axis is enabled.
         */
        get enableZTranslation() {
            return this._enableZTranslation;
        }
        /**
         * Set if rotation occurs about all axes or a single world axis (x,y,z) when using to two hands.
         */
        set rotationAxis(axis) {
            this._rotationAxis = axis;
        }
        /**
         * Get if rotation occurs about all axes or a single world axis (x,y,z) when using to two hands..
         */
        get rotationAxis() {
            return this._rotationAxis;
        }
        onAwake() {
            this.setupStateMachine();
            this.setManipulateRoot(!isNull(this.manipulateRootSceneObject) ? this.manipulateRootSceneObject.getTransform() : this.getTransform());
            this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
            this.createEvent("OnDisableEvent").bind(() => {
                this.state.stateMachine.sendSignal(this.state.signals.EndManipulation);
            });
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
            this.defaultFilterConfig = {
                frequency: 60, //fps
                minCutoff: this.minCutoff,
                beta: this.beta,
                dcutoff: this.dcutoff
            };
            this.translateFilter = new OneEuroFilter_1.OneEuroFilterVec3(this.defaultFilterConfig);
            this.rotationFilter = new OneEuroFilter_1.OneEuroFilterQuat(this.defaultFilterConfig);
            this.scaleFilter = new OneEuroFilter_1.OneEuroFilterVec3(this.defaultFilterConfig);
            if (this.syncEntity !== null) {
                this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this));
            }
        }
        onStart() {
            this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            if (this.interactable === null) {
                throw new Error("InteractableManipulation requires an interactable to function.");
            }
            this.interactable.keepHoverOnTrigger = true;
            this.interactable.useFilteredPinch = true;
            // Temporarily limit manipulatable Interactables to not be pokeable until fixing the transition from poke to pinch.
            if ((this.interactable.targetingMode & Interactor_1.TargetingMode.Poke) !== 0) {
                this.log.e(`Poke targeting is incompatible with InteractableManipulation. Poke targeting for Interactable of ${this.sceneObject.name} will be disabled.`);
                this.interactable.targetingMode = this.interactable.targetingMode & ~Interactor_1.TargetingMode.Poke;
            }
            this.setupCallbacks();
        }
        /**
         * If the component is synced, set up additional callbacks for the synced datastore
         * to ensure another connected user's manipulation propagates to the local scene.
         */
        setupConnectionCallbacks() {
            if (this.syncEntity.currentStore.getAllKeys().find((key) => {
                return key === MANIPULATION_VALUE_KEY;
            })) {
                const locationTransform = this.syncEntity.currentStore.getMat4(MANIPULATION_VALUE_KEY);
                const worldTransform = this.syncKitBridge.locationTransformToWorldTransform(locationTransform);
                this.manipulateRoot.setWorldTransform(worldTransform);
            }
            else {
                const locationTransform = this.syncKitBridge.worldTransformToLocationTransform(this.manipulateRoot.getWorldTransform());
                this.syncEntity.currentStore.putMat4(MANIPULATION_VALUE_KEY, locationTransform);
            }
            this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this));
        }
        processStoreUpdate(_session, store, key, info) {
            const connectionId = info.updaterInfo.connectionId;
            const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId();
            if (updatedByLocal) {
                return;
            }
            if (key === MANIPULATION_VALUE_KEY) {
                const locationTransform = store.getMat4(MANIPULATION_VALUE_KEY);
                const worldTransform = this.syncKitBridge.locationTransformToWorldTransform(locationTransform);
                this.manipulateRoot.setWorldTransform(worldTransform);
            }
        }
        updateSyncStore() {
            if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                const locationTransform = this.syncKitBridge.worldTransformToLocationTransform(this.manipulateRoot.getWorldTransform());
                this.syncEntity.currentStore.putMat4(MANIPULATION_VALUE_KEY, locationTransform);
            }
        }
        // If the InteractableManipulation script is instantiated by ContainerFrame, allow the ContainerFrame
        // to handle the transform syncing.
        findContainerFrame(ancestor) {
            if (ancestor === null) {
                return false;
            }
            else if (ancestor.getComponent(ContainerFrame_1.ContainerFrame.getTypeName())) {
                return true;
            }
            else {
                return this.findContainerFrame(ancestor.getParent());
            }
        }
        onDestroy() {
            // If we don't unsubscribe, component will keep working after destroy() due to event callbacks added to Interactable Events
            this.unsubscribeBag.forEach((unsubscribeCallback) => {
                unsubscribeCallback();
            });
            this.unsubscribeBag = [];
            this.state.stateMachine.destroy();
            this.interactors = [];
        }
        setupCallbacks() {
            (0, validate_1.validate)(this.interactable);
            this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((event) => {
                if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerToggle(event);
                }
            }));
            this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((event) => {
                if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerUpdate(event);
                }
            }));
            this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((event) => {
                if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerToggle(event);
                }
            }));
            this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((event) => {
                if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerToggle(event);
                }
            }));
            this.unsubscribeBag.push(this.interactable.onTriggerEndOutside.add((event) => {
                if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
                    event.stopPropagation();
                    this.onTriggerToggle(event);
                }
            }));
        }
        /**
         * Updates the starting transform values mid-manipuation if some other script has displaced, rotated, or scaled the object
         * during the interaction.
         */
        updateStartTransform() {
            // If called when not actively manipulating, ignore the call since all values have already been reset.
            if (this.state.stateMachine.currentState?.name === this.state.states.Idle) {
                return;
            }
            const interactor = this.interactors[0];
            if (this.isInteractorValid(interactor) === false) {
                this.log.e("Interactor must not be valid for setting initial values");
                return;
            }
            (0, validate_1.validate)(this.manipulateRoot);
            // Reset filters
            this.translateFilter.reset();
            this.rotationFilter.reset();
            this.scaleFilter.reset();
            // Set the starting transform values to be used for callbacks
            this.startTransform = {
                transform: this.manipulateRoot.getWorldTransform(),
                position: this.manipulateRoot.getWorldPosition(),
                rotation: this.manipulateRoot.getWorldRotation(),
                scale: this.manipulateRoot.getWorldScale()
            };
            // Bang operator is fine here because isInteractorValid checks for null values.
            const startPoint = interactor.startPoint;
            // Ensure that stretch value does not affect the new hitPointToTransformValue.
            this.hitPointToTransform = this.startTransform.position.sub(startPoint.add(interactor.direction.uniformScale(this.offsetPosition.length + this.smoothedStretch)));
        }
        updateStartValues() {
            (0, validate_1.validate)(this.manipulateRoot);
            (0, validate_1.validate)(this.interactable);
            this.mobileStretch = 0;
            this.smoothedStretch = 0;
            this.startStretchInteractorDistance = 0;
            // Reset filters
            this.translateFilter.reset();
            this.rotationFilter.reset();
            this.scaleFilter.reset();
            // Set the starting transform values to be used for callbacks
            this.startTransform = {
                transform: this.manipulateRoot.getWorldTransform(),
                position: this.manipulateRoot.getWorldPosition(),
                rotation: this.manipulateRoot.getWorldRotation(),
                scale: this.manipulateRoot.getWorldScale()
            };
            const cameraRotation = this.camera.getTransform().getWorldRotation();
            if (this.interactors.length === 1) {
                const interactor = this.interactors[0];
                if (this.isInteractorValid(interactor) === false) {
                    this.log.e("Interactor must not be valid for setting initial values");
                    return;
                }
                const startPoint = interactor.startPoint ?? vec3.zero();
                const orientation = interactor.orientation ?? quat.quatIdentity();
                this.cachedTargetingMode = interactor.activeTargetingMode;
                if (interactor.activeTargetingMode === Interactor_1.TargetingMode.Direct) {
                    this.offsetPosition = vec3.zero();
                    this.hitPointToTransform = this.startTransform.position.sub(startPoint);
                    this.offsetRotation = orientation.invert().multiply(this.startTransform.rotation);
                }
                else {
                    // Bang operator is fine here because isInteractorValid checks for null values.
                    const distance = interactor.distanceToTarget;
                    // Cache the distance when starting manipulation to maintain the same position along the targeting ray.
                    this.rayDistanceMap.set(interactor, distance);
                    const rayPosition = this.getRayPosition(interactor);
                    this.offsetPosition = rayPosition.sub(startPoint);
                    this.hitPointToTransform = this.startTransform.position.sub(rayPosition);
                    this.offsetRotation = cameraRotation.invert().multiply(this.startTransform.rotation);
                }
            }
            else if (this.interactors.length === 2) {
                if (this.isInteractorValid(this.interactors[0]) === false ||
                    this.isInteractorValid(this.interactors[1]) === false) {
                    this.log.e("Both interactors must be valid for setting initial values");
                    return;
                }
                const isDirect = this.interactors[0].activeTargetingMode === Interactor_1.TargetingMode.Direct ||
                    this.interactors[1].activeTargetingMode === Interactor_1.TargetingMode.Direct;
                this.cachedTargetingMode = isDirect ? Interactor_1.TargetingMode.Direct : Interactor_1.TargetingMode.Indirect;
                const firstStartPoint = this.interactors[0].startPoint ?? vec3.zero();
                const secondStartPoint = this.interactors[1].startPoint ?? vec3.zero();
                const interactorMidPoint = firstStartPoint.add(secondStartPoint).uniformScale(0.5);
                this.currentUp = vec3.up();
                this.currentRotationSign = 0;
                const dualInteractorDirection = this.getDualInteractorDirection(this.interactors[0], this.interactors[1]);
                this.initialInteractorDistance = firstStartPoint.distance(secondStartPoint);
                this.initialObjectScale = this.manipulateRoot.getLocalScale();
                if (dualInteractorDirection === null) {
                    return;
                }
                this.offsetRotation = dualInteractorDirection.invert().multiply(this.startTransform.rotation);
                if (isDirect) {
                    this.offsetPosition = vec3.zero();
                    this.hitPointToTransform = this.startTransform.position.sub(interactorMidPoint);
                }
                else {
                    // Bang operator is fine here because isInteractorValid checks for null values.
                    const firstDistance = this.interactors[0].distanceToTarget;
                    const secondDistance = this.interactors[1].distanceToTarget;
                    // Cache the distance when starting manipulation to maintain the same position along the targeting ray.
                    this.rayDistanceMap.set(this.interactors[0], firstDistance);
                    this.rayDistanceMap.set(this.interactors[1], secondDistance);
                    const firstRayPosition = this.getRayPosition(this.interactors[0]);
                    const secondRayPosition = this.getRayPosition(this.interactors[1]);
                    const dualRayPosition = firstRayPosition.add(secondRayPosition).uniformScale(0.5);
                    const direction0 = this.interactors[0].direction ?? vec3.zero();
                    const direction1 = this.interactors[1].direction ?? vec3.zero();
                    const dualDirection = direction0.add(direction1).uniformScale(0.5);
                    const dualRaycastDistance = (this.interactors[0].maxRaycastDistance + this.interactors[1].maxRaycastDistance) * 0.5;
                    const rayMidpointToInteractorDistance = dualRayPosition.distance(interactorMidPoint);
                    const projectedHitDistance = Math.min(dualRaycastDistance, rayMidpointToInteractorDistance);
                    const hitPoint = interactorMidPoint.add(dualDirection.uniformScale(projectedHitDistance));
                    this.offsetPosition = dualRayPosition.sub(interactorMidPoint);
                    this.hitPointToTransform = this.startTransform.position.sub(hitPoint);
                }
            }
        }
        /**
         * Hit position from interactor does not necessarily mean the actual
         * ray position. We need to maintain offset so that there's isn't a pop
         * on pickup.
         */
        getRayPosition(interactor) {
            if (this.isInteractorValid(interactor) === false) {
                return vec3.zero();
            }
            const startPoint = interactor.startPoint ?? vec3.zero();
            const direction = interactor.direction ?? vec3.zero();
            const distanceToTarget = this.rayDistanceMap.get(interactor) ?? 0;
            return startPoint.add(direction.uniformScale(distanceToTarget));
        }
        cacheTransform() {
            (0, validate_1.validate)(this.manipulateRoot);
            this.originalWorldTransform = {
                transform: this.manipulateRoot.getWorldTransform(),
                position: this.manipulateRoot.getWorldPosition(),
                rotation: this.manipulateRoot.getWorldRotation(),
                scale: this.manipulateRoot.getWorldScale()
            };
            this.originalLocalTransform = {
                transform: mat4.compose(this.manipulateRoot.getLocalPosition(), this.manipulateRoot.getLocalRotation(), this.manipulateRoot.getLocalScale()),
                position: this.manipulateRoot.getLocalPosition(),
                rotation: this.manipulateRoot.getLocalRotation(),
                scale: this.manipulateRoot.getLocalScale()
            };
        }
        resetActiveEvents() {
            this.state.activeEvents.translation = false;
            this.state.activeEvents.rotation = false;
            this.state.activeEvents.scale = false;
            this.state.activeEvents.manipulation = false;
        }
        setupStateMachine() {
            this.state.previousCapabilitiesState = {
                enabled: this.enabled,
                canTranslate: this.canTranslate(),
                canRotate: this.canRotate(),
                canScale: this.canScale()
            };
            this.state.stateMachine.addState({
                name: this.state.states.Idle,
                onEnter: () => {
                    this.log.v("Entered Idle state");
                    this.interactors = [];
                    this.resetActiveEvents();
                },
                transitions: [
                    {
                        nextStateName: this.state.states.Active,
                        checkOnSignal: (signal, data) => {
                            return (signal === this.state.signals.StartManipulation &&
                                this.hasActiveCapabilities() &&
                                data?.interactors?.length > 0);
                        }
                    }
                ]
            });
            this.state.stateMachine.addState({
                name: this.state.states.Active,
                onEnter: () => {
                    this.log.v("Entered Active state");
                    this.startManipulation(this.state.triggeringInteractors);
                },
                onUpdate: () => {
                    this.performManipulation();
                },
                onExit: () => {
                    this.log.v("Exited Active state");
                    this.endManipulation();
                },
                onSignal: (signal, data) => {
                    if (signal === this.state.signals.ChangeInteractors && data?.interactors) {
                        this.log.v("Handling interactor change within Active state");
                        this.interactors = data.interactors;
                        this.updateStartValues();
                        this.updateEventStates();
                    }
                    else if (signal === this.state.signals.CapabilitiesChanged) {
                        this.log.v("Handling capability changes within Active state");
                        this.updateStartValues();
                        this.updateEventStates();
                    }
                },
                transitions: [
                    {
                        nextStateName: this.state.states.Idle,
                        checkOnSignal: (signal) => {
                            return signal === this.state.signals.EndManipulation;
                        }
                    }
                ]
            });
            this.state.stateMachine.enterState(this.state.states.Idle);
        }
        hasActiveCapabilities() {
            return this.enabled && (this.canTranslate() || this.canRotate() || this.canScale());
        }
        onTriggerToggle(_eventData) {
            const previousInteractors = this.interactors;
            const currentInteractors = this.getTriggeringInteractors();
            this.log.v(`onTriggerToggle called with ${currentInteractors.length} interactors`);
            this.state.triggeringInteractors = currentInteractors;
            const currentState = this.state.stateMachine.currentState?.name;
            const hasCapabilities = this.hasActiveCapabilities();
            // Try transition to Active
            if (currentState === this.state.states.Idle && currentInteractors.length > 0 && hasCapabilities) {
                this.log.v("Attempting transition: Idle -> Active");
                this.state.stateMachine.sendSignal(this.state.signals.StartManipulation, {
                    interactors: currentInteractors
                });
            }
            // Try transition to Idle
            if (currentState === this.state.states.Active && (currentInteractors.length === 0 || !hasCapabilities)) {
                this.log.v("Attempting transition: Active -> Idle");
                this.state.stateMachine.sendSignal(this.state.signals.EndManipulation);
            }
            // Try update if Interactors changed
            if (currentState === this.state.states.Active &&
                hasCapabilities &&
                currentInteractors.length > 0 &&
                this.interactorsChanged(previousInteractors, currentInteractors)) {
                this.log.v("Attempting to update interactors within Active state");
                this.state.stateMachine.sendSignal(this.state.signals.ChangeInteractors, { interactors: currentInteractors });
            }
        }
        onTriggerUpdate(_eventData) {
            this.notifyCapabilityChanged();
        }
        getCurrentCapabilitiesState() {
            return {
                enabled: this.enabled,
                canTranslate: this.canTranslate(),
                canRotate: this.canRotate(),
                canScale: this.canScale()
            };
        }
        capabilitiesChanged(previous, current) {
            return (previous.enabled !== current.enabled ||
                previous.canTranslate !== current.canTranslate ||
                previous.canRotate !== current.canRotate ||
                previous.canScale !== current.canScale);
        }
        notifyCapabilityChanged() {
            const currentCapabilities = this.getCurrentCapabilitiesState();
            if (this.capabilitiesChanged(this.state.previousCapabilitiesState, currentCapabilities)) {
                this.handleCapabilityChange(this.hasActiveCapabilities());
                this.state.previousCapabilitiesState = currentCapabilities;
            }
        }
        handleCapabilityChange(hasCapabilities) {
            const currentState = this.state.stateMachine.currentState?.name;
            if (!hasCapabilities && currentState === this.state.states.Active) {
                this.log.v("All capabilities disabled during active manipulation, ending manipulation");
                this.state.stateMachine.sendSignal(this.state.signals.EndManipulation);
            }
            else if (hasCapabilities &&
                currentState === this.state.states.Active &&
                this.state.triggeringInteractors.length > 0) {
                this.log.v("Capabilities changed during active manipulation");
                this.state.stateMachine.sendSignal(this.state.signals.CapabilitiesChanged);
            }
            else if (hasCapabilities &&
                currentState === this.state.states.Idle &&
                this.state.triggeringInteractors.length > 0) {
                this.log.v("Capabilities enabled while in Idle state, starting manipulation");
                this.state.stateMachine.sendSignal(this.state.signals.StartManipulation, {
                    interactors: this.state.triggeringInteractors
                });
            }
        }
        updateEventStates() {
            (0, validate_1.validate)(this.interactable);
            (0, validate_1.validate)(this.manipulateRoot);
            const canTranslate = this.canTranslate();
            const canRotate = this.canRotate();
            const canScale = this.canScale();
            // Handle translation events
            if (canTranslate && !this.state.activeEvents.translation) {
                this.state.activeEvents.translation = true;
                this.invokeTranslationStart();
            }
            else if (!canTranslate && this.state.activeEvents.translation) {
                this.state.activeEvents.translation = false;
                this.invokeTranslationEnd();
            }
            // Handle rotation events
            if (canRotate && !this.state.activeEvents.rotation) {
                this.state.activeEvents.rotation = true;
                this.invokeRotationStart();
            }
            else if (!canRotate && this.state.activeEvents.rotation) {
                this.state.activeEvents.rotation = false;
                this.invokeRotationEnd();
            }
            // Handle scale events
            if (canScale && !this.state.activeEvents.scale) {
                this.state.activeEvents.scale = true;
                this.invokeScaleStart();
            }
            else if (!canScale && this.state.activeEvents.scale) {
                this.state.activeEvents.scale = false;
                this.invokeScaleEnd();
            }
        }
        startManipulation(interactors) {
            this.log.v(`startManipulation called with ${interactors.length} interactors`);
            this.interactors = interactors;
            this.updateStartValues();
            this.state.activeEvents.manipulation = true;
            this.state.activeEvents.translation = this.canTranslate();
            this.state.activeEvents.rotation = this.canRotate();
            this.state.activeEvents.scale = this.canScale();
            this.invokeManipulationStart();
            if (this.state.activeEvents.translation) {
                this.invokeTranslationStart();
            }
            if (this.state.activeEvents.rotation) {
                this.invokeRotationStart();
            }
            if (this.state.activeEvents.scale) {
                this.invokeScaleStart();
            }
        }
        performManipulation() {
            const canTranslate = this.canTranslate();
            const canRotate = this.canRotate();
            const canScale = this.canScale();
            if (this.interactors.length === 1) {
                this.singleInteractorTransform(this.interactors[0]);
            }
            else if (this.interactors.length === 2) {
                this.dualInteractorsTransform(this.interactors);
            }
            else {
                this.log.e(`${this.interactors.length} interactors found for manipulation. This is not supported.`);
                return;
            }
            if (canTranslate) {
                this.invokeTranslationUpdate();
            }
            if (canRotate) {
                this.invokeRotationUpdate();
            }
            if (canScale) {
                this.invokeScaleUpdate();
            }
            if (canTranslate || canRotate || canScale) {
                this.invokeManipulationUpdate();
            }
            this.updateSyncStore();
        }
        endManipulation() {
            this.log.v(`endManipulation called with ${this.interactors.length} interactors`);
            if (this.state.activeEvents.translation) {
                this.invokeTranslationEnd();
                this.state.activeEvents.translation = false;
            }
            if (this.state.activeEvents.rotation) {
                this.invokeRotationEnd();
                this.state.activeEvents.rotation = false;
            }
            if (this.state.activeEvents.scale) {
                this.invokeScaleEnd();
                this.state.activeEvents.scale = false;
            }
            if (this.state.activeEvents.manipulation) {
                this.invokeManipulationEnd();
                this.state.activeEvents.manipulation = false;
            }
        }
        interactorsChanged(previous, current) {
            if (previous.length !== current.length)
                return true;
            return previous.some((prev, i) => prev !== current[i]);
        }
        getTriggeringInteractors() {
            (0, validate_1.validate)(this.interactable);
            let interactors = this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor);
            interactors = interactors.filter((interactor) => {
                return (interactor.currentInteractable === this.interactable && interactor.currentTrigger !== Interactor_1.InteractorTriggerType.None);
            });
            if (interactors === null) {
                this.log.w(`Failed to retrieve interactors on ${this.getSceneObject().name}: ${this.interactable.triggeringInteractor} (InteractorInputType)`);
                return [];
            }
            return interactors;
        }
        invokeEvent(event, createArgs) {
            (0, validate_1.validate)(this.interactable);
            (0, validate_1.validate)(this.manipulateRoot);
            event.invoke(createArgs());
        }
        // Event args creator helpers
        createTranslationEventArgs() {
            (0, validate_1.validate)(this.interactable);
            (0, validate_1.validate)(this.manipulateRoot);
            return {
                interactors: this.interactors,
                interactable: this.interactable,
                startPosition: this.startTransform.position,
                currentPosition: this.manipulateRoot.getWorldPosition()
            };
        }
        createRotationEventArgs() {
            (0, validate_1.validate)(this.interactable);
            (0, validate_1.validate)(this.manipulateRoot);
            return {
                interactors: this.interactors,
                interactable: this.interactable,
                startRotation: this.startTransform.rotation,
                currentRotation: this.manipulateRoot.getWorldRotation()
            };
        }
        createScaleEventArgs() {
            (0, validate_1.validate)(this.interactable);
            (0, validate_1.validate)(this.manipulateRoot);
            return {
                interactors: this.interactors,
                interactable: this.interactable,
                startWorldScale: this.startTransform.scale,
                currentWorldScale: this.manipulateRoot.getWorldScale()
            };
        }
        createManipulationEventArgs() {
            (0, validate_1.validate)(this.interactable);
            (0, validate_1.validate)(this.manipulateRoot);
            return {
                interactors: this.interactors,
                interactable: this.interactable,
                startTransform: this.startTransform.transform,
                currentTransform: this.manipulateRoot.getWorldTransform()
            };
        }
        // Translation events
        invokeTranslationStart() {
            this.invokeEvent(this.onTranslationStartEvent, () => this.createTranslationEventArgs());
        }
        invokeTranslationUpdate() {
            this.invokeEvent(this.onTranslationUpdateEvent, () => this.createTranslationEventArgs());
        }
        invokeTranslationEnd() {
            this.invokeEvent(this.onTranslationEndEvent, () => this.createTranslationEventArgs());
        }
        // Rotation events
        invokeRotationStart() {
            this.invokeEvent(this.onRotationStartEvent, () => this.createRotationEventArgs());
        }
        invokeRotationUpdate() {
            this.invokeEvent(this.onRotationUpdateEvent, () => this.createRotationEventArgs());
        }
        invokeRotationEnd() {
            this.invokeEvent(this.onRotationEndEvent, () => this.createRotationEventArgs());
        }
        // Scale events
        invokeScaleStart() {
            this.invokeEvent(this.onScaleStartEvent, () => this.createScaleEventArgs());
        }
        invokeScaleUpdate() {
            this.invokeEvent(this.onScaleUpdateEvent, () => this.createScaleEventArgs());
        }
        invokeScaleEnd() {
            this.invokeEvent(this.onScaleEndEvent, () => this.createScaleEventArgs());
        }
        // Manipulation events
        invokeManipulationStart() {
            this.invokeEvent(this.onManipulationStartEvent, () => this.createManipulationEventArgs());
        }
        invokeManipulationUpdate() {
            this.invokeEvent(this.onManipulationUpdateEvent, () => this.createManipulationEventArgs());
        }
        invokeManipulationEnd() {
            this.invokeEvent(this.onManipulationEndEvent, () => this.createManipulationEventArgs());
        }
        getDualInteractorDirection(interactor1, interactor2) {
            if (interactor1 === null ||
                interactor1.startPoint === null ||
                interactor2 === null ||
                interactor2.startPoint === null) {
                this.log.e("Interactors and their start points should not be null for getDualInteractorDirection");
                return null;
            }
            let point1 = interactor1.startPoint;
            let point2 = interactor2.startPoint;
            let sign = 0;
            // Handle single axis rotation by projecting the start points onto plane.
            if (this.rotationAxis !== RotationAxis.All) {
                let axis;
                switch (this.rotationAxis) {
                    case RotationAxis.X:
                        axis = vec3.right();
                        break;
                    case RotationAxis.Y:
                        axis = vec3.up();
                        break;
                    case RotationAxis.Z:
                        axis = vec3.forward();
                        break;
                }
                // When rotating about a single axis, project the start points onto the plane defined by that axis to calculate rotation about that axis.
                point1 = point1.projectOnPlane(axis);
                point2 = point2.projectOnPlane(axis);
                if (this.rotationAxis === RotationAxis.X) {
                    sign = Math.sign(point2.z - point1.z);
                }
                else if (this.rotationAxis === RotationAxis.Z) {
                    sign = Math.sign(point2.x - point1.x);
                }
            }
            // For X and Z rotation, flip the 'up' orientation of the rotation when the vector between the projected points crosses the Y-axis.
            if (sign !== this.currentRotationSign) {
                this.currentUp = this.currentUp.uniformScale(-1);
                this.currentRotationSign = sign;
            }
            // Get the direction from the two palm points, rotate yaw 90 degrees to get forward direction
            const rotation = quat.lookAt(point2.sub(point1), this.currentUp).multiply(YAW_NEGATIVE_90);
            const currentRotation = this.limitQuatRotation(rotation);
            return currentRotation;
        }
        limitQuatRotation(rotation) {
            if (!this.canRotate()) {
                return quat.quatIdentity();
            }
            return rotation;
        }
        isInteractorValid(interactor) {
            return (interactor !== null &&
                interactor.startPoint !== null &&
                interactor.orientation !== null &&
                interactor.direction !== null &&
                interactor.distanceToTarget !== null &&
                interactor.isActive());
        }
        singleInteractorTransform(interactor) {
            if (this.isInteractorValid(interactor) === false) {
                this.log.e("Interactor must be valid");
                return;
            }
            (0, validate_1.validate)(this.manipulateRoot);
            const startPoint = interactor.startPoint ?? vec3.zero();
            const orientation = interactor.orientation ?? quat.quatIdentity();
            const direction = interactor.direction ?? vec3.zero();
            const limitRotation = this.limitQuatRotation(orientation).multiply(this.offsetRotation);
            // Do not rotate the object if using a single Interactor for single axis usecase.
            let deltaRotation = this.rotationAxis === RotationAxis.All
                ? limitRotation.multiply(this.manipulateRoot.getWorldRotation().invert())
                : quat.quatIdentity();
            // Single Interactor Direct
            if (this.enableTranslation) {
                let newPosition;
                if (this.cachedTargetingMode === Interactor_1.TargetingMode.Direct) {
                    newPosition = startPoint.add(this.canRotate()
                        ? limitRotation.multiply(this.startTransform.rotation.invert()).multiplyVec3(this.hitPointToTransform)
                        : this.hitPointToTransform);
                    this.updatePosition(newPosition, this.useFilter);
                }
                else {
                    // Single Interactor Indirect
                    this.smoothedStretch = MathUtils.lerp(this.smoothedStretch, this.calculateStretchFactor(interactor), getDeltaTime() * STRETCH_SMOOTH_SPEED);
                    const offset = direction.uniformScale(this.offsetPosition.length).add(this.hitPointToTransform);
                    newPosition = startPoint.add(offset).add(direction.uniformScale(this.smoothedStretch));
                    this.updatePosition(newPosition, this.useFilter);
                    deltaRotation = quat.quatIdentity();
                }
            }
            if (this.canRotate()) {
                if (this.cachedTargetingMode === Interactor_1.TargetingMode.Direct) {
                    const newRotation = deltaRotation.multiply(this.manipulateRoot.getWorldRotation());
                    this.updateRotation(newRotation, this.useFilter);
                }
            }
        }
        dualInteractorsTransform(interactors) {
            if (interactors.length < 2 || !this.isInteractorValid(interactors[0]) || !this.isInteractorValid(interactors[1])) {
                this.log.e("There should be two valid interactors for dualInteractorsTransform");
                return;
            }
            (0, validate_1.validate)(this.manipulateRoot);
            (0, validate_1.validate)(this.interactable);
            const isDirect = this.cachedTargetingMode === Interactor_1.TargetingMode.Direct;
            const startPoint1 = interactors[0].startPoint;
            const startPoint2 = interactors[1].startPoint;
            if (startPoint1 === null || startPoint2 === null) {
                this.log.e("Both start points should be valid for dualInteractorsTransform");
                return;
            }
            const interactorMidPoint = startPoint1.add(startPoint2).uniformScale(0.5);
            const dualDirection = this.getDualInteractorDirection(interactors[0], interactors[1]);
            if (dualDirection === null) {
                return;
            }
            const dualDistance = startPoint1.distance(startPoint2);
            if (this.canRotate()) {
                const newRotation = dualDirection.multiply(this.offsetRotation);
                this.updateRotation(newRotation, this.useFilter);
            }
            if (this.enableTranslation) {
                let newPosition;
                // Dual Interactor Direct
                if (isDirect) {
                    newPosition =
                        this.canRotate() && isDirect
                            ? interactorMidPoint.add(this.manipulateRoot
                                .getWorldRotation()
                                .multiply(this.startTransform.rotation.invert())
                                .multiplyVec3(this.hitPointToTransform))
                            : interactorMidPoint.add(this.hitPointToTransform);
                    this.updatePosition(newPosition, this.useFilter);
                }
                else {
                    // Dual Interactor Indirect
                    const dualRaycastDistance = (interactors[0].maxRaycastDistance + interactors[1].maxRaycastDistance) * 0.5;
                    const zDistance = Math.min(dualRaycastDistance, this.offsetPosition.length);
                    const direction0 = interactors[0].direction ?? vec3.zero();
                    const direction1 = interactors[1].direction ?? vec3.zero();
                    const dualDirection = direction0.add(direction1).uniformScale(0.5);
                    const finalOffset = dualDirection.uniformScale(zDistance).add(this.hitPointToTransform);
                    newPosition = interactorMidPoint.add(finalOffset);
                    this.updatePosition(newPosition, this.useFilter);
                }
            }
            if (this.canScale() && this.initialInteractorDistance !== 0) {
                const distanceDifference = dualDistance - this.initialInteractorDistance;
                /*
                 * Calculate the scaling factor based on the distanceDifference and the initialInteractorDistance.
                 * This factor will be used to uniformly scale the object based on the change in distance.
                 */
                const uniformScalingFactor = 1 + distanceDifference / this.initialInteractorDistance;
                const updatedObjectScale = this.initialObjectScale.uniformScale(uniformScalingFactor);
                this.setScale(updatedObjectScale, this.useFilter);
            }
        }
        updatePosition(newPosition, useFilter = true) {
            if (newPosition === null) {
                return;
            }
            (0, validate_1.validate)(this.manipulateRoot);
            if (!this.enableXTranslation) {
                newPosition.x = this.manipulateRoot.getWorldPosition().x;
            }
            if (!this.enableYTranslation) {
                newPosition.y = this.manipulateRoot.getWorldPosition().y;
            }
            if (!this.enableZTranslation) {
                newPosition.z = this.manipulateRoot.getWorldPosition().z;
            }
            if (useFilter) {
                newPosition = this.translateFilter.filter(newPosition, getTime());
            }
            this.manipulateRoot.setWorldPosition(newPosition);
        }
        updateRotation(newRotation, useFilter = true) {
            if (newRotation === null) {
                return;
            }
            (0, validate_1.validate)(this.manipulateRoot);
            if (useFilter) {
                newRotation = this.rotationFilter.filter(newRotation, getTime());
            }
            this.manipulateRoot.setWorldRotation(newRotation);
        }
        calculateStretchFactor(interactor) {
            if (this.enableStretchZ === false) {
                return 1;
            }
            // Get distance from hand to camera along z axis only
            const startPoint = interactor.startPoint ?? vec3.zero();
            const interactorDistance = this.camera.getTransform().getInvertedWorldTransform().multiplyPoint(startPoint).z * -1;
            if (this.startStretchInteractorDistance === 0) {
                this.startStretchInteractorDistance = interactorDistance;
            }
            const dragAmount = interactorDistance - this.startStretchInteractorDistance;
            /*
             * Subtracting MAX_USER_ARM_EXTENSION_CM to ensure that the user can still interact with the interactable anywhere within their
             * normal range of motion. Without this, if you push the interactable out to the maxRaycastDistance and your arm is fully extended,
             * you will need to move closer to the interactable to interact with it again.
             */
            const maxDragDistance = Math.max(MIN_DRAG_DISTANCE_CM, interactor.maxRaycastDistance - MAX_USER_ARM_EXTENSION_CM);
            //scale movement based on distance from ray start to object
            const currDistance = this.rayDistanceMap.get(interactor) ?? 0;
            const distanceFactor = (this.zStretchFactorMax / maxDragDistance) * currDistance + this.zStretchFactorMin;
            const minStretch = -this.offsetPosition.length + 1;
            const maxStretch = Math.max(minStretch, -this.offsetPosition.length + maxDragDistance - 1);
            let finalStretchAmount = MathUtils.clamp(dragAmount * distanceFactor, minStretch, maxStretch);
            if ((interactor.inputType & Interactor_1.InteractorInputType.Mobile) !== 0) {
                const mobileInteractor = interactor;
                let mobileDragVector = vec3.zero();
                if (mobileInteractor.touchpadDragVector !== null) {
                    mobileDragVector = mobileInteractor.touchpadDragVector;
                }
                const mobileMoveAmount = mobileDragVector.z === 0 ? mobileDragVector.y * MOBILE_DRAG_MULTIPLIER : 0;
                this.mobileStretch += mobileMoveAmount * distanceFactor;
                // Don't let value accumulate out of bounds
                this.mobileStretch = Math.min(maxStretch - finalStretchAmount, Math.max(minStretch - finalStretchAmount, this.mobileStretch));
                finalStretchAmount += this.mobileStretch;
            }
            return finalStretchAmount;
        }
        clampUniformScale(scale, minScale, maxScale) {
            let finalScale = scale;
            /*
             * Calculate the ratios between the input scale and the min and max scales
             * for each axis (x, y, z). These ratios indicate how close the input scale
             * is to the min or max scale limits.
             */
            const minRatio = Math.min(scale.x / minScale.x, scale.y / minScale.y, scale.z / minScale.z);
            const maxRatio = Math.max(scale.x / maxScale.x, scale.y / maxScale.y, scale.z / maxScale.z);
            /*
             * If the minRatio is less than 1, it means at least one axis of the input
             * scale is smaller than the corresponding axis of the minScale. To preserve
             * the uniform scaling, apply a uniform scaling factor (1 / minRatio) to the
             * input scale, effectively scaling it up just enough to meet the minScale
             * limit on the smallest axis.
             */
            if (minRatio < 1) {
                finalScale = finalScale.uniformScale(1 / minRatio);
            }
            /*
             * If the maxRatio is greater than 1, it means at least one axis of the input
             * scale is larger than the corresponding axis of the maxScale. To preserve
             * the uniform scaling, apply a uniform scaling factor (1 / maxRatio) to the
             * input scale, effectively scaling it down just enough to meet the maxScale
             * limit on the largest axis.
             */
            if (maxRatio > 1) {
                finalScale = finalScale.uniformScale(1 / maxRatio);
            }
            return finalScale;
        }
        setScale(newScale, useFilter = true) {
            if (!this.canScale()) {
                return;
            }
            (0, validate_1.validate)(this.interactable);
            (0, validate_1.validate)(this.manipulateRoot);
            // Calculate min and max scale
            const minScale = this.originalLocalTransform.scale.uniformScale(this.minimumScaleFactor);
            const maxScale = this.originalLocalTransform.scale.uniformScale(this.maximumScaleFactor);
            // Calculate final scale
            let finalScale = this.clampUniformScale(newScale, minScale, maxScale);
            if (newScale !== finalScale) {
                this.onScaleLimitReachedEvent.invoke({
                    interactors: this.interactors,
                    interactable: this.interactable,
                    currentValue: finalScale
                });
            }
            if (useFilter) {
                finalScale = this.scaleFilter.filter(finalScale, getTime());
            }
            this.manipulateRoot.setLocalScale(finalScale);
        }
        /**
         * Resets the interactable's position
         */
        resetPosition(local = false) {
            (0, validate_1.validate)(this.manipulateRoot);
            if (local) {
                this.manipulateRoot.setLocalPosition(this.originalLocalTransform.position);
            }
            else {
                this.manipulateRoot.setWorldPosition(this.originalWorldTransform.position);
            }
        }
        /**
         * Resets the interactable's rotation
         */
        resetRotation(local = false) {
            (0, validate_1.validate)(this.manipulateRoot);
            if (local) {
                this.manipulateRoot.setLocalRotation(this.originalLocalTransform.rotation);
            }
            else {
                this.manipulateRoot.setWorldRotation(this.originalWorldTransform.rotation);
            }
        }
        /**
         * Resets the interactable's scale
         */
        resetScale(local = false) {
            (0, validate_1.validate)(this.manipulateRoot);
            if (local) {
                this.manipulateRoot.setLocalScale(this.originalLocalTransform.scale);
            }
            else {
                this.manipulateRoot.setWorldScale(this.originalWorldTransform.scale);
            }
        }
        /**
         * Resets the interactable's transform
         */
        resetTransform(local = false) {
            (0, validate_1.validate)(this.manipulateRoot);
            if (local) {
                this.manipulateRoot.setLocalTransform(this.originalLocalTransform.transform);
            }
            else {
                this.manipulateRoot.setWorldTransform(this.originalWorldTransform.transform);
            }
        }
    };
    __setFunctionName(_classThis, "InteractableManipulation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractableManipulation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractableManipulation = _classThis;
})();
exports.InteractableManipulation = InteractableManipulation;
//# sourceMappingURL=InteractableManipulation.js.map