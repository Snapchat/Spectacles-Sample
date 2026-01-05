/**
 * Utility for calculating rotations between two objects or directions.
 */
@component
export class InBetweenRotationUtilityTS extends BaseScriptComponent {
  @input
  @hint("First target for rotation calculation")
  target1!: SceneObject

  @input
  @hint("Second target for rotation calculation")
  target2!: SceneObject

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
    if (!this.target1 || !this.target2) {
      print("Warning: Both targets must be set for InBetweenRotationUtility")
    }
  }

  onUpdate(): void {
    if (!this.target1 || !this.target2) return

    const target1Forward = this.getForwardVector(this.target1)
    const target2Forward = this.getForwardVector(this.target2)

    // Apply the in-between rotation to this object
    const newRotation = this.getInBetweenRotation(target1Forward, target2Forward)
    this.sceneObject.getTransform().setWorldRotation(newRotation)
  }

  /**
   * Gets the in-between rotation between two transforms.
   * @param a The first transform
   * @param b The second transform
   * @returns The rotation exactly in between the forward directions of the two objects
   */
  getInBetweenRotationFromTransforms(a: SceneObject, b: SceneObject): quat {
    if (!a || !b) {
      print("Warning: Can't calculate in-between rotation - one or both objects are null")
      return new quat(0, 0, 0, 1) // Identity quaternion
    }

    // Get the forward vectors of both objects
    const forwardA = this.getForwardVector(a)
    const forwardB = this.getForwardVector(b)

    // Get the in-between rotation
    return this.getInBetweenRotation(forwardA, forwardB)
  }

  /**
   * Gets the in-between rotation between two arbitrary directions.
   * @param directionA The first direction as a vec3
   * @param directionB The second direction as a vec3
   * @returns The rotation exactly in between the two directions
   */
  getInBetweenRotation(directionA: vec3, directionB: vec3): quat {
    // Normalize the directions
    const normalizedA = this.normalizeVector(directionA)
    const normalizedB = this.normalizeVector(directionB)

    // Create quaternions based on the directions
    const rotationA = this.lookRotation(normalizedA)
    const rotationB = this.lookRotation(normalizedB)

    // Slerp between the two directions (50% interpolation for in-between)
    return quat.slerp(rotationA, rotationB, 0.5)
  }

  /**
   * Gets the forward vector from a transform.
   * @param obj The SceneObject to get the forward vector from
   * @returns The forward vector of the transform
   */
  private getForwardVector(obj: SceneObject): vec3 {
    if (!obj) return new vec3(0, 0, 1) // Default forward

    const transform = obj.getTransform()
    const worldRotation = transform.getWorldRotation()

    // Calculate forward vector (local Z axis in world space)
    // For a quat rotation, if we transform (0,0,1), we get the forward vector
    const forward = new vec3(0, 0, 1)
    return this.rotateVectorByQuaternion(forward, worldRotation)
  }

  /**
   * Rotates a vector by a quaternion.
   * @param vector The vector to rotate
   * @param rotation The quaternion rotation
   * @returns The rotated vector
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
   * Creates a quaternion that represents a rotation looking in a specified direction.
   * @param direction The direction to look at (forward vector)
   * @returns A quaternion representing the rotation
   */
  private lookRotation(direction: vec3): quat {
    // Simplified implementation of Quaternion.LookRotation
    // Default up vector is (0,1,0) - world up
    const up = new vec3(0, 1, 0)

    // Normalize direction
    const normalizedDirection = this.normalizeVector(direction)

    // Handle the case when direction is parallel to up
    if (Math.abs(normalizedDirection.x) < 0.0001 && Math.abs(normalizedDirection.z) < 0.0001) {
      // Looking straight up or down
      if (normalizedDirection.y > 0) {
        // Looking up, rotate 180 degrees around X axis
        return quat.fromEulerAngles(Math.PI, 0, 0)
      } else {
        // Looking down, no rotation needed
        return new quat(0, 0, 0, 1)
      }
    }

    // Calculate right vector (cross product of up and forward)
    const right = this.normalizeVector(this.crossProduct(up, normalizedDirection))

    // Recalculate up vector (cross product of forward and right)
    const newUp = this.crossProduct(normalizedDirection, right)

    // Create rotation matrix from the orthonormal basis
    // Convert to quaternion
    const trace = right.x + newUp.y + normalizedDirection.z

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0)
      return new quat(
        (newUp.z - normalizedDirection.y) * s,
        (normalizedDirection.x - right.z) * s,
        (right.y - newUp.x) * s,
        0.25 / s
      )
    } else {
      // Use the appropriate formula based on which diagonal element is largest
      if (right.x > newUp.y && right.x > normalizedDirection.z) {
        const s = 2.0 * Math.sqrt(1.0 + right.x - newUp.y - normalizedDirection.z)
        return new quat(
          0.25 * s,
          (right.y + newUp.x) / s,
          (normalizedDirection.x + right.z) / s,
          (newUp.z - normalizedDirection.y) / s
        )
      } else if (newUp.y > normalizedDirection.z) {
        const s = 2.0 * Math.sqrt(1.0 + newUp.y - right.x - normalizedDirection.z)
        return new quat(
          (right.y + newUp.x) / s,
          0.25 * s,
          (newUp.z + normalizedDirection.y) / s,
          (normalizedDirection.x - right.z) / s
        )
      } else {
        const s = 2.0 * Math.sqrt(1.0 + normalizedDirection.z - right.x - newUp.y)
        return new quat(
          (normalizedDirection.x + right.z) / s,
          (newUp.z + normalizedDirection.y) / s,
          0.25 * s,
          (right.y - newUp.x) / s
        )
      }
    }
  }

  /**
   * Calculates the cross product of two vectors.
   * @param a The first vector
   * @param b The second vector
   * @returns The cross product vector
   */
  private crossProduct(a: vec3, b: vec3): vec3 {
    return new vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)
  }

  /**
   * Normalizes a vector to unit length.
   * @param vector The vector to normalize
   * @returns The normalized vector
   */
  private normalizeVector(vector: vec3): vec3 {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)

    if (length < 0.0001) {
      return new vec3(0, 0, 1) // Default forward
    }

    return new vec3(vector.x / length, vector.y / length, vector.z / length)
  }
}
