import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {Interactor, InteractorInputType, InteractorTriggerType, TargetingMode} from "../Interactor/Interactor"

import {InteractionPlane} from "../../Components/Interaction/InteractionPlane/InteractionPlane"
import {Singleton} from "../../Decorators/Singleton"
import {ColliderUtils} from "../../Utils/ColliderUtils"
import {LensConfig} from "../../Utils/LensConfig"
import NativeLogger from "../../Utils/NativeLogger"
import {SyncKitBridge} from "../../Utils/SyncKitBridge"
import {HandInteractor} from "../HandInteractor/HandInteractor"
import BaseInteractor from "../Interactor/BaseInteractor"
import {DispatchableEventArgs} from "../Interactor/InteractorEvent"
import {EventDispatcher} from "./EventDispatcher"

const TAG = "InteractionManager"

/**
 * Manages interactions between {@link Interactor} and {@link Interactable}, and
 * decides if events need to be transmitted to {@link Interactable}
 */
@Singleton
export class InteractionManager {
  public static getInstance: () => InteractionManager

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * Stores the DispatchableEventArgs of a frame to automatically propagate
   * to other connections using SpectaclesSyncKit's SyncInteractionManager.
   */
  public dispatchEventArgs: DispatchableEventArgs[] = []

  // Native Logging
  private log = new NativeLogger(TAG)

  private interactors = new Set<Interactor>()
  private interactables = new Set<Interactable>()
  private interactionPlanes = new Set<InteractionPlane>()

  private interactableSceneObjects = new Map<SceneObject, Interactable>()
  private colliderToInteractableMap = new Map<ColliderComponent, Interactable>()
  private eventDispatcher = new EventDispatcher(this.interactableSceneObjects)

  private interactablesByInteractableId = new Map<string, Interactable>()

  private _debugModeEnabled = false

  private syncKitBridge = SyncKitBridge.getInstance()

  constructor() {
    this.defineScriptEvents()
  }

  /**
   * Adds an {@link Interactor} to the interaction manager's registry,
   * so it can be used to determine which {interactors} are interacting
   * with interactables.
   * @param interactor The {@link Interactor} to register.
   */
  registerInteractor(interactor: BaseInteractor): void {
    if (isNull(interactor)) {
      this.log.e("Cannot register null or uninitialized interactor.")
      return
    }

    if (this.debugModeEnabled) {
      interactor.drawDebug = this.debugModeEnabled
    }

    this.interactors.add(interactor)
    this.log.d(`Registered interactor "${interactor.sceneObject.name}"`)
  }

  /**
   * Removes an {@link Interactor} from the interaction manager's registry,
   * so that it will no longer be considered when determining which
   * interactors are interacting with interactables.
   * @param interactor The {@link Interactor} to deregister.
   */
  deregisterInteractor(interactor: BaseInteractor): void {
    if (isNull(interactor)) {
      this.log.e("Cannot deregister null or uninitialized interactor.")
      return
    }
    if (this.interactors.delete(interactor)) {
      this.log.d(`Deregistered interactor "${interactor.sceneObject.name}"`)
    }
  }

  /**
   * Returns all interactors of matching interactor type
   * @param inputType The {@link InteractorInputType} to filter interactors by.
   * @returns An array of interactors that match the input type.
   */
  getInteractorsByType(inputType: InteractorInputType): Interactor[] {
    const returnValue: Interactor[] = []
    this.interactors.forEach((interactor: Interactor) => {
      if ((interactor.inputType & inputType) !== 0) {
        returnValue.push(interactor)
      }
    })

    return returnValue
  }

  /**
   * Returns all interactors that are currently targeting
   * @returns An array of interactors that are targeting.
   */
  getTargetingInteractors(): Interactor[] {
    const returnValue: Interactor[] = []
    this.interactors.forEach((interactor: Interactor) => {
      if (interactor.isTargeting()) {
        returnValue.push(interactor)
      }
    })

    return returnValue
  }

  /**
   * Adds an {@link InteractionPlane} to the interaction manager's registry,
   * so it can be used to determine which {interactors} are interacting
   * with interaction planes.
   * @param interactionPlane The {@link InteractionPlane} to register.
   */
  registerInteractionPlane(interactionPlane: InteractionPlane): void {
    if (isNull(interactionPlane)) {
      this.log.e("Cannot register null or uninitialized interaction plane.")
      return
    }
    this.interactionPlanes.add(interactionPlane)

    if (this.debugModeEnabled) {
      interactionPlane.drawDebug = true
    }

    this.log.d(`Registered interaction plane "${interactionPlane.sceneObject.name}"`)
  }

