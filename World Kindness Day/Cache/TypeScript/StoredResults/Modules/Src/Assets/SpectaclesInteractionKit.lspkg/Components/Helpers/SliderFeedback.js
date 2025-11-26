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
exports.SliderFeedback = void 0;
var __selfType = requireType("./SliderFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("../../Components/Interaction/Interactable/Interactable");
const Slider_1 = require("../../Components/UI/Slider/Slider");
const validate_1 = require("../../Utils/validate");
const SLIDER_LEVEL_MIN = 0.1;
const SLIDER_LEVEL_MAX = 0.9;
/**
 * This class provides visual feedback for a slider component. It manages the appearance of the slider's knob and track
 * based on interaction events and the slider's value.
 */
let SliderFeedback = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SliderFeedback = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * The RenderMeshVisual component of the slider track that visualizes the slider's value. This mesh will have its
             * material's level property updated to reflect the current slider position, and its pinch property modified during
             * interaction events to provide additional visual feedback.
             */
            this.renderMeshVisual = this.renderMeshVisual;
            /**
             * Reference to the SceneObject containing the slider's interactive knob. This object must have an Interactable
             * component attached to allow user interaction.
             */
            this.knobObject = this.knobObject;
            this.interactable = null;
            this.slider = null;
            this.currentValue = 0;
            this.init = () => {
                if (isNull(this.renderMeshVisual)) {
                    throw new Error("No RenderMeshVisual component attached to this entity!");
                }
                if (isNull(this.knobObject)) {
                    throw new Error("No knobObject attached to this entity!");
                }
                this.renderMeshVisual.mainMaterial = this.renderMeshVisual.getMaterial(0).clone();
                this.createEvent("OnStartEvent").bind(() => {
                    this.interactable = this.knobObject.getComponent(Interactable_1.Interactable.getTypeName());
                    if (isNull(this.interactable)) {
                        throw new Error("Interactable component not found in this entity!");
                    }
                    this.slider = this.getSceneObject().getComponent(Slider_1.Slider.getTypeName());
                    if (isNull(this.slider)) {
                        throw new Error("No Slider component attached to this entity!");
                    }
                    (0, validate_1.validate)(this.slider);
                    (0, validate_1.validate)(this.renderMeshVisual);
                    this.currentValue = this.slider.startValue;
                    this.renderMeshVisual.mainPass.level = this.getSliderLevelFromValue(this.slider.currentValue ?? 0);
                    this.setupSliderCallbacks();
                });
            };
            this.getSliderLevelFromValue = (value) => {
                (0, validate_1.validate)(this.slider);
                if (value <= this.slider.minValue) {
                    return 0;
                }
                else if (value >= this.slider.maxValue) {
                    return 1;
                }
                else {
                    const progress = (value - this.slider.minValue) / (this.slider.maxValue - this.slider.minValue);
                    return SLIDER_LEVEL_MIN + (SLIDER_LEVEL_MAX - SLIDER_LEVEL_MIN) * progress;
                }
            };
            this.setupSliderCallbacks = () => {
                (0, validate_1.validate)(this.interactable);
                (0, validate_1.validate)(this.slider);
                (0, validate_1.validate)(this.renderMeshVisual);
                this.interactable.onTriggerStart.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 1.0;
                    this.renderMeshVisual.mainPass.level = this.currentValue;
                });
                this.interactable.onTriggerEnd.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onTriggerEndOutside.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onTriggerCanceled.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onSyncTriggerStart.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 1.0;
                    this.renderMeshVisual.mainPass.level = this.currentValue;
                });
                this.interactable.onSyncTriggerEnd.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onSyncTriggerEndOutside.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onSyncTriggerCanceled.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.slider.onValueUpdate.add((value) => {
                    this.currentValue = value;
                    this.renderMeshVisual.mainPass.level = this.getSliderLevelFromValue(value);
                });
            };
        }
        __initialize() {
            super.__initialize();
            /**
             * The RenderMeshVisual component of the slider track that visualizes the slider's value. This mesh will have its
             * material's level property updated to reflect the current slider position, and its pinch property modified during
             * interaction events to provide additional visual feedback.
             */
            this.renderMeshVisual = this.renderMeshVisual;
            /**
             * Reference to the SceneObject containing the slider's interactive knob. This object must have an Interactable
             * component attached to allow user interaction.
             */
            this.knobObject = this.knobObject;
            this.interactable = null;
            this.slider = null;
            this.currentValue = 0;
            this.init = () => {
                if (isNull(this.renderMeshVisual)) {
                    throw new Error("No RenderMeshVisual component attached to this entity!");
                }
                if (isNull(this.knobObject)) {
                    throw new Error("No knobObject attached to this entity!");
                }
                this.renderMeshVisual.mainMaterial = this.renderMeshVisual.getMaterial(0).clone();
                this.createEvent("OnStartEvent").bind(() => {
                    this.interactable = this.knobObject.getComponent(Interactable_1.Interactable.getTypeName());
                    if (isNull(this.interactable)) {
                        throw new Error("Interactable component not found in this entity!");
                    }
                    this.slider = this.getSceneObject().getComponent(Slider_1.Slider.getTypeName());
                    if (isNull(this.slider)) {
                        throw new Error("No Slider component attached to this entity!");
                    }
                    (0, validate_1.validate)(this.slider);
                    (0, validate_1.validate)(this.renderMeshVisual);
                    this.currentValue = this.slider.startValue;
                    this.renderMeshVisual.mainPass.level = this.getSliderLevelFromValue(this.slider.currentValue ?? 0);
                    this.setupSliderCallbacks();
                });
            };
            this.getSliderLevelFromValue = (value) => {
                (0, validate_1.validate)(this.slider);
                if (value <= this.slider.minValue) {
                    return 0;
                }
                else if (value >= this.slider.maxValue) {
                    return 1;
                }
                else {
                    const progress = (value - this.slider.minValue) / (this.slider.maxValue - this.slider.minValue);
                    return SLIDER_LEVEL_MIN + (SLIDER_LEVEL_MAX - SLIDER_LEVEL_MIN) * progress;
                }
            };
            this.setupSliderCallbacks = () => {
                (0, validate_1.validate)(this.interactable);
                (0, validate_1.validate)(this.slider);
                (0, validate_1.validate)(this.renderMeshVisual);
                this.interactable.onTriggerStart.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 1.0;
                    this.renderMeshVisual.mainPass.level = this.currentValue;
                });
                this.interactable.onTriggerEnd.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onTriggerEndOutside.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onTriggerCanceled.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onSyncTriggerStart.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 1.0;
                    this.renderMeshVisual.mainPass.level = this.currentValue;
                });
                this.interactable.onSyncTriggerEnd.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onSyncTriggerEndOutside.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.interactable.onSyncTriggerCanceled.add(() => {
                    this.renderMeshVisual.mainPass.pinch = 0.0;
                });
                this.slider.onValueUpdate.add((value) => {
                    this.currentValue = value;
                    this.renderMeshVisual.mainPass.level = this.getSliderLevelFromValue(value);
                });
            };
        }
        onAwake() {
            this.init();
        }
    };
    __setFunctionName(_classThis, "SliderFeedback");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SliderFeedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SliderFeedback = _classThis;
})();
exports.SliderFeedback = SliderFeedback;
//# sourceMappingURL=SliderFeedback.js.map