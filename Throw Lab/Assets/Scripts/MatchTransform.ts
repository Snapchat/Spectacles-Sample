/**
 * Matches the position and rotation of a target with smooth lerping.
 * Maintains offset from the initial grab point.
 * Works with position/rotation vectors (for hand tracking) instead of SceneObjects.
 */
@component
export class MatchTransform extends BaseScriptComponent {
  @input
  @hint("Speed for position lerping (higher = faster response)")
  positionLerpSpeed: number = 15.0

  @input
  @hint("Speed for rotation lerping (higher = faster response)")
  rotationLerpSpeed: number = 15.0

  @input
  @hint("Distance in front of finger tip to hold object (in cm)")
  holdDistance: number = 5.0

  // Store the offset from target when matching starts
  private positionOffset: vec3 = vec3.zero()
  private startingPositionOffset: vec3 = vec3.zero() // Where object actually is relative to finger
  private desiredPositionOffset: vec3 = vec3.zero() // Where we want it (holdDistance in front)
  private rotationOffset: quat = quat.quatIdentity()
  private hasInitializedOffset: boolean = false
  private isMatching: boolean = false
  private updateRotation: boolean = true // Can be disabled for objects that override rotation

  // Offset transition (smoothly move object from current position to hold position)
  private offsetTransitionProgress: number = 0
  private offsetTransitionSpeed: number = 2.0 // Takes 0.5 seconds to transition

  // Current target position and rotation (updated externally)
  private targetPosition: vec3 = vec3.zero()
  private targetRotation: quat = quat.quatIdentity()

  onAwake() {
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  /**
   * Set the target position and rotation (called from GrabbableObject)
   */
  setTarget(position: vec3, rotation: quat) {
    this.targetPosition = position
    this.targetRotation = rotation

    // Initialize offset on first target set
    if (!this.hasInitializedOffset) {
      this.initializeOffset()
    }
  }

  /**
   * Set the target position (called from GrabbableObject)
   * @deprecated Use setTarget instead
   */
  setTargetPosition(position: vec3) {
    this.targetPosition = position

    // Initialize offset on first position set
    if (!this.hasInitializedOffset) {
      this.initializeOffset()
    }
  }

  /**
   * Initialize the offset between this object and the target.
   * Starts with current object position, then smoothly transitions to hold position.
   */
  private initializeOffset() {
    const myTransform = this.getSceneObject().getTransform()
    const myWorldPos = myTransform.getWorldPosition()
    const myWorldRot = myTransform.getWorldRotation()

    // Calculate where the object currently is relative to the finger
    this.startingPositionOffset = myWorldPos.sub(this.targetPosition)

    // Calculate where we want it to be (holdDistance cm in front of finger)
    const indexTipForward = this.targetRotation.multiplyVec3(vec3.forward())
    this.desiredPositionOffset = indexTipForward.uniformScale(this.holdDistance)

    // Start with the current offset (no jump)
    this.positionOffset = this.startingPositionOffset
    this.offsetTransitionProgress = 0

    // Calculate rotation offset (inverse relationship)
    this.rotationOffset = myWorldRot.multiply(this.targetRotation.invert())

    this.hasInitializedOffset = true

    print(`MatchTransform (${this.getSceneObject().name}): Starting offset: ${this.startingPositionOffset}`)
    print(`MatchTransform (${this.getSceneObject().name}): Desired offset: ${this.desiredPositionOffset}`)
    print(
      `MatchTransform (${this.getSceneObject().name}): Object world pos: ${myWorldPos}, Finger pos: ${this.targetPosition}`
    )
  }

  /**
   * Reset the offset tracking
   */
  resetOffset() {
    this.hasInitializedOffset = false
    this.positionOffset = vec3.zero()
    this.startingPositionOffset = vec3.zero()
    this.desiredPositionOffset = vec3.zero()
    this.rotationOffset = quat.quatIdentity()
    this.offsetTransitionProgress = 0
  }

  private updateCounter = 0
  private debugCounter = 0

  /**
   * Enable matching behavior
   */
  enableMatching() {
    this.isMatching = true
    print(`MatchTransform (${this.getSceneObject().name}): Matching ENABLED`)
  }

  /**
   * Disable matching behavior
   */
  disableMatching() {
    this.isMatching = false
    print(`MatchTransform (${this.getSceneObject().name}): Matching DISABLED`)
  }

  /**
   * Disable rotation updates (for objects that override rotation every frame)
   */
  disableRotationUpdates() {
    this.updateRotation = false
  }

  /**
   * Enable rotation updates
   */
  enableRotationUpdates() {
    this.updateRotation = true
  }

  onUpdate() {
    // Check if component itself is disabled
    if (!this.enabled) {
      if (this.isMatching) {
        print(`MatchTransform (${this.getSceneObject().name}): WARNING - isMatching=true but component is disabled!`)
      }
      return
    }

    if (!this.isMatching) {
      return
    }

    if (!this.hasInitializedOffset) {
      print(`MatchTransform (${this.getSceneObject().name}): WARNING - isMatching=true but no offset initialized!`)
      return
    }

    this.debugCounter++
    if (this.debugCounter % 30 === 0) {
      print(`MatchTransform: Actively matching (${this.getSceneObject().name})`)
    }

    this.updateTransform()
  }

  private updateTransform() {
    const myTransform = this.getSceneObject().getTransform()

    // Smoothly transition the offset from starting position to desired hold position
    if (this.offsetTransitionProgress < 1.0) {
      this.offsetTransitionProgress += this.offsetTransitionSpeed * getDeltaTime()
      this.offsetTransitionProgress = Math.min(this.offsetTransitionProgress, 1.0)

      // Lerp the offset itself
      this.positionOffset = this.lerpVector(
        this.startingPositionOffset,
        this.desiredPositionOffset,
        this.offsetTransitionProgress
      )

      if (this.offsetTransitionProgress >= 1.0) {
        print(`MatchTransform (${this.getSceneObject().name}): Offset transition complete - object at hold distance`)
      }
    }

    // Calculate target position and rotation with current offset
    const targetPosWithOffset = this.targetPosition.add(this.positionOffset)
    const targetRotWithOffset = this.targetRotation.multiply(this.rotationOffset)

    const currentPosition = myTransform.getWorldPosition()
    const currentRotation = myTransform.getWorldRotation()

    // Debug logging every 10 frames
    this.updateCounter++
    if (this.updateCounter % 10 === 0) {
      const dist = currentPosition.distance(targetPosWithOffset)
      print(
        `MatchTransform (${this.getSceneObject().name}): dist=${dist.toFixed(2)}cm, transition=${(this.offsetTransitionProgress * 100).toFixed(0)}%`
      )
    }

    // Lerp to target position
    const newPosition = this.lerpVector(currentPosition, targetPosWithOffset, this.positionLerpSpeed * getDeltaTime())

    myTransform.setWorldPosition(newPosition)

    // Only update rotation if enabled (disabled for objects that override rotation)
    if (this.updateRotation) {
      // Slerp to target rotation
      const newRotation = quat.slerp(currentRotation, targetRotWithOffset, this.rotationLerpSpeed * getDeltaTime())

      myTransform.setWorldRotation(newRotation)
    }
  }

  private lerpVector(a: vec3, b: vec3, t: number): vec3 {
    const clampedT = Math.max(0, Math.min(1, t))

    return new vec3(a.x + (b.x - a.x) * clampedT, a.y + (b.y - a.y) * clampedT, a.z + (b.z - a.z) * clampedT)
  }
}