  /**
   * Removes an {@link InteractionPlane} from the interaction manager's registry.
   * @param interactionPlane The {@link InteractionPlane} to deregister.
   */
  deregisterInteractionPlane(interactionPlane: InteractionPlane): void {
    if (isNull(interactionPlane)) {
      this.log.e("Cannot deregister null or uninitialized interaction plane.")
      return
    }

    /*
     * When an Interactable is deregistered, check our list of Interactors and clear their current InteractionPlane
     * if it is the same as the InteractionPlane that was just deregistered
     */
    const handInteractors = this.getInteractorsByType(InteractorInputType.BothHands) as HandInteractor[]
    for (const handInteractor of handInteractors) {
      handInteractor.clearInteractionPlane(interactionPlane)
    }

    if (this.interactionPlanes.delete(interactionPlane)) {
      this.log.d(`Deregistered interaciton plane  "${interactionPlane.sceneObject.name}"`)
    }
  }

  getInteractionPlanes(): InteractionPlane[] {
    const interactionPlanes = []
    for (const plane of this.interactionPlanes) {
      interactionPlanes.push(plane)
    }
    return interactionPlanes
  }

  /**
   * Adds an {@link Interactable} to the interaction manager's registry.
   * This registry helps speed up calculations when raycasting
   * objects in the scene.
   * @param interactable The {@link Interactable} to register.
   */
  registerInteractable(interactable: Interactable): void {
    if (isNull(interactable)) {
      this.log.e("Cannot register null or uninitialized interactable.")
      return
    }
    this.interactables.add(interactable)
    this.interactableSceneObjects.set(interactable.sceneObject, interactable)

    if (interactable.syncEntity !== null) {
      this.interactablesByInteractableId.set(interactable.syncEntity.networkId, interactable)
    }
    const colliders = this.findOrCreateColliderForInteractable(interactable)
    for (let i = 0; i < colliders.length; i++) {
      this.colliderToInteractableMap.set(colliders[i], interactable)
    }

    if (this.debugModeEnabled) {
      for (const collider of colliders) {
        collider.debugDrawEnabled = this.debugModeEnabled
      }
    }

    this.log.d(`Registered interactable "${interactable.sceneObject.name}" with ${colliders.length} colliders`)
  }

  /**
   * Removes an {@link Interactable} from the interaction manager's registry.
   * @param interactable The {@link Interactable} to deregister.
   */
  deregisterInteractable(interactable: Interactable): void {
    if (isNull(interactable)) {
      this.log.e("Cannot deregister null or uninitialized interactable.")
      return
    }

    /*
     * When an Interactable is deregistered, check our list of Interactors and clear their current Interactable
     * if it is the same as the Interactable that was just deregistered
     */
    for (const interactor of this.interactors) {
      if (interactor.currentInteractable !== null && interactable === interactor.currentInteractable) {
        interactor.clearCurrentInteractable()
      }
    }

    // Only check for deletion from ID map if it was synced and registered to ID map.
    const interactableId = this.getInteractableIdByInteractable(interactable)
    const needToDeleteFromIds = interactableId !== null

    if (
      this.interactables.delete(interactable) &&
      this.interactableSceneObjects.delete(interactable.sceneObject) &&
      (!needToDeleteFromIds || this.interactablesByInteractableId.delete(interactableId))
    ) {
      this.log.d(`Deregistered interactable "${interactable.sceneObject.name}"`)
    }

    for (const collider of interactable.colliders) {
      this.colliderToInteractableMap.delete(collider)
      ColliderUtils.invalidateCacheEntry(collider)
    }
  }

  /**
   * Returns an {@link Interactable} by the collider attached to it.
   * This is an optimization to reduce expensive getComponent calls.
   * @param collider The {@link ColliderComponent} to filter interactables by.
   * @returns The interactable that matches the collider.
   */
  getInteractableByCollider(collider: ColliderComponent): Interactable | null {
    const interactable = this.colliderToInteractableMap.get(collider) ?? null
    if (!interactable) {
      return null
    }
    if (isNull(interactable.sceneObject)) {
      this.colliderToInteractableMap.delete(collider)
    }

    if (interactable?.sceneObject.enabled) {
      return interactable
    } else {
      return null
    }
  }

