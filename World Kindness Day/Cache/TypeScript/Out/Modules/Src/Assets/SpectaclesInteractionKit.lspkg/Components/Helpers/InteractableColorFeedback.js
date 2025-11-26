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
exports.InteractableColorFeedback = void 0;
var __selfType = requireType("./InteractableColorFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const validate_1 = require("../../Utils/validate");
const Interactable_1 = require("../Interaction/Interactable/Interactable");
/**
 * This class provides visual feedback by changing the color of mesh visuals based on interaction events such as hover,
 * pinch, and disable. It allows customization of colors for different interaction states.
 */
let InteractableColorFeedback = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractableColorFeedback = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * The color applied when the Interactables are in their default state (not being interacted with).
             */
            this.defaultColor = this.defaultColor;
            /**
             * The color applied to Interactables when an Interactor is hovering over it.
             */
            this.hoverColor = this.hoverColor;
            /**
             * The color applied to Interactables when they are being actively pinched.
             */
            this.pinchedColor = this.pinchedColor;
            /**
             * The color applied to Interactables when they are disabled.
             */
            this.disabledColor = this.disabledColor;
            /**
             * The meshes which will have their baseColor changed on pinch/hover/enable/disable events.
             */
            this.meshVisuals = this.meshVisuals;
            this.interactable = null;
            this.meshMaterials = [];
        }
        __initialize() {
            super.__initialize();
            /**
             * The color applied when the Interactables are in their default state (not being interacted with).
             */
            this.defaultColor = this.defaultColor;
            /**
             * The color applied to Interactables when an Interactor is hovering over it.
             */
            this.hoverColor = this.hoverColor;
            /**
             * The color applied to Interactables when they are being actively pinched.
             */
            this.pinchedColor = this.pinchedColor;
            /**
             * The color applied to Interactables when they are disabled.
             */
            this.disabledColor = this.disabledColor;
            /**
             * The meshes which will have their baseColor changed on pinch/hover/enable/disable events.
             */
            this.meshVisuals = this.meshVisuals;
            this.interactable = null;
            this.meshMaterials = [];
        }
        onAwake() {
            this.defineScriptEvents();
        }
        defineScriptEvents() {
            this.createEvent("OnStartEvent").bind(() => {
                this.init();
            });
        }
        init() {
            this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            (0, validate_1.validate)(this.interactable, "InteractableColorFeedback requires Interactable.");
            this.setupMaterials();
            this.setupInteractableCallbacks(this.interactable);
        }
        changeColor(color) {
            this.meshMaterials.forEach(function (material) {
                material.mainPass.baseColor = color;
            });
        }
        setupInteractableCallbacks(interactable) {
            (0, validate_1.validate)(interactable);
            interactable.onHoverEnter.add((event) => {
                if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
                    return;
                }
                this.changeColor(event.interactor.isTriggering ? this.pinchedColor : this.hoverColor);
            });
            interactable.onHoverExit.add(() => {
                this.changeColor(this.defaultColor);
            });
            interactable.onTriggerStart.add(() => {
                this.changeColor(this.pinchedColor);
            });
            interactable.onTriggerEnd.add(() => {
                this.changeColor(this.hoverColor);
            });
            interactable.onTriggerEndOutside.add(() => {
                this.changeColor(this.defaultColor);
            });
            interactable.onTriggerCanceled.add(() => {
                this.changeColor(this.defaultColor);
            });
            interactable.onSyncHoverEnter.add((event) => {
                if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
                    return;
                }
                this.changeColor(event.interactor.isTriggering ? this.pinchedColor : this.hoverColor);
            });
            interactable.onSyncHoverExit.add(() => {
                this.changeColor(this.defaultColor);
            });
            interactable.onSyncTriggerStart.add(() => {
                this.changeColor(this.pinchedColor);
            });
            interactable.onSyncTriggerEnd.add(() => {
                this.changeColor(this.hoverColor);
            });
            interactable.onSyncTriggerEndOutside.add(() => {
                this.changeColor(this.defaultColor);
            });
            interactable.onSyncTriggerCanceled.add(() => {
                this.changeColor(this.defaultColor);
            });
            interactable.createEvent("OnEnableEvent").bind(() => {
                this.changeColor(this.defaultColor);
            });
            interactable.createEvent("OnDisableEvent").bind(() => {
                this.changeColor(this.disabledColor);
            });
        }
        setupMaterials() {
            for (let i = 0; i < this.meshVisuals.length; i++) {
                const clonedMaterial = this.meshVisuals[i].mainMaterial.clone();
                this.meshMaterials.push(clonedMaterial);
                this.meshVisuals[i].mainMaterial = clonedMaterial;
            }
            this.changeColor(this.defaultColor);
        }
    };
    __setFunctionName(_classThis, "InteractableColorFeedback");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractableColorFeedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractableColorFeedback = _classThis;
})();
exports.InteractableColorFeedback = InteractableColorFeedback;
//# sourceMappingURL=InteractableColorFeedback.js.map