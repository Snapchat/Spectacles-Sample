/**
 * CircleSlicingInstantiator - TypeScript version of the C# utility
 * Instantiates prefabs along slices of a circle (like pizza slices)
 */
@component
export class CircleSlicingInstantiatorTS extends BaseScriptComponent {
  @input
  @hint("Prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("Number of slices (radial divisions)")
  xSlices: number = 8

  @input
  @hint("Number of elements per slice")
  yElementsPerSlice: number = 5

  @input
  @hint("Radius of the circle")
  radius: number = 5.0

  @input
  @hint("Center point of the circle")
  center!: SceneObject

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      print("Onstart event triggered")
    })
  }

  onStart(): void {
    this.instantiateElementsInSlices()
  }

  // Method to instantiate the elements along the slices of the circle
  instantiateElementsInSlices(): void {
    if (this.prefab == null || this.center == null) {
      print("Please assign both a prefab and a center SceneObject.")
      return
    }

    // Angle step between each slice
    const angleStep = (360 / this.xSlices) * (Math.PI / 180) // Convert to radians
    const centerPos = this.center.getTransform().getWorldPosition()

    // Loop through each slice
    for (let i = 0; i < this.xSlices; i++) {
      // Calculate the angle for this slice (in radians)
      const angle = i * angleStep

      // Get the start and end points of the slice line (on the XZ plane)
      const sliceStart = new vec3(
        centerPos.x + Math.cos(angle) * this.radius,
        centerPos.y + Math.sin(angle) * this.radius,
        centerPos.z
      )

      const sliceEnd = new vec3(
        centerPos.x + Math.cos(angle + angleStep) * this.radius,
        centerPos.y + Math.sin(angle + angleStep) * this.radius,
        centerPos.z
      )

      // Instantiate Y elements along the slice (line)
      for (let j = 0; j < this.yElementsPerSlice; j++) {
        // Interpolate between the start and end points of the slice
        const t = j / (this.yElementsPerSlice - 1)
        const position = this.lerp(sliceStart, sliceEnd, t)

        // Create a prefab instance at the calculated position
        this.createPrefabInstance(position)
      }
    }
  }

  // Helper method to linearly interpolate between two points
  private lerp(start: vec3, end: vec3, t: number): vec3 {
    return new vec3(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t, start.z + (end.z - start.z) * t)
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
