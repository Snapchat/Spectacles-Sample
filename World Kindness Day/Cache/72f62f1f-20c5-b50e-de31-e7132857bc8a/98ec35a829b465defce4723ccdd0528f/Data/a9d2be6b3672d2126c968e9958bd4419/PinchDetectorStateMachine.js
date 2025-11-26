"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinchDetectorState = void 0;
const Event_1 = require("../../../../Utils/Event");
const NativeLogger_1 = require("../../../../Utils/NativeLogger");
const StateMachine_1 = require("../../../../Utils/StateMachine");
const PinchEventType_1 = require("../PinchEventType");
const TAG = "PinchDetectorStateMachine";
var PinchDetectorState;
(function (PinchDetectorState) {
    PinchDetectorState["Idle"] = "Idle";
    PinchDetectorState["Pinching"] = "Pinching";
})(PinchDetectorState || (exports.PinchDetectorState = PinchDetectorState = {}));
/**
 * Tracks states and transitions of pinching
 */
class PinchDetectorStateMachine {
    constructor() {
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.stateMachine = new StateMachine_1.default("PinchDetectorStateMachine");
        this.onPinchDownEvent = new Event_1.default();
        this.onPinchDown = this.onPinchDownEvent.publicApi();
        this.onPinchUpEvent = new Event_1.default();
        this.onPinchUp = this.onPinchUpEvent.publicApi();
        this.onPinchCancelEvent = new Event_1.default();
        this.onPinchCancel = this.onPinchCancelEvent.publicApi();
        this.setupStateMachine();
        this.stateMachine.enterState(PinchDetectorState.Idle);
    }
    /**
     * Determines if the user is pinching
     * @returns whether the state machine is currently in the Pinching state
     */
    isPinching() {
        return this.stateMachine.currentState?.name === PinchDetectorState.Pinching;
    }
    /**
     * Notifies that a pinch event has been detected
     * @param pinchEventType The type of event that was detected
     */
    notifyPinchEvent(pinchEventType) {
        this.stateMachine.sendSignal(pinchEventType);
    }
    setupStateMachine() {
        this.stateMachine.addState({
            name: PinchDetectorState.Idle,
            onEnter: () => { },
            transitions: [
                {
                    nextStateName: PinchDetectorState.Pinching,
                    checkOnSignal: (signal) => {
                        if (signal === PinchEventType_1.PinchEventType.Down) {
                            this.onPinchDownEvent.invoke();
                            this.log.i("PinchEvent : Pinch Down Event");
                            return true;
                        }
                        return false;
                    }
                }
            ]
        });
        this.stateMachine.addState({
            name: PinchDetectorState.Pinching,
            onEnter: () => { },
            transitions: [
                {
                    nextStateName: PinchDetectorState.Idle,
                    checkOnSignal: (signal) => {
                        if (signal === PinchEventType_1.PinchEventType.Up) {
                            this.onPinchUpEvent.invoke();
                            this.log.i("PinchEvent : Pinch Up Event");
                            return true;
                        }
                        else if (signal === PinchEventType_1.PinchEventType.Cancel) {
                            this.onPinchCancelEvent.invoke();
                            this.log.i("PinchEvent : Pinch Cancel Event");
                            return true;
                        }
                        return false;
                    }
                }
            ]
        });
    }
}
exports.default = PinchDetectorStateMachine;
//# sourceMappingURL=PinchDetectorStateMachine.js.map