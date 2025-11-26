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
exports.MouseInteractor = void 0;
var __selfType = requireType("./MouseInteractor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const BaseInteractor_1 = require("../Interactor/BaseInteractor");
const Interactor_1 = require("../Interactor/Interactor");
const MouseTargetProvider_1 = require("../Interactor/MouseTargetProvider");
const TouchRayProvider_1 = require("../Interactor/TouchRayProvider");
const TARGETING_VOLUME_MULTIPLIER = 1;
/**
 * {@link Interactor} implementation used for touch bases interactions
 * to interact with {@link Interactable} components with the mouse cursor
 * in preview window of Lens Studio
 *
 * There are no events for mouse hover in Lens Studio so this class uses some technics to
 * achieve both hover and trigger events.
 */
let MouseInteractor = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseInteractor_1.default;
    var MouseInteractor = _classThis = class extends _classSuper {
        __initialize() {
            super.__initialize();
            this.mouseTargetingMode = this.mouseTargetingMode;
            this.moveInDepth = this.moveInDepth;
            /**
             * Controls the maximum distance (in cm) that the mouse interactor will move back and forth along its ray direction
             * when moveInDepth is enabled. Higher values create larger depth movements, simulating interaction across a wider
             * z-range for testing 3D interactions.
             */
            this.moveInDepthAmount = this.moveInDepthAmount;
            this.isDown = false;
            if (!global.deviceInfoSystem.isEditor()) {
                this.interactionManager.deregisterInteractor(this);
                this.enabled = false;
            }
        }
        onAwake() {
            this.defineSceneEvents();
            this.defineTouchEvents();
            this.inputType = Interactor_1.InteractorInputType.Mouse;
            this.touchRayProvider = new TouchRayProvider_1.TouchRayProvider(this, this.maxRaycastDistance);
            this.mouseTargetProvider = new MouseTargetProvider_1.default(this, {
                rayProvider: this.touchRayProvider,
                maxRayDistance: this.maxRaycastDistance,
                targetingVolumeMultiplier: TARGETING_VOLUME_MULTIPLIER,
                shouldPreventTargetUpdate: () => {
                    return this.currentTrigger !== Interactor_1.InteractorTriggerType.None && this.previousTrigger !== Interactor_1.InteractorTriggerType.None;
                },
                spherecastRadii: this.spherecastRadii,
                spherecastDistanceThresholds: this.spherecastDistanceThresholds
            });
        }
        constructor() {
            super();
            this.mouseTargetingMode = this.mouseTargetingMode;
            this.moveInDepth = this.moveInDepth;
            /**
             * Controls the maximum distance (in cm) that the mouse interactor will move back and forth along its ray direction
             * when moveInDepth is enabled. Higher values create larger depth movements, simulating interaction across a wider
             * z-range for testing 3D interactions.
             */
            this.moveInDepthAmount = this.moveInDepthAmount;
            this.isDown = false;
            if (!global.deviceInfoSystem.isEditor()) {
                this.interactionManager.deregisterInteractor(this);
                this.enabled = false;
            }
        }
        get startPoint() {
            let p = this.mouseTargetProvider?.startPoint ?? null;
            if (p && this.moveInDepth) {
                const moveAmount = (Math.sin(getTime()) + 1) * 0.5 * this.moveInDepthAmount;
                p = p.add(this.mouseTargetProvider.direction.uniformScale(moveAmount));
            }
            return p;
        }
        get endPoint() {
            return this.mouseTargetProvider?.endPoint ?? null;
        }
        get direction() {
            return this.mouseTargetProvider?.direction ?? null;
        }
        get distanceToTarget() {
            return this.mouseTargetProvider.currentInteractableHitInfo?.hit.distance ?? null;
        }
        get targetHitPosition() {
            return this.mouseTargetProvider.currentInteractableHitInfo?.hit.position ?? null;
        }
        get targetHitInfo() {
            return this.mouseTargetProvider.currentInteractableHitInfo ?? null;
        }
        get activeTargetingMode() {
            return this.mouseTargetingMode;
        }
        get maxRaycastDistance() {
            return this._maxRaycastDistance;
        }
        get orientation() {
            return quat.quatIdentity();
        }
        get interactionStrength() {
            return this.currentTrigger === Interactor_1.InteractorTriggerType.Select ? 1 : 0.5;
        }
        /**
         * Set if the Interactor is should draw a debug gizmo of collider/raycasts in the scene.
         */
        set drawDebug(debug) {
            this._drawDebug = debug;
            // If the target providers have not been created yet, no need to manually set the drawDebug.
            if (!this.mouseTargetProvider) {
                return;
            }
            this.mouseTargetProvider.drawDebug = debug;
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
            return this.mouseTargetProvider.isHoveringInteractable(this.currentInteractable);
        }
        get hoveredInteractables() {
            const hoveredInteractables = Array.from(this.mouseTargetProvider.currentInteractableSet);
            return hoveredInteractables;
        }
        isHoveringInteractable(interactable) {
            return this.mouseTargetProvider.isHoveringInteractable(interactable);
        }
        isHoveringInteractableHierarchy(interactable) {
            if (this.mouseTargetProvider.isHoveringInteractable(interactable)) {
                return true;
            }
            for (const interactable of this.mouseTargetProvider.currentInteractableSet) {
                if (interactable.isDescendantOf(interactable)) {
                    return true;
                }
            }
            return false;
        }
        isActive() {
            return this.enabled && this.sceneObject.isEnabledInHierarchy;
        }
        isTargeting() {
            return this.touchRayProvider !== undefined && this.touchRayProvider.isAvailable();
        }
        updateState() {
            super.updateState();
            if (!this.isActive()) {
                return;
            }
            this.mouseTargetProvider.update();
            this.currentInteractable = this.mouseTargetProvider.currentInteractableHitInfo?.interactable ?? null;
            this.currentTrigger = this.isDown ? Interactor_1.InteractorTriggerType.Select : Interactor_1.InteractorTriggerType.None;
            this.updateDragVector();
            this.processTriggerEvents();
            this.handleSelectionLifecycle(this.mouseTargetProvider);
        }
        clearCurrentHitInfo() {
            this.mouseTargetProvider.clearCurrentInteractableHitInfo();
        }
        defineSceneEvents() {
            this.createEvent("OnEnableEvent").bind(() => {
                this.enabled = true;
            });
            this.createEvent("OnDisableEvent").bind(() => {
                this.enabled = false;
            });
        }
        defineTouchEvents() {
            this.createEvent("TouchStartEvent").bind((...args) => this.onTouchStartEvent(...args));
            this.createEvent("TouchEndEvent").bind((...args) => this.onTouchEndEvent(...args));
        }
        onTouchStartEvent(_ev) {
            this.isDown = true;
        }
        onTouchEndEvent(_ev) {
            this.isDown = false;
        }
    };
    __setFunctionName(_classThis, "MouseInteractor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MouseInteractor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MouseInteractor = _classThis;
})();
exports.MouseInteractor = MouseInteractor;
//# sourceMappingURL=MouseInteractor.js.map