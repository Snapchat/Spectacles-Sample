export type Callback = (state: State) => void
export type SignalCallback = (signal: string, data: any) => void

export type StateConfig = {
  name: string
} & Partial<{
  onEnter: Callback
  onExit: Callback
  onUpdate: Callback
  onLateUpdate: Callback
  onSignal: SignalCallback
  transitions: TransitionConfig[]
}>

export type CheckUpdateCallback = (state: State) => boolean
export type CheckSignalCallback = (signal: string, data: any) => boolean
export type TransitionExecutionCallback = () => void

export type TransitionConfig = {
  nextStateName: string
} & Partial<{
  checkOnUpdate: CheckUpdateCallback
  checkOnSignal: CheckSignalCallback
  onExecution: TransitionExecutionCallback
}>

/**
 * Transition class for a State
 */
export class Transition {
  get checkOnUpdate() {
    return this.config.checkOnUpdate
  }

  get checkOnSignal() {
    return this.config.checkOnSignal
  }

  get nextStateName() {
    return this.config.nextStateName
  }

  get onExecution() {
    return this.config.onExecution
  }

  constructor(private config: TransitionConfig) {}
}

/**
 * State class for a StateMachine
 */
export default class State {
  get name() {
    return this.config.name
  }

  stateStartTime = 0
  stateElapsedTime = 0

  private updateTransitions: Transition[] = []
  private signalTransitions: Transition[] = []

  constructor(private config: StateConfig) {
    if (config.transitions !== undefined) {
      config.transitions.forEach((transitionConfig) => {
        const transition = new Transition(transitionConfig)

        if (transition.checkOnSignal !== undefined) {
          this.signalTransitions.push(transition)
        }

        if (transition.checkOnUpdate !== undefined) {
          this.updateTransitions.push(transition)
        }
      })
    }
  }

  /**
   * Check if any of the UpdateTransitions are true. Called once per Update
   */
  checkUpdate(): Transition | null {
    for (const transition of this.updateTransitions) {
      if (transition.checkOnUpdate!(this) === true) {
        return transition
      }
    }
    return null
  }

  /**
   * Check if any of SignalTransitions are true. Called once per Signal
   *
   * @param signal sent
   * @param data optional from signal
   */
  checkSignal(signal: string, data: any): Transition | null {
    for (const transition of this.signalTransitions) {
      if (transition.checkOnSignal!(signal, data) === true) {
        return transition
      }
    }

    return null
  }

  /**
   * Triggers the onEnter callback
   */
  onEnter() {
    if (this.config.onEnter !== undefined) {
      this.config.onEnter(this)
    }
  }

  /**
   * Triggers the onExit callback
   */
  onExit() {
    if (this.config.onExit !== undefined) {
      this.config.onExit(this)
    }
  }

  /**
   * Triggers the onUpdate callback
   */
  onUpdate() {
    if (this.config.onUpdate !== undefined) {
      this.config.onUpdate(this)
    }
  }

  /**
   * Triggers the onLateUpdate callback
   */
  onLateUpdate() {
    if (this.config.onLateUpdate !== undefined) {
      this.config.onLateUpdate(this)
    }
  }

  /**
   * Triggers the onSignal callback
   */
  onSignal(signal: string, data: any) {
    if (this.config.onSignal !== undefined) {
      this.config.onSignal(signal, data)
    }
  }
}
