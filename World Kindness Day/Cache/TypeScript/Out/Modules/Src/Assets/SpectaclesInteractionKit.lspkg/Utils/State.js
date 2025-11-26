"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = void 0;
/**
 * Transition class for a State
 */
class Transition {
    get checkOnUpdate() {
        return this.config.checkOnUpdate;
    }
    get checkOnSignal() {
        return this.config.checkOnSignal;
    }
    get nextStateName() {
        return this.config.nextStateName;
    }
    get onExecution() {
        return this.config.onExecution;
    }
    constructor(config) {
        this.config = config;
    }
}
exports.Transition = Transition;
/**
 * State class for a StateMachine
 */
class State {
    get name() {
        return this.config.name;
    }
    constructor(config) {
        this.config = config;
        this.stateStartTime = 0;
        this.stateElapsedTime = 0;
        this.updateTransitions = [];
        this.signalTransitions = [];
        if (config.transitions !== undefined) {
            config.transitions.forEach((transitionConfig) => {
                const transition = new Transition(transitionConfig);
                if (transition.checkOnSignal !== undefined) {
                    this.signalTransitions.push(transition);
                }
                if (transition.checkOnUpdate !== undefined) {
                    this.updateTransitions.push(transition);
                }
            });
        }
    }
    /**
     * Check if any of the UpdateTransitions are true. Called once per Update
     */
    checkUpdate() {
        for (const transition of this.updateTransitions) {
            if (transition.checkOnUpdate(this) === true) {
                return transition;
            }
        }
        return null;
    }
    /**
     * Check if any of SignalTransitions are true. Called once per Signal
     *
     * @param signal sent
     * @param data optional from signal
     */
    checkSignal(signal, data) {
        for (const transition of this.signalTransitions) {
            if (transition.checkOnSignal(signal, data) === true) {
                return transition;
            }
        }
        return null;
    }
    /**
     * Triggers the onEnter callback
     */
    onEnter() {
        if (this.config.onEnter !== undefined) {
            this.config.onEnter(this);
        }
    }
    /**
     * Triggers the onExit callback
     */
    onExit() {
        if (this.config.onExit !== undefined) {
            this.config.onExit(this);
        }
    }
    /**
     * Triggers the onUpdate callback
     */
    onUpdate() {
        if (this.config.onUpdate !== undefined) {
            this.config.onUpdate(this);
        }
    }
    /**
     * Triggers the onLateUpdate callback
     */
    onLateUpdate() {
        if (this.config.onLateUpdate !== undefined) {
            this.config.onLateUpdate(this);
        }
    }
    /**
     * Triggers the onSignal callback
     */
    onSignal(signal, data) {
        if (this.config.onSignal !== undefined) {
            this.config.onSignal(signal, data);
        }
    }
}
exports.default = State;
//# sourceMappingURL=State.js.map