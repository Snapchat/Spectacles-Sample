/**
 * InstantiateOn2DGrids - TypeScript version of the C# utility
 * Instantiates objects in a 2D grid pattern on the XZ plane
 */
@component
export class InstantiateOn2DGridsTS extends BaseScriptComponent {
  @input
  @hint("The prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("The center of the grid")
  gridCenter!: SceneObject

  @input
  @hint("Number of elements along the X axis")
  gridWidth: number = 5

  @input
  @hint("Number of elements along the Z axis")
  gridHeight: number = 5

  @input
  @hint("Spacing between elements in the X direction")
  spacingX: number = 1.5

  @input
  @hint("Spacing between elements in the Z direction")
  spacingY: number = 1.5

  @input
  @hint("Fixed Y position for all elements on the XZ plane")
  zPosition: number = 0.0

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      print("Onstart event triggered")
    })
  }

  onStart(): void {
    this.instantiateGrid()
  }

  instantiateGrid(): void {
    if (!this.prefab || !this.gridCenter) {
      print("Please assign both the prefab and the grid center Transform.")
      return
    }

    // Calculate the starting position based on the center of the grid
    const centerPosition = this.gridCenter.getTransform().getWorldPosition()
    const startPosition = new vec3(
      centerPosition.x - ((this.gridWidth - 1) * this.spacingX) / 2,
      centerPosition.y - ((this.gridHeight - 1) * this.spacingY) / 2,
      centerPosition.z + this.zPosition
    )

    // Loop through the rows and columns to instantiate the prefabs
    for (let x = 0; x < this.gridWidth; x++) {
      for (let z = 0; z < this.gridHeight; z++) {
        // Calculate the position for each prefab (on the XZ plane)
        const position = new vec3(
          startPosition.x + x * this.spacingX,
          startPosition.y + z * this.spacingY,
          startPosition.z
        )

        // Create a prefab instance at the calculated position
        this.createPrefabInstance(position)
      }
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
