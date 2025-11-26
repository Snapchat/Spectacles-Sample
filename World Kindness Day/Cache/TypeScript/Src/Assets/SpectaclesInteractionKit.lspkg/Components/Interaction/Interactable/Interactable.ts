import {DragInteractorEvent, InteractorEvent} from "../../../Core/Interactor/InteractorEvent"

import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {InteractorInputType} from "../../../Core/Interactor/Interactor"
import {InteractionConfigurationProvider} from "../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import Event from "../../../Utils/Event"
import NativeLogger from "../../../Utils/NativeLogger"
import {isDescendantOf} from "../../../Utils/SceneObjectUtils"
import {SyncKitBridge} from "../../../Utils/SyncKitBridge"

export type InteractableEventArgs = Omit<InteractorEvent, "interactable">

const TAG = "Interactable"

/**
 * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
 * Setting an Interactable's acceptableInputType to a non-All value results in the Interactable only being
 * able to be interacted with by a specific user.
 * Host means that only the host of the session can interact.
 * Local means only the user with the same connection ID as the
 * Interactable's localConnectionId can interact.
 * HostAndLocal means that the host or the local user can interact.
 */
export enum SyncInteractionType {
  None = 0,
  Host = 1 << 0,
  Local = 1 << 1,
  Other = 1 << 2,
  HostAndLocal = Host | Local,
  All = Host | Local | Other
}

/**
 * TargetingVisual is a bitflag that determines the targeting visual representation.
 */
export enum TargetingVisual {
  None = 0,
  Cursor = 1 << 0,
  Ray = 1 << 1
}

