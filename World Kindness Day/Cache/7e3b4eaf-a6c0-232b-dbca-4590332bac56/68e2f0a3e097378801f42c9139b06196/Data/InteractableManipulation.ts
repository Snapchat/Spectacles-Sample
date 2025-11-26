import {
  Interactor,
  InteractorInputType,
  InteractorTriggerType,
  TargetingMode
} from "../../../Core/Interactor/Interactor"
import Event, {PublicApi, unsubscribe} from "../../../Utils/Event"
import {OneEuroFilterConfig, OneEuroFilterQuat, OneEuroFilterVec3} from "../../../Utils/OneEuroFilter"

import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {InteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import {MobileInteractor} from "../../../Core/MobileInteractor/MobileInteractor"
import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import NativeLogger from "../../../Utils/NativeLogger"
import StateMachine from "../../../Utils/StateMachine"
import {SyncKitBridge} from "../../../Utils/SyncKitBridge"
import {validate} from "../../../Utils/validate"
import {ContainerFrame} from "../../UI/ContainerFrame/ContainerFrame"
import {Interactable} from "../Interactable/Interactable"

export type TranslateEventArg = {
  interactors: Interactor[]
  interactable: Interactable
  startPosition: vec3
  currentPosition: vec3
}

export type RotationEventArg = {
  interactors: Interactor[]
  interactable: Interactable
  startRotation: quat
  currentRotation: quat
}

export type ScaleEventArg = {
  interactors: Interactor[]
  interactable: Interactable
  startWorldScale: vec3
  currentWorldScale: vec3
}

export type TransformEventArg = {
  interactors: Interactor[]
  interactable: Interactable
  startTransform: mat4
  currentTransform: mat4
}

export type ScaleLimitEventArg = {
  interactors: Interactor[]
  interactable: Interactable
  currentValue: vec3
}

export enum RotationAxis {
  All = "All",
  X = "X",
  Y = "Y",
  Z = "Z"
}

const TAG = "InteractableManipulation"

const MOBILE_DRAG_MULTIPLIER = 0.5
const STRETCH_SMOOTH_SPEED = 15
const YAW_NEGATIVE_90 = quat.fromEulerAngles(0, -90, 0)
const MAX_USER_ARM_EXTENSION_CM = 100
const MIN_DRAG_DISTANCE_CM = 0.0001 // Setting this > 0 to avoid division by 0

const MANIPULATION_VALUE_KEY = "ManipulationValue"

const CachedTransform = {
  transform: mat4.identity(),
  position: vec3.zero(),
  rotation: quat.quatIdentity(),
  scale: vec3.one()
}

interface CapabilitiesState {
  enabled: boolean
  canTranslate: boolean
  canRotate: boolean
  canScale: boolean
}

interface ActiveEvents {
  translation: boolean
  rotation: boolean
  scale: boolean
  manipulation: boolean
}

interface StateMachineData {
  stateMachine: StateMachine
  triggeringInteractors: Interactor[]
  previousCapabilitiesState: CapabilitiesState
  activeEvents: ActiveEvents
  states: {
    Idle: string
    Active: string
  }
  signals: {
    StartManipulation: string
    EndManipulation: string
    ChangeInteractors: string
    CapabilitiesChanged: string
  }
}

/**
 * This class provides manipulation capabilities for interactable objects, including translation, rotation, and
 * scaling. It allows configuration of the manipulation root, scale limits, and rotation axes.
 */
@component
export class InteractableManipulation extends BaseScriptComponent {
  @ui.group_start("Interactable Manipulation")
  @hint(
    "Manipulation capability settings for interactable objects, including translation, rotation, and scaling. \
Allows configuration of the manipulation root, scale limits, and rotation axes."
  )
  /**
   * Root SceneObject of the set of SceneObjects to manipulate. If left blank, this script's SceneObject will be
   * treated as the root. The root's transform will be modified by this script.
   */
  @input("SceneObject")
  @hint(
    "Root SceneObject of the set of SceneObjects to manipulate. If left blank, this script's SceneObject will be \
treated as the root. The root's transform will be modified by this script."
  )
  @allowUndefined
  private manipulateRootSceneObject: SceneObject | null = null
  /**
   * The smallest this object can scale down to, relative to its original scale.
   * A value of 0.5 means it cannot scale smaller than 50% of its original size.
   */
  @input
  @widget(new SliderWidget(0, 1, 0.05))
  @hint(
    "The smallest this object can scale down to, relative to its original scale. A value of 0.5 means it cannot scale \
smaller than 50% of its original size."
  )
  minimumScaleFactor: number = 0.25
  /**
   * The largest this object can scale up to, relative to its original scale.
   * A value of 2 means it cannot scale larger than twice its original size.
   */
  @input
  @widget(new SliderWidget(1, 20, 0.5))
  @hint(
    "The largest this object can scale up to, relative to its original scale. A value of 2 means it cannot scale \
larger than twice its original size."
  )
  maximumScaleFactor: number = 20
  /**
   * Controls whether the object can be moved (translated) in space.
   */
  @input
  @hint("Controls whether the object can be moved (translated) in space.")
  private enableTranslation: boolean = true
  /**
   * Controls whether the object can be rotated in space.
   */
  @input
  @hint("Controls whether the object can be rotated in space.")
  private enableRotation: boolean = true
  /**
   * Controls whether the object can be scaled in size.
   */
  @input
  @hint("Controls whether the object can be scaled in size.")
  private enableScale: boolean = true
  /**
   * Enhances depth manipulation by applying a distance-based multiplier to Z-axis movement.
   * When enabled, objects that are farther away will move greater distances with the same hand movement,
   * making it easier to position distant objects without requiring excessive physical reach.
   */
  @input
  @hint(
    "Enhances depth manipulation by applying a distance-based multiplier to Z-axis movement. When enabled, \
objects that are farther away will move greater distances with the same hand movement, making it easier to position \
distant objects without requiring excessive physical reach."
  )
  enableStretchZ: boolean = true
  /**
   * Controls the visibility of advanced Z-stretch configuration options in the Inspector. When enabled, shows
   * additional properties that fine-tune the distance-based Z-axis movement multiplier (Z Stretch Factor Min and
   * Z Stretch Factor Max).
   */
  @input
  @showIf("enableStretchZ", true)
  @hint(
    "Controls the visibility of advanced Z-stretch configuration options in the Inspector. When enabled, shows \
additional properties that fine-tune the distance-based Z-axis movement multiplier (Z Stretch Factor Min and \
Z Stretch Factor Max)."
  )
  showStretchZProperties: boolean = false
  /**
   * The minimum multiplier applied to Z-axis movement when using stretch mode.
   * This value is used when objects are close to the user.
   * Higher values result in more responsive depth movement for nearby objects.
   */
  @input
  @showIf("showStretchZProperties", true)
  @hint(
    "The minimum multiplier applied to Z-axis movement when using stretch mode. This value is used when objects are \
close to the user. Higher values result in more responsive depth movement for nearby objects."
  )
  zStretchFactorMin: number = 1.0
  /**
   * The maximum multiplier applied to Z-axis movement when using stretch mode.
   * This value is used when objects are far away from the user.
   * Higher values allow faster positioning of distant objects with minimal hand movement.
   */
  @input
  @showIf("showStretchZProperties", true)
  @hint(
    "The maximum multiplier applied to Z-axis movement when using stretch mode. This value is used when objects are \
far away from the user. Higher values allow faster positioning of distant objects with minimal hand movement."
  )
  zStretchFactorMax: number = 12.0
  /**
   * Applies filtering to smooth object manipulation movement. When enabled, a one-euro filter is applied to reduce
   * jitter and make translations, rotations, and scaling appear more stable and natural. Disable for immediate
   * 1:1 response to hand movements.
   */
  @input
  @hint(
    "Applies filtering to smooth object manipulation movement. When enabled, a one-euro filter is applied to reduce \
jitter and make translations, rotations, and scaling appear more stable and natural. Disable for immediate \
1:1 response to hand movements."
  )
  public useFilter: boolean = true
  /**
   * Controls the visibility of advanced filtering options in the Inspector. When enabled, shows additional
   * properties for fine-tuning the one-euro filter (minCutoff, beta, dcutoff) that smooths object manipulation.
   */
  @input
  @showIf("useFilter", true)
  @hint(
    "Controls the visibility of advanced filtering options in the Inspector. When enabled, shows additional \
properties for fine-tuning the one-euro filter (minCutoff, beta, dcutoff) that smooths object manipulation."
  )
  private showFilterProperties: boolean = false
  /**
   * Minimum cutoff frequency of the one-euro filter.
   * Lower values reduce jitter during slow movements but increase lag.
   * Adjust this parameter first with beta=0 to find a balance that removes jitter
   * while maintaining acceptable responsiveness during slow movements.
   */
  @input
  @showIf("showFilterProperties", true)
  @hint(
    "Minimum cutoff frequency of the one-euro filter. Lower values reduce jitter during slow movements but increase \
lag. Adjust this parameter first with beta=0 to find a balance that removes jitter while maintaining acceptable \
responsiveness during slow movements."
  )
  minCutoff: number = 2
  /**
   * Speed coefficient of the one-euro filter.
   * Higher values reduce lag during fast movements but may increase jitter.
   * Adjust this parameter after setting minCutoff to minimize lag during quick movements.
   */
  @input
  @showIf("showFilterProperties", true)
  @hint(
    "Speed coefficient of the one-euro filter. Higher values reduce lag during fast movements but may increase \
jitter. Adjust this parameter after setting minCutoff to minimize lag during quick movements."
  )
  beta: number = 0.015
  /**
   * Derivative cutoff frequency for the one-euro filter.
   * Controls how the filter responds to changes in movement speed.
   * Higher values make the filter more responsive to velocity changes.
   */
  @input
  @showIf("showFilterProperties", true)
  @hint(
    "Derivative cutoff frequency for the one-euro filter. Controls how the filter responds to changes in movement \
speed. Higher values make the filter more responsive to velocity changes."
  )
  dcutoff: number = 1
  /**
   * Controls the visibility of translation options in the Inspector.
   */
  @input
  @hint("Controls the visibility of translation options in the Inspector.")
  showTranslationProperties: boolean = false
  /**
   * Enables translation along the world's X-axis.
   */
  @input
  @showIf("showTranslationProperties", true)
  @hint("Enables translation along the world's X-axis.")
  private _enableXTranslation: boolean = true
  /**
   * Enables translation along the world's Y-axis.
   */
  @input
  @showIf("showTranslationProperties", true)
  @hint("Enables translation along the world's Y-axis.")
  private _enableYTranslation: boolean = true
  /**
   * Enables translation along the world's Z-axis.
   */
  @input
  @showIf("showTranslationProperties", true)
  @hint("Enables translation along the world's Z-axis.")
  private _enableZTranslation: boolean = true

  /**
   * Controls the visibility of rotation options in the Inspector.
   */
  @input
  @hint("Controls the visibility of rotation options in the Inspector.")
  showRotationProperties: boolean = false
  /**
   * Controls which axes the object can rotate around. "All" allows free rotation in any direction, while "X",
   * "Y", or "Z" constrains rotation to only that specific world axis.
   */
  @input
  @showIf("showRotationProperties", true)
  @hint(
    'Controls which axes the object can rotate around. "All" allows free rotation in any direction, while "X", \
"Y", or "Z" constrains rotation to only that specific world axis.'
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("All", "All"),
      new ComboBoxItem("X", "X"),
      new ComboBoxItem("Y", "Y"),
      new ComboBoxItem("Z", "Z")
    ])
  )
  private _rotationAxis: string = "All"
  @ui.group_end

  /**
   * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
   * If set to true, the InteractableManipulation's position will be synced whenever a new user joins the same Connected Lenses session.
   * isSynced must also be enabled on the InteractableManipulation's Interactable.
   */
  @ui.separator
  @ui.group_start("Sync Kit Support")
  @input
  @hint(
    "Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. \
If set to true, the InteractableManipulation's position will be synced whenever a new user joins the same Connected Lenses session. \
isSynced must also be enabled on the InteractableManipulation's Interactable."
  )
  public isSynced: boolean = false
  @ui.group_end
  private defaultFilterConfig: OneEuroFilterConfig | undefined
  private camera = WorldCameraFinderProvider.getInstance()
  private interactionManager = InteractionManager.getInstance()

  // Keep track of "Unsubscribe" functions when adding callbacks to Interactable Events, to ensure proper cleanup on destroy
  private unsubscribeBag: unsubscribe[] = []

  private interactable: Interactable | null = null

  // Native Logging
  private log = new NativeLogger(TAG)

  private state: StateMachineData = {
    stateMachine: new StateMachine("InteractableManipulation"),
    triggeringInteractors: [],
    previousCapabilitiesState: {
      enabled: true,
      canTranslate: true,
      canRotate: true,
      canScale: true
    },
    activeEvents: {
      translation: false,
      rotation: false,
      scale: false,
      manipulation: false
    },
    states: {
      Idle: "Idle",
      Active: "Active"
    },
    signals: {
      StartManipulation: "StartManipulation",
      EndManipulation: "EndManipulation",
      ChangeInteractors: "ChangeInteractors",
      CapabilitiesChanged: "CapabilitiesChanged"
    }
  }

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

  private rayDistanceMap: Map<Interactor, number> = new Map<Interactor, number>()

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

  // Only defined if SyncKit is present within the lens project.
  private syncKitBridge = SyncKitBridge.getInstance()
  private syncEntity =
    this.isSynced && !this.findContainerFrame(this.sceneObject.getParent())
      ? this.syncKitBridge.createSyncEntity(this)
      : null

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
    this.cacheTransform()
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
    if (this.enableTranslation !== enabled) {
      this.enableTranslation = enabled
      this.notifyCapabilityChanged()
    }
  }

  /**
   * Returns true if any of rotation x, y, or z is enabled
   */
  canRotate(): boolean {
    return (
      this.enableRotation &&
      (this.state.triggeringInteractors.length === 2 ||
        (this.state.triggeringInteractors.length === 1 && this.cachedTargetingMode === TargetingMode.Direct))
    )
  }

  /**
   * Toggle for allowing an object to rotate
   */
  setCanRotate(enabled: boolean): void {
    if (this.enableRotation !== enabled) {
      this.enableRotation = enabled
      this.notifyCapabilityChanged()
    }
  }

  /**
   * Returns true if any of scale x, y, or z is enabled
   */
  canScale(): boolean {
    return this.enableScale && this.state.triggeringInteractors.length === 2
  }

  /**
   * Toggle for allowing an object to scale
   */
  setCanScale(enabled: boolean): void {
    if (this.enableScale !== enabled) {
      this.enableScale = enabled
      this.notifyCapabilityChanged()
    }
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

  private onRotationStartEvent = new Event<RotationEventArg>()
  /**
   * Callback for when rotation begins
   */
  onRotationStart: PublicApi<RotationEventArg> = this.onRotationStartEvent.publicApi()

  private onRotationUpdateEvent = new Event<RotationEventArg>()
  /**
   * Callback for when rotation updates each frame
   */
  onRotationUpdate: PublicApi<RotationEventArg> = this.onRotationUpdateEvent.publicApi()

  private onRotationEndEvent = new Event<RotationEventArg>()
  /**
   * Callback for when rotation has ended
   */
  onRotationEnd: PublicApi<RotationEventArg> = this.onRotationEndEvent.publicApi()

  private onScaleLimitReachedEvent = new Event<ScaleLimitEventArg>()
  /**
   * Callback for when scale has reached the minimum or maximum limit
   */
  onScaleLimitReached: PublicApi<ScaleLimitEventArg> = this.onScaleLimitReachedEvent.publicApi()

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
  onManipulationStart: PublicApi<TransformEventArg> = this.onManipulationStartEvent.publicApi()

  private onManipulationUpdateEvent = new Event<TransformEventArg>()
  /**
   * Callback for when any manipulation updates
   */
  onManipulationUpdate: PublicApi<TransformEventArg> = this.onManipulationUpdateEvent.publicApi()

  private onManipulationEndEvent = new Event<TransformEventArg>()
  /**
   * Callback for when any manipulation ends
   */
  onManipulationEnd: PublicApi<TransformEventArg> = this.onManipulationEndEvent.publicApi()

  onAwake(): void {
    this.setupStateMachine()

    this.setManipulateRoot(
      !isNull(this.manipulateRootSceneObject) ? this.manipulateRootSceneObject!.getTransform() : this.getTransform()
    )

    this.createEvent("OnDestroyEvent").bind(() => this.onDestroy())
    this.createEvent("OnDisableEvent").bind(() => {
      this.state.stateMachine.sendSignal(this.state.signals.EndManipulation)
    })

    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.defaultFilterConfig = {
      frequency: 60, //fps
      minCutoff: this.minCutoff,
      beta: this.beta,
      dcutoff: this.dcutoff
    }

    this.translateFilter = new OneEuroFilterVec3(this.defaultFilterConfig)
    this.rotationFilter = new OneEuroFilterQuat(this.defaultFilterConfig)
    this.scaleFilter = new OneEuroFilterVec3(this.defaultFilterConfig)

    if (this.syncEntity !== null) {
      this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this))
    }
  }

  onStart() {
    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())

    if (this.interactable === null) {
      throw new Error("InteractableManipulation requires an interactable to function.")
    }

    this.interactable.keepHoverOnTrigger = true
    this.interactable.useFilteredPinch = true
    // Temporarily limit manipulatable Interactables to not be pokeable until fixing the transition from poke to pinch.
    if ((this.interactable.targetingMode & TargetingMode.Poke) !== 0) {
      this.log.e(
        `Poke targeting is incompatible with InteractableManipulation. Poke targeting for Interactable of ${this.sceneObject.name} will be disabled.`
      )
      this.interactable.targetingMode = this.interactable.targetingMode & ~TargetingMode.Poke
    }

    this.setupCallbacks()
  }

  /**
   * If the component is synced, set up additional callbacks for the synced datastore
   * to ensure another connected user's manipulation propagates to the local scene.
   */
  private setupConnectionCallbacks(): void {
    if (
      this.syncEntity.currentStore.getAllKeys().find((key: string) => {
        return key === MANIPULATION_VALUE_KEY
      })
    ) {
      const locationTransform = this.syncEntity.currentStore.getMat4(MANIPULATION_VALUE_KEY)
      const worldTransform = this.syncKitBridge.locationTransformToWorldTransform(locationTransform)

      this.manipulateRoot!.setWorldTransform(worldTransform)
    } else {
      const locationTransform = this.syncKitBridge.worldTransformToLocationTransform(
        this.manipulateRoot!.getWorldTransform()
      )

      this.syncEntity.currentStore.putMat4(MANIPULATION_VALUE_KEY, locationTransform)
    }

    this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this))
  }

  private processStoreUpdate(
    _session: MultiplayerSession,
    store: GeneralDataStore,
    key: string,
    info: ConnectedLensModule.RealtimeStoreUpdateInfo
  ) {
    const connectionId = info.updaterInfo.connectionId
    const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId()

    if (updatedByLocal) {
      return
    }

    if (key === MANIPULATION_VALUE_KEY) {
      const locationTransform = store.getMat4(MANIPULATION_VALUE_KEY)
      const worldTransform = this.syncKitBridge.locationTransformToWorldTransform(locationTransform)

      this.manipulateRoot!.setWorldTransform(worldTransform)
    }
  }

  private updateSyncStore() {
    if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
      const locationTransform = this.syncKitBridge.worldTransformToLocationTransform(
        this.manipulateRoot!.getWorldTransform()
      )

      this.syncEntity.currentStore.putMat4(MANIPULATION_VALUE_KEY, locationTransform)
    }
  }

  // If the InteractableManipulation script is instantiated by ContainerFrame, allow the ContainerFrame
  // to handle the transform syncing.
  private findContainerFrame(ancestor: SceneObject): boolean {
    if (ancestor === null) {
      return false
    } else if (ancestor.getComponent(ContainerFrame.getTypeName())) {
      return true
    } else {
      return this.findContainerFrame(ancestor.getParent())
    }
  }

  private onDestroy(): void {
    // If we don't unsubscribe, component will keep working after destroy() due to event callbacks added to Interactable Events
    this.unsubscribeBag.forEach((unsubscribeCallback: unsubscribe) => {
      unsubscribeCallback()
    })
    this.unsubscribeBag = []
    this.state.stateMachine.destroy()
    this.interactors = []
  }

  private setupCallbacks(): void {
    validate(this.interactable)

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

    this.unsubscribeBag.push(
      this.interactable.onTriggerEndOutside.add((event) => {
        if (event.propagationPhase === "Target" || event.propagationPhase === "BubbleUp") {
          event.stopPropagation()
          this.onTriggerToggle(event)
        }
      })
    )
  }

  /**
   * Updates the starting transform values mid-manipuation if some other script has displaced, rotated, or scaled the object
   * during the interaction.
   */
  public updateStartTransform() {
    // If called when not actively manipulating, ignore the call since all values have already been reset.
    if (this.state.stateMachine.currentState?.name === this.state.states.Idle) {
      return
    }

    const interactor = this.interactors[0]
    if (this.isInteractorValid(interactor) === false) {
      this.log.e("Interactor must not be valid for setting initial values")
      return
    }

    validate(this.manipulateRoot)

    // Reset filters
    this.translateFilter.reset()
    this.rotationFilter.reset()
    this.scaleFilter.reset()

    // Set the starting transform values to be used for callbacks
    this.startTransform = {
      transform: this.manipulateRoot.getWorldTransform(),
      position: this.manipulateRoot.getWorldPosition(),
      rotation: this.manipulateRoot.getWorldRotation(),
      scale: this.manipulateRoot.getWorldScale()
    }

    // Bang operator is fine here because isInteractorValid checks for null values.
    const startPoint = interactor.startPoint!

    // Ensure that stretch value does not affect the new hitPointToTransformValue.
    this.hitPointToTransform = this.startTransform.position.sub(
      startPoint.add(interactor.direction!.uniformScale(this.offsetPosition.length + this.smoothedStretch))!
    )
  }

  public updateStartValues(): void {
    validate(this.manipulateRoot)
    validate(this.interactable)

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
      scale: this.manipulateRoot.getWorldScale()
    }

    const cameraRotation = this.camera.getTransform().getWorldRotation()

    if (this.interactors.length === 1) {
      const interactor = this.interactors[0]
      if (this.isInteractorValid(interactor) === false) {
        this.log.e("Interactor must not be valid for setting initial values")
        return
      }

      const startPoint = interactor.startPoint ?? vec3.zero()
      const orientation = interactor.orientation ?? quat.quatIdentity()

      this.cachedTargetingMode = interactor.activeTargetingMode

      if (interactor.activeTargetingMode === TargetingMode.Direct) {
        this.offsetPosition = vec3.zero()
        this.hitPointToTransform = this.startTransform.position.sub(startPoint)
        this.offsetRotation = orientation.invert().multiply(this.startTransform.rotation)
      } else {
        // Bang operator is fine here because isInteractorValid checks for null values.
        const distance = interactor.distanceToTarget!

        // Cache the distance when starting manipulation to maintain the same position along the targeting ray.
        this.rayDistanceMap.set(interactor, distance)

        const rayPosition = this.getRayPosition(interactor)

        this.offsetPosition = rayPosition.sub(startPoint)
        this.hitPointToTransform = this.startTransform.position.sub(rayPosition)
        this.offsetRotation = cameraRotation.invert().multiply(this.startTransform.rotation)
      }
    } else if (this.interactors.length === 2) {
      if (
        this.isInteractorValid(this.interactors[0]) === false ||
        this.isInteractorValid(this.interactors[1]) === false
      ) {
        this.log.e("Both interactors must be valid for setting initial values")
        return
      }

      const isDirect =
        this.interactors[0].activeTargetingMode === TargetingMode.Direct ||
        this.interactors[1].activeTargetingMode === TargetingMode.Direct
      this.cachedTargetingMode = isDirect ? TargetingMode.Direct : TargetingMode.Indirect

      const firstStartPoint = this.interactors[0].startPoint ?? vec3.zero()
      const secondStartPoint = this.interactors[1].startPoint ?? vec3.zero()

      const interactorMidPoint = firstStartPoint.add(secondStartPoint).uniformScale(0.5)

      this.currentUp = vec3.up()
      this.currentRotationSign = 0
      const dualInteractorDirection = this.getDualInteractorDirection(this.interactors[0], this.interactors[1])

      this.initialInteractorDistance = firstStartPoint.distance(secondStartPoint)
      this.initialObjectScale = this.manipulateRoot.getLocalScale()

      if (dualInteractorDirection === null) {
        return
      }

      this.offsetRotation = dualInteractorDirection.invert().multiply(this.startTransform.rotation)

      if (isDirect) {
        this.offsetPosition = vec3.zero()
        this.hitPointToTransform = this.startTransform.position.sub(interactorMidPoint)
      } else {
        // Bang operator is fine here because isInteractorValid checks for null values.
        const firstDistance = this.interactors[0].distanceToTarget!
        const secondDistance = this.interactors[1].distanceToTarget!

        // Cache the distance when starting manipulation to maintain the same position along the targeting ray.
        this.rayDistanceMap.set(this.interactors[0], firstDistance)
        this.rayDistanceMap.set(this.interactors[1], secondDistance)

        const firstRayPosition = this.getRayPosition(this.interactors[0])
        const secondRayPosition = this.getRayPosition(this.interactors[1])
        const dualRayPosition = firstRayPosition.add(secondRayPosition).uniformScale(0.5)

        const direction0 = this.interactors[0].direction ?? vec3.zero()
        const direction1 = this.interactors[1].direction ?? vec3.zero()
        const dualDirection = direction0.add(direction1).uniformScale(0.5)
        const dualRaycastDistance =
          (this.interactors[0].maxRaycastDistance + this.interactors[1].maxRaycastDistance) * 0.5
        const rayMidpointToInteractorDistance = dualRayPosition.distance(interactorMidPoint)
        const projectedHitDistance = Math.min(dualRaycastDistance, rayMidpointToInteractorDistance)
        const hitPoint = interactorMidPoint.add(dualDirection.uniformScale(projectedHitDistance))

        this.offsetPosition = dualRayPosition.sub(interactorMidPoint)
        this.hitPointToTransform = this.startTransform.position.sub(hitPoint)
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
    const distanceToTarget = this.rayDistanceMap.get(interactor) ?? 0

    return startPoint.add(direction.uniformScale(distanceToTarget))
  }

  private cacheTransform() {
    validate(this.manipulateRoot)

    this.originalWorldTransform = {
      transform: this.manipulateRoot.getWorldTransform(),
      position: this.manipulateRoot.getWorldPosition(),
      rotation: this.manipulateRoot.getWorldRotation(),
      scale: this.manipulateRoot.getWorldScale()
    }

    this.originalLocalTransform = {
      transform: mat4.compose(
        this.manipulateRoot.getLocalPosition(),
        this.manipulateRoot.getLocalRotation(),
        this.manipulateRoot.getLocalScale()
      ),
      position: this.manipulateRoot.getLocalPosition(),
      rotation: this.manipulateRoot.getLocalRotation(),
      scale: this.manipulateRoot.getLocalScale()
    }
  }

  private resetActiveEvents(): void {
    this.state.activeEvents.translation = false
    this.state.activeEvents.rotation = false
    this.state.activeEvents.scale = false
    this.state.activeEvents.manipulation = false
  }

  private setupStateMachine(): void {
    this.state.previousCapabilitiesState = {
      enabled: this.enabled,
      canTranslate: this.canTranslate(),
      canRotate: this.canRotate(),
      canScale: this.canScale()
    }

    this.state.stateMachine.addState({
      name: this.state.states.Idle,
      onEnter: () => {
        this.log.v("Entered Idle state")
        this.interactors = []
        this.resetActiveEvents()
      },
      transitions: [
        {
          nextStateName: this.state.states.Active,
          checkOnSignal: (signal: string, data: any) => {
            return (
              signal === this.state.signals.StartManipulation &&
              this.hasActiveCapabilities() &&
              data?.interactors?.length > 0
            )
          }
        }
      ]
    })

    this.state.stateMachine.addState({
      name: this.state.states.Active,
      onEnter: () => {
        this.log.v("Entered Active state")
        this.startManipulation(this.state.triggeringInteractors)
      },
      onUpdate: () => {
        this.performManipulation()
      },
      onExit: () => {
        this.log.v("Exited Active state")
        this.endManipulation()
      },
      onSignal: (signal: string, data: any) => {
        if (signal === this.state.signals.ChangeInteractors && data?.interactors) {
          this.log.v("Handling interactor change within Active state")
          this.interactors = data.interactors
          this.updateStartValues()
          this.updateEventStates()
        } else if (signal === this.state.signals.CapabilitiesChanged) {
          this.log.v("Handling capability changes within Active state")
          this.updateStartValues()
          this.updateEventStates()
        }
      },
      transitions: [
        {
          nextStateName: this.state.states.Idle,
          checkOnSignal: (signal: string) => {
            return signal === this.state.signals.EndManipulation
          }
        }
      ]
    })

    this.state.stateMachine.enterState(this.state.states.Idle)
  }

  private hasActiveCapabilities(): boolean {
    return this.enabled && (this.canTranslate() || this.canRotate() || this.canScale())
  }

  private onTriggerToggle(_eventData: InteractorEvent): void {
    const previousInteractors = this.interactors
    const currentInteractors = this.getTriggeringInteractors()
    this.log.v(`onTriggerToggle called with ${currentInteractors.length} interactors`)
    this.state.triggeringInteractors = currentInteractors

    const currentState = this.state.stateMachine.currentState?.name
    const hasCapabilities = this.hasActiveCapabilities()

    // Try transition to Active
    if (currentState === this.state.states.Idle && currentInteractors.length > 0 && hasCapabilities) {
      this.log.v("Attempting transition: Idle -> Active")
      this.state.stateMachine.sendSignal(this.state.signals.StartManipulation, {
        interactors: currentInteractors
      })
    }

    // Try transition to Idle
    if (currentState === this.state.states.Active && (currentInteractors.length === 0 || !hasCapabilities)) {
      this.log.v("Attempting transition: Active -> Idle")
      this.state.stateMachine.sendSignal(this.state.signals.EndManipulation)
    }

    // Try update if Interactors changed
    if (
      currentState === this.state.states.Active &&
      hasCapabilities &&
      currentInteractors.length > 0 &&
      this.interactorsChanged(previousInteractors, currentInteractors)
    ) {
      this.log.v("Attempting to update interactors within Active state")
      this.state.stateMachine.sendSignal(this.state.signals.ChangeInteractors, {interactors: currentInteractors})
    }
  }

  private onTriggerUpdate(_eventData: InteractorEvent): void {
    this.notifyCapabilityChanged()
  }

  private getCurrentCapabilitiesState(): CapabilitiesState {
    return {
      enabled: this.enabled,
      canTranslate: this.canTranslate(),
      canRotate: this.canRotate(),
      canScale: this.canScale()
    }
  }

  private capabilitiesChanged(previous: CapabilitiesState, current: CapabilitiesState): boolean {
    return (
      previous.enabled !== current.enabled ||
      previous.canTranslate !== current.canTranslate ||
      previous.canRotate !== current.canRotate ||
      previous.canScale !== current.canScale
    )
  }

  private notifyCapabilityChanged(): void {
    const currentCapabilities = this.getCurrentCapabilitiesState()

    if (this.capabilitiesChanged(this.state.previousCapabilitiesState, currentCapabilities)) {
      this.handleCapabilityChange(this.hasActiveCapabilities())
      this.state.previousCapabilitiesState = currentCapabilities
    }
  }

  private handleCapabilityChange(hasCapabilities: boolean): void {
    const currentState = this.state.stateMachine.currentState?.name

    if (!hasCapabilities && currentState === this.state.states.Active) {
      this.log.v("All capabilities disabled during active manipulation, ending manipulation")
      this.state.stateMachine.sendSignal(this.state.signals.EndManipulation)
    } else if (
      hasCapabilities &&
      currentState === this.state.states.Active &&
      this.state.triggeringInteractors.length > 0
    ) {
      this.log.v("Capabilities changed during active manipulation")
      this.state.stateMachine.sendSignal(this.state.signals.CapabilitiesChanged)
    } else if (
      hasCapabilities &&
      currentState === this.state.states.Idle &&
      this.state.triggeringInteractors.length > 0
    ) {
      this.log.v("Capabilities enabled while in Idle state, starting manipulation")
      this.state.stateMachine.sendSignal(this.state.signals.StartManipulation, {
        interactors: this.state.triggeringInteractors
      })
    }
  }

  private updateEventStates(): void {
    validate(this.interactable)
    validate(this.manipulateRoot)

    const canTranslate = this.canTranslate()
    const canRotate = this.canRotate()
    const canScale = this.canScale()

    // Handle translation events
    if (canTranslate && !this.state.activeEvents.translation) {
      this.state.activeEvents.translation = true
      this.invokeTranslationStart()
    } else if (!canTranslate && this.state.activeEvents.translation) {
      this.state.activeEvents.translation = false
      this.invokeTranslationEnd()
    }

    // Handle rotation events
    if (canRotate && !this.state.activeEvents.rotation) {
      this.state.activeEvents.rotation = true
      this.invokeRotationStart()
    } else if (!canRotate && this.state.activeEvents.rotation) {
      this.state.activeEvents.rotation = false
      this.invokeRotationEnd()
    }

    // Handle scale events
    if (canScale && !this.state.activeEvents.scale) {
      this.state.activeEvents.scale = true
      this.invokeScaleStart()
    } else if (!canScale && this.state.activeEvents.scale) {
      this.state.activeEvents.scale = false
      this.invokeScaleEnd()
    }
  }

  private startManipulation(interactors: Interactor[]): void {
    this.log.v(`startManipulation called with ${interactors.length} interactors`)
    this.interactors = interactors
    this.updateStartValues()

    this.state.activeEvents.manipulation = true
    this.state.activeEvents.translation = this.canTranslate()
    this.state.activeEvents.rotation = this.canRotate()
    this.state.activeEvents.scale = this.canScale()

    this.invokeManipulationStart()

    if (this.state.activeEvents.translation) {
      this.invokeTranslationStart()
    }

    if (this.state.activeEvents.rotation) {
      this.invokeRotationStart()
    }

    if (this.state.activeEvents.scale) {
      this.invokeScaleStart()
    }
  }

  private performManipulation(): void {
    const canTranslate = this.canTranslate()
    const canRotate = this.canRotate()
    const canScale = this.canScale()

    if (this.interactors.length === 1) {
      this.singleInteractorTransform(this.interactors[0])
    } else if (this.interactors.length === 2) {
      this.dualInteractorsTransform(this.interactors)
    } else {
      this.log.e(`${this.interactors.length} interactors found for manipulation. This is not supported.`)
      return
    }

    if (canTranslate) {
      this.invokeTranslationUpdate()
    }

    if (canRotate) {
      this.invokeRotationUpdate()
    }

    if (canScale) {
      this.invokeScaleUpdate()
    }

    if (canTranslate || canRotate || canScale) {
      this.invokeManipulationUpdate()
    }

    this.updateSyncStore()
  }

  private endManipulation(): void {
    this.log.v(`endManipulation called with ${this.interactors.length} interactors`)

    if (this.state.activeEvents.translation) {
      this.invokeTranslationEnd()
      this.state.activeEvents.translation = false
    }

    if (this.state.activeEvents.rotation) {
      this.invokeRotationEnd()
      this.state.activeEvents.rotation = false
    }

    if (this.state.activeEvents.scale) {
      this.invokeScaleEnd()
      this.state.activeEvents.scale = false
    }

    if (this.state.activeEvents.manipulation) {
      this.invokeManipulationEnd()
      this.state.activeEvents.manipulation = false
    }
  }

  private interactorsChanged(previous: Interactor[], current: Interactor[]): boolean {
    if (previous.length !== current.length) return true
    return previous.some((prev, i) => prev !== current[i])
  }

  private getTriggeringInteractors(): Interactor[] {
    validate(this.interactable)

    let interactors: Interactor[] = this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor)
    interactors = interactors.filter((interactor) => {
      return (
        interactor.currentInteractable === this.interactable && interactor.currentTrigger !== InteractorTriggerType.None
      )
    })

    if (interactors === null) {
      this.log.w(
        `Failed to retrieve interactors on ${this.getSceneObject().name}: ${
          this.interactable.triggeringInteractor
        } (InteractorInputType)`
      )
      return []
    }

    return interactors
  }

  private invokeEvent<T>(event: Event<T>, createArgs: () => T): void {
    validate(this.interactable)
    validate(this.manipulateRoot)
    event.invoke(createArgs())
  }

  // Event args creator helpers
  private createTranslationEventArgs(): TranslateEventArg {
    validate(this.interactable)
    validate(this.manipulateRoot)
    return {
      interactors: this.interactors,
      interactable: this.interactable,
      startPosition: this.startTransform.position,
      currentPosition: this.manipulateRoot.getWorldPosition()
    }
  }

  private createRotationEventArgs(): RotationEventArg {
    validate(this.interactable)
    validate(this.manipulateRoot)
    return {
      interactors: this.interactors,
      interactable: this.interactable,
      startRotation: this.startTransform.rotation,
      currentRotation: this.manipulateRoot.getWorldRotation()
    }
  }

  private createScaleEventArgs(): ScaleEventArg {
    validate(this.interactable)
    validate(this.manipulateRoot)
    return {
      interactors: this.interactors,
      interactable: this.interactable,
      startWorldScale: this.startTransform.scale,
      currentWorldScale: this.manipulateRoot.getWorldScale()
    }
  }

  private createManipulationEventArgs(): TransformEventArg {
    validate(this.interactable)
    validate(this.manipulateRoot)
    return {
      interactors: this.interactors,
      interactable: this.interactable,
      startTransform: this.startTransform.transform,
      currentTransform: this.manipulateRoot.getWorldTransform()
    }
  }

  // Translation events
  private invokeTranslationStart(): void {
    this.invokeEvent(this.onTranslationStartEvent, () => this.createTranslationEventArgs())
  }

  private invokeTranslationUpdate(): void {
    this.invokeEvent(this.onTranslationUpdateEvent, () => this.createTranslationEventArgs())
  }

  private invokeTranslationEnd(): void {
    this.invokeEvent(this.onTranslationEndEvent, () => this.createTranslationEventArgs())
  }

  // Rotation events
  private invokeRotationStart(): void {
    this.invokeEvent(this.onRotationStartEvent, () => this.createRotationEventArgs())
  }

  private invokeRotationUpdate(): void {
    this.invokeEvent(this.onRotationUpdateEvent, () => this.createRotationEventArgs())
  }

  private invokeRotationEnd(): void {
    this.invokeEvent(this.onRotationEndEvent, () => this.createRotationEventArgs())
  }

  // Scale events
  private invokeScaleStart(): void {
    this.invokeEvent(this.onScaleStartEvent, () => this.createScaleEventArgs())
  }

  private invokeScaleUpdate(): void {
    this.invokeEvent(this.onScaleUpdateEvent, () => this.createScaleEventArgs())
  }

  private invokeScaleEnd(): void {
    this.invokeEvent(this.onScaleEndEvent, () => this.createScaleEventArgs())
  }

  // Manipulation events
  private invokeManipulationStart(): void {
    this.invokeEvent(this.onManipulationStartEvent, () => this.createManipulationEventArgs())
  }

  private invokeManipulationUpdate(): void {
    this.invokeEvent(this.onManipulationUpdateEvent, () => this.createManipulationEventArgs())
  }

  private invokeManipulationEnd(): void {
    this.invokeEvent(this.onManipulationEndEvent, () => this.createManipulationEventArgs())
  }

  private getDualInteractorDirection(interactor1: Interactor, interactor2: Interactor): quat | null {
    if (
      interactor1 === null ||
      interactor1.startPoint === null ||
      interactor2 === null ||
      interactor2.startPoint === null
    ) {
      this.log.e("Interactors and their start points should not be null for getDualInteractorDirection")
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
    const rotation = quat.lookAt(point2.sub(point1), this.currentUp).multiply(YAW_NEGATIVE_90)

    const currentRotation = this.limitQuatRotation(rotation)

    return currentRotation
  }

  private limitQuatRotation(rotation: quat): quat {
    if (!this.canRotate()) {
      return quat.quatIdentity()
    }

    return rotation
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

    const limitRotation = this.limitQuatRotation(orientation).multiply(this.offsetRotation)
    // Do not rotate the object if using a single Interactor for single axis usecase.
    let deltaRotation =
      this.rotationAxis === RotationAxis.All
        ? limitRotation.multiply(this.manipulateRoot.getWorldRotation().invert())
        : quat.quatIdentity()

    // Single Interactor Direct
    if (this.enableTranslation) {
      let newPosition: vec3 | null

      if (this.cachedTargetingMode === TargetingMode.Direct) {
        newPosition = startPoint.add(
          this.canRotate()
            ? limitRotation.multiply(this.startTransform.rotation.invert()).multiplyVec3(this.hitPointToTransform)
            : this.hitPointToTransform
        )

        this.updatePosition(newPosition, this.useFilter)
      } else {
        // Single Interactor Indirect
        this.smoothedStretch = MathUtils.lerp(
          this.smoothedStretch,
          this.calculateStretchFactor(interactor),
          getDeltaTime() * STRETCH_SMOOTH_SPEED
        )
        const offset = direction.uniformScale(this.offsetPosition.length).add(this.hitPointToTransform)
        newPosition = startPoint.add(offset).add(direction.uniformScale(this.smoothedStretch))
        this.updatePosition(newPosition, this.useFilter)

        deltaRotation = quat.quatIdentity()
      }
    }

    if (this.canRotate()) {
      if (this.cachedTargetingMode === TargetingMode.Direct) {
        const newRotation = deltaRotation.multiply(this.manipulateRoot.getWorldRotation())
        this.updateRotation(newRotation, this.useFilter)
      }
    }
  }

  private dualInteractorsTransform(interactors: Interactor[]): void {
    if (interactors.length < 2 || !this.isInteractorValid(interactors[0]) || !this.isInteractorValid(interactors[1])) {
      this.log.e("There should be two valid interactors for dualInteractorsTransform")
      return
    }
    validate(this.manipulateRoot)
    validate(this.interactable)

    const isDirect = this.cachedTargetingMode === TargetingMode.Direct

    const startPoint1 = interactors[0].startPoint
    const startPoint2 = interactors[1].startPoint

    if (startPoint1 === null || startPoint2 === null) {
      this.log.e("Both start points should be valid for dualInteractorsTransform")
      return
    }

    const interactorMidPoint = startPoint1.add(startPoint2).uniformScale(0.5)
    const dualDirection = this.getDualInteractorDirection(interactors[0], interactors[1])

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
                  .multiplyVec3(this.hitPointToTransform)
              )
            : interactorMidPoint.add(this.hitPointToTransform)
        this.updatePosition(newPosition, this.useFilter)
      } else {
        // Dual Interactor Indirect
        const dualRaycastDistance = (interactors[0].maxRaycastDistance + interactors[1].maxRaycastDistance) * 0.5
        const zDistance = Math.min(dualRaycastDistance, this.offsetPosition.length)

        const direction0 = interactors[0].direction ?? vec3.zero()
        const direction1 = interactors[1].direction ?? vec3.zero()
        const dualDirection = direction0.add(direction1).uniformScale(0.5)

        const finalOffset = dualDirection.uniformScale(zDistance).add(this.hitPointToTransform)
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
      const uniformScalingFactor = 1 + distanceDifference / this.initialInteractorDistance

      const updatedObjectScale = this.initialObjectScale.uniformScale(uniformScalingFactor)

      this.setScale(updatedObjectScale, this.useFilter)
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
    // Get distance from hand to camera along z axis only
    const startPoint = interactor.startPoint ?? vec3.zero()
    const interactorDistance = this.camera.getTransform().getInvertedWorldTransform().multiplyPoint(startPoint).z * -1

    if (this.startStretchInteractorDistance === 0) {
      this.startStretchInteractorDistance = interactorDistance
    }
    const dragAmount = interactorDistance - this.startStretchInteractorDistance

    /*
     * Subtracting MAX_USER_ARM_EXTENSION_CM to ensure that the user can still interact with the interactable anywhere within their
     * normal range of motion. Without this, if you push the interactable out to the maxRaycastDistance and your arm is fully extended,
     * you will need to move closer to the interactable to interact with it again.
     */
    const maxDragDistance = Math.max(MIN_DRAG_DISTANCE_CM, interactor.maxRaycastDistance - MAX_USER_ARM_EXTENSION_CM)

    //scale movement based on distance from ray start to object
    const currDistance = this.rayDistanceMap.get(interactor) ?? 0
    const distanceFactor = (this.zStretchFactorMax / maxDragDistance) * currDistance + this.zStretchFactorMin

    const minStretch = -this.offsetPosition.length + 1
    const maxStretch = Math.max(minStretch, -this.offsetPosition.length + maxDragDistance - 1)

    let finalStretchAmount = MathUtils.clamp(dragAmount * distanceFactor, minStretch, maxStretch)

    if ((interactor.inputType & InteractorInputType.Mobile) !== 0) {
      const mobileInteractor = interactor as MobileInteractor

      let mobileDragVector = vec3.zero()
      if (mobileInteractor.touchpadDragVector !== null) {
        mobileDragVector = mobileInteractor.touchpadDragVector
      }

      const mobileMoveAmount = mobileDragVector.z === 0 ? mobileDragVector.y * MOBILE_DRAG_MULTIPLIER : 0

      this.mobileStretch += mobileMoveAmount * distanceFactor

      // Don't let value accumulate out of bounds
      this.mobileStretch = Math.min(
        maxStretch - finalStretchAmount,
        Math.max(minStretch - finalStretchAmount, this.mobileStretch)
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
    const minRatio = Math.min(scale.x / minScale.x, scale.y / minScale.y, scale.z / minScale.z)
    const maxRatio = Math.max(scale.x / maxScale.x, scale.y / maxScale.y, scale.z / maxScale.z)

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
    const minScale = this.originalLocalTransform.scale.uniformScale(this.minimumScaleFactor)
    const maxScale = this.originalLocalTransform.scale.uniformScale(this.maximumScaleFactor)

    // Calculate final scale
    let finalScale = this.clampUniformScale(newScale, minScale, maxScale)

    if (newScale !== finalScale) {
      this.onScaleLimitReachedEvent.invoke({
        interactors: this.interactors,
        interactable: this.interactable,
        currentValue: finalScale
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
      this.manipulateRoot.setLocalTransform(this.originalLocalTransform.transform)
    } else {
      this.manipulateRoot.setWorldTransform(this.originalWorldTransform.transform)
    }
  }
}
