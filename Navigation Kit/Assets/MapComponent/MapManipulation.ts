import {Interactor, InteractorInputType, TargetingMode} from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor"
import Event, {PublicApi, unsubscribe} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {OneEuroFilterConfig, OneEuroFilterVec3} from "SpectaclesInteractionKit.lspkg/Utils/OneEuroFilter"

import {MapToggledNotification} from "MapComponent/Scripts/MapComponent"
import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractionManager} from "SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import {MobileInteractor} from "SpectaclesInteractionKit.lspkg/Core/MobileInteractor/MobileInteractor"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {validate} from "SpectaclesInteractionKit.lspkg/Utils/validate"
import {MapComponent} from "../MapComponent/Scripts/MapComponent"
import {customGetEuler} from "../MapComponent/Scripts/MapUtils"

export type TranslateEventArg = {
  interactable: Interactable
  startPosition: vec3
  currentPosition: vec3
}

export type RotationEventArg = {
  interactable: Interactable
  startRotation: quat
  currentRotation: quat
}

export type TransformEventArg = {
  interactable: Interactable
  startTransform: mat4
  currentTransform: mat4
}

const TAG = "[MapManipulation]"
const log = new NativeLogger(TAG)

const MOBILE_DRAG_MULTIPLIER = 0.5
const STRETCH_SMOOTH_SPEED = 15
const YAW_NEGATIVE_90 = quat.fromEulerAngles(0, -90, 0)

const CachedTransform = {
  transform: mat4.identity(),
  position: vec3.zero(),
  rotation: quat.quatIdentity(),
  scale: vec3.one()
}

/**
 * This class provides manipulation capabilities for interactable objects, including translation, rotation, and scaling. It allows configuration of the manipulation root, scale limits, and rotation axes.
 */
@component
export class InteractableManipulation extends BaseScriptComponent {
  @input("SceneObject")
  private mapSceneObject: SceneObject | null = null

  @input
  private mapComponent: MapComponent

  @input
  private fullMapCollider: ColliderComponent
  @input
  private miniMapCollider: ColliderComponent

  @input
  @hint("Toggles forward stretch for manipulating objects from afar.")
  /**
   * Toggle for stretching the forward manipulation axis of an object
   * so that you can push or pull objects quicker
   */
  enableStretchZ: boolean = true
  @input
  @showIf("enableStretchZ", true)
  showStretchZProperties: boolean = false
  @input
  @showIf("showStretchZProperties", true)
  @hint("Z multiplier on the near end of the stretch scale")
  zStretchFactorMin: number = 1.0
  @input
  @showIf("showStretchZProperties", true)
  @hint("Z multiplier on the far end of the stretch scale")
  zStretchFactorMax: number = 12.0
  @input
  @hint("Apply filtering to smooth manipulation")
  private useFilter: boolean = true

  @input
  @showIf("showFilterProperties", true)
  minCutoff: number = 2
  @input
  @showIf("showFilterProperties", true)
  beta: number = 0.015
  @input
  @showIf("showFilterProperties", true)
  dcutoff: number = 1

  private defaultFilterConfig: OneEuroFilterConfig | undefined
  private camera = WorldCameraFinderProvider.getInstance()
  private interactionManager = InteractionManager.getInstance()

  private _enableXTranslation: boolean = true
  private _enableYTranslation: boolean = true

  // Keep track of "Unsubscribe" functions when adding callbacks to Interactable Events, to ensure proper cleanup on destroy
  private unsubscribeBag: unsubscribe[] = []

  private interactable: Interactable | null = null

  // Native Logging
  private log = new NativeLogger(TAG)

  private mapTransform: Transform

  private originalWorldTransform = CachedTransform
  private originalLocalTransform = CachedTransform

  private startTransform = CachedTransform

  private offsetPosition = vec3.zero()
  private offsetRotation = quat.quatIdentity()

  private startStretchInteractorDistance = 0
  private mobileStretch = 0
  private smoothedStretch = 0

  private hoveringInteractor: Interactor
  private triggeringInteractor: Interactor

  private cachedTargetingMode: TargetingMode = TargetingMode.None

