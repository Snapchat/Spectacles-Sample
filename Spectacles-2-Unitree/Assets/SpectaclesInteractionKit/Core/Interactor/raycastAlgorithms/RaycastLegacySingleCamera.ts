import {validate} from "../../../Utils/validate"
import {RaycastInfo} from "../RayProvider"
import RaycastBase from "./RaycastBase"

const SHOULDER_POSITION_RELATIVE_TO_CAMERA = new vec3(15, -20, 0)

/**
 * Raycast Legacy uses the algorithm previously used for Hermosa ray casting.
 * Meant for use with single-camera tracking, to unblock anything requiring more stable targeting until stereo tracking is available
 */
export default class RaycastLegacySingleCamera extends RaycastBase {
  /**
   * Calculates a simple ray direction anchor based on camera position only.
   * @returns ray direction anchor
   */
  private calculateRayDirectionAnchor(): vec3 {
    return this.camera
      .getWorldTransform()
      .multiplyPoint(SHOULDER_POSITION_RELATIVE_TO_CAMERA)
  }

  getRay(): RaycastInfo | null {
    if (this.hand.middleKnuckle === null) {
      return null
    } else {
      // Find the ray direction
      let targetingRay = this.hand.middleKnuckle.position.sub(
        this.calculateRayDirectionAnchor()
      )

      validate(this.locusOneEuroFilter)
      validate(this.directionOneEuroFilter)

      return {
        locus: this.locusOneEuroFilter.filter(
          this.hand.middleKnuckle.position,
          getTime()
        ),
        direction: this.directionOneEuroFilter
          .filter(targetingRay, getTime())
          .normalize(),
      }
    }
  }
}
