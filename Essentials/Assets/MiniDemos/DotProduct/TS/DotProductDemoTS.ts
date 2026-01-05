/**
 * DotProductDemo - TypeScript version for Lens Studio
 * Demonstrates the use of dot product and vector operations
 */
@component
export class DotProductDemoTS extends BaseScriptComponent {
  @input
  @hint("Reference object to check angle against")
  reference!: SceneObject

  @input
  @hint("Reference object to check angle against")
  referenceMaterial!: Material

  @input
  @hint("Threshold dot product value for changing color (0-1)")
  thresholdDot: number = 0.95

  @input
  @hint("Threshold angle in degrees for recentering")
  thresholdDotInDegrees: number = 30.0

  @input
  @hint("Camera used for direction checking")
  camera!: Camera

  onAwake(): void {
    // Set up update handler
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  onUpdate(): void {
    this.changeColorIfNotFacing()
  }

  /**
   * Example: Check if the angle between the camera and objectA exceeds a threshold
   */
  changeColorIfNotFacing(): void {
    if (!this.camera) return

    // Calculate direction from camera to objectA
    const cameraPosition = this.camera.getTransform().getWorldPosition()
    const objectPosition = this.reference.getTransform().getWorldPosition()

    // Get the direction vector from camera to object
    const directionToObject = objectPosition.sub(cameraPosition).normalize()

    // Get camera forward direction (negated to point inward)
    const cameraForward = this.camera.getTransform().forward.uniformScale(-1)

    // Project both vectors onto the horizontal plane (zero out the Y component)
    // This gives us only the horizontal angle difference
    const horizontalDirectionToObject = new vec3(directionToObject.x, 0, directionToObject.z).normalize()
    const horizontalCameraForward = new vec3(cameraForward.x, 0, cameraForward.z).normalize()

    // Calculate the dot product of the horizontal components
    const horizontalDotProduct = horizontalDirectionToObject.dot(horizontalCameraForward)

    // Convert to angle in degrees (horizontal angle only)
    const horizontalAngleInDegrees = Math.acos(Math.max(-1, Math.min(1, horizontalDotProduct))) * (180 / Math.PI)

    print("Horizontal angle between camera and object: " + horizontalAngleInDegrees.toFixed(2) + "°")

    // Check if horizontal angle exceeds threshold
    if (horizontalAngleInDegrees > this.thresholdDotInDegrees) {
      // Set to red when outside horizontal threshold
      this.referenceMaterial.mainPass.baseColor = new vec4(1, 0, 0, 1)
    } else {
      // Set to blue when within horizontal threshold
      this.referenceMaterial.mainPass.baseColor = new vec4(0, 0, 1, 1)
    }
  }
  /**
   * Calculates the signed angle between two vectors in degrees.
   * Returns a positive angle if vectorB is clockwise from vectorA and a negative angle if counterclockwise.
   */
  signedAngle(vectorA: vec3, vectorB: vec3, axis: vec3): number {
    // Calculate the unsigned angle
    const angle = this.angle(vectorA, vectorB)

    // Calculate the sign using the cross product and dot product
    const cross = this.crossProduct(vectorA, vectorB)
    const sign = Math.sign(axis.dot(cross))

    return angle * sign
  }

  /**
   * Calculates the dot product of two vectors.
   * It gives a measure of how aligned the vectors are, ranging from -1 (opposite) to +1 (same direction).
   */
  dotProduct(vectorA: vec3, vectorB: vec3): number {
    return vectorA.dot(vectorB)
  }

  /**
   * Calculates the cross product of two vectors.
   * Returns a vector perpendicular to both input vectors, following the right-hand rule.
   */
  crossProduct(vectorA: vec3, vectorB: vec3): vec3 {
    return vectorA.cross(vectorB)
  }

  /**
   * Calculates the angle between two vectors in degrees, regardless of direction.
   * Always returns a positive angle.
   */
  angle(vectorA: vec3, vectorB: vec3): number {
    // Normalize the vectors
    const normalizedA = vectorA.normalize()
    const normalizedB = vectorB.normalize()

    // Calculate the dot product
    const dot = normalizedA.dot(normalizedB)

    // Clamp the dot product to avoid numerical errors
    const clampedDot = Math.max(-1, Math.min(1, dot))

    // Calculate the angle in radians and convert to degrees
    return Math.acos(clampedDot) * (180 / Math.PI)
  }

  /**
   * Reflects a vector off a surface with the given normal.
   * The reflection is the vector's "bounce" direction based on the surface's normal.
   */
  reflect(incomingVector: vec3, normal: vec3): vec3 {
    // Normalize the normal to ensure accurate reflection
    const normalizedNormal = normal.normalize()

    // Calculate the reflection: r = i - 2(i·n)n
    // Where i is the incoming vector, n is the normal, and r is the reflection
    const dotProduct = incomingVector.dot(normalizedNormal)
    return incomingVector.sub(normalizedNormal.uniformScale(2 * dotProduct))
  }

  /**
   * Projects vectorA onto vectorB.
   * The result is a vector that represents how much of vectorA lies along the direction of vectorB.
   */
  project(vectorA: vec3, vectorB: vec3): vec3 {
    // Normalize vectorB to get the direction
    const normalizedB = vectorB.normalize()

    // Calculate projection length
    const projectionLength = vectorA.dot(normalizedB)

    // Return the projected vector
    return normalizedB.uniformScale(projectionLength)
  }

  /**
   * Projects vectorA onto a plane defined by a normal vector.
   * The result is a vector that represents vectorA with any component along the normal removed.
   */
  projectOnPlane(vectorA: vec3, normal: vec3): vec3 {
    // Calculate the projection of vectorA onto the normal
    const projection = this.project(vectorA, normal)

    // Subtract the normal component to get the plane projection
    return vectorA.sub(projection)
  }

  /**
   * Normalizes a vector, making it have a magnitude of 1.
   * This keeps the direction the same while adjusting the length.
   */
  normalize(vector: vec3): vec3 {
    return vector.normalize()
  }

  /**
   * Helper method for linear interpolation between vectors
   */
  private lerpVec3(a: vec3, b: vec3, t: number): vec3 {
    // Clamp t between 0 and 1
    const clampedT = Math.max(0, Math.min(1, t))

    // Linear interpolation formula: a + (b - a) * t
    return new vec3(a.x + (b.x - a.x) * clampedT, a.y + (b.y - a.y) * clampedT, a.z + (b.z - a.z) * clampedT)
  }

  /**
   * Creates a rotation that looks in the specified direction
   */
  private lookRotationFromDirection(direction: vec3, up: vec3 = new vec3(0, 1, 0)): quat {
    // Normalize direction
    const normalizedDirection = direction.normalize()

    // Calculate right vector
    const right = up.cross(normalizedDirection).normalize()

    // Recalculate up vector to ensure orthogonality
    const orthogonalUp = normalizedDirection.cross(right).normalize()

    // Create a rotation matrix from these vectors
    // This is a simplified implementation that may not handle all edge cases

    // Calculate angle around Y axis (yaw)
    const yaw = Math.atan2(normalizedDirection.x, normalizedDirection.z)

    // Calculate angle around X axis (pitch)
    const pitch = -Math.asin(normalizedDirection.y)

    // Create quaternion from Euler angles
    return quat.fromEulerAngles(pitch, yaw, 0)
  }
}
