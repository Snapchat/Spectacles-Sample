import LineRenderer from "../../../Utils/views/LineRenderer/LineRenderer"

export enum VisualStyle {
  Full = 0,
  Split = 1,
  FadedEnd = 2,
  FadedStart = 3,
}

/**
 * InteractorLineRenderer is a modified LineRenderer meant for use with Interactors.
 * It uses a special shader material in order to display the line gradients and visuals shown in the spec.
 */
export default class InteractorLineRenderer extends LineRenderer {
  /**
   * @returns visual gradient style of the line
   */
  get visualStyle(): VisualStyle {
    return this.material.mainPass.visualStyle as VisualStyle
  }

  /**
   * Set the visual gradient style of the line
   */
  set visualStyle(style: VisualStyle) {
    this.material.mainPass.visualStyle = style
  }

  /**
   * @returns maximum opacity level of the line
   */
  get opacity(): number {
    return this.material.mainPass.maxAlpha as number
  }

  /**
   * Set the maximum opacity level of the line
   */
  set opacity(opacity: number) {
    this.material.mainPass.maxAlpha = opacity
  }
}
