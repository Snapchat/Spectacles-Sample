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
exports.Slider = void 0;
var __selfType = requireType("./Slider");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Event_1 = require("../../../Utils/Event");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const animate_1 = require("../../../Utils/animate");
const InspectorCallbacks_1 = require("../../../Utils/InspectorCallbacks");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const SyncKitBridge_1 = require("../../../Utils/SyncKitBridge");
const validate_1 = require("../../../Utils/validate");
const Interactable_1 = require("../../Interaction/Interactable/Interactable");
const TAG = "Slider";
const SLIDER_VALUE_KEY = "SliderValue";
/**
 * This class represents a numerical slider control powered by Interaction Kit's hand tracking interactions. It allows
 * users to adjust a value by sliding a handle along a track.
 */
let Slider = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Slider = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * The minimum numeric value of the slider.
             */
            this._minValue = this._minValue;
            this._maxValue = this._maxValue;
            /**
             * The initial numeric value of the slider.
             */
            this.startValue = this.startValue;
            /**
             * Enable this to change the slider's value in steps rather than continuously.
             */
            this.stepBehavior = this.stepBehavior;
            /**
             * The size of the steps that the slider's value will be changed in. A value of 0 means continuous (non-stepped)
             * behavior. Must be greater than or equal to 0 and less than the range between min and max values.
             */
            this._stepSize = this._stepSize;
            /**
             * The duration of the toggle animation in seconds.
             */
            this.toggleDuration = this.toggleDuration;
            this.sliderMin = this.sliderMin;
            /**
             * The position of the slider knob when the maximum value is reached.
             */
            this.sliderMax = this.sliderMax;
            /**
             * The SceneObject representing the knob of the slider which will be moved along the path between the positions
             * provided by sliderMin and sliderMax when the value is updated. Please ensure the SceneObject has an Interactable
             * component attached.
             */
            this._sliderKnob = this._sliderKnob;
            this.editEventCallbacks = this.editEventCallbacks;
            this.customFunctionForOnHoverEnter = this.customFunctionForOnHoverEnter;
            /**
             * The names for the functions on the provided script, to be called on hover enter.
             */
            this.onHoverEnterFunctionNames = this.onHoverEnterFunctionNames;
            this.customFunctionForOnHoverExit = this.customFunctionForOnHoverExit;
            /**
             * The names for the functions on the provided script, to be called on hover exit.
             */
            this.onHoverExitFunctionNames = this.onHoverExitFunctionNames;
            this.customFunctionForOnSlideStart = this.customFunctionForOnSlideStart;
            /**
             * The names for the functions on the provided script, to be called on slide start.
             */
            this.onSlideStartFunctionNames = this.onSlideStartFunctionNames;
            this.customFunctionForOnSlideEnd = this.customFunctionForOnSlideEnd;
            /**
             * The names for the functions on the provided script, to be called on slide end.
             */
            this.onSlideEndFunctionNames = this.onSlideEndFunctionNames;
            this.customFunctionForOnValueUpdate = this.customFunctionForOnValueUpdate;
            /**
             * The names for the functions on the provided script, to be called on value update.
             */
            this.onValueUpdateFunctionNames = this.onValueUpdateFunctionNames;
            this.customFunctionForOnMinValueReached = this.customFunctionForOnMinValueReached;
            /**
             * The names for the functions on the provided script, to be called when minimum value is reached.
             */
            this.onMinValueReachedFunctionNames = this.onMinValueReachedFunctionNames;
            this.customFunctionForOnMaxValueReached = this.customFunctionForOnMaxValueReached;
            /**
             * The names for the functions on the provided script, to be called when maximum value is reached.
             */
            this.onMaxValueReachedFunctionNames = this.onMaxValueReachedFunctionNames;
            this.isSynced = this.isSynced;
            this.log = new NativeLogger_1.default(TAG);
            this.trackState = null;
            this.sliderState = null;
            this.interactable = null;
            this.unsubscribeBag = [];
            this.isDragging = false;
            // Events
            this.onHoverEnterEvent = new Event_1.default();
            this.onHoverExitEvent = new Event_1.default();
            this.onSlideStartEvent = new Event_1.default();
            this.onSlideEndEvent = new Event_1.default();
            this.onMinValueReachedEvent = new Event_1.default();
            this.onMaxValueReachedEvent = new Event_1.default();
            this.onValueUpdateEvent = null;
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced ? this.syncKitBridge.createSyncEntity(this) : null;
        }
        __initialize() {
            super.__initialize();
            /**
             * The minimum numeric value of the slider.
             */
            this._minValue = this._minValue;
            this._maxValue = this._maxValue;
            /**
             * The initial numeric value of the slider.
             */
            this.startValue = this.startValue;
            /**
             * Enable this to change the slider's value in steps rather than continuously.
             */
            this.stepBehavior = this.stepBehavior;
            /**
             * The size of the steps that the slider's value will be changed in. A value of 0 means continuous (non-stepped)
             * behavior. Must be greater than or equal to 0 and less than the range between min and max values.
             */
            this._stepSize = this._stepSize;
            /**
             * The duration of the toggle animation in seconds.
             */
            this.toggleDuration = this.toggleDuration;
            this.sliderMin = this.sliderMin;
            /**
             * The position of the slider knob when the maximum value is reached.
             */
            this.sliderMax = this.sliderMax;
            /**
             * The SceneObject representing the knob of the slider which will be moved along the path between the positions
             * provided by sliderMin and sliderMax when the value is updated. Please ensure the SceneObject has an Interactable
             * component attached.
             */
            this._sliderKnob = this._sliderKnob;
            this.editEventCallbacks = this.editEventCallbacks;
            this.customFunctionForOnHoverEnter = this.customFunctionForOnHoverEnter;
            /**
             * The names for the functions on the provided script, to be called on hover enter.
             */
            this.onHoverEnterFunctionNames = this.onHoverEnterFunctionNames;
            this.customFunctionForOnHoverExit = this.customFunctionForOnHoverExit;
            /**
             * The names for the functions on the provided script, to be called on hover exit.
             */
            this.onHoverExitFunctionNames = this.onHoverExitFunctionNames;
            this.customFunctionForOnSlideStart = this.customFunctionForOnSlideStart;
            /**
             * The names for the functions on the provided script, to be called on slide start.
             */
            this.onSlideStartFunctionNames = this.onSlideStartFunctionNames;
            this.customFunctionForOnSlideEnd = this.customFunctionForOnSlideEnd;
            /**
             * The names for the functions on the provided script, to be called on slide end.
             */
            this.onSlideEndFunctionNames = this.onSlideEndFunctionNames;
            this.customFunctionForOnValueUpdate = this.customFunctionForOnValueUpdate;
            /**
             * The names for the functions on the provided script, to be called on value update.
             */
            this.onValueUpdateFunctionNames = this.onValueUpdateFunctionNames;
            this.customFunctionForOnMinValueReached = this.customFunctionForOnMinValueReached;
            /**
             * The names for the functions on the provided script, to be called when minimum value is reached.
             */
            this.onMinValueReachedFunctionNames = this.onMinValueReachedFunctionNames;
            this.customFunctionForOnMaxValueReached = this.customFunctionForOnMaxValueReached;
            /**
             * The names for the functions on the provided script, to be called when maximum value is reached.
             */
            this.onMaxValueReachedFunctionNames = this.onMaxValueReachedFunctionNames;
            this.isSynced = this.isSynced;
            this.log = new NativeLogger_1.default(TAG);
            this.trackState = null;
            this.sliderState = null;
            this.interactable = null;
            this.unsubscribeBag = [];
            this.isDragging = false;
            // Events
            this.onHoverEnterEvent = new Event_1.default();
            this.onHoverExitEvent = new Event_1.default();
            this.onSlideStartEvent = new Event_1.default();
            this.onSlideEndEvent = new Event_1.default();
            this.onMinValueReachedEvent = new Event_1.default();
            this.onMaxValueReachedEvent = new Event_1.default();
            this.onValueUpdateEvent = null;
            // Only defined if SyncKit is present within the lens project.
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.isSynced ? this.syncKitBridge.createSyncEntity(this) : null;
        }
        onAwake() {
            (0, validate_1.validate)(this.sliderKnob);
            this.sliderKnobScreenTransform = this.sliderKnob.getComponent("Component.ScreenTransform");
            this.transform = this.getTransform();
            this.sliderBounds = {
                start: this.transform.getInvertedWorldTransform().multiplyPoint(this.sliderMin.getTransform().getWorldPosition()),
                end: this.transform.getInvertedWorldTransform().multiplyPoint(this.sliderMax.getTransform().getWorldPosition()),
                minAnchor: this.sliderMin.getComponent("Component.ScreenTransform").anchors,
                maxAnchor: this.sliderMax.getComponent("Component.ScreenTransform").anchors
            };
            this._startPosition = this.sliderBounds.start;
            this._endPosition = this.sliderBounds.end;
            this.minBound = this.sliderBounds.minAnchor.getCenter();
            this.maxBound = this.sliderBounds.maxAnchor.getCenter();
            this.trackState = this.getTrackState();
            this.sliderState = this.getInitialSliderState();
            this.onValueUpdateEvent = new Event_1.default((value) => {
                if (value >= this._maxValue) {
                    this.onMaxValueReachedEvent.invoke(this._maxValue);
                }
                else if (value <= this._minValue) {
                    this.onMinValueReachedEvent.invoke(this._minValue);
                }
            });
            this.onHoverEnter = this.onHoverEnterEvent.publicApi();
            this.onHoverExit = this.onHoverExitEvent.publicApi();
            this.onSlideStart = this.onSlideStartEvent.publicApi();
            this.onSlideEnd = this.onSlideEndEvent.publicApi();
            this.onValueUpdate = this.onValueUpdateEvent.publicApi();
            this.onMinValueReached = this.onMinValueReachedEvent.publicApi();
            this.onMaxValueReached = this.onMaxValueReachedEvent.publicApi();
            if (this.syncEntity !== null) {
                this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this));
            }
            if (this._minValue > this._maxValue || this._maxValue < this._minValue) {
                throw new Error("Error: SliderComponent's maxValue must be less than its minValue.");
            }
            if (this._stepSize < 0 || this._stepSize > this._maxValue - this._minValue) {
                throw new Error("Error: SliderComponent's stepSize must be greater than or equal to 0, and less than its value range.");
            }
            this.updateUI();
            // Waiting for the OnStartEvent ensures that Interactable components are initialized before we add slider callbacks.
            this.createEvent("OnStartEvent").bind(() => {
                this.interactable = this.sliderKnob.getComponent(Interactable_1.Interactable.getTypeName());
                if (!this.interactable) {
                    throw new Error("Slider Knob must contain an Interactable component for the slider to work - please ensure that one is added to the SceneObject.");
                }
                if (!this.sliderKnobScreenTransform) {
                    throw new Error("Slider Knob must be a Screen Transform for the slider to work - please ensure that one is added to the SceneObject.");
                }
                this.setupInteractable();
            });
            this.createEvent("OnDestroyEvent").bind(() => {
                this.unsubscribeCallbacks();
            });
            if (this.editEventCallbacks) {
                if (this.customFunctionForOnHoverEnter) {
                    this.onHoverEnter.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnHoverEnter, this.onHoverEnterFunctionNames));
                }
                if (this.customFunctionForOnHoverExit) {
                    this.onHoverExit.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnHoverExit, this.onHoverExitFunctionNames));
                }
                if (this.customFunctionForOnSlideStart) {
                    this.onSlideStart.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnSlideStart, this.onSlideStartFunctionNames));
                }
                if (this.customFunctionForOnSlideEnd) {
                    this.onSlideEnd.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnSlideEnd, this.onSlideEndFunctionNames));
                }
                if (this.customFunctionForOnValueUpdate) {
                    this.onValueUpdate.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnValueUpdate, this.onValueUpdateFunctionNames));
                }
                if (this.customFunctionForOnMinValueReached) {
                    this.onMinValueReached.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnMinValueReached, this.onMinValueReachedFunctionNames));
                }
                if (this.customFunctionForOnMaxValueReached) {
                    this.onMaxValueReached.add((0, InspectorCallbacks_1.createCallback)(this.customFunctionForOnMaxValueReached, this.onMaxValueReachedFunctionNames));
                }
            }
        }
        get minValue() {
            return this._minValue;
        }
        set minValue(value) {
            if (value >= this._maxValue) {
                this.log.e(`Could not set minimum value to ${value} as it cannot be greater than or equal to the maximum value: ${this._maxValue}`);
                return;
            }
            (0, validate_1.validate)(this.sliderState);
            this._minValue = value;
            let displayValue = this.sliderState.displayValue;
            if (value > this.sliderState.displayValue) {
                this.log.w(`Setting current value ${this.sliderState.displayValue} to the new minimum value ${value} provided as it is now out of range.`);
                displayValue = value;
            }
            this.updateSliderStateFromDisplayValue(displayValue);
        }
        get maxValue() {
            return this._maxValue;
        }
        set maxValue(value) {
            if (value <= this._minValue) {
                this.log.e(`Could not set maximum value to ${value} as it cannot be less than or equal to the minimum value: ${this._minValue}`);
                return;
            }
            (0, validate_1.validate)(this.sliderState);
            this._maxValue = value;
            let displayValue = this.sliderState.displayValue;
            if (value < this.sliderState.displayValue) {
                this.log.w(`Setting current value ${this.sliderState.displayValue} to the new maximum value ${value} provided as it is now out of range.`);
                displayValue = value;
            }
            this.updateSliderStateFromDisplayValue(displayValue);
        }
        get currentValue() {
            return this.sliderState?.displayValue ?? null;
        }
        set currentValue(value) {
            if (value < this._minValue) {
                this.log.w(`Slider value will be set to the minimum value: ${this._minValue} as the provided value ${value} was less than the minimum value allowed.`);
                value = this._minValue;
            }
            else if (value > this._maxValue) {
                this.log.w(`Slider value will be set to the maximum value: ${this._maxValue} as the provided value ${value} was greater than the maximum value allowed.`);
                value = this._maxValue;
            }
            this.updateSliderStateFromDisplayValue(value);
        }
        get stepSize() {
            return this._stepSize;
        }
        set stepSize(stepSize) {
            if (stepSize > this._maxValue - this._minValue) {
                this.log.e(`Could not set step size to ${stepSize} as it must be less than the slider's value range.`);
                return;
            }
            else if (stepSize < 0) {
                this.log.e(`Could not set step size to ${stepSize} as it must be greater than or equal to 0.`);
                return;
            }
            this._stepSize = stepSize;
        }
        get startPosition() {
            return this._startPosition;
        }
        set startPosition(position) {
            this._startPosition = position;
            this.trackState = this.getTrackState();
            this.updateSliderState(null);
        }
        get endPosition() {
            return this._endPosition;
        }
        set endPosition(position) {
            this._endPosition = position;
            this.trackState = this.getTrackState();
            this.updateSliderState(null);
        }
        get sliderKnob() {
            return this._sliderKnob;
        }
        getInitialSliderState() {
            const rawValue = this.calculateRawValueFromDisplayValue(this.startValue);
            const displayValue = this.getSteppedDisplayValue(this.startValue);
            const snappedValue = this.calculateRawValueFromDisplayValue(displayValue);
            return {
                dragVector: null,
                rawValue: rawValue,
                snappedValue: snappedValue,
                displayValue: displayValue
            };
        }
        getTrackState() {
            const direction = this._endPosition.sub(this._startPosition).normalize();
            const min = -this._startPosition.length;
            const max = this._endPosition.length;
            return {
                trackMin: min,
                trackMax: max,
                trackSize: max - min,
                trackDirection: direction
            };
        }
        /**
         * Sets up event callbacks for behavior on the Interactable's interaction events.
         */
        setupInteractable() {
            if (this.interactable === null) {
                throw new Error("Slider Knob must contain an Interactable component for the slider to work - please ensure that one is added to the SceneObject.");
            }
            this.interactable.useFilteredPinch = true;
            this.interactable.keepHoverOnTrigger = true;
            // If this is not a slider with step size, enable instant dragging for more responsive behavior.
            if (this.stepSize === 0) {
                this.interactable.enableInstantDrag = true;
            }
            this.unsubscribeBag.push(this.interactable.onHoverEnter.add(() => {
                this.onHoverEnterEvent.invoke();
            }));
            this.unsubscribeBag.push(this.interactable.onHoverExit.add(() => {
                this.onHoverExitEvent.invoke();
            }));
            this.unsubscribeBag.push(this.interactable.onDragStart.add((event) => {
                (0, validate_1.validate)(this.sliderState);
                (0, validate_1.validate)(event.planecastDragVector);
                (0, validate_1.validate)(event.interactor.planecastPoint);
                this.onSlideStartEvent.invoke(this.sliderState.displayValue);
                this.isDragging = true;
                this.updateSliderState({
                    dragVector: event.interactor.dragType !== Interactor_1.DragType.Touchpad ? event.planecastDragVector : event.dragVector,
                    dragPoint: event.interactor.planecastPoint
                });
            }));
            this.unsubscribeBag.push(this.interactable.onDragUpdate.add((event) => {
                (0, validate_1.validate)(event.planecastDragVector);
                (0, validate_1.validate)(event.interactor.planecastPoint);
                this.updateSliderState({
                    dragVector: event.interactor.dragType !== Interactor_1.DragType.Touchpad ? event.planecastDragVector : event.dragVector,
                    dragPoint: event.interactor.planecastPoint
                });
            }));
            this.unsubscribeBag.push(this.interactable.onDragEnd.add(() => {
                (0, validate_1.validate)(this.sliderState);
                this.onSlideEndEvent.invoke(this.sliderState.displayValue);
                this.isDragging = false;
                this.updateSliderState(null);
            }));
            this.unsubscribeBag.push(this.interactable.onTriggerEnd.add(() => {
                this.toggleSliderState();
            }));
            this.unsubscribeBag.push(this.interactable.onTriggerEndOutside.add(() => {
                this.toggleSliderState();
            }));
            this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add(() => {
                this.toggleSliderState();
            }));
        }
        setupConnectionCallbacks() {
            if (this.syncEntity.currentStore.getAllKeys().find((key) => {
                return key === SLIDER_VALUE_KEY;
            })) {
                this.currentValue = this.syncEntity.currentStore.getFloat(SLIDER_VALUE_KEY);
            }
            else {
                this.syncEntity.currentStore.putFloat(SLIDER_VALUE_KEY, this.currentValue);
            }
            this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this));
        }
        processStoreUpdate(_session, store, key, info) {
            const connectionId = info.updaterInfo.connectionId;
            const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId();
            if (updatedByLocal) {
                return;
            }
            if (key === SLIDER_VALUE_KEY) {
                this.updateSliderStateFromDisplayValue(store.getFloat(key), false);
            }
        }
        updateSyncStore() {
            if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
                this.syncEntity.currentStore.putFloat(SLIDER_VALUE_KEY, this.currentValue);
            }
        }
        calculateRawValueFromDragVector(dragVector) {
            (0, validate_1.validate)(this.sliderState);
            if (dragVector === null) {
                return this.sliderState.rawValue;
            }
            (0, validate_1.validate)(this.trackState);
            dragVector = this.transform.getInvertedWorldTransform().multiplyDirection(dragVector);
            return MathUtils.clamp(this.sliderState.rawValue + this.trackState.trackDirection.dot(dragVector), this.trackState.trackMin, this.trackState.trackMax);
        }
        calculateDisplayValueFromRawValue(rawValue) {
            (0, validate_1.validate)(this.trackState);
            const displayValue = MathUtils.remap(rawValue, this.trackState.trackMin, this.trackState.trackMax, this._minValue, this._maxValue);
            return this.getSteppedDisplayValue(displayValue);
        }
        calculateRawValueFromDisplayValue(displayValue) {
            (0, validate_1.validate)(this.trackState);
            return MathUtils.remap(displayValue, this._minValue, this._maxValue, this.trackState.trackMin, this.trackState.trackMax);
        }
        getSteppedDisplayValue(displayValue) {
            return this._stepSize > 0
                ? this._minValue + Math.round((displayValue - this._minValue) / this._stepSize) * this._stepSize
                : displayValue;
        }
        /**
         * Updates SliderState representing the most updated version of the slider, using the drag vector if active.
         * @param dragUpdate - the drag vector provided by the Interactor, or null if a drag is not active.
         */
        updateSliderState(dragUpdate) {
            (0, validate_1.validate)(this.sliderState);
            if (dragUpdate === null) {
                this.sliderState.dragVector = null;
                return;
            }
            const localizedDragPoint = this.transform.getInvertedWorldTransform().multiplyPoint(dragUpdate.dragPoint);
            // Check that the drag point is between the start/end points.
            const dragPointCheck = this.checkOutsideTrackBoundary(localizedDragPoint);
            if (dragPointCheck === -1) {
                this.currentValue = this.minValue;
                return;
            }
            else if (dragPointCheck === 1) {
                this.currentValue = this.maxValue;
                return;
            }
            const rawValue = this.calculateRawValueFromDragVector(dragUpdate.dragVector);
            const displayValue = this.calculateDisplayValueFromRawValue(rawValue);
            const snappedValue = this.calculateRawValueFromDisplayValue(displayValue);
            if (this.sliderState.displayValue !== displayValue) {
                this.onValueUpdateEvent?.invoke(displayValue);
            }
            this.sliderState = {
                dragVector: dragUpdate.dragVector,
                rawValue: rawValue,
                snappedValue: snappedValue,
                displayValue: displayValue
            };
            this.updateUI();
            this.updateSyncStore();
        }
        // Check if a local point is to the left of the start point (-1) or the right of the end point (1).
        checkOutsideTrackBoundary(localPoint) {
            (0, validate_1.validate)(this.trackState);
            const isPastStartPoint = localPoint.sub(this.sliderBounds.start).angleTo(this.trackState.trackDirection) > Math.PI / 2;
            const isPastEndPoint = localPoint.sub(this.sliderBounds.end).angleTo(this.trackState.trackDirection) < Math.PI / 2;
            if (isPastStartPoint) {
                return -1;
            }
            if (isPastEndPoint) {
                return 1;
            }
            return 0;
        }
        toggleSliderState() {
            if (this.isDragging) {
                return;
            }
            (0, validate_1.validate)(this.currentValue);
            const initialValue = this.currentValue;
            if (this.stepSize === this.maxValue - this.minValue) {
                if (initialValue === this.minValue) {
                    this.currentValue = this.maxValue;
                }
                else if (initialValue === this.maxValue) {
                    this.currentValue = this.minValue;
                }
                this.animateToggleUI(initialValue < this.currentValue);
            }
        }
        animateToggleUI(toggledOn) {
            (0, animate_1.default)({
                duration: this.toggleDuration,
                easing: "ease-out-cubic",
                update: (t) => {
                    (0, validate_1.validate)(this.sliderKnobScreenTransform);
                    (0, validate_1.validate)(this.minBound);
                    (0, validate_1.validate)(this.maxBound);
                    const lerpValue = toggledOn ? t : 1 - t;
                    this.sliderKnobScreenTransform.anchors.setCenter(vec2.lerp(this.minBound, this.maxBound, lerpValue));
                }
            });
        }
        /**
         * Updates SliderState representing the most updated version of the slider, using a provided display value.
         * @param displayValue - the desired display value.
         */
        updateSliderStateFromDisplayValue(displayValue, shouldSync = true) {
            (0, validate_1.validate)(this.sliderState);
            const snappedValue = this.calculateRawValueFromDisplayValue(displayValue);
            if (displayValue !== this.sliderState.displayValue) {
                this.onValueUpdateEvent?.invoke(displayValue);
            }
            this.sliderState = {
                dragVector: null,
                rawValue: snappedValue,
                snappedValue: snappedValue,
                displayValue: displayValue
            };
            this.updateUI();
            if (shouldSync) {
                this.updateSyncStore();
            }
        }
        /**
         * Updates the slider UI based on the snapped value, by moving the knob's position.
         */
        updateUI() {
            (0, validate_1.validate)(this.sliderKnobScreenTransform);
            (0, validate_1.validate)(this.sliderState);
            (0, validate_1.validate)(this.trackState);
            this.sliderKnobScreenTransform.anchors.setCenter(vec2.lerp(this.minBound, this.maxBound, (this.sliderState.snappedValue - this.trackState.trackMin) / this.trackState.trackSize));
        }
        /**
         * Unsubscribes all the slider-specific callbacks to the Interactable component before this component is destroyed.
         */
        unsubscribeCallbacks() {
            this.unsubscribeBag.forEach((unsubscribeCallback) => {
                unsubscribeCallback();
            });
            this.unsubscribeBag = [];
        }
    };
    __setFunctionName(_classThis, "Slider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Slider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Slider = _classThis;
})();
exports.Slider = Slider;
//# sourceMappingURL=Slider.js.map