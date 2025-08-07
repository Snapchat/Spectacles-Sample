import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"
import {StateName} from "../../Components/Element"
import {COLORS, DISABLED_COLOR, Visual, VisualState} from "../Visual"
import {GradientParameters, RoundedRectangle} from "./RoundedRectangle"

const BACKGROUND_GRADIENT_PARAMETERS: {[key: string]: GradientParameters} = {
  default: {
    enabled: true,
    type: "Rectangle",
    stop0: {enabled: true, percent: 0, color: COLORS.darkGray},
    stop1: {enabled: true, percent: 0.5, color: COLORS.darkGray},
    stop2: {enabled: true, percent: 0.95, color: COLORS.darkGray},
    stop3: {enabled: true, percent: 0.99, color: COLORS.darkGray}
  },
  toggled: {
    enabled: true,
    type: "Rectangle",
    stop0: {enabled: true, percent: -1, color: withAlpha(COLORS.lightGray.uniformScale(0.3), 1)},
    stop1: {enabled: true, percent: -1, color: withAlpha(COLORS.lightGray.uniformScale(0.3), 1)},
    stop2: {enabled: true, percent: -1, color: withAlpha(COLORS.lightGray.uniformScale(0.3), 1)},
    stop3: {enabled: true, percent: 3, color: withAlpha(COLORS.lightGray.uniformScale(0.9), 1)}
  }
}

const BORDER_GRADIENT_PARAMETERS: {[key: string]: GradientParameters} = {
  default: {
    enabled: true,
    start: new vec2(-1, 0),
    end: new vec2(1, 0),
    stop0: {enabled: true, percent: 0, color: COLORS.lightGray},
    stop1: {enabled: true, percent: 0.5, color: withAlpha(COLORS.lightGray.uniformScale(0.66), 1)},
    stop2: {enabled: true, percent: 1, color: COLORS.lightGray}
  },
  toggled: {
    enabled: true,
    start: new vec2(-1, 0),
    end: new vec2(1, 0),
    stop0: {enabled: true, percent: 0, color: COLORS.lightGray},
    stop1: {enabled: true, percent: 0.5, color: COLORS.lightGray},
    stop2: {enabled: true, percent: 1, color: COLORS.lightGray}
  },
  toggledHovered: {
    enabled: true,
    start: new vec2(-1, 0),
    end: new vec2(1, 0),
    stop0: {enabled: true, percent: 0, color: withAlpha(COLORS.lightGray.uniformScale(2), 1)},
    stop1: {enabled: true, percent: 0.5, color: withAlpha(COLORS.lightGray.uniformScale(2), 1)},
    stop2: {enabled: true, percent: 1, color: withAlpha(COLORS.lightGray.uniformScale(2), 1)}
  }
}

type RoundedRectangleVisualState = {
  baseGradient: GradientParameters
  borderColor: vec4
  borderGradient: GradientParameters
} & VisualState

/**
 * The `RoundedRectangleVisual` class represents a visual component that renders a rounded rectangle
 * with customizable properties such as border, gradients, and colors. It extends the base `Visual` class
 * and provides additional functionality specific to rounded rectangles.
 *
 * @extends Visual
 */
export class RoundedRectangleVisualCardBot extends Visual {
  private _roundedRectangle: RoundedRectangle

  private _borderDefaultColor: vec4 = COLORS.lightGray
  private _borderHoverColor: vec4 = COLORS.lightGray
  private _borderActiveColor: vec4 = COLORS.lightGray
  private _borderDisabledColor: vec4 = DISABLED_COLOR

  private _defaultGradient: GradientParameters = BACKGROUND_GRADIENT_PARAMETERS.default
  private _hoverGradient: GradientParameters = BACKGROUND_GRADIENT_PARAMETERS.default
  private _activeGradient: GradientParameters = BACKGROUND_GRADIENT_PARAMETERS.toggled
  private _disabledGradient: GradientParameters = BACKGROUND_GRADIENT_PARAMETERS.default
  private _toggledDefaultGradient: GradientParameters = BACKGROUND_GRADIENT_PARAMETERS.default
  private _toggledHoverGradient: GradientParameters = BACKGROUND_GRADIENT_PARAMETERS.default

