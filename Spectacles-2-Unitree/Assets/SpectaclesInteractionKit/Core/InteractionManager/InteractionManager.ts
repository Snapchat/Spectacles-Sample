import NativeLogger from "../../Utils/NativeLogger"
import {
  Interactor,
  InteractorInputType,
  InteractorTriggerType,
  TargetingMode,
} from "../Interactor/Interactor"

import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractionPlane} from "../../Components/Interaction/InteractionPlane/InteractionPlane"
import {Singleton} from "../../Decorators/Singleton"
import {LensConfig} from "../../Utils/LensConfig"
import {getSafeReference} from "../../Utils/SafeReference"
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

  // Native Logging
  private log = new NativeLogger(TAG)

  private interactors = new Set<Interactor>()
  private interactables = new Set<Interactable>()
  private interactionPlanes = new Set<InteractionPlane>()

  private interactableSceneObjects = new Map<SceneObject, Interactable>()
  private colliderToInteractableMap = new Map<ColliderComponent, Interactable>()
  private eventDispatcher = new EventDispatcher(this.interactableSceneObjects)

  private _debugModeEnabled = false

  /*
    shouldEnableNonMobileInteractors is nullable because we use this as a cached class-level condition to
    compare against the function-level condition in disableOtherInteractorsIfMobileInputTypeIsDetected().
    Initializing to null here ensures the first frame always initializes the interactor's activeness properly.
  */
  private shouldEnableNonMobileInteractors: boolean | null = null

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
    if (interactor === null || interactor === undefined) {
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
    if (interactor === null || interactor === undefined) {
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
    let returnValue: Interactor[] = []
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
    let returnValue: Interactor[] = []
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
    if (interactionPlane === null || interactionPlane === undefined) {
      this.log.e("Cannot register null or uninitialized interaction plane.")
      return
    }
    this.interactionPlanes.add(interactionPlane)

    if (this.debugModeEnabled) {
      interactionPlane.drawDebug = true
    }

    this.log.d(
      `Registered interaction plane "${interactionPlane.sceneObject.name}"`
    )
  }

  /**
   * Removes an {@link InteractionPlane} from the interaction manager's registry.
   * @param interactionPlane The {@link InteractionPlane} to deregister.
   */
  deregisterInteractionPlane(interactionPlane: InteractionPlane): void {
    if (interactionPlane === null || interactionPlane === undefined) {
      this.log.e("Cannot deregister null or uninitialized interaction plane.")
      return
    }

    /*
     * When an Interactable is deregistered, check our list of Interactors and clear their current InteractionPlane
     * if it is the same as the InteractionPlane that was just deregistered
     */
    const handInteractors = this.getInteractorsByType(
      InteractorInputType.BothHands
    ) as HandInteractor[]
    for (const handInteractor of handInteractors) {
      handInteractor.clearInteractionPlane(interactionPlane)
    }

    if (this.interactionPlanes.delete(interactionPlane)) {
      this.log.d(
        `Deregistered interaciton plane  "${interactionPlane.sceneObject.name}"`
      )
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
    if (interactable === null || interactable === undefined) {
      this.log.e("Cannot register null or uninitialized interactable.")
      return
    }
    this.interactables.add(interactable)
    this.interactableSceneObjects.set(interactable.sceneObject, interactable)
    const colliders = this.findOrCreateColliderForInteractable(interactable)
    for (let i = 0; i < colliders.length; i++) {
      this.colliderToInteractableMap.set(colliders[i], interactable)
    }

    if (this.debugModeEnabled) {
      for (const collider of colliders) {
        collider.debugDrawEnabled = this.debugModeEnabled
      }
    }

    this.log.d(
      `Registered interactable "${interactable.sceneObject.name}" with ${colliders.length} colliders`
    )
  }

  /**
   * Removes an {@link Interactable} from the interaction manager's registry.
   * @param interactable The {@link Interactable} to deregister.
   */
  deregisterInteractable(interactable: Interactable): void {
    if (interactable === null || interactable === undefined) {
      this.log.e("Cannot deregister null or uninitialized interactable.")
      return
    }

    /*
     * When an Interactable is deregistered, check our list of Interactors and clear their current Interactable
     * if it is the same as the Interactable that was just deregistered
     */
    for (const interactor of this.interactors) {
      if (
        interactor.currentInteractable !== null &&
        interactable === interactor.currentInteractable
      ) {
        interactor.clearCurrentInteractable()
      }
    }

    if (
      this.interactables.delete(interactable) &&
      this.interactableSceneObjects.delete(interactable.sceneObject)
    ) {
      this.log.d(`Deregistered interactable "${interactable.sceneObject.name}"`)
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
    if (getSafeReference(interactable.sceneObject) === null) {
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

    if (getSafeReference(interactable.sceneObject) === null) {
      this.interactableSceneObjects.delete(sceneObject)
    }

    return interactable
  }

  /**
   * @deprecated use `getInteractablesThatTarget(targetingMode) instead.`
   * @param targetingMode the targeting mode that the interactable(s) are configured to
   */
  getInteractablesByTargetingMode(
    targetingMode: TargetingMode
  ): Interactable[] {
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
  dispatchEvent(eventArgs: DispatchableEventArgs): void {
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
    this.disableOtherInteractorsIfMobileInputTypeIsDetected()

    // Update interactors
    this.updateInteractors()

    // Process interactor events
    this.interactors.forEach((interactor) => this.processEvents(interactor))
  }

  private processEvents(interactor: Interactor) {
    if (!interactor.enabled) {
      /**
       * Check to see if we were triggering an interactable before
       * losing tracking / being disabled. If we were, send a cancel
       * event to keep the interactable up to date.
       */

      if (interactor.previousInteractable) {
        if ((InteractorTriggerType.Select & interactor.previousTrigger) !== 0) {
          this.eventDispatcher.dispatch({
            target: interactor.previousInteractable,
            interactor: interactor,
            eventName: "TriggerCanceled",
          })
        }
        if (
          (interactor.inputType &
            interactor.previousInteractable.hoveringInteractor) !==
          0
        ) {
          this.eventDispatcher.dispatch({
            target: interactor.previousInteractable,
            interactor: interactor,
            eventName: "HoverExit",
          })
        }
      }

      return
    }

    // Process events
    if (interactor.currentInteractable) {
      this.processHoverEvents(interactor)
      this.processTriggerEvents(interactor)
    } else if (interactor.previousInteractable) {
      if (
        (interactor.inputType &
          interactor.previousInteractable.hoveringInteractor) !==
        0
      ) {
        // If it was previously targeted
        this.eventDispatcher.dispatch({
          target: interactor.previousInteractable,
          interactor: interactor,
          eventName: "HoverExit",
        })
      }

      // If the interactor is no longer interacting with an interactable that it was previously interacting,
      // the trigger has been cancelled rather than ending fully.
      if (interactor.previousTrigger !== InteractorTriggerType.None) {
        this.eventDispatcher.dispatch({
          target: interactor.previousInteractable,
          interactor: interactor,
          eventName: "TriggerCanceled",
        })
      }
    }
  }

  private updateInteractors() {
    this.interactors.forEach((interactor: Interactor) => {
      interactor.updateState()

      if (interactor.currentInteractable !== interactor.previousInteractable) {
        interactor.currentInteractableChanged()
      }

      if (!interactor.isActive()) {
        /**
         * Check to see if we were triggering an interactable before
         * losing tracking / being disabled. If we were, send a cancel
         * event to keep the interactable up to date.
         */
        if (interactor.previousInteractable) {
          if (
            (InteractorTriggerType.Select & interactor.previousTrigger) !==
            0
          ) {
            this.eventDispatcher.dispatch({
              target: interactor.previousInteractable,
              interactor: interactor,
              eventName: "TriggerCanceled",
            })
          }

          if (
            (interactor.inputType &
              interactor.previousInteractable.hoveringInteractor) !==
            0
          ) {
            this.eventDispatcher.dispatch({
              target: interactor.previousInteractable,
              interactor: interactor,
              eventName: "HoverExit",
            })
          }
        }
        return
      }
    })
  }

  private processHoverEvents(interactor: Interactor) {
    if (interactor.currentInteractable === null) {
      return
    }

    // If first time targeted
    if (interactor.previousInteractable !== interactor.currentInteractable) {
      // Alert previous interactable that we've left it
      if (interactor.previousInteractable !== null) {
        if (
          (interactor.inputType &
            interactor.previousInteractable.hoveringInteractor) !==
          0
        ) {
          this.eventDispatcher.dispatch({
            target: interactor.previousInteractable,
            interactor: interactor,
            eventName: "HoverExit",
          })
        }
      }

      this.eventDispatcher.dispatch({
        target: interactor.currentInteractable,
        interactor: interactor,
        eventName: "HoverEnter",
      })
    } else {
      this.eventDispatcher.dispatch({
        target: interactor.currentInteractable,
        interactor: interactor,
        eventName: "HoverUpdate",
      })
    }
  }

  private processTriggerEvents(interactor: Interactor) {
    if (interactor.currentInteractable === null) {
      return
    }

    const previousTrigger = interactor.previousTrigger
    const currentTrigger = interactor.currentTrigger

    const eventArgs = {
      target: interactor.currentInteractable,
      interactor: interactor,
    }

    if (
      previousTrigger === InteractorTriggerType.None &&
      (InteractorTriggerType.Select & currentTrigger) !== 0
    ) {
      this.eventDispatcher.dispatch({
        ...eventArgs,
        eventName: "TriggerStart",
      })
    } else if (
      previousTrigger === currentTrigger &&
      currentTrigger !== InteractorTriggerType.None
    ) {
      this.eventDispatcher.dispatch({
        ...eventArgs,
        eventName: "TriggerUpdate",
      })
    } else if (
      previousTrigger !== InteractorTriggerType.None &&
      // This check ensures that the interactor being in a 'triggering' state only invokes onTriggerEnd of an Interactable
      // if the trigger was actually applied to the Interactable in a previous update.
      interactor.previousInteractable !== null
    ) {
      this.eventDispatcher.dispatch({
        ...eventArgs,
        eventName: "TriggerEnd",
      })
    }
  }

  /**
   * Looks for colliders in the descendants of the param {@link Interactable}
   * if not collider is found, one is created.
   * @param interactable the interactable for which to find or create the collider
   * @returns an array of {@link ColliderComponent}
   */
  private findOrCreateColliderForInteractable(
    interactable: Interactable
  ): ColliderComponent[] {
    let colliders = interactable.colliders
    let sceneObject = interactable.sceneObject
    if (colliders.length === 0) {
      colliders = this.findCollidersForSceneObject(sceneObject, colliders, true)
    }
    if (colliders.length === 0) {
      this.log.d(
        `No ColliderComponent in ${sceneObject.name}'s hierarchy. Creating one...`
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

    const foundColliders = sceneObject.getComponents(
      "Physics.ColliderComponent"
    )
    const collidersRegistered =
      foundColliders.find((collider: ColliderComponent) =>
        this.colliderToInteractableMap.has(collider)
      ) !== undefined

    if (collidersRegistered) {
      this.log.w(
        `Some colliders in ${sceneObject.name} were already registered with an Interactable object.`
      )
    }

    colliders.push(...foundColliders)

    const childrenCount = sceneObject.getChildrenCount()
    for (let i = 0; i < childrenCount; i++) {
      this.findCollidersForSceneObject(sceneObject.getChild(i), colliders)
    }

    return colliders
  }

  private disableOtherInteractorsIfMobileInputTypeIsDetected() {
    const mobileInteractors = this.getInteractorsByType(
      InteractorInputType.Mobile
    )
    if (mobileInteractors.length === 0) {
      return
    }
    const handInteractors = this.getInteractorsByType(
      InteractorInputType.BothHands
    )
    const shouldEnableOtherInteractors = !mobileInteractors[0].isActive()

    if (
      this.shouldEnableNonMobileInteractors !== shouldEnableOtherInteractors
    ) {
      this.shouldEnableNonMobileInteractors = shouldEnableOtherInteractors

      if (this.shouldEnableNonMobileInteractors) {
        this.log.d("Switching to non-Mobile interactors.")
      } else {
        this.log.d("Switching to Mobile interactor.")
      }

      handInteractors.forEach((handInteractor: Interactor) =>
        handInteractor.setInputEnabled(shouldEnableOtherInteractors)
      )
      const mouseInteractors = this.getInteractorsByType(
        InteractorInputType.Mouse
      )
      if (mouseInteractors.length > 0) {
        mouseInteractors.forEach((mouseInteractor: Interactor) => {
          mouseInteractor.enabled = shouldEnableOtherInteractors
        })
      }
    }
  }
}
