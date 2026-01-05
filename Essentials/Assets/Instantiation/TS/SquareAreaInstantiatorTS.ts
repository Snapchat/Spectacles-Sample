/**
 * SquareAreaInstantiator - TypeScript version of the C# utility
 * Instantiates prefabs within a square area
 */
@component
export class SquareAreaInstantiatorTS extends BaseScriptComponent {
  @input
  @hint("Center of the square area")
  center!: SceneObject

  @input
  @hint("Prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("Number of prefabs to instantiate")
  numberOfPrefabs: number = 10

  @input
  @hint("Size of the square (half-width/half-height)")
  size: number = 5.0

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

  // Method to instantiate prefabs within the square area
  instantiatePrefabs(): void {
    if (!this.center || !this.prefab) {
      print("Error: Center or prefab not assigned!")
      return
    }

    const centerPosition = this.center.getTransform().getWorldPosition()

    for (let i = 0; i < this.numberOfPrefabs; i++) {
      // Random position within the square area
      const randomPosition = new vec3(
        centerPosition.x + (Math.random() * 2 - 1) * this.size,
        centerPosition.y + (Math.random() * 2 - 1) * this.size,
        centerPosition.z
      )

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(randomPosition)
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
}
