import {HandType} from "../../../Providers/HandInputData/HandType"
import Event from "../../../Utils/Event"
import {LogLevel} from "../../../Utils/LogLevel"
import NativeLogger from "../../../Utils/NativeLogger"
import StateMachine from "../../../Utils/StateMachine"

const TAG = "GlowEffectViewModel"

export enum GlowEffectStates {
  IdleTargeting = "IdleTargeting",
  IdleNotTargeting = "IdleNotTargeting",
  NearPinching = "NearPinching",
  Pinching = "Pinching",
  PinchingNotTargeting = "PinchingNotTargeting",
  NearTapping = "NearTapping",
  Tapping = "Tapping",
}

export enum StateMachineSignals {
  EnterTargeting = "EnterTargeting",
  ExitTargeting = "ExitTargeting",
  EnterNearPinch = "EnterNearPinch",
  ExitNearPinch = "ExitNearPinch",
  EnterPinch = "EnterPinch",
  ExitPinch = "ExitPinch",
  EnterPalmUIMode = "EnterPalmUIMode",
  ExitPalmUIMode = "ExitPalmUIMode",
  EnterTap = "EnterTap",
  ExitTap = "ExitTap",
}

export type GlowEffectViewModelConfig = {
  handType: HandType
  logLevel: LogLevel
}

/*
 * GlowEffectViewModel manages the state of the glow effect for pinch and tap on hand visuals
 */
export class GlowEffectViewModel {
  // Get LogLevel from config, this avoids having a SIK dependency in the ViewModel
  private log = new NativeLogger(TAG)

  // Events used to communicate with the GlowEffectView
  private animateIndexGlowBaseEvent = new Event<boolean>()
  readonly animateIndexGlowBase = this.animateIndexGlowBaseEvent.publicApi()

  private animateIndexGlowBonusEvent = new Event<boolean>()
  readonly animateIndexGlowBonus = this.animateIndexGlowBonusEvent.publicApi()

  private animateThumbGlowBaseEvent = new Event<boolean>()
  readonly animateThumbGlowBase = this.animateThumbGlowBaseEvent.publicApi()

  private animateThumbGlowBonusEvent = new Event<boolean>()
  readonly animateThumbGlowBonus = this.animateThumbGlowBonusEvent.publicApi()

  private tapModeChangedEvent = new Event<boolean>()
  readonly tapModeChanged = this.tapModeChangedEvent.publicApi()

  private stateMachine = this.createStateMachine()

  constructor(private config: GlowEffectViewModelConfig) {}

  /**
   * Call to notify that we have entered or exited targeting mode
   *
   * @param enteredTargeting - Whether we have entered targeting mode (hand not facing the camera)
   */
  targetingEvent(enteredTargeting: boolean): void {
    enteredTargeting
      ? this.stateMachine.sendSignal(StateMachineSignals.EnterTargeting)
      : this.stateMachine.sendSignal(StateMachineSignals.ExitTargeting)
  }

  /**
   * Call to notify that we have entered or exited near pinch mode
   *
   * @param enteredNearPinch - Whether we have entered near pinch mode
   */
  nearPinchEvent(enteredNearPinch: boolean): void {
    enteredNearPinch
      ? this.stateMachine.sendSignal(StateMachineSignals.EnterNearPinch)
      : this.stateMachine.sendSignal(StateMachineSignals.ExitNearPinch)
  }

  /**
   * Call to notify that we have entered or exited pinch mode
   *
   * @param enteredPinch - Whether we have entered pinch mode
   */
  pinchEvent(enteredPinch: boolean): void {
    enteredPinch
      ? this.stateMachine.sendSignal(StateMachineSignals.EnterPinch)
      : this.stateMachine.sendSignal(StateMachineSignals.ExitPinch)
  }

  /**
   * Call to notify that we have entered or exited palm UI mode
   *
   * @param enteredPalmUIMode - Whether we have entered palm UI mode
   */
  palmUIModeEvent(enteredPalmUIMode: boolean): void {
    enteredPalmUIMode
      ? this.stateMachine.sendSignal(StateMachineSignals.EnterPalmUIMode)
      : this.stateMachine.sendSignal(StateMachineSignals.ExitPalmUIMode)
  }

  /**
   * Call to notify that we have entered or exited tap mode
   *
   * @param enteredTap - Whether we have entered tap mode
   */
  tapEvent(enteredTap: boolean): void {
    enteredTap
      ? this.stateMachine.sendSignal(StateMachineSignals.EnterTap)
      : this.stateMachine.sendSignal(StateMachineSignals.ExitTap)
  }

  /**
   * Get the current state of the state machine used to manage the glow effects
   *
   * @returns GlowEffectStates the state that the state machine is currently in
   */
  get currentState(): GlowEffectStates {
    if (this.stateMachine.currentState === null) {
      throw new Error("GlowEffectStateMachine does not have a current state!")
    }

    return this.stateMachine.currentState.name as GlowEffectStates
  }

