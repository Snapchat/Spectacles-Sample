import { LoadingIndicator } from "./LoadingIndicator"
import { SpatialImageFrame } from "./SpatialImageFrame"

/**
 * Provides a somewhat complex example of use of the spatial image components.
 *
 * @version 1.0.0
 */
@component
export class SpatialGallery extends BaseScriptComponent {
  @typename
  SpatialImage: keyof ComponentNameMap

  /**
   * The SIK container frame that holds the image.
   */
  @input
  frame: SpatialImageFrame
  /**
   * The spatial image custom component.
   */
  @input("SpatialImage")
  image: any
  /**
   * The loading indicator to tell that the image is being spatialized.
   */
  @input
  loadingIndicator: LoadingIndicator
  /**
   * The set of images that make up the gallery.
   */
  @input
  gallery: Texture[]
  /**
   * If true the order of the gallery will be shuffled on initialization.
   */
  @input
  shuffle: boolean

  private index: number = 0

  onAwake() {
    if (this.shuffle) {
      shuffle(this.gallery)
    }
    this.createEvent("OnStartEvent").bind(() => {
      this.initialiseFrame()
    })
  }

  /**
   * Moves the gallery to the next image.
   */
  public leftPressed(): void {
    let newIndex = this.index - 1
    if (newIndex < 0) {
      newIndex += this.gallery.length
    }
    this.setIndex(newIndex)
  }

  /**
   * Move the gallery to the previous image.
   */
  public rightPressed(): void {
    this.setIndex((this.index + 1) % this.gallery.length)
  }

  private initialiseFrame(): void {
    this.setIndex(this.index)

    this.image.onLoadingStart.add(() => {
      this.loadingIndicator.sceneObject.enabled = true
      this.loadingIndicator.reset()
    })

    this.image.onLoaded.add(() => {
      this.loadingIndicator.sceneObject.enabled = false
    })
  }

  private setIndex(newIndex: number) {
    this.index = newIndex
    this.frame.setImage(this.gallery[this.index], true)
  }
}

// declare the function
function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
