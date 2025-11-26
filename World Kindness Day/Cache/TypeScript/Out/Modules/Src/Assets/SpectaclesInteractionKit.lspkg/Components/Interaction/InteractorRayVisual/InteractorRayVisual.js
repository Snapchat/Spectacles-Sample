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
exports.InteractorRayVisual = void 0;
var __selfType = requireType("./InteractorRayVisual");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const LensConfig_1 = require("../../../Utils/LensConfig");
const springAnimate_1 = require("../../../Utils/springAnimate");
/**
 * Renders a 3D model to visualize an Interactor's ray, connecting the Interactor's origin to the target cursor
 * position. Its length and opacity is driven by the state of a corresponding InteractorCursor.
 */
let InteractorRayVisual = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractorRayVisual = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._isTriggering = false;
            this.triggerAmountSpring = springAnimate_1.SpringAnimate1D.smooth(0.2);
            this.currentTriggerAmount = 0.0;
            this.targetTriggerAmount = 0.0;
            this.modelVisual = null;
            this.modelMesh = null;
            this.triggerOffValue = 0.0;
            this.triggerOnValue = 1.0;
        }
        __initialize() {
            super.__initialize();
            this._isTriggering = false;
            this.triggerAmountSpring = springAnimate_1.SpringAnimate1D.smooth(0.2);
            this.currentTriggerAmount = 0.0;
            this.targetTriggerAmount = 0.0;
            this.modelVisual = null;
            this.modelMesh = null;
            this.triggerOffValue = 0.0;
            this.triggerOnValue = 1.0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.onStart());
            this.createEvent("OnEnableEvent").bind(() => {
                if (this.updateEvent)
                    this.updateEvent.enabled = true;
            });
            this.createEvent("OnDisableEvent").bind(() => {
                if (this.updateEvent)
                    this.updateEvent.enabled = false;
            });
            this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
        }
        onStart() {
            this.createModelVisual();
            this.updateEvent = LensConfig_1.LensConfig.getInstance().updateDispatcher.createUpdateEvent("InteractorRayVisualUpdate", () => this.update());
            this.currentTriggerAmount = this.triggerOffValue;
            this.targetTriggerAmount = this.triggerOffValue;
        }
        /**
         * Clean up.
         */
        onDestroy() {
            if (this.modelVisual) {
                this.modelVisual.destroy();
            }
            if (this.updateEvent) {
                LensConfig_1.LensConfig.getInstance().updateDispatcher.removeEvent(this.updateEvent);
                this.updateEvent = undefined;
            }
        }
        /**
         * The Material used to render the ray model. Cloning the material ensures that opacity changes do not affect other
         * objects using the same source material.
         */
        set rayMaterial(material) {
            this._rayMaterial = material.clone();
            if (this.modelMesh) {
                this.modelMesh.mainMaterial = this._rayMaterial;
            }
        }
        /**
         * The Material used to render the ray model.
         */
        get rayMaterial() {
            return this._rayMaterial;
        }
        /**
         * Sets if the ray should reflect a triggered state.
         */
        set isTriggering(triggering) {
            if (triggering === this._isTriggering) {
                return;
            }
            this.targetTriggerAmount = triggering ? this.triggerOnValue : this.triggerOffValue;
            this._isTriggering = triggering;
        }
        /**
         * Returns if the ray is in a triggered state.
         */
        get isTriggering() {
            return this._isTriggering;
        }
        update() {
            if (!this.modelVisual ||
                !this.interactor ||
                !this.cursor ||
                !this.interactor.startPoint ||
                !this.cursor.cursorPosition) {
                if (this.modelVisual)
                    this.modelVisual.enabled = false;
                return;
            }
            const rayAlpha = this.cursor.rayAlpha;
            if (rayAlpha <= 0.01) {
                this.modelVisual.enabled = false;
                return;
            }
            this.modelVisual.enabled = true;
            const isTriggering = this.interactor.currentTrigger !== Interactor_1.InteractorTriggerType.None;
            this.isTriggering = isTriggering;
            this.currentTriggerAmount = this.triggerAmountSpring.evaluate(this.currentTriggerAmount, this.targetTriggerAmount);
            this.applyTriggerParam(this.currentTriggerAmount);
            let startPoint = this.interactor.startPoint;
            let endPoint = this.cursor.cursorPosition;
            if (global.deviceInfoSystem.isEditor() && this.interactor.inputType === Interactor_1.InteractorInputType.Mouse) {
                const camera = WorldCameraFinderProvider_1.default.getInstance();
                const cameraUp = camera.getTransform().up;
                const offsetDistance = 2.0;
                const offset = cameraUp.uniformScale(-offsetDistance);
                startPoint = startPoint.add(offset);
                endPoint = endPoint.add(offset);
            }
            const direction = endPoint.sub(startPoint);
            const distance = direction.length;
            if (distance < 0.1) {
                this.modelVisual.enabled = false;
                return;
            }
            this.modelVisual.getTransform().setWorldPosition(startPoint);
            const rotQuat = quat.rotationFromTo(vec3.up(), direction.normalize());
            this.modelVisual.getTransform().setWorldRotation(rotQuat);
            this.modelVisual.getTransform().setWorldScale(new vec3(20, distance, 20));
            if (this.modelMesh && this.modelMesh.mainMaterial) {
                this.modelMesh.mainMaterial.mainPass.opacity = rayAlpha;
            }
        }
        createModelVisual() {
            const rayMesh = requireAsset("../../../Assets/Meshes/RayMesh.mesh");
            this.modelVisual = global.scene.createSceneObject("RayModel");
            this.modelVisual.setParent(this.getSceneObject());
            this.modelMesh = this.modelVisual.createComponent("Component.RenderMeshVisual");
            this.modelMesh.mesh = rayMesh;
            if (this._rayMaterial) {
                this.modelMesh.mainMaterial = this._rayMaterial;
            }
            else {
                this.modelMesh.mainMaterial = requireAsset("../../../Assets/Materials/RayMaterial.mat");
            }
            this.modelVisual.enabled = false;
        }
        get interactor() {
            return this._interactor ?? null;
        }
        applyTriggerParam(value) {
            if (!this.modelMesh || !this.modelMesh.mainMaterial) {
                return;
            }
            this.modelMesh.mainMaterial.mainPass.triggerAmount = value;
        }
    };
    __setFunctionName(_classThis, "InteractorRayVisual");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractorRayVisual = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractorRayVisual = _classThis;
})();
exports.InteractorRayVisual = InteractorRayVisual;
//# sourceMappingURL=InteractorRayVisual.js.map