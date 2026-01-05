import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {MatchTransform} from "./MatchTransform"

/**
 * Makes an object grabbable via pinch or grab gesture.
 * Requires a MatchTransform component and a Physics Body component.
 */
@component
export class GrabbableObject extends BaseScriptComponent {
  // Public events for visual feedback systems
  public onGrabStartEvent: Event = new Event()
  public onGrabEndEvent: Event = new Event()
  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Ball", "Ball"),
      new ComboBoxItem("Racket", "Racket"),
      new ComboBoxItem("Darts", "Darts")
    ])
  )
  @hint("Type of object - determines grab behavior and rotation")
  objectType: string = "Ball"

  @input
  @hint("Reference to the MatchTransform component on this object")
  matchTransform: MatchTransform

  @input
  @hint("Time in seconds before destroying the object after it's dropped")
  destroyDelay: number = 4.5

  @input
  @hint("For Darts: The dartboard/scoreboard to look at when grabbed")
  @showIf("objectType", "Darts")
  scoreBoard: SceneObject

  @input
  @hint("For Darts: Force applied when releasing (throw strength)")
  @showIf("objectType", "Darts")
  dartThrowForce: number = 800.0

  @input
  @hint("For Ball/Racket: Force applied when releasing (throw strength)")
  ballThrowForce: number = 150.0

  @input
  @hint("For Ball/Racket: Multiplier for hand velocity (higher = more responsive to hand movement)")
  handVelocityMultiplier: number = 0.3

  private bodyComponent: BodyComponent | null = null
  private colliderComponent: ColliderComponent | null = null
  private isGrabbed: boolean = false
  private destroyEvent: DelayedCallbackEvent | null = null
  private grabbedHand: TrackedHand | null = null
  private updateEvent: SceneEvent | null = null
  private previousHandPosition: vec3 = vec3.zero()
  private handVelocity: vec3 = vec3.zero()

  onAwake() {
    // Get the body component
    this.bodyComponent = this.getSceneObject().getComponent("Physics.BodyComponent")

    // Get the collider component (fallback if no body)
    if (!this.bodyComponent) {
      this.colliderComponent = this.getSceneObject().getComponent("Physics.ColliderComponent")
    }

    // Validate required components
    if (!this.matchTransform) {
      print("GrabbableObject: MatchTransform component is required!")
    }

    if (!this.bodyComponent && !this.colliderComponent) {
      print("GrabbableObject: Physics Body or Collider component is required!")
    }

    // MatchTransform starts with isMatching=false by default, no need to call disableMatching()
  }

  /**
   * Called by GestureManager when object is grabbed
   */
  onGrab(hand: TrackedHand) {
    if (this.isGrabbed) return

    this.isGrabbed = true
    this.grabbedHand = hand

    // Cancel any pending destroy
    if (this.destroyEvent) {
      this.destroyEvent.cancel()
      this.destroyEvent = null
    }

    // IMPORTANT: Save current world position BEFORE unparenting
    const currentWorldPos = this.getSceneObject().getTransform().getWorldPosition()
    const currentWorldRot = this.getSceneObject().getTransform().getWorldRotation()

    // Unparent the object so it's not affected by parent transforms
    this.getSceneObject().setParent(null)

    // IMPORTANT: Restore world position immediately after unparenting
    // This prevents any visual jump from parenting changes
    this.getSceneObject().getTransform().setWorldPosition(currentWorldPos)
    this.getSceneObject().getTransform().setWorldRotation(currentWorldRot)

    // If body is dynamic, make it static/kinematic during grab
    if (this.bodyComponent && this.bodyComponent.dynamic) {
      this.bodyComponent.dynamic = false
    }

    // Set up MatchTransform to follow index tip
    if (
      this.matchTransform &&
      this.matchTransform.resetOffset &&
      this.matchTransform.setTarget &&
      this.matchTransform.enableMatching
    ) {
      const afterUnparentPos = this.getSceneObject().getTransform().getWorldPosition()
      const afterUnparentRot = this.getSceneObject().getTransform().getWorldRotation()

      print(`GrabbableObject (${this.getSceneObject().name}): After unparent - pos: ${afterUnparentPos}`)
      print(`GrabbableObject: Hand index tip - pos: ${hand.indexTip.position}`)

      this.matchTransform.resetOffset()

      // IMPORTANT: Set initial target BEFORE enabling to prevent jump
      // This initializes the offset before the first update
      this.matchTransform.setTarget(hand.indexTip.position, hand.indexTip.rotation)

      // Now enable it - offset is already calculated
      this.matchTransform.enableMatching()

      // For darts, disable rotation updates in MatchTransform (we override rotation every frame)
      if (this.objectType === "Darts") {
        this.matchTransform.disableRotationUpdates()
        print(`GrabbableObject: Rotation updates disabled for dart (will be overridden)`)
      } else {
        this.matchTransform.enableRotationUpdates()
      }

      print(`GrabbableObject: MatchTransform enabled with offset initialized`)
    } else {
      print("GrabbableObject: ERROR - MatchTransform not available or missing methods!")
    }

    // Initialize hand velocity tracking
    this.previousHandPosition = hand.indexTip.position
    this.handVelocity = vec3.zero()

    // Create update event to track hand position
    this.updateEvent = this.createEvent("UpdateEvent")
    this.updateEvent.bind(this.onUpdateWhileGrabbed.bind(this))

    // Trigger grab start event for visual feedback
    this.onGrabStartEvent.invoke()

    print(`GrabbableObject (${this.getSceneObject().name}): Grabbed! Update event created.`)
  }

  private updateCounter = 0

  /**
   * Update loop while grabbed to follow hand
   */
  private onUpdateWhileGrabbed() {
    if (!this.isGrabbed || !this.grabbedHand || !this.matchTransform) {
      return
    }

    // Check if hand is still tracked
    if (!this.grabbedHand.isTracked()) {
      // Hand lost tracking, release
      this.onRelease()
      return
    }

    // Track hand velocity for natural throwing (all types)
    const currentHandPos = this.grabbedHand.indexTip.position

    if (getDeltaTime() > 0) {
      // Calculate velocity as change in position over time
      this.handVelocity = currentHandPos.sub(this.previousHandPosition).uniformScale(1 / getDeltaTime())
    }

    this.previousHandPosition = currentHandPos

    // Update target position from hand's index tip
    // For rotation: Ball uses index rotation, Racket uses wrist, Darts override
    if (this.matchTransform.setTarget) {
      if (this.objectType === "Ball") {
        // Ball follows index tip rotation
        this.matchTransform.setTarget(this.grabbedHand.indexTip.position, this.grabbedHand.indexTip.rotation)
      } else if (this.objectType === "Racket") {
        // Racket follows wrist orientation (more natural for racket holding)
        this.matchTransform.setTarget(this.grabbedHand.indexTip.position, this.grabbedHand.wrist.rotation)
      } else {
        // Only Darts ignore hand rotation, will override below
        this.matchTransform.setTarget(
          this.grabbedHand.indexTip.position,
          this.getSceneObject().getTransform().getWorldRotation() // Keep current rotation
        )
      }
    }

    // Apply special rotation behavior based on object type (AFTER MatchTransform)
    this.applyTypeSpecificRotation()

    // Debug logging every 30 frames
    this.updateCounter++
    if (this.updateCounter % 30 === 0) {
      print(`GrabbableObject UPDATE: Setting target to ${this.grabbedHand.indexTip.position}`)
    }
  }

  /**
   * Apply rotation behavior specific to object type
   */
  private applyTypeSpecificRotation() {
    const transform = this.getSceneObject().getTransform()

    if (this.objectType === "Darts") {
      // Darts look at the score board (overrides hand rotation completely)
      if (this.scoreBoard) {
        const boardPos = this.scoreBoard.getTransform().getWorldPosition()
        const myPos = transform.getWorldPosition()
        const directionToBoard = boardPos.sub(myPos).normalize()

        // Create a lookAt rotation
        const lookAtRotation = quat.lookAt(directionToBoard, vec3.up())

        // Add 90-degree rotation on X axis to make dart point forward properly
        const xRotation = quat.angleAxis(90 * MathUtils.DegToRad, vec3.right())
        const finalRotation = lookAtRotation.multiply(xRotation)

        transform.setWorldRotation(finalRotation)
      }
    }
    // Ball and Racket use the default rotation from MatchTransform (follows hand rotation)
  }

  /**
   * Get the gesture type required for this object
   */
  getGestureType(): "pinch" | "grab" {
    if (this.objectType === "Racket") {
      return "grab"
    }
    // Ball and Darts use pinch
    return "pinch"
  }

  /**
   * Called by GestureManager when object is released
   */
  onRelease() {
    if (!this.isGrabbed) return

    this.isGrabbed = false

    // Clean up update event
    if (this.updateEvent) {
      this.updateEvent.enabled = false
      this.updateEvent = null
    }

    // Disable MatchTransform
    if (this.matchTransform && this.matchTransform.disableMatching) {
      this.matchTransform.disableMatching()
    }

    // Enable dynamic on body component so it falls/moves
    if (this.bodyComponent) {
      this.bodyComponent.dynamic = true

      // Apply throw force based on object type (BEFORE clearing grabbedHand)
      if (this.objectType === "Darts" && this.scoreBoard) {
        this.throwDart()
      } else if (this.objectType === "Ball") {
        this.throwBall()
      }
      // Racket just falls naturally - no throw force
    }

    // Clear grabbed hand AFTER using it for throw direction
    this.grabbedHand = null

    // Reset velocity tracking
    this.handVelocity = vec3.zero()
    this.previousHandPosition = vec3.zero()

    // Schedule destruction
    this.scheduleDestroy()

    print(`GrabbableObject (${this.getSceneObject().name}): Released!`)

    // Trigger grab end event for visual feedback (AFTER all cleanup)
    print(`GrabbableObject: Invoking onGrabEndEvent`)
    this.onGrabEndEvent.invoke()
  }

  /**
   * Throw the dart using hand velocity but guided towards the score board
   */
  private throwDart() {
    if (!this.bodyComponent || !this.scoreBoard) return

    const myPos = this.getSceneObject().getTransform().getWorldPosition()
    const boardPos = this.scoreBoard.getTransform().getWorldPosition()

    // Calculate direction from dart to score board
    const directionToBoard = boardPos.sub(myPos).normalize()

    // Use hand velocity magnitude for throw strength (feels natural)
    let throwStrength = this.handVelocity.length * this.handVelocityMultiplier

    // If hand velocity is too low, use base force
    if (throwStrength < 2) {
      throwStrength = this.dartThrowForce
    } else {
      // Add base force to velocity-based strength
      throwStrength += this.dartThrowForce
    }

    // Throw in direction of board (guided) with natural strength
    const forceVector = directionToBoard.uniformScale(throwStrength)

    // Clear any existing rotation/angular velocity
    this.bodyComponent.angularVelocity = vec3.zero()

    // Set high angular damping to prevent spinning during flight
    this.bodyComponent.angularDamping = 0.95 // High damping = less spinning

    print(`GrabbableObject: Throwing dart with strength ${throwStrength.toFixed(1)} towards board`)
    print(`GrabbableObject: Hand velocity: ${this.handVelocity.length.toFixed(1)}`)

    // Apply impulse force (linear only, no torque)
    this.bodyComponent.addForce(forceVector, Physics.ForceMode.Impulse)
  }

  /**
   * Throw the ball/racket based on hand velocity for natural throwing
   */
  private throwBall() {
    if (!this.bodyComponent) return

    // Use hand velocity for more natural throwing
    let throwVelocity = this.handVelocity.uniformScale(this.handVelocityMultiplier)

    // If velocity is too low (not moving hand), use forward direction with base force
    if (throwVelocity.length < 2) {
      if (this.grabbedHand) {
        const handForward = this.grabbedHand.indexTip.rotation.multiplyVec3(vec3.forward())
        throwVelocity = handForward.uniformScale(this.ballThrowForce)
      } else {
        // Fallback: throw forward
        throwVelocity = vec3.forward().uniformScale(this.ballThrowForce)
      }
    } else {
      // Add base force to the velocity-based throw
      if (this.grabbedHand) {
        const handForward = this.grabbedHand.indexTip.rotation.multiplyVec3(vec3.forward())
        const baseForce = handForward.uniformScale(this.ballThrowForce)
        throwVelocity = throwVelocity.add(baseForce)
      }
    }

    print(`GrabbableObject: Throwing ${this.objectType} with velocity ${throwVelocity.length.toFixed(1)}`)
    print(`GrabbableObject: Hand velocity contribution: ${this.handVelocity.length.toFixed(1)}`)

    // Apply as impulse force
    this.bodyComponent.addForce(throwVelocity, Physics.ForceMode.Impulse)
  }

  /**
   * Schedule the object to be destroyed after a delay
   */
  private scheduleDestroy() {
    if (this.destroyEvent) {
      this.destroyEvent.cancel()
    }

    this.destroyEvent = this.createEvent("DelayedCallbackEvent")
    this.destroyEvent.bind(() => {
      // Don't destroy darts that have stuck to the board (they're parented to it)
      if (this.objectType === "Darts" && this.scoreBoard) {
        const parent = this.getSceneObject().getParent()
        if (parent === this.scoreBoard) {
          print("GrabbableObject: Dart stuck to board - skipping destroy")
          return
        }
      }

      print("GrabbableObject: Destroying object after delay")
      this.getSceneObject().destroy()
    })
    this.destroyEvent.reset(this.destroyDelay)
  }

  /**
   * Check if this object is currently grabbed
   */
  isCurrentlyGrabbed(): boolean {
    return this.isGrabbed
  }

  /**
   * Get the collider component for overlap detection
   */
  getCollider(): ColliderComponent | null {
    return this.bodyComponent || this.colliderComponent
  }
}
