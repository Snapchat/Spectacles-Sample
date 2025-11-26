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
exports.MobileInteractor = void 0;
var __selfType = requireType("./MobileInteractor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const InteractableManipulation_1 = require("../../Components/Interaction/InteractableManipulation/InteractableManipulation");
const MobileInputData_1 = require("../../Providers/MobileInputData/MobileInputData");
const NativeLogger_1 = require("../../Utils/NativeLogger");
const validate_1 = require("../../Utils/validate");
const BaseInteractor_1 = require("../Interactor/BaseInteractor");
const DragProvider_1 = require("../Interactor/DragProvider");
const IndirectTargetProvider_1 = require("../Interactor/IndirectTargetProvider");
const Interactor_1 = require("../Interactor/Interactor");
const MobileRayProvider_1 = require("../Interactor/MobileRayProvider");
const TAG = "MobileInteractor";
// These thresholds are not for deciding when to invoke onDragStart, but rather to tell the MobileInteractor when to
// switch what type of drag to track.
const INITIAL_TOUCHPAD_SWITCH_THRESHOLD = 0.05; // Screen position units mapped from the phone's touch surface
const OVERRIDE_TOUCHPAD_SWITCH_THRESHOLD = 0.1; // Screen position units mapped from the phone's touch surface
const INITIAL_SIX_DOF_SWITCH_THRESHOLD = 3; // World units in c
const OVERRIDE_SIX_DOF_SWITCH_THRESHOLD = 20; // World units in c
const MANIPULATE_SIX_DOF_SWITCH_THRESHOLD = 2; // World units in c
/**
 * Interactor for the Mobile Controller
 */
let MobileInteractor = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseInteractor_1.default;
    var MobileInteractor = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.initializePositionAndRotationFilter = this.initializePositionAndRotationFilter;
            /**
             * Controls how much touchpad movement is amplified when translating touch input to 3D space.
             * Higher values result in faster/larger movements from small touch gestures, while lower values
             * provide more precise control requiring larger touch gestures to achieve the same movement.
             */
            this._touchpadScrollSpeed = this._touchpadScrollSpeed;
            /**
             * Controls the minimum distance a finger must move on the touchpad to be considered a drag.
             * Uses normalized screen coordinates (0-1), where 0.05 represents 5% of the screen width/height.
             * Lower values make dragging more sensitive to small movements.
             */
            this.touchpadDragThreshold = this.touchpadDragThreshold;
            this._dragType = null;
            this.isManipulating = false;
            // Native Logging
            this.log = new NativeLogger_1.default(TAG);
            this.mobileInputData = MobileInputData_1.MobileInputData.getInstance();
            this.touchpadStartPosition = null;
            this.touchpadCurrentPosition = null;
            this.sixDofStartPosition = null;
            this.sixDofCurrentPosition = null;
            this.sixDofDragProvider = new DragProvider_1.DragProvider(this.indirectDragThreshold);
            this.touchpadDragProvider = new DragProvider_1.DragProvider(this.touchpadDragThreshold);
        }
        __initialize() {
            super.__initialize();
            this.initializePositionAndRotationFilter = this.initializePositionAndRotationFilter;
            /**
             * Controls how much touchpad movement is amplified when translating touch input to 3D space.
             * Higher values result in faster/larger movements from small touch gestures, while lower values
             * provide more precise control requiring larger touch gestures to achieve the same movement.
             */
            this._touchpadScrollSpeed = this._touchpadScrollSpeed;
            /**
             * Controls the minimum distance a finger must move on the touchpad to be considered a drag.
             * Uses normalized screen coordinates (0-1), where 0.05 represents 5% of the screen width/height.
             * Lower values make dragging more sensitive to small movements.
             */
            this.touchpadDragThreshold = this.touchpadDragThreshold;
            this._dragType = null;
            this.isManipulating = false;
            // Native Logging
            this.log = new NativeLogger_1.default(TAG);
            this.mobileInputData = MobileInputData_1.MobileInputData.getInstance();
            this.touchpadStartPosition = null;
            this.touchpadCurrentPosition = null;
            this.sixDofStartPosition = null;
            this.sixDofCurrentPosition = null;
            this.sixDofDragProvider = new DragProvider_1.DragProvider(this.indirectDragThreshold);
            this.touchpadDragProvider = new DragProvider_1.DragProvider(this.touchpadDragThreshold);
        }
        onAwake() {
            this.inputType = Interactor_1.InteractorInputType.Mobile;
            this.mobileInputData.filterPositionAndRotation = this.initializePositionAndRotationFilter;
            this.defineTouchEvents();
            this.rayProvider = new MobileRayProvider_1.MobileRayProvider();
            this.indirectTargetProvider = new IndirectTargetProvider_1.default(this, {
                maxRayDistance: this.maxRaycastDistance,
                rayProvider: this.rayProvider,
                targetingVolumeMultiplier: this.indirectTargetingVolumeMultiplier,
                shouldPreventTargetUpdate: () => {
                    return this.preventTargetUpdate();
                },
                spherecastRadii: this.spherecastRadii,
                spherecastDistanceThresholds: this.spherecastDistanceThresholds
            });
        }
        get touchpadScrollSpeed() {
            return this._touchpadScrollSpeed;
        }
        get startPoint() {
            return this.indirectTargetProvider?.startPoint ?? null;
        }
        get endPoint() {
            return this.indirectTargetProvider?.endPoint ?? null;
        }
        get direction() {
            return this.indirectTargetProvider?.direction ?? null;
        }
        get orientation() {
            return this.mobileInputData.rotation;
        }
        get distanceToTarget() {
            return this.indirectTargetProvider?.currentInteractableHitInfo?.hit.distance ?? null;
        }
        get targetHitPosition() {
            return this.indirectTargetProvider?.currentInteractableHitInfo?.hit.position ?? null;
        }
        get targetHitInfo() {
            return this.indirectTargetProvider?.currentInteractableHitInfo ?? null;
        }
        get activeTargetingMode() {
            return this.indirectTargetProvider?.targetingMode ?? Interactor_1.TargetingMode.None;
        }
        get maxRaycastDistance() {
            return this._maxRaycastDistance;
        }
        get interactionStrength() {
            return this.touchpadStartPosition !== null ? 1 : 0;
        }
        /**
         * Set if the Interactor is should draw a debug gizmo of collider/raycasts in the scene.
         */
        set drawDebug(debug) {
            this._drawDebug = debug;
            // If the target provider has not been created yet, no need to manually set the drawDebug.
            if (!this.indirectTargetProvider) {
                return;
            }
            this.indirectTargetProvider.drawDebug = debug;
        }
        /**
         * @returns if the Interactor is currently drawing a debug gizmo of collider/raycasts in the scene.
         */
        get drawDebug() {
            return this._drawDebug;
        }
        get isHoveringCurrentInteractable() {
            if (!this.currentInteractable) {
                return null;
            }
            return this.indirectTargetProvider.isHoveringInteractable(this.currentInteractable);
        }
        get hoveredInteractables() {
            const hoveredInteractables = Array.from(this.indirectTargetProvider.currentInteractableSet);
            return hoveredInteractables;
        }
        isHoveringInteractable(interactable) {
            return this.indirectTargetProvider.isHoveringInteractable(interactable);
        }
        isHoveringInteractableHierarchy(interactable) {
            if (this.indirectTargetProvider.isHoveringInteractable(interactable)) {
                return true;
            }
            for (const interactable of this.indirectTargetProvider.currentInteractableSet) {
                if (interactable.isDescendantOf(interactable)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @returns the current drag vector of the phone's SixDof position in world space.
         */
        get sixDofDragVector() {
            return this.sixDofDragProvider.currentDragVector;
        }
        /**
         * @returns the current drag vector of the phone's touchpad in normalized screen space (with bottom-left corner representing [0,0]).
         */
        get touchpadDragVector() {
            return this.touchpadDragProvider.currentDragVector;
        }
        updateState() {
            super.updateState();
            if (!this.mobileInputData.isAvailable()) {
                return;
            }
            (0, validate_1.validate)(this.indirectTargetProvider);
            this.indirectTargetProvider.update();
            this.currentInteractable = this.indirectTargetProvider.currentInteractableHitInfo?.interactable ?? null;
            this.currentTrigger =
                this.touchpadStartPosition !== null ? Interactor_1.InteractorTriggerType.Select : Interactor_1.InteractorTriggerType.None;
            if ((this.currentTrigger & Interactor_1.InteractorTriggerType.Select) !== 0) {
                if (this.sixDofStartPosition === null) {
                    this.sixDofStartPosition = this.sixDofSwitchPosition;
                }
                this.sixDofCurrentPosition = this.sixDofSwitchPosition;
            }
            else {
                this.sixDofCurrentPosition = this.sixDofStartPosition = null;
            }
            this.updateDragType();
            this.updateDragVector();
            this.processTriggerEvents();
            this.handleSelectionLifecycle(this.indirectTargetProvider);
        }
        /** @inheritdoc */
        isTargeting() {
            return this.mobileInputData.isAvailable();
        }
        /** @inheritdoc */
        isActive() {
            return this.mobileInputData.isAvailable() && this.sceneObject.isEnabledInHierarchy;
        }
        clearCurrentHitInfo() {
            (0, validate_1.validate)(this.indirectTargetProvider);
            this.indirectTargetProvider.clearCurrentInteractableHitInfo();
        }
        defineTouchEvents() {
            this.createEvent("TouchStartEvent").bind((...args) => this.onTouchStartEvent(...args));
            this.createEvent("TouchMoveEvent").bind((...args) => this.onTouchMoveEvent(...args));
            this.createEvent("TouchEndEvent").bind((..._args) => this.onTouchEndEvent());
        }
        onTouchStartEvent(ev) {
            this.touchpadCurrentPosition = this.touchpadStartPosition = ev.getTouchPosition();
            if (this.currentInteractable !== null) {
                this.isManipulating =
                    this.currentInteractable.sceneObject.getComponent(InteractableManipulation_1.InteractableManipulation.getTypeName()) !== null;
            }
            if (!global.deviceInfoSystem.isEditor) {
                this.log.v("Mobile Interactor On Touch Start Event");
            }
        }
        onTouchMoveEvent(ev) {
            this.touchpadCurrentPosition = ev.getTouchPosition();
        }
        onTouchEndEvent() {
            this.touchpadStartPosition = this.touchpadCurrentPosition = null;
            this.dragType = null;
            this.dragProvider.clear();
            this.isManipulating = false;
            if (!global.deviceInfoSystem.isEditor) {
                this.log.v("Mobile Interactor On Touch End Event");
            }
        }
        preventTargetUpdate() {
            // If there's no current touch there's no trigger happening
            if (!this.touchpadStartPosition) {
                return false;
            }
            return true;
        }
        updateDragType() {
            if (this.currentTrigger === Interactor_1.InteractorTriggerType.None) {
                return;
            }
            if (this.dragType !== Interactor_1.DragType.Touchpad &&
                this.touchpadStartPosition !== null &&
                this.touchpadCurrentPosition !== null &&
                this.touchpadCurrentPosition?.sub(this.touchpadStartPosition).length > this.touchpadSwitchThreshold) {
                this.dragType = Interactor_1.DragType.Touchpad;
                return;
            }
            if (this.dragType !== Interactor_1.DragType.SixDof &&
                this.sixDofStartPosition !== null &&
                this.sixDofCurrentPosition !== null &&
                this.sixDofCurrentPosition?.sub(this.sixDofStartPosition).length > this.sixDofSwitchThreshold) {
                this.dragType = Interactor_1.DragType.SixDof;
                return;
            }
        }
        clearDragProviders() {
            this.touchpadDragProvider.clear();
            this.sixDofDragProvider.clear();
            this.planecastDragProvider.clear();
        }
        updateDragVector() {
            if ((this.currentTrigger & Interactor_1.InteractorTriggerType.Select) !== 0) {
                // Update both drag providers in case drag type will switch.
                this.touchpadDragProvider.getDragVector(this.getTouchpadDragPoint(), this.currentInteractable?.enableInstantDrag ?? null);
                this.sixDofDragProvider.getDragVector(this.getSixDofDragPoint(), this.currentInteractable?.enableInstantDrag ?? null);
                this.currentDragVector = this.dragProvider.currentDragVector;
                this.planecastDragProvider.getDragVector(this.planecastPoint, this.currentInteractable?.enableInstantDrag ?? null);
            }
            else {
                this.currentDragVector = null;
                this.clearDragProviders();
            }
        }
        getDragPoint() {
            if (this.dragType === Interactor_1.DragType.SixDof) {
                return this.getSixDofDragPoint();
            }
            else if (this.dragType === Interactor_1.DragType.Touchpad) {
                return this.getTouchpadDragPoint();
            }
            return null;
        }
        getSixDofDragPoint() {
            return this.endPoint;
        }
        getTouchpadDragPoint() {
            if (this.touchpadCurrentPosition !== null) {
                return new vec3(
                // Remap the touchpad space such that the bottom-left corner is [0,0] rather than the top-left corner.
                this.touchpadCurrentPosition.x, 1 - this.touchpadCurrentPosition.y, 0).uniformScale(this.touchpadScrollSpeed);
            }
            return null;
        }
        /**
         * At the beginning of interaction, the switch threshold should be lower to immediately start tracking the user's desired type of drag.
         * However if the user is already dragging via Touchpad, switching to drag via 6DoF should be more difficult to avoid accidental drag interruptions.
         * In the case of manipulation, we use a threshold for the startPosition of the ray instead as a design choice.
         */
        get sixDofSwitchThreshold() {
            if (this.isManipulating) {
                return MANIPULATE_SIX_DOF_SWITCH_THRESHOLD;
            }
            if (this.dragType === Interactor_1.DragType.Touchpad) {
                return OVERRIDE_SIX_DOF_SWITCH_THRESHOLD;
            }
            return INITIAL_SIX_DOF_SWITCH_THRESHOLD;
        }
        /**
         * At the beginning of interaction, the switch threshold should be lower to immediately start tracking the user's desired type of drag.
         * However if the user is already dragging via 6Dof, switching to drag via Touchpad should be more difficult to avoid accidental drag interruptions.
         */
        get touchpadSwitchThreshold() {
            if (this.dragType === Interactor_1.DragType.SixDof) {
                return OVERRIDE_TOUCHPAD_SWITCH_THRESHOLD;
            }
            return INITIAL_TOUCHPAD_SWITCH_THRESHOLD;
        }
        /**
         * If we are manipulating, we use the location of the phone as the start point.
         * Otherwise, we use the endpoint of the raycast.
         */
        get sixDofSwitchPosition() {
            return this.isManipulating ? this.startPoint : this.endPoint;
        }
        get dragType() {
            return this._dragType;
        }
        set dragType(type) {
            if (type === this.dragType) {
                return;
            }
            this._dragType = type;
            switch (type) {
                case Interactor_1.DragType.SixDof:
                    this.dragProvider = this.sixDofDragProvider;
                    // Reset the start position of Touchpad to accurately track when the user wants to switch to using Touchpad drag.
                    this.touchpadStartPosition = this.touchpadCurrentPosition;
                    break;
                case Interactor_1.DragType.Touchpad:
                    this.dragProvider = this.touchpadDragProvider;
                    // Reset the start position of 6DoF to accurately track when the user wants to switch to using 6DoF drag.
                    this.sixDofStartPosition = this.sixDofCurrentPosition;
            }
        }
    };
    __setFunctionName(_classThis, "MobileInteractor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileInteractor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileInteractor = _classThis;
})();
exports.MobileInteractor = MobileInteractor;
//# sourceMappingURL=MobileInteractor.js.map