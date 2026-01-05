/**
 * TargetCounter - TypeScript version for Lens Studio
 * Counts hits on a target and displays the count
 */
@component
export class TargetCounterTS extends BaseScriptComponent {
  @input
  @hint("Text component to display the counter")
  counterText!: Component

  @input
  @hint("Tag to identify arrows/projectiles")
  arrowTag: string = "Arrow"

  // Counter for tracking hits
  private counter: number = 0

  onAwake(): void {
    // Initialize the physics overlap events
    this.createEvent("OnStartEvent").bind(() => {
      this.initializeCollisionDetection()
    })
  }

  initializeCollisionDetection(): void {
    // In Lens Studio, we need to set up collision detection differently than Unity
    // Get collider component if available
    const collider = this.getSceneObject().getComponent("Physics.ColliderComponent")

    if (collider) {
      // Set up collision events
      if ((collider as any).onCollisionEnter) {
        ;(collider as any).onCollisionEnter.add((e) => {
          this.onCollisionEnter(e)
        })
        print("Target counter: Collision detection initialized")
      } else {
        // Alternative: use overlap events if collision isn't available
        // This is less accurate but can work for simple detection
        if ((collider as any).onOverlapEnter) {
          ;(collider as any).onOverlapEnter.add((e) => {
            this.onOverlapEnter(e)
          })
          print("Target counter: Overlap detection initialized")
        } else {
          print("Target counter: No collision or overlap events available")
          // Fall back to manual detection in update loop
          this.createEvent("UpdateEvent").bind(this.manualCollisionCheck.bind(this))
        }
      }
    } else {
      print("Target counter: No collider component found")
      // Fall back to manual detection in update loop
      this.createEvent("UpdateEvent").bind(this.manualCollisionCheck.bind(this))
    }

    // Initialize counter display
    this.updateCounterDisplay()
  }

  // Called when another object collides with this object
  onCollisionEnter(collisionData: any): void {
    // Check if the colliding object is an arrow
    const collidingObject = collisionData.collision.getOtherObject(this.getSceneObject())

    if (collidingObject && this.isArrow(collidingObject)) {
      this.incrementCounter()
    }
  }

  // Called when another object overlaps with this object
  onOverlapEnter(overlapData: any): void {
    // Check if the overlapping object is an arrow
    const overlappingObject = overlapData.overlap.collider.getSceneObject()

    if (overlappingObject && this.isArrow(overlappingObject)) {
      this.incrementCounter()
    }
  }

  // Manual collision check (fallback method if collision events aren't available)
  manualCollisionCheck(): void {
    // This is a simplified version that would need to be expanded for a real implementation
    // In a real implementation, we would need to get all nearby objects and check distances

    // For now, we'll just print a warning that this method is less accurate
    print("Warning: Using manual collision detection for target counter. This is less accurate.")
  }

  // Check if an object is an arrow based on its name
  isArrow(obj: SceneObject): boolean {
    // In Lens Studio, we'll check for arrow by name since tags might not be available
    const objName = obj.name.toLowerCase()
    return objName.includes("arrow") || objName.includes("projectile")
  }

  // Increment the counter and update the display
  incrementCounter(): void {
    this.counter++
    print("Target hit! Counter: " + this.counter)
    this.updateCounterDisplay()
  }

  // Update the counter display text
  updateCounterDisplay(): void {
    if (this.counterText) {
      // Format the counter with leading zeros (00, 01, etc.)
      const formattedCounter = this.counter.toString().padStart(2, "0")

      // Update the text
      ;(this.counterText as any).text = formattedCounter
    }
  }
}
