import {InteractableManipulation} from "../../Components/Interaction/InteractableManipulation/InteractableManipulation"
import {MobileInputData} from "../../Providers/MobileInputData/MobileInputData"
import {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import NativeLogger from "../../Utils/NativeLogger"
import {validate} from "../../Utils/validate"
import BaseInteractor from "../Interactor/BaseInteractor"
import {DragProvider} from "../Interactor/DragProvider"
import IndirectTargetProvider from "../Interactor/IndirectTargetProvider"
import {
  DragType,
  InteractorInputType,
  InteractorTriggerType,
  TargetingMode,
} from "../Interactor/Interactor"
import {MobileRayProvider} from "../Interactor/MobileRayProvider"

const TAG = "MobileInteractor"

// These thresholds are not for deciding when to invoke onDragStart, but rather to tell the MobileInteractor when to switch what type of drag to track.
const INITIAL_TOUCHPAD_SWITCH_THRESHOLD = 0.05 // Screen position units mapped from the phone's touch surface
const OVERRIDE_TOUCHPAD_SWITCH_THRESHOLD = 0.1 // Screen position units mapped from the phone's touch surface

const INITIAL_SIX_DOF_SWITCH_THRESHOLD = 3 // World units in c
const OVERRIDE_SIX_DOF_SWITCH_THRESHOLD = 20 // World units in c
const MANIPULATE_SIX_DOF_SWITCH_THRESHOLD = 2 // World units in c

/**
 * Interactor for the Mobile Controller
 */
@component
export class MobileInteractor extends BaseInteractor {
  @ui.group_start("Mobile Interactor")
  @input
  @hint(
    "Initialize Mobile Input Data Provider with Position and Rotation Filtering"
  )
  initializePositionAndRotationFilter: boolean = true
  @input
  private _touchpadScrollSpeed: number = 250
  @input
  private touchpadDragThreshold: number = 0.05
  @ui.group_end
  private indirectTargetProvider: IndirectTargetProvider | undefined
  private rayProvider: MobileRayProvider | undefined
  private _dragType: DragType | null = null
  private isManipulating = false

  // Native Logging
  private log = new NativeLogger(TAG)

  private mobileInputData: MobileInputData = MobileInputData.getInstance()

  private touchpadStartPosition: vec2 | null = null
  private touchpadCurrentPosition: vec2 | null = null
  private sixDofStartPosition: vec3 | null = null
  private sixDofCurrentPosition: vec3 | null = null

  private sixDofDragProvider = new DragProvider(this.indirectDragThreshold)
  private touchpadDragProvider = new DragProvider(this.touchpadDragThreshold)

  onAwake(): void {
    this.inputType = InteractorInputType.Mobile
    this.mobileInputData.filterPositionAndRotation =
      this.initializePositionAndRotationFilter

    this.defineSceneEvents()
    this.defineTouchEvents()

    this.rayProvider = new MobileRayProvider()

    this.indirectTargetProvider = new IndirectTargetProvider(
      this as BaseInteractor,
      {
        maxRayDistance: this.maxRaycastDistance,
        rayProvider: this.rayProvider,
        targetingVolumeMultiplier: this.indirectTargetingVolumeMultiplier,
        shouldPreventTargetUpdate: () => {
          return this.preventTargetUpdate()
        },
        spherecastRadii: this.spherecastRadii,
        spherecastDistanceThresholds: this.spherecastDistanceThresholds,
      }
    )
  }

  get touchpadScrollSpeed(): number {
    return this._touchpadScrollSpeed
  }

  get startPoint(): vec3 | null {
    return this.indirectTargetProvider?.startPoint ?? null
  }

  get endPoint(): vec3 | null {
    return this.indirectTargetProvider?.endPoint ?? null
  }

  get direction(): vec3 | null {
    return this.indirectTargetProvider?.direction ?? null
  }

  get orientation(): quat | null {
    return this.mobileInputData.rotation
  }

  get distanceToTarget(): number | null {
    return (
      this.indirectTargetProvider?.currentInteractableHitInfo?.hit.distance ??
      null
    )
  }

  get targetHitPosition(): vec3 | null {
    return (
      this.indirectTargetProvider?.currentInteractableHitInfo?.hit.position ??
      null
    )
  }

  get targetHitInfo(): InteractableHitInfo | null {
    return this.indirectTargetProvider?.currentInteractableHitInfo ?? null
  }

  get activeTargetingMode(): TargetingMode {
    return this.indirectTargetProvider?.targetingMode ?? TargetingMode.None
  }

  get maxRaycastDistance(): number {
    return this._maxRaycastDistance
  }

  get interactionStrength(): number | null {
    return this.touchpadStartPosition !== null ? 1 : 0
  }

  /**
   * Set if the Interactor is should draw a debug gizmo of collider/raycasts in the scene.
   */
  set drawDebug(debug: boolean) {
    validate(this.indirectTargetProvider)
    this._drawDebug = debug

    this.indirectTargetProvider.drawDebug = debug
  }

  /**
   * @returns if the Interactor is currently drawing a debug gizmo of collider/raycasts in the scene.
   */
  get drawDebug(): boolean {
    return this._drawDebug
  }

  /**
   * @returns the current drag vector of the phone's SixDof position in world space.
   */
  get sixDofDragVector(): vec3 | null {
    return this.sixDofDragProvider.currentDragVector
  }

  /**
   * @returns the current drag vector of the phone's touchpad in normalized screen space (with bottom-left corner representing [0,0]).
   */
  get touchpadDragVector(): vec3 | null {
    return this.touchpadDragProvider.currentDragVector
  }

  override updateState(): void {
    super.updateState()

    if (!this.mobileInputData.isAvailable()) {
      return
    }

    validate(this.indirectTargetProvider)

    this.indirectTargetProvider.update()
    this.currentInteractable =
      this.indirectTargetProvider.currentInteractableHitInfo?.interactable ??
      null
    this.currentTrigger =
      this.touchpadStartPosition !== null
        ? InteractorTriggerType.Select
        : InteractorTriggerType.None

    if ((this.currentTrigger & InteractorTriggerType.Select) !== 0) {
      if (this.sixDofStartPosition === null) {
        this.sixDofStartPosition = this.sixDofSwitchPosition
      }
      this.sixDofCurrentPosition = this.sixDofSwitchPosition
    } else {
      this.sixDofCurrentPosition = this.sixDofStartPosition = null
    }

    this.updateDragType()
    this.updateDragVector()
  }

  /** @inheritdoc */
  isTargeting(): boolean {
    return this.mobileInputData.isAvailable()
  }

  /** @inheritdoc */
  isActive(): boolean {
    return this.mobileInputData.isAvailable()
  }

  protected clearCurrentHitInfo(): void {
    validate(this.indirectTargetProvider)
    this.indirectTargetProvider.clearCurrentInteractableHitInfo()
  }

  private defineSceneEvents(): void {
    this.createEvent("OnDestroyEvent").bind(() => {
      this.release()
    })
  }

  private defineTouchEvents(): void {
    this.createEvent("TouchStartEvent").bind((...args) =>
      this.onTouchStartEvent(...args)
    )

    this.createEvent("TouchMoveEvent").bind((...args) =>
      this.onTouchMoveEvent(...args)
    )

    this.createEvent("TouchEndEvent").bind((...args) => this.onTouchEndEvent())
  }

  private onTouchStartEvent(ev: TouchStartEvent): void {
    this.touchpadCurrentPosition = this.touchpadStartPosition =
      ev.getTouchPosition()
    if (this.currentInteractable !== null) {
      this.isManipulating =
        this.currentInteractable.sceneObject.getComponent(
          InteractableManipulation.getTypeName()
        ) !== null
    }
    if (!global.deviceInfoSystem.isEditor) {
      this.log.v("Mobile Interactor On Touch Start Event")
    }
  }

  private onTouchMoveEvent(ev: TouchMoveEvent): void {
    this.touchpadCurrentPosition = ev.getTouchPosition()
  }

  private onTouchEndEvent(): void {
    this.touchpadStartPosition = this.touchpadCurrentPosition = null
    this.dragType = null
    this.dragProvider.clear()
    this.isManipulating = false
    if (!global.deviceInfoSystem.isEditor) {
      this.log.v("Mobile Interactor On Touch End Event")
    }
  }

  private preventTargetUpdate(): boolean {
    // If there's no current touch there's no trigger happening
    if (!this.touchpadStartPosition) {
      return false
    }

    return true
  }

  private updateDragType() {
    if (this.currentTrigger === InteractorTriggerType.None) {
      return
    }

    if (
      this.dragType !== DragType.Touchpad &&
      this.touchpadStartPosition !== null &&
      this.touchpadCurrentPosition !== null &&
      this.touchpadCurrentPosition?.sub(this.touchpadStartPosition).length >
        this.touchpadSwitchThreshold
    ) {
      this.dragType = DragType.Touchpad
      return
    }

    if (
      this.dragType !== DragType.SixDof &&
      this.sixDofStartPosition !== null &&
      this.sixDofCurrentPosition !== null &&
      this.sixDofCurrentPosition?.sub(this.sixDofStartPosition).length >
        this.sixDofSwitchThreshold
    ) {
      this.dragType = DragType.SixDof
      return
    }
  }

  protected override clearDragProviders(): void {
    this.touchpadDragProvider.clear()
    this.sixDofDragProvider.clear()
    this.planecastDragProvider.clear()
  }

  protected override updateDragVector(): void {
    if ((this.currentTrigger & InteractorTriggerType.Select) !== 0) {
      const touchpadDragVector = this.touchpadDragProvider.getDragVector(
        this.getTouchpadDragPoint(),
        this.currentInteractable?.enableInstantDrag ?? null
      )
      const sixDofDragVector = this.sixDofDragProvider.getDragVector(
        this.getSixDofDragPoint(),
        this.currentInteractable?.enableInstantDrag ?? null
      )

      this.currentDragVector = this.dragProvider.currentDragVector

      this.planecastDragProvider.getDragVector(
        this.planecastPoint,
        this.currentInteractable?.enableInstantDrag ?? null
      )
    } else {
      this.currentDragVector = null
      this.clearDragProviders()
    }
  }

  protected override getDragPoint(): vec3 | null {
    if (this.dragType === DragType.SixDof) {
      return this.getSixDofDragPoint()
    } else if (this.dragType === DragType.Touchpad) {
      return this.getTouchpadDragPoint()
    }
    return null
  }

  private getSixDofDragPoint(): vec3 | null {
    return this.endPoint
  }

  private getTouchpadDragPoint(): vec3 | null {
    if (this.touchpadCurrentPosition !== null) {
      return new vec3(
        // Remap the touchpad space such that the bottom-left corner is [0,0] rather than the top-left corner.
        this.touchpadCurrentPosition.x,
        1 - this.touchpadCurrentPosition.y,
        0
      ).uniformScale(this.touchpadScrollSpeed)
    }
    return null
  }

  /**
   * At the beginning of interaction, the switch threshold should be lower to immediately start tracking the user's desired type of drag.
   * However if the user is already dragging via Touchpad, switching to drag via 6DoF should be more difficult to avoid accidental drag interruptions.
   * In the case of manipulation, we use a threshold for the startPosition of the ray instead as a design choice.
   */
  private get sixDofSwitchThreshold(): number {
    if (this.isManipulating) {
      return MANIPULATE_SIX_DOF_SWITCH_THRESHOLD
    }

    if (this.dragType === DragType.Touchpad) {
      return OVERRIDE_SIX_DOF_SWITCH_THRESHOLD
    }

    return INITIAL_SIX_DOF_SWITCH_THRESHOLD
  }

  /**
   * At the beginning of interaction, the switch threshold should be lower to immediately start tracking the user's desired type of drag.
   * However if the user is already dragging via 6Dof, switching to drag via Touchpad should be more difficult to avoid accidental drag interruptions.
   */
  private get touchpadSwitchThreshold(): number {
    if (this.dragType === DragType.SixDof) {
      return OVERRIDE_TOUCHPAD_SWITCH_THRESHOLD
    }

    return INITIAL_TOUCHPAD_SWITCH_THRESHOLD
  }

  /**
   * If we are manipulating, we use the location of the phone as the start point.
   * Otherwise, we use the endpoint of the raycast.
   */
  get sixDofSwitchPosition(): vec3 | null {
    return this.isManipulating ? this.startPoint : this.endPoint
  }

  override get dragType(): DragType | null {
    return this._dragType
  }

  private override set dragType(type: DragType | null) {
    if (type === this.dragType) {
      return
    }

    this._dragType = type

    switch (type) {
      case DragType.SixDof:
        this.dragProvider = this.sixDofDragProvider
        // Reset the start position of Touchpad to accurately track when the user wants to switch to using Touchpad drag.
        this.touchpadStartPosition = this.touchpadCurrentPosition
        break
      case DragType.Touchpad:
        this.dragProvider = this.touchpadDragProvider
        // Reset the start position of 6DoF to accurately track when the user wants to switch to using 6DoF drag.
        this.sixDofStartPosition = this.sixDofCurrentPosition
    }
  }
}
