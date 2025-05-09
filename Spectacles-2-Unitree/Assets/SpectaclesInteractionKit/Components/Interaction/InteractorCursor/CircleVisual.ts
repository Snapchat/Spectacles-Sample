import {HandType} from "../../../Providers/HandInputData/HandType"
import animate, {CancelSet} from "../../../Utils/animate"
import {validate} from "../../../Utils/validate"
import {Billboard} from "../Billboard/Billboard"
import {CursorMode} from "./InteractorCursor"

export type CircleVisualTextureConfig = {
  translate: Texture
  scaleTL: Texture
  scaleTR: Texture
  disabled: Texture
}

export type CircleVisualConfig = {
  meshSceneObject: SceneObject
  textures: CircleVisualTextureConfig
}

// To make the math of calculating angles easier to follow, the CursorMat graph uses -1 and 1 to represent the left/right hand.
const enum CursorMaterialHandType {
  Left = -1,
  NonHand = 0,
  Right = 1,
}

const OUTLINE_ANIMATE_DURATION = 0.1
const DEFAULT_RENDER_ORDER = 100

const DEFAULT_SCALE = new vec3(0.8, 0.8, 0.8)

/**
 * CircleVisual provides the circle visual of the cursor & controls the fade in/out animations.
 */
export class CircleVisual {
  private _outlineAlpha = 1.0
  private _isShown = false
  private _isTriggering = false
  private _outlineOffset = 0.0
  private _circleSquishScale = 1.0
  private showCancelSet = new CancelSet()
  private outlineAlphaCancelSet = new CancelSet()
  private outlineOffsetCancelSet = new CancelSet()

  private _cursorMode: CursorMode = CursorMode.Auto
  private _useTexture: boolean = false
  private _materialtexture: Texture | null = null
  private _customTexture: Texture | null = null

  private visual = this.sceneObject.getComponent("Component.RenderMeshVisual")

  private billboardComponent = this.sceneObject.createComponent(
    Billboard.getTypeName()
  )

  constructor(private config: CircleVisualConfig) {
    const cloneMaterial = this.visual.mainMaterial.clone()
    this.visual.mainMaterial = cloneMaterial
    this.renderOrder = DEFAULT_RENDER_ORDER
    this.sceneObject.enabled = false
    this.visual.getTransform().setWorldScale(DEFAULT_SCALE)

    this.configureBillboardComponent()
  }

  private configureBillboardComponent() {
    this.billboardComponent.xAxisEnabled = true
    this.billboardComponent.yAxisEnabled = true
    this.billboardComponent.zAxisEnabled = false
    this.billboardComponent.axisEasing = new vec3(1, 1, 1)
    this.billboardComponent.axisBufferDegrees = new vec3(0, 0, 0)
  }

  get sceneObject(): SceneObject {
    return this.config.meshSceneObject
  }

  set worldPosition(position: vec3) {
    this.sceneObject.getTransform().setWorldPosition(position)
  }

  get worldPosition(): vec3 {
    return this.sceneObject.getTransform().getWorldPosition()
  }

  /**
   * Sets whether or not the cursor itself should be shown, and fades it in/out accordingly.
   */
  set isShown(show: boolean) {
    if (show === this._isShown) {
      return
    }

    this.showCancelSet()
    const initialAlpha = this.visual.mainPass.maxAlpha as number
    if (show) {
      this.sceneObject.enabled = true
      animate({
        cancelSet: this.showCancelSet,
        duration: OUTLINE_ANIMATE_DURATION,
        update: (t: number) => {
          this.visual.mainPass.maxAlpha = MathUtils.lerp(initialAlpha, 1, t)
        },
      })
    } else {
      animate({
        cancelSet: this.showCancelSet,
        duration: OUTLINE_ANIMATE_DURATION,
        update: (t: number) => {
          this.visual.mainPass.maxAlpha = MathUtils.lerp(initialAlpha, 0, t)
        },
        ended: () => {
          this.sceneObject.enabled = false
        },
      })
    }
    this._isShown = show
  }

  /**
   * Sets whether or not the cursor itself should be shown.
   */
  get isShown(): boolean {
    return this._isShown
  }

  /**
   * Sets whether or not the cursor outline should be shown and fades the outline in/out accordingly.
   */
  set outlineAlpha(alpha: number) {
    if (alpha === this._outlineAlpha) {
      return
    }

    this.outlineAlphaCancelSet()
    const initialAlpha = this.visual.mainPass.outlineAlpha as number
    animate({
      cancelSet: this.outlineAlphaCancelSet,
      duration: OUTLINE_ANIMATE_DURATION,
      update: (t: number) => {
        this.visual.mainPass.outlineAlpha = MathUtils.lerp(
          initialAlpha,
          alpha,
          t
        )
      },
    })
    this._outlineAlpha = alpha
  }

  /**
   * Returns the current alpha of the outline.
   */
  get outlineAlpha(): number {
    return this._outlineAlpha
  }

  /**
   * Sets the offset to increase the outline radius (both inner and outer edges)
   * e.g. outlineOffset = 0.1 changes the outer/inner radii from default of (0.5,0.4) to (0.6,0.5)
   */
  set outlineOffset(offset: number) {
    if (offset === this._outlineOffset) {
      return
    }

    this.outlineOffsetCancelSet()
    const initialOffset = this.visual.mainPass.outlineOffset as number
    animate({
      cancelSet: this.outlineOffsetCancelSet,
      duration: OUTLINE_ANIMATE_DURATION,
      update: (t: number) => {
        this.visual.mainPass.outlineOffset = MathUtils.lerp(
          initialOffset,
          offset,
          t
        )
      },
    })

    this._outlineOffset = offset
  }

