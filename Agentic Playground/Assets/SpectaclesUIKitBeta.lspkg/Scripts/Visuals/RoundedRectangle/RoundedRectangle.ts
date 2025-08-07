/**
 * Size Modes For Texture Background
 */
export type TextureMode = "Stretch" | "Fill Height" | "Fill Width"
/**
 * Wrap Modes For Texture Background
 */
export type TextureWrap = "None" | "Repeat" | "Clamp"
/**
 * Gradient Types for background and border
 */
export type GradientType = "Linear" | "Radial" | "Rectangle"
/**
 * Whether border is solid color or gradient
 */
export type BorderType = "Color" | "Gradient"

/**
 * Helper Type For Gradient Stops
 */
export type GradientStop = {
  color?: vec4
  percent?: number
  enabled?: boolean
}

/**
 * Parameters for Border setting functions
 */
export type GradientParameters = {
  enabled?: boolean
  start?: vec2
  end?: vec2
  type?: GradientType
  stop0?: GradientStop
  stop1?: GradientStop
  stop2?: GradientStop
  stop3?: GradientStop
  stop4?: GradientStop
}

/**
 * Rounded Rectangle Component
 * Gives a Rounded Rectangle at a given size
 * Provides Background Color, Gradient or Texture
 * And an Optional Inset Border, with Color or Gradient
 */
@component
export class RoundedRectangle extends BaseScriptComponent {
  @input("vec2", "{1,1}")
  @hint("Size of Rectangle In Local Space Centimeters")
  private _size: vec2

  @input("float", "1")
  @hint("Radius of rounding in Local Space Centimeters")
  private _cornerRadius: number

  @input
  @hint("Enable background gradient")
  private _gradient: boolean

  @input("vec4", "{.8,.8,.8,1.}")
  @hint("Solid color of background if not using gradient")
  @widget(new ColorWidget())
  @showIf("_gradient", false)
  private _backgroundColor: vec4

  @input
  @hint("Enable background texture")
  @showIf("_gradient", false)
  private _useTexture: boolean = false

  @input
  @hint("Background texture asset")
  @showIf("_useTexture", true)
  private _texture: Texture

  @input("string", "Stretch")
  @hint("Display mode for background texture.")
  @showIf("_useTexture", true)
  @widget(
    new ComboBoxWidget([new ComboBoxItem("Stretch"), new ComboBoxItem("Fill Height"), new ComboBoxItem("Fill Width")])
  )
  private _textureMode: TextureMode

  @input("string", "None")
  @hint("Wrap mode for background texture.")
  @showIf("_useTexture", true)
  @widget(new ComboBoxWidget([new ComboBoxItem("None"), new ComboBoxItem("Repeat"), new ComboBoxItem("Clamp")]))
  private _textureWrap: TextureWrap

  @input("string", "Linear")
  @hint("Gradient type: either Linear or Radial")
  @showIf("_gradient", true)
  @widget(new ComboBoxWidget([new ComboBoxItem("Linear"), new ComboBoxItem("Radial"), new ComboBoxItem("Rectangle")]))
  private _gradientType: GradientType = "Linear"

  @input("vec2", "{-1,-1}")
  @hint("Start Position for gradient. Use to define ratio of gradient stop percents.")
  @showIf("_gradient", true)
  private _gradientStartPosition: vec2

  @input("vec2", "{1,1}")
  @hint("End Position for gradient. Use to define ratio of gradient stop percents.")
  @showIf("_gradient", true)
  private _gradientEndPosition: vec2

  @input("vec4", "{.5,.5,.5,1}")
  @hint("Color for this stop.")
  @showIf("_gradient", true)
  @widget(new ColorWidget())
  private _gradientColor0: vec4

  @input("number", "0")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_gradient", true)
  private _gradientPercent0: number

  @input("vec4", "{.75,.75,.7,1}")
  @hint("Color for this stop.")
  @showIf("_gradient", true)
  @widget(new ColorWidget())
  private _gradientColor1: vec4

  @input("number", "0")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_gradient", true)
  private _gradientPercent1: number

  @input
  @hint("Enable or disable this stop.")
  @showIf("_gradient", true)
  private _gradientStop2: boolean = false

  @input("vec4", "{0,0,0,0}")
  @hint("Color for this stop.")
  @showIf("_gradientStop2", true)
  @widget(new ColorWidget())
  private _gradientColor2: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_gradientStop2", true)
  private _gradientPercent2: number