  /**
   * Returns the interactable of the passed {@link SceneObject}.
   * @param sceneObject The {@link SceneObject} to filter interactables by.
   * @returns The interactable that matches the scene object.
   */
  getInteractableBySceneObject(sceneObject: SceneObject): Interactable | null {
    const interactable = this.interactableSceneObjects.get(sceneObject) ?? null

    if (!interactable) {
      return null
    }

    if (isNull(interactable.sceneObject)) {
      this.interactableSceneObjects.delete(sceneObject)
    }

    return interactable
  }

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * Returns the Interactable of the passed ID.
   */
  getInteractableByInteractableId(id: string): Interactable | null {
    const interactable = this.interactablesByInteractableId.get(id) ?? null

    if (!interactable) {
      return null
    }

    return interactable
  }

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * Returns the ID of the passed Interactable if it is synced.
   */
  getInteractableIdByInteractable(interactable: Interactable): string | null {
    for (const entry of this.interactablesByInteractableId.entries()) {
      if (entry[1] === interactable) {
        return entry[0]
      }
    }

    return null
  }

  /**
   * @deprecated use `getInteractablesThatTarget(targetingMode) instead.`
   * @param targetingMode the targeting mode that the interactable(s) are configured to
   */
  getInteractablesByTargetingMode(targetingMode: TargetingMode): Interactable[] {
    return this.getInteractablesThatTarget(targetingMode)
  }

  /**
   * Returns all interactables that are set to the passed targeting mode.
   * @param targetingMode - {@link TargetingMode} to filter interactables by
   * @returns an array of interactables that match the targeting mode
   */
  getInteractablesThatTarget(targetingMode: TargetingMode): Interactable[] {
    const returnArray: Interactable[] = []
    this.interactables.forEach((interactable: Interactable) => {
      if ((interactable.targetingMode & targetingMode) !== 0) {
        returnArray.push(interactable)
      }
    })
    return returnArray
  }

  /**
   * Dispatches an event in 3 phases:
   * - Trickle-down: the event descends the hierarchy, from the first
   * interactable ancestor of the target to its parent
   * - Target: the event is sent to the target
   * - Bubble-up: the event ascends the hierarchy, from the target's parent
   * to its first interactable ancestor
   *
   * The {@link DispatchableEventArgs | eventArgs.origin} is not included in the propagation path and
   * the dispatch starts at {@link DispatchableEventArgs | eventArgs.origin} child.
   * @param eventArgs The event arguments to dispatch.
   */
  dispatchEvent(eventArgs: DispatchableEventArgs, propagateEvent: boolean = false): void {
    const localConnectionId =
      this.syncKitBridge.sessionController !== undefined
        ? this.syncKitBridge.sessionController.getLocalConnectionId()
        : null
    const isNotSynced = localConnectionId === null

    // If the connectionId is undefined, the event is coming from the local user's Interactors (rather than a propagated event).
    if (eventArgs.connectionId === undefined) {
      eventArgs.connectionId = localConnectionId
    }

    // If the user is not synced to any connection, dispatch the event with no further checks.
    if (isNotSynced) {
      this.eventDispatcher.dispatch(eventArgs)
      return
    }

    // Propagate the event to dispatchEventArgs for SyncInteractionManager to process in other connections.
    if (propagateEvent) {
      this.dispatchEventArgs.push(eventArgs)
    }

    this.eventDispatcher.dispatch(eventArgs)
  }

  set debugModeEnabled(enabled: boolean) {
    this._debugModeEnabled = enabled

    for (const interactor of this.interactors.keys()) {
      interactor.drawDebug = enabled
    }

    for (const collider of this.colliderToInteractableMap.keys()) {
      collider.debugDrawEnabled = enabled
    }

    for (const plane of this.interactionPlanes.keys()) {
      plane.drawDebug = enabled
    }
  }

  get debugModeEnabled(): boolean {
    return this._debugModeEnabled
  }

  private defineScriptEvents(): void {
    LensConfig.getInstance()
      .updateDispatcher.createUpdateEvent("InteractionManagerUpdateEvent")
      .bind(() => this.update())
  }

  /**
   * Iterates through all the interactors, determine which interactables
   * are being interacted with, and send events to them
   */
  private update() {
    // Update interactors
    this.updateInteractors()

    // Clear the previous batch of Interactor events, then re-cache after processing events.
    this.dispatchEventArgs = []

    // Process interactor events
    this.interactors.forEach((interactor) => this.processEvents(interactor))
  }

