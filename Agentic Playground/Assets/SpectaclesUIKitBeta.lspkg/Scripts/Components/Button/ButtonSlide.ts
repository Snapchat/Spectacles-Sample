import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {Callback, createCallbacks} from "../../Utility/SceneUtilities"
import {RoundedRectangleVisual} from "../../Visuals/RoundedRectangle/RoundedRectangleVisual"
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
export class ButtonSlide extends VisualElement {
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
      const defaultVisual: RoundedRectangleVisual = new RoundedRectangleVisual(this.sceneObject)
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
    const transform = this.sceneObject.getTransform()
    const currentScale = transform.getLocalScale()

    // Apply new scale based on size
    const newScale = new vec3(
      size.x / 25, // Normalize to base width of 25
      size.y / 5, // Normalize to base height of 5
      size.z / 3 // Normalize to base depth of 3
    )

    transform.setLocalScale(newScale)

    // Update visual if it exists
    if (this._visual && this._visual instanceof RoundedRectangleVisual) {
      const visual = this._visual as RoundedRectangleVisual
      // The visual will automatically adjust with the scale change
    }

    print("ButtonSlide: Applied dynamic size " + size.x + "x" + size.y + "x" + size.z + " to " + this.sceneObject.name)
  }

  /**
   * Get current card size
   * @returns Current size as vec3
   */
  public getCurrentSize(): vec3 {
    const transform = this.sceneObject.getTransform()
    const scale = transform.getLocalScale()

    // Convert scale back to size
    return new vec3(
      scale.x * 25, // Base width
      scale.y * 5, // Base height
      scale.z * 3 // Base depth
    )
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
