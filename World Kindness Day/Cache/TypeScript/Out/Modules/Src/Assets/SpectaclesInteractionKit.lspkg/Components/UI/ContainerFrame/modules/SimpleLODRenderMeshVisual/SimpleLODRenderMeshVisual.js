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
exports.SimpleLODRenderMeshVisual = void 0;
var __selfType = requireType("./SimpleLODRenderMeshVisual");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const WorldCameraFinderProvider_1 = require("../../../../../Providers/CameraProvider/WorldCameraFinderProvider");
const validate_1 = require("../../../../../Utils/validate");
const DEFAULT_SPACER = 50;
/**
 * This class provides a naive and simple Level Of Detail (LOD) implementation for RenderMeshVisual. It switches between different meshes based on the distance from the camera to the center of the object. The class does not support fading between meshes, but simply switches to the defined mesh at the specified depth.
 *
 * USAGE:
 * - Drop this component onto a scene object.
 * - Add meshes to the meshes array.
 * - Select thresholds at the given index (or else it falls back to default).
 * - Add the material that is shared across the RenderMeshVisuals.
 */
let SimpleLODRenderMeshVisual = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SimpleLODRenderMeshVisual = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.meshes = this.meshes;
            this.thresholds = this.thresholds;
            this.material = this.material;
            this.rmvs = [];
            this.distances = [];
            this.worldCamera = WorldCameraFinderProvider_1.default.getInstance();
            this.cameraTransform = this.worldCamera.getTransform();
            this.currentIndex = 0;
            this.setRenderOrder = (order) => {
                for (let i = 0; i < this.rmvs.length; i++) {
                    const thisRmv = this.rmvs[i];
                    thisRmv.setRenderOrder(order);
                }
            };
            this.addDistance = (distance) => {
                let lastDistance = 0;
                if (this.distances.length) {
                    lastDistance = this.distances[this.distances.length - 1];
                }
                this.distances.push(distance + lastDistance);
            };
            this.update = () => {
                (0, validate_1.validate)(this.transform);
                //
                // check and compare distances from camera
                //
                const currentDistanceSquared = this.cameraTransform
                    .getWorldPosition()
                    .distanceSquared(this.transform.getWorldPosition());
                let from = 0;
                let thisIndex = 0;
                let to;
                while (thisIndex < this.distances.length) {
                    to = this.distances[thisIndex] * this.distances[thisIndex];
                    if (currentDistanceSquared >= from && currentDistanceSquared < to) {
                        break;
                    }
                    else {
                        from = to;
                        thisIndex += 1;
                    }
                }
                //
                // if at a new threshold, swap the active rmv
                //
                if (thisIndex < this.rmvs.length && this.currentIndex !== thisIndex) {
                    this.currentIndex = thisIndex;
                    for (const rmv of this.rmvs) {
                        rmv.enabled = false;
                    }
                    this.rmvs[this.currentIndex].enabled = true;
                }
            };
        }
        __initialize() {
            super.__initialize();
            this.meshes = this.meshes;
            this.thresholds = this.thresholds;
            this.material = this.material;
            this.rmvs = [];
            this.distances = [];
            this.worldCamera = WorldCameraFinderProvider_1.default.getInstance();
            this.cameraTransform = this.worldCamera.getTransform();
            this.currentIndex = 0;
            this.setRenderOrder = (order) => {
                for (let i = 0; i < this.rmvs.length; i++) {
                    const thisRmv = this.rmvs[i];
                    thisRmv.setRenderOrder(order);
                }
            };
            this.addDistance = (distance) => {
                let lastDistance = 0;
                if (this.distances.length) {
                    lastDistance = this.distances[this.distances.length - 1];
                }
                this.distances.push(distance + lastDistance);
            };
            this.update = () => {
                (0, validate_1.validate)(this.transform);
                //
                // check and compare distances from camera
                //
                const currentDistanceSquared = this.cameraTransform
                    .getWorldPosition()
                    .distanceSquared(this.transform.getWorldPosition());
                let from = 0;
                let thisIndex = 0;
                let to;
                while (thisIndex < this.distances.length) {
                    to = this.distances[thisIndex] * this.distances[thisIndex];
                    if (currentDistanceSquared >= from && currentDistanceSquared < to) {
                        break;
                    }
                    else {
                        from = to;
                        thisIndex += 1;
                    }
                }
                //
                // if at a new threshold, swap the active rmv
                //
                if (thisIndex < this.rmvs.length && this.currentIndex !== thisIndex) {
                    this.currentIndex = thisIndex;
                    for (const rmv of this.rmvs) {
                        rmv.enabled = false;
                    }
                    this.rmvs[this.currentIndex].enabled = true;
                }
            };
        }
        onAwake() {
            this.object = this.getSceneObject();
            this.transform = this.object.getTransform();
            const clonedMaterial = this.material.clone();
            for (let i = 0; i < this.meshes.length; i++) {
                const distanceMesh = this.meshes[i];
                const thisRMV = this.object.createComponent("RenderMeshVisual");
                thisRMV.mesh = distanceMesh;
                thisRMV.mainMaterial = clonedMaterial;
                thisRMV.enabled = false;
                this.rmvs.push(thisRMV);
                this.addDistance(this.thresholds[i] ? this.thresholds[i] : DEFAULT_SPACER);
            }
            this.rmvs[this.currentIndex].enabled = true;
            this.createEvent("UpdateEvent").bind(this.update);
        }
    };
    __setFunctionName(_classThis, "SimpleLODRenderMeshVisual");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SimpleLODRenderMeshVisual = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SimpleLODRenderMeshVisual = _classThis;
})();
exports.SimpleLODRenderMeshVisual = SimpleLODRenderMeshVisual;
//# sourceMappingURL=SimpleLODRenderMeshVisual.js.map