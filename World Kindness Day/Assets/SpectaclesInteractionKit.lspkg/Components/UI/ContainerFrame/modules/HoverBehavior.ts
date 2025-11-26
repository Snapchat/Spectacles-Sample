import {Interactable} from "../../../../Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "../../../../Core/Interactor/InteractorEvent"
import Event, {unsubscribe} from "../../../../Utils/Event"
import NativeLogger from "../../../../Utils/NativeLogger"
import StateMachine from "../../../../Utils/StateMachine"

const TAG = "HoverBehavior"

enum State {
  Inactive = "Inactive",
  InactiveToActive = "InactiveToActive",
  Active = "Active",
  ActiveToInactive = "ActiveToInactive"
}

enum Signal {
  RequestActive = "RequestActive",
  RequestInActive = "RequestInActive"
}

const STATE_CHANGE_DEBOUNCE_TIME_S = 0.05 // 50ms

const DEBUG_MESSAGES = false

/**
 * Behavior for handling nested interactable hover events
 */
export class HoverBehavior {
  private hoverStart = new Event<InteractorEvent>()
  public onHoverStart = this.hoverStart.publicApi()

  private hoverEnd = new Event<InteractorEvent>()
  public onHoverEnd = this.hoverEnd.publicApi()

  private hoverUpdate = new Event<InteractorEvent>()
  public onHoverUpdate = this.hoverUpdate.publicApi()

  private stateMachine = new StateMachine(this.name)
  private isActive = false
  private requestActive = false

  private eventData!: InteractorEvent

  private unsubscribeList: unsubscribe[] = []
  private isDestroyed: boolean = false

  private log = new NativeLogger(TAG)

  constructor(
    private interactable: Interactable,
    private name: string = "HoverBehavior"
  ) {
    this.setupStateMachine()

    this.bindHoverEvents()

    this.stateMachine.enterState(State.Inactive)
  }

  destroy(): void {
    this.log.d(`has been destroyed!`)
    this.isDestroyed = true
    this.stateMachine.destroy()
    this.unBindHoverEvents()
  }

  private bindHoverEvents(): void {
    this.unsubscribeList.push(this.interactable.onHoverEnter(this.onHoverEnter))
    this.unsubscribeList.push(this.interactable.onHoverExit(this.onHoverExit))
    this.unsubscribeList.push(this.interactable.onHoverUpdate(this.onHoverUpdated))

    // Need to add a trigger event bc we can officially finish a 'hover' (in the context of this class) without a hover exit.
    this.unsubscribeList.push(this.interactable.onTriggerEndOutside(this.onTriggerEndOutside))

    this.unsubscribeList.push(this.interactable.onSyncHoverEnter(this.onHoverEnter))
    this.unsubscribeList.push(this.interactable.onSyncHoverExit(this.onHoverExit))
    this.unsubscribeList.push(this.interactable.onSyncHoverUpdate(this.onHoverUpdated))

    // Need to add a trigger event bc we can officially finish a 'hover' (in the context of this class) without a hover exit.
    this.unsubscribeList.push(this.interactable.onSyncTriggerEndOutside(this.onTriggerEndOutside))
  }

  private unBindHoverEvents(): void {
    this.unsubscribeList.forEach((sub) => {
      sub()
    })
    this.unsubscribeList = []
  }

  private onHoverEnter = (eventData: InteractorEvent): void => {
    this.requestActive = true
    this.eventData = eventData
  }

  private onHoverExit = (eventData: InteractorEvent): void => {
    if (eventData.interactor.isHoveringInteractableHierarchy(this.interactable)) {
      return
    }
    this.requestActive = false
    this.eventData = eventData
  }

  private onHoverUpdated = (eventData: InteractorEvent): void => {
    this.eventData = eventData
  }

  private onTriggerEndOutside = (eventData: InteractorEvent): void => {
    if (!eventData.interactor.isHoveringInteractableHierarchy(this.interactable)) {
      this.requestActive = false
      this.eventData = eventData
    }
  }

  lateUpdate = (): void => {
    if (this.isActive !== this.requestActive) {
      if (DEBUG_MESSAGES) {
        this.log.d(`container requested active state:${this.requestActive}`)
      }
      this.stateMachine.sendSignal(this.requestActive ? Signal.RequestActive : Signal.RequestInActive)
    }

    // Update actual state immediately
    this.isActive = this.requestActive
  }

  private setupStateMachine(): void {
    // Inactive State
    this.stateMachine.addState({
      name: State.Inactive,
      onEnter: (_state) => {
        this.hoverEnd.invoke(this.eventData)
      },
      transitions: [
        {
          nextStateName: State.InactiveToActive,
          checkOnSignal: (signal, _data) => {
            return signal === Signal.RequestActive
          }
        }
      ]
    })

    // Inactive Transition State
    this.stateMachine.addState({
      name: State.InactiveToActive,
      transitions: [
        {
          nextStateName: State.Inactive,
          checkOnSignal: (signal, _data) => {
            return signal === Signal.RequestInActive
          }
        },
        {
          nextStateName: State.Active,
          checkOnUpdate: (state) => {
            return state.stateElapsedTime > STATE_CHANGE_DEBOUNCE_TIME_S
          }
        }
      ]
    })

    // Active State
    this.stateMachine.addState({
      name: State.Active,
      onEnter: (_state) => {
        this.hoverStart.invoke(this.eventData)
      },
      onUpdate: (_state) => {
        if (this.isDestroyed) {
          this.log.d("Already destroyed!")
          return
        }

        try {
          this.hoverUpdate.invoke(this.eventData)
        } catch (e) {
          // If we arrive here, the script is dead and will be cleaned up eventually
          // Any calls that cross the native boundry could throw an exception
          this.log.e(`Error invoking hoverUpdate: ${e}`)
        }
      },
      transitions: [
        {
          nextStateName: State.ActiveToInactive,
          checkOnSignal: (signal, _data) => {
            return signal === Signal.RequestInActive
          }
        }
      ]
    })

    //  Active Transition State
    this.stateMachine.addState({
      name: State.ActiveToInactive,
      transitions: [
        {
          nextStateName: State.Inactive,
          checkOnUpdate: (state) => {
            return state.stateElapsedTime > STATE_CHANGE_DEBOUNCE_TIME_S
          }
        },
        {
          nextStateName: State.Active,
          checkOnSignal: (signal, _data) => {
            return signal === Signal.RequestActive
          }
        }
      ]
    })
  }
}
