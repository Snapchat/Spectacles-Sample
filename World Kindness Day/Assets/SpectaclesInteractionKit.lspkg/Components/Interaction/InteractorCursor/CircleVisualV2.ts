import {HandType} from "../../../Providers/HandInputData/HandType"
import {LensConfig} from "../../../Utils/LensConfig"
import {SpringAnimate1D, step1DInstantDrop} from "../../../Utils/springAnimate"
import {DispatchedUpdateEvent} from "../../../Utils/UpdateDispatcher"
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
  eventLabel?: string
}

export type CircleVisualMaterialParameters = {
  maxAlpha: number
  outlineAlpha: number
  outlineOffset: number
  circleSquishScale: number
  isTriggering: boolean
  useTexture: boolean
  cursorTexture: Texture
  handType: CursorMaterialHandType
  multipleInteractorsActive: boolean
}

// To make the math of calculating angles easier to follow, the CursorMat graph uses -1 and 1 to represent the left/right hand.
const enum CursorMaterialHandType {
  Left = -1,
  NonHand = 0,
  Right = 1
}

const DEFAULT_RENDER_ORDER = 100

const DEFAULT_SCALE = new vec3(0.8, 0.8, 0.8)
const EPSILON = 1e-4

/**
 * CircleVisual provides the circle visual of the cursor & controls the fade in/out animations.
 */
export class CircleVisual {
  private _isShown = false
  private _isTriggering = false
  private _circleSquishScale = 1.0

  private _cursorMode: CursorMode = CursorMode.Auto
  private _useTexture: boolean = false
  private _materialtexture: Texture | null = null
  private _customTexture: Texture | null = null

  private outlineAlphaSpring = SpringAnimate1D.smooth(0.2)
  private currentOutlineAlpha = 1.0
  private targetOutlineAlpha = 1.0
  private renderedOutlineAlpha = 1.0

  private outlineOffsetSpring = SpringAnimate1D.smooth(0.2)
  private currentOutlineOffset = 0.0
  private targetOutlineOffset = 0.0
  private renderedOutlineOffset = 0.0

  private alphaSpring = SpringAnimate1D.snappy(0.25)
  private currentOverallAlpha = 0.0
  private targetOverallAlpha = 0.0
  private renderedOverallAlpha = -1.0

  private visual = this.sceneObject.getComponent("Component.RenderMeshVisual")

  private billboardComponent = this.sceneObject.createComponent(Billboard.getTypeName())

  private updateEvent?: DispatchedUpdateEvent

  constructor(private config: CircleVisualConfig) {
    const cloneMaterial = this.visual.mainMaterial.clone()
    this.visual.mainMaterial = cloneMaterial
    this.renderOrder = DEFAULT_RENDER_ORDER
    this.sceneObject.enabled = false
    this.visual.getTransform().setWorldScale(DEFAULT_SCALE)

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

  onStart(): void {
    const dispatcher = LensConfig.getInstance().updateDispatcher
    const nameSuffix = this.config.eventLabel ?? this.sceneObject.name
    const eventName = `CircleVisualUpdate_${nameSuffix}`
    this.updateEvent = dispatcher.createUpdateEvent(eventName, () => this.onUpdate())
    this.updateEvent.enabled = false
  }

  /**
   * Enable or disable the internal UpdateDispatcher event.
   */
  enableUpdateEvent(enabled: boolean): void {
    if (this.updateEvent) {
      this.updateEvent.enabled = enabled
    }
  }

  /**
   * Dispose the internal UpdateDispatcher event.
   */
  destroy(): void {
    if (this.updateEvent) {
      LensConfig.getInstance().updateDispatcher.removeEvent(this.updateEvent)
      this.updateEvent = undefined
    }
  }

  onUpdate() {
    const newAlpha = this.outlineAlphaSpring.evaluate(this.currentOutlineAlpha, this.targetOutlineAlpha)
    this.currentOutlineAlpha = newAlpha

    const alphaChanged = Math.abs(this.currentOutlineAlpha - this.renderedOutlineAlpha) > EPSILON

    if (alphaChanged) {
      this.visual.mainPass.outlineAlpha = this.currentOutlineAlpha
      this.renderedOutlineAlpha = this.currentOutlineAlpha
    }

    const newOffset = this.outlineOffsetSpring.evaluate(this.currentOutlineOffset, this.targetOutlineOffset)
    this.currentOutlineOffset = newOffset

    const offsetChanged = Math.abs(this.currentOutlineOffset - this.renderedOutlineOffset) > EPSILON

    if (offsetChanged) {
      this.visual.mainPass.outlineOffset = this.currentOutlineOffset
      this.renderedOutlineOffset = this.currentOutlineOffset
    }

    const newOverallAlpha = step1DInstantDrop(this.currentOverallAlpha, this.targetOverallAlpha, this.alphaSpring)
    this.currentOverallAlpha = newOverallAlpha

    const overallChanged = Math.abs(this.currentOverallAlpha - this.renderedOverallAlpha) > EPSILON

    if (overallChanged) {
      this.visual.mainPass.masterAlpha = this.currentOverallAlpha
      this.renderedOverallAlpha = this.currentOverallAlpha

      const isVisible = this.currentOverallAlpha > 0.01
      if (this._isShown !== isVisible) {
        this.sceneObject.enabled = isVisible
        this._isShown = isVisible
      }
    }
  }

  /**
   * Sets whether or not the cursor itself should be shown, and fades it in/out accordingly.
   */
  set isShown(show: boolean) {
    this.targetOverallAlpha = show ? 1.0 : 0.0
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
    this.targetOutlineAlpha = alpha
  }

  /**
   * Returns the current alpha of the outline.
   */
  get outlineAlpha(): number {
    return this.targetOutlineAlpha
  }

  /**
   * Sets the overall opacity of the entire cursor
   */
  set overallOpacity(opacity: number) {
    this.targetOverallAlpha = opacity
  }

  /**
   * Returns the current overall opacity of the cursor
   */
  get overallOpacity(): number {
    return this.targetOverallAlpha
  }

  /**
   * Sets the offset to increase the outline radius (both inner and outer edges) e.g. outlineOffset = 0.1 changes the
   * outer/inner radii from default of (0.5,0.4) to (0.6,0.5)
   */
  set outlineOffset(offset: number) {
    this.targetOutlineOffset = offset
  }

  /**
   * Returns the current outline offset.
   */
  get outlineOffset(): number {
    return this.targetOutlineOffset
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

  /**
   * Returns the material parameters of the cursor.
   */
  get materialParameters(): CircleVisualMaterialParameters {
    return {
      maxAlpha: this.visual.mainPass.maxAlpha,
      outlineAlpha: this.visual.mainPass.outlineAlpha,
      outlineOffset: this.visual.mainPass.outlineOffset,
      circleSquishScale: this.visual.mainPass.circleSquishScale,
      isTriggering: this.visual.mainPass.isTriggering,
      useTexture: this.visual.mainPass.useTexture,
      cursorTexture: this.visual.mainPass.cursorTexture,
      handType: this.visual.mainPass.handType,
      multipleInteractorsActive: this.visual.mainPass.multipleInteractorsActive
    }
  }
}
