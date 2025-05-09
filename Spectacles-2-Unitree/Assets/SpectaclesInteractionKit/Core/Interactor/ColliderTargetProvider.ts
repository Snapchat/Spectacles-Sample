import {InteractionPlane} from "../../Components/Interaction/InteractionPlane/InteractionPlane"
import TargetProvider from "../../Providers/TargetProvider/TargetProvider"
import {notEmpty} from "../../Utils/notEmpty"
import BaseInteractor from "./BaseInteractor"

/**
 * Config for ColliderTargetProvider
 */
export type ColliderTargetProviderConfig = {
  shouldPreventTargetUpdate?: () => boolean
}

/**
 * Uses a collider positioned to detect a target
 */
export abstract class ColliderTargetProvider extends TargetProvider {
  protected ownerSceneObject: SceneObject

  // If the collider is in an interaction plane's interaction zone, cache the plane.
  protected _currentInteractionPlanes: InteractionPlane[] = []

  protected interactor: BaseInteractor
  constructor(
    interactor: BaseInteractor,
    protected config: ColliderTargetProviderConfig
  ) {
    super()
    this.interactor = interactor
    this.ownerSceneObject = global.scene.createSceneObject(
      "ColliderTargetProvider"
    )
    this.ownerSceneObject.setParent(this.interactor.sceneObject)
  }

  /** @inheritdoc */
  get startPoint(): vec3 {
    return this.colliderPosition
  }

  /** @inheritdoc */
  get endPoint(): vec3 {
    return this.colliderPosition
  }

  /**
   * Returns an array of InteractionPlanes with interaction zones overlapping with the collider.
   */
  get currentInteractionPlanes(): InteractionPlane[] {
    return this._currentInteractionPlanes
  }

  /**
   * Clears an InteractionPlane from the cache (in the event of the InteractionPlane being de-registered).
   * @param plane - the InteractionPlane to clear.
   */
  clearInteractionPlane(plane: InteractionPlane): void {
    const index = this.currentInteractionPlanes.indexOf(plane)

    if (index !== -1) {
      this._currentInteractionPlanes.splice(index, 1)
    }
  }

  /**
   * @returns the direct collider position for direct manipulation
   */
  get colliderPosition(): vec3 {
    return this.isAvailable()
      ? this.ownerSceneObject.getTransform().getWorldPosition()
      : vec3.zero()
  }

  /**
   * @returns true if target provider is available, false otherwise
   */
  protected abstract isAvailable(): boolean

  /**
   * @returns the collider next position
   */
  protected abstract getNextPosition(): vec3

  /** @inheritdoc */
  update(): void {
    if (this.isAvailable()) {
      const newPosition = this.getNextPosition()
      this.ownerSceneObject.getTransform().setWorldPosition(newPosition)
      this.ownerSceneObject.enabled = true
    } else {
      this.ownerSceneObject.enabled = false
      this.clearCurrentInteractableHitInfo()
      this._currentInteractionPlanes = []
    }
  }

  /** @inheritdoc */
  destroy(): void {
    this.ownerSceneObject.destroy()
  }

  protected createCollider(
    sceneObject: SceneObject,
    radius: number,
    onOverlapStay: ((eventArgs: OverlapStayEventArgs) => void) | null,
    onOverlapExit: ((eventArgs: OverlapExitEventArgs) => void) | null,
    debugDrawEnabled: boolean
  ): ColliderComponent {
    const collider = sceneObject.createComponent("Physics.ColliderComponent")

    const shape = Shape.createSphereShape()
    shape.radius = radius
    collider.shape = shape
    collider.intangible = true
    collider.debugDrawEnabled = debugDrawEnabled

    if (onOverlapStay !== null) {
      collider.onOverlapStay.add(onOverlapStay)
    }

    if (onOverlapExit !== null) {
      collider.onOverlapExit.add(onOverlapExit)
    }

    return collider
  }

  protected onColliderOverlapStay(
    event: OverlapEnterEventArgs,
    allowOutOfFovInteraction = true
  ): void {
    if (this.config.shouldPreventTargetUpdate?.()) {
      return
    }

    const hits: RayCastHit[] = event.currentOverlaps
      .map((overlap) => {
        try {
          return {
            collider: overlap.collider,
            distance: overlap.collider
              .getTransform()
              .getWorldPosition()
              .distance(this.endPoint),
            normal: vec3.zero(),
            position: this.endPoint,
            skipRemaining: false,
            t: 0,
            triangle: null,
            getTypeName: overlap.collider.getTypeName,
            isTypeOf: overlap.collider.isOfType,
            isSame: overlap.collider.isSame,
            isOfType: overlap.collider.isOfType,
          } as RayCastHit
        } catch {
          return null
        }
      })
      .filter(notEmpty)

    this._currentInteractableHitInfo = this.getInteractableHitFromRayCast(
      hits,
      0,
      allowOutOfFovInteraction
    )

    this.updateInteractionPlanesFromOverlap(event.currentOverlaps)
  }

  protected onColliderOverlapExit(event: OverlapEnterEventArgs): void {
    if (
      event.overlap.collider === this._currentInteractableHitInfo?.hit.collider
    ) {
      this._currentInteractableHitInfo = null
    }

    this.removeInteractionPlaneFromOverlap(event.overlap)
  }

  protected updateInteractionPlanesFromOverlap(overlaps: Overlap[]): void {
    for (const overlap of overlaps) {
      const plane = overlap.collider
        .getSceneObject()
        .getComponent(InteractionPlane.getTypeName())
      if (plane !== null && !this._currentInteractionPlanes.includes(plane)) {
        this._currentInteractionPlanes.push(plane)
      }
    }
  }

  protected removeInteractionPlaneFromOverlap(overlap: Overlap): void {
    const plane = overlap.collider
      .getSceneObject()
      .getComponent(InteractionPlane.getTypeName())
    if (plane !== null) {
      const index = this.currentInteractionPlanes.indexOf(plane)

      if (index !== -1) {
        this._currentInteractionPlanes.splice(index, 1)
      }
    }
  }
}
