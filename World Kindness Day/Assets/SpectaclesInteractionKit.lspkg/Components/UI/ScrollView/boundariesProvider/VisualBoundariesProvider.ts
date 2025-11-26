import {SceneObjectBoundariesProvider} from "./SceneObjectBoundariesProvider"

/**
 * Computes boundaries for elements with BaseMeshVisual
 */
export class VisualBoundariesProvider extends SceneObjectBoundariesProvider {
  protected getBoundaries(): Rect {
    if (!this.sceneObject.enabled) {
      return Rect.create(0, 0, 0, 0)
    }
    return this.getNodeBoundaries(this.sceneObject)
  }

  private getNodeBoundaries(node: SceneObject): Rect {
    if (!node.enabled) {
      // Infinity doesn't work, but MAX_VALUE === Infinity
      return Rect.create(Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE)
    }

    const rect = this.createNodeRectBoundaries(node)
    for (const child of node.children) {
      const childRect = this.getNodeBoundaries(child)
      if (rect.left > childRect.left) {
        rect.left = childRect.left
      }
      if (rect.right < childRect.right) {
        rect.right = childRect.right
      }
      if (rect.bottom > childRect.bottom) {
        rect.bottom = childRect.bottom
      }
      if (rect.top < childRect.top) {
        rect.top = childRect.top
      }
    }

    return rect
  }

  private createNodeRectBoundaries(sceneObject: SceneObject): Rect {
    const screenTransform = sceneObject.getComponent("Component.ScreenTransform")
    if (!screenTransform) {
      throw new Error(`Missing ScreenTransform attached to ${sceneObject.name}`)
    }

    const baseMeshVisual = sceneObject.getComponent("Component.BaseMeshVisual")
    if (!baseMeshVisual) {
      // Infinity doesn't work, but MAX_VALUE === Infinity
      return Rect.create(Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE)
    }

    return this.createScreenTransformRectBoundaries(screenTransform)
  }
}
