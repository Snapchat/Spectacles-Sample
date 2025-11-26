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
exports.Headlock = void 0;
var __selfType = requireType("./Headlock");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const HeadlockController_1 = require("./HeadlockController");
/**
 * This class provides functionality to position a SceneObject relative to the user's head movements. It allows
 * configuration of distance, translation, and rotation settings to control how the SceneObject follows or stays fixed
 * as the user moves their head. This creates a balanced experience between head-locked objects (which move with the
 * head) and world-space objects (which stay fixed in the environment).
 */
let Headlock = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Headlock = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._distance = this._distance;
            this._xzEnabled = this._xzEnabled;
            /**
             * How fast the SceneObject will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow.
             */
            this._xzEasing = this._xzEasing;
            /**
             * When enabled, the SceneObject will follow when the user moves their head along Y-axis."
             */
            this._yEnabled = this._yEnabled;
            /**
             * How fast the SceneObject will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow.
             */
            this._yEasing = this._yEasing;
            /**
             * The magnitude of change needed to activate a translation for the SceneObject to follow the camera.
             */
            this._translationBuffer = this._translationBuffer;
            this._lockedPitch = this._lockedPitch;
            /**
             * How fast the SceneObject will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow.
             */
            this._pitchEasing = this._pitchEasing;
            /**
             * How many degrees of offset from the center point should the SceneObject sit. Positive values place the element below
             * the center.
             */
            this._pitchOffsetDegrees = this._pitchOffsetDegrees;
            /**
             * How many degrees of leeway along each direction (up/down) before change starts to occur.
             */
            this._pitchBufferDegrees = this._pitchBufferDegrees;
            /**
             * When enabled, locks the SceneObject's position relative to the yaw-axis, keeping it fixed in place as the user
             * rotates their head left/right.
             */
            this._lockedYaw = this._lockedYaw;
            /**
             * How fast the SceneObject will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow.
             */
            this._yawEasing = this._yawEasing;
            /**
             * How many degrees of offset from the center point should the SceneObject sit. Positive values place the element to
             * the left.
             */
            this._yawOffsetDegrees = this._yawOffsetDegrees;
            /**
             * How many degrees of leeway along each direction (left/right) before change starts to occur.
             */
            this._yawBufferDegrees = this._yawBufferDegrees;
            /**
             * Snaps the object to its exact desired position, regardless of easing, unlocks, buffers, etc. Should be used after
             * modifying values that affect the desired position (such as offset, distance) to snap the object into place without
             * having a strange path.
             */
            this.snapToOffsetPosition = () => {
                this.controller.resetPosition();
            };
        }
        __initialize() {
            super.__initialize();
            this._distance = this._distance;
            this._xzEnabled = this._xzEnabled;
            /**
             * How fast the SceneObject will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow.
             */
            this._xzEasing = this._xzEasing;
            /**
             * When enabled, the SceneObject will follow when the user moves their head along Y-axis."
             */
            this._yEnabled = this._yEnabled;
            /**
             * How fast the SceneObject will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow.
             */
            this._yEasing = this._yEasing;
            /**
             * The magnitude of change needed to activate a translation for the SceneObject to follow the camera.
             */
            this._translationBuffer = this._translationBuffer;
            this._lockedPitch = this._lockedPitch;
            /**
             * How fast the SceneObject will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow.
             */
            this._pitchEasing = this._pitchEasing;
            /**
             * How many degrees of offset from the center point should the SceneObject sit. Positive values place the element below
             * the center.
             */
            this._pitchOffsetDegrees = this._pitchOffsetDegrees;
            /**
             * How many degrees of leeway along each direction (up/down) before change starts to occur.
             */
            this._pitchBufferDegrees = this._pitchBufferDegrees;
            /**
             * When enabled, locks the SceneObject's position relative to the yaw-axis, keeping it fixed in place as the user
             * rotates their head left/right.
             */
            this._lockedYaw = this._lockedYaw;
            /**
             * How fast the SceneObject will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow.
             */
            this._yawEasing = this._yawEasing;
            /**
             * How many degrees of offset from the center point should the SceneObject sit. Positive values place the element to
             * the left.
             */
            this._yawOffsetDegrees = this._yawOffsetDegrees;
            /**
             * How many degrees of leeway along each direction (left/right) before change starts to occur.
             */
            this._yawBufferDegrees = this._yawBufferDegrees;
            /**
             * Snaps the object to its exact desired position, regardless of easing, unlocks, buffers, etc. Should be used after
             * modifying values that affect the desired position (such as offset, distance) to snap the object into place without
             * having a strange path.
             */
            this.snapToOffsetPosition = () => {
                this.controller.resetPosition();
            };
        }
        onAwake() {
            const headlockConfig = {
                script: this,
                target: this.getSceneObject(),
                distance: this.distance,
                xzEnabled: this.xzEnabled,
                xzEasing: this.xzEasing,
                yEnabled: this.yEnabled,
                yEasing: this.yEasing,
                translationBuffer: this.translationBuffer,
                lockedPitch: this.lockedPitch,
                pitchEasing: this.pitchEasing,
                pitchOffsetDegrees: this.pitchOffsetDegrees,
                pitchBufferDegrees: this.pitchBufferDegrees,
                lockedYaw: this.lockedYaw,
                yawEasing: this.yawEasing,
                yawOffsetDegrees: this.yawOffsetDegrees,
                yawBufferDegrees: this.yawBufferDegrees,
                headlockComponent: this
            };
            this.controller = new HeadlockController_1.default(headlockConfig);
        }
        /**
         * Get how far the SceneObject will be from the user.
         */
        get distance() {
            return this._distance;
        }
        /**
         * Set how far the SceneObject will be from the user.
         */
        set distance(distance) {
            if (distance === this._distance) {
                return;
            }
            this._distance = distance;
            this.controller.distance = distance;
        }
        /**
         * Get if the SceneObject will follow when the user moves their head along XZ-plane. For most cases, this should stay
         * enabled.
         */
        get xzEnabled() {
            return this._xzEnabled;
        }
        /**
         * Sets if the SceneObject will follow when the user moves their head along XZ-plane. For most cases, this should stay
         * enabled.
         */
        set xzEnabled(enabled) {
            if (enabled === this._xzEnabled) {
                return;
            }
            this._xzEnabled = enabled;
            this.controller.xzEnabled = enabled;
        }
        /**
         * Get how fast the SceneObject will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow.
         */
        get xzEasing() {
            return this._xzEasing;
        }
        /**
         * Set how fast the SceneObject will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow.
         */
        set xzEasing(easing) {
            if (easing === this._distance) {
                return;
            }
            this._xzEasing = easing;
            this.controller.xzEasing = easing;
        }
        /**
         * Get if the SceneObject will follow when the user moves their head along Y-axis. For most cases, this should stay
         * enabled.
         */
        get yEnabled() {
            return this._yEnabled;
        }
        /**
         * Set if the SceneObject will follow when the user moves their head along Y-axis. For most cases, this should stay
         * enabled.
         */
        set yEnabled(enabled) {
            if (enabled === this._yEnabled) {
                return;
            }
            this._yEnabled = enabled;
            this.controller.yEnabled = enabled;
        }
        /**
         * Get how fast the SceneObject will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow.
         */
        get yEasing() {
            return this._yEasing;
        }
        /**
         * Set how fast the SceneObject will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow.
         */
        set yEasing(easing) {
            if (easing === this._yEasing) {
                return;
            }
            this._yEasing = easing;
            this.controller.yEasing = easing;
        }
        /**
         * Get the magnitude of change (in centimeters) needed to activate a translation for the target to follow the user's
         * head translation.
         */
        get translationBuffer() {
            return this._translationBuffer;
        }
        /**
         * Set the magnitude of change (in centimeters) needed to activate a translation for the target to follow the user's
         * head translation. To keep the SceneObject from 'wobbling' when the user has an unstable head, a small buffer is
         * recommended rather than 0.
         */
        set translationBuffer(buffer) {
            if (buffer === this._translationBuffer) {
                return;
            }
            this._translationBuffer = buffer;
            this.controller.translationBuffer = buffer;
        }
        /**
         * Get if the SceneObject will follow when the user moves their head along the pitch-axis (looking up/down)
         */
        get lockedPitch() {
            return this._lockedPitch;
        }
        /**
         * Set if the SceneObject will follow when the user moves their head along the pitch-axis (looking up/down)
         */
        set lockedPitch(locked) {
            if (locked === this._lockedPitch) {
                return;
            }
            this._lockedPitch = locked;
            this.controller.unlockPitch = !locked;
        }
        /**
         * Get how many degrees of offset from the center point should the target sit. Positive values place the element
         * below the center.
         */
        get pitchOffsetDegrees() {
            return this._pitchOffsetDegrees;
        }
        /**
         * Set how many degrees of offset from the center point should the target sit. Positive values place the element
         * below the center.
         */
        set pitchOffsetDegrees(degrees) {
            if (degrees === this._pitchOffsetDegrees) {
                return;
            }
            this._pitchOffsetDegrees = degrees;
            this.controller.pitchOffsetDegrees = degrees;
        }
        /**
         * Get how fast the SceneObject will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow.
         */
        get pitchEasing() {
            return this._pitchEasing;
        }
        /**
         * Set how fast the SceneObject will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow.
         */
        set pitchEasing(easing) {
            if (easing === this._pitchEasing) {
                return;
            }
            this._pitchEasing = easing;
            this.controller.pitchEasing = easing;
        }
        /**
         * Get how many degrees of leeway along each direction (up/down) before change starts to occur.
         */
        get pitchBufferDegrees() {
            return this._pitchBufferDegrees;
        }
        /**
         * Set how many degrees of leeway along each direction (up/down) before change starts to occur.
         */
        set pitchBufferDegrees(degrees) {
            if (degrees === this._pitchBufferDegrees) {
                return;
            }
            this._pitchBufferDegrees = degrees;
            this.controller.pitchBufferDegrees = degrees;
        }
        /**
         * Get if the SceneObject will follow when the user moves their head along the yaw-axis (looking left/right)
         */
        get lockedYaw() {
            return this._lockedYaw;
        }
        /**
         * Set if the SceneObject will follow when the user moves their head along the yaw-axis (looking left/right)
         */
        set lockedYaw(locked) {
            if (locked === this._lockedYaw) {
                return;
            }
            this._lockedYaw = locked;
            this.controller.unlockYaw = !locked;
        }
        /**
         * Get how many degrees of offset from the center point should the target sit. Positive values place the element to
         * the left.
         */
        get yawOffsetDegrees() {
            return this._yawOffsetDegrees;
        }
        /**
         * Set how many degrees of offset from the center point should the target sit. Positive values place the element to
         * the left.
         */
        set yawOffsetDegrees(degrees) {
            if (degrees === this._yawOffsetDegrees) {
                return;
            }
            this._yawOffsetDegrees = degrees;
            this.controller.yawOffsetDegrees = degrees;
        }
        /**
         * Get how fast the SceneObject will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow.
         */
        get yawEasing() {
            return this._yawEasing;
        }
        /**
         * Set how fast the SceneObject will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow.
         */
        set yawEasing(easing) {
            if (easing === this._yawEasing) {
                return;
            }
            this._yawEasing = easing;
            this.controller.yawEasing = easing;
        }
        /**
         * Get how many degrees of leeway along each direction (left/right) before change starts to occur.
         */
        get yawBufferDegrees() {
            return this._yawBufferDegrees;
        }
        /**
         * Set how many degrees of leeway along each direction (left/right) before change starts to occur.
         */
        set yawBufferDegrees(degrees) {
            if (degrees === this._yawBufferDegrees) {
                return;
            }
            this._yawBufferDegrees = degrees;
            this.controller.yawBufferDegrees = degrees;
        }
    };
    __setFunctionName(_classThis, "Headlock");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Headlock = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Headlock = _classThis;
})();
exports.Headlock = Headlock;
//# sourceMappingURL=Headlock.js.map