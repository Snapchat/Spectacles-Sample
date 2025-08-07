/**
 * Responsible to changing the active scene object between a flat version and
 * the spatialized version when the onLoaded event triggers.
 */
@component
export class SpatialImageSwapper extends BaseScriptComponent {
  @typename
  SpatialImage: keyof ComponentNameMap

  @input("SpatialImage")
  private spatializer
  @input
  private flatImage: Image

  /**
   * When spatialisation is complete, if true, the image will automatically swap
   * to the spatialized version.
   */
  @input
  private autoSwapToSpatialized: boolean = false

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  /**
   * Sets the texture of the flat version of the image.
   *
   * @param image - The texture to be applied.
   */
  public setImage(image: Texture): void {
    if (this.flatImage) {
      this.flatImage.mainMaterial.mainPass.baseTex = image

      const aspectRatio = image.getWidth() / image.getHeight()
      const invertedScale = new vec3(1 / aspectRatio, 1, 1)
      this.flatImage.sceneObject.getTransform().setLocalScale(invertedScale)
    }

    if (this.spatializer.spatialImage) {
      this.spatializer.spatialImage.enabled = false
      this.spatializer.spatialImage = null
    }
  }

  /**
   * If true, the spatialized image will be displayed and the depth animated in.
   * If false, the flat image will be displayed.
   */
  public setSpatialized(spatialized: boolean): void {
    if (spatialized) {
      this.setSpatial()
    } else {
      this.setFlat()
    }
  }

  private initialize(): void {
    if (this.autoSwapToSpatialized) {
      this.spatializer.onLoaded.add((status: number) => {
        if (status === 1) {
          this.setSpatialized(true)
        } else {
          print("Image did not successfully spatialize.")
        }
      })
    }
  }

  private setFlat(): void {
    this.flatImage.sceneObject.enabled = true
    this.spatializer.sceneObject.enabled = false
  }

  private setSpatial(): void {
    this.flatImage.sceneObject.enabled = false
    this.spatializer.sceneObject.enabled = true
  }
}
