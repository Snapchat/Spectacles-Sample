"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const Interactor_1 = require("../Interactor/Interactor");
/**
 * Dispatches an event in 3 phases:
 * - Trickle-down: the event descends the hierarchy, from the first
 * interactable ancestor of the target to its parent
 * - Target: the event is sent to the target
 * - Bubble-up: the event ascends the hierarchy, from the target's parent
 * to its first interactable ancestor
 */
class EventDispatcher {
    constructor(sceneObjectMap) {
        this.sceneObjectMap = sceneObjectMap;
    }
    /**
     * Triggers the event propagation
     * @param eventArgs - provides the interactor, the target and the callback name
     */
    dispatch(eventArgs) {
        if (eventArgs.target.allowMultipleInteractors === false &&
            (eventArgs.target.hoveringInteractor & eventArgs.interactor.inputType) === 0) {
            // Don't dispatch the event if multiple interactors aren't allowed & there's already an active interactor
            if (eventArgs.target.hoveringInteractor !== Interactor_1.InteractorInputType.None) {
                return;
            }
            // Cover the edge case where an interactable that doesn't allow multiple interactors has multiple possible interactors
            // The active interactor exits so we can dispatch events on the interactor that previously had its events blocked
            // However, we need to send enter events to update the hovering/triggering interactor input type.
            if (eventArgs.target.hoveringInteractor === Interactor_1.InteractorInputType.None && eventArgs.eventName === "HoverUpdate") {
                eventArgs.eventName = "HoverEnter";
            }
            else if (eventArgs.target.triggeringInteractor === Interactor_1.InteractorInputType.None &&
                eventArgs.eventName === "TriggerUpdate") {
                eventArgs.eventName = "TriggerStart";
            }
        }
        const ancestors = [];
        this.getInteractableAncestors(eventArgs.target.sceneObject.getParent(), ancestors, eventArgs.origin?.sceneObject);
        const stoppableEventArgs = {
            ...eventArgs,
            propagationStopped: false
        };
        this.trickleDown(ancestors, stoppableEventArgs);
        this.target(stoppableEventArgs);
        this.bubbleUp(ancestors, stoppableEventArgs);
    }
    getInteractableAncestors(node, ancestors, excludedNode = undefined) {
        if (node === null || node === excludedNode) {
            return;
        }
        const interactable = this.sceneObjectMap.get(node);
        if (interactable !== undefined) {
            ancestors.push(interactable);
        }
        this.getInteractableAncestors(node.getParent(), ancestors, excludedNode);
    }
    trickleDown(ancestors, eventArgs) {
        for (let i = ancestors.length - 1; i >= 0; i--) {
            if (eventArgs.propagationStopped) {
                break;
            }
            const event = {
                ...eventArgs,
                interactable: ancestors[i],
                propagationPhase: "TrickleDown",
                stopPropagation: () => this.stopPropagation(eventArgs)
            };
            this.invokeEvent(event, eventArgs.eventName);
        }
    }
    target(eventArgs) {
        if (eventArgs.propagationStopped) {
            return;
        }
        const event = {
            ...eventArgs,
            interactable: eventArgs.target,
            propagationPhase: "Target",
            stopPropagation: () => this.stopPropagation(eventArgs)
        };
        this.invokeEvent(event, eventArgs.eventName);
    }
    bubbleUp(ancestors, eventArgs) {
        for (let i = 0; i < ancestors.length; i++) {
            if (eventArgs.propagationStopped) {
                break;
            }
            const event = {
                ...eventArgs,
                interactable: ancestors[i],
                propagationPhase: "BubbleUp",
                stopPropagation: () => this.stopPropagation(eventArgs)
            };
            this.invokeEvent(event, eventArgs.eventName);
        }
    }
    stopPropagation(eventArgs) {
        eventArgs.propagationStopped = true;
    }
    invokeEvent(event, eventName) {
        const interactable = event.interactable;
        switch (eventName) {
            case "HoverEnter":
                interactable.hoverEnter(event);
                break;
            case "HoverUpdate":
                interactable.hoverUpdate(event);
                break;
            case "HoverExit":
                interactable.hoverExit(event);
                break;
            case "TriggerStart":
                interactable.triggerStart(event);
                break;
            case "TriggerUpdate":
                interactable.triggerUpdate(event);
                break;
            case "TriggerEnd":
                interactable.triggerEnd(event);
                break;
            case "TriggerEndOutside":
                interactable.triggerEndOutside(event);
                break;
            case "TriggerCanceled":
                interactable.triggerCanceled(event);
                break;
            default:
                throw new Error(`Callback ${eventName} is not supported`);
        }
    }
}
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=EventDispatcher.js.map