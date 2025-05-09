import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {Interactor} from "./Interactor"

export type EventPropagationPhase = "TrickleDown" | "Target" | "BubbleUp"

export type InteractableEventName =
  | "HoverEnter"
  | "HoverUpdate"
  | "HoverExit"
  | "TriggerStart"
  | "TriggerUpdate"
  | "TriggerEnd"
  | "TriggerCanceled"

export type DispatchableEventArgs = {
  interactor: Interactor
  target: Interactable
  eventName: InteractableEventName
  origin?: Interactable
}

/**
 * Represents an interactor event
 * Events are propagated along the scene hierarchy, and can be invoked
 * by another component as itself. This event adds a field
 * to keep track of which {@link Interactable} invoked it.
 */
export type InteractorEvent = {
  /**
   * The {@link Interactor} that triggered this event
   */
  interactor: Interactor

  /**
   * The {@link Interactable} targeted by the interactor
   */
  target: Interactable

  /**
   * The {@link Interactable} where this event was invoked to
   */
  interactable: Interactable

  /**
   * The current phase for this event
   */
  propagationPhase: EventPropagationPhase

  /**
   * Stop propagating this event on the propagation path.
   */
  stopPropagation(): void
}

/**
 * InteractorEvent with dragging data
 */
export type DragInteractorEvent = InteractorEvent & {
  /*
   * The coordinate of the interactor origin relative to the
   * position of the last {@link DragInteractorEvent}.
   */
  dragVector: vec3
  /**
   * The drag vector projected onto the plane defined by the Interactable's forward and origin
   */
  planecastDragVector: vec3 | null
}
