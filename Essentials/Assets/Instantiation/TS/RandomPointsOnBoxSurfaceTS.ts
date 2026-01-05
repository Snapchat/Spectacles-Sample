/**
 * RandomPointsOnBoxSurface - TypeScript version of the C# utility
 * Instantiates prefabs at random points on the surface of a box
 */
@component
export class RandomPointsOnBoxSurfaceTS extends BaseScriptComponent {
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
    this.generateRandomPointsOnSurface()
  }

  generateRandomPointsOnSurface(): void {
    if (!this.boxObject || !this.prefab) {
      print("Error: Box object or prefab not assigned!")
      return
    }

    const boxPosition = this.boxObject.getTransform().getWorldPosition()

    for (let i = 0; i < this.numberOfPoints; i++) {
      // Generate a random point on the box surface
      const randomPoint = this.getRandomPointOnBoxSurface(boxPosition)

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(randomPoint)
    }
  }

  // Helper method to generate a random point on the box surface
  private getRandomPointOnBoxSurface(boxCenter: vec3): vec3 {
    // Calculate the half-extents of the box
    const halfSizeX = this.sizeX / 2
    const halfSizeY = this.sizeY / 2
    const halfSizeZ = this.sizeZ / 2

    // Randomly select one of the 6 faces of the box (0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z, 5: -Z)
    const randomFace = Math.floor(Math.random() * 6)

    let randomPoint = new vec3(0, 0, 0)

    switch (randomFace) {
      case 0: // +X face
        randomPoint = new vec3(
          boxCenter.x + halfSizeX,
          boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
          boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
        )
        break

      case 1: // -X face
        randomPoint = new vec3(
          boxCenter.x - halfSizeX,
          boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
          boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
        )
        break

      case 2: // +Y face
        randomPoint = new vec3(
          boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
          boxCenter.y + halfSizeY,
          boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
        )
        break

      case 3: // -Y face
        randomPoint = new vec3(
          boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
          boxCenter.y - halfSizeY,
          boxCenter.z + (Math.random() * 2 - 1) * halfSizeZ
        )
        break

      case 4: // +Z face
        randomPoint = new vec3(
          boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
          boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
          boxCenter.z + halfSizeZ
        )
        break

      case 5: // -Z face
        randomPoint = new vec3(
          boxCenter.x + (Math.random() * 2 - 1) * halfSizeX,
          boxCenter.y + (Math.random() * 2 - 1) * halfSizeY,
          boxCenter.z - halfSizeZ
        )
        break
    }

    return randomPoint
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