  private _borderDefaultGradient: GradientParameters = BORDER_GRADIENT_PARAMETERS.default
  private _borderHoverGradient: GradientParameters = BORDER_GRADIENT_PARAMETERS.toggledHovered
  private _borderActiveGradient: GradientParameters = BORDER_GRADIENT_PARAMETERS.toggled
  private _borderDisabledGradient: GradientParameters = BORDER_GRADIENT_PARAMETERS.default

  private _borderColorChangeCancelSet: CancelSet = new CancelSet()
  private _hasBorder: boolean = false

  private _roundedRectangleVisualStates: Map<StateName, RoundedRectangleVisualState>
  protected _state: RoundedRectangleVisualState

  protected get visualStates(): Map<StateName, RoundedRectangleVisualState> {
    return this._roundedRectangleVisualStates
  }

  /**
   * Gets the `RenderMeshVisual` associated with the rounded rectangle.
   *
   * @returns {RenderMeshVisual} The visual representation of the rounded rectangle's mesh.
   */
  public get renderMeshVisual(): RenderMeshVisual {
    return this._roundedRectangle.renderMeshVisual
  }

  /**
   * Retrieves the base color of the rounded rectangle visual.
   *
   * @returns {vec4} The background color of the rounded rectangle as a `vec4` value.
   */
  public get baseColor(): vec4 {
    return this._roundedRectangle.backgroundColor
  }

  /**
   * Indicates whether the rounded rectangle visual has a border.
   *
   * @returns `true` if the visual has a border; otherwise, `false`.
   */
  public get hasBorder(): boolean {
    return this._hasBorder
  }

  /**
   * Sets whether the rounded rectangle has a border.
   * When a border is enabled, the `autoHighlight` property is automatically disabled.
   *
   * @param hasBorder - A boolean indicating whether the rounded rectangle should have a border.
   */
  public set hasBorder(hasBorder: boolean) {
    this._hasBorder = hasBorder
    this._roundedRectangle.border = hasBorder
    if (hasBorder === true) this.autoHighlight = false
  }

  /**
   * Gets the size of the border for the rounded rectangle.
   *
   * @returns The border size as a number.
   */
  public get borderSize(): number {
    return this._roundedRectangle.borderSize
  }

  /**
   * Sets the border size of the rounded rectangle.
   *
   * @param borderSize - The thickness of the border in centimeters.
   */
  public set borderSize(borderSize: number) {
    this._roundedRectangle.borderSize = borderSize
  }

  /**
   * Updates the visual state of the RoundedRectangleVisual component.
   *
   * This method overrides the base `setState` method to apply visual updates
   * specific to the RoundedRectangleVisual, such as gradients and border colors.
   *
   * @param stateName - The new state to apply, represented as a `stateName` object.
   */
  setState(stateName: StateName) {
    super.setState(stateName)
    this.updateGradient(this._state.baseGradient)
    this.updateBorderColors(this._state.borderColor)
    this.updateBorderGradient(this._state.borderGradient)
  }

  /**
   * Constructs a new instance of the `RoundedRectangleVisual` class.
   *
   * @param sceneObject - The parent `SceneObject` to which this visual will be attached.
   */
  constructor(sceneObject: SceneObject) {
    super(sceneObject)
    this._sceneObject = global.scene.createSceneObject("RoundedRectangle")
    this._roundedRectangle = this._sceneObject.createComponent(RoundedRectangle.getTypeName())
    this._roundedRectangle.initialize()

    this._roundedRectangle.createEvent("OnDestroyEvent").bind(() => {
      this._sceneObject = null
      this._roundedRectangle = null
      this.destroy()
    })
    this._transform = this._sceneObject.getTransform()
    this._sceneObject.setParent(sceneObject)
    this.initialize()
  }

  destroy(): void {
    this._borderColorChangeCancelSet.cancel()
    super.destroy()
  }

  protected set baseColor(value: vec4) {
    this._roundedRectangle.backgroundColor = value
  }

  protected get visualSize(): vec3 {
    return new vec3(this._roundedRectangle.size.x, this._roundedRectangle.size.y, 1)
  }

  protected set visualSize(value: vec3) {
    this._roundedRectangle.size = new vec2(value.x, value.y)
  }

  protected updateColors(meshColor: vec4) {
    if (this._roundedRectangle.gradient) {
      return
    }
    super.updateColors(meshColor)
  }

