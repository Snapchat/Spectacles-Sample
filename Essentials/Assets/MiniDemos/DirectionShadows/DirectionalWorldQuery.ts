// Import required modules
const WorldQueryModule = require("LensStudio:WorldQueryModule")

const EPSILON = 0.01

/**
 * DirectionalWorldQuery
 *
 * A utility that performs world queries in a direction defined by two scene objects.
 * It can then project rays from a third object in that same direction.
 */
@component
export class DirectionalWorldQuery extends BaseScriptComponent {
  // Direction definition inputs
  @input
  directionStart: SceneObject

  @input
  directionEnd: SceneObject

  // Ray projection input
  @input
  rayStart: SceneObject

  // Object to position at hit location
  @input
  objectHitPoint: SceneObject

  // Ray length parameter
  @input
  rayLength: number = 100.0

  // Debug options
  @input
  debugEnabled: boolean = true

  // Whether to enable filtering for the hit test
  @input
  filterEnabled: boolean = true

  // Private properties
  private hitTestSession: HitTestSession
  private direction: vec3
  private isDirectionSet: boolean = false

  /**
   * Called when the script is initialized
   */
  onAwake() {
    print("DirectionalWorldQuery: Initializing...")

    // Create new hit test session
    this.hitTestSession = this.createHitTestSession(this.filterEnabled)

    // Validate required inputs
    if (!this.directionStart || !this.directionEnd || !this.rayStart) {
      print("ERROR: Please set directionStart, directionEnd, and rayStart inputs")
      return
    }

    if (!this.objectHitPoint) {
      print("ERROR: Please set objectHitPoint input")
      return
    }

    // Make sure the hit object has a visible component
    const visual = this.objectHitPoint.getComponent("Component.RenderMeshVisual")
    if (!visual) {
      print("WARNING: objectHitPoint does not have a RenderMeshVisual component. It may not be visible when placed.")
    }

    // Disable target object initially
    // this.objectHitPoint.enabled = false;

    // Create update event
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))

    print("DirectionalWorldQuery: Initialization complete")
  }

  /**
   * Creates a hit test session with the specified options
   */
  createHitTestSession(filterEnabled) {
    // Create hit test session with options
    const options = HitTestSessionOptions.create()
    options.filter = filterEnabled

    const session = WorldQueryModule.createHitTestSessionWithOptions(options)
    return session
  }

  /**
   * Updates the direction vector based on direction start and end objects
   */
  updateDirection() {
    const startPos = this.directionStart.getTransform().getWorldPosition()
    const endPos = this.directionEnd.getTransform().getWorldPosition()

    // Calculate direction vector
    this.direction = endPos.sub(startPos).normalize()
    this.isDirectionSet = true

    // IMPORTANT: Invert the direction to point downward if it's pointing upward
    // This is needed because we want to cast the ray toward surfaces, not away from them
    if (this.direction.y > 0) {
      this.direction = new vec3(-this.direction.x, -this.direction.y, -this.direction.z)
      print("Direction inverted to point downward")
    }

    if (this.debugEnabled) {
      print(
        "Direction: " + this.direction.toString() + " (from " + startPos.toString() + " to " + endPos.toString() + ")"
      )
    }
  }

  /**
   * Handles hit test results
   */
  onHitTestResult(results) {
    if (results === null) {
      if (this.debugEnabled) {
        print("DirectionalWorldQuery: No hit detected")
      }
      this.objectHitPoint.enabled = false
    } else {
      if (this.debugEnabled) {
        print("DirectionalWorldQuery: Hit detected at " + results.position.toString())
      }

      // Get hit information
      const hitPosition = results.position
      const hitNormal = results.normal

      // Identify the direction the object should look at based on the normal of the hit location
      let lookDirection
      if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON) {
        lookDirection = vec3.forward()
      } else {
        lookDirection = hitNormal.cross(vec3.up())
      }

      // Calculate rotation
      const toRotation = quat.lookAt(lookDirection, hitNormal)

      // Set position and rotation
      this.objectHitPoint.getTransform().setWorldPosition(hitPosition)
      this.objectHitPoint.getTransform().setWorldRotation(toRotation)

      // Make sure the object is enabled and visible
      this.objectHitPoint.enabled = true

      if (this.debugEnabled) {
        print("Hit position: " + hitPosition.toString())
        print("Hit normal: " + hitNormal.toString())
        print("Object placed at: " + this.objectHitPoint.getTransform().getWorldPosition().toString())
      }
    }
  }

  /**
   * Performs a world query from the ray start object in the direction defined by direction start and end objects
   */
  performWorldQuery() {
    if (!this.isDirectionSet) {
      this.updateDirection()
    }

    const rayStart = this.rayStart.getTransform().getWorldPosition()

    // Calculate ray end point by extending the direction from the start point
    const scaledDirection = new vec3(
      this.direction.x * this.rayLength,
      this.direction.y * this.rayLength,
      this.direction.z * this.rayLength
    )
    const rayEnd = rayStart.add(scaledDirection)

    if (this.debugEnabled) {
      print("Ray: from " + rayStart.toString() + " to " + rayEnd.toString())
    }

    // Try multiple ray lengths if no hit is detected
    const tryRayLengths = [this.rayLength, this.rayLength * 0.5, this.rayLength * 0.1, this.rayLength * 2]
    let hitDetected = false

    // First try with the configured ray length
    this.hitTestSession.hitTest(rayStart, rayEnd, (results) => {
      if (results !== null) {
        hitDetected = true
        this.onHitTestResult(results)
      } else if (this.debugEnabled) {
        print("No hit detected with primary ray length, trying alternatives...")
      }
    })

    // If no hit was detected, try alternative ray lengths
    if (!hitDetected) {
      for (let i = 0; i < tryRayLengths.length && !hitDetected; i++) {
        const length = tryRayLengths[i]
        if (length === this.rayLength) continue // Skip the one we already tried

        const altScaledDirection = new vec3(
          this.direction.x * length,
          this.direction.y * length,
          this.direction.z * length
        )
        const altRayEnd = rayStart.add(altScaledDirection)

        if (this.debugEnabled) {
          print("Trying alternative ray length: " + length)
          print("Alternative ray: from " + rayStart.toString() + " to " + altRayEnd.toString())
        }

        this.hitTestSession.hitTest(rayStart, altRayEnd, this.onHitTestResult.bind(this))
      }
    }
  }

  /**
   * Called every frame
   */
  onUpdate() {
    // Update direction in case objects have moved
    this.updateDirection()

    // Perform world query
    this.performWorldQuery()
  }

  /**
   * Clean up resources when the script is destroyed
   */
  onDestroy() {
    // No need to clean up resources as we're not creating any dynamically
  }
}
