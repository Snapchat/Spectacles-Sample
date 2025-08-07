import animate, {AnimationManager, CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"
import {GradientParameters, RoundedRectangle} from "./Visuals/RoundedRectangle/RoundedRectangle"

const TOOLTIP_FADE_DURATION = 0.333
const TOOLTIP_PADDING = new vec2(0.66, 0.25)
const TOOLTIP_BACKING_GRADIENT: GradientParameters = {
  enabled: true,
  type: "Rectangle",
  stop0: {enabled: true, percent: -1, color: new vec4(0.15, 0.15, 0.15, 1)},
  stop1: {enabled: true, percent: 1, color: new vec4(0.24, 0.24, 0.24, 1)}
}

const TOOLTIP_BORDER_GRADIENT: GradientParameters = {
  enabled: true,
  type: "Linear",
  start: new vec2(1, 1),
  end: new vec2(-1, -1),
  stop0: {enabled: true, percent: -1, color: new vec4(0.05, 0.05, 0.05, 1)},
  stop1: {enabled: true, percent: 1, color: new vec4(0.4, 0.4, 0.4, 1)}
}

const TEXT_COLOR = new vec4(0.72, 0.72, 0.72, 1)

@component
export class Tooltip extends BaseScriptComponent {
  @input
  private _tip: string = "Helpful Hint"

  private backing: RoundedRectangle
  private textComponent: Text

  private fadeCancelSet: CancelSet

  private _size: vec2 = vec2.zero()

  /**
   * The current tooltip text.
   * @returns The tooltip string associated with this instance.
   */
  public get tip(): string {
    return this._tip
  }

  /**
   * The current tooltip text.
   * @param value - The new tooltip text to display.
   */
  public set tip(value: string) {
    this._tip = value
    if (this.textComponent) {
      this.textComponent.text = this._tip
      this.updateBackingSize()
    }
  }

  /**
   * Sets the tooltip's visibility state.
   *
   * @param isOn - If `true`, the tooltip will be shown; if `false`, it will be hidden.
   *
   * This method fades the tooltip's alpha to 1 (visible) or 0 (hidden) depending on the `isOn` parameter,
   * provided that both `backing` and `textComponent` are present.
   */
  public setOn(isOn: boolean) {
    if (this.backing && this.textComponent) {
      this.fadeAlpha(isOn ? 1 : 0, () => {})
    }
  }

  onAwake() {
    this.backing = this.sceneObject.createComponent(RoundedRectangle.getTypeName())
    this.backing.initialize()
    this.backing.gradient = true
    this.backing.setBackgroundGradient(TOOLTIP_BACKING_GRADIENT)
    this.backing.border = true
    this.backing.setBorderGradient(TOOLTIP_BORDER_GRADIENT)
    this.backing.borderSize = 0.05
    this.backing.renderMeshVisual.mainPass.blendMode = BlendMode.Normal
    this.backing.renderMeshVisual.mainMaterial.mainPass.depthTest = false
    //this.backing.renderMeshVisual.renderOrder = 1000
    const textObject = global.scene.createSceneObject("TooltipText")
    textObject.createComponent("Component.ScreenTransform")
    this.textComponent = textObject.createComponent("Component.Text")
    this.textComponent.textFill.color = TEXT_COLOR
    //this.textComponent.renderOrder = 1001
    textObject.setParent(this.sceneObject)

    const textExtentsObject = global.scene.createSceneObject("TooltipTextExtents")
    const textExtentsScreenTransform = textExtentsObject.createComponent("Component.ScreenTransform")
    textExtentsObject.setParent(textObject)

    this.textComponent.extentsTarget = textExtentsScreenTransform

    this.createEvent("OnStartEvent").bind(() => {
      this.textComponent.text = this._tip
      this.backing.renderMeshVisual.mainPass.opacityFactor = 0
      this.textComponent.textFill.color = withAlpha(this.textComponent.textFill.color, 0)
      this.updateBackingSize()
    })
  }

  private updateBackingSize(onComplete?: () => void) {
    if (this.textComponent.extentsTarget && this.backing) {
      AnimationManager.getInstance().requestAnimationFrame(() => {
        AnimationManager.getInstance().requestAnimationFrame(() => {
          const left = this.textComponent.extentsTarget.localPointToWorldPoint(new vec2(-1, 0))
          const right = this.textComponent.extentsTarget.localPointToWorldPoint(new vec2(1, 0))
          const top = this.textComponent.extentsTarget.localPointToWorldPoint(new vec2(0, 1))
          const bottom = this.textComponent.extentsTarget.localPointToWorldPoint(new vec2(0, -1))
          const width = left.distance(right)
          const height = top.distance(bottom)
          this._size = new vec2(width + TOOLTIP_PADDING.x * 2, height + TOOLTIP_PADDING.y * 2)
          this.backing.size = this._size
          this.backing.cornerRadius = 0.5
          if (onComplete) {
            onComplete()
          }
        })
      })
    }
  }

  private fadeAlpha = (alpha: number, onComplete: () => void = () => {}) => {
    const startingOpacity = this.backing.renderMeshVisual.mainPass.opacityFactor
    const startingTextColor = this.textComponent.textFill.color
    if (this.fadeCancelSet) {
      this.fadeCancelSet.cancel()
    }
    animate({
      duration: TOOLTIP_FADE_DURATION,
      cancelSet: this.fadeCancelSet,
      update: (t) => {
        this.backing.renderMeshVisual.mainPass.opacityFactor = MathUtils.lerp(startingOpacity, alpha, t)
        this.textComponent.textFill.color = vec4.lerp(startingTextColor, withAlpha(startingTextColor, alpha), t)
      },
      ended: () => {
        // complete
        onComplete()
      }
    })
  }
}
