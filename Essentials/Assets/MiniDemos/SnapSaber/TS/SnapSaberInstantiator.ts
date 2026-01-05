/**
 * SnapSaberInstantiator - TypeScript component for Lens Studio
 * Instantiates prefabs at regular intervals and animates them toward a target direction
 * For a mini Beat Saber style game
 */
@component
export class SnapSaberInstantiator extends BaseScriptComponent {
  @input
  @hint("Prefab to instantiate")
  prefab!: ObjectPrefab

  @input
  @hint("Spawn position - where prefabs appear from")
  spawnPosition!: SceneObject

  @input
  @hint("Target position - defines movement direction")
  targetPosition!: SceneObject

  @input
  @hint("Time between spawning prefabs in seconds")
  spawnInterval: number = 2.0

  @input
  @hint("Speed at which prefabs move")
  moveSpeed: number = 2.0

  @input
  @hint("Rotation speed on X axis in degrees per second")
  rotationSpeedX: number = 0.0

  @input
  @hint("Rotation speed on Y axis in degrees per second")
  rotationSpeedY: number = 90.0

  @input
  @hint("Rotation speed on Z axis in degrees per second")
  rotationSpeedZ: number = 0.0

  @input
  @hint("Maximum lifetime of prefabs in seconds before auto-destruction")
  maxLifetime: number = 10.0

  @input
  @hint("Destroy prefabs when they reach target position")
  destroyOnReachTarget: boolean = false

  // Private variables
  private nextSpawnTime: number = 0
  private activePrefabs: SceneObject[] = []
  private prefabData: Map<string, any> = new Map()

