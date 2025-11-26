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
exports.SyncKitBridge = void 0;
const Singleton_1 = require("../Decorators/Singleton");
/**
 * This class helps bridge native SIK components with SpectaclesSyncKit if
 * SpectaclesSyncKit is present in the lens and isSynced is enabled for certain SIK
 * components, such as ScrollView, Slider, ToggleButton, Container, and InteractableManipulation.
 *
 * This class is not meant to be used by developers for syncing logic, please use SpectaclesSyncKit
 * APIs directly!
 */
let SyncKitBridge = (() => {
    let _classDecorators = [Singleton_1.Singleton];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SyncKitBridge = _classThis = class {
        get SyncEntity() {
            return global.SyncEntity;
        }
        get networkIdTools() {
            return global.networkIdTools;
        }
        get sessionController() {
            return global.sessionController;
        }
        /**
         * Create a SyncEntity for a given script if SyncKit is present within the lens.
         * @param script - the given script to attach the SyncEntity to.
         * @returns a SyncEntity if SyncKit is present, null if otherwise.
         */
        createSyncEntity(script) {
            if (this.SyncEntity === undefined || this.networkIdTools === undefined) {
                return null;
            }
            else {
                const networkIdOptions = new this.networkIdTools.NetworkIdOptions(this.networkIdTools.NetworkIdType.Hierarchy);
                const syncEntity = new this.SyncEntity(script, undefined, false, RealtimeStoreCreateOptions.Persistence.Session, networkIdOptions);
                return syncEntity;
            }
        }
        /**
         * Maps a world mat4 into a mat4 local to the LocatedAt component's transform.
         */
        worldTransformToLocationTransform(matTransform) {
            const locationTransform = this.locatedAtComponent.getTransform();
            const locationInvertedTransform = locationTransform.getInvertedWorldTransform();
            const transformFromLocation = locationInvertedTransform.mult(matTransform);
            return transformFromLocation;
        }
        /**
         * Maps a mat4 local to the LocatedAt component's transform to a world mat4.
         */
        locationTransformToWorldTransform(matTransform) {
            const locationTransform = this.locatedAtComponent.getTransform();
            const locationWorldTransform = locationTransform.getWorldTransform();
            return locationWorldTransform.mult(matTransform); // Does this need to be reversed?
        }
        /**
         * Maps a world vec3 into a vec3 local to the LocatedAt component's transform.
         */
        worldVec3ToLocationVec3(vec) {
            const locationInvertedTransform = this.locatedAtComponent.getTransform().getInvertedWorldTransform();
            const vecFromLocation = locationInvertedTransform.multiplyDirection(vec);
            return vecFromLocation;
        }
        /**
         * Maps a vec3 local to the LocatedAt component's transform to a world vec3.
         */
        locationVec3ToWorldVec3(vec) {
            const locationWorldTransform = this.locatedAtComponent.getTransform().getWorldTransform();
            return locationWorldTransform.multiplyDirection(vec);
        }
        /**
         * Maps a world quat into a quat local to the LocatedAt component's transform.
         */
        worldQuatToLocationQuat(quat) {
            const locationInvertedQuat = this.locatedAtComponent.getTransform().getWorldRotation().invert();
            const quatFromLocation = locationInvertedQuat.multiply(quat);
            return quatFromLocation;
        }
        /**
         * Maps a quat local to the LocatedAt component's transform to a world quat.
         */
        locationQuatToWorldQuat(quat) {
            const locationWorldQuat = this.locatedAtComponent.getTransform().getWorldRotation();
            return locationWorldQuat.multiply(quat);
        }
        /**
         * Returns the LocatedAtComponent of the Colocated World if using a Connected Lens.
         */
        get locatedAtComponent() {
            return this.sessionController.locatedAtComponent;
        }
    };
    __setFunctionName(_classThis, "SyncKitBridge");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SyncKitBridge = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SyncKitBridge = _classThis;
})();
exports.SyncKitBridge = SyncKitBridge;
//# sourceMappingURL=SyncKitBridge.js.map