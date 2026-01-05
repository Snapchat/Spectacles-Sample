import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {Callback, createCallbacks} from "../../Utility/SceneUtilities"
import {RoundedRectangleVisualCardSummary} from "../../Visuals/RoundedRectangle/RoundedRectangleVisualCardSummary"
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
export class ButtonSlideSummary extends VisualElement {
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

  @input
  textIndex: Text = null

  @input
  textTitle: Text = null

  @input
  textContent: Text = null

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
      const defaultVisual: RoundedRectangleVisualCardSummary = new RoundedRectangleVisualCardSummary(this.sceneObject)
      defaultVisual.hasBorder = true
      defaultVisual.isBorderGradient = true
      defaultVisual.borderSize = 0.1
      defaultVisual.isBaseGradient = true
      this._visual = defaultVisual
    }
  }

  /**
   * Apply dynamic size to the card based on text content
   * @param size The target size (width, height, depth)
   */
  public applyDynamicSize(size: vec3): void {
    // Ensure visual is created before setting size
    if (!this._visual) {
      this.createDefaultVisual()
    }

    // Use the visual element's size property instead of transform scaling
    if (this._visual) {
      this.size = size
      print(
        "ButtonSlideCardBot: Applied dynamic size " +
          size.x +
          "x" +
          size.y +
          "x" +
          size.z +
          " to " +
          this.sceneObject.name
      )
    } else {
      print("ButtonSlideCardBot: Could not apply size - visual not initialized for " + this.sceneObject.name)
    }
  }

  /**
   * Get current card size
   * @returns Current size as vec3
   */
  public getCurrentSize(): vec3 {
    // Ensure visual is created before getting size
    if (!this._visual) {
      this.createDefaultVisual()
    }

    // Return the visual element's size property or default size
    return this._visual ? this.size : new vec3(25, 5, 3)
  }

  /**
   * Set text content and apply word wrapping if needed
   * @param content The text content to set
   */
  public setTextContent(content: string): void {
    if (this.textContent) {
      this.textContent.text = content

      // Apply text wrapping for longer content
      // This depends on the text component configuration
      print("ButtonSlide: Set text content (" + content.length + " chars) on " + this.sceneObject.name)
    }
  }

  /**
   * Set text index for card identification
   * @param index The index to display
   */
  public setTextIndex(index: number): void {
    if (this.textIndex) {
      this.textIndex.text = index.toString()
    }
  }
}
