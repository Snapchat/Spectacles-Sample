import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractionManager} from "../../Core/InteractionManager/InteractionManager"
import {TargetingMode} from "../../Core/Interactor/Interactor"
import {isDescendantOf} from "../../Utils/SceneObjectUtils"
import CameraProvider from "../CameraProvider/CameraProvider"
import WorldCameraFinderProvider from "../CameraProvider/WorldCameraFinderProvider"

export type InteractableHitInfo = {
  /**
   * The {@link Interactable} that was hit
   */
  interactable: Interactable
  /**
   * The {@link vec3} representing the hit position relative to the Interactable's local space.
   */
  localHitPosition: vec3
  /**
   * The detected hit {@link RayCastHit} from the collision
   */
  hit: RayCastHit
  /**
   * The {@link TargetingMode} that resulted in this collision
   */
  targetMode: TargetingMode
}

/**
 * Base class for all target providers
 */
export default abstract class TargetProvider {
  abstract readonly targetingMode: TargetingMode

  protected camera = WorldCameraFinderProvider.getInstance()

  protected interactionManager = InteractionManager.getInstance()

  protected _currentInteractableHitInfo: InteractableHitInfo | null = null

  private _currentInteractableSet: Set<Interactable> = new Set()

  /**
   * @returns origin position in world space
   */
  abstract get startPoint(): vec3

  /**
   * @returns end position in world space
   */
  abstract get endPoint(): vec3

  /**
   * @returns the hit information {@link InteractableHitInfo} for the current interactable or null if there was no hit
   */
  get currentInteractableHitInfo(): InteractableHitInfo | null {
    return this._currentInteractableHitInfo
  }

  /**
   * Set the _currentInteractableHitInfo to null, used when an Interactable is deleted from Lens Studio, to keep state in sync
   */
  clearCurrentInteractableHitInfo(): void {
    this._currentInteractableHitInfo = null
    this._currentInteractableSet.clear()
  }

  /**
   * @returns whether the provider has found a target or not
   */
  hasTarget(): boolean {
    return this._currentInteractableHitInfo !== null
  }

  /**
   * @returns whether the TargetProvider is intersecting with the Interactable
   */
  isHoveringInteractable(interactable: Interactable): boolean {
    return this._currentInteractableSet.has(interactable)
  }

  get currentInteractableSet(): Set<Interactable> {
    return this._currentInteractableSet
  }

  protected updateCurrentInteractableSet(hits: RayCastHit[]): void {
    this._currentInteractableSet.clear()
    for (const hit of hits) {
      const interactable = this.interactionManager.getInteractableByCollider(hit.collider)
      if (interactable !== null && (interactable.targetingMode & this.targetingMode) !== 0) {
        this._currentInteractableSet.add(interactable)
      }
    }
  }

  protected deleteFromCurrentInteractableSet(interactable: Interactable | null): void {
    if (interactable !== null) {
      this._currentInteractableSet.delete(interactable)
    }
  }

  /**
   * Recomputes the target
   */
  abstract update(): void

  /** Destroys the provider */
  abstract destroy(): void

  /**
   * @param hits - list of {@link RayCastHit}
   * @param targetingMode  - targeting mode used to filter hits
   * @param getInteractableByCollider - function that is used to get the interactable associated to the collider
   * (to enable the method to be static)
   * @param offset - offset value that defines if the raycast was offset from the start point
   * @param camera - camera used to verify FoV
   * @param allowOutOfFovInteraction - whether interactions that are out of the camera's field of view are allowed
   * @returns the hit corresponding to the target from the list of hits
   */
  static getInteractableHitFromRayCast(
    hits: RayCastHit[],
    targetingMode: TargetingMode,
    getInteractableByCollider: (collider: ColliderComponent) => Interactable | null,
    offset = 0,
    camera: CameraProvider | null = null,
    allowOutOfFovInteraction = false
  ): InteractableHitInfo | null {
    const hitInfos: InteractableHitInfo[] = []
    for (const hit of hits) {
      if (!allowOutOfFovInteraction && camera !== null && !camera.inFoV(hit.position)) {
        continue
      }

      const interactable = getInteractableByCollider(hit.collider)

      if (interactable !== null && (interactable.targetingMode & targetingMode) !== 0) {
        hit.skipRemaining = false

        hitInfos.push({
          interactable: interactable,
          localHitPosition: interactable.sceneObject
            .getTransform()
            .getInvertedWorldTransform()
            .multiplyPoint(hit.position),
          hit: {
            collider: hit.collider,
            distance: hit.distance + offset,
            normal: hit.normal,
            position: hit.position,
            skipRemaining: false,
            t: 0,
            triangle: hit.triangle,
            getTypeName: hit.getTypeName,
            isOfType: hit.isOfType,
            isSame: hit.isSame
          },
          targetMode: targetingMode
        })
      }
    }

    return TargetProvider.getNearestDeeplyNestedInteractable(hitInfos)
  }

  /**
   * The nearest deeply nested interactable, is the latest descendant of a list of
   * interactables, when they are ordered by distance.
   * @param hitInfos - list of hits
   * @returns - the most deeply nested interactable of the nearest interactable
   */
  static getNearestDeeplyNestedInteractable(hitInfos: InteractableHitInfo[]): InteractableHitInfo | null {
    hitInfos.sort((hitA, hitB) => {
      return hitA.hit.distance - hitB.hit.distance
    })

    let targetHitInfo: InteractableHitInfo | null = null

    for (const currentHitInfo of hitInfos) {
      if (
        targetHitInfo === null ||
        isDescendantOf(currentHitInfo.interactable.sceneObject, targetHitInfo.interactable.sceneObject)
      ) {
        targetHitInfo = currentHitInfo
      }
    }

    return targetHitInfo
  }

  protected getInteractableHitFromRayCast(
    hits: RayCastHit[],
    offset = 0,
    allowOutOfFovInteraction = false
  ): InteractableHitInfo | null {
    return TargetProvider.getInteractableHitFromRayCast(
      hits,
      this.targetingMode,
      this.interactionManager.getInteractableByCollider.bind(this.interactionManager),
      offset,
      this.camera,
      allowOutOfFovInteraction
    )
  }
}
