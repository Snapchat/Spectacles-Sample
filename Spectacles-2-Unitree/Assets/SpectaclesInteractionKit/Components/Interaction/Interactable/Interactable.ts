import {
  DragInteractorEvent,
  InteractorEvent,
} from "../../../Core/Interactor/InteractorEvent"

import Event from "../../../Utils/Event"
import {InteractionConfigurationProvider} from "../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {InteractorInputType} from "../../../Core/Interactor/Interactor"
import NativeLogger from "../../../Utils/NativeLogger"

export type InteractableEventArgs = Omit<InteractorEvent, "interactable">

const TAG = "Interactable"

/**
 * This class represents an interactable object that can respond to various interaction events such as hover, trigger, and drag. It provides event handlers for these interactions and uses the InteractionConfigurationProvider for configuration.
 */
@component
export class Interactable extends BaseScriptComponent {
  // Events
  private onHoverEnterEvent = new Event<InteractorEvent>()
  private onHoverUpdateEvent = new Event<InteractorEvent>()
  private onHoverExitEvent = new Event<InteractorEvent>()
  private onInteractorHoverEnterEvent = new Event<InteractorEvent>()
  private onInteractorHoverExitEvent = new Event<InteractorEvent>()

  private onTriggerStartEvent = new Event<InteractorEvent>()
  private onTriggerUpdateEvent = new Event<InteractorEvent>()
  private onTriggerEndEvent = new Event<InteractorEvent>()
  private onInteractorTriggerStartEvent = new Event<InteractorEvent>()
  private onInteractorTriggerEndEvent = new Event<InteractorEvent>()

  private onDragStartEvent = new Event<DragInteractorEvent>()
  private onDragUpdateEvent = new Event<DragInteractorEvent>()
  private onDragEndEvent = new Event<DragInteractorEvent>()
  private onTriggerCanceledEvent = new Event<InteractorEvent>()

  private interactionConfigurationProvider: InteractionConfigurationProvider =
    InteractionConfigurationProvider.getInstance()

  // Native Logging
  private log = new NativeLogger(TAG)

  /**
   * Called whenever the interactable enters the hovered state
   */
  onHoverEnter = this.onHoverEnterEvent.publicApi()

  /**
   * Called whenever a new interactor hovers over this interactable
   */
  onInteractorHoverEnter = this.onInteractorHoverEnterEvent.publicApi()

  /**
   * Called whenever an interactor remains hovering over this interactable
   */
  onHoverUpdate = this.onHoverUpdateEvent.publicApi()

  /**
   *  Called whenever the interactable is no longer hovered
   */
  onHoverExit = this.onHoverExitEvent.publicApi()

  /**
   * Called whenever an interactor exits hovering this interactable
   */
  onInteractorHoverExit = this.onInteractorHoverExitEvent.publicApi()

  /**
   * Called whenever the interactable enters the triggered state
   */
  onTriggerStart = this.onTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor triggers an interactable
   */
  onInteractorTriggerStart = this.onInteractorTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor continues to trigger an interactable
   */
  onTriggerUpdate = this.onTriggerUpdateEvent.publicApi()

  /**
   * Called whenever the interactable exits the triggered state
   */
  onTriggerEnd = this.onTriggerEndEvent.publicApi()

  /**
   * Called whenever an interactor is no longer triggering the interactable
   */
  onInteractorTriggerEnd = this.onInteractorTriggerEndEvent.publicApi()

  /**
   * Called whenever an interactor is lost and was in a down event with this interactable
   */
  onTriggerCanceled = this.onTriggerCanceledEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * has moved a minimum drag distance
   */
  onDragStart = this.onDragStartEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * is moving
   */
  onDragUpdate = this.onDragUpdateEvent.publicApi()

  /**
   * Called when an interactor was in a down event with this interactable and
   * was dragging
   */
  onDragEnd = this.onDragEndEvent.publicApi()

  // Interactor
  private _hoveringInteractor: InteractorInputType = InteractorInputType.None
  private _triggeringInteractor: InteractorInputType = InteractorInputType.None

  /**
   * Provides all colliders associated with this Interactable
   */
  colliders: ColliderComponent[] = []

