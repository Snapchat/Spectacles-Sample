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
exports.ScrollBarFeedback = void 0;
var __selfType = requireType("./ScrollBarFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const animate_1 = require("../../Utils/animate");
const mathUtils_1 = require("../../Utils/mathUtils");
const validate_1 = require("../../Utils/validate");
const Interactable_1 = require("../Interaction/Interactable/Interactable");
const ScrollBar_1 = require("../UI/ScrollBar/ScrollBar");
const BLENDSHAPE_NAME = "Size";
const SCALE_TWEEN_DURATION = 0.2;
const HOVER_SCALE = 0.75;
/**
 * This class provides visual feedback for a scrollbar by adjusting its size and scale based on interaction events such
 * as hover. It uses animation utilities to smoothly transition between states.
 */
let ScrollBarFeedback = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ScrollBarFeedback = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * Reference to the SceneObject containing the ScrollBar and Interactable components. This object will be monitored
             * for interaction events to provide visual feedback on the scrollbar indicator.
             */
            this.scrollbarObject = this.scrollbarObject;
            this.size = 0;
            this.interactable = null;
            this.scrollbar = null;
            this.isHovering = false;
            this.scaleCancel = new animate_1.CancelSet();
            this.init = () => {
                this.interactable = this.scrollbarObject.getComponent(Interactable_1.Interactable.getTypeName());
                if (isNull(this.interactable)) {
                    throw new Error("Interactable component not found in this entity!");
                }
                this.scrollbar = this.scrollbarObject.getComponent(ScrollBar_1.ScrollBar.getTypeName());
                if (isNull(this.scrollbar)) {
                    throw new Error("ScrollBar component not found in this entity!");
                }
                this.renderMeshVisual = this.getSceneObject().getComponent("Component.RenderMeshVisual");
                if (this.renderMeshVisual === undefined) {
                    throw new Error("RenderMeshVisual component not found in this entity!");
                }
                this.size = this.renderMeshVisual.getBlendShapeWeight(BLENDSHAPE_NAME);
                this.renderMeshVisual.mainPass.size = this.size;
                this.createEvent("OnStartEvent").bind(this.setupInteractableCallbacks);
            };
            this.setupInteractableCallbacks = () => {
                (0, validate_1.validate)(this.interactable);
                this.interactable.onHoverEnter.add(this.initializeHoverState);
                this.interactable.onHoverExit.add(this.resetHoverState);
                this.interactable.onTriggerStart.add(this.initializeTriggerState);
                this.interactable.onTriggerEnd.add(this.resetTriggerState);
                this.interactable.onTriggerEndOutside.add(this.resetHoverState);
                this.interactable.onTriggerCanceled.add(this.resetHoverState);
                this.interactable.onTriggerUpdate.add(this.onTriggerUpdate);
                this.interactable.onSyncHoverEnter.add(this.initializeHoverState);
                this.interactable.onSyncHoverExit.add(this.resetHoverState);
                this.interactable.onSyncTriggerStart.add(this.initializeTriggerState);
                this.interactable.onSyncTriggerEnd.add(this.resetTriggerState);
                this.interactable.onSyncTriggerEndOutside.add(this.resetHoverState);
                this.interactable.onSyncTriggerCanceled.add(this.resetHoverState);
                this.interactable.onSyncTriggerUpdate.add(this.onTriggerUpdate);
            };
            this.initializeHoverState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.status = 1.0;
                    this.renderMeshVisual.mainPass.scale = HOVER_SCALE;
                    this.renderMeshVisual.mainPass.offset = this.getPercentage();
                    this.isHovering = true;
                }
            };
            this.resetHoverState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.status = 0.0;
                    this.renderMeshVisual.mainPass.scale = 0.0;
                    this.isHovering = false;
                }
            };
            this.initializeTriggerState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.offset = this.getPercentage();
                    this.tweenScale(0.75, 1.0);
                }
            };
            this.resetTriggerState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.gradientScale = 0.03;
                    this.tweenScale(1.0, 0.75);
                }
            };
            this.onTriggerUpdate = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.offset = this.getPercentage();
                }
            };
            this.tweenScale = (currentScale, targetScale, endCallback = () => { }) => {
                if (this.scaleCancel)
                    this.scaleCancel.cancel();
                (0, animate_1.default)({
                    duration: SCALE_TWEEN_DURATION * Math.abs(targetScale - currentScale),
                    update: (t) => {
                        if (this.renderMeshVisual !== undefined) {
                            this.renderMeshVisual.mainPass.scale = (0, mathUtils_1.lerp)(currentScale, targetScale, t);
                        }
                    },
                    ended: endCallback,
                    cancelSet: this.scaleCancel
                });
            };
            this.getPercentage = () => {
                (0, validate_1.validate)(this.scrollbar);
                return MathUtils.remap(this.scrollbar.scrollPercentage, 0.0, 1.0, 0.03, 0.97);
            };
        }
        __initialize() {
            super.__initialize();
            /**
             * Reference to the SceneObject containing the ScrollBar and Interactable components. This object will be monitored
             * for interaction events to provide visual feedback on the scrollbar indicator.
             */
            this.scrollbarObject = this.scrollbarObject;
            this.size = 0;
            this.interactable = null;
            this.scrollbar = null;
            this.isHovering = false;
            this.scaleCancel = new animate_1.CancelSet();
            this.init = () => {
                this.interactable = this.scrollbarObject.getComponent(Interactable_1.Interactable.getTypeName());
                if (isNull(this.interactable)) {
                    throw new Error("Interactable component not found in this entity!");
                }
                this.scrollbar = this.scrollbarObject.getComponent(ScrollBar_1.ScrollBar.getTypeName());
                if (isNull(this.scrollbar)) {
                    throw new Error("ScrollBar component not found in this entity!");
                }
                this.renderMeshVisual = this.getSceneObject().getComponent("Component.RenderMeshVisual");
                if (this.renderMeshVisual === undefined) {
                    throw new Error("RenderMeshVisual component not found in this entity!");
                }
                this.size = this.renderMeshVisual.getBlendShapeWeight(BLENDSHAPE_NAME);
                this.renderMeshVisual.mainPass.size = this.size;
                this.createEvent("OnStartEvent").bind(this.setupInteractableCallbacks);
            };
            this.setupInteractableCallbacks = () => {
                (0, validate_1.validate)(this.interactable);
                this.interactable.onHoverEnter.add(this.initializeHoverState);
                this.interactable.onHoverExit.add(this.resetHoverState);
                this.interactable.onTriggerStart.add(this.initializeTriggerState);
                this.interactable.onTriggerEnd.add(this.resetTriggerState);
                this.interactable.onTriggerEndOutside.add(this.resetHoverState);
                this.interactable.onTriggerCanceled.add(this.resetHoverState);
                this.interactable.onTriggerUpdate.add(this.onTriggerUpdate);
                this.interactable.onSyncHoverEnter.add(this.initializeHoverState);
                this.interactable.onSyncHoverExit.add(this.resetHoverState);
                this.interactable.onSyncTriggerStart.add(this.initializeTriggerState);
                this.interactable.onSyncTriggerEnd.add(this.resetTriggerState);
                this.interactable.onSyncTriggerEndOutside.add(this.resetHoverState);
                this.interactable.onSyncTriggerCanceled.add(this.resetHoverState);
                this.interactable.onSyncTriggerUpdate.add(this.onTriggerUpdate);
            };
            this.initializeHoverState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.status = 1.0;
                    this.renderMeshVisual.mainPass.scale = HOVER_SCALE;
                    this.renderMeshVisual.mainPass.offset = this.getPercentage();
                    this.isHovering = true;
                }
            };
            this.resetHoverState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.status = 0.0;
                    this.renderMeshVisual.mainPass.scale = 0.0;
                    this.isHovering = false;
                }
            };
            this.initializeTriggerState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.offset = this.getPercentage();
                    this.tweenScale(0.75, 1.0);
                }
            };
            this.resetTriggerState = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.gradientScale = 0.03;
                    this.tweenScale(1.0, 0.75);
                }
            };
            this.onTriggerUpdate = () => {
                if (this.renderMeshVisual !== undefined) {
                    this.renderMeshVisual.mainPass.offset = this.getPercentage();
                }
            };
            this.tweenScale = (currentScale, targetScale, endCallback = () => { }) => {
                if (this.scaleCancel)
                    this.scaleCancel.cancel();
                (0, animate_1.default)({
                    duration: SCALE_TWEEN_DURATION * Math.abs(targetScale - currentScale),
                    update: (t) => {
                        if (this.renderMeshVisual !== undefined) {
                            this.renderMeshVisual.mainPass.scale = (0, mathUtils_1.lerp)(currentScale, targetScale, t);
                        }
                    },
                    ended: endCallback,
                    cancelSet: this.scaleCancel
                });
            };
            this.getPercentage = () => {
                (0, validate_1.validate)(this.scrollbar);
                return MathUtils.remap(this.scrollbar.scrollPercentage, 0.0, 1.0, 0.03, 0.97);
            };
        }
        onAwake() {
            this.init();
        }
    };
    __setFunctionName(_classThis, "ScrollBarFeedback");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScrollBarFeedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScrollBarFeedback = _classThis;
})();
exports.ScrollBarFeedback = ScrollBarFeedback;
//# sourceMappingURL=ScrollBarFeedback.js.map