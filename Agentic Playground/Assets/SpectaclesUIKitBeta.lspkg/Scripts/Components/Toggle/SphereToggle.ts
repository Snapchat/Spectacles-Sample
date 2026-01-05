import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {SphereVisual} from "../../Visuals/Sphere/SphereVisual"
import {Toggle} from "./Toggle"

const log = new NativeLogger("SphereToggle")  

/**
 * Represents a SphereToggle component that extends the base Toggle class.
 * This component initializes a SphereVisual instance and assigns it as the visual representation.
 *
 * @extends Toggle - Inherits functionality from the Toggle class.
 */
@component
export class SphereToggle extends Toggle {
  @input
  @hint("Radius of Sphere In Local Space Units")
  private _radius: number = 1

  @input
  @hint(
    "Scale of the back of the Sphere in Local Space Units. A value closer to 0.0 makes the back of the sphere flatter, while a value closer to 1.0 retains its original shape."
  )
  @widget(new SliderWidget(0.0, 1.0))
  private _zBackScale: number = 1.0

  @input
  @hint("The icon displayed in toggle's default state")
  @allowUndefined
  private _defaultIcon: Texture | undefined = undefined

  @input
  @hint("The icon displayed in toggle's hover state")
  @allowUndefined
  private _hoverIcon: Texture | undefined = undefined

  @input
  @hint("The icon displayed in toggle's active state")
  @allowUndefined
  private _activeIcon: Texture | undefined = undefined

  @input
  @hint("The icon displayed in toggle's disabled state")
  @allowUndefined
  private _disabledIcon: Texture | undefined = undefined

  @input
  @hint("The icon displayed in toggle's error state")
  @allowUndefined
  private _errorIcon: Texture | undefined = undefined

  override _size: vec3 = new vec3(2, 2, 2)

  protected _visual: SphereVisual

  /**
   * Gets the size of the sphere toggle as a 3D vector.
   *
   * @returns {vec3} The size of the sphere toggle.
   */
  get size(): vec3 {
    return this._size
  }

  /**
   * Setter for the size property.
   *
   * The `size` property is not applicable for `SphereToggle`.
   * Use the `radius` property instead to define the size of the toggle.
   * A warning will be logged if this setter is used.
   *
   * @param size - The size value, which is ignored for `SphereToggle`.
   */
  set size(size: vec3) {
    log.w(`Size is not applicable for SphereToggle. Use radius instead.`)
  }

  /**
   * Gets the radius of the sphere toggle.
   *
   * @returns {number} The radius of the sphere toggle in local space units.
   */
  get radius(): number {
    return this._radius
  }

  /**
   * Gets the radius of the sphere toggle.
   *
   * @returns {number} The radius of the sphere toggle in local space units.
   */
  set radius(radius: number) {
    this._radius = radius
    super.size = vec3.one().uniformScale(this._radius * 2)
  }

  /**
   * Gets the z-axis back scale of the sphere toggle.
   *
   * @returns {number} The z-axis back scale of the sphere toggle.
   */
  get zBackScale(): number {
    return this._zBackScale
  }

  /**
   * Sets the z-axis back scale for the toggle's visual appearance.
   * This value determines the depth scaling effect applied to the toggle.
   *
   * @param zBackScale - The new z-axis back scale value to be applied.
   */
  set zBackScale(zBackScale: number) {
    this._visual.zBackScale = this._zBackScale = zBackScale
  }

  /**
   * Initializes the SphereToggle component. This method ensures that the component
   * is only initialized once. If not already initialized, it creates a `SphereVisual` instance to bind as visual.
   */
  initialize() {
    super.initialize()

    this._visual.defaultIcon = this._defaultIcon
    this._visual.hoverIcon = this._hoverIcon
    this._visual.activeIcon = this._activeIcon
    this._visual.disabledIcon = this._disabledIcon
    this._visual.errorIcon = this._errorIcon

    this.radius = this._radius
    this.zBackScale = this._zBackScale
  }

  protected createDefaultVisual(): void {
    if (!this._visual) {
      this._visual = new SphereVisual(this.sceneObject)
    }
  }
}