  protected updateHighlight(highlight: boolean, highlightColor: vec4): void {
    const hasHighlight = this.autoHighlight && highlight
    this._roundedRectangle.border = hasHighlight || this._hasBorder
    if (!this._hasBorder) {
      this._roundedRectangle.renderMeshVisual.mainMaterial.mainPass.size = (
        hasHighlight
          ? new vec2(
              this._roundedRectangle.size.x + this._roundedRectangle.borderSize * 2,
              this._roundedRectangle.size.y + this._roundedRectangle.borderSize * 2
            )
          : this._roundedRectangle.size
      ).sub(vec2.one().uniformScale(2))
      if (hasHighlight) {
        this._roundedRectangle.borderColor = highlightColor
      }
    }
  }

  /****  Rounded Rectangle explicit  ******************/

  /**
   * Gets the corner radius of the rounded rectangle.
   *
   * @returns The current corner radius of the rounded rectangle in pixels.
   */
  get cornerRadius(): number {
    return this._roundedRectangle.cornerRadius
  }

  /**
   * Sets the corner radius of the rounded rectangle.
   *
   * @param cornerRadius - The radius of the corners in pixels.
   */
  set cornerRadius(cornerRadius: number) {
    this._roundedRectangle.cornerRadius = cornerRadius
  }

  public get isBaseGradient(): boolean {
    return this._roundedRectangle.gradient
  }

  /**
   * Sets whether the rounded rectangle uses a gradient for its base(background).
   *
   * @param gradient - A boolean indicating whether to use a gradient (`true`) or a solid color (`false`).
   */
  public set isBaseGradient(gradient: boolean) {
    this._roundedRectangle.gradient = gradient
    this._roundedRectangle.useTexture = false
  }

  /**
   * Gets the default gradient parameters for the visual.
   *
   * @returns The default gradient parameters.
   */
  public get defaultGradient(): GradientParameters {
    return this._defaultGradient
  }

  /**
   * Sets the default gradient parameters for the visual and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set as the default.
   */
  public set defaultGradient(gradient: GradientParameters) {
    this._defaultGradient = gradient
    if (!this.shouldColorChange && this.isBaseGradient) {
      this._roundedRectangle.setBackgroundGradient(gradient)
    }
    this.updateVisualStates()
  }

  /**
   * Gets the hover gradient parameters for the visual.
   *
   * @returns The hover gradient parameters.
   */
  public get hoverGradient(): GradientParameters {
    return this._hoverGradient
  }

