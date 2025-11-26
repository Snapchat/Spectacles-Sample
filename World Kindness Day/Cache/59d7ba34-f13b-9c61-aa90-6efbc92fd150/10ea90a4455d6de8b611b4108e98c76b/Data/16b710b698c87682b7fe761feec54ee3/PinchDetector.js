"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinchDetector = exports.PinchDetectionSelection = void 0;
const NativeLogger_1 = require("../../../../Utils/NativeLogger");
const HciPinchDetectionStrategy_1 = require("./DetectionStrategies/HciPinchDetectionStrategy");
const PinchDetectorStateMachine_1 = require("./PinchDetectorStateMachine");
var PinchDetectionSelection;
(function (PinchDetectionSelection) {
    PinchDetectionSelection["Heuristic"] = "Heuristic";
    PinchDetectionSelection["LensCoreML"] = "LensCore ML";
    PinchDetectionSelection["Mock"] = "Mock";
})(PinchDetectionSelection || (exports.PinchDetectionSelection = PinchDetectionSelection = {}));
/**
 * Wraps PinchDetectionStrategy inside PinchDetectorStateMachine for pinch events
 */
class PinchDetector {
    constructor(config) {
        this.config = config;
        /**
         * Determines if the pinch detector should listen to filtered or unfiltered pinch events.
         */
        this.useFilteredPinch = false;
        this.pinchDetectionStrategy = new HciPinchDetectionStrategy_1.default(this.config);
        this.pinchDetectorStateMachine = new PinchDetectorStateMachine_1.default();
        this.pinchStrength = 0;
        this.log = new NativeLogger_1.default("PinchDetector");
        config.pinchDownThreshold ??= 1.75;
        config.pinchDetectionSelection ??= PinchDetectionSelection.LensCoreML;
        this.setupPinchEventCallback();
    }
    /**
     * Event called when the user has successfully pinched down.
     */
    get onPinchDown() {
        return this.pinchDetectorStateMachine.onPinchDown;
    }
    /**
     * Event called when the user has released pinching after they
     * have successfully pinched down.
     */
    get onPinchUp() {
        return this.pinchDetectorStateMachine.onPinchUp;
    }
    /**
     * Event called when the user's pinch is canceled by the system.
     */
    get onPinchCancel() {
        return this.pinchDetectorStateMachine.onPinchCancel;
    }
    /**
     * Determines if the user is pinching
     */
    isPinching() {
        return this.pinchDetectorStateMachine.isPinching();
    }
    /**
     * Returns a normalized value from 0-1, where:
     * 0 is the distance from a finger tip to the thumb tip in
     * resting/neutral hand pose.
     * 1 is when a finger tip to thumb tip are touching/pinching
     */
    getPinchStrength() {
        if (this.config.isTracked()) {
            return this.pinchStrength;
        }
        return 0;
    }
    setupPinchEventCallback() {
        /**
         * If the pinch detector is not set to the same filtering as the detected event when filtered events are available,
         * ignore the event entirely. If filtered events are not available, process every regular pinch event.
         */
        this.pinchDetectionStrategy.onPinchDetected.add((pinchEvent) => {
            if (!this.pinchDetectionStrategy.isFilteredPinchAvailable || pinchEvent.isFiltered === this.useFilteredPinch) {
                this.pinchDetectorStateMachine.notifyPinchEvent(pinchEvent.eventType);
            }
        });
        this.pinchDetectionStrategy.onPinchProximity.add((proximity) => {
            this.pinchStrength = proximity;
        });
    }
}
exports.PinchDetector = PinchDetector;
//# sourceMappingURL=PinchDetector.js.map