  private processEvents(interactor: Interactor) {
    /**
     * If the Interactor is a SyncInteractor, do not process any events,
     * as they were already dispatched automatically by SyncInteractionManager.
     * SyncInteractors exist only to represent the state of an Interactor for callback purposes.
     */

    if ((interactor.inputType & InteractorInputType.Sync) !== 0) {
      return
    }

    if (!interactor.enabled) {
      /**
       * Check to see if we were triggering an interactable before
       * losing tracking / being disabled. If we were, send a cancel
       * event to keep the interactable up to date.
       */

      if (interactor.previousInteractable && !isNull(interactor.previousInteractable)) {
        if ((InteractorTriggerType.Select & interactor.previousTrigger) !== 0) {
          this.dispatchEvent(
            {
              target: interactor.previousInteractable,
              interactor: interactor,
              eventName: "TriggerCanceled"
            },
            true
          )
        }
        if ((interactor.inputType & interactor.previousInteractable.hoveringInteractor) !== 0) {
          this.dispatchEvent(
            {
              target: interactor.previousInteractable,
              interactor: interactor,
              eventName: "HoverExit"
            },
            true
          )
        }
      }

      return
    }

    // Process events
    if (interactor.currentInteractable && !isNull(interactor.currentInteractable)) {
      this.processHoverEvents(interactor)
      this.processTriggerEvents(interactor)
    } else if (interactor.previousInteractable) {
      if ((interactor.inputType & interactor.previousInteractable.hoveringInteractor) !== 0) {
        // If it was previously targeted
        this.dispatchEvent(
          {
            target: interactor.previousInteractable,
            interactor: interactor,
            eventName: "HoverExit"
          },
          true
        )
      }

      // If the interactor is no longer interacting with an interactable that it was previously interacting,
      // the trigger has been cancelled rather than ending fully.
      if (interactor.previousTrigger !== InteractorTriggerType.None) {
        this.dispatchEvent(
          {
            target: interactor.previousInteractable,
            interactor: interactor,
            eventName: "TriggerCanceled"
          },
          true
        )
      }
    }
  }

  private updateInteractors() {
    this.interactors.forEach((interactor: Interactor) => {
      interactor.updateState()

      const interactable = interactor.currentInteractable
      // Flush any disabled Interactables from Interactors.
      if (!isNull(interactable) && !(interactable?.sceneObject.isEnabledInHierarchy && interactable.enabled)) {
        interactor.clearCurrentInteractable()
      }

      if (interactor.currentInteractable !== interactor.previousInteractable) {
        interactor.currentInteractableChanged()
      }

      if (!interactor.isActive()) {
        /**
         * Check to see if we were triggering an interactable before
         * losing tracking / being disabled. If we were, send a cancel
         * event to keep the interactable up to date.
         */
        if (interactor.previousInteractable && !isNull(interactor.previousInteractable)) {
          if ((InteractorTriggerType.Select & interactor.previousTrigger) !== 0) {
            this.dispatchEvent(
              {
                target: interactor.previousInteractable,
                interactor: interactor,
                eventName: "TriggerCanceled"
              },
              true
            )
          }

          if ((interactor.inputType & interactor.previousInteractable.hoveringInteractor) !== 0) {
            this.dispatchEvent(
              {
                target: interactor.previousInteractable,
                interactor: interactor,
                eventName: "HoverExit"
              },
              true
            )
          }
        }
        return
      }
    })
  }

  private processHoverEvents(interactor: Interactor) {
    if (!interactor.currentInteractable || isNull(interactor.currentInteractable)) {
      return
    }

    // If first time targeted
    if (interactor.previousInteractable !== interactor.currentInteractable) {
      // Alert previous interactable that we've left it
      if (interactor.previousInteractable && !isNull(interactor.previousInteractable)) {
        if ((interactor.inputType & interactor.previousInteractable.hoveringInteractor) !== 0) {
          this.dispatchEvent(
            {
              target: interactor.previousInteractable,
              interactor: interactor,
              eventName: "HoverExit"
            },
            true
          )
        }
      }

      this.dispatchEvent(
        {
          target: interactor.currentInteractable,
          interactor: interactor,
          eventName: "HoverEnter"
        },
        true
      )
    } else {
      this.dispatchEvent(
        {
          target: interactor.currentInteractable,
          interactor: interactor,
          eventName: "HoverUpdate"
        },
        true
      )
    }
  }

