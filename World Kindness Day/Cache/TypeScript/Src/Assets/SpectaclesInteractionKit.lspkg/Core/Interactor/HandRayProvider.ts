import {RaycastInfo, RayProvider} from "./RayProvider"

import {HandInputData} from "../../Providers/HandInputData/HandInputData"
import {HandType} from "../../Providers/HandInputData/HandType"
import {interpolateVec3} from "../../Utils/mathUtils"
import {FieldTargetingMode, HandInteractor} from "../HandInteractor/HandInteractor"
import {InteractorTriggerType} from "./Interactor"
import RaycastProxy from "./raycastAlgorithms/RaycastProxy"

export type HandRayProviderConfig = {
  handType: HandType
  handInteractor: HandInteractor
}

/**
 * This class provides raycasting functionality for hand interactions. It selects the appropriate raycast algorithm based on the provided configuration.
 */
export class HandRayProvider implements RayProvider {
  private handProvider: HandInputData = HandInputData.getInstance()

  private hand = this.handProvider.getHand(this.config.handType)

  private lerpValue: number = 0
  private offsetDistance: number = 0

  readonly raycast = new RaycastProxy(this.hand)

  constructor(private config: HandRayProviderConfig) {}

  /** @inheritdoc */
  getRaycastInfo(): RaycastInfo {
    const ray = this.raycast.getRay()

    if (ray === null) {
      return {
        direction: vec3.zero(),
        locus: vec3.zero()
      }
    }

    // When not near an InteractionPlane, use the raycast base's logic for direction / locus.
    if (this.config.handInteractor.fieldTargetingMode === FieldTargetingMode.FarField) {
      return ray
    }
    // When near an InteractionPlane, raycast from the index tip straight towards the plane.
    else {
      const indexTip = this.hand.indexTip?.position

      if (indexTip === undefined) {
        return {
          direction: vec3.zero(),
          locus: vec3.zero()
        }
      }

      const planeProjection = this.config.handInteractor.currentInteractionPlane?.projectPoint(indexTip) ?? null

      if (planeProjection === null) {
        return {
          direction: vec3.zero(),
          locus: vec3.zero()
        }
      } else {
        // When transitioning to/from nearfield mode, lerp between GestureModule data and projection data.
        if (this.config.handInteractor.currentTrigger === InteractorTriggerType.None) {
          this.lerpValue = planeProjection.lerpValue

          // Offset the locus of the raycast to be exactly where the direct zone starts to prevent physics issues.
          const directZoneDistance = this.config.handInteractor.currentInteractionPlane!.directZoneDistance
          this.offsetDistance =
            planeProjection.distance <= directZoneDistance ? directZoneDistance - planeProjection.distance : 0
        }

        const startDirection = ray.direction
        let targetDirection = planeProjection.point.sub(indexTip).normalize()
        if (planeProjection.isWithinBehindZone) {
          targetDirection = targetDirection.uniformScale(-1)
        }
        const lerpDirection = vec3.slerp(startDirection, targetDirection, this.lerpValue)

        const startLocus = ray.locus

        const targetLocus = indexTip.add(targetDirection.uniformScale(-this.offsetDistance))
        const lerpLocus = interpolateVec3(startLocus, targetLocus, this.lerpValue)

        return {
          direction: lerpDirection,
          locus: lerpLocus
        }
      }
    }
  }

  /** @inheritdoc */
  isAvailable(): boolean {
    return (this.hand.isInTargetingPose() && this.hand.isTracked()) || this.hand.isPinching()
  }

  /** @inheritdoc */
  reset(): void {
    this.raycast.reset()
  }
}
