/**
 * RandomPointsInsideBox - TypeScript version of the C# utility
 * Instantiates prefabs at random points inside a box volume
 */
@component
export class RandomPointsInsideBoxTS extends BaseScriptComponent {
  @input
  @hint("Reference to the box (a SceneObject that defines the box center)")
  boxObject!: SceneObject

  @input
  @hint("Prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("Number of random points to generate")
  numberOfPoints: number = 10

  @input
  @hint("Size of the box in x direction")
  sizeX: number = 1.0

  @input
  @hint("Size of the box in y direction")
  sizeY: number = 1.0

  @input
  @hint("Size of the box in z direction")
  sizeZ: number = 1.0

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      print("Onstart event triggered")
    })
  }

  onStart(): void {
    this.generateRandomPointsInside()
  }

  generateRandomPointsInside(): void {
    if (!this.boxObject || !this.prefab) {
      print("Error: Box object or prefab not assigned!")
      return
    }

    const boxPosition = this.boxObject.getTransform().getWorldPosition()

    // For the TypeScript version, we're using four SceneObjects as the vertices
    // of the box instead of a direct box collider.
    // We'll use the provided sizeX, sizeY, sizeZ parameters for the box dimensions

    for (let i = 0; i < this.numberOfPoints; i++) {
      // Generate random point within the box volume
      const randomPoint = new vec3(
        boxPosition.x + (Math.random() - 0.5) * this.sizeX,
        boxPosition.y + (Math.random() - 0.5) * this.sizeY,
        boxPosition.z + (Math.random() - 0.5) * this.sizeZ
      )

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(randomPoint)
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
