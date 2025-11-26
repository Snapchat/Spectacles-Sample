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
exports.RocketGridContentCreator = void 0;
var __selfType = requireType("./RocketGridContentCreator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const RocketScrollViewItem_1 = require("./RocketScrollViewItem");
const TAG = "RocketGridContentCreator";
const log = new NativeLogger_1.default(TAG);
const Y_START = 0;
const Y_OFFSET = -5.4;
/**
 * This class is responsible for creating and initializing the content of a rocket grid. It uses object prefabs to instantiate items and configure their positions and properties.
 *
 */
let RocketGridContentCreator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var RocketGridContentCreator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.rocketConfigurator = this.rocketConfigurator;
            this.objectPrefabs = this.objectPrefabs;
        }
        __initialize() {
            super.__initialize();
            this.rocketConfigurator = this.rocketConfigurator;
            this.objectPrefabs = this.objectPrefabs;
        }
        onAwake() {
            if (isNull(this.rocketConfigurator)) {
                log.f("RocketGridContentCreator: rocketConfigurator is null!");
            }
            if (this.objectPrefabs.length === 0) {
                log.f("RocketGridContentCreator: objectPrefabs array is empty!");
            }
            const sceneObj = this.getSceneObject();
            const rocketScrollViewItemTypeName = RocketScrollViewItem_1.RocketScrollViewItem.getTypeName();
            for (let i = 0; i < this.objectPrefabs.length; i++) {
                const prefabIndex = i % this.objectPrefabs.length;
                const prefab = this.objectPrefabs[prefabIndex];
                const item = prefab.instantiate(sceneObj);
                const screenTransform = item.getComponent("Component.ScreenTransform");
                screenTransform.offsets.setCenter(new vec2(0, Y_START + Y_OFFSET * i));
                item.enabled = true;
                const rocketScrollViewItem = item.getComponent(rocketScrollViewItemTypeName);
                if (rocketScrollViewItem !== null)
                    rocketScrollViewItem.init(this.rocketConfigurator);
            }
        }
    };
    __setFunctionName(_classThis, "RocketGridContentCreator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RocketGridContentCreator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RocketGridContentCreator = _classThis;
})();
exports.RocketGridContentCreator = RocketGridContentCreator;
//# sourceMappingURL=RocketGridContentCreator.js.map