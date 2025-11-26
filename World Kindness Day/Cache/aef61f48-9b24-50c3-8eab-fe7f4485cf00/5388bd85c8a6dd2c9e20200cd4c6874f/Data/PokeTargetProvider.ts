import {Interactable} from "../../Components/Interaction//Interactable/Interactable"
import {HandMeshType} from "../../Components/Interaction/HandVisual/HandVisual"
import {HandInputData} from "../../Providers/HandInputData/HandInputData"
import {HandType} from "../../Providers/HandInputData/HandType"
import TargetProvider, {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import {clamp} from "../../Utils/mathUtils"
import {isDescendantOf} from "../../Utils/SceneObjectUtils"
import {TargetingMode} from "../Interactor/Interactor"

export type PokeTargetProviderConfig = {
  handType: HandType
  drawDebug: boolean
}

const POKE_SPHERECAST_RADIUS = 0.7
const POKE_SPHERECAST_UP_OFFSET = -0.36
const POKE_SPHERECAST_FORWARD_OFFSET = -0.11
const POKE_STRENGTH_DISTANCE_THRESHOLD_CM = 2.5
const PUSH_THROUGH_THRESHOLD_CM = 5.0
const POKE_DIRECTION_THRESHOLD = 0.6

enum PokeXDirection {
  None = 0,
  Right = 1,
  Left = 2,
  All = 3
}

enum PokeYDirection {
  None = 0,
  Up = 1,
  Down = 2,
  All = 3
}

enum PokeZDirection {
  None = 0,
  Forward = 1,
  Back = 2,
  All = 3
}

/**
 * Hand based poke target provider. Uses a sphere cast from index mid joint
 * to index tip
 */
export class PokeTargetProvider extends TargetProvider {
  readonly targetingMode: TargetingMode = TargetingMode.Poke

  private handProvider: HandInputData = HandInputData.getInstance()

  private hand = this.handProvider.getHand(this.config.handType)

  private probe = Physics.createGlobalProbe()

  private _drawDebug: boolean = this.config.drawDebug

  private initialPokePosition: vec3 | null = null

  private _pokeIsValid: boolean = true
  private _pokeDepth: number = 0
  private _tipToKnuckleDistance: number = 0

  private invalidPokeInteractables: Set<Interactable> = new Set<Interactable>()
  private currentlyRaycastInteractables: Set<Interactable> = new Set<Interactable>()

  private _hasPushedThrough: boolean = false

  private activePokeInteractable: Interactable | null = null

  constructor(protected config: PokeTargetProviderConfig) {
    super()
    this.probe.debugDrawEnabled = this.config.drawDebug
  }

  /** @inheritdoc */
  get startPoint(): vec3 {
    // TODO: Fix the offset when we put final meshes in: https://jira.sc-corp.net/browse/AXP-959
    const handVisuals = this.hand.getHandVisuals()
    const isFullMesh = handVisuals?.meshType === HandMeshType.Full
    const upOffset = isFullMesh ? 0 : POKE_SPHERECAST_UP_OFFSET

    // Extend the collider length to the mid joint after a poke has been entered, so we don't lose pokes too easily
    const hasInteractable = this._currentInteractableHitInfo !== null
    const indexUpperJointPos = this.hand.indexUpperJoint.position

    if (hasInteractable || !this._pokeIsValid) {
      // Extend, but avoid changing the original raycast angle by using the tip to upper joint direction
      const indexTipPos = this.hand.indexTip.position
      const indexTipUp = this.hand.indexTip.up
      const indexKnucklePos = this.hand.indexKnuckle.position
      const tipToKnuckledistance = indexTipPos.distance(indexKnucklePos)
      const tipToUpperJointDir = indexUpperJointPos.sub(indexTipPos).normalize()
      return indexTipPos
        .add(indexTipUp.uniformScale(upOffset))
        .add(tipToUpperJointDir.uniformScale(tipToKnuckledistance))
    } else {
      const indexTipUp = this.hand.indexTip.up
      return indexUpperJointPos.add(indexTipUp.uniformScale(upOffset))
    }
  }

  /** @inheritdoc */
  get endPoint(): vec3 {
    // TODO: Fix the offset when we put final meshes in: https://jira.sc-corp.net/browse/AXP-959
    const handVisuals = this.hand.getHandVisuals()
    const isFullMesh = handVisuals?.meshType === HandMeshType.Full
    const upOffset = isFullMesh ? 0 : POKE_SPHERECAST_UP_OFFSET
    const forwardOffset = isFullMesh ? 0 : POKE_SPHERECAST_FORWARD_OFFSET

    const indexTipPos = this.hand.indexTip.position
    const indexTipUp = this.hand.indexTip.up
    const indexTipBack = this.hand.indexTip.position.sub(this.startPoint).normalize()
    return indexTipPos
      .add(indexTipUp.uniformScale(upOffset))
      .sub(indexTipBack.uniformScale(POKE_SPHERECAST_RADIUS - forwardOffset))
  }

  get direction() {
    return this.startPoint.sub(this.endPoint).normalize()
  }

  getIndexFingerVelocity() {
    const objectSpecificData = this.hand.objectTracking3D.objectSpecificData
    if (objectSpecificData) {
      return (objectSpecificData as any)["index-3"]
    }

    return vec3.zero()
  }

  set drawDebug(debug: boolean) {
    this._drawDebug = debug

    this.probe.debugDrawEnabled = debug
  }

  get drawDebug(): boolean {
    return this._drawDebug
  }

  get pokeIsValid(): boolean {
    return this._pokeIsValid && !this._hasPushedThrough && this.isAvailable()
  }

  get hasPushedThrough(): boolean {
    return this._hasPushedThrough && this.isTriggering()
  }

  /**
   * Gets the current poke depth - the distance between the index finger tip and the hit surface.
   * @returns The poke depth in centimeters, or 0 if not currently poking an interactable.
   */
  get pokeDepth(): number {
    return this._pokeDepth
  }

  /**
   * Gets the normalized poke depth based on the tip-to-knuckle distance.
   * @returns A normalized value (0-1) where 1 represents a poke depth equal to the tip-to-knuckle distance.
   */
  get normalizedPokeDepth(): number {
    const epsilon = 1e-6
    if (this._tipToKnuckleDistance < epsilon) {
      return 0
    }
    return Math.min(this._pokeDepth / this._tipToKnuckleDistance, 1.0)
  }

  /** @inheritdoc */
  override get currentInteractableHitInfo(): InteractableHitInfo | null {
    return this._currentInteractableHitInfo !== null && this.isAvailable() ? this._currentInteractableHitInfo : null
  }

  /** @inheritdoc */
  override update(): void {
    if (!this.isAvailable()) {
      this._currentInteractableHitInfo = null
      this.initialPokePosition = null
      this._pokeIsValid = true
      this._hasPushedThrough = false
      this._pokeDepth = 0
      this._tipToKnuckleDistance = 0
      this.invalidPokeInteractables.clear()
      this.activePokeInteractable = null
      return
    }
    this.updateTipToKnuckleDistance()
    this.raycastJoints()
  }

  private updateTipToKnuckleDistance(): void {
    const indexTipPos = this.hand.indexTip.position
    const indexKnucklePos = this.hand.indexKnuckle.position
    this._tipToKnuckleDistance = indexTipPos.distance(indexKnucklePos)
  }

  private raycastJoints() {
    this.probe.sphereCastAll(POKE_SPHERECAST_RADIUS, this.startPoint, this.endPoint, (hits) => {
      this.updateCurrentInteractableSet(hits)

      const currentInteractable = this.currentInteractableHitInfo?.interactable ?? null
      this._currentInteractableHitInfo = this.getInteractableHitFromRayCast(hits)

      if (this.currentInteractableHitInfo === null) {
        this.initialPokePosition = null
      } else if (
        this.initialPokePosition === null ||
        this.currentInteractableHitInfo.interactable !== currentInteractable
      ) {
        this.initialPokePosition = this.currentInteractableHitInfo.hit.position
        if (this.activePokeInteractable === null)
          this.activePokeInteractable = this.currentInteractableHitInfo.interactable
      }
      this.checkPokeDepth()
    })
  }

  private checkPokeDepth(): void {
    if (!this.currentInteractableHitInfo) {
      this._hasPushedThrough = false
      this._pokeDepth = 0
      return
    }

    const hit = this.currentInteractableHitInfo.hit
    this._pokeDepth = hit.position.distance(this.endPoint)

    this._hasPushedThrough = this._pokeDepth > PUSH_THROUGH_THRESHOLD_CM
  }

  protected override getInteractableHitFromRayCast(
    hits: RayCastHit[],
    offset = 0,
    allowOutOfFovInteraction = false
  ): InteractableHitInfo | null {
    if (this.activePokeInteractable) {
      const stillTouchingOriginalHit = hits.find(
        (hit) => this.interactionManager.getInteractableByCollider(hit.collider) === this.activePokeInteractable
      )

      if (stillTouchingOriginalHit) {
        const hitInfo: InteractableHitInfo = {
          interactable: this.activePokeInteractable,
          localHitPosition: this.activePokeInteractable.sceneObject
            .getTransform()
            .getInvertedWorldTransform()
            .multiplyPoint(stillTouchingOriginalHit.position),
          hit: {
            collider: stillTouchingOriginalHit.collider,
            distance: stillTouchingOriginalHit.distance + offset,
            normal: stillTouchingOriginalHit.normal,
            position: stillTouchingOriginalHit.position,
            skipRemaining: stillTouchingOriginalHit.skipRemaining,
            t: stillTouchingOriginalHit.t,
            triangle: stillTouchingOriginalHit.triangle,
            getTypeName: stillTouchingOriginalHit.getTypeName,
            isOfType: stillTouchingOriginalHit.isOfType,
            isSame: stillTouchingOriginalHit.isSame
          },
          targetMode: this.targetingMode
        }
        return hitInfo
      } else {
        this.activePokeInteractable = null

        // Explicitly clear the current hit info to force the logic below to treat this as a new potential poke.
        this._currentInteractableHitInfo = null
      }
    }

    const hitInfos: InteractableHitInfo[] = []
    this.currentlyRaycastInteractables.clear()

    for (const hit of hits) {
      if (!allowOutOfFovInteraction && this.camera !== null && !this.camera.inFoV(hit.position)) {
        continue
      }

      const interactable = this.interactionManager.getInteractableByCollider(hit.collider)

      if (interactable !== null && (interactable.targetingMode & this.targetingMode) !== 0) {
        this.currentlyRaycastInteractables.add(interactable)

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
            skipRemaining: hit.skipRemaining,
            t: hit.t,
            triangle: hit.triangle,
            getTypeName: hit.getTypeName,
            isOfType: hit.isOfType,
            isSame: hit.isSame
          },
          targetMode: this.targetingMode
        })

        let isInvalidDirection = this.invalidPokeInteractables.has(interactable)

        // If we don't already know it's invalid and we're starting a new interaction, check the poke direction
        if (!isInvalidDirection && this._currentInteractableHitInfo === null) {
          const validPokeDirection = this.isValidPokeDirection(interactable)
          if (!validPokeDirection) {
            this.invalidPokeInteractables.add(interactable)
            this._pokeIsValid = false
            isInvalidDirection = true
          }
        }

        const shouldStartEvent = this._currentInteractableHitInfo === null && !isInvalidDirection

        const shouldUpdateEvent =
          this._currentInteractableHitInfo && interactable === this._currentInteractableHitInfo.interactable

        if (shouldStartEvent || shouldUpdateEvent) {
          this._pokeIsValid = true
        }
      }
    }

    if (this.currentlyRaycastInteractables.size === 0) {
      this._currentInteractableHitInfo = null
      this.initialPokePosition = null
      this._pokeIsValid = true
      this._hasPushedThrough = false
      this._pokeDepth = 0
      this.invalidPokeInteractables.clear()
      return null
    }

    for (const invalidInteractable of this.invalidPokeInteractables) {
      if (!this.currentlyRaycastInteractables.has(invalidInteractable)) {
        this.invalidPokeInteractables.delete(invalidInteractable)
      }
    }

    const validHitInfos = hitInfos.filter((hitInfo) => !this.invalidPokeInteractables.has(hitInfo.interactable))

    if (validHitInfos.length > 0) {
      return this.getNearestDeeplyNestedInteractable(validHitInfos)
    }

    return null
  }

  /**
   * Validates the directionality of a poke trigger.
   *
   * @param interactable - The interactable to check the poke directionality against.
   * @returns `true` if the poke directionality is valid, otherwise `false`.
   *
   */
  private isValidPokeDirection(interactable: Interactable): boolean {
    if (this.getIndexFingerVelocity().dot(this.direction) > 0) {
      return false
    }

    if (!interactable.enablePokeDirectionality) {
      return true
    }

    const transform = interactable.getTransform()
    const direction = this.getIndexFingerVelocity().normalize()
    if (
      ((interactable.acceptableXDirections & PokeXDirection.Left) !== 0 &&
        transform.left.dot(direction) <= -POKE_DIRECTION_THRESHOLD) ||
      ((interactable.acceptableXDirections & PokeXDirection.Right) !== 0 &&
        transform.right.dot(direction) <= -POKE_DIRECTION_THRESHOLD) ||
      ((interactable.acceptableYDirections & PokeYDirection.Up) !== 0 &&
        transform.up.dot(direction) <= -POKE_DIRECTION_THRESHOLD) ||
      ((interactable.acceptableYDirections & PokeYDirection.Down) !== 0 &&
        transform.down.dot(direction) <= -POKE_DIRECTION_THRESHOLD) ||
      ((interactable.acceptableZDirections & PokeZDirection.Forward) !== 0 &&
        transform.forward.dot(direction) <= -POKE_DIRECTION_THRESHOLD) ||
      ((interactable.acceptableZDirections & PokeZDirection.Back) !== 0 &&
        transform.back.dot(direction) <= -POKE_DIRECTION_THRESHOLD)
    ) {
      return true
    }

    return false
  }

  private getNearestDeeplyNestedInteractable(hitInfos: InteractableHitInfo[]): InteractableHitInfo | null {
    let targetHitInfo: InteractableHitInfo | null = null

    for (let i = hitInfos.length - 1; i >= 0; i--) {
      const currentHitInfo = hitInfos[i]
      if (
        targetHitInfo === null ||
        isDescendantOf(currentHitInfo.interactable.sceneObject, targetHitInfo.interactable.sceneObject)
      ) {
        targetHitInfo = currentHitInfo
      } else {
        break
      }
    }

    return targetHitInfo
  }

  /** @inheritdoc */
  override destroy(): void {}

  /**
   * Determines whether the poke target provider is currently triggering an interaction.
   *
   * @returns `true` if there is a current interactable hit and the provider is actively triggering, `false` otherwise.
   */
  isTriggering(): boolean {
    return this.currentInteractableHitInfo !== null
  }

  /**
   * Calculates the interaction strength based on the distance traveled from the initial poke position. The strength is
   * normalized between 0 and 1, where 0 represents no interaction and 1 represents maximum interaction strength when
   * the distance threshold is reached.
   *
   * @returns A normalized value between 0 and 1 representing the interaction strength, or 0 if no interaction is
   * active.
   */
  getInteractionStrength() {
    if (this.currentInteractableHitInfo === null || this.initialPokePosition === null) {
      return 0
    }
    const hit = this.currentInteractableHitInfo.hit

    const distance = hit.position.distance(this.initialPokePosition)

    const interactionStrength =
      clamp(distance, 0, POKE_STRENGTH_DISTANCE_THRESHOLD_CM) /
      Math.min(
        POKE_STRENGTH_DISTANCE_THRESHOLD_CM,
        this.initialPokePosition.distance(hit.collider.getTransform().getWorldPosition())
      )

    return interactionStrength
  }

  /**
   * Checks if the poke target provider is available for use by verifying hand tracking state.
   *
   * @returns `true` if the hand is tracked, `false` otherwise.
   */
  protected isAvailable(): boolean {
    return (
      this.hand.indexTip !== null && this.hand.indexUpperJoint !== null && this.hand.enabled && this.hand.isTracked()
    )
  }
}
