import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import Event from "../../Utils/Event"
import {validate} from "../../Utils/validate"
import {InteractionManager} from "../InteractionManager/InteractionManager"
import {DragProvider} from "./DragProvider"
import {
  DragType,
  Interactor,
  InteractorInputType,
  InteractorTriggerType,
  TargetingMode,
} from "./Interactor"

const TAG = "BaseInteractor"

/**
 * Defines API for {@link Interactor} type
 */
export default abstract class BaseInteractor
  extends BaseScriptComponent
  implements Interactor
{
  @ui.group_start("Interactor")
  /**
   * Should draw gizmos for visual debugging.
   */
  @input
  _drawDebug: boolean = false

  @ui.group_start("Spherecast Configuration")
  /**
   * Should use spherecast for targeting when raycast does not register a hit.
   */
  @input
  sphereCastEnabled: boolean = false
  @input("number[]", "{0.5, 2.0, 4.0}")
  @showIf("sphereCastEnabled", true)
  spherecastRadii: number[] = [0.5, 2.0, 4.0]
  @input("number[]", "{0, 12, 30}")
  @showIf("sphereCastEnabled", true)
  spherecastDistanceThresholds: number[] = [0, 12, 30]
  @ui.group_end
  @ui.group_start("Targeting Configuration")
  /**
   * The maximum distance at which the interactor can target interactables.
   */
  @input
  _maxRaycastDistance: number = 500
  @input
  indirectTargetingVolumeMultiplier: number = 1
  @ui.group_end
  @ui.group_start("Indirect Drag Provider")
  @input
  protected indirectDragThreshold: number = 3.0
  @ui.group_end
  @ui.group_end

  // Dependencies injection
  protected interactionManager = InteractionManager.getInstance()

  protected _dragProvider = new DragProvider(this.indirectDragThreshold)

  // To allow the planecast drag vector to always be available for 1:1 usage, the threshold should be 0.
  protected _planecastDragProvider = new DragProvider(0)

  /**
   * Defines the interactor's input type. This can be used for prioritization
   * or for discerning controller vs hands.
   */
  inputType = InteractorInputType.None

  /**
   * Returns the current targeted interactable or null.
   */
  currentInteractable: Interactable | null = null
  /**
   * Returns the previous targeted interactable or null.
   */
  previousInteractable: Interactable | null = null

  private onCurrentInteractableChangedEvent = new Event<Interactable | null>()

  /**
   * Called whenever the Interactor changes the target Interactable
   */
  onCurrentInteractableChanged =
    this.onCurrentInteractableChangedEvent.publicApi()

  /**
   * Returns the previous trigger value
   */
  previousTrigger = InteractorTriggerType.None

  /**
   * Returns the current trigger value
   */
  currentTrigger = InteractorTriggerType.None

  _currentDragVector: vec3 | null = null

  /**
   * Returns the nullable drag vector, computed in the
   * previous frame
   */
  previousDragVector: vec3 | null = null

  protected _previousStartPoint: vec3 | null = null

  constructor() {
    super()

    this.interactionManager.registerInteractor(this)
  }

  release(): void {
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

    this.currentInteractable = null
  }

  /**
   * Disables or enables the input powering this interactor
   * @param enabled whether the input powering the interactor should be enabled
   */
  setInputEnabled(enabled: boolean): void {}

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

  /**
   * Returns the current vector associated to a dragging
   * movement since the last frame, and null if not dragging
   */
  get currentDragVector(): vec3 | null {
    return this._currentDragVector
  }

  protected set currentDragVector(dragVector: vec3 | null) {
    this._currentDragVector = dragVector
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

      this.planecastDragProvider.getDragVector(
        this.planecastPoint,
        this.currentInteractable?.enableInstantDrag ?? null
      )
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
  public raycastPlaneIntersection(
    interactable: Interactable | null
  ): vec3 | null {
    const origin = this.startPoint
    const direction = this.direction

    if (origin === null || direction === null || interactable === null) {
      return null
    }

    // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
    // l0 represents ray origin, l represents direction, p0 represents plane origin, and n represents the plane normal.
    const normal = interactable.sceneObject.getTransform().forward
    const originToPlane = interactable.sceneObject
      .getTransform()
      .getWorldPosition()
      .sub(origin)

    const originDotProduct = originToPlane.dot(normal)
    const directionDotProduct = direction.dot(normal)

    const parametricValue = originDotProduct / directionDotProduct

    if (parametricValue >= 0) {
      return origin.add(direction.uniformScale(parametricValue))
    } else {
      return null
    }
  }

  /**
   * Projects the direct collider's position onto the plane defined by the Interactable's forward vector / origin
   * @param interactable - the Interactable used to define the plane of intersection
   * @returns the direct collider's position projected onto the plane
   */
  public colliderPlaneIntersection(
    interactable: Interactable | null
  ): vec3 | null {
    const origin = this.startPoint

    if (origin === null || interactable === null) {
      return null
    }

    // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
    // l0 represents ray origin, l represents direction, p0 represents plane origin, and n represents the plane normal.
    const normal = interactable.sceneObject.getTransform().forward
    const originToPlane = interactable.sceneObject
      .getTransform()
      .getWorldPosition()
      .sub(origin)

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
      this.onCurrentInteractableChangedEvent.invoke(this.currentInteractable)
    }
  }
}
