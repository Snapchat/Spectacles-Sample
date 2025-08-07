import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"

const log = new NativeLogger("InteractableStateMachine")

enum State {
  "default" = "default",
  "hovered" = "hovered",
  "active" = "active",
  "toggledDefault" = "toggledDefault",
  "toggledHovered" = "toggledHovered",
  "toggledActive" = "toggledActive",
  "triggered" = "triggered"
}

enum Action {
  "hover" = "hover",
  "unHover" = "unHover",
  "triggerStart" = "triggerStart",
  "triggerEnd" = "triggerEnd",
  "triggerCancel" = "triggerCancel",
  "toggleOn" = "toggleOn",
  "toggleOff" = "toggleOff"
}

export type StateEvent = {
  state: State
  event?: InteractorEvent
}

@component
export class InteractableStateMachine extends BaseScriptComponent {
  interactable: Interactable = this.sceneObject.getComponent(Interactable.getTypeName())

  private initialized: boolean = false

  private _state: State = State.default

  isToggle: boolean = false
  untoggleOnClick: boolean = true

  events: {[key in State]: Event<StateEvent>} = {
    default: new Event<StateEvent>(),
    hovered: new Event<StateEvent>(),
    active: new Event<StateEvent>(),
    toggledDefault: new Event<StateEvent>(),
    toggledHovered: new Event<StateEvent>(),
    toggledActive: new Event<StateEvent>(),
    triggered: new Event<StateEvent>()
  }

  onDefault = this.events.default.publicApi()
  onHovered = this.events.hovered.publicApi()
  onActive = this.events.active.publicApi()
  onToggledDefault = this.events.toggledDefault.publicApi()
  onToggledHovered = this.events.toggledHovered.publicApi()
  onToggledActive = this.events.toggledActive.publicApi()
  onTriggered = this.events.triggered.publicApi()

  private triggered: boolean = false

  onAwake() {
    if (!this.interactable) {
      log.e(`Interactable not found on this object: ${this.sceneObject.name}`)
    }

    this.createEvent("OnStartEvent").bind(this.onStart)
  }

  private onStart = () => {
    if (!this.initialized) {
      this.initialize()
    }
  }

  initialize = () => {
    this.interactable.onHoverEnter.add((e: InteractorEvent) => {
      if (this.interactable.enabled) {
        this.transition(Action.hover, e)
      }
    })

    this.interactable.onHoverExit.add((e: InteractorEvent) => {
      if (this.interactable.enabled) {
        this.transition(Action.unHover, e)
      }
    })

    this.interactable.onTriggerStart.add((e: InteractorEvent) => {
      if (this.interactable.enabled && e.propagationPhase === "Target") {
        this.transition(Action.triggerStart, e)
        this.triggered = true
      }
    })

    this.interactable.onTriggerEnd.add((e: InteractorEvent) => {
      if (this.triggered) {
        this.events.triggered.invoke({state: this.state, event: e})
      }
      if (this.interactable.enabled) {
        this.transition(Action.triggerEnd, e)
        this.triggered = false
      }
    })

    this.interactable.onTriggerCanceled.add((e: InteractorEvent) => {
      if (this.interactable.enabled) {
        this.transition(Action.triggerCancel, e)
        this.triggered = false
      }
    })

    this.initialized = true
  }

  get state() {
    return this._state
  }

  set state(newState: State) {
    const lastState = this._state
    this._state = newState
    this.events[this._state].invoke({state: lastState})
  }

  transition = (action: Action, e: InteractorEvent = null) => {
    const lastState = this._state
    this._state = this.getTransition(action)
    log.d(`----------------------`)
    log.d(`lastState = ${lastState}`)
    log.d(`action = ${action}`)
    log.d(`state = ${this.state}`)
    this.events[this.state].invoke({state: lastState, event: e})
  }

  set toggle(on: boolean) {
    if (on) {
      this.transition(Action.toggleOn)
    } else {
      this.transition(Action.toggleOff)
    }
  }

  get toggle() {
    return (
      this.state === State.toggledActive || this.state === State.toggledDefault || this.state === State.toggledHovered
    )
  }

  private getTransition = (action: Action): State => {
    const transitions: {[key in State]: {[innerKey in Action]: State}} = {
      default: {
        hover: State.hovered,
        unHover: State.default,
        triggerStart: State.active,
        triggerEnd: State.default,
        triggerCancel: State.default,
        toggleOn: State.toggledDefault,
        toggleOff: State.default
      },
      hovered: {
        hover: State.hovered,
        unHover: State.default,
        triggerStart: State.active,
        triggerEnd: State.hovered,
        triggerCancel: State.hovered,
        toggleOn: State.toggledHovered,
        toggleOff: State.hovered
      },
      active: {
        hover: State.active,
        unHover: State.default,
        triggerStart: State.active,
        triggerEnd: this.isToggle ? State.toggledHovered : State.hovered,
        triggerCancel: State.default,
        toggleOn: State.toggledActive,
        toggleOff: State.active
      },
      toggledDefault: {
        hover: State.toggledHovered,
        unHover: State.toggledDefault,
        triggerStart: State.toggledActive,
        triggerEnd: State.toggledHovered,
        triggerCancel: State.toggledDefault,
        toggleOn: State.toggledDefault,
        toggleOff: State.default
      },
      toggledHovered: {
        hover: State.toggledHovered,
        unHover: State.toggledDefault,
        triggerStart: State.toggledActive,
        triggerEnd: State.toggledHovered,
        triggerCancel: State.toggledDefault,
        toggleOn: State.toggledHovered,
        toggleOff: State.hovered
      },
      toggledActive: {
        hover: State.toggledHovered,
        unHover: State.toggledDefault,
        triggerStart: State.toggledActive,
        triggerEnd: this.untoggleOnClick ? State.hovered : State.toggledActive,
        triggerCancel: State.toggledDefault,
        toggleOn: State.toggledActive,
        toggleOff: State.active
      },
      // this one is nonsense
      triggered: {
        hover: State.hovered,
        unHover: State.default,
        triggerStart: State.active,
        triggerEnd: State.hovered,
        triggerCancel: State.default,
        toggleOn: State.toggledDefault,
        toggleOff: State.default
      }
    }

    return transitions[this.state][action]
  }
}
