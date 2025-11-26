import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import BaseInteractor from "../Interactor/BaseInteractor"
import {InteractorInputType, InteractorTriggerType, TargetingMode} from "../Interactor/Interactor"
import MouseTargetProvider from "../Interactor/MouseTargetProvider"
import {TouchRayProvider} from "../Interactor/TouchRayProvider"

const TARGETING_VOLUME_MULTIPLIER = 1

/**
 * {@link Interactor} implementation used for touch bases interactions
 * to interact with {@link Interactable} components with the mouse cursor
 * in preview window of Lens Studio
 *
 * There are no events for mouse hover in Lens Studio so this class uses some technics to
 * achieve both hover and trigger events.
 */
@component
export class MouseInteractor extends BaseInteractor {
  @ui.group_start("MouseInteractor")
  /**
   * Sets the return value of MouseInteractor.activeTargetingMode for cases where non-indirect targeting needs to be
   * tested specifically. Useful whenever your code has checks for interactor.activeTargetingMode === TargetingMode.X.
   */
  @input
  @hint(
    "Sets the return value of MouseInteractor.activeTargetingMode for cases where non-indirect targeting needs to be \
tested specifically. Useful whenever your code has checks for interactor.activeTargetingMode === TargetingMode.X."
  )
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Direct", 1),
      new ComboBoxItem("Indirect", 2),
      new ComboBoxItem("All", 3),
      new ComboBoxItem("Poke", 4)
    ])
  )
  private mouseTargetingMode: number = 2
  @ui.group_end
  /**
   * Moves the interactor in depth to help test 3D interactions in z space.
   */
  @input
  @hint("Moves the interactor in depth to help test 3D interactions in z space.")
  private moveInDepth: boolean = false

  /**
   * Controls the maximum distance (in cm) that the mouse interactor will move back and forth along its ray direction
   * when moveInDepth is enabled. Higher values create larger depth movements, simulating interaction across a wider
   * z-range for testing 3D interactions.
   */
  @input
  @showIf("moveInDepth", true)
  @hint(
    "Controls the maximum distance (in cm) that the mouse interactor will move back and forth along its ray direction \
    when moveInDepth is enabled. Higher values create larger depth movements, simulating interaction across a wider \
    z-range for testing 3D interactions."
  )
  private moveInDepthAmount: number = 5

  private isDown = false

  private touchRayProvider!: TouchRayProvider
  private mouseTargetProvider!: MouseTargetProvider

  onAwake() {
    this.defineSceneEvents()
    this.defineTouchEvents()
    this.inputType = InteractorInputType.Mouse

    this.touchRayProvider = new TouchRayProvider(this, this.maxRaycastDistance)
    this.mouseTargetProvider = new MouseTargetProvider(this as BaseInteractor, {
      rayProvider: this.touchRayProvider,
      maxRayDistance: this.maxRaycastDistance,
      targetingVolumeMultiplier: TARGETING_VOLUME_MULTIPLIER,
      shouldPreventTargetUpdate: () => {
        return this.currentTrigger !== InteractorTriggerType.None && this.previousTrigger !== InteractorTriggerType.None
      },
      spherecastRadii: this.spherecastRadii,
      spherecastDistanceThresholds: this.spherecastDistanceThresholds
    })
  }

  constructor() {
    super()

    if (!global.deviceInfoSystem.isEditor()) {
      this.interactionManager.deregisterInteractor(this)
      this.enabled = false
    }
  }

  get startPoint(): vec3 | null {
    let p = this.mouseTargetProvider?.startPoint ?? null
    if (p && this.moveInDepth) {
      const moveAmount = (Math.sin(getTime()) + 1) * 0.5 * this.moveInDepthAmount
      p = p.add(this.mouseTargetProvider.direction.uniformScale(moveAmount))
    }
    return p
  }

  get endPoint(): vec3 | null {
    return this.mouseTargetProvider?.endPoint ?? null
  }

  get direction(): vec3 | null {
    return this.mouseTargetProvider?.direction ?? null
  }

  get distanceToTarget(): number | null {
    return this.mouseTargetProvider.currentInteractableHitInfo?.hit.distance ?? null
  }

  get targetHitPosition(): vec3 | null {
    return this.mouseTargetProvider.currentInteractableHitInfo?.hit.position ?? null
  }

  get targetHitInfo(): InteractableHitInfo | null {
    return this.mouseTargetProvider.currentInteractableHitInfo ?? null
  }

  get activeTargetingMode(): TargetingMode {
    return this.mouseTargetingMode
  }

  get maxRaycastDistance(): number {
    return this._maxRaycastDistance
  }

  get orientation(): quat | null {
    return quat.quatIdentity()
  }

  get interactionStrength(): number | null {
    return this.currentTrigger === InteractorTriggerType.Select ? 1 : 0.5
  }

  /**
   * Set if the Interactor is should draw a debug gizmo of collider/raycasts in the scene.
   */
  set drawDebug(debug: boolean) {
    this._drawDebug = debug

    // If the target providers have not been created yet, no need to manually set the drawDebug.
    if (!this.mouseTargetProvider) {
      return
    }

    this.mouseTargetProvider.drawDebug = debug
  }

  /**
   * @returns if the Interactor is currently drawing a debug gizmo of collider/raycasts in the scene.
   */
  get drawDebug(): boolean {
    return this._drawDebug
  }

  get isHoveringCurrentInteractable(): boolean | null {
    if (!this.currentInteractable) {
      return null
    }

    return this.mouseTargetProvider.isHoveringInteractable(this.currentInteractable)
  }

  get hoveredInteractables(): Interactable[] {
    const hoveredInteractables = Array.from(this.mouseTargetProvider.currentInteractableSet)

    return hoveredInteractables
  }

  isHoveringInteractable(interactable: Interactable): boolean {
    return this.mouseTargetProvider!.isHoveringInteractable(interactable)
  }

  isHoveringInteractableHierarchy(interactable: Interactable): boolean {
    if (this.mouseTargetProvider!.isHoveringInteractable(interactable)) {
      return true
    }

    for (const interactable of this.mouseTargetProvider!.currentInteractableSet) {
      if (interactable.isDescendantOf(interactable)) {
        return true
      }
    }
    return false
  }

  isActive(): boolean {
    return this.enabled && this.sceneObject.isEnabledInHierarchy
  }

  isTargeting(): boolean {
    return this.touchRayProvider !== undefined && this.touchRayProvider.isAvailable()
  }

  updateState(): void {
    super.updateState()

    if (!this.isActive()) {
      return
    }

    this.mouseTargetProvider.update()

    this.currentInteractable = this.mouseTargetProvider.currentInteractableHitInfo?.interactable ?? null

    this.currentTrigger = this.isDown ? InteractorTriggerType.Select : InteractorTriggerType.None

    this.updateDragVector()

    this.processTriggerEvents()

    this.handleSelectionLifecycle(this.mouseTargetProvider)
  }

  protected clearCurrentHitInfo(): void {
    this.mouseTargetProvider.clearCurrentInteractableHitInfo()
  }

  private defineSceneEvents(): void {
    this.createEvent("OnEnableEvent").bind(() => {
      this.enabled = true
    })

    this.createEvent("OnDisableEvent").bind(() => {
      this.enabled = false
    })
  }

  private defineTouchEvents(): void {
    this.createEvent("TouchStartEvent").bind((...args) => this.onTouchStartEvent(...args))

    this.createEvent("TouchEndEvent").bind((...args) => this.onTouchEndEvent(...args))
  }
  private onTouchStartEvent(_ev: TouchStartEvent): void {
    this.isDown = true
  }

  private onTouchEndEvent(_ev: TouchEndEvent): void {
    this.isDown = false
  }
}