  @input
  @showIf("_gradientStop2", true)
  @hint("Enable or disable this stop.")
  private _gradientStop3: boolean = false

  @input("vec4", "{0,0,0,0}")
  @hint("Color for this stop.")
  @showIf("_gradientStop3", true)
  @widget(new ColorWidget())
  private _gradientColor3: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_gradientStop3", true)
  private _gradientPercent3: number

  @input
  @hint("Enable or disable this stop.")
  @showIf("_gradientStop3", true)
  private _gradientStop4: boolean = false

  @input("vec4", "{0,0,0,0}")
  @hint("Color for this stop.")
  @showIf("_gradientStop4", true)
  @widget(new ColorWidget())
  private _gradientColor4: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_gradientStop4", true)
  private _gradientPercent4: number

  @input
  @hint("Enable or disable this stop.")
  @showIf("_gradientStop4", true)
  private _gradientStop5: boolean = false

  @input("vec4", "{0,0,0,0}")
  @hint("Color for this stop.")
  @showIf("_gradientStop5", true)
  @widget(new ColorWidget())
  private _gradientColor5: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_gradientStop5", true)
  private _gradientPercent5: number

  @input
  @hint("Enable or disable inset border.")
  private _border: boolean

  @input("float", ".2")
  @hint("Border thickness in centimeters in Local Space.")
  @showIf("_border", true)
  private _borderSize: number

  @input("string", "Color")
  @hint("Type of border fill. Either solid Color or Gradient.")
  @showIf("_border", true)
  @widget(new ComboBoxWidget([new ComboBoxItem("Color"), new ComboBoxItem("Gradient")]))
  private _borderType: BorderType = "Color"

  @input("vec4", "{.8,.8,.8,1.}")
  @hint("Color of border when set to Color type.")
  @widget(new ColorWidget())
  @showIf("_border", true)
  private _borderColor: vec4

  @input("string", "Linear")
  @hint("Type of gradient. Either Linear or Radial.")
  @showIf("_borderType", "Gradient")
  @widget(new ComboBoxWidget([new ComboBoxItem("Linear"), new ComboBoxItem("Radial"), new ComboBoxItem("Rectangle")]))
  private _borderGradientType: GradientType = "Linear"

  @input("vec2", "{-1,-1}")
  @hint("Start Position for border gradient. Use to define ratio of gradient stop percents.")
  @showIf("_borderType", "Gradient")
  private _borderGradientStartPosition: vec2

  @input("vec2", "{1,1}")
  @hint("End Position for border gradient. Use to define ratio of gradient stop percents.")
  @showIf("_borderType", "Gradient")
  private _borderGradientEndPosition: vec2

  @input("vec4", "{.5,.5,.5,1}")
  @hint("Color for this stop.")
  @showIf("_borderType", "Gradient")
  @widget(new ColorWidget())
  private _borderGradientColor0: vec4

  @input("number", "0")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_borderType", "Gradient")
  private _borderGradientPercent0: number

  @input("vec4", "{.75,.75,.7,1}")
  @hint("Color for this stop.")
  @showIf("_borderType", "Gradient")
  @widget(new ColorWidget())
  private _borderGradientColor1: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_borderType", "Gradient")
  private _borderGradientPercent1: number

  @input
  @hint("Enable or disable this stop.")
  @showIf("_borderType", "Gradient")
  private _borderGradientStop2: boolean = false

  @input("vec4", "{.9,.9,.8,1}")
  @hint("Color for this stop.")
  @showIf("_borderGradientStop2", true)
  @widget(new ColorWidget())
  private _borderGradientColor2: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_borderGradientStop2", true)
  private _borderGradientPercent2: number

  @input
  @hint("Enable or disable this stop.")
  @showIf("_borderGradientStop2", true)
  private _borderGradientStop3: boolean = false

  @input("vec4", "{0,0,0,0}")
  @hint("Color for this stop.")
  @showIf("_borderGradientStop3", true)
  @widget(new ColorWidget())
  private _borderGradientColor3: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_borderGradientStop3", true)
  private _borderGradientPercent3: number

  @input
  @hint("Enable or disable this stop.")
  @showIf("_borderGradientStop3", true)
  private _borderGradientStop4: boolean = false

