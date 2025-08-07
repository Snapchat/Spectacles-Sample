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
export class ToggleSelectionColor extends VisualElement implements Toggleable {
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

  protected onInteractableTriggered(stateEvent: StateEvent): void {
    super.onInteractableTriggered(stateEvent)
    this.toggle(!this.isOn)
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
      return
    }
    this._isOn = on
    this.onValueChangedEvent.invoke(this._isOn ? 1 : 0)
    this.onFinishedEvent.invoke(explicit)
  }
}
