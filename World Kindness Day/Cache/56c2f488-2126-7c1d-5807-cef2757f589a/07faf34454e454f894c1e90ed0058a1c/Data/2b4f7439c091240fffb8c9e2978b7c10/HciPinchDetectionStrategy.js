"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../../../../../Utils/Event");
const NativeLogger_1 = require("../../../../../Utils/NativeLogger");
const GestureModuleProvider_1 = require("../../../GestureProvider/GestureModuleProvider");
const PinchEventType_1 = require("../../PinchEventType");
const TAG = "HciPinchDetection";
/**
 * Class to detect pinch by calling into HCI Gesture APIs at lenscore level
 */
class HciPinchDetectionStrategy {
    constructor(config) {
        this.config = config;
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.gestureModuleProvider = GestureModuleProvider_1.default.getInstance();
        this.gestureModule = undefined;
        this._onPinchDetectedEvent = new Event_1.default();
        this._onPinchDetected = this._onPinchDetectedEvent.publicApi();
        this._onPinchProximityEvent = new Event_1.default();
        this._onPinchProximity = this._onPinchProximityEvent.publicApi();
        /**
         * For firmwares that do not have the filtered pinch events, ensure that Interactables see regular pinch events even
         * if they are subscribed to filtered pinch events.
         */
        this._isFilteredPinchAvailable = false;
        this.setupPinchApi();
    }
    /** @inheritdoc */
    get onPinchDetected() {
        return this._onPinchDetected;
    }
    /** @inheritdoc */
    get onPinchProximity() {
        return this._onPinchProximity;
    }
    /**
     * Return if fitlered pinch events are available from the GestureModule.
     */
    get isFilteredPinchAvailable() {
        return this._isFilteredPinchAvailable;
    }
    get gestureHandType() {
        return this.config.handType === "right" ? GestureModule.HandType.Right : GestureModule.HandType.Left;
    }
    setupPinchApi() {
        this.gestureModule = this.gestureModuleProvider.getModule();
        if (this.gestureModule !== undefined) {
            this._isFilteredPinchAvailable =
                this.gestureModule.getFilteredPinchDownEvent !== undefined &&
                    this.gestureModule.getFilteredPinchUpEvent !== undefined;
            this.gestureModule.getPinchDownEvent(this.gestureHandType).add(() => {
                this.log.i(`GestureModule PinchDownEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`);
                this._onPinchDetectedEvent.invoke({
                    eventType: PinchEventType_1.PinchEventType.Down,
                    isFiltered: false
                });
            });
            this.gestureModule.getPinchUpEvent(this.gestureHandType).add(() => {
                this.log.i(`GestureModule PinchUpEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`);
                this._onPinchDetectedEvent.invoke({
                    eventType: PinchEventType_1.PinchEventType.Up,
                    isFiltered: false
                });
            });
            if (this.isFilteredPinchAvailable)
                this.gestureModule.getFilteredPinchDownEvent(this.gestureHandType).add(() => {
                    this.log.i(`GestureModule FilteredPinchDownEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`);
                    this._onPinchDetectedEvent.invoke({
                        eventType: PinchEventType_1.PinchEventType.Down,
                        isFiltered: true
                    });
                });
            if (this.isFilteredPinchAvailable)
                this.gestureModule.getFilteredPinchUpEvent(this.gestureHandType).add(() => {
                    this.log.i(`GestureModule FilteredPinchUpEvent: { hand type: ${this.gestureHandType === 0 ? "Left" : "Right"} }`);
                    this._onPinchDetectedEvent.invoke({
                        eventType: PinchEventType_1.PinchEventType.Up,
                        isFiltered: true
                    });
                });
            if (this.gestureModule.getPinchStrengthEvent !== undefined) {
                this.gestureModule.getPinchStrengthEvent(this.gestureHandType).add((args) => {
                    const proximity = args.strength;
                    this._onPinchProximityEvent.invoke(proximity);
                });
            }
        }
    }
}
exports.default = HciPinchDetectionStrategy;
//# sourceMappingURL=HciPinchDetectionStrategy.js.map