  onAwake(): void {
    // Bind the onStart and update events
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      print("SnapSaber Instantiator started")
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate()
    })
  }

  onStart(): void {
    // Set the first spawn time
    this.nextSpawnTime = getTime() + this.spawnInterval
  }

  // Helper function to generate a unique ID
  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  onUpdate(): void {
    // Check if it's time to spawn a new prefab
    const currentTime = getTime()
    if (currentTime >= this.nextSpawnTime) {
      this.spawnPrefab()
      this.nextSpawnTime = currentTime + this.spawnInterval
    }

    // Update all active prefabs
    this.updatePrefabs()
  }

  // Spawns a new prefab and initializes its properties
  spawnPrefab(): void {
    if (!this.prefab || !this.spawnPosition || !this.targetPosition) {
      print("Error: Required inputs not assigned (prefab, spawnPosition, or targetPosition)")
      return
    }

    // Instantiate the prefab
    const instance = this.prefab.instantiate(this.sceneObject)
    if (!instance) {
      print("Failed to instantiate prefab")
      return
    }

    // Position the prefab at the spawn position
    const spawnPos = this.spawnPosition.getTransform().getWorldPosition()
    instance.getTransform().setWorldPosition(spawnPos)

    // Calculate movement direction
    const targetPos = this.targetPosition.getTransform().getWorldPosition()
    const moveDirection = targetPos.sub(spawnPos).normalize()

    // Generate a unique ID for this instance
    const instanceId = this.generateUniqueId()

    // Store instance data for updates
    this.prefabData.set(instanceId, {
      creationTime: getTime(),
      moveDirection: moveDirection,
      originalDistance: spawnPos.distance(targetPos),
      id: instanceId
    })

    // Store ID in the prefab's name for retrieval
    instance.name = `SnapSaberCube_${instanceId}`

    // Add to active prefabs
    this.activePrefabs.push(instance)

    print(`Spawned prefab at ${spawnPos.x.toFixed(2)}, ${spawnPos.y.toFixed(2)}, ${spawnPos.z.toFixed(2)}`)
  }

  // Updates all active prefabs (movement and rotation)
  updatePrefabs(): void {
    const currentTime = getTime()
    const deltaTime = getDeltaTime()
    const targetPos = this.targetPosition.getTransform().getWorldPosition()
    const prefabsToKeep: SceneObject[] = []
    const idsToRemove: string[] = []

    // Loop through all active prefabs
    for (let i = 0; i < this.activePrefabs.length; i++) {
      const prefab = this.activePrefabs[i]
      let prefabToDestroy = false
      let instanceId = ""

      // Skip if the prefab is no longer valid
      if (!prefab) {
        continue
      }

      try {
        // Extract ID from the prefab's name - with extra safety checks
        if (typeof prefab.name !== "string") {
          print("Warning: Prefab name is not a string")
          continue
        }

        const idMatch = prefab.name.match(/SnapSaberCube_(\w+)/)
        if (!idMatch || !idMatch[1]) {
          print("Warning: Could not extract ID from prefab name: " + prefab.name)
          continue
        }

        instanceId = idMatch[1]
        const instanceData = this.prefabData.get(instanceId)

        // Skip if data is missing
        if (!instanceData) {
          print("Warning: No instance data found for ID: " + instanceId)
          continue
        }

        const lifetime = currentTime - instanceData.creationTime

        // Check if the prefab has exceeded its lifetime
        if (lifetime > this.maxLifetime) {
          prefabToDestroy = true
          idsToRemove.push(instanceId)
        } else {
          try {
            // Get current position and calculate new position
            const transform = prefab.getTransform()
            if (!transform) {
              print("Warning: Could not get transform for prefab")
              continue
            }

            const currentPos = transform.getWorldPosition()

            // Move the prefab
            const moveAmount = this.moveSpeed * deltaTime
            const newPos = currentPos.add(instanceData.moveDirection.uniformScale(moveAmount))
            transform.setWorldPosition(newPos)

            // Apply rotation
            const currentRot = transform.getLocalRotation()
            const xRad = this.rotationSpeedX * deltaTime * (Math.PI / 180)
            const yRad = this.rotationSpeedY * deltaTime * (Math.PI / 180)
            const zRad = this.rotationSpeedZ * deltaTime * (Math.PI / 180)

            // Create rotation quaternions for each axis
            const xRot = quat.angleAxis(xRad, new vec3(1, 0, 0))
            const yRot = quat.angleAxis(yRad, new vec3(0, 1, 0))
            const zRot = quat.angleAxis(zRad, new vec3(0, 0, 1))

            // Combine rotations
            const newRot = currentRot.multiply(xRot).multiply(yRot).multiply(zRot)
            transform.setLocalRotation(newRot)

            // Check if prefab has reached the target (if destroyOnReachTarget is enabled)
            if (this.destroyOnReachTarget) {
              const distToTarget = currentPos.distance(targetPos)
              if (distToTarget < 0.5) {
                // Threshold distance to consider "reached"
                prefabToDestroy = true
                idsToRemove.push(instanceId)
              }
            }
          } catch (e) {
            print("Error updating prefab: " + e)
            prefabToDestroy = true
            idsToRemove.push(instanceId)
          }
        }

        // Handle destruction at the end to avoid mid-loop issues
        if (prefabToDestroy) {
          try {
            prefab.destroy()
          } catch (e) {
            print("Error destroying prefab: " + e)
          }
        } else {
          // Keep this prefab for the next update
          prefabsToKeep.push(prefab)
        }
      } catch (e) {
        // Safer error printing that handles null/undefined errors
        try {
          if (e instanceof Error) {
            print("Error in prefab update loop: " + e.message)
          } else {
            print("Unknown error in prefab update loop")
          }
        } catch (printError) {
          print("Failed to print error details")
        }

        // If an error occurred, try to destroy the prefab to clean up
        try {
          if (prefab) {
            prefab.destroy()
          }
        } catch (destroyError) {
          // Ignore errors during emergency cleanup
        }

        // Always try to remove this prefab's data
        if (instanceId) {
          idsToRemove.push(instanceId)
        }
      }
    }

    // Clean up any instance data for removed prefabs
    for (const id of idsToRemove) {
      this.prefabData.delete(id)
    }

    // Update the active prefabs list
    this.activePrefabs = prefabsToKeep
  }
}
