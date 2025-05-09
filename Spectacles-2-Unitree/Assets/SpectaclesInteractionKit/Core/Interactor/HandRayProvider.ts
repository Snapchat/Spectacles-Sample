import {RaycastInfo, RayProvider} from "./RayProvider"

import {HandInputData} from "../../Providers/HandInputData/HandInputData"
import {HandType} from "../../Providers/HandInputData/HandType"
import {
  FieldTargetingMode,
  HandInteractor,
  RaycastType,
} from "../HandInteractor/HandInteractor"
import RaycastAnchorHead from "./raycastAlgorithms/RaycastAnchorHead"
import RaycastAnchorVariableShoulder from "./raycastAlgorithms/RaycastAnchorVariableShoulder"
import RaycastBase from "./raycastAlgorithms/RaycastBase"
import RaycastLegacySingleCamera from "./raycastAlgorithms/RaycastLegacySingleCamera"
import RaycastProxy from "./raycastAlgorithms/RaycastProxy"

export type HandRayProviderConfig = {
  raycastAlgorithm: RaycastType
  handType: HandType
  handInteractor: HandInteractor
}

/**
 * This class provides raycasting functionality for hand interactions. It selects the appropriate raycast algorithm based on the provided configuration.
 */
export class HandRayProvider implements RayProvider {
  readonly raycast: RaycastBase

  private handProvider: HandInputData = HandInputData.getInstance()

  private hand = this.handProvider.getHand(this.config.handType)

  constructor(private config: HandRayProviderConfig) {
    // Set raycast algorithm used
    switch (config.raycastAlgorithm) {
      case "LegacySingleCamera": {
        this.raycast = new RaycastLegacySingleCamera(this.hand)
        break
      }
      case "AnchorHead": {
        this.raycast = new RaycastAnchorHead(this.hand)
        break
      }
      case "Proxy": {
        this.raycast = new RaycastProxy(this.hand)
        break
      }
      default: {
        this.raycast = new RaycastAnchorVariableShoulder(this.hand)
        break
      }
    }
  }

  /** @inheritdoc */
  getRaycastInfo(): RaycastInfo {
    // When not near an InteractionPlane, use the raycast base's logic for direction / locus.
    if (
      this.config.handInteractor.fieldTargetingMode ===
      FieldTargetingMode.FarField
    ) {
      return (
        this.raycast.getRay() ?? {
          direction: vec3.zero(),
          locus: vec3.zero(),
        }
      )
    }
    // When near an InteractionPlane, raycast from the midpoint straight towards the plane.
    else {
      const indexTip = this.hand.indexTip?.position
      const thumbTip = this.hand.thumbTip?.position

      if (indexTip === undefined || thumbTip === undefined) {
        return {
          direction: vec3.zero(),
          locus: vec3.zero(),
        }
      }

      const locus = indexTip.add(thumbTip).uniformScale(0.5)
      const planeProjection =
        this.config.handInteractor.currentInteractionPlane.projectPoint(locus)

      if (planeProjection === null) {
        return {
          direction: vec3.zero(),
          locus: vec3.zero(),
        }
      } else {
        return {
          direction: planeProjection.point.sub(locus).normalize(),
          locus: locus,
        }
      }
    }
  }

  /** @inheritdoc */
  isAvailable(): boolean {
    return (
      (this.hand.isInTargetingPose() && this.hand.isTracked()) ||
      this.hand.isPinching()
    )
  }

  /** @inheritdoc */
  reset(): void {
    this.raycast.reset()
  }
}
