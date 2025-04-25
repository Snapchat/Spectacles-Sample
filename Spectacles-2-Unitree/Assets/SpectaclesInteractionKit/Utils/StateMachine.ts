/**
 * StateMachine
 */

import NativeLogger from "./NativeLogger"
import State, {StateConfig, Transition} from "./State"

import {LensConfig} from "./LensConfig"

const TAG = "StateMachine"

export default class StateMachine {
  private name: string
  private _currentState: State | null = null
  private states: any = {}
  private stateCount = 0
  private verboseLogs = false

  private log = new NativeLogger(TAG)

  constructor(name: string) {
    this.name = name ?? "StateMachine"

    let lensConfig = LensConfig.getInstance()
    let updateDispatcher = lensConfig.updateDispatcher
    updateDispatcher.createUpdateEvent("StateMachineUpdate").bind(() => {
      this.update()
    })
    updateDispatcher
      .createLateUpdateEvent("StateMachineLateUpdate")
      .bind(() => {
        this.lateUpdate()
      })
  }

  get currentState(): State | null {
    return this._currentState
  }

  /**
   * Add a new state to the state machine.
   * @param config StateConfig. State names are Unique
   */
  addState(config: StateConfig): State {
    let newState = new State(config)
    this.states[newState.name] = newState
    this.stateCount++

    return newState
  }

  /**
   * Change states
   * @param stateName to enter
   * @param skipOnEnter set to true in order to call enterState without calling that state's onEnter() function
   */
  enterState(stateName: string, skipOnEnter = false) {
    if (this.states[stateName] === undefined) {
      //   this.log(`Invalid state ${stateName}`)
      return
    }

    let oldState = this._currentState
    if (oldState !== null) {
      this.exitState()
    }

    // this.log(`Entering State - ${stateName}`)
    let newState = this.states[stateName] as State
    this._currentState = newState
    this._currentState.stateElapsedTime = 0
    this._currentState.stateStartTime = getTime()

    if (skipOnEnter) {
      return
    }
    this._currentState.onEnter()
  }

  /**
   * Send a signal to the statemachine to possibly change states
   * @param signal name of the signal
   * @param data optional data
   */
  sendSignal(signal: string, data: any = null) {
    if (this._currentState === null) {
      return
    }

    this._currentState.onSignal()

    let transition = this._currentState.checkSignal(signal, data)
    if (transition !== null) {
      this.executeTransition(transition)
    }
  }

  private exitState() {
    if (this._currentState !== null) {
      //   this.log(`Exiting State - ${this._currentState.name}`)
      this._currentState.onExit()
    }
  }

  private executeTransition(transition: Transition) {
    // this.log(`Executing Transition to ${transition.nextStateName}`)
    if (transition.onExecution !== undefined) {
      transition.onExecution()
    }

    this.enterState(transition.nextStateName)
  }

  private update() {
    if (this._currentState === null) {
      return
    }

    this._currentState.stateElapsedTime =
      getTime() - this._currentState.stateStartTime

    let transition = this._currentState.checkUpdate()
    if (transition !== null) {
      this.executeTransition(transition)
    }

    this._currentState.onUpdate()
  }

  private lateUpdate() {
    if (this._currentState === null) {
      return
    }

    this._currentState.stateElapsedTime =
      getTime() - this._currentState.stateStartTime

    this._currentState.onLateUpdate()
  }
}
