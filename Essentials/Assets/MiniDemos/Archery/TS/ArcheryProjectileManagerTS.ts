import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
const log = new NativeLogger("MyNativeLogger")

/**
 * ArcheryProjectileManager - TypeScript version for Lens Studio
 * Manages the firing of projectiles for an archery game
 */

@component
export class ArcheryProjectileManagerTS extends BaseScriptComponent {
  @input
  @hint("Initial velocity of projectiles when fired (higher = faster arrows)")
  initialSpeed: number = 30.0

  @input
  @hint("Gravity effect on projectiles (lower = flatter trajectory)")
  gravityStrength: number = 15.0

  @input
  @hint("Air resistance factor (higher = more drag, slower arrows)")
  dragFactor: number = 0.005

  @input
  @hint("Projectile to instantiate when firing")
  projectile!: ObjectPrefab

  @input
  @hint("Start point for the charging line")
  shootingRayStart!: SceneObject

  @input
  @hint("End point for the charging line")
  shootingRayEnd!: SceneObject

  @input
  @hint("Start point for the charging line")
  lineA!: SceneObject

  @input
  @hint("End point for the charging line")
  lineB!: SceneObject

  @input
  @hint("Object that visualizes the charge level")
  archCharger!: SceneObject

  @input
  @hint("Hand position reference")
  manipulatingObject!: SceneObject

  @input
  @hint("Text component to display charging percentage")
  chargingText!: Component

  @input
  @hint("Text component to display score")
  scoreText!: Component

  @input
  @hint("Target object that rotates (for scoring)")
  rotatingTarget!: SceneObject

  @input
  @hint("The interactable object for manipulation")
  interactableManipulation: Interactable

