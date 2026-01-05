/**
 * SimpleCircleAreaInstantiator - TypeScript version of the C# utility
 * Instantiates prefabs within a circular area using a simpler approach
 */
@component
export class SimpleCircleAreaInstantiatorTS extends BaseScriptComponent {
  @input
  @hint("Center of the circle area")
  center!: SceneObject

  @input
  @hint("Prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("Number of prefabs to instantiate")
  numberOfPrefabs: number = 10

  @input
  @hint("Radius of the circle")
  radius: number = 5.0

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      print("Onstart event triggered")
    })
  }

  onStart(): void {
    this.instantiatePrefabs()
  }

  // Method to instantiate prefabs within the circle area
  instantiatePrefabs(): void {
    if (!this.center || !this.prefab) {
      print("Error: Center or prefab not assigned!")
      return
    }

    const centerPosition = this.center.getTransform().getWorldPosition()

    for (let i = 0; i < this.numberOfPrefabs; i++) {
      // Generate a random point in a unit circle (on XZ plane)
      const randomPoint = this.randomPointInsideUnitCircle()

      // Scale by radius and position at center
      const randomPosition = new vec3(
        centerPosition.x + randomPoint.x * this.radius,
        centerPosition.y + randomPoint.y * this.radius,
        centerPosition.z
      )

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(randomPosition)
    }
  }

  // Helper method to generate a random point inside a unit circle
  private randomPointInsideUnitCircle(): {x: number; y: number} {
    // Implementation based on rejection sampling
    let x: number, y: number
    let lengthSquared: number

    do {
      // Generate random point in the [-1,1] square
      x = Math.random() * 2 - 1
      y = Math.random() * 2 - 1

      // Check if it's inside the unit circle
      lengthSquared = x * x + y * y
    } while (lengthSquared > 1.0 || lengthSquared == 0)

    return {x, y}
  }

  // Helper method to create a prefab instance at a specific position
  private createPrefabInstance(position: vec3): void {
    if (this.prefab) {
      const instance = this.prefab.instantiate(this.sceneObject)
      instance.getTransform().setWorldPosition(position)
      print(`Created prefab instance at position: ${position.x}, ${position.y}, ${position.z}`)
    }
  }
}
