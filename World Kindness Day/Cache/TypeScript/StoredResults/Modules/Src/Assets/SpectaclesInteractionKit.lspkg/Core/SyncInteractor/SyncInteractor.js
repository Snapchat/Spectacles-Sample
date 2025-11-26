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
exports.SyncInteractor = void 0;
var __selfType = requireType("./SyncInteractor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const BaseInteractor_1 = require("../Interactor/BaseInteractor");
const Interactor_1 = require("../Interactor/Interactor");
const DEFAULT_SYNC_INTERACTOR_STATE = {
    startPoint: null,
    endPoint: null,
    planecastPoint: null,
    direction: null,
    orientation: null,
    distanceToTarget: null,
    targetHitPosition: null,
    targetHitInfo: null,
    maxRaycastDistance: 0,
    activeTargetingMode: Interactor_1.TargetingMode.None,
    interactionStrength: null,
    isTargeting: false,
    isActive: false,
    currentInteractable: null,
    previousInteractable: null,
    currentTrigger: Interactor_1.InteractorTriggerType.None,
    previousTrigger: Interactor_1.InteractorTriggerType.None,
    currentDragVector: null,
    previousDragVector: null,
    planecastDragVector: null,
    dragType: null,
    inputType: Interactor_1.InteractorInputType.None,
    hoveredInteractables: []
};
let SyncInteractor = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseInteractor_1.default;
    var SyncInteractor = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.interactorState = DEFAULT_SYNC_INTERACTOR_STATE;
        }
        __initialize() {
            super.__initialize();
            this.interactorState = DEFAULT_SYNC_INTERACTOR_STATE;
        }
        onAwake() {
            super.inputType = Interactor_1.InteractorInputType.Sync;
        }
        /**
         * Because SyncInteractionManager dispatches events to InteractionManager and updates all SyncInteractors, it is not
         * necessary to update state and invoke events during the typical InteractionManager update loop.
         */
        updateState() { }
        /**
         * @inheritdoc
         */
        get startPoint() {
            return this.interactorState.startPoint;
        }
        /**
         * @inheritdoc
         */
        get endPoint() {
            return this.interactorState.endPoint;
        }
        /**
         * @inheritdoc
         */
        get planecastPoint() {
            return this.interactorState.planecastPoint;
        }
        /**
         * @inheritdoc
         */
        get direction() {
            return this.interactorState.direction;
        }
        /**
         * @inheritdoc
         */
        get orientation() {
            return this.interactorState.orientation;
        }
        /**
         * @inheritdoc
         */
        get distanceToTarget() {
            return this.interactorState.distanceToTarget;
        }
        /**
         * @inheritdoc
         */
        get targetHitPosition() {
            return this.interactorState.targetHitPosition;
        }
        /**
         * @inheritdoc
         */
        get targetHitInfo() {
            return this.interactorState.targetHitInfo; // will have to reconstruct this
        }
        /**
         * @inheritdoc
         */
        get maxRaycastDistance() {
            return this.interactorState.maxRaycastDistance;
        }
        /**
         * @inheritdoc
         */
        get activeTargetingMode() {
            return this.interactorState.activeTargetingMode;
        }
        /**
         * @inheritdoc
         */
        get interactionStrength() {
            return this.interactorState.interactionStrength;
        }
        get isHoveringCurrentInteractable() {
            if (this.currentInteractable === null) {
                return null;
            }
            return this.interactorState.hoveredInteractables?.includes(this.currentInteractable) ?? false;
        }
        get hoveredInteractables() {
            return this.interactorState.hoveredInteractables;
        }
        isHoveringInteractable(interactable) {
            return this.interactorState.hoveredInteractables?.includes(interactable) ?? false;
        }
        /**
         * Returns true if the Interactor is hovering over the given Interactable or any of its Interactable descendants.
         * An Interactor can hover over multiple overlapping Interactables at once, but only the most
         * deeply nested Interactable will receive the official onHover events.
         *
         * This is useful for creating custom behaviors when receiving onHoverEnter/Exit events during trigger.
         *
         * @param interactable - the Interactable to check for
         */
        isHoveringInteractableHierarchy(interactable) {
            if (this.isHoveringInteractable(interactable)) {
                return true;
            }
            for (const interactable of this.interactorState.hoveredInteractables) {
                if (interactable.isDescendantOf(interactable)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @inheritdoc
         */
        isTargeting() {
            return this.interactorState.isTargeting;
        }
        /**
         * @inheritdoc
         */
        isActive() {
            return this.interactorState.isActive;
        }
        /**
         * @inheritdoc
         */
        get inputType() {
            return super.inputType;
        }
        /**
         * @inheritdoc
         */
        get currentInteractable() {
            return this.interactorState.currentInteractable;
        }
        /**
         * @inheritdoc
         */
        get previousInteractable() {
            return this.interactorState.previousInteractable;
        }
        /**
         * @inheritdoc
         */
        get currentTrigger() {
            return this.interactorState.currentTrigger;
        }
        /**
         * @inheritdoc
         */
        get previousTrigger() {
            return this.interactorState.previousTrigger;
        }
        /**
         * @inheritdoc
         */
        get currentDragVector() {
            return this.interactorState.currentDragVector;
        }
        /**
         * @inheritdoc
         */
        get previousDragVector() {
            return this.interactorState.previousDragVector;
        }
        /**
         * @inheritdoc
         */
        get planecastDragVector() {
            return this.interactorState.planecastDragVector;
        }
        /**
         * @inheritdoc
         */
        get dragType() {
            return this.interactorState.dragType;
        }
        clearCurrentHitInfo() { }
        /**
         * @inheritdoc
         */
        set drawDebug(debug) { }
        /**
         * @inheritdoc
         */
        get drawDebug() {
            return false;
        }
        clearCurrentInteractable() { }
        resetState() {
            this.interactorState = DEFAULT_SYNC_INTERACTOR_STATE;
        }
    };
    __setFunctionName(_classThis, "SyncInteractor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SyncInteractor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SyncInteractor = _classThis;
})();
exports.SyncInteractor = SyncInteractor;
//# sourceMappingURL=SyncInteractor.js.map