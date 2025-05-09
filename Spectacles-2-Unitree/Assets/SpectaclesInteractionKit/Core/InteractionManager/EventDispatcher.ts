import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractorInputType} from "../Interactor/Interactor"
import {
  DispatchableEventArgs,
  InteractableEventName,
  InteractorEvent,
} from "../Interactor/InteractorEvent"

export type SceneObjectMap = Map<SceneObject, Interactable>

export type StoppableEventArgs = DispatchableEventArgs & {
  propagationStopped: boolean
}

/**
 * Dispatches an event in 3 phases:
 * - Trickle-down: the event descends the hierarchy, from the first
 * interactable ancestor of the target to its parent
 * - Target: the event is sent to the target
 * - Bubble-up: the event ascends the hierarchy, from the target's parent
 * to its first interactable ancestor
 */
export class EventDispatcher {
  constructor(private sceneObjectMap: SceneObjectMap) {}

  /**
   * Triggers the event propagation
   * @param eventArgs - provides the interactor, the target and the callback name
   */
  dispatch(eventArgs: DispatchableEventArgs): void {
    if (
      eventArgs.target.allowMultipleInteractors === false &&
      (eventArgs.target.hoveringInteractor & eventArgs.interactor.inputType) ===
        0
    ) {
      // Don't dispatch the event if multiple interactors aren't allowed & there's already an active interactor
      if (eventArgs.target.hoveringInteractor !== InteractorInputType.None) {
        return
      }

      // Cover the edge case where an interactable that doesn't allow multiple interactors has multiple possible interactors
      // The active interactor exits so we can dispatch events on the interactor that previously had its events blocked
      // However, we need to send enter events to update the hovering/triggering interactor input type.
      if (
        eventArgs.target.hoveringInteractor === InteractorInputType.None &&
        eventArgs.eventName === "HoverUpdate"
      ) {
        eventArgs.eventName = "HoverEnter"
      } else if (
        eventArgs.target.triggeringInteractor === InteractorInputType.None &&
        eventArgs.eventName === "TriggerUpdate"
      ) {
        eventArgs.eventName = "TriggerStart"
      }
    }

    const ancestors: Interactable[] = []
    this.getInteractableAncestors(
      eventArgs.target.sceneObject.getParent(),
      ancestors,
      eventArgs.origin?.sceneObject
    )

    const stoppableEventArgs = {
      ...eventArgs,
      propagationStopped: false,
    }

    this.trickleDown(ancestors, stoppableEventArgs)
    this.target(stoppableEventArgs)
    this.bubbleUp(ancestors, stoppableEventArgs)
  }

  private getInteractableAncestors(
    node: SceneObject | null,
    ancestors: Interactable[],
    excludedNode: SceneObject | undefined = undefined
  ) {
    if (node === null || node === excludedNode) {
      return
    }

    const interactable = this.sceneObjectMap.get(node)
    if (interactable !== undefined) {
      ancestors.push(interactable)
    }

    this.getInteractableAncestors(node.getParent(), ancestors, excludedNode)
  }

  private trickleDown(
    ancestors: Interactable[],
    eventArgs: StoppableEventArgs
  ) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      if (eventArgs.propagationStopped) {
        break
      }

      const event: InteractorEvent = {
        ...eventArgs,
        interactable: ancestors[i],
        propagationPhase: "TrickleDown",
        stopPropagation: () => this.stopPropagation(eventArgs),
      }
      this.invokeEvent(event, eventArgs.eventName)
    }
  }

  private target(eventArgs: StoppableEventArgs) {
    if (eventArgs.propagationStopped) {
      return
    }

    const event: InteractorEvent = {
      ...eventArgs,
      interactable: eventArgs.target,
      propagationPhase: "Target",
      stopPropagation: () => this.stopPropagation(eventArgs),
    }
    this.invokeEvent(event, eventArgs.eventName)
  }

  private bubbleUp(ancestors: Interactable[], eventArgs: StoppableEventArgs) {
    for (let i = 0; i < ancestors.length; i++) {
      if (eventArgs.propagationStopped) {
        break
      }

      const event: InteractorEvent = {
        ...eventArgs,
        interactable: ancestors[i],
        propagationPhase: "BubbleUp",
        stopPropagation: () => this.stopPropagation(eventArgs),
      }
      this.invokeEvent(event, eventArgs.eventName)
    }
  }

  private stopPropagation(eventArgs: StoppableEventArgs) {
    eventArgs.propagationStopped = true
  }

  private invokeEvent(
    event: InteractorEvent,
    eventName: InteractableEventName
  ) {
    const interactable = event.interactable
    switch (eventName) {
      case "HoverEnter":
        interactable.hoverEnter(event)
        break
      case "HoverUpdate":
        interactable.hoverUpdate(event)
        break
      case "HoverExit":
        interactable.hoverExit(event)
        break
      case "TriggerStart":
        interactable.triggerStart(event)
        break
      case "TriggerUpdate":
        interactable.triggerUpdate(event)
        break
      case "TriggerEnd":
        interactable.triggerEnd(event)
        break
      case "TriggerCanceled":
        interactable.triggerCanceled(event)
        break
      default:
        throw new Error(`Callback ${eventName} is not supported`)
    }
  }
}
