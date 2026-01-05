import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"
import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {SpatialImageSwapper} from "./SpatialImageSwapper"
//import { setTimeout } from "SpectaclesInteractionKit/Utils/debounce";

/**
 * Reorders rendering order to ensure the image looks correct.
 *
 * @remarks To be attached to the root {@link ContainerFrame}.
 *
 * @version 1.0.0
 */
@component
export class SpatialImageFrame extends BaseScriptComponent {
  @typename
  SpatialImage: keyof ComponentNameMap

  @input
  private container: ContainerFrame
  @input("SpatialImage")
  private spatializer
  @input
  private spatialImageSwapper: SpatialImageSwapper
  @input
  private camera: SceneObject

  @input
  @allowUndefined
  private imageTexture: Texture
  private updateFocalPoint: boolean = false

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.initializeFrame()

      this.spatializer.frameOn = true
      this.spatializer.fadeBorder = true
    })
    this.createEvent("UpdateEvent").bind(() => {
      if (this.updateFocalPoint) {
        this.setFocalPoint()
      }
    })
    this.createEvent("OnEnableEvent").bind(() => {
      this.setFocalPoint()
    })
  }

  /**
   * Toggle call to switch between specialized and flat images.
   */
  public setSpatialized(value: boolean): void {
    this.spatialImageSwapper.setSpatialized(value)
  }

  /**
   * Updates both spatialized and flat images to the passed texture.
   *
   * @param image - The image to be spatialized.
   * @param swapWhenSpatialized - If true, the spatialized image will be
   * displayed as soon as it is returned.
   */
  public setImage(image: Texture, swapWhenSpatialized: boolean = false): void {
    // update the size of the container to match the dimensions of the new image.
    const height: number = this.container.innerSize.y
    const newWidth: number = height * (image.getWidth() / image.getHeight())
    this.updateContainerSize(new vec2(newWidth, height))

    // if this argument is true, then when the "onLoaded" event is actuated,
    // this component should update to display the spatialized image.
    if (swapWhenSpatialized) {
      const setSpatialCallback = () => {
        this.setSpatialized(true)
        this.spatializer.onLoaded.remove(setSpatialCallback)
      }
      this.spatializer.onLoaded.add(setSpatialCallback)
    }

    // The swapper is passed a reference to the new flat image and set to be
    // unspatialized until the spatialization result comes through.
    this.spatialImageSwapper.setImage(image)
    this.spatialImageSwapper.setSpatialized(false)
    this.spatializer.setImage(image)

    // A work around to the initialization of the scene
    setTimeout(() => {
      this.updateContainerSize(new vec2(newWidth, height))
    }, 100)
  }

  private initializeFrame(): void {
    this.spatializer.sceneObject.enabled = false

    this.container.renderOrder = -30
    const visual = this.container.getFrameObject().getComponent("Component.Visual") as RenderMeshVisual
    this.container.material.mainPass.cutOutCenter = 1

    if (this.imageTexture) {
      this.setImage(this.imageTexture)
    }

    this.container.onTranslationStart.add(() => {
      this.updateFocalPoint = true
    })
    this.container.onTranslationEnd.add(() => {
      this.updateFocalPoint = false
    })
  }

  private updateContainerSize(newSize: vec2) {
    this.container.innerSize = newSize
  }

  private setFocalPoint() {
    const cameraPosition = this.camera.getTransform().getWorldPosition()
    const imagePos = this.spatializer.getTransform().getWorldPosition()
    const distance = cameraPosition.distance(imagePos)
    this.spatializer.setFrameOffset(-distance)
  }
}
