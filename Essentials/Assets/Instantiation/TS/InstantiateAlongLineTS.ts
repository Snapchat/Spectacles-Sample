/**
 * InstantiateAlongLine - TypeScript version of the C# utility
 * Instantiates objects evenly spaced along a line between two points
 */
@component
export class InstantiateAlongLineTS extends BaseScriptComponent {
  @input
  @hint("The prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("The start point of the line")
  startPoint!: SceneObject

  @input
  @hint("The end point of the line")
  endPoint!: SceneObject

  @input
  @hint("Number of objects to instantiate along the line")
  numberOfObjects: number = 10

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      print("Onstart event triggered")
    })
  }

  onStart(): void {
    this.instantiateObjectsAlongLine()
  }

  instantiateObjectsAlongLine(): void {
    if (this.numberOfObjects <= 0 || !this.prefab || !this.startPoint || !this.endPoint) {
      print("Please set all necessary references and ensure the number of objects is greater than zero.")
      return
    }

    const startPosition = this.startPoint.getTransform().getWorldPosition()
    const endPosition = this.endPoint.getTransform().getWorldPosition()

    // Calculate direction vector
    const dx = endPosition.x - startPosition.x
    const dy = endPosition.y - startPosition.y
    const dz = endPosition.z - startPosition.z

    // Calculate line length
    const lineLength = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // Normalize direction vector
    const directionX = dx / lineLength
    const directionY = dy / lineLength
    const directionZ = dz / lineLength

    // Calculate step size
    const step = lineLength / (this.numberOfObjects - 1)

    for (let i = 0; i < this.numberOfObjects; i++) {
      // Calculate the position for each object along the line
      const position = new vec3(
        startPosition.x + directionX * step * i,
        startPosition.y + directionY * step * i,
        startPosition.z + directionZ * step * i
      )

      // Create a prefab instance at the calculated position
      this.createPrefabInstance(position)
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
