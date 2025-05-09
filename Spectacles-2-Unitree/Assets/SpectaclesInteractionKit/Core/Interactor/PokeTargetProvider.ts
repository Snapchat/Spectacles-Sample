import {HandInputData} from "../../Providers/HandInputData/HandInputData"
import {HandType} from "../../Providers/HandInputData/HandType"
import TargetProvider, {
  InteractableHitInfo,
} from "../../Providers/TargetProvider/TargetProvider"
import {isDescendantOf} from "../../Utils/SceneObjectUtils"
import {TargetingMode} from "../Interactor/Interactor"
import {WindowMode} from "./raycastAlgorithms/TimeDataContainer"
import {TimedVec3Container} from "./raycastAlgorithms/TimedVec3Container"

export type PokeTargetProviderConfig = {
  handType: HandType
  drawDebug: boolean
}

const POKE_SPHERECAST_RADIUS = 0.7

/**
 * Hand based poke target provider. Uses a sphere cast from index mid joint
 * to index tip
 */
export class PokeTargetProvider extends TargetProvider {
  readonly targetingMode: TargetingMode = TargetingMode.Poke

  private handProvider: HandInputData = HandInputData.getInstance()

  private hand = this.handProvider.getHand(this.config.handType)

  private probe = Physics.createGlobalProbe()

  // Used to calculate the average velocity of the fingertip over the past few frames
  private endPointHistory = new TimedVec3Container(WindowMode.FRAME, 4)

  private _drawDebug: boolean = this.config.drawDebug

  constructor(protected config: PokeTargetProviderConfig) {
    super()
    this.probe.debugDrawEnabled = this.config.drawDebug
  }

  /** @inheritdoc */
  get startPoint(): vec3 {
    // Extend the collider length to the mid joint after a poke has been entered, so we don't lose pokes too easily
    return this._currentInteractableHitInfo !== null
      ? this.hand.indexKnuckle.position
      : this.hand.indexUpperJoint.position
  }

  /** @inheritdoc */
  get endPoint(): vec3 {
    return this.hand.indexTip.position
  }

  get direction() {
    return this.startPoint.sub(this.endPoint).normalize()
  }

  set drawDebug(debug: boolean) {
    this._drawDebug = debug

    this.probe.debugDrawEnabled = debug
  }

  get drawDebug(): boolean {
    return this._drawDebug
  }

  /** @inheritdoc */
  override get currentInteractableHitInfo(): InteractableHitInfo | null {
    return this._currentInteractableHitInfo !== null && this.isAvailable()
      ? this._currentInteractableHitInfo
      : null
  }

  /** @inheritdoc */
  update(): void {
    if (!this.isAvailable()) {
      this._currentInteractableHitInfo = null
      this.endPointHistory.clear()
      return
    }
    this.raycastJoints()
  }

  private raycastJoints() {
    this.probe.sphereCastAll(
      POKE_SPHERECAST_RADIUS,
      this.startPoint,
      this.endPoint,
      (hits) => {
        this._currentInteractableHitInfo =
          this.getInteractableHitFromRayCast(hits)

        this.endPointHistory.pushWithoutDuplicate(getTime(), this.endPoint)
      }
    )
  }

  private checkAlignment(position: vec3 | null) {
    if (position === null) {
      return false
    }

    const previousAverage = this.endPointHistory.average()
    if (previousAverage === null) {
      return false
    }

    return previousAverage.sub(position).dot(this.direction) > 0
  }

  protected override getInteractableHitFromRayCast(
    hits: RayCastHit[]
  ): InteractableHitInfo | null {
    const hitInfos: InteractableHitInfo[] = []
    for (const hit of hits) {
      const interactable = this.interactionManager.getInteractableByCollider(
        hit.collider
      )

      if (
        interactable !== null &&
        (interactable.targetingMode & this.targetingMode) !== 0
      ) {
        hit.skipRemaining = false

        hitInfos.push({
          interactable: interactable,
          localHitPosition: interactable.sceneObject
            .getTransform()
            .getInvertedWorldTransform()
            .multiplyPoint(hit.position),
          hit: {
            collider: hit.collider,
            distance: hit.distance,
            normal: hit.normal,
            position: hit.position,
            skipRemaining: false,
            t: 0,
            triangle: hit.triangle,
            getTypeName: hit.getTypeName,
            isOfType: hit.isOfType,
            isSame: hit.isSame,
          },
          targetMode: this.targetingMode,
        })
        if (
          //Poke Start Event
          (this._currentInteractableHitInfo === null &&
            this.checkAlignment(hit.position)) ||
          //Poke Update Event
          (this._currentInteractableHitInfo &&
            interactable === this._currentInteractableHitInfo.interactable)
        ) {
          return this.getNearestDeeplyNestedInteractable(hitInfos)
        }
      }
    }

    return null
  }

  private getNearestDeeplyNestedInteractable(
    hitInfos: InteractableHitInfo[]
  ): InteractableHitInfo | null {
    const infos = hitInfos.reverse()

    let targetHitInfo: InteractableHitInfo | null = null

    for (const currentHitInfo of infos) {
      if (
        targetHitInfo === null ||
        isDescendantOf(
          currentHitInfo.interactable.sceneObject,
          targetHitInfo.interactable.sceneObject
        )
      ) {
        targetHitInfo = currentHitInfo
      } else {
        break
      }
    }

    return targetHitInfo
  }

  /** @inheritdoc */
  destroy(): void {}

  /** @returns whether the target provider is triggering or not */
  isTriggering(): boolean {
    return this.currentInteractableHitInfo !== null
  }

  /** @inheritdoc */
  getInteractionStrength() {
    return this.currentInteractableHitInfo !== null ? 1 : 0
  }

  /** @inheritdoc */
  protected isAvailable(): boolean {
    return (
      this.hand.indexTip !== null &&
      this.hand.indexUpperJoint !== null &&
      this.hand.enabled &&
      this.hand.isTracked()
    )
  }
}
