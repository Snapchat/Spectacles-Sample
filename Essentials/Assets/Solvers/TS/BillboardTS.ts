/**
 * The billboard solver allows the content to face a target, rotating only around the Y axis.
 */
@component
export class BillboardTS extends BaseScriptComponent {
  @input
  @hint("Is billboard looking at default direction or opposite?")
  lookAway: boolean = true

  @input
  @hint("Override default target mainCamera with your target")
  target!: SceneObject

  private _targetRotation: quat = new quat(0, 0, 0, 1)
  private _lookDir: vec3 = new vec3(0, 0, 0)

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
    // Camera handling is simplified as we don't have direct Camera.main access
    if (!this.target) {
      // In a real implementation, we would find the main camera
      // For now, this will be handled by the user setting the target
      print("No target set for Billboard - please set a target object")
    }
  }

  onUpdate(): void {
    this.billboarding()
  }

  /**
   * Update the billboard orientation to face the target.
   */
  billboarding(): void {
    if (!this.target) return

    const myPosition = this.sceneObject.getTransform().getWorldPosition()
    const targetPosition = this.target.getTransform().getWorldPosition()

    // Get the direction to the target but flatten on the X and Z axes (only Y axis rotation)
    this._lookDir = new vec3(
      targetPosition.x - myPosition.x,
      0, // Keep only Y axis rotation by zeroing out the Y component
      targetPosition.z - myPosition.z
    )

    // Normalize the direction vector
    const length = Math.sqrt(this._lookDir.x * this._lookDir.x + this._lookDir.z * this._lookDir.z)

    if (length < 0.0001) return // Avoid division by zero

    this._lookDir.x /= length
    this._lookDir.z /= length

    if (this.lookAway) {
      this._lookDir.x *= -1
      this._lookDir.z *= -1
    }

    // Convert the direction to a quaternion (y-axis rotation)
    // For y-axis rotation, we only care about the xz plane angle
    const angle = Math.atan2(this._lookDir.x, this._lookDir.z)
    this._targetRotation = quat.fromEulerAngles(0, angle, 0)

    // Get current rotation
    const currentRotation = this.sceneObject.getTransform().getWorldRotation()

    // Slerp between current and target rotation
    const newRotation = quat.slerp(
      currentRotation,
      this._targetRotation,
      getDeltaTime() * 5 // Adjust speed as needed
    )

    // Apply the new rotation
    this.sceneObject.getTransform().setWorldRotation(newRotation)
  }
}
