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
exports.ToggleButton = void 0;
var __selfType = requireType("./ToggleButton");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const InspectorCallbacks_1 = require("../../../Utils/InspectorCallbacks");
const ReplayEvent_1 = require("../../../Utils/ReplayEvent");
const SyncKitBridge_1 = require("../../../Utils/SyncKitBridge");
const Interactable_1 = require("../../Interaction/Interactable/Interactable");
const TOGGLE_BUTTON_VALUE_KEY = "ToggleButtonValue";
/**
 * This class provides basic toggle functionality for a prefab toggle button. It manages the toggle state and provides methods to handle toggle events and update the button's visual state.
 */
let ToggleButton = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ToggleButton = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * The icon to be shown when the button is toggled on.
             */
            this._onIcon = this._onIcon;
            /**
             * The icon to be shown when the button is toggled off.
             */
            this._offIcon = this._offIcon;
            /**
             * The initial state of the button, set to true if toggled on upon lens launch.
             */
            this._isToggledOn = this._isToggledOn;
            /**
             * Enable this to add functions from another script to this component's callback events.
             */
            this.editEventCallbacks = this.editEventCallbacks;
            this.customFunctionForOnStateChanged = this.customFunctionForOnStateChanged;
            /**
             * The names for the functions on the provided script, to be called on toggle state change.
             */
            this.onStateChangedFunctionNames = this.onStateChangedFunctionNames;
            this.isSynced = this.isSynced;
            this.interactable = null;
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced ? this.syncKitBridge.createSyncEntity(this) : null;
            this.onStateChangedEvent = new ReplayEvent_1.default();
            this.onStateChanged = this.onStateChangedEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            /**
             * The icon to be shown when the button is toggled on.
             */
            this._onIcon = this._onIcon;
            /**
             * The icon to be shown when the button is toggled off.
             */
            this._offIcon = this._offIcon;
            /**
             * The initial state of the button, set to true if toggled on upon lens launch.
             */
            this._isToggledOn = this._isToggledOn;
            /**
             * Enable this to add functions from another script to this component's callback events.
             */
            this.editEventCallbacks = this.editEventCallbacks;
            this.customFunctionForOnStateChanged = this.customFunctionForOnStateChanged;
            /**
             * The names for the functions on the provided script, to be called on toggle state change.
             */
            this.onStateChangedFunctionNames = this.onStateChangedFunctionNames;
            this.isSynced = this.isSynced;
            this.interactable = null;
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced ? this.syncKitBridge.createSyncEntity(this) : null;
            this.onStateChangedEvent = new ReplayEvent_1.default();
            this.onStateChanged = this.onStateChangedEvent.publicApi();
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
                if (!this.interactable) {
                    throw new Error("Toggle Button requires an Interactable Component on the same Scene object in order to work - please ensure one is added.");
                }
                this.interactable.onTriggerEnd.add(() => {
                    if (this.enabled) {
                        this.toggleState();
                    }
                });
                this.onStateChangedEvent.invoke(this._isToggledOn);
            });
            if (this.editEventCallbacks && this.customFunctionForOnStateChanged) {
                this.onStateChanged.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnStateChanged, this.onStateChangedFunctionNames));
            }
            if (this.syncEntity !== null) {
                this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this));
            }
            this.refreshVisual();
        }
        /**
         * Toggles the state of the button
         */
        toggle() {
            this.toggleState();
        }
        /**
         * @returns the icon to be shown when the button is toggled on
         */
        get onIcon() {
            return this._onIcon ?? null;
        }
        /**
         * @param iconObject - the icon to be shown when the button is toggled on
         */
        set onIcon(iconObject) {
            this._onIcon = iconObject;
            this.refreshVisual();
        }
        /**
         * @returns the icon to be shown when the button is toggled off
         */
        get offIcon() {
            return this._offIcon ?? null;
        }
        /**
         * @param iconObject - the icon to be shown when the button is toggled off
         */
        set offIcon(iconObject) {
            this._offIcon = iconObject;
            this.refreshVisual();
        }
        /**
         * @returns the current toggle state of the button
         */
        get isToggledOn() {
            return this._isToggledOn;
        }
        /**
         * @param toggleOn - the new state of the button, invoking the toggle event if different than current state.
         */
        set isToggledOn(toggleOn) {
            // Return if the requested state is the same as the current state (no change)
            if (toggleOn === this._isToggledOn) {
                return;
            }
            this.toggleState();
        }
        refreshVisual() {
            if (this._onIcon !== undefined) {
                this._onIcon.enabled = this._isToggledOn;
            }
            if (this._offIcon !== undefined) {
                this._offIcon.enabled = !this._isToggledOn;
            }
        }
        toggleState(shouldSync = true) {
            this._isToggledOn = !this._isToggledOn;
            if (shouldSync) {
                this.updateSyncStore();
            }
            this.refreshVisual();
            this.onStateChangedEvent.invoke(this._isToggledOn);
        }
        setupConnectionCallbacks() {
            if (this.syncEntity.currentStore.getAllKeys().find((key) => {
                return key === TOGGLE_BUTTON_VALUE_KEY;
            })) {
                if (this.syncEntity.currentStore.getBool(TOGGLE_BUTTON_VALUE_KEY) !== this._isToggledOn) {
                    this.toggleState(false);
                }
            }
            else {
                this.syncEntity.currentStore.putBool(TOGGLE_BUTTON_VALUE_KEY, this.isToggledOn);
            }
            this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this));
        }
        processStoreUpdate(_session, store, key, info) {
            const connectionId = info.updaterInfo.connectionId;
            const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId();
            if (updatedByLocal) {
                return;
            }
            if (key === TOGGLE_BUTTON_VALUE_KEY) {
                if (store.getBool(key) === this._isToggledOn) {
                    return;
                }
                this.toggleState(false);
            }
        }
        updateSyncStore() {
            if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                this.syncEntity.currentStore.putBool(TOGGLE_BUTTON_VALUE_KEY, this.isToggledOn);
            }
        }
    };
    __setFunctionName(_classThis, "ToggleButton");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ToggleButton = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ToggleButton = _classThis;
})();
exports.ToggleButton = ToggleButton;
//# sourceMappingURL=ToggleButton.js.map