  /**
   * Returns the current outline offset.
   */
  get outlineOffset(): number {
    return this._outlineOffset
  }

  /**
   * Sets the squish scale of the inner circle
   */
  set circleSquishScale(scale: number) {
    if (scale === this._circleSquishScale) {
      return
    }

    this.visual.mainPass.circleSquishScale = scale
    this._circleSquishScale = scale
  }

  /**
   * Returns the current outline offset.
   */
  get circleSquishScale(): number {
    return this._circleSquishScale
  }

  /**
   * Sets if the cursor should reflect a triggered state.
   */
  set isTriggering(triggering: boolean) {
    if (triggering === this._isTriggering) {
      return
    }

    this.visual.mainPass.isTriggering = triggering

    this._isTriggering = triggering
  }

  /**
   * Returns if the cursor is in a triggered state.
   */
  get isTriggering(): boolean {
    return this._isTriggering
  }

  /**
   * Sets if the visual should use a texture instead of drawing onto the plane mesh.
   */
  set useTexture(useTexture: boolean) {
    if (useTexture === this._useTexture) {
      return
    }

    this.visual.mainPass.useTexture = useTexture

    this._useTexture = useTexture
  }

  /**
   * Returns if the visual should use a texture instead of drawing onto the plane mesh.
   */
  get useTexture(): boolean {
    return this._useTexture
  }

  /**
   * Sets the texture of the cursor material's mainPass to place onto the plane mesh.
   */
  set materialTexture(texture: Texture) {
    if (texture === this._materialtexture) {
      return
    }

    this.visual.mainPass.cursorTexture = texture

    this._materialtexture = texture
  }

  /**
   * Returns the texture to place onto the plane mesh.
   */
  get materialTexture(): Texture | null {
    return this._materialtexture
  }

  /**
   * Caches the custom texture to place onto the plane mesh when using {@link CursorMode}.Custom.
   */
  set customTexture(texture: Texture) {
    if (texture === this._customTexture) {
      return
    }

    if (this.cursorMode === CursorMode.Custom) {
      this.materialTexture = texture
    }

    this._customTexture = texture
  }

  /**
   * Returns the custom texture to place onto the plane mesh when using {@link CursorMode}.Custom.
   */
  get customTexture(): Texture | null {
    return this._customTexture
  }

  /**
   * Set the {@link CursorMode} of the cursor to change the visual
   * To return the cursor to its default {@link StateMachine} logic, use {@link CursorMode}.Auto
   * @param cursorMode - The new mode of the cursor visual
   */
  set cursorMode(cursorMode: CursorMode) {
    if (cursorMode === this.cursorMode) {
      return
    }

    this.useTexture = cursorMode !== CursorMode.Auto

    switch (cursorMode) {
      case CursorMode.Translate:
        this.materialTexture = this.config.textures.translate
        break
      case CursorMode.ScaleTopLeft:
        this.materialTexture = this.config.textures.scaleTL
        break
      case CursorMode.ScaleTopRight:
        this.materialTexture = this.config.textures.scaleTR
        break
      case CursorMode.Disabled:
        this.materialTexture = this.config.textures.disabled
        break
      case CursorMode.Custom:
        validate(this.customTexture)
        this.materialTexture = this.customTexture
        break

      default:
        break
    }

    this._cursorMode = cursorMode
  }

  /**
   * Returns the {@link Texture} of the cursor when using the {@link CursorMode}.Custom mode
   * @returns the custom texture (typically cached via requireAsset(.../assetName.png) as Texture) to use
   */
  get cursorMode(): CursorMode {
    return this._cursorMode
  }

  set renderOrder(renderOrder: number) {
    this.visual.setRenderOrder(renderOrder)
  }

  get renderOrder(): number {
    return this.visual.getRenderOrder()
  }

  /**
   * Set the 'handedness' of the cursor, e.g. left, right, or non-hand.
   */
  set handType(type: HandType | null) {
    let materialInput: number

    // The material graph uses -1,0,1 to differentiate the types.
    switch (type) {
      case "left":
        materialInput = CursorMaterialHandType.Left
        break
      case "right":
        materialInput = CursorMaterialHandType.Right
        break
      default:
        materialInput = CursorMaterialHandType.NonHand
    }

    this.visual.mainPass.handType = materialInput
  }

  /**
   * Get the 'handedness' of the cursor, e.g. left, right, or non-hand.
   * @returns -1 for Left, 0 for Non-Hand, 1 for Right
   */
  get handType(): HandType | null {
    switch (this.visual.mainPass.handType) {
      case -1:
        return "left"
      case 1:
        return "right"

      default:
        return null
    }
  }

  /**
   * Set if there are multiple Interactors active in the scene to enable the multi-Interactor look.
   */
  set multipleInteractorsActive(active: boolean) {
    this.visual.mainPass.multipleInteractorsActive = active
  }

  /**
   * Returns if there are multiple Interactors active in the scene to enable the multi-Interactor look.
   */
  get multipleInteractorsActive(): boolean {
    return this.visual.mainPass.multipleInteractorsActive
  }

  /**
   * Set the world scale of the cursor.
   */
  set worldScale(scale: vec3) {
    this.visual.getTransform().setWorldScale(scale)
  }

  /**
   * Returns the world scale of the cursor.
   */
  get worldScale(): vec3 {
    return this.visual.getTransform().getWorldScale()
  }
}
