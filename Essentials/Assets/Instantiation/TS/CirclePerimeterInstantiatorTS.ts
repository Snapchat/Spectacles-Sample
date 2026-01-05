/**
 * CirclePerimeterInstantiator - TypeScript version of the C# utility
 * Instantiates prefabs evenly spaced along the perimeter of a circle
 */
@component
export class CirclePerimeterInstantiatorTS extends BaseScriptComponent {
  // References to scene objects
  @input
  @hint("Center of the circle")
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

  // Method to instantiate prefabs along the circle perimeter
  instantiatePrefabs(): void {
    if (!this.center || !this.prefab) {
      print("Error: Center or prefab not assigned!")
      return
    }

    const centerPosition = this.center.getTransform().getWorldPosition()

    for (let i = 0; i < this.numberOfPrefabs; i++) {
      // Calculate angle for each prefab (evenly spaced)
      const angle = (i * Math.PI * 2) / this.numberOfPrefabs

      // Calculate position on the perimeter of the circle
      const positionOnCircle = new vec3(
        centerPosition.x + Math.cos(angle) * this.radius,
        centerPosition.y + Math.sin(angle) * this.radius,
        centerPosition.z
      )

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(positionOnCircle)
    }
  }

  // Helper method to create a prefab instance at a specific position
  private createPrefabInstance(position: vec3): void {
    if (this.prefab) {
      const instance = this.prefab.instantiate(this.sceneObject)
      instance.getTransform().setWorldPosition(position)
      print(`Created prefab instance at position: ${position.x}, ${position.y}, ${position.z}`)
    }
  }

  // For visualization in the editor
  onDrawGizmos(): void {
    if (!this.center) return

    const centerPos = this.center.getTransform().getWorldPosition()

    // Print visualization info
    print(
      `Drawing circle perimeter with radius ${this.radius} at center position ${centerPos.x}, ${centerPos.y}, ${centerPos.z}`
    )
  }
}