  @input("vec4", "{0,0,0,0}")
  @hint("Color for this stop.")
  @showIf("_borderGradientStop4", true)
  @widget(new ColorWidget())
  private _borderGradientColor4: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_borderGradientStop4", true)
  private _borderGradientPercent4: number

  @input
  @hint("Enable or disable this stop.")
  @showIf("_borderGradientStop4", true)
  private _borderGradientStop5: boolean = false

  @input("vec4", "{0,0,0,0}")
  @hint("Color for this stop.")
  @showIf("_borderGradientStop5", true)
  @widget(new ColorWidget())
  private _borderGradientColor5: vec4

  @input("number", "1")
  @hint("Percent position within gradient that it fully reaches this stop color.")
  @showIf("_borderGradientStop5", true)
  private _borderGradientPercent5: number

  private _initialized: boolean = false

  private _transform: Transform = this.sceneObject.getTransform()

  private _mesh: RenderMesh = requireAsset("../../../Meshes/StretchableCircle.mesh") as RenderMesh
  private _material: Material = requireAsset("../../../Materials/RoundedRectangleStroke.mat") as Material
  private _rmv =
    this.sceneObject.getComponent("RenderMeshVisual") || this.sceneObject.createComponent("RenderMeshVisual")

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  /**
   * initialize function
   * run once
   * if creating dynamically: set parameters, then run this function to create and initialize in one frame
   */
  initialize() {
    if (this._initialized) return

    // setup mesh
    this._rmv.mesh = this._mesh
    this._material = this._material.clone()
    this._material.mainPass.frustumCullMode = FrustumCullMode.UserDefinedAABB
    this._rmv.mainMaterial = this._material

    this.size = this._size

    this.cornerRadius = this._cornerRadius
    this.backgroundColor = this._backgroundColor

    this.gradient = this._gradient
    this.gradientType = this._gradientType

    this.border = this._border

    if (this.border) {
      this.borderType = this._borderType
      this.borderSize = this._borderSize
      this.borderColor = this._borderColor
    }

    this.useTexture = this._useTexture
    if (this.useTexture) {
      this.texture = this._texture
      this.textureMode = this._textureMode
      this.textureWrap = this._textureWrap
    }

    this.updateBackgroundGradient()
    this.updateBorderGradient()

    this._initialized = true
  }

  get transform(): Transform {
    return this._transform
  }

  get renderMeshVisual(): RenderMeshVisual {
    return this._rmv
  }

  /**
   * @returns vec2 size of the rectangle in centimeters in local space.
   */
  get size(): vec2 {
    return this._size
  }

  /**
   * @param size set the rectangle to this size in centimeters in local space.
   */
  set size(size: vec2) {
    this._size = size
    const frustumVec = new vec3(size.x, size.y, 0)
    if (this.renderMeshVisual.mainMaterial) {
      this.renderMeshVisual.mainMaterial.mainPass.size = this._size.sub(vec2.one().uniformScale(2)) // subtract size of underlying circle mesh
      this.renderMeshVisual.mainMaterial.mainPass.frustumCullMin = frustumVec.uniformScale(-0.5)
      this.renderMeshVisual.mainMaterial.mainPass.frustumCullMax = frustumVec.uniformScale(0.5)
    }
  }

  /**
   * @returns current corner radius in centimeters in local space.
   */
  get cornerRadius(): number {
    return this._cornerRadius
  }

  /**
   * @param cornerRadius set corner radius in centimeters in local space.
   */
  set cornerRadius(cornerRadius: number) {
    this._cornerRadius = cornerRadius
    this.renderMeshVisual.mainMaterial.mainPass.cornerRadius = cornerRadius
  }

  /**
   * @returns current border thickness in centimeters in local space.
   */
  get borderSize(): number {
    return this._borderSize
  }

  /**
   * @param borderSize set border thickness in centimeters in local space.
   */
  set borderSize(borderSize: number) {
    this._borderSize = borderSize
    this.renderMeshVisual.mainMaterial.mainPass.borderSize = borderSize
  }

  /**
   * @returns vec4 of current background color. for solid color, not gradient.
   */
  get backgroundColor(): vec4 {
    return this._backgroundColor
  }

  /**
   * @param color set current solid background color.
   */
  set backgroundColor(color: vec4) {
    this._backgroundColor = color
    this.renderMeshVisual.mainMaterial.mainPass.backgroundColor = color
  }

