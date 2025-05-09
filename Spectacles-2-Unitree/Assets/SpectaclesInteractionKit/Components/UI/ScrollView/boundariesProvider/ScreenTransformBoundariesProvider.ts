import {SceneObjectBoundariesProvider} from "./SceneObjectBoundariesProvider"

/**
 * Wraps screen transform boundaries
 */
export class ScreenTransformBoundariesProvider extends SceneObjectBoundariesProvider {
  protected getBoundaries(): Rect {
    if (!this.sceneObject.enabled) {
      return Rect.create(0, 0, 0, 0)
    }

    return this.createScreenTransformRectBoundaries(this.screenTransform)
  }
}
