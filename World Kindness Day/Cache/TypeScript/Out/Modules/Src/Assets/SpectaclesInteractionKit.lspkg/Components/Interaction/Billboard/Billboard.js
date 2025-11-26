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
exports.Billboard = void 0;
var __selfType = requireType("./Billboard");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const BillboardController_1 = require("./BillboardController");
/**
 * Billboard allows an object to rotate to face the camera.
 */
let Billboard = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Billboard = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._xAxisEnabled = this._xAxisEnabled;
            /**
             * Enables yaw rotation of the object to face the camera. When enabled, the object rotates around its Y-axis to
             * track camera position.
             */
            this._yAxisEnabled = this._yAxisEnabled;
            /**
             * Enables roll rotation of the object to align with camera orientation. When enabled, the object rotates around
             * its Z-axis to match camera's up direction.
             */
            this._zAxisEnabled = this._zAxisEnabled;
            /**
             * Defines a threshold in degrees before rotation is applied for each axis. The object only rotates when the angle
             * between its orientation and the camera exceeds this buffer, preventing small unwanted movements. Larger values
             * create more stable objects that rotate less frequently.
             */
            this._axisBufferDegrees = this._axisBufferDegrees;
            /**
             * Controls how fast the object rotates around each axis to follow camera movement. Configurable per axis (X,Y,Z)
             * where higher values (1.0) create instant following, while lower values (0.1) create a delayed, smoother follow
             * effect.
             */
            this._axisEasing = this._axisEasing;
            /**
             * @deprecated This property no longer changes the speed of the follow rotation. Use _axisEasing instead.
             */
            this.duration = this.duration;
        }
        __initialize() {
            super.__initialize();
            this._xAxisEnabled = this._xAxisEnabled;
            /**
             * Enables yaw rotation of the object to face the camera. When enabled, the object rotates around its Y-axis to
             * track camera position.
             */
            this._yAxisEnabled = this._yAxisEnabled;
            /**
             * Enables roll rotation of the object to align with camera orientation. When enabled, the object rotates around
             * its Z-axis to match camera's up direction.
             */
            this._zAxisEnabled = this._zAxisEnabled;
            /**
             * Defines a threshold in degrees before rotation is applied for each axis. The object only rotates when the angle
             * between its orientation and the camera exceeds this buffer, preventing small unwanted movements. Larger values
             * create more stable objects that rotate less frequently.
             */
            this._axisBufferDegrees = this._axisBufferDegrees;
            /**
             * Controls how fast the object rotates around each axis to follow camera movement. Configurable per axis (X,Y,Z)
             * where higher values (1.0) create instant following, while lower values (0.1) create a delayed, smoother follow
             * effect.
             */
            this._axisEasing = this._axisEasing;
            /**
             * @deprecated This property no longer changes the speed of the follow rotation. Use _axisEasing instead.
             */
            this.duration = this.duration;
        }
        onAwake() {
            const billboardConfig = {
                script: this,
                target: this.getSceneObject(),
                xAxisEnabled: this._xAxisEnabled,
                yAxisEnabled: this._yAxisEnabled,
                zAxisEnabled: this._zAxisEnabled,
                axisBufferDegrees: this._axisBufferDegrees,
                axisEasing: this._axisEasing
            };
            this.controller = new BillboardController_1.default(billboardConfig);
        }
        /**
         * Immediately resets the SceneObject to the rotation according to inputs regardless of easing.
         */
        snapToOffsetRotation() {
            this.controller.resetRotation();
        }
        get targetTransform() {
            return this.controller.targetTransform;
        }
        /**
         * @returns if the SceneObject billboards about the x-axis.
         */
        get xAxisEnabled() {
            return this._xAxisEnabled;
        }
        /**
         * @param enabled - defines if the SceneObject billboards about the x-axis.
         */
        set xAxisEnabled(enabled) {
            if (enabled === this._xAxisEnabled) {
                return;
            }
            this._xAxisEnabled = enabled;
            this.controller.enableAxisRotation(BillboardController_1.RotationAxis.X, enabled);
        }
        /**
         * @returns if the SceneObject billboards about the y-axis.
         */
        get yAxisEnabled() {
            return this._yAxisEnabled;
        }
        /**
         * @param enabled - defines if the SceneObject billboards about the y-axis.
         */
        set yAxisEnabled(enabled) {
            if (enabled === this._yAxisEnabled) {
                return;
            }
            this._yAxisEnabled = enabled;
            this.controller.enableAxisRotation(BillboardController_1.RotationAxis.Y, enabled);
        }
        /**
         * @returns if the SceneObject billboards about the z-axis.
         */
        get zAxisEnabled() {
            return this._zAxisEnabled;
        }
        /**
         * @param enabled - defines if the SceneObject billboards about the z-axis.
         */
        set zAxisEnabled(enabled) {
            if (enabled === this._zAxisEnabled) {
                return;
            }
            this._zAxisEnabled = enabled;
            this.controller.enableAxisRotation(BillboardController_1.RotationAxis.Z, enabled);
        }
        /**
         * @param easing - the vector defining the easing for each axis. For instant follow, use easing = (1,1,1).
         */
        set axisEasing(easing) {
            if (easing.equal(this._axisEasing)) {
                return;
            }
            this._axisEasing = easing;
            this.controller.axisEasing = easing;
        }
        /**
         * @returns the vector defining the easing for each axis.
         */
        get axisEasing() {
            return this._axisEasing;
        }
        /**
         * @param bufferDegrees - the vector defining the buffer for each axis.
         */
        set axisBufferDegrees(bufferDegrees) {
            if (bufferDegrees.equal(this._axisBufferDegrees)) {
                return;
            }
            this._axisBufferDegrees = bufferDegrees;
            this.controller.axisBufferDegrees = bufferDegrees;
        }
        /**
         * @returns the vector defining the buffer for each axis.
         */
        get axisBufferDegrees() {
            return this._axisBufferDegrees;
        }
        /**
         * Set the pivot point and pivoting Interactor to control the Billboard's pivot axis.
         * To turn off pivoting about a point, reset the pivot point to vec3.zero()
         * @param pivotPoint - the pivot point to billboard the target about in local space.
         * @param interactor - the pivoting Interactor.
         */
        setPivot(pivotPoint, interactor) {
            this.controller.setPivot(pivotPoint, interactor);
        }
        /**
         * Resets the pivot point to billboard the target about its own origin. Recommended to use after finishing
         * some spatial interaction that sets the pivotPoint of this component manually.
         */
        resetPivotPoint() {
            this.controller.resetPivotPoint();
        }
    };
    __setFunctionName(_classThis, "Billboard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Billboard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Billboard = _classThis;
})();
exports.Billboard = Billboard;
//# sourceMappingURL=Billboard.js.map