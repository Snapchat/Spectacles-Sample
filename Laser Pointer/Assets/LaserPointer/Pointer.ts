import {Interactor, InteractorTriggerType} from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor"
import {HSLToRGB} from "SpectaclesInteractionKit.lspkg/Utils/color"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"

/**
 * Pointer class is a component that manages the state and appearance of a pointer in the scene.
 */
@component
export class Pointer extends BaseScriptComponent {
  // The pointer object
  @input
  pointerRmv: RenderMeshVisual

  // The SyncEntity instance is used to find the network root and manage synchronization
  private syncEntity = new SyncEntity(this)

  // The time when the pointer was created, used to calculate the elapsed time, in seconds
  private pointerReleaseTime: number | null = null

  // The pointer's color is represented in HSL format (Hue, Saturation, Lightness)
  private pointerHSL = new vec3(Math.random() * 360, 0.8, 0.8)

  // Convert the HSL color to RGB format (Red, Green, Blue)
  private pointerRGB = HSLToRGB(this.pointerHSL)

  private interactor: Interactor

  onAwake() {
    if (this.syncEntity.networkRoot.doIOwnStore()) {
      this.createEvent("UpdateEvent").bind(() => {
        this.updatePointer()
      })
    }
  }

  /**
   * Updates the pointer's state.
   *
   * This method is called every frame and updates the pointer's color and position based on the interactor's state.
   *
   * @private
   */
  private updatePointer() {
    // Update the pointer's color based on the time elapsed since its creation
    this.updatePointerColor()

    // Update the pointer's position based on the interactor's position
    this.updatePointerPosition()

    // If we've released the interactor, set the pointer release time to the current time
    if (this.interactor.currentTrigger === InteractorTriggerType.None && this.pointerReleaseTime === null) {
      this.pointerReleaseTime = getTime()
    }
  }

  /**
   * Updates the pointer's state.
   *
   * This method is called every frame and updates the pointer's color and position based on the interactor's state.
   *
   * @private
   */
  private updatePointerPosition() {
    if (this.interactor && this.interactor.targetHitPosition && this.pointerReleaseTime === null) {
      // Set the pointer's position to the interactor's position
      this.sceneObject.getTransform().setWorldPosition(this.interactor.targetHitPosition)
    }
  }

  /**
   * Updates the pointer's color based on the time elapsed since its creation.
   *
   * - For the first 2 seconds, the pointer remains fully opaque (alpha = 1).
   * - Between 2 and 4 seconds, the pointer gradually fades out to fully transparent (alpha = 0).
   * - After 4 seconds, the pointer is fully faded out and is destroyed.
   *
   * The color is updated using the pointer's RGB values and the calculated alpha value.
   *
   * @private
   */
  private updatePointerColor() {
    // The time since the pointer was released, or null if it hasn't been released yet
    const timeSinceRelease = this.pointerReleaseTime === null ? null : getTime() - this.pointerReleaseTime

    // Calculate the alpha value based on the time since interactor release
    // The alpha value will be 1 for the first second, then fade out to 0 over the next second
    let alpha: number
    if (timeSinceRelease === null || timeSinceRelease <= 1) {
      alpha = 1
    } else if (timeSinceRelease <= 2) {
      alpha = 1 - (timeSinceRelease - 1) / 1
    } else {
      // At this point, the pointer is fully faded out, so we can delete it
      this.sceneObject.destroy()
      return
    }

    // Create the color using the RGB values and the calculated alpha value
    const newColor = new vec4(this.pointerRGB.x, this.pointerRGB.y, this.pointerRGB.z, alpha)

    // Update the material color of the pointer entity
    this.pointerRmv.mainPass.baseColor = newColor
  }

  /**
   * Sets the interactor for the pointer.
   *
   * @param interactor - The interactor to be set for the pointer.
   */
  setInteractor(interactor: Interactor) {
    this.interactor = interactor
  }
}
