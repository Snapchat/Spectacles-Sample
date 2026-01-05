/**
 * Tethers content to a target, but ONLY repositions when:
 * 1. The angle between target's forward and direction to object exceeds threshold, OR
 * 2. Vertical distance exceeds threshold, OR
 * 3. Horizontal distance exceeds threshold
 */
@component
export class TetherBetweenAngleRangeTS extends BaseScriptComponent {
  @input
  @hint("Target object that the content should follow")
  target!: SceneObject

  @input
  @hint("Minimum angle (in degrees) required to trigger repositioning")
  angleThreshold: number = 45.0

  @input
  @hint("Minimum vertical distance required to trigger repositioning")
  verticalDistanceThreshold: number = 150.0

  @input
  @hint("Minimum horizontal distance required to trigger repositioning")
  horizontalDistanceThreshold: number = 150.0

  @input
  @hint("Offset for positioning content relative to target")
  offset: vec3 = new vec3(0, 0, -100.0)

  @input
  @hint("Speed of position lerping")
  lerpSpeed: number = 5.0

  @input
  @hint("Show debug information")
  showDebug: boolean = false

  private _targetPosition: vec3 = new vec3(0, 0, 0)
  private _lastRepositionTime: number = 0
  private _currentAngle: number = 0
  private _verticalDistance: number = 0
  private _horizontalDistance: number = 0
  private _needsRepositioning: boolean = false

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate()
    })
  }

  onStart(): void {
    if (!this.target) {
      print("TetherBetweenAngleRangeTS: No target set - please set a target object")
      return
    }

    // Initialize target position
    this._targetPosition = this.calculateNewTargetPosition()
  }

  onUpdate(): void {
    if (!this.target) return

    // Evaluate current conditions
    this.evaluateConditions()

    // Only recalculate target position if needed
    if (this._needsRepositioning) {
      // Calculate new position
      this._targetPosition = this.calculateNewTargetPosition()

      // Reset state
      this._needsRepositioning = false
      this._lastRepositionTime = getTime()

      if (this.showDebug) {
        print(`TetherBetweenAngleRangeTS: REPOSITIONING TO NEW POSITION`)
      }
    }

    // Always update position with lerping (fixed: this was inside the if block before)
    this.updateContentPosition()
  }

  /**
   * Evaluate all conditions that could trigger repositioning
   */
  private evaluateConditions(): void {
    const myPos = this.sceneObject.getTransform().getWorldPosition()
    const targetPos = this.target.getTransform().getWorldPosition()

    // Calculate vector from target to object
    const targetToObject = new vec3(myPos.x - targetPos.x, myPos.y - targetPos.y, myPos.z - targetPos.z)

    // Calculate distances
    this._verticalDistance = Math.abs(targetToObject.y)
    this._horizontalDistance = Math.sqrt(targetToObject.x * targetToObject.x + targetToObject.z * targetToObject.z)

    // Extra check for zero-length vectors to avoid NaN
    if (this._horizontalDistance < 0.0001) {
      // We're directly above/below the target, so angle is undefined
      // Set to 0 by convention
      this._currentAngle = 0
      return
    }

    // Calculate angle between target's forward and direction to object
    // on the horizontal plane (XZ plane)

    // 1. Get target's forward vector and flatten to XZ plane
    const targetRotation = this.target.getTransform().getWorldRotation()
    const targetForward = this.getForwardVector(targetRotation)
    const flatForward = this.normalizeVector(new vec3(targetForward.x, 0, targetForward.z))

    // 2. Get direction vector FROM target TO object, flattened to XZ plane
    const flatToObject = this.normalizeVector(new vec3(targetToObject.x, 0, targetToObject.z))

    // 3. Calculate dot product between these normalized vectors
    const dotProduct = this.dotProduct(flatForward, flatToObject)

    // 4. Convert dot product to angle in degrees
    // Note: dot(a,b) = |a|*|b|*cos(θ) = cos(θ) when vectors are normalized
    // When vectors align perfectly: cos(0°) = 1
    // When vectors are perpendicular: cos(90°) = 0
    // When vectors point opposite: cos(180°) = -1
    this._currentAngle = 180 - Math.acos(Math.max(-1, Math.min(1, dotProduct))) * (180 / Math.PI)

    if (this.showDebug) {
      print(`Forward vector: (${flatForward.x.toFixed(2)}, ${flatForward.z.toFixed(2)})`)
      print(`Direction to object: (${flatToObject.x.toFixed(2)}, ${flatToObject.z.toFixed(2)})`)
      print(`Dot product: ${dotProduct.toFixed(3)} → Angle: ${this._currentAngle.toFixed(1)}°`)
    }

    // Evaluate all conditions
    const angleTrigger = this._currentAngle > this.angleThreshold
    const verticalTrigger = this._verticalDistance > this.verticalDistanceThreshold
    const horizontalTrigger = this._horizontalDistance > this.horizontalDistanceThreshold

    // Need repositioning if ANY condition is met
    this._needsRepositioning = angleTrigger || verticalTrigger || horizontalTrigger

    // Debug output
    if (this.showDebug) {
      print(`Angle: ${this._currentAngle.toFixed(1)}° > ${this.angleThreshold}°? ${angleTrigger}`)
      print(`VertDist: ${this._verticalDistance.toFixed(1)} > ${this.verticalDistanceThreshold}? ${verticalTrigger}`)
      print(
        `HorizDist: ${this._horizontalDistance.toFixed(1)} > ${this.horizontalDistanceThreshold}? ${horizontalTrigger}`
      )

      if (this._needsRepositioning) {
        print(
          "NEEDS REPOSITIONING due to: " +
            (angleTrigger ? "ANGLE " : "") +
            (verticalTrigger ? "VERTICAL " : "") +
            (horizontalTrigger ? "HORIZONTAL" : "")
        )
      } else {
        print("All conditions within thresholds - no repositioning needed")
      }
    }
  }

  /**
   * Calculate the new target position with offset.
   */
  private calculateNewTargetPosition(): vec3 {
    const targetTransform = this.target.getTransform()
    const targetPos = targetTransform.getWorldPosition()
    const targetRot = targetTransform.getWorldRotation()

    // Get the forward and right vectors
    const forward = this.getForwardVector(targetRot)
    const right = this.getRightVector(targetRot)

    // Apply offset in target's local space
    return new vec3(
      targetPos.x + right.x * this.offset.x + forward.x * this.offset.z,
      targetPos.y + this.offset.y,
      targetPos.z + right.z * this.offset.x + forward.z * this.offset.z
    )
  }

  /**
   * Update the content's position with lerping.
   */
  private updateContentPosition(): void {
    const myTransform = this.sceneObject.getTransform()
    const currentPos = myTransform.getWorldPosition()

    // Lerp to the target position
    const newPos = this.lerpVector(currentPos, this._targetPosition, this.lerpSpeed * getDeltaTime())

    // Apply the new position
    myTransform.setWorldPosition(newPos)
  }

  /**
   * Get the forward vector from a rotation.
   */
  private getForwardVector(rotation: quat): vec3 {
    // Transform the local forward vector (0,0,1) by the rotation
    return this.rotateVectorByQuaternion(new vec3(0, 0, 1), rotation)
  }

  /**
   * Get the right vector from a rotation.
   */
  private getRightVector(rotation: quat): vec3 {
    // Transform the local right vector (1,0,0) by the rotation
    return this.rotateVectorByQuaternion(new vec3(1, 0, 0), rotation)
  }

  /**
   * Calculate the dot product between two vectors.
   */
  private dotProduct(v1: vec3, v2: vec3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  /**
   * Rotate a vector by a quaternion.
   */
  private rotateVectorByQuaternion(vector: vec3, rotation: quat): vec3 {
    const x = rotation.x
    const y = rotation.y
    const z = rotation.z
    const w = rotation.w

    // Apply the quaternion rotation to the vector
    // Formula: q * v * q^-1 simplified
    const ix = w * vector.x + y * vector.z - z * vector.y
    const iy = w * vector.y + z * vector.x - x * vector.z
    const iz = w * vector.z + x * vector.y - y * vector.x
    const iw = -x * vector.x - y * vector.y - z * vector.z

    const result = new vec3(
      ix * w + iw * -x + iy * -z - iz * -y,
      iy * w + iw * -y + iz * -x - ix * -z,
      iz * w + iw * -z + ix * -y - iy * -x
    )

    return result
  }

  /**
   * Linear interpolation between two vectors.
   */
  private lerpVector(a: vec3, b: vec3, t: number): vec3 {
    const clampedT = Math.max(0, Math.min(1, t))
    return new vec3(a.x + (b.x - a.x) * clampedT, a.y + (b.y - a.y) * clampedT, a.z + (b.z - a.z) * clampedT)
  }

  /**
   * Normalize a vector to unit length.
   */
  private normalizeVector(v: vec3): vec3 {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)

    if (length < 0.0001) {
      return new vec3(0, 0, 0)
    }

    return new vec3(v.x / length, v.y / length, v.z / length)
  }
}
