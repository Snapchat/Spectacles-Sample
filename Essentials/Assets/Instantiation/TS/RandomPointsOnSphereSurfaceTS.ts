/**
 * RandomPointsOnSphereSurface - TypeScript version of the C# utility
 * Instantiates prefabs at random points on a sphere surface
 */
@component
export class RandomPointsOnSphereSurfaceTS extends BaseScriptComponent {
  @input
  @hint("Reference to the sphere (center point)")
  sphere!: SceneObject

  @input
  @hint("Prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("Number of random points to generate")
  numberOfPoints: number = 10

  @input
  @hint("Radius of the sphere")
  radius: number = 1.0

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
    if (!this.sphere || !this.prefab) {
      print("Error: Sphere or prefab not assigned!")
      return
    }

    const spherePosition = this.sphere.getTransform().getWorldPosition()

    for (let i = 0; i < this.numberOfPoints; i++) {
      // Generate a random point on a unit sphere surface
      const randomPoint = this.randomPointOnUnitSphere()

      // Scale by the radius and offset by the sphere position
      const randomPointOnSphere = new vec3(
        spherePosition.x + randomPoint.x * this.radius,
        spherePosition.y + randomPoint.y * this.radius,
        spherePosition.z + randomPoint.z * this.radius
      )

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(randomPointOnSphere)
    }
  }

  // Helper method to create a random point on a unit sphere surface
  private randomPointOnUnitSphere(): vec3 {
    // Generate a random point in 3D space
    const x = Math.random() * 2 - 1 // Range: -1 to 1
    const y = Math.random() * 2 - 1 // Range: -1 to 1
    const z = Math.random() * 2 - 1 // Range: -1 to 1

    // Normalize to get a point on the unit sphere
    const length = Math.sqrt(x * x + y * y + z * z)

    // Handle the edge case of a zero vector (very unlikely)
    if (length === 0) {
      return new vec3(0, 1, 0) // Default to up vector
    }

    return new vec3(x / length, y / length, z / length)
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
