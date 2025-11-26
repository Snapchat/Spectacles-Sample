import animate, {CancelSet} from "../../Utils/animate"

import {lerp} from "../../Utils/mathUtils"
import {validate} from "../../Utils/validate"
import {Interactable} from "../Interaction/Interactable/Interactable"
import {ScrollBar} from "../UI/ScrollBar/ScrollBar"

const BLENDSHAPE_NAME: string = "Size"
const SCALE_TWEEN_DURATION: number = 0.2
const HOVER_SCALE: number = 0.75

/**
 * This class provides visual feedback for a scrollbar by adjusting its size and scale based on interaction events such
 * as hover. It uses animation utilities to smoothly transition between states.
 */
@component
export class ScrollBarFeedback extends BaseScriptComponent {
  /**
   * Reference to the SceneObject containing the ScrollBar and Interactable components. This object will be monitored
   * for interaction events to provide visual feedback on the scrollbar indicator.
   */
  @input
  @hint(
    "Reference to the SceneObject containing the ScrollBar and Interactable components. This object will be monitored \
for interaction events to provide visual feedback on the scrollbar indicator."
  )
  scrollbarObject!: SceneObject

  private renderMeshVisual: RenderMeshVisual | undefined
  private size: number = 0

  private interactable: Interactable | null = null
  private scrollbar: ScrollBar | null = null
  private isHovering: boolean = false

  private scaleCancel = new CancelSet()

  onAwake(): void {
    this.init()
  }

  private init = (): void => {
    this.interactable = this.scrollbarObject.getComponent(Interactable.getTypeName())
    if (isNull(this.interactable)) {
      throw new Error("Interactable component not found in this entity!")
    }

    this.scrollbar = this.scrollbarObject.getComponent(ScrollBar.getTypeName())
    if (isNull(this.scrollbar)) {
      throw new Error("ScrollBar component not found in this entity!")
    }

    this.renderMeshVisual = this.getSceneObject().getComponent("Component.RenderMeshVisual")
    if (this.renderMeshVisual === undefined) {
      throw new Error("RenderMeshVisual component not found in this entity!")
    }

    this.size = this.renderMeshVisual.getBlendShapeWeight(BLENDSHAPE_NAME)
    this.renderMeshVisual.mainPass.size = this.size

    this.createEvent("OnStartEvent").bind(this.setupInteractableCallbacks)
  }

  private setupInteractableCallbacks = () => {
    validate(this.interactable)
    this.interactable.onHoverEnter.add(this.initializeHoverState)
    this.interactable.onHoverExit.add(this.resetHoverState)
    this.interactable.onTriggerStart.add(this.initializeTriggerState)
    this.interactable.onTriggerEnd.add(this.resetTriggerState)
    this.interactable.onTriggerEndOutside.add(this.resetHoverState)
    this.interactable.onTriggerCanceled.add(this.resetHoverState)
    this.interactable.onTriggerUpdate.add(this.onTriggerUpdate)

    this.interactable.onSyncHoverEnter.add(this.initializeHoverState)
    this.interactable.onSyncHoverExit.add(this.resetHoverState)
    this.interactable.onSyncTriggerStart.add(this.initializeTriggerState)
    this.interactable.onSyncTriggerEnd.add(this.resetTriggerState)
    this.interactable.onSyncTriggerEndOutside.add(this.resetHoverState)
    this.interactable.onSyncTriggerCanceled.add(this.resetHoverState)
    this.interactable.onSyncTriggerUpdate.add(this.onTriggerUpdate)
  }

  private initializeHoverState = (): void => {
    if (this.renderMeshVisual !== undefined) {
      this.renderMeshVisual.mainPass.status = 1.0
      this.renderMeshVisual.mainPass.scale = HOVER_SCALE
      this.renderMeshVisual.mainPass.offset = this.getPercentage()
      this.isHovering = true
    }
  }

  private resetHoverState = (): void => {
    if (this.renderMeshVisual !== undefined) {
      this.renderMeshVisual.mainPass.status = 0.0
      this.renderMeshVisual.mainPass.scale = 0.0
      this.isHovering = false
    }
  }

  private initializeTriggerState = (): void => {
    if (this.renderMeshVisual !== undefined) {
      this.renderMeshVisual.mainPass.offset = this.getPercentage()
      this.tweenScale(0.75, 1.0)
    }
  }

  private resetTriggerState = (): void => {
    if (this.renderMeshVisual !== undefined) {
      this.renderMeshVisual.mainPass.gradientScale = 0.03
      this.tweenScale(1.0, 0.75)
    }
  }

  private onTriggerUpdate = (): void => {
    if (this.renderMeshVisual !== undefined) {
      this.renderMeshVisual.mainPass.offset = this.getPercentage()
    }
  }

  private tweenScale = (currentScale: number, targetScale: number, endCallback = () => {}): void => {
    if (this.scaleCancel) this.scaleCancel.cancel()
    animate({
      duration: SCALE_TWEEN_DURATION * Math.abs(targetScale - currentScale),
      update: (t: number) => {
        if (this.renderMeshVisual !== undefined) {
          this.renderMeshVisual.mainPass.scale = lerp(currentScale, targetScale, t)
        }
      },
      ended: endCallback,
      cancelSet: this.scaleCancel
    })
  }

  getPercentage = (): number => {
    validate(this.scrollbar)
    return MathUtils.remap(this.scrollbar.scrollPercentage, 0.0, 1.0, 0.03, 0.97)
  }
}
