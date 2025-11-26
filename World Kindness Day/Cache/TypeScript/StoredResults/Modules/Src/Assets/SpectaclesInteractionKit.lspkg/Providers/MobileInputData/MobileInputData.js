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
exports.MobileInputData = void 0;
const OneEuroFilter_1 = require("../../Utils/OneEuroFilter");
const Singleton_1 = require("../../Decorators/Singleton");
const animate_1 = require("../../Utils/animate");
const Event_1 = require("../../Utils/Event");
const NativeLogger_1 = require("../../Utils/NativeLogger");
const MotionControllerProvider_1 = require("./MotionControllerProvider");
const TAG = "MobileInputData";
const TRANSLATE_FILTER_CONFIG = {
    frequency: 60,
    minCutoff: 3.5,
    beta: 0.5,
    dcutoff: 1
};
const ROTATION_FILTER_CONFIG = {
    frequency: 60,
    minCutoff: 1,
    beta: 2,
    dcutoff: 1
};
/**
 * This singleton class manages mobile input data, including motion controller state, position, and rotation. It uses filters to smooth the input data and provides events for tracking quality changes.
 *
 */
let MobileInputData = (() => {
    let _classDecorators = [Singleton_1.Singleton];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MobileInputData = _classThis = class {
        constructor() {
            this.log = new NativeLogger_1.default(TAG);
            this.animationManager = animate_1.AnimationManager.getInstance();
            this.translateFilter = new OneEuroFilter_1.OneEuroFilterVec3(TRANSLATE_FILTER_CONFIG);
            this.rotationFilter = new OneEuroFilter_1.OneEuroFilterQuat(ROTATION_FILTER_CONFIG);
            this._position = vec3.zero();
            this._rotation = quat.quatIdentity();
            this._trackingQuality = MotionController.TrackingQuality?.Unknown;
            this.onTrackingQualityChangeEvent = new Event_1.default();
            /**
             * Public API to subscribe to tracking quality change events.
             *
             * @returns The public api
             */
            this.onTrackingQualityChange = this.onTrackingQualityChangeEvent.publicApi();
            /** Enables filtering of position and rotation */
            this.filterPositionAndRotation = true;
            this.initializeMotionController();
            if (this._motionController === undefined) {
                return;
            }
            this.onControllerStateChange = this._motionController?.onControllerStateChange;
            this.onControllerStateChange?.add((state) => {
                this.log.d("Controller state changed to : " + state);
            });
            this.update(this.filterPositionAndRotation);
        }
        initializeMotionController() {
            this._motionControllerModule = MotionControllerProvider_1.default.getInstance().getModule();
            if (this._motionControllerModule === undefined) {
                return;
            }
            const options = MotionController.MotionControllerOptions.create();
            options.motionType = MotionController.MotionType.SixDoF;
            this._motionController = this._motionControllerModule.getController(options);
            this._trackingQuality = this._motionController.getTrackingQuality();
        }
        update(useFilter = true) {
            if (this._motionControllerModule === undefined || this._motionController === undefined) {
                return;
            }
            if (this._motionController?.isControllerAvailable()) {
                this._position = useFilter
                    ? this.translateFilter.filter(this._motionController.getWorldPosition(), getTime())
                    : this._motionController.getWorldPosition();
                this._rotation = useFilter
                    ? this.rotationFilter.filter(this._motionController.getWorldRotation(), getTime())
                    : this._motionController.getWorldRotation();
            }
            if (this._trackingQuality !== this._motionController.getTrackingQuality()) {
                this.onTrackingQualityChangeEvent.invoke(this._motionController.getTrackingQuality());
                this.log.v("Motion Controller Tracking Quality has changed to : " + this._motionController.getTrackingQuality());
                this.translateFilter.reset();
                this.rotationFilter.reset();
            }
            this._trackingQuality = this._motionController.getTrackingQuality();
            this.animationManager.requestAnimationFrame(() => this.update(this.filterPositionAndRotation));
        }
        /**
         * @returns the current Motion Controller module instance.
         */
        get motionController() {
            return this._motionController;
        }
        /**
         * @returns the current position.
         */
        get position() {
            return this._position;
        }
        /**
         * @returns the current rotation.
         */
        get rotation() {
            return this._rotation;
        }
        /**
         * @returns the current tracking quality or undefined is the module is not
         * available.
         */
        get trackingQuality() {
            if (this._motionController === undefined) {
                return undefined;
            }
            return this._motionController.getTrackingQuality();
        }
        /**
         * @returns if the mobile input data provider is available,
         * which means that it is receiving data.
         */
        isAvailable() {
            if (this._motionController === undefined) {
                return false;
            }
            return this._motionController.isControllerAvailable();
        }
    };
    __setFunctionName(_classThis, "MobileInputData");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileInputData = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileInputData = _classThis;
})();
exports.MobileInputData = MobileInputData;
//# sourceMappingURL=MobileInputData.js.map