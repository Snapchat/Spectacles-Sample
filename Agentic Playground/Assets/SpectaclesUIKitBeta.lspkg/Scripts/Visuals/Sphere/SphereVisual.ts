import {StateName} from "../../Components/Element"
import {Visual, VisualState} from "../Visual"
import {Sphere} from "./Sphere"

type SphereVisualState = {
  icon?: Texture
  secondColor?: vec4
} & VisualState

const Colors = {
  darkGray: new vec4(0.1, 0.1, 0.1, 1),
  brightYellow: new vec4(1, 0.8, 0, 1),
  yellow: new vec4(0.7, 0.6, 0.1, 1)
}

const SphereColors = {
  default: {
    base: Colors.darkGray
  },
  hover: {
    base: Colors.darkGray,
    second: Colors.brightYellow
  },
  active: {
    base: Colors.yellow
  },
  toggledHover: {
    base: Colors.yellow,
    second: Colors.brightYellow
  }
}

/**
 * The `SphereVisual` class represents a visual component in the form of a sphere.
 * It extends the `Visual` class and provides functionality for managing the sphere's
 * appearance, size, and state transitions.
 *
 * @extends Visual
 */
export class SphereVisual extends Visual {
  private _sphere: Sphere

  protected _defaultColor: vec4 = SphereColors.default.base
  protected _hoverColor: vec4 = SphereColors.hover.base
  protected _activeColor: vec4 = SphereColors.active.base
  protected _toggledDefaultColor: vec4 = SphereColors.default.base
  protected _toggledHoverColor: vec4 = SphereColors.toggledHover.base

  private _defaultSecondColor: vec4 = SphereColors.default.base
  private _hoverSecondColor: vec4 = SphereColors.hover.base
  private _activeSecondColor: vec4 = SphereColors.active.base
  private _toggledSecondDefaultColor: vec4 = SphereColors.default.base
  private _toggledSecondHoverColor: vec4 = SphereColors.toggledHover.base

  private _defaultIcon: Texture | undefined
  private _hoverIcon: Texture | undefined
  private _activeIcon: Texture | undefined
  private _disabledIcon: Texture | undefined
  private _errorIcon: Texture | undefined

  protected _state: SphereVisualState
  private _sphereVisualStates: Map<StateName, SphereVisualState>
  protected get visualStates(): Map<StateName, SphereVisualState> {
    return this._sphereVisualStates
  }

  /**
   * Gets the `RenderMeshVisual` associated with the sphere.
   *
   * @returns {RenderMeshVisual} The visual representation of the sphere's mesh.
   */
  public get renderMeshVisual(): RenderMeshVisual {
    return this._sphere.renderMeshVisual
  }

  /**
   * Gets the base color of the sphere visual.
   *
   * @returns {vec4} The background color of the sphere as a 4-component vector.
   */
  public get baseColor(): vec4 {
    return this._sphere.backgroundColor
  }

  /**
   * Indicates whether the sphere visual has a border.
   *
   * @returns {boolean} The border property always returns false for the `SphereVisual` class,
   */
  public get hasBorder(): boolean {
    return false
  }

  /**
   * Gets the size of the border for the sphere visual in world space units.
   *
   * @returns The border size as a number. Currently, this always returns 0.
   */
  public get borderSize(): number {
    return 0
  }

  /**
   * @returns vec4 default second color
   */
  public get defaultSecondColor(): vec4 {
    return this._defaultSecondColor
  }

  /**
   * @returns vec4 hover second color
   */
  public get hoverSecondColor(): vec4 {
    return this._hoverSecondColor
  }

  /**
   * @returns vec4 active second color
   */
  public get activeSecondColor(): vec4 {
    return this._activeSecondColor
  }

  public get toggledSecondDefaultColor(): vec4 {
    return this._toggledSecondDefaultColor
  }

  /**
   * @returns vec4 toggled second color
   */
  public get toggledSecondHoverColor(): vec4 {
    return this._toggledSecondHoverColor
  }

  /**
   * @params vec4 default second color
   */
  public set defaultSecondColor(color: vec4) {
    this._defaultSecondColor = color
    this.updateVisualStates()
  }

  /**
   * @params vec4 hover second color
   */
  public set hoverSecondColor(color: vec4) {
    this._hoverSecondColor = color
    this.updateVisualStates()
  }

  /**
   * @params vec4 active second color
   */
  public set activeSecondColor(color: vec4) {
    this._activeSecondColor = color
    this.updateVisualStates()
  }

  /**
   * @params vec4 toggled second color
   */
  public set toggledSecondDefaultColor(color: vec4) {
    this._toggledSecondDefaultColor = color
    this.updateVisualStates()
  }

  /**
   * @params vec4 toggled second color
   */
  public set toggledSecondHoverColor(color: vec4) {
    this._toggledSecondHoverColor = color
    this.updateVisualStates()
  }

  /**
   * Updates the state of the SphereVisual component and refreshes the associated icon.
   *
   * @param stateName - The name of the state to set for the component.
   */
  setState(stateName: StateName) {
    super.setState(stateName)
    this.updateIcon(this._state.icon)
    this.updateSecondColor(this._state.secondColor)
  }

  constructor(sceneObject: SceneObject) {
    super(sceneObject)
    this._sceneObject = global.scene.createSceneObject("Sphere")
    this._sphere = this._sceneObject.createComponent(Sphere.getTypeName())
    this._sphere.radius = this.size.x / 2
    this._sphere.initialize()
    this._sphere.createEvent("OnDestroyEvent").bind(() => {
      this._sceneObject = null
      this._sphere = null
      this.destroy()
    })
    this._transform = this._sceneObject.getTransform()
    this._sceneObject.setParent(sceneObject)
    this.initialize()
  }

