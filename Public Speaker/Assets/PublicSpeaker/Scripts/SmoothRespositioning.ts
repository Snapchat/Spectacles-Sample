import {CameraService, CameraType} from "./CameraService"

@component
export class SmoothRepositioning extends BaseScriptComponent {
  @input
  maxDistance: number = 100 // Maximum allowed distance in cm

  @input
  maxAngleDegrees: number = 45 // Maximum allowed angle in degrees

  @input
  repositionSpeed: number = 200 // Speed of repositioning in cm/second

  @input
  frontDistance: number = 80 // Distance to place in front of camera

  @input
  xOffset: number = 0 // Horizontal offset (positive = right, negative = left)

  @input
  yOffset: number = 0 // Vertical offset from original Y position

  @input
  cooldownTime: number = 2.0 // Time to wait between repositions

  private cameraService: CameraService
  private originalYPosition: number

  private lastRepositionTime: number = 0
  private isRepositioning: boolean = false
  private updateEvent: ScriptObject // Use more generic type
  private animationCallback: () => void

  // Animation variables
  private animStartTime: number = 0
  private animDuration: number = 0
  private animStartPosition: vec3
  private animTargetPosition: vec3
  private animStartRotation: quat
  private animTargetRotation: quat

  onAwake() {
    // Create the main update event
    this.createEvent("UpdateEvent").bind(() => this.onUpdate())

    this.cameraService = CameraService.getInstance()

    // Store original Y position
    this.originalYPosition = this.getSceneObject().getTransform().getWorldPosition().y
  }

  private onUpdate() {
    if (this.isRepositioning) {
      this.updateAnimation()
    } else {
      this.checkAndReposition()
    }
  }

  private updateAnimation() {
    const currentTime = getTime()
    const elapsed = currentTime - this.animStartTime
    const t = Math.min(elapsed / this.animDuration, 1.0)

    const objTransform = this.getSceneObject().getTransform()

    // Lerp position and rotation
    const newPosition = vec3.lerp(this.animStartPosition, this.animTargetPosition, t)
    const newRotation = quat.slerp(this.animStartRotation, this.animTargetRotation, t)

    // Apply position and rotation
    objTransform.setWorldPosition(newPosition)
    objTransform.setWorldRotation(newRotation)

    // Check if animation is complete
    if (t >= 1.0) {
      // Set exact final position and rotation to avoid floating point errors
      objTransform.setWorldPosition(this.animTargetPosition)
      objTransform.setWorldRotation(this.animTargetRotation)

      // End animation state
      this.isRepositioning = false
      this.lastRepositionTime = currentTime
    }
  }

  // Separate the update logic
  private checkAndReposition() {
    // Don't reposition if we're still in cooldown
    const currentTime = getTime()
    if (currentTime - this.lastRepositionTime < this.cooldownTime) return

    if (this.needsRepositioning()) {
      this.repositionInFrontOfCamera()
      print("Repositioning")
    }
  }

  private needsRepositioning(): boolean {
    // Get camera position
    const objTransform = this.getSceneObject().getTransform()
    const objPosition = objTransform.getWorldPosition()
    const camTransform = this.getCameraTransform()
    const camPosition = this.getCameraPosition()

    // Check distance
    const distance = objPosition.distance(camPosition)
    const isTooFar = distance > this.maxDistance

    // Check Y-axis angle difference
    // Get forward direction in XZ plane for both camera and direction to object
    const camForwardXZ = new vec3(camTransform.forward.x, 0, camTransform.forward.z).normalize()

    const dirToObjectXZ = new vec3(objPosition.x - camPosition.x, 0, objPosition.z - camPosition.z).normalize()

    // Calculate angle in degrees (only considering y-axis rotation)
    const angleCos = camForwardXZ.dot(dirToObjectXZ)
    const angleRad = Math.acos(Math.min(Math.max(angleCos, -1), 1)) // Clamp to avoid domain errors
    const angleDeg = angleRad * (180 / Math.PI)

    const isAngleTooLarge = angleDeg > this.maxAngleDegrees

    // Reposition ONLY if BOTH conditions are met
    return isTooFar || isAngleTooLarge
  }

  private repositionInFrontOfCamera() {
    this.isRepositioning = true

    const objTransform = this.getSceneObject().getTransform()
    this.animStartPosition = objTransform.getWorldPosition()
    this.animStartRotation = objTransform.getWorldRotation()

    const camTransform = this.getCameraTransform()
    const camPosition = camTransform.getWorldPosition()

    // Get camera forward vector but flatten it to XZ plane
    const flatForward = new vec3(camTransform.forward.x, 0, camTransform.forward.z).normalize()

    // Calculate position in front of camera on XZ plane
    const basePositionXZ = camPosition.add(flatForward.uniformScale(this.frontDistance))

    // Apply horizontal offset (using right vector but flattened)
    const flatRight = new vec3(camTransform.right.x, 0, camTransform.right.z).normalize()

    const rightOffset = flatRight.uniformScale(this.xOffset)

    // Create final position with preserved Y + offset
    this.animTargetPosition = new vec3(
      basePositionXZ.x + rightOffset.x,
      this.originalYPosition + this.yOffset,
      basePositionXZ.z + rightOffset.z
    )

    // Calculate rotation to face camera, but only on Y axis
    const horizontalDir = new vec3(
      camPosition.x - this.animTargetPosition.x,
      0,
      camPosition.z - this.animTargetPosition.z
    ).normalize()

    // Create a rotation that only affects the Y axis
    this.animTargetRotation = quat.lookAt(horizontalDir, vec3.up())

    // Animation timing setup
    const distance = this.animStartPosition.distance(this.animTargetPosition)
    this.animDuration = distance / this.repositionSpeed
    this.animStartTime = getTime()
  }

  getCameraPosition(): vec3 {
    const mainCamera = this.cameraService.getCamera(CameraType.Main)
    return mainCamera.getTransform().getWorldPosition()
  }

  getCameraTransform(): Transform {
    const mainCamera = this.cameraService.getCamera(CameraType.Main)
    return mainCamera.getTransform()
  }
}
