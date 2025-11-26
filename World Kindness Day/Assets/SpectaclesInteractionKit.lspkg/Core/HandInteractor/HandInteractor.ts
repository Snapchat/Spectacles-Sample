import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractionPlane} from "../../Components/Interaction/InteractionPlane/InteractionPlane"
import WorldCameraFinderProvider from "../../Providers/CameraProvider/WorldCameraFinderProvider"
import {HandInputData} from "../../Providers/HandInputData/HandInputData"
import {HandType} from "../../Providers/HandInputData/HandType"
import TrackedHand from "../../Providers/HandInputData/TrackedHand"
import TargetProvider, {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import Event, {PublicApi} from "../../Utils/Event"
import {validate} from "../../Utils/validate"
import BaseInteractor from "../Interactor/BaseInteractor"
import {DirectTargetProvider} from "../Interactor/DirectTargetProvider"
import {DragProvider} from "../Interactor/DragProvider"
import {HandRayProvider} from "../Interactor/HandRayProvider"
import IndirectTargetProvider from "../Interactor/IndirectTargetProvider"
import {InteractorInputType, InteractorTriggerType, TargetingMode} from "../Interactor/Interactor"
import {PokeTargetProvider} from "../Interactor/PokeTargetProvider"

/**
 * Enum representing the types of raycasts available for hand interactions.
 */
export type RaycastType = "AnchorShoulder" | "AnchorVariableShoulder" | "LegacySingleCamera" | "AnchorHead" | "Proxy"

export enum FieldTargetingMode {
  FarField,
  NearField,
  Direct,
  BehindNearField
}

const HANDUI_INTERACTION_DISTANCE_THRESHOLD_CM = 15

// The maximum allowed angle between the hand ray and the plane's normal for a near field interaction to be valid.
const NEAR_FIELD_ANGLE_THRESHOLD_RADIAN = Math.PI / 3

// The minimum pinch strength required to trigger a pinch instead of a poke during direct targeting.
export const MINIMUM_PINCH_STRENGTH = 0.2

/**
 * This class handles hand interactions within the Spectacles Interaction Kit. It provides various configurations for hand types and raycast types.
 *
 */
@component
export class HandInteractor extends BaseInteractor {
  @ui.group_start("Hand Interactor")
  /**
   * Specifies which hand this interactor tracks (left or right).
   */
  @input
  @hint("Specifies which hand this interactor tracks (left or right).")
  @widget(new ComboBoxWidget([new ComboBoxItem("Left", "left"), new ComboBoxItem("Right", "right")]))
  private handType: string = "right"

  /**
   * Forces the usage of Poke targeting when interacting near the nondominant hand's palm.
   */
  @input
  @hint("Forces the usage of Poke targeting when interacting near the nondominant hand's palm.")
  private forcePokeOnNonDominantPalmProximity: boolean = false

  /**
   * The radius in cm around the midpoint of the index/thumb to target Interactables.
   */
  @input
  @hint("The radius in cm around the midpoint of the index/thumb to target Interactables.")
  private directColliderEnterRadius: number = 1

  /**
   * The radius in cm around the midpoint of the index/thumb to de-target Interactables (for bistable thresholding).
   */
  @input
  @hint(
    "The radius in cm around the midpoint of the index/thumb to de-target Interactables (for bistable \
thresholding)."
  )
  private directColliderExitRadius: number = 1.5

  /**
   * Controls the minimum distance the hand must move during direct interaction to be considered a drag. When the
   * distance between the interaction origin position and current position exceeds this threshold, dragging behavior is
   * detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher values require
   * more deliberate movement before dragging begins.
   */
  @input
  @hint(
    "Controls the minimum distance the hand must move during direct interaction to be considered a drag. When the \
distance between the interaction origin position and current position exceeds this threshold, dragging behavior is \
detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher values require \
more deliberate movement before dragging begins."
  )
  private directDragThreshold: number = 3.0

  @ui.group_end
  protected handProvider: HandInputData = HandInputData.getInstance()

  private onFieldTargetingModeChangedEvent: Event<FieldTargetingMode> = new Event<FieldTargetingMode>()
  readonly onFieldTargetingModeChanged: PublicApi<FieldTargetingMode> =
    this.onFieldTargetingModeChangedEvent.publicApi()

  private _hand!: TrackedHand

  private handRayProvider!: HandRayProvider

  private indirectTargetProvider!: IndirectTargetProvider
  private indirectDragProvider!: DragProvider

  private directTargetProvider!: DirectTargetProvider
  private directDragProvider!: DragProvider

  private pokeTargetProvider!: PokeTargetProvider
  private activeTargetProvider!: TargetProvider

  private _fieldTargetingMode: FieldTargetingMode = FieldTargetingMode.FarField
  private _currentInteractionPlane: InteractionPlane | null = null

  private cameraProvider = WorldCameraFinderProvider.getInstance()

  onAwake(): void {
    this.inputType = this.handType === "left" ? InteractorInputType.LeftHand : InteractorInputType.RightHand

    this._hand = this.handProvider.getHand(this.handType as HandType)

    this.handRayProvider = new HandRayProvider({
      handType: this.handType as HandType,
      handInteractor: this
    })

    this.indirectTargetProvider = new IndirectTargetProvider(this as BaseInteractor, {
      maxRayDistance: this.maxRaycastDistance,
      rayProvider: this.handRayProvider,
      targetingVolumeMultiplier: this.indirectTargetingVolumeMultiplier,
      shouldPreventTargetUpdate: () => {
        return this.preventTargetUpdate()
      },
      spherecastRadii: this.spherecastRadii,
      spherecastDistanceThresholds: this.spherecastDistanceThresholds
    })
    this.indirectDragProvider = new DragProvider(this.indirectDragThreshold)

    if (this.directColliderEnterRadius >= this.directColliderExitRadius) {
      throw Error(
        `The direct collider enter radius should be less than the exit radius for bistable threshold behavior.`
      )
    }

    this.directTargetProvider = new DirectTargetProvider(this as BaseInteractor, {
      handType: this.handType as HandType,
      shouldPreventTargetUpdate: () => {
        return this.preventTargetUpdate()
      },
      sceneObjectName: `${this.handType === `left` ? `Left` : `Right`}HandColliderTargetProvider`,
      debugEnabled: this.drawDebug,
      colliderEnterRadius: this.directColliderEnterRadius,
      colliderExitRadius: this.directColliderExitRadius
    })
    this.directDragProvider = new DragProvider(this.directDragThreshold)

    this.pokeTargetProvider = new PokeTargetProvider({
      handType: this.handType as HandType,
      drawDebug: this.drawDebug
    })

    this.activeTargetProvider = this.indirectTargetProvider
    this.dragProvider = this.indirectDragProvider

    this.defineSceneEvents()
  }

  /**
   * @returns the TrackedHand that this HandInteractor is using for tracking information.
   */
  get hand(): TrackedHand {
    return this._hand
  }

  get startPoint(): vec3 | null {
    return this.activeTargetProvider?.startPoint ?? null
  }

  get endPoint(): vec3 | null {
    return this.activeTargetProvider?.endPoint ?? null
  }

  get direction(): vec3 | null {
    const proposedDirection =
      this.activeTargetingMode === TargetingMode.Poke
        ? this.pokeTargetProvider?.direction
        : this.indirectTargetProvider?.direction

    return proposedDirection ?? null
  }

  get orientation(): quat | null {
    return this.hand?.getPinchDirection() ?? null
  }

  get distanceToTarget(): number | null {
    return this.activeTargetProvider?.currentInteractableHitInfo?.hit.distance ?? null
  }

  get targetHitPosition(): vec3 | null {
    return this.activeTargetProvider?.currentInteractableHitInfo?.hit.position ?? null
  }

  get targetHitInfo(): InteractableHitInfo | null {
    return this.activeTargetProvider?.currentInteractableHitInfo ?? null
  }

  get activeTargetingMode(): TargetingMode {
    return this.activeTargetProvider?.targetingMode ?? TargetingMode.None
  }

  get maxRaycastDistance(): number {
    return this._maxRaycastDistance
  }

  get interactionStrength(): number | null {
    const proposedStrength =
      this.activeTargetingMode === TargetingMode.Poke
        ? this.pokeTargetProvider?.getInteractionStrength()
        : this.hand?.getPinchStrength()

    return proposedStrength ?? null
  }

  /**
   * Set if the Interactor is should draw a debug gizmo of collider/raycasts in the scene.
   */
  set drawDebug(debug: boolean) {
    this._drawDebug = debug

    // If the target providers have not been created yet, no need to manually set the drawDebug.
    if (!this.indirectTargetProvider || !this.directTargetProvider || !this.pokeTargetProvider) {
      return
    }

    this.indirectTargetProvider.drawDebug = debug
    this.directTargetProvider.drawDebug = debug
    this.pokeTargetProvider.drawDebug = debug
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

    // Since poke trigger only ends when the Interactable leaves the poke collider, isHoveringInteractable is not sufficient to check.
    // Checking for poke edge case is necessary to send the correct onTriggerEnd event.
    const pokedInteractable = this.pokeTargetProvider?.currentInteractableHitInfo?.interactable ?? null
    const wasPoking = this.previousTrigger === InteractorTriggerType.Poke

    if (wasPoking && this.previousInteractable !== null && pokedInteractable !== this.previousInteractable) {
      return true
    }

    return this.activeTargetProvider.isHoveringInteractable(this.currentInteractable)
  }

  get hoveredInteractables(): Interactable[] {
    const hoveredInteractables = Array.from(this.activeTargetProvider.currentInteractableSet)

    // Since poke trigger only ends when the Interactable leaves the poke collider, currentInteractableSet is not sufficient to check.
    // Checking for poke edge case is necessary to send accurate information right after a poke.
    const pokedInteractable = this.pokeTargetProvider?.currentInteractableHitInfo?.interactable ?? null
    const wasPoking = this.previousTrigger === InteractorTriggerType.Poke

    if (wasPoking && this.previousInteractable !== null && pokedInteractable !== this.previousInteractable) {
      hoveredInteractables.push(this.previousInteractable)
    }

    return hoveredInteractables
  }

  isHoveringInteractable(interactable: Interactable): boolean {
    return this.activeTargetProvider.isHoveringInteractable(interactable)
  }

  isHoveringInteractableHierarchy(interactable: Interactable): boolean {
    if (this.activeTargetProvider.isHoveringInteractable(interactable)) {
      return true
    }

    for (const interactable of this.activeTargetProvider.currentInteractableSet) {
      if (interactable.isDescendantOf(interactable)) {
        return true
      }
    }
    return false
  }

  override updateState(): void {
    super.updateState()
    this.updateTarget()
    this.updatePinchFilter()
    this.updateDragVector()

    this.processTriggerEvents()
  }

  protected override clearDragProviders(): void {
    this.directDragProvider?.clear()
    this.indirectDragProvider?.clear()
    this.planecastDragProvider.clear()
  }

  override get planecastDragVector(): vec3 | null {
    // If the hand has been recently found, return vec3.zero() to allow time to determine if pinch is sustained.
    if (this.hand === undefined) return vec3.zero()
    return this.hand.isRecentlyFound() ? vec3.zero() : this.planecastDragProvider.currentDragVector
  }

  protected override set currentDragVector(dragVector: vec3 | null) {
    this._currentDragVector = dragVector
  }

  override get currentDragVector(): vec3 | null {
    // If the hand has been recently found, return vec3.zero() to allow time to determine if pinch is sustained.
    if (this.hand === undefined) return vec3.zero()
    return this.hand.isRecentlyFound() ? vec3.zero() : this._currentDragVector
  }

  override get planecastPoint(): vec3 | null {
    if (this.activeTargetProvider === this.indirectTargetProvider) {
      return this.raycastPlaneIntersection(this.currentInteractable)
    } else if (this.activeTargetProvider === this.directTargetProvider) {
      return this.colliderPlaneIntersection(this.currentInteractable)
    } else if (this.activeTargetProvider === this.pokeTargetProvider) {
      return this.positionPlaneIntersection(this.currentInteractable, this.hand.indexTip.position)
    }

    return null
  }

  /**
   * Clears an InteractionPlane from the cache of planes if it is nearby.
   * @param plane
   */
  clearInteractionPlane(plane: InteractionPlane) {
    this.directTargetProvider.clearInteractionPlane(plane)

    const fieldTargetingMode = this.updateNearestPlane()

    if (this.fieldTargetingMode !== fieldTargetingMode) {
      this._fieldTargetingMode = fieldTargetingMode
      this.onFieldTargetingModeChangedEvent.invoke(fieldTargetingMode)
    }
  }

  get fieldTargetingMode(): FieldTargetingMode {
    return this._fieldTargetingMode
  }

  get currentInteractionPlane(): InteractionPlane | null {
    return this._currentInteractionPlane
  }

  /**
   * @returns a normalized value between 0 and 1 representing proximity to an InteractionPlane when in near field mode,
   *          null if in FarField mode.
   */
  get nearFieldProximity(): number | null {
    if (this.fieldTargetingMode === FieldTargetingMode.FarField || this.currentInteractionPlane === null) {
      return null
    }

    const planeProjection = this.currentInteractionPlane.projectPoint(this.hand.indexTip.position)

    if (planeProjection === null) {
      return null
    }

    if (
      this.fieldTargetingMode === FieldTargetingMode.NearField ||
      this.fieldTargetingMode === FieldTargetingMode.Direct
    ) {
      return 1 - planeProjection.distance / this.currentInteractionPlane.proximityDistance
    } else {
      return 1 + planeProjection.distance / this.currentInteractionPlane.behindDistance
    }
  }

  isTargeting(): boolean {
    return this.hand?.isInTargetingPose() ?? false
  }

  /**
   * Returns true if the hand interactor and the hand it is associated with are both enabled.
   */
  isActive(): boolean {
    return (
      this.enabled && (this.hand?.enabled ?? false) && !this.hand.isPhoneInHand && this.sceneObject.isEnabledInHierarchy
    )
  }

  /**
   * Returns true if the hand this interactor is associated with is both enabled and tracked.
   */
  isTracking(): boolean {
    validate(this.hand)

    return this.hand.enabled && this.hand.isTracked()
  }

  /**
   * Returns true if the hand is targeting via far field raycasting.
   */
  isFarField(): boolean {
    // If the hand is not yet triggering, check if the raycast actually intersects within the plane's bounds.
    if (
      !this.isTriggering &&
      this.currentInteractable !== null &&
      this.currentInteractionPlane !== null &&
      this.startPoint !== null &&
      this.targetHitInfo !== null
    ) {
      return !this.currentInteractionPlane.checkRayIntersection(this.startPoint, this.targetHitInfo.hit.position)
    } else {
      return this.fieldTargetingMode === FieldTargetingMode.FarField
    }
  }

  isWithinDirectZone(): boolean {
    return this.fieldTargetingMode === FieldTargetingMode.Direct
  }

  protected clearCurrentHitInfo(): void {
    this.indirectTargetProvider?.clearCurrentInteractableHitInfo()
    this.directTargetProvider?.clearCurrentInteractableHitInfo()
    this.pokeTargetProvider?.clearCurrentInteractableHitInfo()
  }

  /** @inheritdoc */
  override setInputEnabled(enabled: boolean): void {
    super.setInputEnabled(enabled)
    this.handProvider.getHand(this.handType as HandType).setEnabled(enabled)
  }

  private defineSceneEvents() {
    this.createEvent("OnDestroyEvent").bind(() => {
      this.onDestroy()
    })
  }

  private updateTarget(): void {
    if (!this.isActive()) {
      this.indirectTargetProvider?.reset()
      return
    }

    // If the user is mid-interaction, do not hijack raycast logic to avoid jerky interactions.
    if (!this.preventTargetUpdate()) {
      const fieldTargetingMode = this.updateNearestPlane()

      if (this.fieldTargetingMode !== fieldTargetingMode) {
        this._fieldTargetingMode = fieldTargetingMode
        this.onFieldTargetingModeChangedEvent.invoke(fieldTargetingMode)
      }
    }

    this.pokeTargetProvider?.update()

    const pokedInteractable = this.pokeTargetProvider?.currentInteractableHitInfo?.interactable ?? null
    const wasPoking = this.previousTrigger === InteractorTriggerType.Poke

    // Handle the case where the user slides from poking one Interactable to another. We need to send an onTriggerEnd
    // event for the previous Interactable first.
    if (wasPoking && this.previousInteractable !== null && pokedInteractable !== this.previousInteractable) {
      this.currentTrigger = InteractorTriggerType.None
      this.currentInteractable = this.previousInteractable // Assign the *old* interactable for one frame
      return
    }

    if (this.isPoking()) {
      this.activeTargetProvider = this.pokeTargetProvider
      this.dragProvider = this.directDragProvider
    } else {
      this.directTargetProvider?.update()
      this.indirectTargetProvider?.update()

      if ((this.previousTrigger & InteractorTriggerType.Select) === 0) {
        if (this.pokeTargetProvider?.hasTarget()) {
          this.activeTargetProvider = this.pokeTargetProvider
          this.dragProvider = this.directDragProvider
        } else if (this.directTargetProvider?.hasTarget()) {
          this.activeTargetProvider = this.directTargetProvider
          this.dragProvider = this.directDragProvider
        } else if (this.hand.targetingData?.intendsToTarget) {
          if (this.currentInteractionPlane) {
            const planeProjection = this.currentInteractionPlane.projectPoint(this.hand.indexTip.position)
            if (planeProjection !== null) {
              // If the hand is in the direct zone or behind zone, switch to direct or poke target provider.
              if (planeProjection.isWithinDirectZone || planeProjection.isWithinBehindZone) {
                const pinchStrength = this.hand.getPinchStrength()
                this.activeTargetProvider =
                  pinchStrength !== null && pinchStrength >= MINIMUM_PINCH_STRENGTH
                    ? this.directTargetProvider
                    : this.pokeTargetProvider
              }
              // Otherwise, the hand is in the normal interaction zone, so we switch to indirect target provider.
              else {
                this.activeTargetProvider = this.indirectTargetProvider
              }
              this.dragProvider = this.directDragProvider
            }
          } else {
            this.activeTargetProvider = this.indirectTargetProvider
            // During a near field raycast, use direct drag threshold.
            this.dragProvider =
              this.fieldTargetingMode === FieldTargetingMode.FarField
                ? this.indirectDragProvider
                : this.directDragProvider
          }
        }
        // If the hand is not intending to raycast target, choose the more likely of the collider target providers.
        else {
          const pinchStrength = this.hand.getPinchStrength()
          this.activeTargetProvider =
            pinchStrength !== null && pinchStrength >= MINIMUM_PINCH_STRENGTH
              ? this.directTargetProvider
              : this.pokeTargetProvider
          this.dragProvider = this.directDragProvider
        }
      }
    }

    if (this.isPoking()) {
      this.currentTrigger = InteractorTriggerType.Poke
    } else if (this.hand && this.hand.isPinching() && (this.previousTrigger & InteractorTriggerType.Poke) === 0) {
      this.currentTrigger = InteractorTriggerType.Pinch
    } else {
      this.currentTrigger = InteractorTriggerType.None
    }

    this.currentInteractable = this.activeTargetProvider?.currentInteractableHitInfo?.interactable ?? null

    this.handleSelectionLifecycle(this.activeTargetProvider)
  }

  private updatePinchFilter() {
    if (!this.isActive()) {
      return
    }

    if (this.currentInteractable === null) {
      this.hand.useFilteredPinch = false
      return
    }

    let useFilteredPinch = this.currentInteractable.useFilteredPinch
    let ancestor = this.currentInteractable.sceneObject.getParent()
    while (ancestor !== null) {
      const interactable = ancestor.getComponent(Interactable.getTypeName())
      if (interactable !== null) {
        useFilteredPinch = useFilteredPinch || interactable.useFilteredPinch
      }
      ancestor = ancestor.getParent()
    }

    this.hand.useFilteredPinch = useFilteredPinch
  }

  isPoking(): boolean {
    return this.activeTargetProvider === this.pokeTargetProvider && (this.pokeTargetProvider?.isTriggering() ?? false)
  }

  get pokeIsValid(): boolean {
    return this.pokeTargetProvider?.pokeIsValid ?? false
  }

  get pokeDepth(): number {
    return this.pokeTargetProvider?.pokeDepth ?? 0
  }

  get normalizedPokeDepth(): number {
    return this.pokeTargetProvider?.normalizedPokeDepth ?? 0
  }

  /**
   * @returns if we should prevent any updates to the currently targeted item.
   * In the case of pinching (indirect or direct) or poking, we prevent updates to the targeting system.
   * Otherwise, allow updates to the targeted item.
   */
  private preventTargetUpdate(): boolean {
    return this.hand !== undefined && (this.hand.isPinching() || this.isPoking())
  }

  private isPokingNonDominantHand(): boolean {
    return this.forcePokeOnNonDominantPalmProximity && this.isNearNonDominantHand()
  }

  private isNearNonDominantHand(): boolean {
    const nonDominantHand = this.handProvider.getNonDominantHand()
    const dominantHand = this.handProvider.getDominantHand()

    /** If either the dominant or non-dominant hand is not tracked,
     * or if both hands are in an active targeting pose,
     * then the user is not intending to interact with the nondominant hand UI.
     */
    if (
      !nonDominantHand.isTracked() ||
      !dominantHand.isTracked() ||
      (dominantHand.isInTargetingPose() && nonDominantHand.isInTargetingPose())
    ) {
      return false
    }

    // Detect if dominant index is within interaction proximity to non-dominant palm
    const palmCenter = nonDominantHand.getPalmCenter()
    const dominantIndexTip = dominantHand.indexTip?.position

    return (
      palmCenter !== null &&
      dominantIndexTip !== undefined &&
      palmCenter.distanceSquared(dominantIndexTip) <
        HANDUI_INTERACTION_DISTANCE_THRESHOLD_CM * HANDUI_INTERACTION_DISTANCE_THRESHOLD_CM
    )
  }

  // Check for cached planes (via direct collider overlap), choosing the nearest plane if multiple are available.
  private updateNearestPlane(): FieldTargetingMode {
    const interactionPlanes = this.directTargetProvider.currentInteractionPlanes

    let nearestPlane: InteractionPlane | null = null
    let distance = Number.POSITIVE_INFINITY

    const planeRaycastLocus = this.hand.indexTip.position
    if (planeRaycastLocus === null) {
      this._currentInteractionPlane = null
      return FieldTargetingMode.FarField
    }

    for (const interactionPlane of interactionPlanes) {
      const planeProjection = interactionPlane.projectPoint(planeRaycastLocus)

      // Check if the locus is within the interaction zone or behind zone, then check if the locus is closer to this plane than prior planes.
      const isNearPlane =
        planeProjection !== null &&
        (planeProjection.isWithinInteractionZone || planeProjection.isWithinBehindZone) &&
        Math.abs(planeProjection.distance) < distance

      const normal = interactionPlane.normal
      const handDirection = this.handRayProvider.raycast.getRay()

      // Check if the hand direction faces the plane enough to target the plane.
      const isTowardPlane =
        handDirection !== null &&
        handDirection.direction.angleTo(normal.uniformScale(-1)) < NEAR_FIELD_ANGLE_THRESHOLD_RADIAN

      // Rough check if InteractionPlane is mostly in FoV.
      const isInFov = planeProjection !== null ? this.cameraProvider.inFoV(planeProjection.point) : false

      // If all checks are true, cache the plane.
      if (isNearPlane && isTowardPlane && isInFov) {
        nearestPlane = interactionPlane
        distance = planeProjection.distance
      }
    }

    this._currentInteractionPlane = nearestPlane

    // Return to far field targeting if no nearby planes were found.
    if (this._currentInteractionPlane === null) {
      return FieldTargetingMode.FarField
    }

    // Check if the index tip is past the plane for purpose of visuals.
    const indexPoint = this.hand.indexTip.position
    const indexProjection = this._currentInteractionPlane.projectPoint(indexPoint)
    // The projection cannot be null because the HandInteractor just cached an InteractionPlane in the above code.
    const isIndexInBehindZone = indexProjection!.isWithinBehindZone
    const isIndexInDirectZone = indexProjection!.isWithinDirectZone

    if (isIndexInBehindZone) {
      return FieldTargetingMode.BehindNearField
    } else if (isIndexInDirectZone) {
      return FieldTargetingMode.Direct
    } else {
      return FieldTargetingMode.NearField
    }
  }

  private onDestroy() {
    this.directTargetProvider?.destroy()
    this.indirectTargetProvider?.destroy()
    this.pokeTargetProvider?.destroy()
  }
}
