/**
 * SnapSaberCollisionHandler - TypeScript component for Lens Studio
 * Handles collision detection between the saber and target objects
 * Connects to the ScoreManager to update scores on successful hits
 */

import {SnapSaberGlobalManager} from "./SnapSaberGlobalManager"
@component
export class SnapSaberCollisionHandler extends BaseScriptComponent {
  @input
  @hint("The saber object with the collider component")
  saberObject!: SceneObject

  @input
  @hint("Tag or name prefix to identify target objects")
  targetIdentifier: string = "SnapSaberCube"

  // Private variables
  private collider: Component
  private scoreManagerComponent: any

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  onStart(): void {
    // Get the collider component from the saber
    if (this.saberObject) {
      this.collider = this.saberObject.getComponent("Physics.ColliderComponent")

      if (!this.collider) {
        print("Error: No collider component found on saber object")
        return
      }

      // Set up collision detection
      this.setupCollisionDetection()
    } else {
      print("Error: Saber object not assigned")
    }

    print("SnapSaber Collision Handler initialized")
  }

  // Set up collision detection events
  private setupCollisionDetection(): void {
    // Register for overlap events
    ;(this.collider as any).onOverlapEnter.add((e) => {
      this.onOverlapEnter(e.overlap)
    })
  }

  // Handle overlap event when the saber collides with an object
  private onOverlapEnter(overlap: any): void {
    // Get the colliding object
    const collidingObject = overlap.collider.getSceneObject()

    // Check if it's a target object (using naming convention)
    if (collidingObject && collidingObject.name.includes(this.targetIdentifier)) {
      print(`Saber hit target: ${collidingObject.name}`)

      // First try using the global manager (most reliable method)
      const globalManager = SnapSaberGlobalManager.getInstance()
      if (globalManager) {
        print("Using global manager to register hit")
        globalManager.registerHit(collidingObject)
        return
      }

      // Attempt to register hit with the component if found
      if (this.scoreManagerComponent && typeof this.scoreManagerComponent.registerHit === "function") {
        print("Calling registerHit on direct score manager")
        try {
          this.scoreManagerComponent.registerHit(collidingObject)
          print("Successfully registered hit via direct component!")
        } catch (e) {
          print("Error calling registerHit: " + e)
          // If error during score update, still destroy the target
          collidingObject.destroy()
        }
      } else {
        print("All score manager methods unavailable, just destroying target")
        // If no score manager available, still destroy the target
        collidingObject.destroy()
      }
    }
  }
}