  protected set baseColor(value: vec4) {
    this._sphere.backgroundColor = value
  }

  protected get visualSize(): vec3 {
    return vec3.one().uniformScale(this._sphere.radius * 2)
  }

  protected set visualSize(size: vec3) {
    this._sphere.radius = Math.max(size.x, size.y, size.z) / 2
  }

  protected updateHighlight(highlight: boolean, highlightColor: vec4): void {
    const hasHighlight = this.autoHighlight && highlight
    if (hasHighlight) {
      this._sphere.updateHighlightColor(highlightColor)
    }
    this._sphere.enableHighlight(hasHighlight)
  }

  /********** Sphere Specific **************/

  /**
   * Sets the scale factor for the back of the sphere along the z-axis.
   * This property adjusts the depth scaling of the sphere's back side.
   *
   * @param zBackScale - The new scale factor for the z-axis back scaling.
   */
  set zBackScale(zBackScale: number) {
    this._sphere.zBackScale = zBackScale
  }

  /**
   * Sets the default icon for the sphere visual and updates its visual states.
   *
   * @param icon - The texture to be used as the default icon.
   */
  set defaultIcon(icon: Texture) {
    this._defaultIcon = icon
    this.updateVisualStates()
  }

  /**
   * Sets the hover icon for the sphere visual and updates its visual states.
   *
   * @param icon - The texture to be used as the hover icon.
   */
  set hoverIcon(icon: Texture) {
    this._hoverIcon = icon
    this.updateVisualStates()
  }

  /**
   * Sets the active icon for the sphere visual and updates its visual states.
   *
   * @param icon - The texture to be used as the active icon.
   */
  set activeIcon(icon: Texture) {
    this._activeIcon = icon
    this.updateVisualStates()
  }

  /**
   * Sets the disabled icon for the sphere visual and updates its visual states.
   *
   * @param icon - The texture to be used as the disabled icon.
   */
  set disabledIcon(icon: Texture) {
    this._disabledIcon = icon
    this.updateVisualStates()
  }

  /**
   * Sets the error icon for the sphere visual and updates its visual states.
   *
   * @param icon - The texture to be used as the error icon.
   */
  set errorIcon(icon: Texture) {
    this._errorIcon = icon
    this.updateVisualStates()
  }

  /**
   * Updates the icon of the sphere visual.
   *
   * @param icon - The texture to be used as the new icon.
   */
  private updateIcon(icon: Texture) {
    this._sphere.icon = icon
  }

  private updateSecondColor(color: vec4) {
    if (color) {
      this.renderMeshVisual.mainPass.secondColor = color
      this.renderMeshVisual.mainPass.hasSecondColor = 1
    } else {
      this.renderMeshVisual.mainPass.hasSecondColor = 0
    }
  }

  protected updateVisualStates(): void {
    this._sphereVisualStates = new Map([
      [
        StateName.default,
        {
          baseColor: this.baseDefaultColor,
          secondColor: this.defaultSecondColor,
          highlight: false,
          localScale: this.defaultScale,
          localPosition: this.defaultPosition,
          icon: this._defaultIcon
        }
      ],
      [
        StateName.hover,
        {
          baseColor: this.baseHoverColor,
          secondColor: this.hoverSecondColor,
          highlightColor: this.highlightHoverColor,
          highlight: true,
          localScale: this.hoverScale,
          localPosition: this.hoverPosition,
          icon: this._hoverIcon
        }
      ],
      [
        StateName.active,
        {
          baseColor: this.baseActiveColor,
          secondColor: this.activeSecondColor,
          highlightColor: this.highlightFocusColor,
          highlight: true,
          localScale: this.activeScale,
          localPosition: this.activePosition,
          icon: this._activeIcon
        }
      ],
      [
        StateName.toggledHovered,
        {
          baseColor: this.baseToggledHoverColor,
          secondColor: this.toggledSecondHoverColor,
          highlight: true,
          highlightColor: this.highlightHoverColor,
          localScale: this.toggledHoverScale,
          localPosition: this.toggledPosition,
          icon: this._activeIcon
        }
      ],
      [
        StateName.toggledDefault,
        {
          baseColor: this.baseToggledDefaultColor,
          secondColor: this.toggledSecondDefaultColor,
          highlight: false,
          localScale: this.toggledScale,
          localPosition: this.toggledPosition,
          icon: this._activeIcon
        }
      ],
      [
        StateName.error,
        {
          baseColor: this.baseErrorColor,
          secondColor: this.baseErrorColor,
          highlight: false,
          localScale: this.errorScale,
          localPosition: this.errorPosition,
          icon: this._errorIcon
        }
      ],
      [
        StateName.errorHover,
        {
          baseColor: this.baseErrorColor,
          secondColor: this.baseErrorColor,
          highlightColor: this.highlightHoverColor,
          highlight: true,
          localScale: this.hoverScale,
          localPosition: this.hoverPosition,
          icon: this._errorIcon
        }
      ],
      [
        StateName.disabled,
        {
          baseColor: this.baseErrorColor,
          secondColor: this.baseErrorColor,
          highlight: false,
          localScale: this.disabledScale,
          localPosition: this.disabledPosition,
          icon: this._disabledIcon
        }
      ]
    ])
    super.updateVisualStates()
  }
}