  /**
   * @returns boolean of whether this uses a background texture.
   */
  get useTexture(): boolean {
    return this._useTexture
  }

  /**
   * @param use boolean of whether to use a background texture.
   */
  set useTexture(use: boolean) {
    this._useTexture = use
    this.renderMeshVisual.mainMaterial.mainPass.useTexture = use ? 1 : 0
  }

  /**
   * @returns current background texture asset.
   */
  get texture(): Texture {
    return this._texture
  }

  /**
   * @param texture set asset for background texture.
   */
  set texture(texture: Texture) {
    this._texture = texture
    this.renderMeshVisual.mainMaterial.mainPass.backgroundTexture = this._texture
  }

  /**
   * @returns current texture mode of background texture: Stretch, Fill Height or Fill Width.
   */
  get textureMode(): TextureMode {
    return this._textureMode
  }

  /**
   * @param mode set texture mode of background texture: Stretch: Fill Height or Fill Width.
   */
  set textureMode(mode: TextureMode) {
    this._textureMode = mode
    // const rectAspect = mode === "Fill Width" ? this.size.y / this.size.x : this.size.x / this.size.y
    const textureAspect = (this._texture.control.getAspect() * this.size.y) / this.size.x
    // const textureAspect = this._texture.control.getAspect()
    if (mode === "Stretch") {
      this.renderMeshVisual.mainMaterial.mainPass.textureMode = new vec2(1, 1)
    } else if (mode === "Fill Height") {
      this.renderMeshVisual.mainMaterial.mainPass.textureMode = new vec2(1 / textureAspect, 1)
    } else if (mode === "Fill Width") {
      this.renderMeshVisual.mainMaterial.mainPass.textureMode = new vec2(1, textureAspect)
    }
  }

  /**
   * @returns current texture wrap method: None, Repeat or Clamp.
   */
  get textureWrap(): TextureWrap {
    return this._textureWrap
  }

  /**
   * @param wrap sets current texture wrap method: None, Repeat or Clamp.
   */
  set textureWrap(wrap: TextureWrap) {
    this._textureWrap = wrap
    if (wrap === "None") {
      this.renderMeshVisual.mainMaterial.mainPass.textureWrap = 0
    } else if (wrap === "Repeat") {
      this.renderMeshVisual.mainMaterial.mainPass.textureWrap = 1
    } else if (wrap === "Clamp") {
      this.renderMeshVisual.mainMaterial.mainPass.textureWrap = 2
    }
  }

  /**
   * @returns boolean of whether or not the background uses a gradient.
   */
  get gradient(): boolean {
    return this._gradient
  }

  /**
   * @param enabled boolean to enable or disable background gradient.
   */
  set gradient(enabled: boolean) {
    this._gradient = enabled
    this.updateBackgroundGradient()
  }

  /**
   * @returns type of the background gradient: Linear, or Radial.
   */
  get gradientType(): GradientType {
    return this._gradientType
  }

  /**
   * @param type set type of the background gradient: Linear or Radial.
   */
  set gradientType(type: GradientType) {
    this._gradientType = type
    if (this._gradientType === "Rectangle") {
      // rectangle requires border
      this.renderMeshVisual.mainMaterial.mainPass.border = 1
    } else {
      if (!this._border) this.renderMeshVisual.mainMaterial.mainPass.border = 0
    }
    this.updateBackgroundGradient()
  }

  /**
   * @returns vec2 of the background starting position.
   * The start position defines the range for the stops.
   */
  get gradientStartPosition(): vec2 {
    return this._gradientStartPosition
  }

  /**
   * @param position set vec2 of the background starting position.
   * The start position defines the range for the stops.
   */
  set gradientStartPosition(position: vec2) {
    this._gradientStartPosition = position
  }

  /**
   * @returns vec2 of the background ending position.
   * The end position defines the range for the stops.
   */
  get gradientEndPosition(): vec2 {
    return this._gradientEndPosition
  }

  /**
   * @param position set vec2 of the background ending position.
   * The end position defines the range for the stops.
   */
  set gradientEndPosition(position: vec2) {
    this._gradientEndPosition = position
  }

  /**
   * @returns boolean whether or not the border is enabled.
   */
  get border(): boolean {
    return this._border
  }

