"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PalmTapDetectorState = void 0;
const Event_1 = require("../../../../Utils/Event");
const NativeLogger_1 = require("../../../../Utils/NativeLogger");
const StateMachine_1 = require("../../../../Utils/StateMachine");
const InteractionConfigurationProvider_1 = require("../../../InteractionConfigurationProvider/InteractionConfigurationProvider");
const PalmTapEvent_1 = require("../PalmTapEvent");
const TAG = "PalmTapDetectorStateMachine";
var PalmTapDetectorState;
(function (PalmTapDetectorState) {
    PalmTapDetectorState["Idle"] = "Idle";
    PalmTapDetectorState["Tap"] = "Tap";
})(PalmTapDetectorState || (exports.PalmTapDetectorState = PalmTapDetectorState = {}));
/**
 * Tracks states and transitions of palm tapping
 */
class PalmTapDetectorStateMachine {
    constructor() {
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.interactionConfigurationProvider = InteractionConfigurationProvider_1.InteractionConfigurationProvider.getInstance();
        this.stateMachine = new StateMachine_1.default("PalmTapDetectorStateMachine");
        this.onPalmTapDownEvent = new Event_1.default();
        this.onPalmTapDown = this.onPalmTapDownEvent.publicApi();
        this.onPalmTapUpEvent = new Event_1.default();
        this.onPalmTapUp = this.onPalmTapUpEvent.publicApi();
        this.setupStateMachine();
    }
    /**
     * @returns whether the user is tapping
     */
    isTapping() {
        return this.stateMachine.currentState?.name === PalmTapDetectorState.Tap;
    }
    /**
     * Notifies that a palm tap event has been detected
     * @param palmTapEventType The type of event that was detected
     */
    notifyPalmTapEvent(palmTapEventType) {
        this.stateMachine.sendSignal(palmTapEventType);
    }
    setupStateMachine() {
        this.stateMachine.addState({
            name: PalmTapDetectorState.Idle,
            onEnter: () => { },
            transitions: [
                {
                    nextStateName: PalmTapDetectorState.Tap,
                    checkOnSignal: (signal) => {
                        return signal === PalmTapEvent_1.PalmTapEventType.Down;
                    }
                }
            ]
        });
        this.stateMachine.addState({
            name: PalmTapDetectorState.Tap,
            onEnter: () => {
                this.onPalmTapDownEvent.invoke();
                this.log.i("PalmTapEvent : PalmTap Down Event");
            },
            onExit: () => {
                this.onPalmTapUpEvent.invoke();
                this.log.i("PalmTapEvent : PalmTap Up Event");
            },
            transitions: [
                {
                    nextStateName: PalmTapDetectorState.Idle,
                    checkOnSignal: (signal) => {
                        return signal === PalmTapEvent_1.PalmTapEventType.Up;
                    }
                }
            ]
        });
        this.stateMachine.enterState(PalmTapDetectorState.Idle);
    }
}
exports.default = PalmTapDetectorStateMachine;
//# sourceMappingURL=PalmTapDetectorStateMachine.js.map