  /**
   * Defines how an interactor can interact with this interactable.
   * Values are:
   * 1: Direct
   * 2: Indirect
   * 3: Direct/Indirect
   * 4: Poke
   */
  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Direct", 1),
      new ComboBoxItem("Indirect", 2),
      new ComboBoxItem("Direct/Indirect", 3),
      new ComboBoxItem("Poke", 4),
      new ComboBoxItem("All", 7),
    ]),
  )
  targetingMode: number = 3

  @input
  @hint(
    "Enable this to allow the Interactable to instantly be dragged on trigger rather than obeying the Interactor's drag threshold.",
  )
  enableInstantDrag: boolean = false

  /**
   * Returns if an Interactable is scrollable
   */
  @input
  isScrollable: boolean = false

  /**
   * Determines whether one or more interactors can interactor with this interactable
   */
  @input
  allowMultipleInteractors: boolean = true

  onAwake(): void {
    this.createEvent("OnDestroyEvent").bind(() => this.release())
    this.createEvent("OnEnableEvent").bind(() => {
      this.enableColliders(true)
    })
    this.createEvent("OnDisableEvent").bind(() => {
      this.enableColliders(false)
    })

    InteractionManager.getInstance().registerInteractable(this)
  }
  release(): void {
    InteractionManager.getInstance().deregisterInteractable(this)
  }

  /**
   * Notifies the interactable that it is entering hover state
   * @param eventArgs - the interactor that is driving the event {@link Interactor}
   */
  hoverEnter = (eventArgs: InteractableEventArgs): void => {
    if (this._hoveringInteractor === InteractorInputType.None) {
      this.onHoverEnterEvent.invoke({
        ...eventArgs,
        interactable: this,
      })
      this.log.v("InteractionEvent : " + "On Hover Enter Event")
    }
    this._hoveringInteractor |= eventArgs.interactor.inputType
    this.onInteractorHoverEnterEvent.invoke({
      ...eventArgs,
      interactable: this,
    })
    this.log.v("InteractionEvent : " + "On Interactor Hover Enter Event")
  }

  /**
   * Notifies the interactable that it is still hovering
   * @param eventArgs - event parameters, with omitted interactable
   */
  hoverUpdate = (eventArgs: InteractableEventArgs): void => {
    this.onHoverUpdateEvent.invoke({
      ...eventArgs,
      interactable: this,
    })
  }

  /**
   * Notifies the interactable that it is exiting hover state
   * @param eventArgs - event parameters, with omitted interactable
   */
  hoverExit = (eventArgs: InteractableEventArgs): void => {
    this._hoveringInteractor &= ~eventArgs.interactor.inputType
    this.onInteractorHoverExitEvent.invoke({
      ...eventArgs,
      interactable: this,
    })
    this.log.v("InteractionEvent : " + "On Interactor Hover Exit Event")

    if (this._hoveringInteractor === InteractorInputType.None) {
      this.onHoverExitEvent.invoke({
        ...eventArgs,
        interactable: this,
      })
      this.log.v("InteractionEvent : " + "On Hover Exit Event")
    }
  }

  /**
   * Notifies the interactable that it is entering trigger state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerStart = (eventArgs: InteractableEventArgs): void => {
    if (this._triggeringInteractor === InteractorInputType.None) {
      this.onTriggerStartEvent.invoke({
        ...eventArgs,
        interactable: this,
      })
      this.log.v("InteractionEvent : " + "On Trigger Start Event")
    }

    this._triggeringInteractor |= eventArgs.interactor.inputType
    this.onInteractorTriggerStartEvent.invoke({
      ...eventArgs,
      interactable: this,
    })
    this.log.v("InteractionEvent : " + "On Interactor Trigger Start Event")
  }

  /**
   * Notifies the interactable that it is still in a triggering state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerUpdate = (eventArgs: InteractableEventArgs): void => {
    this.onTriggerUpdateEvent.invoke({
      ...eventArgs,
      interactable: this,
    })
    this.dragStartOrUpdate(eventArgs)
  }

  /**
   * Notifies the interactable that it is exiting trigger state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerEnd = (eventArgs: InteractableEventArgs): void => {
    this._triggeringInteractor &= ~eventArgs.interactor.inputType
    this.onInteractorTriggerEndEvent.invoke({
      ...eventArgs,
      interactable: this,
    })
    this.log.v("InteractionEvent : " + "On Interactor Trigger End Event")

    if (this._triggeringInteractor === InteractorInputType.None) {
      this.onTriggerEndEvent.invoke({
        ...eventArgs,
        interactable: this,
      })
      this.log.v("InteractionEvent : " + "On Trigger End Event")
    }

    this.dragEnd(eventArgs)
  }

  /**
   * Notifies the interactable that it is a cancelled state with the interactor
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerCanceled = (eventArgs: InteractableEventArgs): void => {
    this._triggeringInteractor === InteractorInputType.None
    this.onTriggerCanceledEvent.invoke({
      ...eventArgs,
      interactable: this,
    })
    this.log.v("InteractionEvent : " + "On Trigger Canceled Event")

    this.dragEnd(eventArgs)
  }

  /**
   * Interactors that are hovering this interactable
   */
  get hoveringInteractor(): InteractorInputType {
    return this._hoveringInteractor
  }

  /**
   * Interactors that are triggering this interactable
   */
  get triggeringInteractor(): InteractorInputType {
    return this._triggeringInteractor
  }

  private dragStartOrUpdate(eventArgs: InteractableEventArgs) {
    const currentDragVector = eventArgs.interactor.currentDragVector
    if (currentDragVector === null) {
      return
    }

    const previousDragVector = eventArgs.interactor.previousDragVector
    const dragInteractorEvent = {
      ...eventArgs,
      interactable: this,
      dragVector: currentDragVector,
      planecastDragVector: eventArgs.interactor.planecastDragVector,
    }

    if (previousDragVector === null) {
      this.onDragStartEvent.invoke(dragInteractorEvent)
      this.log.v("InteractionEvent : " + "On Drag Start Event")
    } else {
      this.onDragUpdateEvent.invoke(dragInteractorEvent)
    }
  }

  private dragEnd(eventArgs: InteractableEventArgs) {
    const previousDragVector = eventArgs.interactor.previousDragVector
    if (previousDragVector === null) {
      return
    }

    this.onDragEndEvent.invoke({
      ...eventArgs,
      interactable: this,
      dragVector: previousDragVector,
      planecastDragVector: eventArgs.interactor.planecastDragVector,
    })
    this.log.v("InteractionEvent : " + "On Drag End Event")
  }

  private enableColliders(enable: boolean) {
    for (let i = 0; i < this.colliders.length; i++) {
      this.colliders[i].enabled = enable
    }
  }
}