  /**
   * @param enabled boolean to show or hide the border.
   */
  set border(enabled: boolean) {
    this._border = enabled
    this.renderMeshVisual.mainMaterial.mainPass.border = enabled ? 1 : 0

    // need border calculations if using gradient type rectangle
    if (!enabled) {
      this.borderSize = 0
      if (this._gradientType === "Rectangle") {
        this.renderMeshVisual.mainMaterial.mainPass.border = 1
      }
    }
    this.updateBorderGradient()
  }

  /**
   * @returns vec4 of the solid border color (not gradient).
   */
  get borderColor(): vec4 {
    return this._borderColor
  }

  /**
   * @param color set vec4 of the solid border color (not gradient).
   */
  set borderColor(color: vec4) {
    this._borderColor = color
    this.renderMeshVisual.mainMaterial.mainPass.borderColor = color
  }

  /**
   * @returns which type of border: either Color or Gradient.
   */
  get borderType(): BorderType {
    return this._borderType
  }

  /**
   * @param type set border type: either Color or Gradient.
   */
  set borderType(type: BorderType) {
    this._borderType = type
    this.updateBorderGradient()
  }

  /**
   * @returns type of gradient for the border gradient: Linear or Radial.
   */
  get borderGradientType(): GradientType {
    return this._borderGradientType
  }

  /**
   * @param type set type of gradient for the border gradient: Linear or Gradient.
   */
  set borderGradientType(type: GradientType) {
    this._borderGradientType = type
    this.updateBorderGradient()
  }

  /**
   * @returns vec2 of current border gradient start position.
   * The start position defines the range for the stops.
   */
  get borderGradientStartPosition(): vec2 {
    return this._borderGradientStartPosition
  }

  /**
   * @param position set vec2 of the border gradient start position.
   * The start position defines the range for the stops.
   */
  set borderGradientStartPosition(position: vec2) {
    this._borderGradientStartPosition = position
  }

  /**
   * @returns vec2 of current border gradient end position.
   * The end position defines the range for the stops.
   */
  get borderGradientEndPosition(): vec2 {
    return this._borderGradientEndPosition
  }

  /**
   * @param position set vec2 of the border gradient end position.
   * The end position defines the range for the stops.
   */
  set borderGradientEndPosition(position: vec2) {
    this._borderGradientEndPosition = position
  }

  /**
   * get a stop from the background gradient at index
   * @param index: number
   * @returns GradientStop
   */
  getBackgroundGradientStop = (index: number): GradientStop => {
    return {
      color: this["_gradientColor" + index],
      percent: this["_gradientPercent" + index],
      enabled: this["_gradientStop" + index]
    }
  }

  /**
   * set a stop in the background gradient
   * at given index, with parameters defined by GradientStop
   * @param index: number
   * @param stop: GradientStop
   */
  setBackgroundGradientStop = (index: number, stop: GradientStop) => {
    if (stop.color !== undefined) this["_gradientColor" + index] = stop.color
    if (stop.percent !== undefined) this["_gradientPercent" + index] = stop.percent
    if (stop.enabled !== undefined) this["_gradientStop" + index] = stop.enabled
    else this["_gradientStop" + index] = false
    this.updateBackgroundGradient()
  }

  /**
   * set background gradient using a GradientParameters input
   * @param gradientParameters: GradientParameters
   */
  setBackgroundGradient = (gradientParameters: GradientParameters) => {
    if (gradientParameters.enabled !== undefined) this.gradient = gradientParameters.enabled
    if (gradientParameters.type !== undefined) this.gradientType = gradientParameters.type
    if (gradientParameters.stop0) this.setBackgroundGradientStop(0, gradientParameters.stop0)
    if (gradientParameters.stop1) this.setBackgroundGradientStop(1, gradientParameters.stop1)
    if (gradientParameters.stop2) this.setBackgroundGradientStop(2, gradientParameters.stop2)
    if (gradientParameters.stop3) this.setBackgroundGradientStop(3, gradientParameters.stop3)
    if (gradientParameters.stop4) this.setBackgroundGradientStop(4, gradientParameters.stop4)
    if (gradientParameters.start) this.gradientStartPosition = gradientParameters.start
    if (gradientParameters.end) this.gradientEndPosition = gradientParameters.end

    this.updateBackgroundGradient()
  }

