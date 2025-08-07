import {GradientParameters, RoundedRectangle} from "./Visuals/RoundedRectangle/RoundedRectangle"

@component
export class DropShadow extends BaseScriptComponent {
  @input
  private _size: vec2 = new vec2(3, 3)

  @input
  private _cornerRadius: number = 1.5

  @input("vec4", "{.43,.43,.43,.15}")
  @widget(new ColorWidget())
  private color: vec4 = new vec4(11 / 255, 11 / 255, 11 / 255, 15 / 100)

  @input
  @widget(new SliderWidget(0.0, 1.0))
  private spread: number = 0.5

  private shadow: RoundedRectangle

  /**
   * The size of the drop shadow.
   * @type {vec2}
   */
  public get size(): vec2 {
    return this._size
  }

  /**
   * The size of the drop shadow.
   * @param {vec2} value - The new size of the drop shadow.
   */
  public set size(value: vec2) {
    this._size = value
    if (this.shadow) {
      this.shadow.size = new vec2(value.x, value.y)
    }
  }

  /**
   * The corner radius of the drop shadow.
   * @type {number}
   */
  public get cornerRadius(): number {
    return this._cornerRadius
  }

  /**
   * The corner radius of the drop shadow.
   * @param {number} value - The new corner radius of the drop shadow.
   */
  public set cornerRadius(value: number) {
    this._cornerRadius = value
    if (this.shadow) {
      this.shadow.cornerRadius = value
    }
  }

  private get defaultGradient(): GradientParameters {
    return {
      type: "Rectangle",
      start: new vec2(-1, 0),
      end: new vec2(1, 0),
      stop0: {enabled: true, color: this.color, percent: 1 - this.spread},
      stop1: {enabled: true, color: new vec4(this.color.x, this.color.y, this.color.z, 0), percent: 1},
      stop2: {enabled: false},
      stop3: {enabled: false},
      stop4: {enabled: false}
    } as GradientParameters
  }

  onAwake() {
    const transform = this.getTransform()
    const localPosition = transform.getLocalPosition()
    transform.setLocalPosition(new vec3(localPosition.x, localPosition.y, -0.01))
    this.shadow = this.sceneObject.createComponent(RoundedRectangle.getTypeName())
    this.shadow.initialize()

    this.shadow.size = new vec2(this._size.x, this._size.y)
    this.shadow.cornerRadius = this._cornerRadius
    this.shadow.border = false
    this.shadow.borderSize = 0
    this.shadow.gradient = true
    this.shadow.gradientType = "Rectangle"
    this.shadow.setBackgroundGradient(this.defaultGradient)

    this.shadow.renderMeshVisual.mainPass.colorMask = new vec4b(true, true, true, true)
    this.shadow.renderMeshVisual.mainPass.blendMode = BlendMode.Normal
    this.shadow.renderMeshVisual.mainMaterial.mainPass.depthTest = true
    this.shadow.renderMeshVisual.mainMaterial.mainPass.depthWrite = true
  }
}
