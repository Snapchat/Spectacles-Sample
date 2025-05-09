import {SceneObjectBoundariesProvider} from "./SceneObjectBoundariesProvider"

const TAG = "VisualBoundariesProvider"

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
      return Rect.create(
        Number.MAX_VALUE,
        -Number.MAX_VALUE,
        Number.MAX_VALUE,
        -Number.MAX_VALUE
      )
    }

    const rect = this.createNodeRectBoundaries(node)

    for (const child of node.children) {
      const childRect = this.getNodeBoundaries(child)
      rect.left = Math.min(rect.left, childRect.left)
      rect.right = Math.max(rect.right, childRect.right)
      rect.bottom = Math.min(rect.bottom, childRect.bottom)
      rect.top = Math.max(rect.top, childRect.top)
    }

    return rect
  }

  private createNodeRectBoundaries(sceneObject: SceneObject): Rect {
    const screenTransform = sceneObject.getComponent(
      "Component.ScreenTransform"
    )
    if (!screenTransform) {
      throw new Error(`Missing ScreenTransform attached to ${sceneObject.name}`)
    }

    const baseMeshVisual = sceneObject.getComponent("Component.BaseMeshVisual")
    if (!baseMeshVisual) {
      // Infinity doesn't work, but MAX_VALUE === Infinity
      return Rect.create(
        Number.MAX_VALUE,
        -Number.MAX_VALUE,
        Number.MAX_VALUE,
        -Number.MAX_VALUE
      )
    }

    return this.createScreenTransformRectBoundaries(screenTransform)
  }
}