  /**
   * get a stop from the border gradient at index
   * @param index: number
   * @returns GradientStop
   */
  getBorderGradientStop = (index: number): GradientStop => {
    return {
      color: this["_borderGradientColor" + index],
      percent: this["_borderGradientPercent" + index],
      enabled: this["_borderGradientStop" + index]
    }
  }

  /**
   * set a stop in the border gradient
   * at given index, with parameters defined by GradientStop
   * @param index: number
   * @param stop: GradientStop
   */
  setBorderGradientStop = (index: number, stop: GradientStop) => {
    if (stop.color !== undefined) this["_borderGradientColor" + index] = stop.color
    if (stop.percent !== undefined) this["_borderGradientPercent" + index] = stop.percent
    if (stop.enabled !== undefined) this["_borderGradientStop" + index] = stop.enabled
    this.updateBorderGradient()
  }

  /**
   * set background gradient using a GradientParameters input
   * @param gradientParameters: GradientParameters
   */
  setBorderGradient = (gradientParameters: GradientParameters) => {
    if (gradientParameters.enabled !== undefined) this.borderType = gradientParameters.enabled ? "Gradient" : "Color"
    if (gradientParameters.type !== undefined) this.borderGradientType = gradientParameters.type
    if (gradientParameters.stop0) this.setBorderGradientStop(0, gradientParameters.stop0)
    if (gradientParameters.stop1) this.setBorderGradientStop(1, gradientParameters.stop1)
    if (gradientParameters.stop2) this.setBorderGradientStop(2, gradientParameters.stop2)
    if (gradientParameters.stop3) this.setBorderGradientStop(3, gradientParameters.stop3)
    if (gradientParameters.stop4) this.setBorderGradientStop(4, gradientParameters.stop4)
    if (gradientParameters.start) this.borderGradientStartPosition = gradientParameters.start
    if (gradientParameters.end) this.borderGradientEndPosition = gradientParameters.end

    this.updateBorderGradient()
  }

  /**
   * internal function to update material based on background gradient params
   */
  private updateBackgroundGradient = () => {
    let stops = 0
    if (this._gradient) {
      stops = 2
      this.renderMeshVisual.mainMaterial.mainPass["colors[0]"] = this._gradientColor0
      this.renderMeshVisual.mainMaterial.mainPass["percents[0]"] = this._gradientPercent0
      this.renderMeshVisual.mainMaterial.mainPass["colors[1]"] = this._gradientColor1
      this.renderMeshVisual.mainMaterial.mainPass["percents[1]"] = this._gradientPercent1
      if (this._gradientStop2) {
        stops = 3
        this.renderMeshVisual.mainMaterial.mainPass["colors[2]"] = this._gradientColor2
        this.renderMeshVisual.mainMaterial.mainPass["percents[2]"] = this._gradientPercent2
      }
      if (this._gradientStop3) {
        stops = 4
        this.renderMeshVisual.mainMaterial.mainPass["colors[3]"] = this._gradientColor3
        this.renderMeshVisual.mainMaterial.mainPass["percents[3]"] = this._gradientPercent3
      }
      if (this._gradientStop4) {
        stops = 5
        this.renderMeshVisual.mainMaterial.mainPass["colors[4]"] = this._gradientColor4
        this.renderMeshVisual.mainMaterial.mainPass["percents[4]"] = this._gradientPercent4
      }
      if (this._gradientStop5) {
        stops = 6
        this.renderMeshVisual.mainMaterial.mainPass["colors[5]"] = this._gradientColor5
        this.renderMeshVisual.mainMaterial.mainPass["percents[5]"] = this._gradientPercent5
      }

      if (this._gradientType === "Linear") {
        const angle = Math.atan2(
          this._gradientEndPosition.y - this._gradientStartPosition.y,
          this._gradientEndPosition.x - this._gradientStartPosition.x
        )
        const linearGradientStart =
          this._gradientStartPosition.x * Math.cos(-angle) - this._gradientStartPosition.y * Math.sin(-angle)
        this.renderMeshVisual.mainMaterial.mainPass.linearGradientStart = linearGradientStart
        const linearGradientEnd =
          this._gradientEndPosition.x * Math.cos(-angle) - this._gradientEndPosition.y * Math.sin(-angle)
        this.renderMeshVisual.mainMaterial.mainPass.linearGradientEnd = linearGradientEnd
        this.renderMeshVisual.mainMaterial.mainPass.linearGradientAngle = angle
        this.renderMeshVisual.mainMaterial.mainPass.linearGradientLength = linearGradientEnd - linearGradientStart
      } else if (this._gradientType === "Radial") {
        const diff = this._gradientEndPosition.sub(this._gradientStartPosition)
        this.renderMeshVisual.mainMaterial.mainPass.radialGradientLength = diff.length
      }

      if (this._gradientType === "Linear") {
        this.renderMeshVisual.mainMaterial.mainPass.gradientType = 0
      } else if (this._gradientType === "Radial") {
        this.renderMeshVisual.mainMaterial.mainPass.gradientType = 1
      } else if (this._gradientType === "Rectangle") {
        this.renderMeshVisual.mainMaterial.mainPass.gradientType = 2
      }
      this.renderMeshVisual.mainMaterial.mainPass.gradientStartPosition = this._gradientStartPosition
    }

    this.renderMeshVisual.mainMaterial.mainPass.stops = stops
  }

