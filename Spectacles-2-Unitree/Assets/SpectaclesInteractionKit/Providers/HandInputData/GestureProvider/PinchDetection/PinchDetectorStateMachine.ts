import Event from "../../../../Utils/Event"
import NativeLogger from "../../../../Utils/NativeLogger"
import StateMachine from "../../../../Utils/StateMachine"
import {PinchEventType} from "../PinchEventType"

const TAG = "PinchDetectorStateMachine"

export enum PinchDetectorState {
  Idle = "Idle",
  Pinching = "Pinching",
}

/**
 * Tracks states and transitions of pinching
 */
export default class PinchDetectorStateMachine {
  // Native Logging
  private log = new NativeLogger(TAG)

  private stateMachine = new StateMachine("PinchDetectorStateMachine")

  private onPinchDownEvent = new Event()
  readonly onPinchDown = this.onPinchDownEvent.publicApi()

  private onPinchUpEvent = new Event()
  readonly onPinchUp = this.onPinchUpEvent.publicApi()

  private onPinchCancelEvent = new Event()
  readonly onPinchCancel = this.onPinchCancelEvent.publicApi()

  constructor() {
    this.setupStateMachine()
    this.stateMachine.enterState(PinchDetectorState.Idle)
  }

  /**
   * Determines if the user is pinching
   * @returns whether the state machine is currently in the Pinching state
   */
  public isPinching(): boolean {
    return this.stateMachine.currentState?.name === PinchDetectorState.Pinching
  }

  /**
   * Notifies that a pinch event has been detected
   * @param pinchEventType The type of event that was detected
   */
  public notifyPinchEvent(pinchEventType: PinchEventType): void {
    this.stateMachine.sendSignal(pinchEventType)
  }

  private setupStateMachine() {
    this.stateMachine.addState({
      name: PinchDetectorState.Idle,
      onEnter: () => {},
      transitions: [
        {
          nextStateName: PinchDetectorState.Pinching,
          checkOnSignal: (signal: string) => {
            if (signal === PinchEventType.Down) {
              this.onPinchDownEvent.invoke()
              this.log.v("PinchEvent : " + "Pinch Down Event")
              return true
            }

            return false
          },
        },
      ],
    })

    this.stateMachine.addState({
      name: PinchDetectorState.Pinching,
      onEnter: () => {},
      transitions: [
        {
          nextStateName: PinchDetectorState.Idle,
          checkOnSignal: (signal: string) => {
            if (signal === PinchEventType.Up) {
              this.onPinchUpEvent.invoke()
              this.log.v("PinchEvent : " + "Pinch Up Event")
              return true
            } else if (signal === PinchEventType.Cancel) {
              this.onPinchCancelEvent.invoke()
              this.log.v("PinchEvent : " + "Pinch Cancel Event")
              return true
            }

            return false
          },
        },
      ],
    })
  }
}
