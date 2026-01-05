import {RoundedRectangleVisual} from "../../Visuals/RoundedRectangle/RoundedRectangleVisual"

import {VisualElement} from "../VisualElement"

/**
 * The `Button` class represents a button component in the Spectacles UI Kit.
 * It extends the `VisualElement` class and initializes a default visual if none is provided.
 *
 * @extends VisualElement
 */
@component
export class Backplate extends VisualElement {
  protected createDefaultVisual(): void {
    if (!this._visual) {
      const defaultVisual: RoundedRectangleVisual = new RoundedRectangleVisual(this.sceneObject)
      defaultVisual.hasBorder = true
      defaultVisual.isBorderGradient = true
      defaultVisual.borderSize = 0.05

      defaultVisual.isBaseGradient = true
      this._visual = defaultVisual
    }
  }
}
