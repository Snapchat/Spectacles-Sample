import Event, {PublicApi, unsubscribe} from "../../../Utils/Event"
import {
  Interactor,
  InteractorInputType,
  TargetingMode,
} from "../../../Core/Interactor/Interactor"
import {
  OneEuroFilterConfig,
  OneEuroFilterQuat,
  OneEuroFilterVec3,
} from "../../../Utils/OneEuroFilter"

import {Interactable} from "../Interactable/Interactable"
import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {InteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import {MobileInteractor} from "../../../Core/MobileInteractor/MobileInteractor"
import NativeLogger from "../../../Utils/NativeLogger"
import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {validate} from "../../../Utils/validate"

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

export type ScaleEventArg = {
  interactable: Interactable
  startWorldScale: vec3
  currentWorldScale: vec3
}

export type TransformEventArg = {
  interactable: Interactable
  startTransform: mat4
  currentTransform: mat4
}

export type ScaleLimitEventArg = {
  interactable: Interactable
  currentValue: vec3
}

export enum RotationAxis {
  All = "All",
  X = "X",
  Y = "Y",
  Z = "Z",
}

const TAG = "InteractableManipulation"

const MOBILE_DRAG_MULTIPLIER = 0.5
const STRETCH_SMOOTH_SPEED = 15
const YAW_NEGATIVE_90 = quat.fromEulerAngles(0, -90, 0)

const CachedTransform = {
  transform: mat4.identity(),
  position: vec3.zero(),
  rotation: quat.quatIdentity(),
  scale: vec3.one(),
}

/**
 * This class provides manipulation capabilities for interactable objects, including translation, rotation, and scaling. It allows configuration of the manipulation root, scale limits, and rotation axes.
 */
@component
export class InteractableManipulation extends BaseScriptComponent {
  @ui.group_start("Interactable Manipulation")
  @input("SceneObject")
  @hint(
    "Root SceneObject of the set of SceneObjects to manipulate. If left blank, this script's SceneObject will be treated as the root. The root's transform will be modified by this script.",
  )
  @allowUndefined
  private manipulateRootSceneObject: SceneObject | null = null
  @input
  @widget(new SliderWidget(0, 1, 0.05))
  @hint(
    "The smallest this object can scale down to, relative to its original scale. A value of 0.5 means it cannot scale smaller than 50% of its current size",
  )
  /**
   * The smallest this object can scale down to, relative to its original scale.
   * A value of 0.5 means it cannot scale smaller than 50% of its current size
   */
  minimumScaleFactor: number = 0.25
  @input
  @widget(new SliderWidget(1, 20, 0.5))
  @hint(
    "The largest this object can scale up to, relative to its original scale. A value of 2 means it cannot scale larger than twice its current size",
  )
  /**
   * The largest this object can scale up to, relative to its original scale.
   * A value of 2 means it cannot scale larger than twice its current size
   */
  maximumScaleFactor: number = 20
  @input
  private enableTranslation: boolean = true
  @input
  private enableRotation: boolean = true
  @input
  private enableScale: boolean = true
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
  @showIf("useFilter", true)
  private showFilterProperties: boolean = false
  @input
  @showIf("showFilterProperties", true)
  minCutoff: number = 2
  @input
  @showIf("showFilterProperties", true)
  beta: number = 0.015
  @input
  @showIf("showFilterProperties", true)
  dcutoff: number = 1
  @input
  showTranslationProperties: boolean = false
  @input
  @showIf("showTranslationProperties", true)
  @hint("Enable translation along the world's X-axis.")
  private _enableXTranslation: boolean = true
  @input
  @showIf("showTranslationProperties", true)
  @hint("Enable translation along the world's Y-axis.")
  private _enableYTranslation: boolean = true
  @input
  @showIf("showTranslationProperties", true)
  @hint("Enable translation along the world's Z-axis.")
  private _enableZTranslation: boolean = true

  @input
  showRotationProperties: boolean = false
  @input
  @showIf("showRotationProperties", true)
  @hint(
    "Enable rotation about all axes or a single world axis (x,y,z) when using to two hands.",
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("All", "All"),
      new ComboBoxItem("X", "X"),
      new ComboBoxItem("Y", "Y"),
      new ComboBoxItem("Z", "Z"),
    ]),
  )
  private _rotationAxis: string = "All"
  @ui.group_end
  private defaultFilterConfig: OneEuroFilterConfig | undefined
  private camera = WorldCameraFinderProvider.getInstance()
  private interactionManager = InteractionManager.getInstance()

  // Keep track of "Unsubscribe" functions when adding callbacks to Interactable Events, to ensure proper cleanup on destroy
  private unsubscribeBag: unsubscribe[] = []

  private interactable: Interactable | null = null

  // Native Logging
  private log = new NativeLogger(TAG)

  // If the manipulate parent is set, use that SceneObject's transform, otherwise use the transform of the script's SceneObject.
  // This is useful when using an external object to move other objects (e.g. grab bar).
  private manipulateRoot: Transform | undefined

  private originalWorldTransform = CachedTransform
  private originalLocalTransform = CachedTransform

  private startTransform = CachedTransform

  private offsetPosition = vec3.zero()
  private offsetRotation = quat.quatIdentity()
  private initialInteractorDistance = 0

  private startStretchInteractorDistance = 0
  private mobileStretch = 0
  private smoothedStretch = 0

  private initialObjectScale = vec3.zero()

  private hitPointToTransform = vec3.zero()

  private interactors: Interactor[] = []

  private cachedTargetingMode: TargetingMode = TargetingMode.None

  // Used to avoid gimbal lock when crossing the Y-axis during single-axis manipulation.
  private currentRotationSign = 0
  private currentUp = vec3.zero()

  /**
   * - HandTracking's OneEuroFilter does not support quaternions.
   * - Quaternions need to use slerp to interpolate correctly, which
   * is not currently supported by the filter function.
   * - SampleOps that HandTracking OneEuroFilter uses has functions that
   * are not supported by quaternions (such as magnitude or addition)
   */
  private translateFilter!: OneEuroFilterVec3
  private rotationFilter!: OneEuroFilterQuat
  private scaleFilter!: OneEuroFilterVec3

  /**
   * Gets the transform of the root of the manipulated object(s).
   */
  getManipulateRoot(): Transform | undefined {
    return this.manipulateRoot
  }

  /**
   * Sets the transform of the passed SceneObject as the root of the manipulated object(s).
   */
  setManipulateRoot(root: Transform): void {
    this.manipulateRoot = root
  }

  /**
   * Returns true translation is enabled
   */
  canTranslate(): boolean {
    return this.enableTranslation
  }

  /**
   * Toggle for allowing an object to translate
   */
  setCanTranslate(enabled: boolean): void {
    this.enableTranslation = enabled
  }

  /**
   * Returns true if any of rotation x, y, or z is enabled
   */
  canRotate(): boolean {
    return this.enableRotation
  }

  /**
   * Toggle for allowing an object to rotate
   */
  setCanRotate(enabled: boolean): void {
    this.enableRotation = enabled
  }

  /**
   * Returns true if any of scale x, y, or z is enabled
   */
  canScale(): boolean {
    return this.enableScale
  }

  /**
   * Toggle for allowing an object to scale
   */
  setCanScale(enabled: boolean): void {
    this.enableScale = enabled
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

  /**
   * Set if translation along world Z-axis is enabled.
   */
  set enableZTranslation(enabled: boolean) {
    this._enableZTranslation = enabled
  }

  /**
   * Returns if translation along world Z-axis is enabled.
   */
  get enableZTranslation(): boolean {
    return this._enableZTranslation
  }

  /**
   * Set if rotation occurs about all axes or a single world axis (x,y,z) when using to two hands.
   */
  set rotationAxis(axis: RotationAxis) {
    this._rotationAxis = axis
  }

  /**
   * Get if rotation occurs about all axes or a single world axis (x,y,z) when using to two hands..
   */
  get rotationAxis(): RotationAxis {
    return this._rotationAxis as RotationAxis
  }

  // Callbacks
  private onTranslationStartEvent = new Event<TranslateEventArg>()
  /**
   * Callback for when translation begins
   */
  onTranslationStart: PublicApi<TranslateEventArg> =
    this.onTranslationStartEvent.publicApi()

  private onTranslationUpdateEvent = new Event<TranslateEventArg>()
  /**
   * Callback for when translation updates each frame
   */
  onTranslationUpdate: PublicApi<TranslateEventArg> =
    this.onTranslationUpdateEvent.publicApi()

  private onTranslationEndEvent = new Event<TranslateEventArg>()
  /**
   * Callback for when translation has ended
   */
  onTranslationEnd: PublicApi<TranslateEventArg> =
    this.onTranslationEndEvent.publicApi()

  private onRotationStartEvent = new Event<RotationEventArg>()
  /**
   * Callback for when rotation begins
   */
  onRotationStart: PublicApi<RotationEventArg> =
    this.onRotationStartEvent.publicApi()

  private onRotationUpdateEvent = new Event<RotationEventArg>()
  /**
   * Callback for when rotation updates each frame
   */
  onRotationUpdate: PublicApi<RotationEventArg> =
    this.onRotationUpdateEvent.publicApi()

  private onRotationEndEvent = new Event<RotationEventArg>()
  /**
   * Callback for when rotation has ended
   */
  onRotationEnd: PublicApi<RotationEventArg> =
    this.onRotationEndEvent.publicApi()

  private onScaleLimitReachedEvent = new Event<ScaleLimitEventArg>()
  /**
   * Callback for when scale has reached the minimum or maximum limit
   */
  onScaleLimitReached: PublicApi<ScaleLimitEventArg> =
    this.onScaleLimitReachedEvent.publicApi()

  private onScaleStartEvent = new Event<ScaleEventArg>()
  /**
   * Callback for when scale begins
   */
  onScaleStart: PublicApi<ScaleEventArg> = this.onScaleStartEvent.publicApi()

  private onScaleUpdateEvent = new Event<ScaleEventArg>()
  /**
   * Callback for when scale updates each frame
   */
  onScaleUpdate: PublicApi<ScaleEventArg> = this.onScaleUpdateEvent.publicApi()

  private onScaleEndEvent = new Event<ScaleEventArg>()
  /**
   * Callback for when scale has ended
   */
  onScaleEnd: PublicApi<ScaleEventArg> = this.onScaleEndEvent.publicApi()

  private onManipulationStartEvent = new Event<TransformEventArg>()
  /**
   * Callback for when any manipulation begins
   */
  onManipulationStart: PublicApi<TransformEventArg> =
    this.onManipulationStartEvent.publicApi()

  private onManipulationUpdateEvent = new Event<TransformEventArg>()
  /**
   * Callback for when any manipulation updates
   */
  onManipulationUpdate: PublicApi<TransformEventArg> =
    this.onManipulationUpdateEvent.publicApi()

  private onManipulationEndEvent = new Event<TransformEventArg>()
  /**
   * Callback for when any manipulation ends
   */
  onManipulationEnd: PublicApi<TransformEventArg> =
    this.onManipulationEndEvent.publicApi()

  onAwake(): void {
    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName(),
    )

    if (this.interactable === null) {
      throw new Error(
        "InteractableManipulation requires an interactable to function.",
      )
    }

    this.setManipulateRoot(
      !isNull(this.manipulateRootSceneObject)
        ? this.manipulateRootSceneObject!.getTransform()
        : this.getTransform(),
    )

    this.createEvent("OnDestroyEvent").bind(() => this.onDestroy())
    this.cacheTransform()
    this.setupCallbacks()

    this.defaultFilterConfig = {
      frequency: 60, //fps
      minCutoff: this.minCutoff,
      beta: this.beta,
      dcutoff: this.dcutoff,
    }

    this.translateFilter = new OneEuroFilterVec3(this.defaultFilterConfig)
    this.rotationFilter = new OneEuroFilterQuat(this.defaultFilterConfig)
    this.scaleFilter = new OneEuroFilterVec3(this.defaultFilterConfig)
  }

  private onDestroy(): void {
    // If we don't unsubscribe, component will keep working after destroy() due to event callbacks added to Interactable Events
    this.unsubscribeBag.forEach((unsubscribeCallback: unsubscribe) => {
      unsubscribeCallback()
    })
    this.unsubscribeBag = []
  }

  private setupCallbacks(): void {
    validate(this.interactable)

    this.unsubscribeBag.push(
      this.interactable.onInteractorTriggerStart.add((event) => {
        if (
          event.propagationPhase === "Target" ||
          event.propagationPhase === "BubbleUp"
        ) {
          event.stopPropagation()
          this.onTriggerToggle(event)
        }
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onTriggerUpdate.add((event) => {
        if (
          event.propagationPhase === "Target" ||
          event.propagationPhase === "BubbleUp"
        ) {
          event.stopPropagation()
          this.onTriggerUpdate(event)
        }
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onTriggerCanceled.add((event) => {
        if (
          event.propagationPhase === "Target" ||
          event.propagationPhase === "BubbleUp"
        ) {
          event.stopPropagation()
          this.onTriggerToggle(event)
        }
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onInteractorTriggerEnd.add((event) => {
        if (
          event.propagationPhase === "Target" ||
          event.propagationPhase === "BubbleUp"
        ) {
          event.stopPropagation()
          this.onTriggerToggle(event)
        }
      }),
    )
  }

  private updateStartValues(): void {
    validate(this.manipulateRoot)
    validate(this.interactable)

    const interactors: Interactor[] = this.getTriggeringInteractors()

    this.mobileStretch = 0
    this.smoothedStretch = 0
    this.startStretchInteractorDistance = 0

    // Reset filters
    this.translateFilter.reset()
    this.rotationFilter.reset()
    this.scaleFilter.reset()

    // Set the starting transform values to be used for callbacks
    this.startTransform = {
      transform: this.manipulateRoot.getWorldTransform(),
      position: this.manipulateRoot.getWorldPosition(),
      rotation: this.manipulateRoot.getWorldRotation(),
      scale: this.manipulateRoot.getWorldScale(),
    }

    const cameraPosition = this.camera.getTransform().getWorldPosition()
    const cameraRotation = this.camera.getTransform().getWorldRotation()

    if (interactors.length === 1) {
      const interactor = interactors[0]
      if (this.isInteractorValid(interactor) === false) {
        this.log.e("Interactor must not be valid for setting initial values")
        return
      }

      const startPoint = interactor.startPoint ?? vec3.zero()
      const orientation = interactor.orientation ?? quat.quatIdentity()

      this.cachedTargetingMode = interactor.activeTargetingMode

      if (interactor.activeTargetingMode === TargetingMode.Direct) {
        this.offsetPosition = this.startTransform.position.sub(startPoint)
        this.offsetRotation = orientation
          .invert()
          .multiply(this.startTransform.rotation)
      } else {
        const rayPosition = this.getRayPosition(interactor)

        this.offsetPosition = rayPosition.sub(startPoint)
        this.hitPointToTransform = this.startTransform.position.sub(rayPosition)
        this.offsetRotation = cameraRotation
          .invert()
          .multiply(this.startTransform.rotation)
      }
    } else if (interactors.length === 2) {
      if (
        this.isInteractorValid(interactors[0]) === false ||
        this.isInteractorValid(interactors[1]) === false
      ) {
        this.log.e("Both interactors must be valid for setting initial values")
        return
      }

      const isDirect =
        interactors[0].activeTargetingMode === TargetingMode.Direct ||
        interactors[1].activeTargetingMode === TargetingMode.Direct
      this.cachedTargetingMode = isDirect
        ? TargetingMode.Direct
        : TargetingMode.Indirect

      const firstStartPoint = interactors[0].startPoint ?? vec3.zero()
      const secondStartPoint = interactors[1].startPoint ?? vec3.zero()

      const interactorMidPoint = firstStartPoint
        .add(secondStartPoint)
        .uniformScale(0.5)

      this.currentUp = vec3.up()
      this.currentRotationSign = 0
      const dualInteractorDirection = this.getDualInteractorDirection(
        interactors[0],
        interactors[1],
      )

      this.initialInteractorDistance =
        firstStartPoint.distance(secondStartPoint)
      this.initialObjectScale = this.manipulateRoot.getLocalScale()
      this.onScaleStartEvent.invoke({
        interactable: this.interactable,
        startWorldScale: this.startTransform.scale,
        currentWorldScale: this.manipulateRoot.getWorldScale(),
      })

      if (dualInteractorDirection === null) {
        return
      }

      this.offsetRotation = dualInteractorDirection
        .invert()
        .multiply(this.startTransform.rotation)

      if (isDirect) {
        this.offsetPosition =
          this.startTransform.position.sub(interactorMidPoint)
      } else {
        const firstRayPosition = this.getRayPosition(interactors[0])
        const secondRayPosition = this.getRayPosition(interactors[1])
        const dualRayPosition = firstRayPosition
          .add(secondRayPosition)
          .uniformScale(0.5)

        this.offsetPosition = dualRayPosition.sub(interactorMidPoint)
        this.hitPointToTransform =
          this.startTransform.position.sub(dualRayPosition)
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
    validate(this.manipulateRoot)

    this.originalWorldTransform = {
      transform: this.manipulateRoot.getWorldTransform(),
      position: this.manipulateRoot.getWorldPosition(),
      rotation: this.manipulateRoot.getWorldRotation(),
      scale: this.manipulateRoot.getWorldScale(),
    }

    this.originalLocalTransform = {
      transform: mat4.compose(
        this.manipulateRoot.getLocalPosition(),
        this.manipulateRoot.getLocalRotation(),
        this.manipulateRoot.getLocalScale(),
      ),
      position: this.manipulateRoot.getLocalPosition(),
      rotation: this.manipulateRoot.getLocalRotation(),
      scale: this.manipulateRoot.getLocalScale(),
    }
  }

  private onTriggerToggle(eventData: InteractorEvent): void {
    if (
      !this.enabled ||
      (!this.canTranslate() && !this.canRotate() && !this.canScale())
    ) {
      return
    }

    // Cache the interactors on trigger start/end
    this.interactors = this.getTriggeringInteractors()

    if (this.interactors.length > 0) {
      this.updateStartValues()
      // Scale only happens with two handed manipulation so start event firing deferred to updateStartValues()
      this.invokeEvents(
        this.onTranslationStartEvent,
        this.onRotationStartEvent,
        null,
        this.onManipulationStartEvent,
      )
      this.log.v("InteractionEvent : " + "On Manipulation Start Event")
    } else {
      this.invokeEvents(
        this.onTranslationEndEvent,
        this.onRotationEndEvent,
        this.onScaleEndEvent,
        this.onManipulationEndEvent,
      )
      this.log.v("InteractionEvent : " + "On Manipulation End Event")
    }
  }

  private onTriggerUpdate(eventData: InteractorEvent): void {
    if (
      !this.enabled ||
      (!this.canTranslate() && !this.canRotate() && !this.canScale())
    ) {
      return
    }

    if (this.interactors.length === 1) {
      this.singleInteractorTransform(this.interactors[0])
    } else if (this.interactors.length === 2) {
      this.dualInteractorsTransform(this.interactors)
    } else {
      this.log.w(
        `${this.interactors.length} interactors found for onTriggerUpdate. This is not supported.`,
      )
      return
    }

    // Scale only happens with two handed manipulation, so its event firing is deferred to this.dualInteractorsTransform()
    this.invokeEvents(
      this.onTranslationUpdateEvent,
      this.onRotationUpdateEvent,
      null,
      this.onManipulationUpdateEvent,
    )
  }

  private getTriggeringInteractors(): Interactor[] {
    validate(this.interactable)

    const interactors: Interactor[] =
      this.interactionManager.getInteractorsByType(
        this.interactable.triggeringInteractor,
      )

    if (interactors === null) {
      this.log.w(
        `Failed to retrieve interactors on ${this.getSceneObject().name}: ${
          this.interactable.triggeringInteractor
        } (InteractorInputType)`,
      )
      return []
    }

    return interactors
  }

  private invokeEvents(
    translateEvent: Event<TranslateEventArg> | null,
    rotationEvent: Event<RotationEventArg> | null,
    scaleEvent: Event<ScaleEventArg> | null,
    manipulationEvent: Event<TransformEventArg> | null,
  ): void {
    validate(this.interactable)
    validate(this.manipulateRoot)

    if (this.canTranslate() && translateEvent) {
      translateEvent.invoke({
        interactable: this.interactable,
        startPosition: this.startTransform.position,
        currentPosition: this.manipulateRoot.getWorldPosition(),
      })
    }

    if (this.canRotate() && rotationEvent) {
      rotationEvent.invoke({
        interactable: this.interactable,
        startRotation: this.startTransform.rotation,
        currentRotation: this.manipulateRoot.getWorldRotation(),
      })
    }

    if (this.canScale() && scaleEvent) {
      scaleEvent.invoke({
        interactable: this.interactable,
        startWorldScale: this.startTransform.scale,
        currentWorldScale: this.manipulateRoot.getWorldScale(),
      })
    }

    if (
      (this.canTranslate() || this.canRotate() || this.canScale()) &&
      manipulationEvent
    ) {
      manipulationEvent.invoke({
        interactable: this.interactable,
        startTransform: this.startTransform.transform,
        currentTransform: this.manipulateRoot.getWorldTransform(),
      })
    }
  }

  private getDualInteractorDirection(
    interactor1: Interactor,
    interactor2: Interactor,
  ): quat | null {
    if (
      interactor1 === null ||
      interactor1.startPoint === null ||
      interactor2 === null ||
      interactor2.startPoint === null
    ) {
      this.log.e(
        "Interactors and their start points should not be null for getDualInteractorDirection",
      )
      return null
    }

    let point1 = interactor1.startPoint
    let point2 = interactor2.startPoint
    let sign: number = 0

    // Handle single axis rotation by projecting the start points onto plane.
    if (this.rotationAxis !== RotationAxis.All) {
      let axis: vec3
      switch (this.rotationAxis) {
        case RotationAxis.X:
          axis = vec3.right()
          break
        case RotationAxis.Y:
          axis = vec3.up()
          break
        case RotationAxis.Z:
          axis = vec3.forward()
          break
      }
      // When rotating about a single axis, project the start points onto the plane defined by that axis to calculate rotation about that axis.
      point1 = point1.projectOnPlane(axis)
      point2 = point2.projectOnPlane(axis)

      if (this.rotationAxis === RotationAxis.X) {
        sign = Math.sign(point2.z - point1.z)
      } else if (this.rotationAxis === RotationAxis.Z) {
        sign = Math.sign(point2.x - point1.x)
      }
    }

    // For X and Z rotation, flip the 'up' orientation of the rotation when the vector between the projected points crosses the Y-axis.
    if (sign !== this.currentRotationSign) {
      this.currentUp = this.currentUp.uniformScale(-1)
      this.currentRotationSign = sign
    }

    // Get the direction from the two palm points, rotate yaw 90 degrees to get forward direction
    const rotation = quat
      .lookAt(point2.sub(point1), this.currentUp)
      .multiply(YAW_NEGATIVE_90)

    const currentRotation = this.limitQuatRotation(rotation)

    return currentRotation
  }

  private limitQuatRotation(rotation: quat): quat {
    let euler = rotation.toEulerAngles()

    if (!this.canRotate()) {
      euler.x = 0
      euler.y = 0
      euler.z = 0
    }

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
    validate(this.manipulateRoot)

    const startPoint = interactor.startPoint ?? vec3.zero()
    const orientation = interactor.orientation ?? quat.quatIdentity()
    const direction = interactor.direction ?? vec3.zero()

    const limitRotation = this.limitQuatRotation(orientation).multiply(
      this.offsetRotation,
    )
    // Do not rotate the object if using a single Interactor for single axis usecase.
    let deltaRotation =
      this.rotationAxis === RotationAxis.All
        ? limitRotation.multiply(
            this.manipulateRoot.getWorldRotation().invert(),
          )
        : quat.quatIdentity()

    // Single Interactor Direct
    if (this.enableTranslation) {
      let newPosition: vec3 | null

      if (this.cachedTargetingMode === TargetingMode.Direct) {
        newPosition = startPoint.add(
          this.canRotate()
            ? limitRotation
                .multiply(this.startTransform.rotation.invert())
                .multiplyVec3(this.offsetPosition)
            : this.offsetPosition,
        )

        this.updatePosition(newPosition, this.useFilter)
      } else {
        // Single Interactor Indirect
        this.smoothedStretch = MathUtils.lerp(
          this.smoothedStretch,
          this.calculateStretchFactor(interactor),
          getDeltaTime() * STRETCH_SMOOTH_SPEED,
        )
        const offset = direction
          .uniformScale(this.offsetPosition.length)
          .add(this.hitPointToTransform)
        newPosition = startPoint
          .add(offset)
          .add(direction.uniformScale(this.smoothedStretch))
        this.updatePosition(newPosition, this.useFilter)

        deltaRotation = quat.quatIdentity()
      }
    }

    if (this.canRotate()) {
      if (this.cachedTargetingMode === TargetingMode.Direct) {
        const newRotation = deltaRotation.multiply(
          this.manipulateRoot.getWorldRotation(),
        )
        this.updateRotation(newRotation, this.useFilter)
      }
    }
  }

  private dualInteractorsTransform(interactors: Interactor[]): void {
    if (
      interactors.length < 2 ||
      !this.isInteractorValid(interactors[0]) ||
      !this.isInteractorValid(interactors[1])
    ) {
      this.log.e(
        "There should be two valid interactors for dualInteractorsTransform",
      )
    }
    validate(this.manipulateRoot)
    validate(this.interactable)

    const isDirect = this.cachedTargetingMode === TargetingMode.Direct

    const startPoint1 = interactors[0].startPoint
    const startPoint2 = interactors[1].startPoint

    if (startPoint1 === null || startPoint2 === null) {
      this.log.e(
        "Both start points should be valid for dualInteractorsTransform",
      )
      return
    }

    const interactorMidPoint = startPoint1.add(startPoint2).uniformScale(0.5)
    const dualDirection = this.getDualInteractorDirection(
      interactors[0],
      interactors[1],
    )

    if (dualDirection === null) {
      return
    }

    const dualDistance = startPoint1.distance(startPoint2)

    if (this.canRotate()) {
      const newRotation = dualDirection.multiply(this.offsetRotation)
      this.updateRotation(newRotation, this.useFilter)
    }

    if (this.enableTranslation) {
      let newPosition: vec3 | null

      // Dual Interactor Direct
      if (isDirect) {
        newPosition =
          this.canRotate() && isDirect
            ? interactorMidPoint.add(
                this.manipulateRoot
                  .getWorldRotation()
                  .multiply(this.startTransform.rotation.invert())
                  .multiplyVec3(this.offsetPosition),
              )
            : interactorMidPoint.add(this.offsetPosition)
        this.updatePosition(newPosition, this.useFilter)
      } else {
        // Dual Interactor Indirect
        const dualRaycastDistance =
          (interactors[0].maxRaycastDistance +
            interactors[1].maxRaycastDistance) *
          0.5
        const zDistance = Math.min(
          dualRaycastDistance,
          this.offsetPosition.length,
        )

        const direction1 = interactors[0].direction ?? vec3.zero()
        const direction2 = interactors[1].direction ?? vec3.zero()
        const dualDirection = direction1.add(direction2).uniformScale(0.5)

        let finalOffset = dualDirection
          .uniformScale(zDistance)
          .add(this.hitPointToTransform)
        newPosition = interactorMidPoint.add(finalOffset)
        this.updatePosition(newPosition, this.useFilter)
      }
    }

    if (this.canScale() && this.initialInteractorDistance !== 0) {
      const distanceDifference = dualDistance - this.initialInteractorDistance

      /*
       * Calculate the scaling factor based on the distanceDifference and the initialInteractorDistance.
       * This factor will be used to uniformly scale the object based on the change in distance.
       */
      const uniformScalingFactor =
        1 + distanceDifference / this.initialInteractorDistance

      const updatedObjectScale =
        this.initialObjectScale.uniformScale(uniformScalingFactor)

      this.setScale(updatedObjectScale, this.useFilter)

      this.onScaleUpdateEvent.invoke({
        interactable: this.interactable,
        startWorldScale: this.startTransform.scale,
        currentWorldScale: this.manipulateRoot.getWorldScale(),
      })
    }
  }

  private updatePosition(newPosition: vec3 | null, useFilter = true) {
    if (newPosition === null) {
      return
    }
    validate(this.manipulateRoot)

    if (!this.enableXTranslation) {
      newPosition.x = this.manipulateRoot.getWorldPosition().x
    }
    if (!this.enableYTranslation) {
      newPosition.y = this.manipulateRoot.getWorldPosition().y
    }
    if (!this.enableZTranslation) {
      newPosition.z = this.manipulateRoot.getWorldPosition().z
    }

    if (useFilter) {
      newPosition = this.translateFilter.filter(newPosition, getTime())
    }

    this.manipulateRoot.setWorldPosition(newPosition)
  }

  private updateRotation(newRotation: quat | null, useFilter = true) {
    if (newRotation === null) {
      return
    }
    validate(this.manipulateRoot)

    if (useFilter) {
      newRotation = this.rotationFilter.filter(newRotation, getTime())
    }

    this.manipulateRoot.setWorldRotation(newRotation)
  }

  private calculateStretchFactor(interactor: Interactor): number {
    if (this.enableStretchZ === false) {
      return 1
    }
    //get distance from hand to camera along z axis only
    const startPoint = interactor.startPoint ?? vec3.zero()
    const interactorDistance =
      this.camera
        .getTransform()
        .getInvertedWorldTransform()
        .multiplyPoint(startPoint).z * -1

    if (this.startStretchInteractorDistance === 0) {
      this.startStretchInteractorDistance = interactorDistance
    }
    const dragAmount = interactorDistance - this.startStretchInteractorDistance

    //scale movement based on distance from ray start to object
    const currDistance = interactor.distanceToTarget ?? 0
    const distanceFactor =
      (this.zStretchFactorMax / interactor.maxRaycastDistance) * currDistance +
      this.zStretchFactorMin

    const minStretch = -this.offsetPosition.length + 1
    const maxStretch =
      -this.offsetPosition.length + interactor.maxRaycastDistance - 1

    let finalStretchAmount = MathUtils.clamp(
      dragAmount * distanceFactor,
      minStretch,
      maxStretch,
    )

    if (interactor.inputType === InteractorInputType.Mobile) {
      const mobileInteractor = interactor as MobileInteractor

      let mobileDragVector = vec3.zero()
      if (mobileInteractor.touchpadDragVector !== null) {
        mobileDragVector = mobileInteractor.touchpadDragVector
      }

      const mobileMoveAmount =
        mobileDragVector.z === 0
          ? mobileDragVector.y * MOBILE_DRAG_MULTIPLIER
          : 0

      this.mobileStretch += mobileMoveAmount * distanceFactor

      //dont let value accumulate out of bounds
      this.mobileStretch = Math.min(
        maxStretch - finalStretchAmount,
        Math.max(minStretch - finalStretchAmount, this.mobileStretch),
      )
      finalStretchAmount += this.mobileStretch
    }
    return finalStretchAmount
  }

  private clampUniformScale(scale: vec3, minScale: vec3, maxScale: vec3): vec3 {
    let finalScale = scale

    /*
     * Calculate the ratios between the input scale and the min and max scales
     * for each axis (x, y, z). These ratios indicate how close the input scale
     * is to the min or max scale limits.
     */
    const minRatio = Math.min(
      scale.x / minScale.x,
      scale.y / minScale.y,
      scale.z / minScale.z,
    )
    const maxRatio = Math.min(
      scale.x / maxScale.x,
      scale.y / maxScale.y,
      scale.z / maxScale.z,
    )

    /*
     * If the minRatio is less than 1, it means at least one axis of the input
     * scale is smaller than the corresponding axis of the minScale. To preserve
     * the uniform scaling, apply a uniform scaling factor (1 / minRatio) to the
     * input scale, effectively scaling it up just enough to meet the minScale
     * limit on the smallest axis.
     */
    if (minRatio < 1) {
      finalScale = finalScale.uniformScale(1 / minRatio)
    }

    /*
     * If the maxRatio is greater than 1, it means at least one axis of the input
     * scale is larger than the corresponding axis of the maxScale. To preserve
     * the uniform scaling, apply a uniform scaling factor (1 / maxRatio) to the
     * input scale, effectively scaling it down just enough to meet the maxScale
     * limit on the largest axis.
     */
    if (maxRatio > 1) {
      finalScale = finalScale.uniformScale(1 / maxRatio)
    }

    return finalScale
  }

  private setScale(newScale: vec3, useFilter = true): void {
    if (!this.canScale()) {
      return
    }
    validate(this.interactable)
    validate(this.manipulateRoot)

    // Calculate min and max scale
    const minScale = this.originalLocalTransform.scale.uniformScale(
      this.minimumScaleFactor,
    )
    const maxScale = this.originalLocalTransform.scale.uniformScale(
      this.maximumScaleFactor,
    )

    // Calculate final scale
    let finalScale = this.clampUniformScale(newScale, minScale, maxScale)

    if (newScale !== finalScale) {
      this.onScaleLimitReachedEvent.invoke({
        interactable: this.interactable,
        currentValue: finalScale,
      })
    }
    if (useFilter) {
      finalScale = this.scaleFilter.filter(finalScale, getTime())
    }

    this.manipulateRoot.setLocalScale(finalScale)
  }

  /**
   * Resets the interactable's position
   */
  resetPosition(local: boolean = false): void {
    validate(this.manipulateRoot)

    if (local) {
      this.manipulateRoot.setLocalPosition(this.originalLocalTransform.position)
    } else {
      this.manipulateRoot.setWorldPosition(this.originalWorldTransform.position)
    }
  }

  /**
   * Resets the interactable's rotation
   */
  resetRotation(local: boolean = false): void {
    validate(this.manipulateRoot)

    if (local) {
      this.manipulateRoot.setLocalRotation(this.originalLocalTransform.rotation)
    } else {
      this.manipulateRoot.setWorldRotation(this.originalWorldTransform.rotation)
    }
  }

  /**
   * Resets the interactable's scale
   */
  resetScale(local: boolean = false): void {
    validate(this.manipulateRoot)

    if (local) {
      this.manipulateRoot.setLocalScale(this.originalLocalTransform.scale)
    } else {
      this.manipulateRoot.setWorldScale(this.originalWorldTransform.scale)
    }
  }

  /**
   * Resets the interactable's transform
   */
  resetTransform(local: boolean = false): void {
    validate(this.manipulateRoot)

    if (local) {
      this.manipulateRoot.setLocalTransform(
        this.originalLocalTransform.transform,
      )
    } else {
      this.manipulateRoot.setWorldTransform(
        this.originalWorldTransform.transform,
      )
    }
  }
}
