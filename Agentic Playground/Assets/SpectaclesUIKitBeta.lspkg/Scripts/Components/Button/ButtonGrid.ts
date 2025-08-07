import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {RoundedRectangleVisual} from "../../Visuals/RoundedRectangle/RoundedRectangleVisual"
import {Callback, createCallbacks} from "../../Utility/SceneUtilities"
import {VisualElement} from "../VisualElement"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = new NativeLogger("Button")

/**
 * The `Button` class represents a button component in the Spectacles UI Kit.
 * It extends the `VisualElement` class and initializes a default visual if none is provided.
 * This version is designed to work with InteractableManipulation for grid rearrangement.
 *
 * @extends VisualElement
 */
@component
export class ButtonGrid extends VisualElement {
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
    // Always call parent to set up base trigger events
    super.setUpEventCallbacks()
    
    // Add additional callbacks if enabled
    if (this.addCallbacks) {
      this.onTriggerUp.add(createCallbacks(this.triggerUpCallbacks))
      this.onTriggerDown.add(createCallbacks(this.triggerDownCallbacks))
    }
  }

  protected createDefaultVisual(): void {
    if (!this._visual) {
      const defaultVisual: RoundedRectangleVisual = new RoundedRectangleVisual(this.sceneObject)
      defaultVisual.hasBorder = true
      defaultVisual.isBorderGradient = true
      defaultVisual.borderSize = 0.1
      defaultVisual.isBaseGradient = true
      this._visual = defaultVisual
    }
  }
}
