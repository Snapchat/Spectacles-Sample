"use strict";
/**
 * StateMachine
 */
Object.defineProperty(exports, "__esModule", { value: true });
const NativeLogger_1 = require("./NativeLogger");
const State_1 = require("./State");
const LensConfig_1 = require("./LensConfig");
const TAG = "StateMachine";
class StateMachine {
    constructor(name) {
        this._currentState = null;
        this.states = {};
        this.stateCount = 0;
        this.name = name ?? "StateMachine";
        this.log = new NativeLogger_1.default(TAG + "#" + this.name);
        const lensConfig = LensConfig_1.LensConfig.getInstance();
        this.updateDispatcher = lensConfig.updateDispatcher;
        this.updateEvent = this.updateDispatcher.createUpdateEvent(`StateMachine${this.name}Update`, () => this.update());
        this.lateUpdateEvent = this.updateDispatcher.createLateUpdateEvent(`StateMachine${this.name}LateUpdate`, () => this.lateUpdate());
    }
    destroy() {
        this.log.d("destroy");
        this._currentState = null;
        this.updateDispatcher.removeEvent(this.updateEvent);
        this.updateDispatcher.removeEvent(this.lateUpdateEvent);
    }
    get currentState() {
        return this._currentState;
    }
    /**
     * Add a new state to the state machine.
     * @param config StateConfig. State names are Unique
     */
    addState(config) {
        const newState = new State_1.default(config);
        this.states[newState.name] = newState;
        this.stateCount++;
        return newState;
    }
    /**
     * Change states
     * @param stateName to enter
     * @param skipOnEnter set to true in order to call enterState without calling that state's onEnter() function
     */
    enterState(stateName, skipOnEnter = false) {
        if (this.states[stateName] === undefined) {
            //   this.log(`Invalid state ${stateName}`)
            return;
        }
        const oldState = this._currentState;
        if (oldState !== null) {
            this.exitState();
        }
        // this.log(`Entering State - ${stateName}`)
        const newState = this.states[stateName];
        this._currentState = newState;
        this._currentState.stateElapsedTime = 0;
        this._currentState.stateStartTime = getTime();
        if (skipOnEnter) {
            return;
        }
        this._currentState.onEnter();
    }
    /**
     * Send a signal to the statemachine to possibly change states
     * @param signal name of the signal
     * @param data optional data
     */
    sendSignal(signal, data = null) {
        if (this._currentState === null) {
            return;
        }
        this._currentState.onSignal(signal, data);
        const transition = this._currentState.checkSignal(signal, data);
        if (transition !== null) {
            this.executeTransition(transition);
        }
    }
    exitState() {
        if (this._currentState !== null) {
            //   this.log(`Exiting State - ${this._currentState.name}`)
            this._currentState.onExit();
        }
    }
    executeTransition(transition) {
        // this.log(`Executing Transition to ${transition.nextStateName}`)
        if (transition.onExecution !== undefined) {
            transition.onExecution();
        }
        this.enterState(transition.nextStateName);
    }
    update() {
        if (this._currentState === null) {
            return;
        }
        this._currentState.stateElapsedTime = getTime() - this._currentState.stateStartTime;
        const transition = this._currentState.checkUpdate();
        if (transition !== null) {
            this.executeTransition(transition);
        }
        this._currentState.onUpdate();
    }
    lateUpdate() {
        if (this._currentState === null) {
            return;
        }
        this._currentState.stateElapsedTime = getTime() - this._currentState.stateStartTime;
        this._currentState.onLateUpdate();
    }
}
exports.default = StateMachine;
//# sourceMappingURL=StateMachine.js.map