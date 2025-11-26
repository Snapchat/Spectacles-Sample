import {RotationAxis} from "./BillboardController"

export type RotationCalculatorConfig = {
  axis: RotationAxis
  axisEnabled?: boolean
  axisBufferRadians?: number
  axisEasing?: number
}

const DEFAULT_DURATION = 0.033
export const ALMOST_ONE = 1 - Number.MIN_VALUE

/**
 * BillboardRotationCalculator is used to calculate the quaternion to rotate an object by to align with a new vector along an axis.
 * More specifically, this calculator is used along a SceneObject's local X/Z-axes and global Y-axis.
 * These calculators only take in vec3's as SceneObject manipulation is handled in BillboardController.
 */
export default class BillboardRotationCalculator {
  private axis: RotationAxis
  private _axisEnabled: boolean = false

  private _axisBufferRadians: number = 0

  // Use an estimated time for the duration between each update to prevent FPS issues from slowing down billboarding effect.
  private duration: number = 0
  private _axisEasing: number = 1

  constructor(config: RotationCalculatorConfig) {
    this.axis = config.axis
    this.axisEnabled = config.axisEnabled ?? false
    this.axisBufferRadians = config.axisBufferRadians ?? 0
    this.axisEasing = config.axisEasing ?? 1
  }

  get axisEnabled(): boolean {
    return this._axisEnabled
  }
  set axisEnabled(enabled: boolean) {
    this._axisEnabled = enabled
  }

  get axisBufferRadians(): number {
    return this._axisBufferRadians
  }
  set axisBufferRadians(radians: number) {
    this._axisBufferRadians = radians
  }

  get axisEasing(): number {
    return this._axisEasing
  }
  set axisEasing(easing: number) {
    this._axisEasing = easing
  }

  // Returns the quaternion representing the rotation necessary for the target to align with the camera.
  private calculateRotationQuaternion(rotationRadians: number, axisVector: vec3): quat {
    const rotationQuaternion: quat = quat.angleAxis(rotationRadians, axisVector)

    return rotationQuaternion
  }

  // Returns the exact angle to rotate the target by along the given axis.
  // This function will include the logic for interpolation / buffer tolerances later.
  private calculateAxisRotation(angle: number): number {
    if (!this.axisEnabled || Math.abs(angle) < this.axisBufferRadians) {
      return 0
    }

    // Calculate the angle to rotate just enough to keep the camera within the buffer cone.
    const bufferAngle = angle - Math.sign(angle) * this.axisBufferRadians

    if (this.axisEasing !== 1) {
      // If more time has passed than the expected duration, we should rotate more to prevent FPS issues slowing down animations.
      const timeRatio = getDeltaTime() / DEFAULT_DURATION
      return MathUtils.lerp(0, bufferAngle, this.axisEasing * timeRatio)
    } else {
      // If we are not easing along this axis, just return the angle to maintain buffer zone.
      return bufferAngle
    }
  }

  /**
   * Returns the angle about specified axis to rotate the target to align with the camera.
   * By projecting the forward/up vector onto planes defined by the relevant axis as the normal, we can separately calculate the angles of each axis.
   * The separate calculations allow for each axis to have its own buffer / interpolation values.
   * Because the user is expected to walk around freely, we use local X and Z axes for calculation, but global Y axis as the user's perception of 'up' is constant.
   */
  private calculateAxisAngle(axisVector: vec3, forwardVector: vec3, cameraVector: vec3, originVector: vec3): number {
    const forwardVectorOnPlane = forwardVector.projectOnPlane(axisVector)
    const cameraVectorOnPlane = cameraVector.projectOnPlane(axisVector)

    let angle = forwardVectorOnPlane.angleTo(cameraVectorOnPlane)

    // Origin vector describes the position on the unit circle where radian = 0.
    // We use this vector to compare if we should flip the sign of the angle to rotate in the correct direction.
    const forwardAngleOnPlane = originVector.angleTo(forwardVectorOnPlane)
    const cameraAngleOnPlane = originVector.angleTo(cameraVectorOnPlane)
    if (forwardAngleOnPlane > cameraAngleOnPlane) {
      angle = -angle
    }

    return angle
  }

  // Rotates the target about each enabled axis separately.
  public getRotation(axisVector: vec3, forwardVector: vec3, cameraVector: vec3, originVector: vec3): quat {
    if (this.skipRotation()) {
      return quat.quatIdentity()
    }

    if (axisVector.dot(forwardVector) > ALMOST_ONE) {
      return quat.quatIdentity()
    }
    const angle = this.calculateAxisAngle(axisVector, forwardVector, cameraVector, originVector)
    const rotationRadians = this.calculateAxisRotation(angle)

    const rotationQuaternion = this.calculateRotationQuaternion(rotationRadians, axisVector)

    return rotationQuaternion
  }

  /**
   * Used to snap the target immediately into proper rotation according to configuration.
   * @param axisVector - the vector to rotate about
   * @param forwardVector - the forward vector of the target
   * @param cameraVector - the vector from camera to target
   * @param originVector - the origin of rotation as a reference to ensure proper rotation
   * @returns the rotation about the given axis to align the target's forward vector with the camera.
   */
  public resetRotation(axisVector: vec3, forwardVector: vec3, cameraVector: vec3, originVector: vec3) {
    if (axisVector.dot(forwardVector) > ALMOST_ONE) {
      return quat.quatIdentity()
    }
    const angle = this.calculateAxisAngle(axisVector, forwardVector, cameraVector, originVector)

    return this.axisEnabled ? this.calculateRotationQuaternion(angle, axisVector) : quat.quatIdentity()
  }

  // Returns if the controller should skip rotating about the specified axis.
  private skipRotation(): boolean {
    return !this.axisEnabled
  }
}
