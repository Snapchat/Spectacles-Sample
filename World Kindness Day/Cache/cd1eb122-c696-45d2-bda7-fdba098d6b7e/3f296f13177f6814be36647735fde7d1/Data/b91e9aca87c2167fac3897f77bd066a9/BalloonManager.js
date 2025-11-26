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
exports.BalloonManager = void 0;
var __selfType = requireType("./BalloonManager");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const SIK_1 = require("SpectaclesInteractionKit.lspkg/SIK");
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
let BalloonManager = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var BalloonManager = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.KindnessCounter = this.KindnessCounter;
            this.balloons = this.balloons;
            this.endScreenBalloons = this.endScreenBalloons;
            this.PledgeReadInOrder = this.PledgeReadInOrder;
        }
        __initialize() {
            super.__initialize();
            this.KindnessCounter = this.KindnessCounter;
            this.balloons = this.balloons;
            this.endScreenBalloons = this.endScreenBalloons;
            this.PledgeReadInOrder = this.PledgeReadInOrder;
        }
        onAwake() {
            this.createEvent('OnStartEvent').bind(() => this.onStart());
        }
        onStart() {
            const interactionManager = SIK_1.SIK.InteractionManager;
            this.balloons.forEach((obj, i) => {
                if (!obj)
                    return;
                // Get the Interactable on this object
                let interactable = obj.getComponent(Interactable_1.Interactable.getTypeName());
                if (!interactable) {
                    interactable = interactionManager.getInteractableBySceneObject(obj);
                }
                if (!interactable) {
                    print(`[BalloonsManager] Balloon[${i}] "${obj.name}" has no Interactable + Collider.`);
                    return;
                }
                // When interaction ends mark the balloon and go to next step
                interactable.onInteractorTriggerEnd((_event) => {
                    this.selectedBalloon = obj;
                    this.nextStep(obj);
                    print(`[BalloonsManager] END ${obj.name}`);
                });
            });
        }
        // Animates the selected balloon upwards and notifies KindnessCounter that a pledge was made
        changeTransform() {
            const startPosition = this.selectedBalloon.getTransform().getLocalPosition();
            const destinationPosition = new vec3(startPosition.x, 50, startPosition.z);
            LSTween_1.LSTween.moveFromToLocal(this.selectedBalloon.getTransform(), startPosition, destinationPosition, 1500)
                .easing(Easing_1.default.Cubic.InOut)
                .delay(100) // There is a bug in TweenJS where the yoyo value will jump if no delay is set.
                .yoyo(false)
                .repeat(0)
                .start();
            this.KindnessCounter.onBalloonSelected();
        }
        // Hides all non-selected balloons and starts the pledge-reading flow
        nextStep(selected) {
            this.delay(1, () => {
                this.balloons.forEach((obj) => {
                    if (obj && obj !== selected) {
                        obj.enabled = false;
                    }
                });
            });
            this.PledgeReadInOrder.init();
        }
        // Utility: run a callback after a specified delay in seconds
        delay(seconds, callback) {
            const evt = this.createEvent('DelayedCallbackEvent');
            evt.bind(callback);
            evt.reset(seconds);
        }
    };
    __setFunctionName(_classThis, "BalloonManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BalloonManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BalloonManager = _classThis;
})();
exports.BalloonManager = BalloonManager;
//# sourceMappingURL=BalloonManager.js.map