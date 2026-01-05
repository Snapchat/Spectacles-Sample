import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"
import {StateName} from "../../Components/Element"
import {Visual, VisualState} from "../Visual"
import {Capsule} from "./Capsule"

/**
 * The `CapsuleVisual` class represents a visual component in the form of a capsule.
 * It extends the `Visual` class and provides functionality for managing the capsule's
 * appearance, size, and state transitions.
 *
 * @extends Visual
 */
export class CapsuleVisualPrimary extends Visual {
  private _capsule: Capsule

  private _capsuleVisualStates: Map<StateName, VisualState>
  protected get visualStates(): Map<StateName, VisualState> {
    return this._capsuleVisualStates
  }

  /**
   * Gets the `RenderMeshVisual` associated with the capsule.
   *
   * @returns {RenderMeshVisual} The visual representation of the capsule's mesh.
   */
  public get renderMeshVisual(): RenderMeshVisual {
    return this._capsule.renderMeshVisual
  }

  /**
   * Gets the base color of the capsule visual.
   *
   * @returns {vec4} The background color of the capsule as a 4-component vector.
   */
  public get baseColor(): vec4 {
    return this._capsule.backgroundColor
  }

  /**
   * Indicates whether the capsule visual has a border.
   *
   * @returns {boolean} The border property always returns false for the `CapsuleVisual` class,
   */
  public get hasBorder(): boolean {
    return false
  }

  /**
   * Gets the size of the border for the capsule visual.
   *
   * @returns The border size as a number. Currently, this always returns 0.
   */
  public get borderSize(): number {
    return 0
  }

  constructor(sceneObject: SceneObject) {
    super(sceneObject)
    this._sceneObject = global.scene.createSceneObject("Capsule")
    this._capsule = this._sceneObject.createComponent(Capsule.getTypeName())
    this._capsule.initialize()
    this._capsule.createEvent("OnDestroyEvent").bind(() => {
      this._sceneObject = null
      this._capsule = null
      this.destroy()
    })
    this._transform = this._sceneObject.getTransform()
    this._sceneObject.setParent(sceneObject)
    this._capsule.depth = this.size.z
    this._capsule.size = new vec2(this.size.x, this.size.y)
    this.initialize()
  }

  protected set baseColor(value: vec4) {
    this._capsule.backgroundColor = value
  }

  protected get visualSize(): vec3 {
    return new vec3(this._capsule.size.x, this._capsule.size.y, this._capsule.depth)
  }

  protected set visualSize(value: vec3) {
    this.capsuleSize = value
  }

  set capsuleSize(value: vec3) {
    this._capsule.depth = value.z
    this._capsule.size = new vec2(value.x, value.y)
  }

  protected updateHighlight(highlight: boolean, highlightColor: vec4): void {
    const hasHighlight = this.autoHighlight && highlight
    if (hasHighlight) {
      this._capsule.updateHighlightColor(highlightColor)
    }
    this._capsule.enableHighlight(hasHighlight)
  }
  private readonly beigeColor = new vec4(0.96, 0.87, 0.7, 1)
  private readonly intenseYellow = new vec4(0.99, 0.99, 0.85, 1)
  protected updateVisualStates(): void {
    this._capsuleVisualStates = new Map([
      [
        StateName.default,
        {
          baseColor: withAlpha(this.beigeColor, 1),
          highlight: false,
          localScale: this.defaultScale,
          localPosition: this.defaultPosition
        }
      ],
      [
        StateName.hover,
        {
          baseColor: withAlpha(this.intenseYellow, 1),
          highlightColor: this.highlightHoverColor,
          highlight: true,
          localScale: this.hoverScale,
          localPosition: this.hoverPosition
        }
      ],
      [
        StateName.active,
        {
          baseColor: withAlpha(this.baseActiveColor, 1),
          highlightColor: this.highlightFocusColor,
          highlight: true,
          localScale: this.activeScale,
          localPosition: this.activePosition
        }
      ],
      [
        StateName.error,
        {
          baseColor: withAlpha(this.baseErrorColor, 1),
          highlight: false,
          localScale: this.errorScale,
          localPosition: this.errorPosition
        }
      ],
      [
        StateName.errorHover,
        {
          baseColor: withAlpha(this.baseErrorColor, 1),
          highlightColor: this.highlightHoverColor,
          highlight: true,
          localScale: this.hoverScale,
          localPosition: this.hoverPosition
        }
      ],
      [
        StateName.disabled,
        {
          baseColor: withAlpha(this.baseDisabledColor, 1),
          highlight: false,
          localScale: this.disabledScale,
          localPosition: this.disabledPosition
        }
      ]
    ])
    super.updateVisualStates()
  }
}