  // Private properties
  private score: number = 0
  private previousChargeLevel: number = 0
  private chargeThreshold: number = 1.0 // Changed from 0.9 to 1.0 for testing
  private shootCount: number = 0
  private canShoot: boolean = true // Flag to prevent multiple rapid shots
  private shotCooldownTime: number = 1.0 // Seconds between allowed shots
  private lastShotTime: number = 0 // Time since last shot

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate()
    })
  }

  onStart() {
    // Create an event callback function for the interactable when trigger starts
    const onTriggerStartCallback = (event: InteractorEvent) => {
      log.d("📢 TRIGGER START DETECTED")
      print("Trigger start detected")
    }

    // Create an event callback function for when trigger ends
    const onTriggerEndCallback = (event: InteractorEvent) => {
      log.d("📢 TRIGGER END DETECTED - Not shooting on release")
      print("TRIGGER END DETECTED - No action needed")

      // No shooting on trigger end - we only want to shoot when crossing the threshold
      // from below during charge (onUpdate handles this)
    }

    // Add the event listeners to the interactable
    this.interactableManipulation.onInteractorTriggerStart(onTriggerStartCallback)
    this.interactableManipulation.onInteractorTriggerEnd(onTriggerEndCallback)

    // Initialize text displays
    if (this.chargingText) {
      ;(this.chargingText as any).text = "0.00"
    }

    if (this.scoreText) {
      ;(this.scoreText as any).text = "Score: 0"
    }

    log.d("ArcheryProjectileManagerTS initialized")
  }

  onUpdate(): void {
    // Update cooldown timer to re-enable shooting
    if (!this.canShoot) {
      const currentTime = getTime()
      const timeSinceLastShot = currentTime - this.lastShotTime

      // Check if we've waited enough time to allow shooting again
      if (timeSinceLastShot > this.shotCooldownTime) {
        this.canShoot = true
        log.d("🏹 Ready to shoot again")
      }
    }

    // Update visualization based on manipulating object position
    if (this.manipulatingObject && this.lineA && this.lineB) {
      // Calculate closest point on line for visualization
      const closestPoint = this.closestPointOnLine(
        this.manipulatingObject.getTransform().getWorldPosition(),
        this.lineA.getTransform().getWorldPosition(),
        this.lineB.getTransform().getWorldPosition()
      )

      // Update the position of the charge level visualizer
      this.archCharger.getTransform().setWorldPosition(closestPoint)

      // Calculate the charge level (0 to 1)
      const startPos = this.lineA.getTransform().getWorldPosition()
      const endPos = this.lineB.getTransform().getWorldPosition()

      // Calculate distance along the line as a normalized value (0 to 1)
      const lineVector = endPos.sub(startPos)
      const pointVector = closestPoint.sub(startPos)
      const dotProduct = pointVector.dot(lineVector.normalize())
      const lineLength = lineVector.length

      // Safe division to avoid NaN
      const chargeLevel = lineLength > 0 ? Math.max(0, Math.min(1, dotProduct / lineLength)) : 0

      // Log current charge level every frame for debugging
      log.d(
        "Current charge level: " +
          chargeLevel.toFixed(2) +
          ", Previous: " +
          this.previousChargeLevel.toFixed(2) +
          ", Can Shoot: " +
          this.canShoot
      )

      // If charge level drops below threshold, we need to reset before allowing another shot
      if (chargeLevel < 0.9 && this.previousChargeLevel >= 0.9) {
        this.canShoot = true
        log.d("🏹 Charge reset, ready for next shot")
      }

      // Check if we crossed the threshold from below (0.9->1.0, not dropping from above)
      // AND only shoot if we're allowed to (to prevent multiple shots)
      if (chargeLevel >= this.chargeThreshold && this.previousChargeLevel < this.chargeThreshold && this.canShoot) {
        log.d("🎯 THRESHOLD CROSSED! SHOOTING ARROW NOW!")
        print("SHOOTING ARROW - Threshold crossed from below!")
        this.shootArrow()

        // Block shooting after a shot until cooldown is done
        this.canShoot = false
        this.lastShotTime = getTime()
      }

      // Store the current charge level for the next frame
      this.previousChargeLevel = chargeLevel

      // Show charge percentage
      if (this.chargingText) {
        // Using property assignment for text component
        ;(this.chargingText as any).text = chargeLevel.toFixed(2)

        // Update the color based on threshold
        if (chargeLevel >= this.chargeThreshold) {
          // Use orange if we can't shoot yet
          if (!this.canShoot) {
            ;(this.chargingText as any).textColor = new vec4(1, 0.5, 0, 1) // Orange when cooling down
          } else {
            ;(this.chargingText as any).textColor = new vec4(0, 1, 0, 1) // Green when ready
          }
        } else {
          ;(this.chargingText as any).textColor = new vec4(1, 1, 1, 1) // White when charging
        }
      }

      // Update score display
      if (this.scoreText) {
        ;(this.scoreText as any).text = "Score: " + this.score
      }
    }
  }

  // Fire the arrow projectile
  shootArrow(): void {
    this.shootCount++
    log.d("🏹 SHOOT ARROW CALLED! Shot #" + this.shootCount + " 🏹")
    print("SHOOTING ARROW - Shot #" + this.shootCount)

    // Use shooting ray start and end for direction
    if (!this.shootingRayStart || !this.shootingRayEnd) {
      log.d("Shooting ray points not set")
      return
    }

    // Calculate the direction from start to end
    const startPos = this.shootingRayStart.getTransform().getWorldPosition()
    const endPos = this.shootingRayEnd.getTransform().getWorldPosition()

    // Make sure we have a valid direction vector
    if (startPos.distance(endPos) < 0.001) {
      log.d("Start and end positions are too close")
      return
    }

    // Calculate normalized direction vector precisely
    const shootDir = endPos.sub(startPos).normalize()

    // Log shooting parameters for debugging
    log.d("🎯 Shooting from: " + startPos.toString())
    log.d("🎯 Shooting to: " + endPos.toString())
    log.d("🎯 Direction vector: " + shootDir.toString())

    // Create the projectile
    if (this.projectile) {
      // Instantiate at shooting ray start
      const instance = this.projectile.instantiate(this.sceneObject)
      if (!instance) {
        log.d("Failed to instantiate projectile")
        return
      }

      // Enable the instance and position it exactly at the start point
      instance.enabled = true
      instance.getTransform().setWorldPosition(startPos)

      // Create a rotation that directly aligns the projectile with the shooting direction
      // The Z-axis of the object should point toward the shooting direction
      const lookRotation = this.getLookRotation(shootDir)
      instance.getTransform().setWorldRotation(lookRotation)

      // Log rotation info for debugging
      log.d("🔄 Rotation set to align projectile with direction: " + shootDir.toString())

      // Double-check projectile orientation before applying force
      const objectMatrix = instance.getTransform().getWorldTransform()
      const worldForward = objectMatrix.multiplyDirection(new vec3(0, 0, 1))
      log.d("🔄 Projectile Z-axis (world space): " + worldForward.normalize().toString())

      // Log projectile setup
      log.d("🔴 Projectile instantiated at: " + startPos.toString())
      log.d("🔴 Projectile direction set to: " + shootDir.toString())

      // Get physics body component
      const physicsBody = instance.getComponent("Physics.BodyComponent") as any

      if (physicsBody) {
        // Reset any existing physics state
        physicsBody.velocity = new vec3(0, 0, 0)
        physicsBody.angularVelocity = new vec3(0, 0, 0)

        // Calculate initial velocity based on shooting direction
        const initialVelocity = shootDir.uniformScale(this.initialSpeed)

        try {
          // =================== USE MANUAL MOTION INSTEAD OF PHYSICS ===================
          // Since physics mode isn't working correctly, use manual motion for all projectiles
          log.d("🔄 Using manual motion for more reliable trajectory")

          // Completely disable the physics body to prevent it from interfering
          physicsBody.enabled = false

          // Set up manual motion with the script component
          this.setupManualMotion(instance, shootDir)
        } catch (e) {
          log.d("⚠️ Error applying physics: " + e.toString())
          print("Error with physics - falling back to manual motion")

          // Fallback to manual motion if physics fails
          this.setupManualMotion(instance, shootDir)
        }

        // Add collision detection for scoring
        this.setupCollisionDetection(instance)
      } else {
        log.d("No physics body found on projectile - using manual motion")

        // Use manual motion for non-physics objects
        this.setupManualMotion(instance, shootDir)
      }
    } else {
      log.d("ERROR: Projectile prefab not assigned!")
    }
  }

  // Set up manual motion for objects without physics or as fallback
  private setupManualMotion(projectile: SceneObject, direction: vec3): void {
    const moveScript = projectile.createComponent("ScriptComponent") as any
    if (moveScript) {
      // Store exact start position for reference
      moveScript.startPosition = projectile.getTransform().getWorldPosition()

      // Store initial trajectory parameters
      moveScript.direction = direction.normalize() // Normalized direction
      moveScript.speed = this.initialSpeed // Speed (units per second)
      moveScript.gravity = this.gravityStrength // Gravity effect
      moveScript.drag = this.dragFactor // Air resistance
      moveScript.flightTime = 0 // Track flight time

      // For debugging
      log.d("🚀 Starting position: " + moveScript.startPosition.toString())
      log.d("🚀 Direction: " + moveScript.direction.toString())
      log.d("🚀 Speed: " + moveScript.speed)

      // Update event that runs every frame to move the projectile
      moveScript.createEvent("UpdateEvent").bind(() => {
        // Get time since last frame
        const dt = getDeltaTime()
        moveScript.flightTime += dt

        // Calculate position based on physics - similar to projectile motion equations:
        // position = startPos + (direction * speed * time) + (0, -0.5 * gravity * time^2, 0)

        // Calculate distance traveled in the x-z plane (horizontal)
        const baseVelocity = moveScript.direction.uniformScale(moveScript.speed)

        // Current horizontal position (without gravity)
        const horizontalOffset = baseVelocity.uniformScale(moveScript.flightTime)

        // Calculate vertical drop due to gravity (only affects Y component)
        // Gravity effect increases over time (t²)
        const time_squared = moveScript.flightTime * moveScript.flightTime
        const gravityDrop = new vec3(0, -0.5 * moveScript.gravity * time_squared, 0)

        // Apply air resistance (simplified - just slows down over time)
        const dragFactor = Math.max(0, 1.0 - moveScript.drag * moveScript.flightTime)
        const horizontalWithDrag = horizontalOffset.uniformScale(dragFactor)

        // Combine all effects to get the new position
        const newPos = moveScript.startPosition.add(horizontalWithDrag).add(gravityDrop)
        projectile.getTransform().setWorldPosition(newPos)

        // Calculate instantaneous velocity for arrow rotation (combine horizontal and vertical)
        const horizVelocity = baseVelocity.uniformScale(dragFactor)
        const vertVelocity = new vec3(0, -moveScript.gravity * moveScript.flightTime, 0)
        const currentVelocity = horizVelocity.add(vertVelocity)

        // Only update rotation if there's meaningful movement
        if (currentVelocity.length > 0.001) {
          const flightDir = currentVelocity.normalize()
          const lookRotation = this.getLookRotation(flightDir)
          projectile.getTransform().setWorldRotation(lookRotation)
        }
      })

      // Add simple collision detection for scoring
      this.setupSimpleCollisionDetection(projectile, moveScript)
    }
  }

  // Setup collision detection for scoring
  private setupCollisionDetection(projectile: SceneObject): void {
    // Get the collider component on the projectile
    const collider = projectile.getComponent("Physics.ColliderComponent") as any
    if (collider) {
      // Setup overlap events
      collider.onOverlapEnter.add((e) => {
        const hitObject = e.overlap.collider.getSceneObject()

        // Check if it hit the rotating target or any other target
        if ((this.rotatingTarget && hitObject === this.rotatingTarget) || hitObject.name.includes("Target")) {
          this.score += 10 // Increase score
          log.d("Target hit! Score: " + this.score)

          // Update score text
          if (this.scoreText) {
            ;(this.scoreText as any).text = "Score: " + this.score
          }

          // Destroy the projectile after hitting
          projectile.destroy()
        }
      })
    }
  }

  // Simplified collision detection for non-physics objects
  private setupSimpleCollisionDetection(projectile: SceneObject, moveScript: any): void {
    moveScript.createEvent("UpdateEvent").bind(() => {
      const projectilePos = projectile.getTransform().getWorldPosition()

      // If we have a rotating target, check distance to it
      if (this.rotatingTarget) {
        const targetPos = this.rotatingTarget.getTransform().getWorldPosition()
        const distance = targetPos.sub(projectilePos).length

        if (distance < 5.0) {
          // Collision threshold
          this.score += 10 // Increase score
          log.d("Rotating target hit! Score: " + this.score)

          // Update score text
          if (this.scoreText) {
            ;(this.scoreText as any).text = "Score: " + this.score
          }

          // Destroy projectile
          projectile.destroy()
        }
      }
    })
  }

  // Helper function to find the closest point on a line
  closestPointOnLine(point: vec3, start: vec3, end: vec3): vec3 {
    const lineDirection = end.sub(start)
    const lineLength = lineDirection.length
    const normalizedDirection = lineDirection.normalize()
    const pointDirection = point.sub(start)
    const dot = pointDirection.dot(normalizedDirection)
    const clampedDot = Math.max(0, Math.min(dot, lineLength))
    return start.add(normalizedDirection.uniformScale(clampedDot))
  }

  // Calculate look rotation quaternion from a direction
  private getLookRotation(forward: vec3): quat {
    // Ensure forward is normalized
    forward = forward.normalize()

    // In Lens Studio, the default forward direction is typically (0,0,1)
    const worldForward = new vec3(0, 0, 1)

    // Choose appropriate up vector - default is (0,1,0) but if forward is nearly
    // parallel to that, use (0,0,1) instead
    let upVector = new vec3(0, 1, 0)
    if (Math.abs(forward.dot(upVector)) > 0.99999) {
      upVector = new vec3(1, 0, 0) // Use right vector instead if forward is aligned with up
    }

    // Create a stable right vector
    const right = upVector.cross(forward).normalize()

    // Recalculate a stable up vector to ensure orthogonality
    const up = forward.cross(right).normalize()

    // Build rotation matrix from the orthonormal basis (right, up, forward)
    const m00 = right.x
    const m01 = right.y
    const m02 = right.z
    const m10 = up.x
    const m11 = up.y
    const m12 = up.z
    const m20 = forward.x
    const m21 = forward.y
    const m22 = forward.z

    // Convert the rotation matrix to quaternion
    const trace = m00 + m11 + m22
    const q = new quat(0, 0, 0, 1)

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0)
      q.w = 0.25 / s
      q.x = (m12 - m21) * s
      q.y = (m20 - m02) * s
      q.z = (m01 - m10) * s
    } else if (m00 > m11 && m00 > m22) {
      const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22)
      q.w = (m12 - m21) / s
      q.x = 0.25 * s
      q.y = (m01 + m10) / s
      q.z = (m20 + m02) / s
    } else if (m11 > m22) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22)
      q.w = (m20 - m02) / s
      q.x = (m01 + m10) / s
      q.y = 0.25 * s
      q.z = (m12 + m21) / s
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11)
      q.w = (m01 - m10) / s
      q.x = (m20 + m02) / s
      q.y = (m12 + m21) / s
      q.z = 0.25 * s
    }

    return q
  }
}