  /**
   * internal function to update material based on border gradient params
   */
  private updateBorderGradient = () => {
    let stops = 0
    if (this._borderType === "Gradient" && this.border) {
      stops = 2

      this.renderMeshVisual.mainMaterial.mainPass["borderGradientColors[0]"] = this._borderGradientColor0
      this.renderMeshVisual.mainMaterial.mainPass["borderGradientPercents[0]"] = this._borderGradientPercent0
      this.renderMeshVisual.mainMaterial.mainPass["borderGradientColors[1]"] = this._borderGradientColor1
      this.renderMeshVisual.mainMaterial.mainPass["borderGradientPercents[1]"] = this._borderGradientPercent1
      if (this._borderGradientStop2) {
        stops = 3
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientColors[2]"] = this._borderGradientColor2
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientPercents[2]"] = this._borderGradientPercent2
      }
      if (this._borderGradientStop3) {
        stops = 4
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientColors[3]"] = this._borderGradientColor3
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientPercents[3]"] = this._borderGradientPercent3
      }
      if (this._borderGradientStop4) {
        stops = 5
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientColors[4]"] = this._borderGradientColor4
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientPercents[4]"] = this._borderGradientPercent4
      }
      if (this._borderGradientStop5) {
        stops = 6
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientColors[5]"] = this._borderGradientColor5
        this.renderMeshVisual.mainMaterial.mainPass["borderGradientPercents[5]"] = this._borderGradientPercent5
      }

      if (this._borderGradientType === "Linear") {
        const angle = Math.atan2(
          this._borderGradientEndPosition.y - this._borderGradientStartPosition.y,
          this._borderGradientEndPosition.x - this._borderGradientStartPosition.x
        )
        const linearGradientStart =
          this._borderGradientStartPosition.x * Math.cos(-angle) -
          this._borderGradientStartPosition.y * Math.sin(-angle)
        this.renderMeshVisual.mainMaterial.mainPass.borderLinearGradientStart = linearGradientStart
        const linearGradientEnd =
          this._borderGradientEndPosition.x * Math.cos(-angle) - this._borderGradientEndPosition.y * Math.sin(-angle)
        this.renderMeshVisual.mainMaterial.mainPass.borderLinearGradientEnd = linearGradientEnd
        this.renderMeshVisual.mainMaterial.mainPass.borderLinearGradientAngle = angle
        this.renderMeshVisual.mainMaterial.mainPass.borderLinearGradientLength = linearGradientEnd - linearGradientStart
      } else if (this._borderGradientType === "Radial") {
        const diff = this._borderGradientEndPosition.sub(this._borderGradientStartPosition)
        this.renderMeshVisual.mainMaterial.mainPass.borderRadialGradientLength = diff.length
      }

      if (this._borderGradientType === "Linear") {
        this.renderMeshVisual.mainMaterial.mainPass.borderGradientType = 0
      } else if (this._borderGradientType === "Radial") {
        this.renderMeshVisual.mainMaterial.mainPass.borderGradientType = 1
      } else if (this._borderGradientType === "Rectangle") {
        this.renderMeshVisual.mainMaterial.mainPass.borderGradientType = 2
      }
      this.renderMeshVisual.mainMaterial.mainPass.borderGradientStartPosition = this._borderGradientStartPosition
    }

    this.renderMeshVisual.mainMaterial.mainPass.borderGradientStops = stops
  }
}
