import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"

const HIGHLIGHT_MATERIAL_ASSET: Material = requireAsset("../../../Materials/CapsuleOutline.mat") as Material

const DEFAULT_FADE_DURATION: number = 0.2

/**
 * The `Capsule` class represents a 3D capsule component in the scene. It extends the `BaseScriptComponent`
 * and provides functionality for rendering, highlighting, and customizing the capsule's appearance.
 *
 * @decorator `@component`
 */
@component
export class Capsule extends BaseScriptComponent {
  @input("vec2", "{1,1}")
  @hint("Size of Capsule In Local Space Centimeters")
  private _size: vec2

  @input
  @hint("Depth of Capsule In Local Space Centimeters")
  private _depth: number = 1

  @input("vec4", "{.8,.8,.8,1.}")
  @widget(new ColorWidget())
  private _backgroundColor: vec4

  private _initialized: boolean = false

  private _mesh: RenderMesh = requireAsset("../../../Meshes/DefaultCapsule.mesh") as RenderMesh
  private _material: Material = requireAsset("../../..//Materials/DefaultCapsule.mat") as Material
  private _rmv =
    this.sceneObject.getComponent("RenderMeshVisual") || this.sceneObject.createComponent("RenderMeshVisual")

  private _targetHighlightMaterial: Material = HIGHLIGHT_MATERIAL_ASSET.clone()

  private _highlightVisible: boolean = false
  private _highlightTweenCancelSet: CancelSet = new CancelSet()
  private _highlightColorCancelSet: CancelSet = new CancelSet()

  /**
   * Gets the `RenderMeshVisual` instance associated with this capsule.
   *
   * @returns {RenderMeshVisual} The `RenderMeshVisual` instance.
   */
  get renderMeshVisual(): RenderMeshVisual {
    return this._rmv
  }

  /**
   * Sets the depth of the capsule and updates its local scale accordingly.
   *
   * @param value - The new depth value to set for the capsule.
   */
  set depth(value: number) {
    this._depth = value
    const scaleVec = new vec3(this._size.x, this._size.y, this._depth)
    this._material.mainPass.size = scaleVec
  }

  /**
   * get the depth of the capsule and updates its local scale accordingly.
   *
   * @returns value - The new depth value to set for the capsule.
   */
  get depth() {
    return this._depth
  }

  /**
   * Gets the size of the capsule as a 2D vector.
   *
   * @returns {vec2} The size of the capsule.
   */
  get size(): vec2 {
    return this._size
  }

  /**
   * Sets the size of the capsule by updating its width and height.
   * Adjusts the local scale of the capsule's transform to reflect the new size.
   *
   * @param value - A `vec2` object representing the new size of the capsule,
   *                where `x` is the width and `y` is the height.
   */
  set size(value: vec2) {
    this._size = value
    const scaleVec = new vec3(this._size.x, this._size.y, this._depth)
    this._material.mainPass.size = scaleVec
    this._targetHighlightMaterial.mainPass.size = scaleVec
    if (this.renderMeshVisual.mainMaterial) {
      this.renderMeshVisual.mainMaterial.mainPass.frustumCullMin = scaleVec.add(new vec3(1, 0, 0)).uniformScale(-0.5)
      this.renderMeshVisual.mainMaterial.mainPass.frustumCullMax = scaleVec.add(new vec3(1, 0, 0)).uniformScale(0.5)
    }
  }

  /**
   * Gets the background color of the capsule.
   *
   * @returns {vec4} The current background color as a vec4.
   */
  get backgroundColor(): vec4 {
    return this._backgroundColor
  }

  /**
   * Sets the background color of the capsule.
   *
   * @param value - A `vec4` representing the RGBA color to set as the background color.
   */
  set backgroundColor(value: vec4) {
    this._backgroundColor = value
    this._material.mainPass.baseColor = value
  }

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  /**
   * Initializes the capsule component. This method sets up the mesh, material, size, and background color
   * for the capsule. It ensures that the initialization process is only performed once.
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

    this.size = this._size
    this.backgroundColor = this._backgroundColor
  }

  /**
   * Enables or disables the highlight effect on the capsule.
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
   * Updates the highlight color of the capsule.
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
