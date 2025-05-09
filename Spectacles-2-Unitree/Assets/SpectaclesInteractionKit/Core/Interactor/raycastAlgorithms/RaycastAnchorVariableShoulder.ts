import {inverseLerp, transformPoint} from "../../../Utils/mathUtils"
import {RaycastInfo} from "../RayProvider"
import RaycastBase, {RayAlgorithmData} from "./RaycastBase"

//location of the elbow joint, should be tuned eventually
const ELBOW_LOCATION = new vec3(10, -10, -5)
//elbow joint radius, larger values = more sensitive motion & increased unwanted movement
const ELBOW_RADIUS = 10
//at 1 the joint is a half sphere, other vals create elliptical joints
const ELBOW_RADIUS_HORIZONTAL_FACTOR = 1
//the distance the hand can travel across and move the elbow joint
const ELBOW_TRACKED_RADIUS = 30
const ELBOW_RADIUS_HORIZONTAL = ELBOW_RADIUS * ELBOW_RADIUS_HORIZONTAL_FACTOR
const ELBOW_TRACKED_RADIUS_HORIZONTAL =
  ELBOW_TRACKED_RADIUS * ELBOW_RADIUS_HORIZONTAL_FACTOR
//how much more the wrist affects the targeting ray vs shoulder position
const WRIST_AMPLIFICATION = 2.5
//how much the elbow joint is offset from the shoulder
const ELBOW_Z_OFFSET_SCALE = 0.5

const TAG = "RaycastAnchorVariableShoulder"
/**
 * RayCastAnchorVariableShoulder
 */
export default class RaycastAnchorVariableShoulder extends RaycastBase {
  /**
   * Composes the vertical head transform given the camera's position
   */
  private getVerticalHeadTransform(): mat4 {
    const levelRotation: quat = quat.lookAt(this.camera.back(), vec3.up())
    return mat4.compose(
      this.camera.getWorldPosition(),
      levelRotation,
      this.camera.getLocalScale()
    )
  }

  private estimateShoulderPosition(handPosition: vec3): vec3 {
    const vertHeadTransformInvHand = this.getVerticalHeadTransform()
      .inverse()
      .multiplyPoint(handPosition)

    const handElevationHeadset = vertHeadTransformInvHand.y
    const handLateralHeadset = vertHeadTransformInvHand.x

    // Calculates an approximate elbow joint to determine shoulder location
    const elevationIntervalElbow = MathUtils.clamp(
      inverseLerp(
        ELBOW_LOCATION.y + ELBOW_TRACKED_RADIUS,
        ELBOW_LOCATION.y - ELBOW_TRACKED_RADIUS,
        handElevationHeadset
      ),
      0,
      1
    )

    const lateralIntervalElbow = MathUtils.clamp(
      inverseLerp(
        ELBOW_LOCATION.x + ELBOW_TRACKED_RADIUS_HORIZONTAL,
        ELBOW_LOCATION.x - ELBOW_TRACKED_RADIUS_HORIZONTAL,
        handLateralHeadset
      ),
      0,
      1
    )

    const lerpInvY = Math.abs(1 - elevationIntervalElbow ** 2)
    const lerpInvX = Math.abs(1 - lateralIntervalElbow ** 2)

    const variableElbowOffset = ELBOW_LOCATION.add(
      new vec3(
        Math.cos(lerpInvX * Math.PI * -1) * ELBOW_RADIUS_HORIZONTAL,
        Math.cos(lerpInvY * Math.PI * -1) * ELBOW_RADIUS,
        Math.sin(lerpInvX * Math.PI * -1) * ELBOW_RADIUS +
          Math.sin(lerpInvY * Math.PI * -1) * ELBOW_Z_OFFSET_SCALE
      )
    )
    return transformPoint(this.camera.getTransform(), variableElbowOffset)
  }

  getRay(): RaycastInfo | null {
    const data = this.getRayAlgorithmData()

    if (!this.isValid(data)) {
      return null
    }

    if (
      this.directionOneEuroFilter === null ||
      this.shoulderOneEuroFilter === null ||
      this.locusOneEuroFilter === null
    ) {
      return null
    }

    const locus = this.calculateInteractionLocus(data.thumb!, data.index!)
    const castAnchor = this.calculateCastAnchor(data.thumb!, data.mid!)

    const estimatedShoulder = this.estimateShoulderPosition(data.index!)
    const shoulder = this.shoulderOneEuroFilter.filter(
      estimatedShoulder,
      getTime()
    )

    const shoulderTargetingRay = castAnchor.sub(shoulder)
    const wristTargetingRay = castAnchor.sub(data.wrist!)
    const targetingRay = shoulderTargetingRay.add(
      wristTargetingRay.uniformScale(WRIST_AMPLIFICATION)
    )

    const smoothTargetingRay = this.directionOneEuroFilter.filter(
      targetingRay,
      getTime()
    )

    return {
      locus: this.locusOneEuroFilter.filter(locus, getTime()),
      direction: smoothTargetingRay.normalize(),
    }
  }

  isValid(data: RayAlgorithmData): boolean {
    return (
      data.thumb !== null &&
      data.index !== null &&
      data.mid !== null &&
      data.wrist !== null
    )
  }
}