/**
 * This class represents an interactable object that can respond to various interaction events such as hover, trigger,
 * and drag. It provides event handlers for these interactions and uses the InteractionConfigurationProvider for
 * configuration.
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
  private onTriggerEndOutsideEvent = new Event<InteractorEvent>()

  private onInteractorTriggerStartEvent = new Event<InteractorEvent>()
  private onInteractorTriggerEndEvent = new Event<InteractorEvent>()
  private onInteractorTriggerEndOutsideEvent = new Event<InteractorEvent>()

  private onDragStartEvent = new Event<DragInteractorEvent>()
  private onDragUpdateEvent = new Event<DragInteractorEvent>()
  private onDragEndEvent = new Event<DragInteractorEvent>()
  private onTriggerCanceledEvent = new Event<InteractorEvent>()

  private onSyncHoverEnterEvent = new Event<InteractorEvent>()
  private onSyncHoverUpdateEvent = new Event<InteractorEvent>()
  private onSyncHoverExitEvent = new Event<InteractorEvent>()
  private onSyncInteractorHoverEnterEvent = new Event<InteractorEvent>()
  private onSyncInteractorHoverExitEvent = new Event<InteractorEvent>()

  private onSyncTriggerStartEvent = new Event<InteractorEvent>()
  private onSyncTriggerUpdateEvent = new Event<InteractorEvent>()
  private onSyncTriggerEndEvent = new Event<InteractorEvent>()
  private onSyncTriggerEndOutsideEvent = new Event<InteractorEvent>()
  private onSyncInteractorTriggerStartEvent = new Event<InteractorEvent>()
  private onSyncInteractorTriggerEndEvent = new Event<InteractorEvent>()
  private onSyncInteractorTriggerEndOutsideEvent = new Event<InteractorEvent>()
  private onSyncTriggerCanceledEvent = new Event<InteractorEvent>()

  private onSyncDragStartEvent = new Event<DragInteractorEvent>()
  private onSyncDragUpdateEvent = new Event<DragInteractorEvent>()
  private onSyncDragEndEvent = new Event<DragInteractorEvent>()

  private interactionConfigurationProvider: InteractionConfigurationProvider =
    InteractionConfigurationProvider.getInstance()

  private syncKitBridge = SyncKitBridge.getInstance()
  public readonly syncEntity = this.syncKitBridge.createSyncEntity(this)

  // Native Logging
  private log = new NativeLogger(TAG)

  /**
   * Called whenever the interactable enters the hovered state.
   */
  onHoverEnter = this.onHoverEnterEvent.publicApi()

  /**
   * Called whenever a new interactor hovers over this interactable.
   */
  onInteractorHoverEnter = this.onInteractorHoverEnterEvent.publicApi()

  /**
   * Called whenever an interactor remains hovering over this interactable.
   */
  onHoverUpdate = this.onHoverUpdateEvent.publicApi()

  /**
   *  Called whenever the interactable is no longer hovered.
   */
  onHoverExit = this.onHoverExitEvent.publicApi()

  /**
   * Called whenever an interactor exits hovering this interactable.
   */
  onInteractorHoverExit = this.onInteractorHoverExitEvent.publicApi()

  /**
   * Called whenever the interactable enters the triggered state.
   */
  onTriggerStart = this.onTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor triggers an interactable.
   */
  onInteractorTriggerStart = this.onInteractorTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor continues to trigger an interactable.
   */
  onTriggerUpdate = this.onTriggerUpdateEvent.publicApi()

  /**
   * Called whenever the interactable exits the triggered state while the interactor is hovering it.
   */
  onTriggerEnd = this.onTriggerEndEvent.publicApi()

  /**
   * Called whenever the interactable exits the triggered state while the interactor is not hovering it.
   */
  onTriggerEndOutside = this.onTriggerEndOutsideEvent.publicApi()

  /**
   * Called whenever an interactor is no longer triggering the interactable while the interactor is hovering it.
   */
  onInteractorTriggerEnd = this.onInteractorTriggerEndEvent.publicApi()

  /**
   * Called whenever an interactor is no longer triggering the interactable while the interactor is not hovering it.
   */
  onInteractorTriggerEndOutside = this.onInteractorTriggerEndOutsideEvent.publicApi()

  /**
   * Called whenever an interactor is lost and was in a down event with this interactable.
   */
  onTriggerCanceled = this.onTriggerCanceledEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * has moved a minimum drag distance.
   */
  onDragStart = this.onDragStartEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * is moving.
   */
  onDragUpdate = this.onDragUpdateEvent.publicApi()

  /**
   * Called when an interactor was in a down event with this interactable and
   * was dragging.
   */
  onDragEnd = this.onDragEndEvent.publicApi()

  /**
   * The following onSync events are only invoked when in a Connected Lens with SpectaclesSyncKit present.
   * If another connected user invokes an onHoverEnter event, the local user will see an onSyncHoverEvent.
   * These events are useful for simple feedback scripts to allow other users to understand when an Interactable
   * is being interacted with another user already.
   */

  /**
   * Called whenever the interactable enters the hovered state from another connection.
   */
  onSyncHoverEnter = this.onSyncHoverEnterEvent.publicApi()

  /**
   * Called whenever a new interactor hovers over this interactable from another connection.
   */
  onSyncInteractorHoverEnter = this.onSyncInteractorHoverEnterEvent.publicApi()

  /**
   * Called whenever an interactor remains hovering over this interactable from another connection.
   */
  onSyncHoverUpdate = this.onSyncHoverUpdateEvent.publicApi()

  /**
   *  Called whenever the interactable is no longer hovered from another connection.
   */
  onSyncHoverExit = this.onSyncHoverExitEvent.publicApi()

  /**
   * Called whenever an interactor exits hovering this interactable from another connection.
   */
  onSyncInteractorHoverExit = this.onSyncInteractorHoverExitEvent.publicApi()

  /**
   * Called whenever the interactable enters the triggered state from another connection.
   */
  onSyncTriggerStart = this.onSyncTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor triggers an interactable from another connection.
   */
  onSyncInteractorTriggerStart = this.onSyncInteractorTriggerStartEvent.publicApi()

  /**
   * Called whenever an interactor continues to trigger an interactable from another connection.
   */
  onSyncTriggerUpdate = this.onSyncTriggerUpdateEvent.publicApi()

  /**
   * Called whenever the interactable exits the triggered state while the interactor is hovering it from another connection.
   */
  onSyncTriggerEnd = this.onSyncTriggerEndEvent.publicApi()

  /**
   * Called whenever the interactable exits the triggered state while the interactor is not hovering it from another connection.
   */
  onSyncTriggerEndOutside = this.onSyncTriggerEndOutsideEvent.publicApi()

  /**
   * Called whenever an interactor is no longer triggering the interactable while the interactor is hovering it from another connection.
   */
  onSyncInteractorTriggerEnd = this.onSyncInteractorTriggerEndEvent.publicApi()

  /**
   * Called whenever an interactor is no longer triggering the interactable while the interactor is not hovering it from another connection.
   */
  onSyncInteractorTriggerEndOutside = this.onSyncInteractorTriggerEndOutsideEvent.publicApi()

  /**
   * Called whenever an interactor is lost and was in a down event with this interactable from another connection.
   */
  onSyncTriggerCanceled = this.onSyncTriggerCanceledEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * has moved a minimum drag distance from another connection.
   */
  onSyncDragStart = this.onSyncDragStartEvent.publicApi()

  /**
   * Called when an interactor is in a down event with this interactable and
   * is moving from another connection.
   */
  onSyncDragUpdate = this.onSyncDragUpdateEvent.publicApi()

  /**
   * Called when an interactor was in a down event with this interactable and
   * was dragging from another connection.
   */
  onSyncDragEnd = this.onSyncDragEndEvent.publicApi()

  // Interactor
  private _hoveringInteractor: InteractorInputType = InteractorInputType.None
  private _triggeringInteractor: InteractorInputType = InteractorInputType.None

  /**
   * Provides all colliders associated with this Interactable.
   */
  colliders: ColliderComponent[] = []

  /**
   * Defines how an interactor can interact with this interactable.
   * Values are:
   * 1: Direct: Only allows close pinch interactions where a hand directly touches the Interactable.
   * 2: Indirect: Allows interactions from a distance with raycasting.
   * 3: Direct/Indirect: Supports both direct and indirect interaction methods.
   * 4: Poke: Enables finger poking interactions.
   * 7: All: Supports all targeting modes (Direct, Indirect, and Poke).
   */
  @input
  @hint(
    "Defines how Interactors can target and interact with this Interactable. Options include:\n\
- Direct: Only allows close pinch interactions where a hand directly touches the Interactable.\n\
- Indirect: Allows interactions from a distance with raycasting.\n\
- Direct/Indirect: Supports both direct and indirect interaction methods.\n\
- Poke: Enables finger poking interactions.\n\
- All: Supports all targeting modes (Direct, Indirect, and Poke)."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Direct", 1),
      new ComboBoxItem("Indirect", 2),
      new ComboBoxItem("Direct/Indirect", 3),
      new ComboBoxItem("Poke", 4),
      new ComboBoxItem("All", 7)
    ])
  )
  targetingMode: number = 3

  /**
   * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
   * - 0: Cursor (default)
   * - 1: Ray
   * - 2: None
   */
  @input
  @hint(
    "Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).\n\n\
- 0: None\n\
- 1: Cursor (default)\n\
- 2: Ray"
  )
  @widget(new ComboBoxWidget([new ComboBoxItem("None", 0), new ComboBoxItem("Cursor", 1), new ComboBoxItem("Ray", 2)]))
  targetingVisual: number = TargetingVisual.Cursor

  /**
   * When enabled, this Interactable ignores any parent InteractionPlane and factors into the cursor's position and
   * targetingVisual. Use when the Interactable is parented for organization but not spatially within that plane.
   */
  @input
  @hint(
    "When enabled, this Interactable ignores any parent InteractionPlane and factors into the cursor's position and \
targetingVisual. Use when the Interactable is parented for organization but not spatially within that plane."
  )
  ignoreInteractionPlane: boolean = false

  /**
   * Defines the singular source of truth for feedback + UI + cursor components to poll to check
   * if the Interactable should exhibit sticky behavior during trigger
   * (cursor locks on Interactable, remains in active visual state even after de-hovering).
   */
  @input
  @hint(
    "Defines the singular source of truth for feedback + UI + cursor components to poll to check \
if the Interactable should exhibit sticky behavior during trigger \
(cursor locks on Interactable, remains in active visual state even after de-hovering)."
  )
  keepHoverOnTrigger: boolean = false

  /**
   * Enable this to allow the Interactable to instantly be dragged on trigger rather than obeying the Interactor's
   * drag threshold.
   */
  @input
  @hint(
    "Enable this to allow the Interactable to instantly be dragged on trigger rather than obeying the Interactor's \
drag threshold."
  )
  enableInstantDrag: boolean = false

  /**
   * A flag that enables scroll interactions when this element is interacted with. When true, interactions with this
   * element can scroll a parent ScrollView that has content extending beyond its visible bounds.
   */
  @input
  @hint(
    "A flag that enables scroll interactions when this element is interacted with. When true, interactions with this \
element can scroll a parent ScrollView that has content extending beyond its visible bounds."
  )
  isScrollable: boolean = false

  /**
   * Determines whether this Interactable can be simultaneously controlled by multiple Interactors. When false, only
   * one Interactor type (e.g., left hand or right hand) can interact with this Interactable at a time, and subsequent
   * interaction attempts from different Interactors will be blocked. Set to true to enable interactions from multiple
   * sources simultaneously, such as allowing both hands to manipulate the Interactable at once.
   */
  @input
  @hint(
    "Determines whether this Interactable can be simultaneously controlled by multiple Interactors. When false, only \
one Interactor type (e.g., left hand or right hand) can interact with this Interactable at a time, and subsequent \
interaction attempts from different Interactors will be blocked. Set to true to enable interactions from multiple \
sources simultaneously, such as allowing both hands to manipulate the Interactable at once."
  )
  allowMultipleInteractors: boolean = true

  /**
   * Enable Poke Directionality to help prevent accidental interactions when users approach from unwanted angles.
   */
  @ui.separator
  @input
  @hint("Enable Poke Directionality to help prevent accidental interactions when users approach from unwanted angles.")
  enablePokeDirectionality: boolean = false

  /**
   * Controls from which directions a poke interaction can trigger this Interactable along the X-axis:
   * - Left: Finger must approach from -X direction.
   * - Right: Finger must approach from +X direction.
   * - All: Accepts both directions.
   * - None: Disables X-axis poke detection.
   */
  @input
  @label("X")
  @showIf("enablePokeDirectionality")
  @hint(
    "Controls from which directions a poke interaction can trigger this Interactable along the X-axis:\n\
- Left: Finger must approach from -X direction.\n\
- Right: Finger must approach from +X direction.\n\
- All: Accepts both directions.\n\
- None: Disables X-axis poke detection."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("None", 0),
      new ComboBoxItem("Right", 1),
      new ComboBoxItem("Left", 2),
      new ComboBoxItem("All", 3)
    ])
  )
  acceptableXDirections: number = 0

  /**
   * Controls from which directions a poke interaction can trigger this Interactable along the Y-axis:
   * - Top: Finger must approach from +Y direction
   * - Bottom: Finger must approach from -Y direction
   * - All: Accepts both directions
   * - None: Disables Y-axis poke detection
   */
  @input
  @label("Y")
  @showIf("enablePokeDirectionality")
  @hint(
    "Controls from which directions a poke interaction can trigger this Interactable along the Y-axis:\n\
- Top: Finger must approach from +Y direction.\n\
- Bottom: Finger must approach from -Y direction.\n\
- All: Accepts both directions.\n\
- None: Disables Y-axis poke detection."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("None", 0),
      new ComboBoxItem("Top", 1),
      new ComboBoxItem("Bottom", 2),
      new ComboBoxItem("All", 3)
    ])
  )
  acceptableYDirections: number = 0

  /**
   * Controls from which directions a poke interaction can trigger this Interactable along the Z-axis:
   * - Front: Finger must approach from +Z direction.
   * - Back: Finger must approach from -Z direction.
   * - All: Accepts both directions.
   * - None: Disables Z-axis poke detection.
   */
  @input
  @label("Z")
  @showIf("enablePokeDirectionality")
  @hint(
    "Controls from which directions a poke interaction can trigger this Interactable along the Z-axis:\n\
- Front: Finger must approach from +Z direction.\n\
- Back: Finger must approach from -Z direction.\n\
- All: Accepts both directions.\n\
- None: Disables Z-axis poke detection."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("None", 0),
      new ComboBoxItem("Front", 1),
      new ComboBoxItem("Back", 2),
      new ComboBoxItem("All", 3)
    ])
  )
  acceptableZDirections: number = 1

  /**
   * Determines if the Interactable should listen to filtered pinch events when targeted by a HandInteractor.
   * Filtered pinch events are more stable when the hand is quickly moving but may add latency in non-moving cases.
   * Most interactions should use raw pinch events by default.
   * Spatial interactions with large hand movement (such as dragging, scrolling) should use filtered pinch events.
   * If an Interactable has a parent Interactable that uses filtered pinch events,
   * the Interactable will also use filtered pinch events.
   */
  @input
  @hint(
    "Determines if the Interactable should listen to filtered pinch events when targeted by a HandInteractor. \
Filtered pinch events are more stable when the hand is quickly moving but may add latency in non-moving cases. \
Most interactions should use raw pinch events by default. \
Spatial interactions with large hand movement (such as dragging, scrolling) should use filtered pinch events. \
If an Interactable has a parent Interactable that uses filtered pinch events, \
the Interactable will also use filtered pinch events."
  )
  useFilteredPinch: boolean = false

  private _triggeringConnectionId: string | null = null

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
    const isLocalEvent = this.checkLocalEvent(eventArgs)

    if (this._hoveringInteractor === InteractorInputType.None) {
      const event = isLocalEvent ? this.onHoverEnterEvent : this.onSyncHoverEnterEvent
      event.invoke({...eventArgs, interactable: this})

      this.log.v("InteractionEvent : " + "On Hover Enter Event")
    }

    this._hoveringInteractor |= eventArgs.interactor.inputType

    const event = isLocalEvent ? this.onInteractorHoverEnterEvent : this.onSyncInteractorHoverEnterEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })

    this.log.v("InteractionEvent : " + "On Interactor Hover Enter Event")
  }

  /**
   * Notifies the interactable that it is still hovering
   * @param eventArgs - event parameters, with omitted interactable
   */
  hoverUpdate = (eventArgs: InteractableEventArgs): void => {
    if (this._hoveringInteractor === InteractorInputType.None) {
      return
    }

    const isLocalEvent = this.checkLocalEvent(eventArgs)

    const event = isLocalEvent ? this.onHoverUpdateEvent : this.onSyncHoverUpdateEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })
  }

  /**
   * Notifies the interactable that it is exiting hover state
   * @param eventArgs - event parameters, with omitted interactable
   */
  hoverExit = (eventArgs: InteractableEventArgs): void => {
    this._hoveringInteractor &= ~eventArgs.interactor.inputType

    const isLocalEvent = this.checkLocalEvent(eventArgs)

    const event = isLocalEvent ? this.onInteractorHoverExitEvent : this.onSyncInteractorHoverExitEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })

    this.log.v("InteractionEvent : " + "On Interactor Hover Exit Event")

    if (this._hoveringInteractor === InteractorInputType.None) {
      const event = isLocalEvent ? this.onHoverExitEvent : this.onSyncHoverExitEvent
      event.invoke({
        ...eventArgs,
        interactable: this
      })
      this.log.v("InteractionEvent : " + "On Hover Exit Event")
    }
  }

  /**
   * Notifies the interactable that it is entering trigger state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerStart = (eventArgs: InteractableEventArgs): void => {
    const isLocalEvent = this.checkLocalEvent(eventArgs)

    if (this._triggeringConnectionId === null) {
      this._triggeringConnectionId = eventArgs.connectionId ?? null
    } else if (this._triggeringConnectionId !== eventArgs.connectionId) {
      return
    }

    if (this._triggeringInteractor === InteractorInputType.None) {
      const event = isLocalEvent ? this.onTriggerStartEvent : this.onSyncTriggerStartEvent
      event.invoke({
        ...eventArgs,
        interactable: this
      })

      this.log.v("InteractionEvent : " + "On Trigger Start Event")
    }

    this._triggeringInteractor |= eventArgs.interactor.inputType

    const event = isLocalEvent ? this.onInteractorTriggerStartEvent : this.onSyncInteractorTriggerStartEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })

    this.log.v("InteractionEvent : " + "On Interactor Trigger Start Event")
  }

  /**
   * Notifies the interactable that it is still in a triggering state
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerUpdate = (eventArgs: InteractableEventArgs): void => {
    const isLocalEvent = this.checkLocalEvent(eventArgs)

    if (this._triggeringConnectionId !== eventArgs.connectionId) {
      return
    }

    const event = isLocalEvent ? this.onTriggerUpdateEvent : this.onSyncTriggerUpdateEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })

    this.dragStartOrUpdate(eventArgs)
  }

  /**
   * Notifies the interactable that it is exiting trigger state  while the interactor is hovering it
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerEnd = (eventArgs: InteractableEventArgs): void => {
    const isLocalEvent = this.checkLocalEvent(eventArgs)

    if (this._triggeringConnectionId === eventArgs.connectionId) {
      this._triggeringConnectionId = null
    } else if (this._triggeringConnectionId !== eventArgs.connectionId) {
      return
    }

    this._triggeringInteractor &= ~eventArgs.interactor.inputType

    const event = isLocalEvent ? this.onInteractorTriggerEndEvent : this.onSyncInteractorTriggerEndEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })

    this.log.v("InteractionEvent : " + "On Interactor Trigger End Event")

    if (this._triggeringInteractor === InteractorInputType.None) {
      const event = isLocalEvent ? this.onTriggerEndEvent : this.onSyncTriggerEndEvent
      event.invoke({
        ...eventArgs,
        interactable: this
      })

      this.log.v("InteractionEvent : " + "On Trigger End Event")
    }
    this.dragEnd(eventArgs)
  }

  /**
   * Notifies the interactable that it is exiting trigger state while the interactor is not hovering it.
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerEndOutside = (eventArgs: InteractableEventArgs): void => {
    const isLocalEvent = this.checkLocalEvent(eventArgs)

    if (this._triggeringConnectionId === eventArgs.connectionId) {
      this._triggeringConnectionId = null
    } else if (this._triggeringConnectionId !== eventArgs.connectionId) {
      return
    }

    this._triggeringInteractor &= ~eventArgs.interactor.inputType

    const event = isLocalEvent ? this.onInteractorTriggerEndOutsideEvent : this.onSyncInteractorTriggerEndOutsideEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })

    this.log.v("InteractionEvent : " + "On Interactor Trigger End Outside Event")

    if (this._triggeringInteractor === InteractorInputType.None) {
      const event = isLocalEvent ? this.onTriggerEndOutsideEvent : this.onSyncTriggerEndOutsideEvent
      event.invoke({
        ...eventArgs,
        interactable: this
      })

      this.log.v("InteractionEvent : " + "On Trigger End Outside Event")
    }
    this.dragEnd(eventArgs)
  }

  /**
   * Notifies the interactable that it is a cancelled state with the interactor
   * @param eventArgs - event parameters, with omitted interactable
   */
  triggerCanceled = (eventArgs: InteractableEventArgs): void => {
    const isLocalEvent = this.checkLocalEvent(eventArgs)

    if (this._triggeringConnectionId === eventArgs.connectionId) {
      this._triggeringConnectionId = null
    } else if (this._triggeringConnectionId !== eventArgs.connectionId) {
      return
    }

    this._triggeringInteractor &= ~eventArgs.interactor.inputType

    const event = isLocalEvent ? this.onTriggerCanceledEvent : this.onSyncTriggerCanceledEvent
    event.invoke({
      ...eventArgs,
      interactable: this
    })

    this.log.v("InteractionEvent : " + "On Trigger Canceled Event")
    this.dragEnd(eventArgs)
  }

  /**
   * Returns the connection ID of the first triggering Interactor if in a Connected Lens.
   */
  get triggeringConnectionId(): string | null {
    return this._triggeringConnectionId
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

  /**
   * Notifies the interactable that it is in a dragged state with the interactor
   * @param eventArgs - event parameters, with omitted interactable
   */
  dragStartOrUpdate(eventArgs: InteractableEventArgs) {
    const currentDragVector = eventArgs.interactor.currentDragVector
    if (currentDragVector === null) {
      return
    }

    const previousDragVector = eventArgs.interactor.previousDragVector
    const dragInteractorEvent = {
      ...eventArgs,
      interactable: this,
      dragVector: currentDragVector,
      planecastDragVector: eventArgs.interactor.planecastDragVector
    }

    const isLocalEvent = this.checkLocalEvent(eventArgs)

    if (previousDragVector === null) {
      const event = isLocalEvent ? this.onDragStartEvent : this.onSyncDragStartEvent
      event.invoke(dragInteractorEvent)

      this.log.v("InteractionEvent : " + "On Drag Start Event")
    } else {
      const event = isLocalEvent ? this.onDragUpdateEvent : this.onSyncDragUpdateEvent
      event.invoke(dragInteractorEvent)
    }
  }

  /**
   * Notifies the interactable that it is exiting a dragged state with the interactor
   * @param eventArgs - event parameters, with omitted interactable
   */
  dragEnd(eventArgs: InteractableEventArgs) {
    const previousDragVector = eventArgs.interactor.previousDragVector
    if (previousDragVector === null) {
      return
    }

    const isLocalEvent = this.checkLocalEvent(eventArgs)

    const event = isLocalEvent ? this.onDragEndEvent : this.onSyncDragEndEvent
    event.invoke({
      ...eventArgs,
      interactable: this,
      dragVector: previousDragVector,
      planecastDragVector: eventArgs.interactor.planecastDragVector
    })

    this.log.v("InteractionEvent : " + "On Drag End Event")
  }

  /**
   * @returns if this Interactable is a descendant of the given Interactable.
   */
  public isDescendantOf(interactable: Interactable) {
    return isDescendantOf(this.sceneObject, interactable.sceneObject)
  }

  private enableColliders(enable: boolean) {
    for (let i = 0; i < this.colliders.length; i++) {
      this.colliders[i].enabled = enable
    }
  }

  private checkLocalEvent(event: InteractableEventArgs): boolean {
    const isLocalEvent =
      !event.connectionId || this.syncKitBridge.sessionController.getLocalConnectionId() === event.connectionId

    return isLocalEvent
  }
}
