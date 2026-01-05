import {StateName} from "../../Components/Element"
import {VisualState} from "../Visual"
import {GradientParameters} from "./RoundedRectangle"
import {RoundedRectangleVisual} from "./RoundedRectangleVisual"

type ToggleRoundedRectangleVisualState = {
  baseGradient: GradientParameters
  borderColor: vec4
  borderGradient: GradientParameters
} & VisualState

/**
 * A specialized version of RoundedRectangleVisual that uses solid beige colors
 * for toggled states instead of gradients, specifically designed for toggle components.
 *
 * @extends RoundedRectangleVisual
 */
export class ToggleRoundedRectangleVisual extends RoundedRectangleVisual {
  private readonly darkGray = new vec4(0.4, 0.4, 0.4, 1)
  private originalGradientSetting: boolean = true
  private currentState: StateName = StateName.default

  /**
   * Override setState to properly handle dark gray color for toggled states
   */
  setState(stateName: StateName) {
    this.currentState = stateName

    // Store original gradient setting for non-toggled states
    if (stateName !== StateName.toggledDefault && stateName !== StateName.toggledHovered) {
      this.originalGradientSetting = this.isBaseGradient
    }

    // For toggled states, force solid color mode
    if (stateName === StateName.toggledDefault || stateName === StateName.toggledHovered) {
      // Completely disable gradient for background
      this.isBaseGradient = false
      // Call parent setState
      super.setState(stateName)
      // Force the dark gray color immediately after state change
      this.baseColor = this.darkGray
    } else {
      // For non-toggled states, restore original gradient setting
      this.isBaseGradient = this.originalGradientSetting
      super.setState(stateName)
    }
  }

  /**
   * Override updateColors to prevent gradient from overriding our dark gray color
   */
  protected updateColors(meshColor: vec4) {
    if (this.currentState === StateName.toggledDefault || this.currentState === StateName.toggledHovered) {
      // For toggled states, ignore the mesh color and force dark gray
      this.baseColor = this.darkGray
      return
    }
    super.updateColors(meshColor)
  }

  /**
   * Override updateGradient to prevent gradient updates for toggled states
   */
  protected updateGradient(gradient: GradientParameters) {
    if (this.currentState === StateName.toggledDefault || this.currentState === StateName.toggledHovered) {
      // Skip gradient updates for toggled states to maintain solid beige color
      return
    }
    super.updateGradient(gradient)
  }
}
