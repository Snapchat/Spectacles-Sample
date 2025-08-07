import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"

const HIGHLIGHT_MATERIAL_ASSET: Material = requireAsset("../../../Materials/SphereOutline.mat") as Material

const DEFAULT_FADE_DURATION: number = 0.2

/**
 * The `Sphere` class represents a 3D sphere component in the scene. It extends the `BaseScriptComponent`
 * and provides functionality for rendering, highlighting, and customizing the sphere's appearance.
 *
 * @decorator `@component`
 */
@component
export class Sphere extends BaseScriptComponent {
  @input
  @hint("Size of Sphere In Local Space Units")
  private _radius: number = 4

  @input("vec4", "{.8,.8,.8,1.}")
  @widget(new ColorWidget())
  private _backgroundColor: vec4

  @input
  @allowUndefined
  private _icon: Texture

  private _initialized: boolean = false

  private _transform: Transform = this.sceneObject.getTransform()

  private _mesh: RenderMesh = requireAsset("../../../Meshes/DefaultSphere.mesh") as RenderMesh
  private _material: Material = requireAsset("../../../Materials/DefaultSphereSimple.mat") as Material
  private _rmv =
    this.sceneObject.getComponent("RenderMeshVisual") || this.sceneObject.createComponent("RenderMeshVisual")

  private _targetHighlightMaterial: Material = HIGHLIGHT_MATERIAL_ASSET.clone()

  private _zBackScale: number = 1.0

  private _highlightVisible: boolean = false
  private _highlightTweenCancelSet: CancelSet = new CancelSet()
  private _highlightColorCancelSet: CancelSet = new CancelSet()

  /**
   * Gets the `RenderMeshVisual` instance associated with this sphere.
   *
   * @returns {RenderMeshVisual} The `RenderMeshVisual` instance.
   */
  get renderMeshVisual(): RenderMeshVisual {
    return this._rmv
  }

  /**
   * Gets the radius of the sphere.
   *
   * @returns {number} The radius of the sphere in local space units.
   */
  get radius(): number {
    return this._radius
  }

  /**
   * Sets the radius of the sphere by updating its transform's local scale.
   *
   * @param radius - A `number` object representing the new radius of the sphere
   */
  set radius(radius: number) {
    this._radius = radius
    const localScale = vec3.one().uniformScale(radius)
    this._transform.setLocalScale(localScale)
    this._targetHighlightMaterial.mainPass.size = new vec3(localScale.x * 0.25, localScale.y * 0.25, 0)
    if (this.renderMeshVisual.mainMaterial) {
      this.renderMeshVisual.mainMaterial.mainPass.frustumCullMin = localScale.uniformScale(-0.5)
      this.renderMeshVisual.mainMaterial.mainPass.frustumCullMax = localScale.uniformScale(0.5)
    }
  }

  /**
   * Gets the scale factor for the back of the sphere along the Z-axis.
   *
   * @returns {number} The scale factor for the back of the sphere.
   */
  get zBackScale(): number {
    return this._zBackScale
  }

  /**
   * Sets the scale factor for the back of the sphere along the Z-axis.
   *
   * @param zBackScale - A number representing the scale factor for the back of the sphere.
   *                     A value closer to 0.0 makes the back of the sphere flatter,
   *                     while a value closer to 1.0 retains its original shape.
   */
  set zBackScale(zBackScale: number) {
    this._zBackScale = zBackScale
    this._rmv.setBlendShapeWeight("Z depth", 1.0 - zBackScale)
  }

  /**
   * Gets the background color of the sphere.
   *
   * @returns {vec4} The current background color as a vec4.
   */
  get backgroundColor(): vec4 {
    return this._backgroundColor
  }

  /**
   * Sets the background color of the sphere.
   *
   * @param value - A `vec4` representing the RGBA color to set as the background color.
   */
  set backgroundColor(value: vec4) {
    this._backgroundColor = value
    this._material.mainPass.baseColor = value
  }

  /**
   * Gets the icon texture of the sphere.
   *
   * @returns {Texture} The icon texture of the sphere, or undefined if there is none.
   */
  get icon(): Texture | undefined {
    return this._icon
  }

  /**
   * Sets the icon texture of the sphere.
   *
   * @param icon - The icon texture to set.
   */
  set icon(icon: Texture | undefined) {
    this._icon = icon
    if (icon) {
      this._material.mainPass.hasIcon = 1
      this._material.mainPass.icon = icon
    } else {
      this._material.mainPass.hasIcon = 0
    }
  }

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  /**
   * Initializes the sphere component. This method sets up the mesh, material, size, and background color
   * for the sphere. It ensures that the initialization process is only performed once.
   */
  initialize(): void {
    if (this._initialized) {
      return
    }

    // setup mesh
    this._rmv.mesh = this._mesh
    this._material = this._material.clone()
    this._rmv.mainMaterial = this._material
    this._rmv.mainMaterial.mainPass.frustumCullMode = FrustumCullMode.UserDefinedAABB

    this.radius = this._radius
    this.backgroundColor = this._backgroundColor
  }

  /**
   * Enables or disables the highlight effect on the sphere.
   *
   * @param enableHighlight - A boolean indicating whether to show or hide the highlight.
   */
  enableHighlight = (enableHighlight: boolean) => {
    if (this._targetHighlightMaterial) {
      if (enableHighlight && !this._highlightVisible) {
        this._rmv.addMaterial(this._targetHighlightMaterial)
        this._targetHighlightMaterial.mainPass.outlineSize = 0
        this.tweenHighlightSize(1)
        this._highlightVisible = true
      } else if (!enableHighlight && this._highlightVisible) {
        this.tweenHighlightSize(0).then(() => {
          this.resetTargetMaterials()
          this._highlightVisible = false
        })
      }
    }
  }

  /**
   * Updates the highlight color of the sphere.
   *
   * @param highlightColor - A `vec4` representing the new highlight color.
   */
  updateHighlightColor(highlightColor: vec4) {
    this._highlightColorCancelSet.cancel()
    animate({
      duration: DEFAULT_FADE_DURATION,
      cancelSet: this._highlightColorCancelSet,
      update: (t) => {
        this._targetHighlightMaterial.mainPass.baseColor = vec4.lerp(
          this._targetHighlightMaterial.mainPass.baseColor,
          highlightColor,
          t
        )
      }
    })
  }

  private tweenHighlightSize = (size: number): Promise<void> => {
    if (this._targetHighlightMaterial) {
      const startSize = this._targetHighlightMaterial.mainPass.outlineSize

      const done = new Promise<void>((resolve, reject) => {
        this._highlightTweenCancelSet.cancel()
        animate({
          duration: DEFAULT_FADE_DURATION,
          cancelSet: this._highlightTweenCancelSet,
          update: (t) => {
            this._targetHighlightMaterial.mainPass.outlineSize = MathUtils.lerp(startSize, size, t)
          },
          ended: () => {
            resolve()
          },
          cancelled: () => {
            reject()
          }
        })
      })

      return done
    }
  }

  private resetTargetMaterials() {
    this._rmv.clearMaterials()
    this._rmv.addMaterial(this._material)
  }
}