  /**
   * - HandTracking's OneEuroFilter does not support quaternions.
   * - Quaternions need to use slerp to interpolate correctly, which
   * is not currently supported by the filter function.
   * - SampleOps that HandTracking OneEuroFilter uses has functions that
   * are not supported by quaternions (such as magnitude or addition)
   */
  private translateFilter!: OneEuroFilterVec3

  private colliderSizeX: number
  private colliderSizeY: number

  /**
   * Gets the transform of the root of the manipulated object(s).
   */
  getMapTransform(): Transform | undefined {
    return this.mapTransform
  }

  /**
   * Sets the transform of the passed SceneObject as the root of the manipulated object(s).
   */
  setMapTransform(transform: Transform): void {
    this.mapTransform = transform
  }

  /**
   * Set if translation along world X-axis is enabled.
   */
  set enableXTranslation(enabled: boolean) {
    this._enableXTranslation = enabled
  }

  /**
   * Returns if translation along world X-axis is enabled.
   */
  get enableXTranslation(): boolean {
    return this._enableXTranslation
  }

  /**
   * Set if translation along world Y-axis is enabled.
   */
  set enableYTranslation(enabled: boolean) {
    this._enableYTranslation = enabled
  }

  /**
   * Returns if translation along world Y-axis is enabled.
   */
  get enableYTranslation(): boolean {
    return this._enableYTranslation
  }

  // Callbacks
  private onTranslationStartEvent = new Event<TranslateEventArg>()
  /**
   * Callback for when translation begins
   */
  onTranslationStart: PublicApi<TranslateEventArg> = this.onTranslationStartEvent.publicApi()

  private onTranslationUpdateEvent = new Event<TranslateEventArg>()
  /**
   * Callback for when translation updates each frame
   */
  onTranslationUpdate: PublicApi<TranslateEventArg> = this.onTranslationUpdateEvent.publicApi()

  private onTranslationEndEvent = new Event<TranslateEventArg>()
  /**
   * Callback for when translation has ended
   */
  onTranslationEnd: PublicApi<TranslateEventArg> = this.onTranslationEndEvent.publicApi()

  onAwake(): void {
    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())

    if (this.interactable === null) {
      throw new Error("MapManipulation requires an interactable to function.")
    }

    this.setMapTransform(this.mapSceneObject.getTransform())

    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
    this.createEvent("OnDestroyEvent").bind(() => this.onDestroy())
    this.cacheTransform()
    this.setupCallbacks()

    this.defaultFilterConfig = {
      frequency: 60, //fps
      minCutoff: this.minCutoff,
      beta: this.beta,
      dcutoff: this.dcutoff
    }

    this.translateFilter = new OneEuroFilterVec3(this.defaultFilterConfig)

