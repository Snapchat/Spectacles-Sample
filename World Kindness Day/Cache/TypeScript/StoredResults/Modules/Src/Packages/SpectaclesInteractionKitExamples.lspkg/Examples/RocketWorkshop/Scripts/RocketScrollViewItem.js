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
exports.RocketScrollViewItem = void 0;
var __selfType = requireType("./RocketScrollViewItem");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const SceneObjectUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/SceneObjectUtils");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const TAG = "RocketScrollViewItem";
const log = new NativeLogger_1.default(TAG);
/**
 * This class represents an item in the rocket scroll view. It handles interactions and communicates with the RocketConfigurator to update the rocket configuration.
 *
 */
let RocketScrollViewItem = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var RocketScrollViewItem = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.style = this.style;
            this.item = this.item;
            this.interactable = null;
            this.rocketConfigurator = null;
            this.setupCallbacks = () => {
                (0, validate_1.validate)(this.interactable);
                this.interactable.onTriggerEnd.add(this.onTriggerEndEvent);
            };
            this.onTriggerEndEvent = () => {
                (0, validate_1.validate)(this.rocketConfigurator);
                this.rocketConfigurator.setRocketPartSection(this.style.text, this.item.text);
            };
            this.registerRocketListItemBacking = () => {
                const backingObject = (0, SceneObjectUtils_1.findSceneObjectByName)(this.sceneObject, "Background");
                (0, validate_1.validate)(backingObject);
                this.backingImage = backingObject.getComponent("Image");
                (0, validate_1.validate)(this.backingImage, "Backing image is undefined!");
                this.backingImage.mainMaterial = this.backingImage.mainMaterial.clone();
                (0, validate_1.validate)(this.rocketConfigurator);
                this.rocketConfigurator.registerRocketListItemBacking(this.style.text, this.item.text, this.backingImage);
            };
        }
        __initialize() {
            super.__initialize();
            this.style = this.style;
            this.item = this.item;
            this.interactable = null;
            this.rocketConfigurator = null;
            this.setupCallbacks = () => {
                (0, validate_1.validate)(this.interactable);
                this.interactable.onTriggerEnd.add(this.onTriggerEndEvent);
            };
            this.onTriggerEndEvent = () => {
                (0, validate_1.validate)(this.rocketConfigurator);
                this.rocketConfigurator.setRocketPartSection(this.style.text, this.item.text);
            };
            this.registerRocketListItemBacking = () => {
                const backingObject = (0, SceneObjectUtils_1.findSceneObjectByName)(this.sceneObject, "Background");
                (0, validate_1.validate)(backingObject);
                this.backingImage = backingObject.getComponent("Image");
                (0, validate_1.validate)(this.backingImage, "Backing image is undefined!");
                this.backingImage.mainMaterial = this.backingImage.mainMaterial.clone();
                (0, validate_1.validate)(this.rocketConfigurator);
                this.rocketConfigurator.registerRocketListItemBacking(this.style.text, this.item.text, this.backingImage);
            };
        }
        onAwake() { }
        init(rocketConfigurator) {
            this.rocketConfigurator = rocketConfigurator;
            this.registerRocketListItemBacking();
            if (isNull(this.rocketConfigurator))
                log.f("RocketConfigurator is null!");
            (0, validate_1.validate)(this.backingImage);
            this.interactable = this.backingImage.sceneObject.getComponent(Interactable_1.Interactable.getTypeName());
            if (isNull(this.interactable))
                log.f("Interactable component not found!");
            this.setupCallbacks();
        }
    };
    __setFunctionName(_classThis, "RocketScrollViewItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RocketScrollViewItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RocketScrollViewItem = _classThis;
})();
exports.RocketScrollViewItem = RocketScrollViewItem;
//# sourceMappingURL=RocketScrollViewItem.js.map