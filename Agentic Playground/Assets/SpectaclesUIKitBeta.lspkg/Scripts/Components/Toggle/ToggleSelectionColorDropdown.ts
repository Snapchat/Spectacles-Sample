import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {StateEvent} from "../../Utility/InteractableStateMachine"
import {Callback, createCallbacks} from "../../Utility/SceneUtilities"
import {ToggleRoundedRectangleVisual} from "../../Visuals/RoundedRectangle/ToggleRoundedRectangleVisual"
import {StateName} from "../Element"
import {VisualElement} from "../VisualElement"
import {Toggleable} from "./Toggleable"

const DEFAULT_SCALE_AMOUNT = new vec3(1.05, 1.05, 1.05)

/**
 * The `Toggle` class represents a toggle component in the Spectacles UI Kit.
 * It extends the `VisualElement` class and implements the `Toggleable` interface.
 * This class manages the toggle's state, emits events when the state changes,
 * and initializes a default visual if none is provided.
 *
 * @extends VisualElement
 * @implements Toggleable
 */
@component
export class ToggleSelectionColorDropdown extends VisualElement implements Toggleable {
  @input
  @hint("The default state of the Toggle")
  private _defaultToOn: boolean = false

  @input
  @hint("Enable this to add functions from another script to this component's callbacks")
  protected addCallbacks: boolean = false
  @input
  @showIf("addCallbacks")
  @label("On Value Changed Callbacks")
  private onValueChangedCallbacks: Callback[] = []
  @input
  @showIf("addCallbacks")
  @label("On Finished Callbacks")
  private onFinishedCallbacks: Callback[] = []

  @input
  @hint("Reference to the first text component")
  @allowUndefined
  public text1Component: Text = null

  @input
  @hint("Reference to the second text component")
  @allowUndefined
  public text2Component: Text = null

  private _isOn: boolean = this._defaultToOn
  private _state: StateName = StateName.default

  private onValueChangedEvent: Event<number> = new Event<number>()
  public readonly onValueChanged: PublicApi<number> = this.onValueChangedEvent.publicApi()
  private onFinishedEvent: Event<boolean> = new Event<boolean>()
  public readonly onFinished: PublicApi<boolean> = this.onFinishedEvent.publicApi()

  /**
   * Gets the current state of the toggle.
   *
   * @returns {boolean} - Returns `true` if the toggle is on, otherwise `false`.
   */
  get isOn(): boolean {
    return this._isOn
  }

  /**
   * Sets the state of the toggle.
   * If the new state is different from the current state, it updates the state,
   * triggers the updateCheck method, and invokes the onValueChangedEvent.
   *
   * @param on - A boolean indicating the new state of the toggle.
   */
  set isOn(on: boolean) {
    this.setOn(on, false)
    this.setState(this._state)
  }

  /**
   * Converts the current instance or data into a toggle representation.
   */
  convertToToggle(): void {}

  /**
   * Toggle on/off the toggle by setting its state and updating its colors and scale accordingly.
   *
   * @param on - A boolean value indicating the desired toggle state.
   */
  toggle(on: boolean): void {
    print("ToggleSelectionColorDropdown toggle called with: " + on)
    this.setOn(on, true)
    this.setState(this._state)
  }

  protected createDefaultVisual(): void {
    if (!this._visual) {
      const defaultVisual: ToggleRoundedRectangleVisual = new ToggleRoundedRectangleVisual(this.sceneObject)
      defaultVisual.shouldScale = false
      defaultVisual.hasBorder = true
      defaultVisual.isBorderGradient = true
      defaultVisual.borderSize = 0.1
      defaultVisual.isBaseGradient = true
      
      this._visual = defaultVisual
    }
  }

  protected setUpEventCallbacks(): void {
    if (this.addCallbacks) {
      this.onValueChanged.add(createCallbacks(this.onValueChangedCallbacks))
      this.onFinished.add(createCallbacks(this.onFinishedCallbacks))
      super.setUpEventCallbacks()
    }
  }

  /**
   * Updates the text content of this toggle's text components
   * @param text1 - Text for the first text component
   * @param text2 - Text for the second text component
   */
  updateText(text1?: string, text2?: string): void {
    print("updateText called with text1: " + text1 + ", text2: " + text2)

    if (text1 !== undefined) {
      print("Updating text1 to: " + text1)
      if (this.text1Component) {
        print("Found text1Component, current text: " + this.text1Component.text)
        this.text1Component.text = text1
        print("Updated text1Component to: " + this.text1Component.text)
      } else {
        print("text1Component is null - please assign it in the inspector")
      }
    }

    if (text2 !== undefined) {
      print("Updating text2 to: " + text2)
      if (this.text2Component) {
        print("Found text2Component, current text: " + this.text2Component.text)
        this.text2Component.text = text2
        print("Updated text2Component to: " + this.text2Component.text)
      } else {
        print("text2Component is null - please assign it in the inspector")
      }
    }
    
    print("updateText completed")
  }

  /**
   * Gets the text content from this toggle's text components
   * @returns Object containing text1 and text2 values
   */
  getTextContent(): { text1: string | null, text2: string | null } {
    print("getTextContent called")

    let text1: string | null = null
    let text2: string | null = null

    if (this.text1Component) {
      text1 = this.text1Component.text
      print("Got text1: " + text1)
    } else {
      print("text1Component is null")
    }

    if (this.text2Component) {
      text2 = this.text2Component.text
      print("Got text2: " + text2)
    } else {
      print("text2Component is null")
    }

    print("getTextContent returning: text1=" + text1 + ", text2=" + text2)
    return { text1, text2 }
  }

  protected onInteractableTriggered(stateEvent: StateEvent): void {
    print("ToggleSelectionColorDropdown onInteractableTriggered called")
    super.onInteractableTriggered(stateEvent)
    // For dropdown behavior, we always trigger the toggle regardless of current state
    this.toggle(true)
  }

  protected setState(stateName: StateName): void {
    this._state = stateName
    if (stateName === StateName.default) {
      this._visual?.setState(this.isOn ? StateName.toggledDefault : StateName.default)
      this.onStateChangedEvent.invoke(this.isOn ? StateName.toggledDefault : StateName.default)
    } else if (stateName === StateName.hover) {
      this._visual?.setState(this.isOn ? StateName.toggledHovered : StateName.hover)
      this.onStateChangedEvent.invoke(this.isOn ? StateName.toggledHovered : StateName.hover)
    } else {
      this._visual?.setState(stateName)
      this.onStateChangedEvent.invoke(stateName)
    }
  }

  private setOn(on: boolean, explicit: boolean): void {
    if (this._isOn === on) {
      print("ToggleSelectionColorDropdown setOn - no change needed, already: " + on)
      return
    }
    print("ToggleSelectionColorDropdown setOn - changing from " + this._isOn + " to " + on + ", explicit: " + explicit)
    this._isOn = on
    this.onValueChangedEvent.invoke(this._isOn ? 1 : 0)
    this.onFinishedEvent.invoke(explicit)
    print("ToggleSelectionColorDropdown setOn - events invoked")
  }
}