    this.mapComponent.onMiniMapToggled.add((toggle: MapToggledNotification) => {
      this.setupColliders(toggle.isMini)
    })
  }

  private onStart(): void {
    this.setupColliders(false)
  }

  private onDestroy(): void {
    // If we don't unsubscribe, component will keep working after destroy() due to event callbacks added to Interactable Events
    this.unsubscribeBag.forEach((unsubscribeCallback: unsubscribe) => {
      unsubscribeCallback()
    })
    this.unsubscribeBag = []
  }

  private setupColliders(isMiniMap: boolean): void {
    this.miniMapCollider.enabled = isMiniMap
    this.fullMapCollider.enabled = !isMiniMap

    let shape
    if (isMiniMap) {
      shape = this.miniMapCollider.shape
    } else {
      shape = this.fullMapCollider.shape
    }

    if (shape.isOfType("BoxShape")) {
      const boxShape = shape as BoxShape
      // Divided by 8 because:
      // Div 2 for half length of the box
      // Div 4 to account for the bigger size of the full map interaction zone
      this.colliderSizeX = boxShape.size.x / 8
      this.colliderSizeY = boxShape.size.y / 8
    } else if (shape.isOfType("SphereShape")) {
      const sphereShape = shape as SphereShape
      this.colliderSizeX = sphereShape.radius
      this.colliderSizeY = sphereShape.radius
    } else {
      this.log.e("Other shapes of collider is not currently supported for map interaction")
    }
  }

  private setupCallbacks(): void {
    validate(this.interactable)

    this.unsubscribeBag.push(
      this.interactable.onInteractorHoverEnter.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onHoverToggle(event)
        }
      })
    )

    this.unsubscribeBag.push(
      this.interactable.onInteractorHoverExit.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onHoverToggle(event)
        }
      })
    )

    this.unsubscribeBag.push(
      this.interactable.onHoverUpdate.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onHoverUpdate(event)
        }
      })
    )

    this.unsubscribeBag.push(
      this.interactable.onInteractorTriggerStart.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onTriggerToggle(event)
        }
      })
    )

    this.unsubscribeBag.push(
      this.interactable.onTriggerUpdate.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onTriggerUpdate(event)
        }
      })
    )

    this.unsubscribeBag.push(
      this.interactable.onTriggerCanceled.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onTriggerToggle(event)
        }
      })
    )

    this.unsubscribeBag.push(
      this.interactable.onInteractorTriggerEnd.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onTriggerToggle(event)
        }
      })
    )
  }

  private updateStartValues(): void {
    validate(this.mapTransform)
    validate(this.interactable)

    const interactor: Interactor = this.getTriggeringInteractor()

    this.mobileStretch = 0
    this.smoothedStretch = 0
    this.startStretchInteractorDistance = 0

    // Reset filters
    this.translateFilter.reset()

    // Set the starting transform values to be used for callbacks
    this.startTransform = {
      transform: this.mapTransform.getWorldTransform(),
      position: this.mapTransform.getWorldPosition(),
      rotation: this.mapTransform.getWorldRotation(),
      scale: this.mapTransform.getWorldScale()
    }

    const cameraRotation = this.camera.getTransform().getWorldRotation()

    if (interactor !== null) {
      if (this.isInteractorValid(interactor) === false) {
        this.log.e("Interactor must not be valid for setting initial values")
        return
      }

      const startPoint = interactor.startPoint ?? vec3.zero()
      const orientation = interactor.orientation ?? quat.quatIdentity()

      this.cachedTargetingMode = interactor.activeTargetingMode

      if (interactor.activeTargetingMode === TargetingMode.Direct) {
        this.offsetPosition = this.startTransform.position.sub(startPoint)
        this.offsetRotation = orientation.invert().multiply(this.startTransform.rotation)
      } else {
        const rayPosition = this.getRayPosition(interactor)

        this.offsetPosition = rayPosition.sub(startPoint)
        this.offsetRotation = cameraRotation.invert().multiply(this.startTransform.rotation)
      }
    }
  }

  /**
   * Hit position from interactor does not necessarily mean the actual
   * ray position. We need to maintain offset so that there's isn't a pop
   * on pickup.
   */
  private getRayPosition(interactor: Interactor): vec3 {
    if (this.isInteractorValid(interactor) === false) {
      return vec3.zero()
    }

    const startPoint = interactor.startPoint ?? vec3.zero()
    const direction = interactor.direction ?? vec3.zero()
    const distanceToTarget = interactor.distanceToTarget ?? 0

    return startPoint.add(direction.uniformScale(distanceToTarget))
  }

  private cacheTransform() {
    validate(this.mapTransform)

    this.originalWorldTransform = {
      transform: this.mapTransform.getWorldTransform(),
      position: this.mapTransform.getWorldPosition(),
      rotation: this.mapTransform.getWorldRotation(),
      scale: this.mapTransform.getWorldScale()
    }

    this.originalLocalTransform = {
      transform: mat4.compose(
        this.mapTransform.getLocalPosition(),
        this.mapTransform.getLocalRotation(),
        this.mapTransform.getLocalScale()
      ),
      position: this.mapTransform.getLocalPosition(),
      rotation: this.mapTransform.getLocalRotation(),
      scale: this.mapTransform.getLocalScale()
    }
  }

  private onHoverToggle(eventData: InteractorEvent): void {
    if (!this.enabled) {
      return
    }

    // Cache the interactors on hover start/end
    this.hoveringInteractor = this.getHoveringInteractor()

    if (this.hoveringInteractor !== null) {
      log.i("On hover Start Event")
    } else {
      log.i(`On hover End Event`)
    }
  }

  private onHoverUpdate(eventData: InteractorEvent): void {
    if (!this.enabled) {
      return
    }

    if (this.hoveringInteractor !== null) {
      const hitPoint: vec3 = this.hoveringInteractor.planecastPoint
      if (hitPoint === null || hitPoint === undefined) {
        return
      }
      const localPos = this.getLocalPosition(hitPoint)
      this.mapComponent.updateHover(localPos)
    }
  }

  private onTriggerToggle(eventData: InteractorEvent): void {
    if (!this.enabled) {
      return
    }

    // Cache the interactors on trigger start/end
    this.triggeringInteractor = this.getTriggeringInteractor()

    if (this.triggeringInteractor !== null) {
      this.updateStartValues()
      const hitPoint: vec3 = this.triggeringInteractor.planecastPoint
      if (hitPoint === null || hitPoint === undefined) {
        return
      }
      const localPos = this.getLocalPosition(hitPoint)
      this.mapComponent.startTouch(localPos)

      // Scale only happens with two handed manipulation so start event firing deferred to updateStartValues()
      this.invokeEvents(this.onTranslationStartEvent)
      this.log.v("InteractionEvent : " + "On Manipulation Start Event")
    } else {
      const hitPoint: vec3 = eventData.interactor.planecastPoint
      if (hitPoint === null || hitPoint === undefined) {
        return
      }
      const localPos = this.getLocalPosition(hitPoint)
      this.mapComponent.endTouch(localPos)

      this.invokeEvents(this.onTranslationEndEvent)
      this.log.v("InteractionEvent : " + "On Manipulation End Event")
    }
  }

  private onTriggerUpdate(eventData: InteractorEvent): void {
    if (!this.enabled) {
      return
    }

    if (this.triggeringInteractor !== null) {
      this.singleInteractorTransform(this.triggeringInteractor)
    }

    // Scale only happens with two handed manipulation, so its event firing is deferred to this.dualInteractorsTransform()
    this.invokeEvents(this.onTranslationUpdateEvent)
  }

  private getHoveringInteractor(): Interactor {
    validate(this.interactable)

    const interactors: Interactor[] = this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor)

    if (interactors.length === 0) {
      this.log.w(
        `Failed to retrieve interactors on ${this.getSceneObject().name}: ${
          this.interactable.hoveringInteractor
        } (InteractorInputType)`
      )
      return null
    }

    return interactors[0]
  }

  private getTriggeringInteractor(): Interactor {
    validate(this.interactable)

    const interactors: Interactor[] = this.interactionManager.getInteractorsByType(
      this.interactable.triggeringInteractor
    )

    if (interactors.length === 0) {
      this.log.w(
        `Failed to retrieve interactors on ${this.getSceneObject().name}: ${
          this.interactable.triggeringInteractor
        } (InteractorInputType)`
      )
      return null
    }

    return interactors[0]
  }

  private invokeEvents(translateEvent: Event<TranslateEventArg> | null): void {
    validate(this.interactable)
    validate(this.mapTransform)

    if (translateEvent) {
      translateEvent.invoke({
        interactable: this.interactable,
        startPosition: this.startTransform.position,
        currentPosition: this.mapTransform.getWorldPosition()
      })
    }
  }

  private limitQuatRotation(rotation: quat): quat {
    const euler = customGetEuler(rotation)

    return quat.fromEulerVec(euler)
  }

  private isInteractorValid(interactor: Interactor): boolean {
    return (
      interactor !== null &&
      interactor.startPoint !== null &&
      interactor.orientation !== null &&
      interactor.direction !== null &&
      interactor.distanceToTarget !== null &&
      interactor.isActive()
    )
  }

  private singleInteractorTransform(interactor: Interactor): void {
    if (this.isInteractorValid(interactor) === false) {
      this.log.e("Interactor must be valid")
      return
    }
    validate(this.mapTransform)

    const startPoint = interactor.startPoint ?? vec3.zero()
    const orientation = interactor.orientation ?? quat.quatIdentity()
    const direction = interactor.direction ?? vec3.zero()

    const limitRotation = this.limitQuatRotation(orientation).multiply(this.offsetRotation)

    // Single Interactor Direct
    let newPosition: vec3

    if (this.cachedTargetingMode === TargetingMode.Direct) {
      newPosition = startPoint.add(
        limitRotation.multiply(this.startTransform.rotation.invert()).multiplyVec3(this.offsetPosition)
      )

      this.updatePosition(newPosition, this.useFilter)
    } else {
      if (this.triggeringInteractor.planecastPoint === null || this.triggeringInteractor.planecastPoint === undefined) {
        return
      }
      // Single Interactor Indirect
      this.smoothedStretch = MathUtils.lerp(
        this.smoothedStretch,
        this.calculateStretchFactor(interactor),
        getDeltaTime() * STRETCH_SMOOTH_SPEED
      )
      newPosition = this.triggeringInteractor.planecastPoint.add(direction.uniformScale(this.smoothedStretch))
      this.updatePosition(newPosition, this.useFilter)
    }
  }

  private updatePosition(newPosition: vec3 | null, useFilter = true) {
    if (newPosition === null) {
      return
    }
    validate(this.mapTransform)

    if (!this.enableXTranslation) {
      newPosition.x = this.mapTransform.getWorldPosition().x
    }
    if (!this.enableYTranslation) {
      newPosition.y = this.mapTransform.getWorldPosition().y
    }

    if (useFilter) {
      newPosition = this.translateFilter.filter(newPosition, getTime())
    }

    const localPos = this.getLocalPosition(newPosition)
    this.mapComponent.updateTouch(localPos)
  }

  private getLocalPosition(worldPosition: vec3): vec2 {
    const localPosition = this.mapTransform.getInvertedWorldTransform().multiplyPoint(worldPosition)
    return new vec2(localPosition.x / this.colliderSizeX, localPosition.y / this.colliderSizeY)
  }

  private calculateStretchFactor(interactor: Interactor): number {
    if (this.enableStretchZ === false) {
      return 1
    }
    //get distance from hand to camera along z axis only
    const startPoint = interactor.startPoint ?? vec3.zero()
    const interactorDistance = this.camera.getTransform().getInvertedWorldTransform().multiplyPoint(startPoint).z * -1

    if (this.startStretchInteractorDistance === 0) {
      this.startStretchInteractorDistance = interactorDistance
    }
    const dragAmount = interactorDistance - this.startStretchInteractorDistance

    //scale movement based on distance from ray start to object
    const currDistance = interactor.distanceToTarget ?? 0
    const distanceFactor =
      (this.zStretchFactorMax / interactor.maxRaycastDistance) * currDistance + this.zStretchFactorMin

    const minStretch = -this.offsetPosition.length + 1
    const maxStretch = -this.offsetPosition.length + interactor.maxRaycastDistance - 1

    let finalStretchAmount = MathUtils.clamp(dragAmount * distanceFactor, minStretch, maxStretch)

    if (interactor.inputType === InteractorInputType.Mobile) {
      const mobileInteractor = interactor as MobileInteractor

      let mobileDragVector = vec3.zero()
      if (mobileInteractor.touchpadDragVector !== null) {
        mobileDragVector = mobileInteractor.touchpadDragVector
      }

      const mobileMoveAmount = mobileDragVector.z === 0 ? mobileDragVector.y * MOBILE_DRAG_MULTIPLIER : 0

      this.mobileStretch += mobileMoveAmount * distanceFactor

      //dont let value accumulate out of bounds
      this.mobileStretch = Math.min(
        maxStretch - finalStretchAmount,
        Math.max(minStretch - finalStretchAmount, this.mobileStretch)
      )
      finalStretchAmount += this.mobileStretch
    }
    return finalStretchAmount
  }

  /**
   * Resets the interactable's position
   */
  resetPosition(local: boolean = false): void {
    validate(this.mapTransform)

    if (local) {
      this.mapTransform.setLocalPosition(this.originalLocalTransform.position)
    } else {
      this.mapTransform.setWorldPosition(this.originalWorldTransform.position)
    }
  }

  /**
   * Resets the interactable's rotation
   */
  resetRotation(local: boolean = false): void {
    validate(this.mapTransform)

    if (local) {
      this.mapTransform.setLocalRotation(this.originalLocalTransform.rotation)
    } else {
      this.mapTransform.setWorldRotation(this.originalWorldTransform.rotation)
    }
  }

  /**
   * Resets the interactable's transform
   */
  resetTransform(local: boolean = false): void {
    validate(this.mapTransform)

    if (local) {
      this.mapTransform.setLocalTransform(this.originalLocalTransform.transform)
    } else {
      this.mapTransform.setWorldTransform(this.originalWorldTransform.transform)
    }
  }
}
