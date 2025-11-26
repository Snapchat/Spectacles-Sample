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
exports.ProximitySensor = void 0;
var __selfType = requireType("./ProximitySensor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Creates a spherical sensor volume to track overlaps with other colliders.
 *
 * This component actively maintains a list of objects within its radius and can be queried to find the closest point on
 * those objects.
 */
let ProximitySensor = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ProximitySensor = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * Display debug rendering for the proximity sensor.
             */
            this.debugModeEnabled = this.debugModeEnabled;
            /**
             * The radius of the spherical sensor in cemtimeters.
             */
            this.radius = this.radius;
            this.sensorCollider = null;
            this.overlappingColliders = new Set();
        }
        __initialize() {
            super.__initialize();
            /**
             * Display debug rendering for the proximity sensor.
             */
            this.debugModeEnabled = this.debugModeEnabled;
            /**
             * The radius of the spherical sensor in cemtimeters.
             */
            this.radius = this.radius;
            this.sensorCollider = null;
            this.overlappingColliders = new Set();
        }
        onAwake() {
            this.createSensorVolume();
        }
        /**
         * Updates the radius at runtime and automatically recalculates the larger detection radius needed for the buffer.
         * @param newRadius The new inner radius for the effect.
         */
        setRadius(newRadius) {
            this.radius = newRadius;
            if (this.sensorCollider && this.sensorCollider.shape) {
                const sphereShape = this.sensorCollider.shape;
                sphereShape.radius = this.radius;
            }
        }
        /**
         * Returns a list of all colliders currently inside the large detection volume.
         * @returns An array of the overlapping ColliderComponents.
         */
        getOverlappingColliders() {
            if (this.debugModeEnabled) {
                const sensorCenter = this.getSceneObject().getTransform().getWorldPosition();
                global.debugRenderSystem.drawSphere(sensorCenter, this.radius, new vec4(0.7, 0.7, 0.7, 1));
            }
            return Array.from(this.overlappingColliders);
        }
        createSensorVolume() {
            this.sensorCollider = this.getSceneObject().createComponent("Physics.ColliderComponent");
            const shape = Shape.createSphereShape();
            shape.radius = this.radius;
            this.sensorCollider.shape = shape;
            this.sensorCollider.intangible = true;
            this.sensorCollider.debugDrawEnabled = false;
            this.sensorCollider.onOverlapEnter.add(this.onOverlapEnter.bind(this));
            this.sensorCollider.onOverlapExit.add(this.onOverlapExit.bind(this));
        }
        onOverlapEnter(args) {
            const otherCollider = args.overlap.collider;
            if (otherCollider && otherCollider !== this.sensorCollider) {
                this.overlappingColliders.add(otherCollider);
            }
        }
        onOverlapExit(args) {
            const otherCollider = args.overlap.collider;
            if (otherCollider) {
                this.overlappingColliders.delete(otherCollider);
            }
        }
    };
    __setFunctionName(_classThis, "ProximitySensor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProximitySensor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProximitySensor = _classThis;
})();
exports.ProximitySensor = ProximitySensor;
//# sourceMappingURL=ProximitySensor.js.map