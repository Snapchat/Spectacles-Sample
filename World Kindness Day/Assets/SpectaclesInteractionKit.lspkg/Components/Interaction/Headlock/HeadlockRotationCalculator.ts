import {RotationAxis} from "./HeadlockController"

export type RotationCalculatorConfig = {
  distance: number
  axis: RotationAxis
  duration: number
  axisEnabled?: boolean
  axisEasing?: number
  axisOffsetRadians?: number
  axisBufferRadians?: number
}

/**
 * HeadlockRotationCalculator is used to calculate the offset to position an object to maintain a certain offset relative to where the user is looking.
 */
export default class HeadlockRotationCalculator {
  private _distance: number = 50

  private axis: RotationAxis
  private _axisEnabled = true

  private _axisOffsetRadians = 0
  private _axisEasing = 0
  private _axisBufferRadians = 0

  private duration: number

  constructor(config: RotationCalculatorConfig) {
    this.distance = config.distance
    this.axis = config.axis
    this.duration = config.duration

    this.axisEnabled = config.axisEnabled ?? false
    this.axisEasing = config.axisEasing ?? 1
    this.axisOffsetRadians = config.axisOffsetRadians ?? 0
    this.axisBufferRadians = config.axisBufferRadians ?? 0
  }

  get distance(): number {
    return this._distance
  }
  set distance(distance: number) {
    this._distance = distance
  }

  get axisEnabled(): boolean {
    return this._axisEnabled
  }
  set axisEnabled(enabled: boolean) {
    this._axisEnabled = enabled
  }

  get axisOffsetRadians(): number {
    return this._axisOffsetRadians
  }
  set axisOffsetRadians(radians: number) {
    this._axisOffsetRadians = radians
  }

  get axisEasing(): number {
    return this._axisEasing
  }
  set axisEasing(easing: number) {
    this._axisEasing = easing
  }

  get axisBufferRadians(): number {
    return this._axisBufferRadians
  }
  set axisBufferRadians(radians: number) {
    this._axisBufferRadians = radians
  }

  /*
   * Returns the exact angle to rotate the target by along the given axis.
   * This function will include the logic for interpolation / buffer tolerances later.
   */
  private calculateRotationOffset(angle: number, axisVector: vec3, positionVector: vec3): vec3 {
    const rotationQuaternion = quat.angleAxis(angle, axisVector)

    // Rotate the current offset about the given axis, then normalize the new position onto the sphere.
    let newPositionVector = rotationQuaternion.multiplyVec3(positionVector).normalize().uniformScale(this.distance)

    if (this.axisEasing !== 1) {
      const timeRatio = getDeltaTime() / this.duration
      newPositionVector = vec3.lerp(positionVector, newPositionVector, this.axisEasing * timeRatio)
    }
    const rotationOffset = newPositionVector.sub(positionVector)

    return rotationOffset
  }

  /**
   * Returns the angle about specified axis to rotate the target to align with the camera.
   * By projecting the forward/up vector onto planes defined by the relevant axis as the normal, we can separately calculate the angles of each axis.
   * The separate calculations allow for each axis to have its own buffer / interpolation values.
   * Because the user is expected to walk around freely, we use local X and Z axes for calculation, but global Y axis as the user's perception of 'up' is constant.
   */
  private calculateAngleDelta(
    axisVector: vec3,
    positionVector: vec3,
    originVector: vec3,
    forwardVector: vec3,
    upVector?: vec3
  ): number {
    const positionVectorOnPlane = positionVector.projectOnPlane(axisVector).normalize()
    const forwardVectorOnPlane = forwardVector.projectOnPlane(axisVector).normalize()

    let angleBetween = forwardVectorOnPlane.angleTo(positionVectorOnPlane)

    let forwardAngleOnPlane = originVector.angleTo(forwardVectorOnPlane)
    let positionAngleOnPlane = originVector.angleTo(positionVectorOnPlane)

    if (this.axis === RotationAxis.Pitch && upVector !== undefined) {
      const forwardVectorOnXZ = new vec2(forwardVectorOnPlane.x, forwardVectorOnPlane.z).normalize()
      const positionVectorOnXZ = new vec2(positionVectorOnPlane.x, positionVectorOnPlane.z).normalize()

      const sameDirection = forwardVectorOnXZ.angleTo(positionVectorOnXZ) < Math.PI / 2

      if (upVector.y < 0 || !sameDirection) {
        const direction = -Math.sign(forwardVectorOnPlane.y)
        const rotatedOriginVec = quat.angleAxis((direction * Math.PI) / 2, axisVector).multiplyVec3(originVector)

        forwardAngleOnPlane = rotatedOriginVec.angleTo(forwardVectorOnPlane)
        positionAngleOnPlane = rotatedOriginVec.angleTo(positionVectorOnPlane)
      }
    }

    if (forwardAngleOnPlane > positionAngleOnPlane) {
      angleBetween = -angleBetween
    }

    const angleDelta = this.axisOffsetRadians - angleBetween
    if (Math.abs(angleDelta) < this.axisBufferRadians) {
      return 0
    }

    // Calculate the angle to rotate just enough to keep the camera within the buffer cone.
    // Possibly not needed.
    const bufferAngle = angleDelta - Math.sign(angleDelta) * this.axisBufferRadians

    return bufferAngle
  }

  /**
   * Returns the offset to move the target by based on the following vectors
   * @param axisVector - the axis to rotate the target about
   * @param positionVector - the current local position of the target relative to headlock center
   * @param originVector - the vector to calculate an origin of rotation to determine counterclockwise or clockwise rotation
   * @param forwardVector - the current look vector of the headlock controller
   * @returns
   */
  public getOffset(
    axisVector: vec3,
    positionVector: vec3,
    originVector: vec3,
    forwardVector: vec3,
    upVector?: vec3
  ): vec3 {
    if (this.skipRotation()) {
      return vec3.zero()
    }
    const angle = this.calculateAngleDelta(axisVector, positionVector, originVector, forwardVector, upVector)
    const rotationOffset = this.calculateRotationOffset(angle, axisVector, positionVector)

    return rotationOffset
  }

  // Returns if the controller should skip translating about the specified axis.
  private skipRotation(): boolean {
    return !this.axisEnabled
  }
}