  /**
   * Sets the hover gradient parameters for the visual and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the hover state.
   */
  public set hoverGradient(gradient: GradientParameters) {
    this._hoverGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Gets the toggled hover gradient parameters for the visual.
   *
   * @returns The toggled hover gradient parameters.
   */
  public get toggledHoverGradient(): GradientParameters {
    return this._toggledHoverGradient
  }

  /**
   * Sets the toggled hover gradient parameters for the visual and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the toggled hover state.
   */
  public set toggledHoverGradient(gradient: GradientParameters) {
    this._toggledHoverGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Gets the toggled default gradient parameters for the visual.
   *
   * @returns The toggled default gradient parameters.
   */
  public get toggledDefaultGradient(): GradientParameters {
    return this._toggledDefaultGradient
  }

  /**
   * Sets the toggled default gradient parameters for the visual and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the toggled default state.
   */
  public set toggledDefaultGradient(gradient: GradientParameters) {
    this._toggledDefaultGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Gets the active gradient parameters for the visual.
   *
   * @returns The active gradient parameters.
   */
  public get activeGradient(): GradientParameters {
    return this._activeGradient
  }

  /**
   * Sets the active gradient parameters for the visual and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the active state.
   */
  public set activeGradient(gradient: GradientParameters) {
    this._activeGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Gets the disabled gradient parameters for the visual.
   *
   * @returns The disabled gradient parameters.
   */
  public get disabledGradient(): GradientParameters {
    return this._disabledGradient
  }

  /**
   * Sets the disabled gradient parameters for the visual and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the disabled state.
   */
  public set disabledGradient(gradient: GradientParameters) {
    this._disabledGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Sets the gradient start and end positions for the base of the rounded rectangle.
   *
   * @param gradientStartPosition - A 2D vector representing the starting position of the gradient.
   * @param gradientEndPosition - A 2D vector representing the ending position of the gradient.
   */
  public setBaseGradientPositions(gradientStartPosition: vec2, gradientEndPosition: vec2) {
    this._roundedRectangle.gradientStartPosition = gradientStartPosition
    this._roundedRectangle.gradientEndPosition = gradientEndPosition
  }

  /**
   * Gets the type of border for the rounded rectangle.
   *
   * @returns The type of border, which can be either "Color" or "Gradient".
   */
  public get isBorderGradient(): boolean {
    return this._roundedRectangle.borderType === "Gradient"
  }

  /**
   * Sets whether the rounded rectangle uses a gradient for its border.
   *
   * @param gradient - A boolean indicating whether to use a gradient (`true`) or a solid color (`false`) for the border.
   */
  public set isBorderGradient(gradient: boolean) {
    this._roundedRectangle.borderType = gradient ? "Gradient" : "Color"
  }

  /**
   * Gets the default color for the border of the rounded rectangle.
   *
   * @returns The default border color as a `vec4` value.
   */
  public get borderDefaultColor(): vec4 {
    return this._borderDefaultColor
  }

  /**
   * Sets the default color for the border of the rounded rectangle and initializes the visual states.
   *
   * @param color - The default color to be set for the border.
   */
  public set borderDefaultColor(color: vec4) {
    this._borderDefaultColor = color
    this.updateVisualStates()
  }

  /**
   * Gets the hover color for the border of the rounded rectangle.
   *
   * @returns The hover border color as a `vec4` value.
   */
  public get borderHoverColor(): vec4 {
    return this._borderHoverColor
  }

  /**
   * Sets the hover color for the border of the rounded rectangle and initializes the visual states.
   *
   * @param color - The hover color to be set for the border.
   */
  public set borderHoverColor(color: vec4) {
    this._borderHoverColor = color
    this.updateVisualStates()
  }

  /**
   * Gets the active color for the border of the rounded rectangle.
   *
   * @returns The active border color as a `vec4` value.
   */
  public get borderActiveColor(): vec4 {
    return this._borderActiveColor
  }

  /**
   * Sets the active color for the border of the rounded rectangle and initializes the visual states.
   *
   * @param color - The active color to be set for the border.
   */
  public set borderActiveColor(color: vec4) {
    this._borderActiveColor = color
    this.updateVisualStates()
  }

  /**
   * Gets the disabled color for the border of the rounded rectangle.
   *
   * @returns The disabled border color as a `vec4` value.
   */
  public get borderDisabledColor(): vec4 {
    return this._borderDisabledColor
  }

  /**
   * Sets the disabled color for the border of the rounded rectangle and initializes the visual states.
   *
   * @param color - The disabled color to be set for the border.
   */
  public set borderDisabledColor(color: vec4) {
    this._borderDisabledColor = color
    this.updateVisualStates()
  }

  /**
   * Gets the default gradient parameters for the border of the rounded rectangle.
   *
   * @returns The default border gradient parameters.
   */
  public get borderDefaultGradient(): GradientParameters {
    return this._borderDefaultGradient
  }

  /**
   * Sets the gradient parameters for the default state of the border and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the default state of the border.
   */
  public set borderDefaultGradient(gradient: GradientParameters) {
    this._borderDefaultGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Gets the gradient parameters for the hover state of the border.
   *
   * @returns The hover border gradient parameters.
   */
  public get borderHoverGradient(): GradientParameters {
    return this._borderHoverGradient
  }

  /**
   * Sets the gradient parameters for the hover state of the border and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the hover state of the border.
   */
  public set borderHoverGradient(gradient: GradientParameters) {
    this._borderHoverGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Gets the gradient parameters for the active state of the border.
   *
   * @returns The active border gradient parameters.
   */
  public get borderActiveGradient(): GradientParameters {
    return this._borderActiveGradient
  }

  /**
   * Sets the gradient parameters for the active state of the border and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the active state of the border.
   */
  public set borderActiveGradient(gradient: GradientParameters) {
    this._borderActiveGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Gets the gradient parameters for the disabled state of the border.
   *
   * @returns The disabled border gradient parameters.
   */
  public get borderDisabledGradient(): GradientParameters {
    return this._borderDisabledGradient
  }

  /**
   * Sets the gradient parameters for the disabled state of the border and initializes the visual states.
   *
   * @param gradient - The gradient parameters to be set for the disabled state of the border.
   */
  public set borderDisabledGradient(gradient: GradientParameters) {
    this._borderDisabledGradient = gradient
    this.updateVisualStates()
  }

  /**
   * Sets the start and end positions for the border gradient of the rounded rectangle.
   *
   * @param gradientStartPosition - A 2D vector representing the starting position of the border gradient.
   * @param gradientEndPosition - A 2D vector representing the ending position of the border gradient.
   */
  public setBorderGradientPositions(gradientStartPosition: vec2, gradientEndPosition: vec2): void {
    this._roundedRectangle.borderGradientStartPosition = gradientStartPosition
    this._roundedRectangle.borderGradientEndPosition = gradientEndPosition
  }

  protected updateGradient(gradient: GradientParameters) {
    if (!this.shouldColorChange || !this.isBaseGradient) {
      return
    }
    this._roundedRectangle.setBackgroundGradient(gradient)
  }

  protected updateBorderColors(borderColor: vec4) {
    if (!this.shouldColorChange || !this.hasBorder || this.isBorderGradient) {
      return
    }
    this._borderColorChangeCancelSet.cancel()
    const from = this._roundedRectangle.borderColor
    animate({
      duration: this.animateDuration,
      cancelSet: this._borderColorChangeCancelSet,
      update: (t) => {
        this._roundedRectangle.borderColor = vec4.lerp(from, borderColor, t)
      }
    })
  }

  protected updateBorderGradient(gradient: GradientParameters) {
    if (!this.hasBorder || !this.isBorderGradient) {
      return
    }
    this._roundedRectangle.setBorderGradient(gradient)
  }

  protected updateVisualStates(): void {
    this._roundedRectangleVisualStates = new Map([
      [
        StateName.default,
        {
          baseColor: this.baseDefaultColor,
          baseGradient: this.defaultGradient,
          borderColor: this.borderDefaultColor,
          borderGradient: this.borderDefaultGradient,
          highlight: false,
          localScale: this.defaultScale,
          localPosition: this.defaultPosition
        }
      ],
      [
        StateName.hover,
        {
          baseColor: this.baseHoverColor,
          baseGradient: this.hoverGradient,
          borderColor: this.borderHoverColor,
          borderGradient: this.borderHoverGradient,
          highlightColor: this.highlightHoverColor,
          highlight: true,
          localScale: this.hoverScale,
          localPosition: this.hoverPosition
        }
      ],
      [
        StateName.active,
        {
          baseColor: this.baseActiveColor,
          baseGradient: this.activeGradient,
          borderColor: this.borderActiveColor,
          borderGradient: this.borderActiveGradient,
          highlightColor: this.highlightFocusColor,
          highlight: true,
          localScale: this.activeScale,
          localPosition: this.activePosition
        }
      ],
      [
        StateName.toggledHovered,
        {
          baseColor: this.baseToggledHoverColor,
          baseGradient: this.toggledHoverGradient,
          borderColor: this.borderActiveColor,
          borderGradient: this.borderActiveGradient,
          highlight: true,
          highlightColor: this.highlightHoverColor,
          localScale: this.toggledHoverScale,
          localPosition: this.toggledPosition
        }
      ],
      [
        StateName.toggledDefault,
        {
          baseColor: this.baseActiveColor,
          baseGradient: this.toggledDefaultGradient,
          borderColor: this.borderActiveColor,
          borderGradient: this.borderActiveGradient,
          highlight: false,
          localScale: this.toggledScale,
          localPosition: this.toggledPosition
        }
      ],
      [
        StateName.error,
        {
          baseColor: this.baseErrorColor,
          baseGradient: this.defaultGradient,
          borderColor: this.baseErrorColor,
          borderGradient: this.borderDefaultGradient,
          highlight: false,
          localScale: this.errorScale,
          localPosition: this.errorPosition
        }
      ],
      [
        StateName.errorHover,
        {
          baseColor: this.baseErrorColor,
          baseGradient: this.hoverGradient,
          borderColor: this.baseErrorColor,
          borderGradient: this.borderHoverGradient,
          highlightColor: this.highlightHoverColor,
          highlight: true,
          localScale: this.hoverScale,
          localPosition: this.errorPosition
        }
      ],
      [
        StateName.disabled,
        {
          baseColor: this.baseDisabledColor,
          baseGradient: this.disabledGradient,
          borderColor: this.borderDisabledColor,
          borderGradient: this.borderDisabledGradient,
          highlight: false,
          localScale: this.disabledScale,
          localPosition: this.disabledPosition
        }
      ]
    ])
    super.updateVisualStates()
  }
}
