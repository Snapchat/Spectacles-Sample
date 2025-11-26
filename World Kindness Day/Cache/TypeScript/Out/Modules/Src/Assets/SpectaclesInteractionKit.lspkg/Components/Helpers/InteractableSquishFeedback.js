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
exports.InteractableSquishFeedback = void 0;
var __selfType = requireType("./InteractableSquishFeedback");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const validate_1 = require("../../Utils/validate");
const Interactable_1 = require("../Interaction/Interactable/Interactable");
/**
 * This class provides visual feedback by squishing a specified SceneObject when it is hovered or triggered. It allows
 * customization of the squish amount along the x-axis and y-axis.
 */
let InteractableSquishFeedback = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractableSquishFeedback = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * This is the SceneObject that will be squished on hover/trigger.
             */
            this.squishObject = this.squishObject;
            /**
             * This is how much the squishObject will squish along the y-axis.
             */
            this.verticalSquish = this.verticalSquish;
            /**
             * This is how much the squishObject will squish along the x-axis.
             */
            this.horizontalSquish = this.horizontalSquish;
            this.interactable = null;
            this.initialPinch = null;
            this.squishEnabled = true;
        }
        __initialize() {
            super.__initialize();
            /**
             * This is the SceneObject that will be squished on hover/trigger.
             */
            this.squishObject = this.squishObject;
            /**
             * This is how much the squishObject will squish along the y-axis.
             */
            this.verticalSquish = this.verticalSquish;
            /**
             * This is how much the squishObject will squish along the x-axis.
             */
            this.horizontalSquish = this.horizontalSquish;
            this.interactable = null;
            this.initialPinch = null;
            this.squishEnabled = true;
        }
        onAwake() {
            this.defineScriptEvents();
        }
        defineScriptEvents() {
            this.createEvent("OnStartEvent").bind(() => {
                this.init();
                this.createEvent("OnEnableEvent").bind(() => {
                    this.squishEnabled = true;
                });
                this.createEvent("OnDisableEvent").bind(() => {
                    this.squishEnabled = false;
                });
            });
        }
        init() {
            this.initialScale = this.squishObject.getTransform().getLocalScale();
            this.squishScale = new vec3(this.initialScale.x * this.horizontalSquish, this.initialScale.y * this.verticalSquish, this.initialScale.z);
            this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            if (!this.interactable) {
                throw new Error("InteractableSquishFeedback script requires an Interactable");
            }
            this.setupInteractableCallbacks();
        }
        resetScale(event) {
            (0, validate_1.validate)(this.initialScale);
            if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
                return;
            }
            this.squishObject.getTransform().setLocalScale(this.initialScale);
            this.initialPinch = null;
        }
        updateSquish(event) {
            (0, validate_1.validate)(this.initialScale);
            (0, validate_1.validate)(this.squishScale);
            const currentPinch = event.interactor.interactionStrength;
            if (currentPinch !== null && this.initialPinch !== null && this.squishEnabled) {
                const pinchScale = MathUtils.remap(Math.max(this.initialPinch, currentPinch), Math.min(this.initialPinch, 0.95), 1, 0, 1);
                this.squishObject.getTransform().setLocalScale(vec3.lerp(this.initialScale, this.squishScale, pinchScale));
            }
        }
        setupInteractableCallbacks() {
            (0, validate_1.validate)(this.interactable);
            this.interactable.onHoverEnter.add((event) => {
                this.initialPinch = event.interactor.interactionStrength;
            });
            this.interactable.onHoverUpdate.add(this.updateSquish.bind(this));
            this.interactable.onHoverExit.add(this.resetScale.bind(this));
            this.interactable.onTriggerEndOutside.add(this.resetScale.bind(this));
            this.interactable.onTriggerCanceled.add(this.resetScale.bind(this));
            this.interactable.onSyncHoverEnter.add((event) => {
                this.initialPinch = event.interactor.interactionStrength;
            });
            this.interactable.onSyncHoverUpdate.add(this.updateSquish.bind(this));
            this.interactable.onSyncHoverExit.add(this.resetScale.bind(this));
            this.interactable.onSyncTriggerEndOutside.add(this.resetScale.bind(this));
            this.interactable.onSyncTriggerCanceled.add(this.resetScale.bind(this));
        }
    };
    __setFunctionName(_classThis, "InteractableSquishFeedback");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractableSquishFeedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractableSquishFeedback = _classThis;
})();
exports.InteractableSquishFeedback = InteractableSquishFeedback;
//# sourceMappingURL=InteractableSquishFeedback.js.map