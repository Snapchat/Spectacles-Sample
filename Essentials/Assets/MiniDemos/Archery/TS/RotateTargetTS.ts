/**
 * RotateTarget - TypeScript version for Lens Studio
 * Randomly rotates a target object at regular intervals
 */
@component
export class RotateTargetTS extends BaseScriptComponent {
  @input
  @hint("The time between rotations in seconds")
  rotationInterval: number = 2.0

  @input
  @hint("The minimum rotation angle in degrees")
  minRotationAngle: number = -20.0

  @input
  @hint("The maximum rotation angle in degrees")
  maxRotationAngle: number = 20.0

  private nextRotationTime: number = 0

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate()
    })
  }

  onStart(): void {
    // Start the rotation immediately
    this.rotateTarget()
  }

  onUpdate(): void {
    // Check if it's time for the next rotation
    const currentTime = getTime()
    if (currentTime >= this.nextRotationTime) {
      this.rotateTarget()
    }
  }

  // Rotate the target randomly and schedule the next rotation
  private rotateTarget(): void {
    // Generate a random angle within the specified range
    const rotationAngle = this.minRotationAngle + Math.random() * (this.maxRotationAngle - this.minRotationAngle)

    // Convert to radians for the quaternion
    const radians = rotationAngle * (Math.PI / 180)

    // Create rotation around the y-axis (up vector)
    const rotation = quat.angleAxis(radians, new vec3(0, 1, 0))

    // Apply the rotation
    const transform = this.getSceneObject().getTransform()
    transform.setLocalRotation(rotation)

    // Schedule the next rotation
    this.nextRotationTime = getTime() + this.rotationInterval
  }
}
