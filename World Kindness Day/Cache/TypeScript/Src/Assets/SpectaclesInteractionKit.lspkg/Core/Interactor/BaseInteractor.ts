import {DragType, Interactor, InteractorInputType, InteractorTriggerType, TargetingMode} from "./Interactor"

import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import TargetProvider, {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import Event from "../../Utils/Event"
import {validate} from "../../Utils/validate"
import {InteractionManager} from "../InteractionManager/InteractionManager"
import {PokeTargetProvider} from "../Interactor/PokeTargetProvider"
import {DragProvider} from "./DragProvider"

/**
 * Defines API for {@link Interactor} type
 */
export default abstract class BaseInteractor extends BaseScriptComponent implements Interactor {
  @ui.group_start("Interactor")
  /**
   * Should draw gizmos for visual debugging.
   */
  @input
  @hint("Should draw gizmos for visual debugging.")
  _drawDebug: boolean = false

  @ui.group_start("Spherecast Configuration")
  /**
   * Should use spherecast for targeting when raycast does not register a hit.
   */
  @input
  @hint("Should use spherecast for targeting when raycast does not register a hit.")
  sphereCastEnabled: boolean = false
  /**
   * Defines the radii (in cm) used for progressive spherecasting when raycast fails to hit a target. Used in
   * sequence with spherecastDistanceThresholds to perform increasingly larger sphere casts until a target is found.
   * Smaller radii provide more precise targeting while larger radii help target small or distant objects. Must have the
   * same array length as spherecastDistanceThresholds.
   */
  @input("number[]", "{0.5, 2.0, 4.0}")
  @showIf("sphereCastEnabled", true)
  @hint(
    "Defines the radii (in cm) used for progressive spherecasting when raycast fails to hit a target. Used in \
sequence with spherecastDistanceThresholds to perform increasingly larger sphere casts until a target is found. \
Smaller radii provide more precise targeting while larger radii help target small or distant objects. Must have the \
same array length as spherecastDistanceThresholds."
  )
  spherecastRadii: number[] = [0.5, 2.0, 4.0]
  /**
   * Defines distance offsets (in cm) from the ray origin for performing sphere casts. Each value creates a sphere
   * cast starting point at [ray origin + (direction * offset)]. Used in sequence with spherecastRadii, with the system
   * trying progressively larger sphere casts until a target is found. Helps improve targeting of small or distant
   * objects. Must have the same array length as spherecastRadii.
   */
  @input("number[]", "{0, 12, 30}")
  @showIf("sphereCastEnabled", true)
  @hint(
    "Defines distance offsets (in cm) from the ray origin for performing sphere casts. Each value creates a sphere \
cast starting point at [ray origin + (direction * offset)]. Used in sequence with spherecastRadii, with the system \
trying progressively larger sphere casts until a target is found. Helps improve targeting of small or distant \
objects. Must have the same array length as spherecastRadii."
  )
  spherecastDistanceThresholds: number[] = [0, 12, 30]
  @ui.group_end
  @ui.group_start("Targeting Configuration")
  /**
   * The maximum distance at which the interactor can target interactables.
   */
  @input
  @hint("The maximum distance at which the interactor can target interactables.")
  _maxRaycastDistance: number = 500
  /**
   * A multiplier applied to spherecast radii when using indirect targeting. Larger values create wider targeting
   * areas, making it easier to target objects at the expense of precision. Smaller values provide more precise
   * targeting.
   */
  @input
  @hint(
    "A multiplier applied to spherecast radii when using indirect targeting. Larger values create wider targeting \
areas, making it easier to target objects at the expense of precision. Smaller values provide more precise \
targeting."
  )
  indirectTargetingVolumeMultiplier: number = 1
  @ui.group_end
  @ui.group_start("Indirect Drag Provider")
  /**
   * Controls the minimum distance (in cm) the hand must move during indirect interaction to be considered a drag.
   * When the distance between the interaction origin position and current position exceeds this threshold, dragging
   * behavior is detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher
   * values require more deliberate movement before dragging begins.
   */
  @input
  @hint(
    "Controls the minimum distance (in cm) the hand must move during indirect interaction to be considered a drag. \
When the distance between the interaction origin position and current position exceeds this threshold, dragging \
behavior is detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher \
values require more deliberate movement before dragging begins."
  )
  protected indirectDragThreshold: number = 3.0
  @ui.group_end
  @ui.group_end

  // Dependencies injection
  protected interactionManager = InteractionManager.getInstance()

  protected _dragProvider = new DragProvider(this.indirectDragThreshold)

  // To allow the planecast drag vector to always be available for 1:1 usage, the threshold should be 0.
  protected _planecastDragProvider = new DragProvider(0)

  protected set inputType(inputType: InteractorInputType) {
    this._inputType = inputType
  }

  /**
   * Defines the interactor's input type. This can be used for prioritization
   * or for discerning controller vs hands.
   */
  get inputType(): InteractorInputType {
    return this._inputType
  }

  protected set currentInteractable(interactable: Interactable | null) {
    this._currentInteractable = interactable
  }

  /**
   * Returns the current targeted interactable or null.
   */
  get currentInteractable(): Interactable | null {
    return this._currentInteractable
  }

  protected set previousInteractable(interactable: Interactable | null) {
    this._previousInteractable = interactable
  }

  /**
   * Returns the previous targeted interactable or null.
   */
  get previousInteractable(): Interactable | null {
    return this._previousInteractable
  }

  private onCurrentInteractableChangedEvent = new Event<Interactable | null>()

  /**
   * Called whenever the Interactor changes the target Interactable
   */
  onCurrentInteractableChanged = this.onCurrentInteractableChangedEvent.publicApi()

  private onTriggerStartEvent = new Event<Interactable | null>()
  private onTriggerUpdateEvent = new Event<Interactable | null>()
  private onTriggerEndEvent = new Event<Interactable | null>()
  private onTriggerCanceledEvent = new Event<Interactable | null>()

  /**
   * Called whenever the Interactor enters the triggered state (regardless of if there is a target or not).
   */
  onTriggerStart = this.onTriggerStartEvent.publicApi()

  /**
   * Called whenever the Interactor remains in the triggered state (regardless of if there is a target or not).
   */
  onTriggerUpdate = this.onTriggerUpdateEvent.publicApi()

  /**
   * Called whenever the Interactor exits the triggered state (regardless of if there is a target or not).
   */
  onTriggerEnd = this.onTriggerEndEvent.publicApi()

  /**
   * Called whenever the Interactor is lost and was in a triggered state (regardless of if there is a target or not).
   */
  onTriggerCanceled = this.onTriggerCanceledEvent.publicApi()

  /**
   * Returns if the Interactor is in some generic triggering state in the current frame.
   */
  get isTriggering(): boolean {
    return this.currentTrigger !== InteractorTriggerType.None
  }

  /**
   * Returns if the Interactor was in some generic triggering state in the previous frame.
   */
  get wasTriggering(): boolean {
    return this.previousTrigger !== InteractorTriggerType.None
  }

  protected set previousTrigger(trigger: InteractorTriggerType) {
    this._previousTrigger = trigger
  }

  /**
   * Returns the previous trigger value
   */
  get previousTrigger(): InteractorTriggerType {
    return this._previousTrigger
  }

  protected set currentTrigger(trigger: InteractorTriggerType) {
    this._currentTrigger = trigger
  }
  /**
   * Returns the current trigger value
   */
  get currentTrigger(): InteractorTriggerType {
    return this._currentTrigger
  }

  _currentDragVector: vec3 | null = null

  protected set previousDragVector(dragVector: vec3 | null) {
    this._previousDragVector = dragVector
  }
  /**
   * Returns the nullable drag vector, computed in the
   * previous frame
   */
  get previousDragVector(): vec3 | null {
    return this._previousDragVector
  }

  protected _previousStartPoint: vec3 | null = null

  private _inputType = InteractorInputType.None
  private _currentInteractable: Interactable | null = null
  private _previousInteractable: Interactable | null = null
  private _previousTrigger = InteractorTriggerType.None
  private _currentTrigger = InteractorTriggerType.None
  private _previousDragVector: vec3 | null = null

  constructor() {
    super()

    this.interactionManager.registerInteractor(this)
    this.createEvent("OnDestroyEvent").bind(() => this.release())
  }

  private release(): void {
    this.interactionManager.deregisterInteractor(this)
  }

  /**
   * Updates the targeting and trigger state of the interactor
   */
  updateState(): void {
    this.previousInteractable = this.currentInteractable
    this.previousTrigger = this.currentTrigger
    this.previousDragVector = this.currentDragVector
    this._previousStartPoint = this.startPoint

    // These values need to be cached to differently because the target provider's set is only updated during
    // the lateUpdate of the frame, but updateState is called during the update of the frame.
    this._wasHoveringCurrentInteractable = this._isHoveringCurrentInteractable
    this._isHoveringCurrentInteractable = this.isHoveringCurrentInteractable

    this.currentInteractable = null
  }

  /**
   * Disables or enables the input powering this interactor
   * @param enabled whether the input powering the interactor should be enabled
   */
  setInputEnabled(_enabled: boolean): void {}

  /**
   * Clears the current Interactable, used when an Interactable is deleted at runtime
   */
  clearCurrentInteractable(): void {
    this.currentInteractable = null
    this.clearCurrentHitInfo()
  }

  /**
   * Returns the point where the interactor's ray starts.
   */
  abstract get startPoint(): vec3 | null

  /**
   * Returns the point where the interactor's ray ends.
   */
  abstract get endPoint(): vec3 | null

  /**
   * Returns the delta start position from previous frame
   */
  get deltaStartPosition(): vec3 | null {
    if (this.startPoint === null || this._previousStartPoint === null) {
      return null
    }
    return this.startPoint.sub(this._previousStartPoint)
  }

  /**
   * Returns the direction the interactor's ray is pointing toward.
   */
  abstract get direction(): vec3 | null

  /**
   * Returns the orientation of the interactor
   */
  abstract get orientation(): quat | null

  /**
   * @deprecated in favor of using targetHitInfo
   * Returns the distance to the current target in cm
   */
  abstract get distanceToTarget(): number | null

  /**
   * @deprecated in favor of using targetHitInfo
   * Returns the point at which the interactor intersected the current target
   */
  abstract get targetHitPosition(): vec3 | null

  /**
   * Returns the {@link InteractableHitInfo} describing the intersection with the current target
   * This includes information such as the intersection position/normal, the Interactable, the collider, etc
   */
  abstract get targetHitInfo(): InteractableHitInfo | null

  /**
   * Returns the maximum raycast length for world targeting in cm
   */
  abstract get maxRaycastDistance(): number

  /**
   * Returns the targeting mode used to obtain the targeted interactable
   */
  abstract get activeTargetingMode(): TargetingMode

  /**
   * Returns a normalized value from 0-1, where 0 is the lowest strength and
   * 1 the highest.
   * Returns null if the strength cannot be computed.
   */
  abstract get interactionStrength(): number | null

  /**
   * Returns true if the interaction ended inside the Interactable it started in. Updated when an interaction ends.
   */
  get endedInsideInteractable() {
    return this._endedInsideInteractable
  }
  private _endedInsideInteractable: boolean | null = null

  private interactionStartedInteractable: Interactable | null = null

  protected _wasHoveringCurrentInteractable: boolean | null = null
  protected _isHoveringCurrentInteractable: boolean | null = null

  /**
   * Returns true if the Interactor was hovering the current Interactable in the previous frame.
   */
  get wasHoveringCurrentInteractable(): boolean | null {
    return this._wasHoveringCurrentInteractable
  }

  /**
   * Returns true if the Interactor is hovering the current Interactable in the current frame.
   */
  abstract get isHoveringCurrentInteractable(): boolean | null

  /**
   * Returns a list of Interactables that the Interactor is hovering (targeting ray intersects w/ Interactable's collider).
   */
  abstract get hoveredInteractables(): Interactable[]

  /**
   * Returns true if the Interactor is hovering over the given Interactable.
   * An Interactor can hover over multiple overlapping Interactables at once, but only the most
   * deeply nested Interactable will receive the official onHover events.
   *
   * This is useful for creating custom behaviors when receiving onHoverEnter/Exit events during trigger.
   *
   * @param interactable - the Interactable to check for
   */
  abstract isHoveringInteractable(interactable: Interactable): boolean

  /**
   * Returns true if the Interactor is hovering over the given Interactable or any of its Interactable descendants.
   * An Interactor can hover over multiple overlapping Interactables at once, but only the most
   * deeply nested Interactable will receive the official onHover events.
   *
   * This is useful for creating custom behaviors when receiving onHoverEnter/Exit events during trigger.
   *
   * @param interactable - the Interactable to check for
   */
  abstract isHoveringInteractableHierarchy(interactable: Interactable): boolean

  protected handleSelectionLifecycle(targetProvider: TargetProvider): void {
    // Special case for Poke, always considered inside
    if (targetProvider instanceof PokeTargetProvider) {
      this._endedInsideInteractable = true
      this.interactionStartedInteractable = null
      return
    }

    const wasSelected = (this.previousTrigger & InteractorTriggerType.Select) !== 0
    const isSelected = (this.currentTrigger & InteractorTriggerType.Select) !== 0

    // Handle selection end
    if (wasSelected && !isSelected) {
      if (this.interactionStartedInteractable !== null) {
        this._endedInsideInteractable =
          targetProvider?.isHoveringInteractable(this.interactionStartedInteractable) ?? false

        this.interactionStartedInteractable = null
      }
    }
    // Handle selection start
    else if (!wasSelected && isSelected) {
      this.interactionStartedInteractable = targetProvider?.currentInteractableHitInfo?.interactable ?? null
    } else {
      this._endedInsideInteractable = null
    }
  }

  /**
   * Returns true if the interactor is actively targeting
   */
  abstract isTargeting(): boolean

  /**
   * Returns true if the interactor is active
   */
  abstract isActive(): boolean

  protected abstract clearCurrentHitInfo(): void

  get dragProvider(): DragProvider {
    return this._dragProvider
  }

  set dragProvider(provider: DragProvider | undefined) {
    validate(provider)
    this._dragProvider = provider
  }

  protected get planecastDragProvider(): DragProvider {
    return this._planecastDragProvider
  }

  protected set currentDragVector(dragVector: vec3 | null) {
    this._currentDragVector = dragVector
  }

  /**
   * Returns the current vector associated to a dragging
   * movement since the last frame, and null if not dragging
   */
  get currentDragVector(): vec3 | null {
    return this._currentDragVector
  }

  /**
   * @returns the drag vector projected onto the plane defined by the current Interactable's forward and origin
   */
  get planecastDragVector(): vec3 | null {
    return this.planecastDragProvider.currentDragVector
  }

  protected clearDragProviders(): void {
    this.dragProvider.clear()
    this.planecastDragProvider.clear()
  }

  protected updateDragVector(): void {
    if ((this.currentTrigger & InteractorTriggerType.Select) !== 0) {
      this.currentDragVector = this.dragProvider.getDragVector(
        this.getDragPoint(),
        this.currentInteractable?.enableInstantDrag ?? null
      )

      this.planecastDragProvider.getDragVector(this.planecastPoint, this.currentInteractable?.enableInstantDrag ?? null)
    } else {
      this.currentDragVector = null
      this.clearDragProviders()
    }
  }

  protected getDragPoint(): vec3 | null {
    return this.endPoint
  }

  get planecastPoint(): vec3 | null {
    return this.raycastPlaneIntersection(this.currentInteractable)
  }

  /**
   * Used to define the type of drag vector that the interactor is invoking.
   * By default, interactor drag vectors will be as SixDof drags.
   */
  get dragType(): DragType | null {
    if (this.currentDragVector !== null) {
      return DragType.SixDof
    }

    return null
  }

  /**
   * Set if the Interactor is should draw a debug gizmo of collider/raycasts in the scene.
   */
  abstract set drawDebug(debug: boolean)

  /**
   * @returns if the Interactor is currently drawing a debug gizmo of collider/raycasts in the scene.
   */
  abstract get drawDebug(): boolean

  /**
   * Calculates the intersection of the Interactor's indirect raycast and the plane defined by the Interactable's forward vector / origin
   * @param interactable - the Interactable used to define the plane of intersection
   * @returns the intersection point of the indirect raycast and plane
   */
  public raycastPlaneIntersection(interactable: Interactable | null): vec3 | null {
    const origin = this.startPoint
    const direction = this.direction

    if (origin === null || direction === null || interactable === null) {
      return null
    }

    // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
    // l0 represents ray origin, l represents direction, p0 represents plane origin, and n represents the plane normal.
    const normal = interactable.sceneObject.getTransform().forward
    const originToPlane = interactable.sceneObject.getTransform().getWorldPosition().sub(origin)

    const originDotProduct = originToPlane.dot(normal)
    const directionDotProduct = direction.dot(normal)

    const parametricValue = originDotProduct / directionDotProduct

    return origin.add(direction.uniformScale(parametricValue))
  }

  /**
   * Projects the direct collider's position onto the plane defined by the Interactable's forward vector / origin
   * @param interactable - the Interactable used to define the plane of intersection
   * @returns the direct collider's position projected onto the plane
   */
  public colliderPlaneIntersection(interactable: Interactable | null): vec3 | null {
    return this.positionPlaneIntersection(interactable, this.endPoint)
  }

  /**
   * Projects the given position onto the plane defined by the Interactable's forward vector / origin
   * @param interactable - the Interactable used to define the plane of intersection
   * @param position - the world position to project onto the plane
   * @returns the direct collider's position projected onto the plane
   */
  public positionPlaneIntersection(interactable: Interactable | null, position: vec3 | null): vec3 | null {
    const origin = position

    if (origin === null || interactable === null) {
      return null
    }

    // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
    // l0 represents ray origin, l represents direction, p0 represents plane origin, and n represents the plane normal.
    const normal = interactable.sceneObject.getTransform().forward
    const originToPlane = interactable.sceneObject.getTransform().getWorldPosition().sub(origin)

    const originDotProduct = originToPlane.dot(normal)
    const directionDotProduct = normal.dot(normal)

    const parametricValue = originDotProduct / directionDotProduct

    return origin.add(normal.uniformScale(parametricValue))
  }

  /**
   * Notifies that the Interactor has changed target Interactable
   */
  currentInteractableChanged = (): void => {
    if (this.currentInteractable !== this.previousInteractable) {
      this._wasHoveringCurrentInteractable = false
      this.onCurrentInteractableChangedEvent.invoke(this.currentInteractable)
    }
  }

  /**
   * Process the new currentTrigger and compare to previousTrigger to see what event to propagate.
   */
  protected processTriggerEvents() {
    if (!this.isActive()) {
      if ((InteractorTriggerType.Select & this.previousTrigger) !== 0) {
        this.onTriggerCanceledEvent.invoke(this.currentInteractable)
      }
    } else {
      if (
        this.previousTrigger === InteractorTriggerType.None &&
        (InteractorTriggerType.Select & this.currentTrigger) !== 0
      ) {
        this.onTriggerStartEvent.invoke(this.currentInteractable)
      } else if (this.previousTrigger === this.currentTrigger && this.currentTrigger !== InteractorTriggerType.None) {
        this.onTriggerUpdateEvent.invoke(this.currentInteractable)
      } else if (this.previousTrigger !== InteractorTriggerType.None) {
        this.onTriggerEndEvent.invoke(this.currentInteractable)
      }
    }
  }
}