  private processTriggerEvents(interactor: Interactor) {
    if (!interactor.currentInteractable || isNull(interactor.currentInteractable)) {
      return
    }

    const previousTrigger = interactor.previousTrigger
    const currentTrigger = interactor.currentTrigger

    const eventArgs = {
      target: interactor.currentInteractable,
      interactor: interactor
    }

    if (previousTrigger === InteractorTriggerType.None && (InteractorTriggerType.Select & currentTrigger) !== 0) {
      this.dispatchEvent(
        {
          ...eventArgs,
          eventName: "TriggerStart"
        },
        true
      )
    } else if (previousTrigger === currentTrigger && currentTrigger !== InteractorTriggerType.None) {
      const wasHoveringCurrentInteractable = interactor.wasHoveringCurrentInteractable
      const isHoveringCurrentInteractable = interactor.isHoveringCurrentInteractable

      // Whenever we detect a change in hover during a trigger, send HoverEnter and HoverExit events.
      if (isHoveringCurrentInteractable && !wasHoveringCurrentInteractable) {
        this.dispatchEvent(
          {
            target: interactor.currentInteractable,
            interactor: interactor,
            eventName: "HoverEnter"
          },
          true
        )
      } else if (!isHoveringCurrentInteractable && wasHoveringCurrentInteractable) {
        this.dispatchEvent(
          {
            target: interactor.currentInteractable,
            interactor: interactor,
            eventName: "HoverExit"
          },
          true
        )
      }

      this.dispatchEvent(
        {
          ...eventArgs,
          eventName: "TriggerUpdate"
        },
        true
      )
    } else if (
      previousTrigger !== InteractorTriggerType.None &&
      // This check ensures that the interactor being in a 'triggering' state only invokes onTriggerEnd of an Interactable
      // if the trigger was actually applied to the Interactable in a previous update.
      !isNull(interactor.previousInteractable)
    ) {
      if (interactor.isHoveringCurrentInteractable) {
        this.dispatchEvent(
          {
            ...eventArgs,
            eventName: "TriggerEnd",
            endedInsideInteractable: (interactor as BaseInteractor).endedInsideInteractable ?? undefined
          },
          true
        )
      } else {
        this.dispatchEvent(
          {
            ...eventArgs,
            eventName: "TriggerEndOutside",
            endedInsideInteractable: (interactor as BaseInteractor).endedInsideInteractable ?? undefined
          },
          true
        )
      }
    }
  }

  /**
   * Looks for colliders in the descendants of the param {@link Interactable}
   * if not collider is found, one is created.
   * @param interactable the interactable for which to find or create the collider
   * @returns an array of {@link ColliderComponent}
   */
  private findOrCreateColliderForInteractable(interactable: Interactable): ColliderComponent[] {
    let colliders = interactable.colliders
    const sceneObject = interactable.sceneObject
    if (colliders.length === 0) {
      colliders = this.findCollidersForSceneObject(sceneObject, colliders, true)
    }
    if (colliders.length === 0) {
      this.log.e(
        `No ColliderComponent in ${sceneObject.name}'s hierarchy. Creating temporary collider. Please create a ColliderComponent for this SceneObject.`
      )

      colliders.push(sceneObject.createComponent("Physics.ColliderComponent"))
    }
    interactable.colliders = colliders
    return colliders
  }

  /**
   * Finds all colliders in the descendants of an {@link SceneObject} with the following rules:
   * - If the current {@link SceneObject} is not root and has an {@link Interactable} component,
   * we stop the search as we do not want to associate this child's colliders.
   * - Else we accumulate all {@link ColliderComponent} and return them
   * @param sceneObject the {@link SceneObject} for which to look for colliders
   * - If some colliders are already registered
   * @param colliders the current array of colliders
   * @param isRoot whether the sceneObject is the root of the search
   * @returns an array of {@link ColliderComponent}
   */
  private findCollidersForSceneObject(
    sceneObject: SceneObject,
    colliders: ColliderComponent[],
    isRoot: boolean = false
  ): ColliderComponent[] {
    const interactable = sceneObject.getComponent(Interactable.getTypeName())

    if (interactable !== null && !isRoot) {
      return colliders
    }

    const foundColliders = sceneObject.getComponents("Physics.ColliderComponent")
    const collidersRegistered =
      foundColliders.find((collider: ColliderComponent) => this.colliderToInteractableMap.has(collider)) !== undefined

    if (collidersRegistered) {
      this.log.w(`Some colliders in ${sceneObject.name} were already registered with an Interactable object.`)
    }

    colliders.push(...foundColliders)

    const childrenCount = sceneObject.getChildrenCount()
    for (let i = 0; i < childrenCount; i++) {
      this.findCollidersForSceneObject(sceneObject.getChild(i), colliders)
    }

    return colliders
  }
}
