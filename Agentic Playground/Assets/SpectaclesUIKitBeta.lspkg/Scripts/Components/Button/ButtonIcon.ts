import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {RoundedRectangleVisual} from "../../Visuals/RoundedRectangle/RoundedRectangleVisual"

import {Callback, createCallbacks} from "../../Utility/SceneUtilities"
import {StateEvent} from "../../Utility/InteractableStateMachine"
import {VisualElement} from "../VisualElement"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = new NativeLogger("Button")

/**
 * The `Button` class represents a button component in the Spectacles UI Kit.
 * It extends the `VisualElement` class and initializes a default visual if none is provided.
 *
 * @extends VisualElement
 */
@component
export class Button extends VisualElement {
  @input
  @hint("Enable this to add functions from another script to this component's callbacks")
  protected addCallbacks: boolean = false
  @input
  @showIf("addCallbacks")
  @label("On Trigger Up Callbacks")
  private triggerUpCallbacks: Callback[] = []
  @input
  @showIf("addCallbacks")
  @label("On Trigger Down Callbacks")
  private triggerDownCallbacks: Callback[] = []

  protected setUpEventCallbacks(): void {
    if (this.addCallbacks) {
      this.onTriggerUp.add(createCallbacks(this.triggerUpCallbacks))
      this.onTriggerDown.add(createCallbacks(this.triggerDownCallbacks))
      super.setUpEventCallbacks()
    }
  }

  protected createDefaultVisual(): void {
    if (!this._visual) {
      const defaultVisual: RoundedRectangleVisual = new RoundedRectangleVisual(this.sceneObject)
      defaultVisual.hasBorder = true
      defaultVisual.isBorderGradient = true
      defaultVisual.borderSize = 0.0
      defaultVisual.isBaseGradient = true
      this._visual = defaultVisual
    }
  }

  protected onInteractableHovered(stateEvent: StateEvent): void {
    const defaultVisual = this._visual as RoundedRectangleVisual
    if (defaultVisual) {
      defaultVisual.borderSize = 0.1
    }
    super.onInteractableHovered(stateEvent)
  }

  protected onInteractableDefault(stateEvent: StateEvent): void {
    const defaultVisual = this._visual as RoundedRectangleVisual
    if (defaultVisual) {
      defaultVisual.borderSize = 0.0
    }
    super.onInteractableDefault(stateEvent)
  }

  protected onInteractableToggledHovered(stateEvent: StateEvent): void {
    const defaultVisual = this._visual as RoundedRectangleVisual
    if (defaultVisual) {
      defaultVisual.borderSize = 0.1
    }
    super.onInteractableToggledHovered(stateEvent)
  }

  protected onInteractableToggledDefault(stateEvent: StateEvent): void {
    const defaultVisual = this._visual as RoundedRectangleVisual
    if (defaultVisual) {
      defaultVisual.borderSize = 0.0
    }
    super.onInteractableToggledDefault(stateEvent)
  }
}
