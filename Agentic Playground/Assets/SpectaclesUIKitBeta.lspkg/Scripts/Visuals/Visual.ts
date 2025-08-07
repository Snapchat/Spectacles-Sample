import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {HSLToRGB, withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {StateName} from "../Components/Element"
import {CapsuleSphereCollider} from "../Utility/CapsuleSphereCollider"

export const COLORS: {[key: string]: vec4} = {
  gray: withAlpha(HSLToRGB(new vec3(0, 0, 0.4)), 1),
  darkGray: withAlpha(HSLToRGB(new vec3(0, 0, 0.24)), 1),
  lightGray: withAlpha(HSLToRGB(new vec3(0, 0, 0.56)), 1),
  lightBlue: withAlpha(HSLToRGB(new vec3(210, 0.7, 0.35)), 1),
  brightYellow: withAlpha(HSLToRGB(new vec3(47.7, 0.8, 0.55)), 1),
  brighterYellow: withAlpha(HSLToRGB(new vec3(41.7, 0.847, 0.9253)), 1)
}

// mesh
export const ERROR_COLOR = new vec4(0.8, 0.2, 0.2, 1)
export const DISABLED_COLOR = new vec4(0.2, 0.2, 0.2, 0.2)

// highlight
const HIGHLIGHT_HOVER_COLOR = new vec4(1, 0.81, 0.32, 0.66)
const HIGHLIGHT_FOCUS_COLOR = new vec4(1, 1, 1, 0.66)

const DEFAULT_FADE_DURATION: number = 0.2

export type VisualState = {
  baseColor?: vec4
  highlightColor?: vec4
  highlight?: boolean
  localScale: vec3
  localPosition: vec3
}

type ScaleChangeArgs = {
  from: vec3
  current: vec3
}

/**
 * The `Visual` abstract class serves as a base class for creating visual components
 * with customizable states, animations, and interactions. It provides a framework
 * for managing visual properties such as color, scale, position, and highlight states.
 *
 * @abstract
 */
export abstract class Visual {
  protected _sceneObject: SceneObject
  protected _transform: Transform

  private _collider?: CapsuleSphereCollider

  private _size: vec3 = new vec3(1, 1, 1)

  protected _initialPosition: vec3

  private _defaultPosition: vec3 = vec3.zero()
  private _hoverPosition: vec3 = vec3.zero()
  private _activePosition: vec3 = vec3.back()
  private _toggledPosition: vec3 = vec3.back()
  private _disabledPosition: vec3 = vec3.zero()
  private _errorPosition: vec3 = vec3.zero()

  private _defaultScale: vec3 = vec3.one()
  private _hoverScale: vec3 = vec3.one()
  private _activeScale: vec3 = new vec3(0.9, 0.9, 0.9)
  private _toggledScale: vec3 = new vec3(1.05, 1.05, 1.05)
  private _toggledHoverScale: vec3 = new vec3(1.05, 1.05, 1.05)
  private _disabledScale: vec3 = vec3.one()
  private _errorScale: vec3 = vec3.one()

  protected _defaultColor: vec4 = COLORS.darkGray
  protected _hoverColor: vec4 = COLORS.lightGray
  protected _activeColor: vec4 = COLORS.lightGray.uniformScale(0.3)
  protected _toggledDefaultColor: vec4 = COLORS.lightGray.uniformScale(0.3)
  protected _toggledHoverColor: vec4 = COLORS.lightGray.uniformScale(0.3)
  protected _disabledColor: vec4 = DISABLED_COLOR
  protected _errorColor: vec4 = ERROR_COLOR

  private _highlightHoverColor: vec4 = HIGHLIGHT_HOVER_COLOR
  private _highlightFocusColor: vec4 = HIGHLIGHT_FOCUS_COLOR

  private _shouldColorChange: boolean = true
  private _shouldScale: boolean = false
  private _shouldTranslate: boolean = false
  private _autoHighlight: boolean = false

  protected _state: VisualState
  private stateName: StateName = StateName.default

  // Amount of time it takes to animate 1 unit of distance
  private _animateDuration: number = DEFAULT_FADE_DURATION

  private _colorChangeCancelSet: CancelSet = new CancelSet()
  private _updateScaleCancelSet: CancelSet = new CancelSet()
  private _updatePositionCancelSet: CancelSet = new CancelSet()

  private onInitializedEvent: Event<void> = new Event<void>()
  readonly onInitialized = this.onInitializedEvent.publicApi()
  private onDestroyedEvent: Event<void> = new Event<void>()
  readonly onDestroyed = this.onDestroyedEvent.publicApi()

  private onScaleChangedEvent: Event<ScaleChangeArgs> = new Event<ScaleChangeArgs>()
  readonly onScaleChanged = this.onScaleChangedEvent.publicApi()
  private onPositionChangedEvent: Event<ScaleChangeArgs> = new Event<ScaleChangeArgs>()
  readonly onPositionChanged = this.onPositionChangedEvent.publicApi()

  abstract get renderMeshVisual(): RenderMeshVisual
  abstract get hasBorder(): boolean
  abstract get borderSize(): number
  abstract get baseColor(): vec4
  protected abstract set baseColor(value: vec4)
  protected abstract get visualSize(): vec3
  protected abstract set visualSize(value: vec3)
  protected abstract updateHighlight(highlight: boolean, highlightColor: vec4): void
  protected abstract get visualStates(): Map<StateName, VisualState>

  /**
   * Gets the associated `SceneObject` instance.
   *
   * @returns {SceneObject} The `SceneObject` associated with this visual.
   */
  get sceneObject(): SceneObject {
    return this._sceneObject
  }

  /**
   * Gets the transform associated with this visual.
   *
   * @returns {Transform} The current transform of the visual.
   */
  get transform(): Transform {
    return this._transform
  }

  /**
   * Gets the collider associated with this visual.
   *
   * @returns {CapsuleSphereCollider} The current collider of the visual.
   */
  get collider(): CapsuleSphereCollider {
    return this._collider
  }

  /**
   * Binds the collider for the visual element.
   *
   * @param collider - An instance of `CapsuleSphereCollider` representing the collider to be assigned.
   */
  set collider(collider: CapsuleSphereCollider) {
    this._collider = collider
  }

  /**
   * Gets the size of the visual element.
   *
   * @returns A `vec3` representing the dimensions of the visual element.
   */
  public get size(): vec3 {
    return this._size
  }

  /**
   * Sets the size of the visual element.
   * Updates both the internal `_size` property and the `visualSize` property.
   *
   * @param size - A `vec3` object representing the dimensions of the visual element.
   */
  public set size(size: vec3) {
    this._size = size
    this.visualSize = size
  }

  /**
   * Determines whether the color should change when transition to a new state.
   *
   * @returns {boolean} A boolean value indicating if the color change is enabled.
   */
  public get shouldColorChange(): boolean {
    return this._shouldColorChange
  }

  /**
   * Sets whether to enable the color changing behavior for the visual.
   *
   * @param shouldColorChange - A boolean indicating whether the color change is enabled (`true`) or disabled (`false`).
   */
  public set shouldColorChange(shouldColorChange: boolean) {
    this._shouldColorChange = shouldColorChange
    if (!this._shouldColorChange) {
      this._colorChangeCancelSet.cancel()
    }
  }

  /**
   * Gets the default base color for the visual element.
   *
   * @returns A `vec4` representing the current base default color.
   */
  public get baseDefaultColor(): vec4 {
    return this._defaultColor
  }

  /**
   * Sets the default base color for the visual element.
   *
   * @param baseDefaultColor - A `vec4` representing the RGBA color to be used as the default.
   */
  public set baseDefaultColor(baseDefaultColor: vec4) {
    this._defaultColor = baseDefaultColor
    if (!this._shouldColorChange) {
      this.baseColor = baseDefaultColor
    }
    this.updateVisualStates()
  }

  /**
   * Gets the hover color for the visual element.
   *
   * @returns A `vec4` representing the current hover color.
   */
  public get baseHoverColor(): vec4 {
    return this._hoverColor
  }

  /**
   * Gets the default base color for the visual element.
   *
   * @returns A `vec4` representing the current base default color.
   */
  public set baseHoverColor(baseHoverColor: vec4) {
    this._hoverColor = baseHoverColor
    this.updateVisualStates()
  }

  /**
   * Gets the active color for the visual element.
   *
   * @returns A `vec4` representing the current active color.
   */
  public get baseActiveColor(): vec4 {
    return this._activeColor
  }

  /**
   * Gets the active color for the visual element.
   *
   * @returns A `vec4` representing the current active color.
   */
  public set baseActiveColor(baseActiveColor: vec4) {
    this._activeColor = baseActiveColor
    this.updateVisualStates()
  }

  /**
   * Gets the toggled default color for the visual element.
   *
   * @returns A `vec4` representing the current toggled default color.
   */
  public get baseToggledDefaultColor(): vec4 {
    return this._toggledDefaultColor
  }

  /**
   * Sets the toggled default color for the visual element.
   *
   * @param baseToggledDefaultColor - A `vec4` representing the RGBA color to be used as the toggled default color.
   */
  public set baseToggledDefaultColor(baseToggledDefaultColor: vec4) {
    this._toggledDefaultColor = baseToggledDefaultColor
    this.updateVisualStates()
  }

  /**
   * Gets the toggled hover color for the visual element.
   *
   * @returns A `vec4` representing the current toggled hover color.
   */
  public get baseToggledHoverColor(): vec4 {
    return this._toggledHoverColor
  }

  /**
   * Sets the toggled hover color for the visual element.
   *
   * @param baseToggledHoverColor - A `vec4` representing the RGBA color to be used as the toggled hover color.
   */
  public set baseToggledHoverColor(baseToggledHoverColor: vec4) {
    this._toggledHoverColor = baseToggledHoverColor
    this.updateVisualStates()
  }

  /**
   * Gets the disabled color for the visual element.
   *
   * @returns A `vec4` representing the current disabled color.
   */
  public get baseDisabledColor(): vec4 {
    return this._disabledColor
  }

  /**
   * Sets the disabled color for the visual element.
   *
   * @param baseActiveColor - A `vec4` representing the RGBA color to be used as the disabled color.
   */
  public set baseDisabledColor(baseDisabledColor: vec4) {
    this._disabledColor = baseDisabledColor
    this.updateVisualStates()
  }

  /**
   * Gets the error color for the visual element.
   *
   * @returns A `vec4` representing the current error color.
   */
  public get baseErrorColor(): vec4 {
    return this._errorColor
  }

  /**
   * Sets the error color for the visual element.
   *
   * @param baseErrorColor - A `vec4` representing the RGBA color to be used as the error color.
   */
  public set baseErrorColor(baseErrorColor: vec4) {
    this._errorColor = baseErrorColor
    this.updateVisualStates()
  }

  /**
   * Determines whether the visual element should scale when transitioning to a new state
   *
   * @returns {boolean} `true` if the visual element should scale, otherwise `false`.
   */
  public get shouldScale(): boolean {
    return this._shouldScale
  }

  /**
   * Sets whether to enable the scaling behavior of the visual.
   *
   * @param shouldScale - A boolean value indicating whether scaling is enabled.
   */
  public set shouldScale(shouldScale: boolean) {
    this._shouldScale = shouldScale
    if (!this._shouldScale) {
      this._updateScaleCancelSet.cancel()
    }
  }

  /**
   * Gets the default scale of the visual element.
   *
   * @returns A `vec3` representing the current default scale.
   */
  public get defaultScale(): vec3 {
    return this._defaultScale
  }

  /**
   * Sets the default scale of the visual and initializes its visual states.
   *
   * @param scale - A `vec3` object representing the default scale to be applied.
   */
  public set defaultScale(scale: vec3) {
    this._defaultScale = scale
    this.updateVisualStates()
  }

  /**
   * Gets the hover scale of the visual element.
   *
   * @returns A `vec3` representing the current hover scale.
   */
  public get hoverScale(): vec3 {
    return this._hoverScale
  }

  /**
   * Sets the hover scale for the visual element and initializes its visual states.
   *
   * @param scale - A `vec3` object representing the hover scale to be applied.
   */
  public set hoverScale(scale: vec3) {
    this._hoverScale = scale
    this.updateVisualStates()
  }

  /**
   * Gets the active scale of the visual element.
   *
   * @returns A `vec3` representing the current active scale.
   */
  public get activeScale(): vec3 {
    return this._activeScale
  }

  /**
   * Sets the active scale of the visual and initializes its visual states.
   *
   * @param scale - A `vec3` representing the scale to be applied to the visual.
   */
  public set activeScale(scale: vec3) {
    this._activeScale = scale
    this.updateVisualStates()
  }

  /**
   * Gets the toggled scale of the visual element.
   *
   * @returns A `vec3` representing the current toggled scale.
   */
  public get toggledScale(): vec3 {
    return this._toggledScale
  }

  /**
   * Sets the scale to be applied when the visual is toggled and initializes its visual states.
   *
   * @param scale - A `vec3` representing the new scale to apply when toggled.
   */
  public set toggledScale(scale: vec3) {
    this._toggledScale = scale
    this.updateVisualStates()
  }

  /**
   * Gets the toggled hover scale of the visual element.
   *
   * @returns A `vec3` representing the current toggled hover scale.
   */
  public get toggledHoverScale(): vec3 {
    return this._toggledHoverScale
  }

  /**
   * Sets the scale to be applied when the visual is toggled and hovered over.
   *
   * @param scale - A `vec3` representing the new scale to apply when toggled and hovered.
   */
  public set toggledHoverScale(scale: vec3) {
    this._toggledHoverScale = scale
    this.updateVisualStates()
  }

  /**
   * Gets the scale applied when the visual is in a disabled state.
   *
   * @returns A `vec3` representing the current disabled scale.
   */
  public get disabledScale(): vec3 {
    return this._disabledScale
  }

  /**
   * Sets the scale to be applied when the visual is in a disabled state and initializes its visual states.
   *
   * @param scale - A `vec3` object representing the scale to apply in the disabled state.
   */
  public set disabledScale(scale: vec3) {
    this._disabledScale = scale
    this.updateVisualStates()
  }

  /**
   * Gets the scale applied when the visual is in an error state.
   *
   * @returns A `vec3` representing the current error scale.
   */
  public get errorScale(): vec3 {
    return this._errorScale
  }

  /**
   * Sets the scale for the error visualization and initializes its visual states.
   *
   * @param scale - A `vec3` object representing the scale to be applied to the error visualization.
   */
  public set errorScale(scale: vec3) {
    this._errorScale = scale
    this.updateVisualStates()
  }

  /**
   * Indicates whether the visual element should be translated when transitioning to a new state.
   *
   * @returns {boolean} `true` if the visual element should be translated; otherwise, `false`.
   */
  public get shouldTranslate(): boolean {
    return this._shouldTranslate
  }

  /**
   * Sets whether to enable the translating behaviors.
   *
   * @param shouldTranslate - A boolean value indicating whether the translation behavior is enabled.
   */
  public set shouldTranslate(shouldTranslate: boolean) {
    this._shouldTranslate = shouldTranslate
    if (!this._shouldTranslate) {
      this._updatePositionCancelSet.cancel()
    }
  }

  /**
   * Gets the default position of the visual element.
   *
   * @returns A `vec3` representing the current default position.
   */
  public get defaultPosition(): vec3 {
    return this._defaultPosition
  }

  /**
   * Sets the default position of the visual element.
   *
   * @param position - A `vec3` object representing the new default position.
   */
  public set defaultPosition(position: vec3) {
    this._defaultPosition = position
    this.updateVisualStates()
    if (!this.shouldTranslate) {
      this._transform.setLocalPosition(position)
    }
  }

  /**
   * Gets the hover position of the visual element.
   *
   * @returns A `vec3` representing the current hover position.
   */
  public get hoverPosition(): vec3 {
    return this._hoverPosition
  }

  /**
   * Gets the hover position of the visual element.
   *
   * @returns A `vec3` representing the new hover position.
   */
  public set hoverPosition(position: vec3) {
    this._hoverPosition = position
    this.updateVisualStates()
  }

  /**
   * Gets the active position of the visual element.
   *
   * @returns A `vec3` representing the current active position.
   */
  public get activePosition(): vec3 {
    return this._activePosition
  }

  /**
   * Sets the active position of the visual element.
   *
   * @param position - A `vec3` object representing the new active position.
   */
  public set activePosition(position: vec3) {
    this._activePosition = position
    this.updateVisualStates()
  }

  /**
   * Gets the toggled position of the visual element.
   *
   * @returns A `vec3` representing the current toggled position.
   */
  public get toggledPosition(): vec3 {
    return this._toggledPosition
  }

  /**
   * Sets the toggled position of the visual element.
   *
   * @param position - A `vec3` object representing the new toggled position.
   */
  public set toggledPosition(position: vec3) {
    this._toggledPosition = position
    this.updateVisualStates()
  }

  /**
   * Gets the position of the visual element when it is in a disabled state.
   *
   * @returns A `vec3` representing the current disabled position.
   */
  public get disabledPosition(): vec3 {
    return this._disabledPosition
  }

  /**
   * Sets the position of the visual element when it is in a disabled state.
   *
   * @param position - A `vec3` object representing the new position for the disabled state.
   */
  public set disabledPosition(position: vec3) {
    this._disabledPosition = position
    this.updateVisualStates()
  }

  /**
   * Gets the position of the visual element when it is in an error state.
   *
   * @returns A `vec3` representing the current error position.
   */
  public get errorPosition(): vec3 {
    return this._errorPosition
  }

  /**
   * Sets the position of the visual element when it is in an error state.
   *
   * @param position - A `vec3` object representing the new position for the error state.
   */
  public set errorPosition(position: vec3) {
    this._errorPosition = position
    this.updateVisualStates()
  }

  /**
   * Gets the current state of the auto-highlight behavior.
   *
   * @returns {boolean} A boolean value indicating whether auto-highlight is enabled.
   */
  public get autoHighlight(): boolean {
    return this._autoHighlight
  }

  /**
   * Sets the auto-highlight behavior for the visual component.
   *
   * @param autoHighlight - A boolean value indicating whether the visual component
   *                        should automatically highlight itself.
   */
  public set autoHighlight(autoHighlight: boolean) {
    this._autoHighlight = autoHighlight
  }

  /**
   * Gets the hover highlight color for the visual element.
   *
   * @returns A `vec4` representing the current hover highlight color.
   */
  public get highlightHoverColor(): vec4 {
    return this._highlightHoverColor
  }

  /**
   * Sets the hover highlight color for the visual element.
   *
   * @param highlightHoverColor - A `vec4` representing the RGBA color to be used
   *                              when the visual element is hovered over.
   */
  public set highlightHoverColor(highlightHoverColor: vec4) {
    this._highlightHoverColor = highlightHoverColor
    this.updateVisualStates()
  }

  /**
   * Gets the focus highlight color for the visual element.
   *
   * @returns A `vec4` representing the current focus highlight color.
   */
  public get highlightFocusColor(): vec4 {
    return this._highlightFocusColor
  }

  /**
   * Sets the color used to highlight the focus state of the visual.
   *
   * @param highlightFocusColor - A `vec4` representing the RGBA color to be used for the focus highlight.
   */
  public set highlightFocusColor(highlightFocusColor: vec4) {
    this._highlightFocusColor = highlightFocusColor
    this.updateVisualStates()
  }

  /**
   * Gets the duration of the animation.
   *
   * @returns The duration of the animation in milliseconds.
   */
  public get animateDuration(): number {
    return this._animateDuration
  }

  /**
   * Sets the duration of the animation.
   *
   * @param animateDuration - The duration of the animation in milliseconds.
   */
  public set animateDuration(animateDuration: number) {
    this._animateDuration = animateDuration
  }

  /**
   * Initializes the visual component by setting up its initial scale and position,
   * and preparing its visual states. This method is typically called during the
   * setup phase to ensure the visual component is ready for use.
   */
  initialize() {
    this._initialPosition = this._transform.getLocalPosition()
    this.updateVisualStates()

    this.onInitializedEvent.invoke()
  }

  /**
   * Updates the visual state of the object based on the provided state type.
   *
   * @param stateName - The type of state to set, which determines the visual properties
   * such as color, scale, position, and highlight.
   */
  setState(stateName: StateName) {
    this.stateName = stateName
    this._state = this.visualStates.get(stateName)
    this.updateColors(this._state.baseColor)
    this.updateScale(this._state.localScale)
    this.updatePosition(this._state.localPosition)
    this.updateHighlight(this._state.highlight, this._state.highlightColor)
  }

  /**
   * Creates an instance of the Visual class.
   *
   * @param sceneObject - The parent SceneObject associated with this visual.
   */
  constructor(sceneObject: SceneObject) {} // eslint-disable-line

  /**
   * Destroys the current instance.
   *
   */
  destroy() {
    this._colorChangeCancelSet.cancel()
    this._updateScaleCancelSet.cancel()
    this._updatePositionCancelSet.cancel()
    this._sceneObject?.destroy()
    this.onDestroyedEvent.invoke()
  }

  protected updateColors(meshColor: vec4) {
    if (!this._shouldColorChange) {
      return
    }
    this._colorChangeCancelSet.cancel()
    const from = this.baseColor
    animate({
      duration: this._animateDuration,
      cancelSet: this._colorChangeCancelSet,
      update: (t) => {
        this.baseColor = vec4.lerp(from, meshColor, t)
      }
    })
  }

  private updateScale(scale: vec3) {
    if (!this._shouldScale) {
      return
    }
    const from = this.visualSize
    const to = new vec3(scale.x * this._size.x, scale.y * this._size.y, scale.z * this._size.z)
    const fromScale = new vec3(from.x / this.size.x, from.y / this.size.y, from.z / this.size.z)
    const difference = to.distance(from)
    const duration = difference * this._animateDuration
    this._updateScaleCancelSet.cancel()
    animate({
      duration: duration,
      cancelSet: this._updateScaleCancelSet,
      update: (t) => {
        const size = vec3.lerp(from, to, t)
        this.visualSize = size
        // off by two on x if stretchable capsule
        this._collider?.setSize(size)
        this.onScaleChangedEvent.invoke({from: fromScale, current: vec3.lerp(fromScale, scale, t)})
      }
    })
  }

  private updatePosition(pos: vec3) {
    if (!this._shouldTranslate) {
      return
    }
    const from = this._transform.getLocalPosition()
    // if both zero, return early
    if (pos.equal(from) && pos.equal(vec3.zero())) return
    const difference = pos.distance(from)
    const divider = pos.equal(vec3.zero()) ? from : pos
    const duration = (difference * this._animateDuration) / (divider.length + 0.0001) // add epsilon to guarantee nonzero division
    this._updatePositionCancelSet.cancel()
    animate({
      duration: duration,
      cancelSet: this._updatePositionCancelSet,
      update: (t) => {
        const position = vec3.lerp(from, pos, t)
        this._transform.setLocalPosition(position)
        this.onPositionChangedEvent.invoke({from: from, current: position})
      }
    })
  }

  protected updateVisualStates(): void {
    this.setState(this.stateName)
  }
}