  private createStateMachine(): StateMachine {
    const stateMachine = new StateMachine("GlowEffectStateMachine")

    stateMachine.addState({
      name: GlowEffectStates.IdleTargeting,
      onEnter: () => {
        this.log.v(
          `${this.config.handType} Entered state: ${this.currentState}`
        )
        this.animateIndexGlowBaseEvent.invoke(false)
        this.animateIndexGlowBonusEvent.invoke(false)

        this.animateThumbGlowBaseEvent.invoke(false)
        this.animateThumbGlowBonusEvent.invoke(false)
      },
      transitions: [
        {
          nextStateName: GlowEffectStates.IdleNotTargeting,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitTargeting
          },
        },
        {
          nextStateName: GlowEffectStates.NearPinching,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterNearPinch
          },
        },
        {
          nextStateName: GlowEffectStates.NearTapping,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterPalmUIMode
          },
        },
      ],
    })

    stateMachine.addState({
      name: GlowEffectStates.IdleNotTargeting,
      onEnter: () => {
        this.log.v(
          `${this.config.handType} Entered state: ${this.currentState}`
        )
        this.animateIndexGlowBaseEvent.invoke(false)
        this.animateIndexGlowBonusEvent.invoke(false)

        this.animateThumbGlowBaseEvent.invoke(false)
        this.animateThumbGlowBonusEvent.invoke(false)
      },
      transitions: [
        {
          nextStateName: GlowEffectStates.IdleTargeting,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterTargeting
          },
        },
        {
          nextStateName: GlowEffectStates.NearPinching,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterNearPinch
          },
        },
      ],
    })

    stateMachine.addState({
      name: GlowEffectStates.NearPinching,
      onEnter: () => {
        this.log.v(
          `${this.config.handType} Entered state: ${this.currentState}`
        )
        this.animateIndexGlowBaseEvent.invoke(true)
        this.animateIndexGlowBonusEvent.invoke(false)

        this.animateThumbGlowBaseEvent.invoke(true)
        this.animateThumbGlowBonusEvent.invoke(false)
      },
      transitions: [
        {
          nextStateName: GlowEffectStates.IdleTargeting,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitNearPinch
          },
        },
        {
          nextStateName: GlowEffectStates.IdleNotTargeting,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitTargeting
          },
        },
        {
          nextStateName: GlowEffectStates.NearTapping,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterPalmUIMode
          },
        },
        {
          nextStateName: GlowEffectStates.Pinching,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterPinch
          },
        },
      ],
    })

    stateMachine.addState({
      name: GlowEffectStates.Pinching,
      onEnter: () => {
        this.log.v(
          `${this.config.handType} Entered state: ${this.currentState}`
        )
        this.animateIndexGlowBaseEvent.invoke(true)
        this.animateIndexGlowBonusEvent.invoke(true)

        this.animateThumbGlowBaseEvent.invoke(true)
        this.animateThumbGlowBonusEvent.invoke(true)
      },
      transitions: [
        {
          nextStateName: GlowEffectStates.PinchingNotTargeting,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitTargeting
          },
        },
        {
          nextStateName: GlowEffectStates.NearPinching,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitPinch
          },
        },
      ],
    })

    stateMachine.addState({
      name: GlowEffectStates.PinchingNotTargeting,
      onEnter: () => {
        this.log.v(
          `${this.config.handType} Entered state: ${this.currentState}`
        )
        this.animateIndexGlowBaseEvent.invoke(true)
        this.animateIndexGlowBonusEvent.invoke(true)

        this.animateThumbGlowBaseEvent.invoke(true)
        this.animateThumbGlowBonusEvent.invoke(true)
      },
      transitions: [
        {
          nextStateName: GlowEffectStates.IdleNotTargeting,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitPinch
          },
        },
        {
          nextStateName: GlowEffectStates.Pinching,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterTargeting
          },
        },
      ],
    })

    stateMachine.addState({
      name: GlowEffectStates.NearTapping,
      onEnter: () => {
        this.log.v(
          `${this.config.handType} Entered state: ${this.currentState}`
        )
        this.tapModeChangedEvent.invoke(true)

        this.animateIndexGlowBaseEvent.invoke(true)
        this.animateIndexGlowBonusEvent.invoke(false)

        this.animateThumbGlowBaseEvent.invoke(false)
        this.animateThumbGlowBonusEvent.invoke(false)
      },
      transitions: [
        {
          nextStateName: GlowEffectStates.IdleTargeting,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitPalmUIMode
          },
          onExecution: () => {
            this.tapModeChangedEvent.invoke(false)
          },
        },
        {
          nextStateName: GlowEffectStates.Tapping,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.EnterTap
          },
        },
      ],
    })

    stateMachine.addState({
      name: GlowEffectStates.Tapping,
      onEnter: () => {
        this.log.v(
          `${this.config.handType} Entered state: ${this.currentState}`
        )
        this.animateIndexGlowBaseEvent.invoke(true)
        this.animateIndexGlowBonusEvent.invoke(true)

        this.animateThumbGlowBaseEvent.invoke(false)
        this.animateThumbGlowBonusEvent.invoke(false)
      },
      transitions: [
        {
          nextStateName: GlowEffectStates.NearTapping,
          checkOnSignal: (signal: string) => {
            return signal === StateMachineSignals.ExitTap
          },
        },
      ],
    })

    stateMachine.enterState(GlowEffectStates.IdleTargeting, true)

    return stateMachine
  }
}
