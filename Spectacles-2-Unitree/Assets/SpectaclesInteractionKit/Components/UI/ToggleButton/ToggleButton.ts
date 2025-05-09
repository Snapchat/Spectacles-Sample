import {createCallback} from "../../../Utils/InspectorCallbacks"
import ReplayEvent from "../../../Utils/ReplayEvent"
import {Interactable} from "../../Interaction/Interactable/Interactable"

/**
 * This class provides basic toggle functionality for a prefab toggle button. It manages the toggle state and provides methods to handle toggle events and update the button's visual state.
 */
@component
export class ToggleButton extends BaseScriptComponent {
  @input("SceneObject")
  @hint("The icon to be shown when the button is toggled on")
  @allowUndefined
  _onIcon: SceneObject | undefined
  @input("SceneObject")
  @hint("The icon to be shown when the button is toggled off")
  @allowUndefined
  _offIcon: SceneObject | undefined
  @input
  @hint(
    "The initial state of the button, set to true if toggled on upon lens launch."
  )
  private _isToggledOn: boolean = false
  @input
  @hint(
    "Enable this to add functions from another script to this component's callback events"
  )
  editEventCallbacks: boolean = false
  @ui.group_start("On State Changed Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on toggle state change")
  @allowUndefined
  private customFunctionForOnStateChanged: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called on toggle state change"
  )
  @allowUndefined
  private onStateChangedFunctionNames: string[] = []
  @ui.group_end
  private interactable: Interactable | null = null

  private onStateChangedEvent = new ReplayEvent<boolean>()
  public readonly onStateChanged = this.onStateChangedEvent.publicApi()

  onAwake() {
    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    )

    this.createEvent("OnStartEvent").bind(() => {
      if (!this.interactable) {
        throw new Error(
          "Toggle Button requires an Interactable Component on the same Scene object in order to work - please ensure one is added."
        )
      }
      this.interactable.onTriggerEnd.add(() => {
        if (this.enabled) {
          this.toggleState()
        }
      })

      this.onStateChangedEvent.invoke(this._isToggledOn)
    })

    if (this.editEventCallbacks && this.customFunctionForOnStateChanged) {
      this.onStateChanged.add(
        createCallback<boolean>(
          this.customFunctionForOnStateChanged,
          this.onStateChangedFunctionNames
        )
      )
    }

    this.refreshVisual()
  }

  /**
   * Toggles the state of the button
   */
  toggle(): void {
    this.toggleState()
  }

  /**
   * @returns the icon to be shown when the button is toggled on
   */
  get onIcon(): SceneObject | null {
    return this._onIcon ?? null
  }

  /**
   * @param iconObject - the icon to be shown when the button is toggled on
   */
  set onIcon(iconObject: SceneObject) {
    this._onIcon = iconObject
    this.refreshVisual()
  }

  /**
   * @returns the icon to be shown when the button is toggled off
   */
  get offIcon(): SceneObject | null {
    return this._offIcon ?? null
  }

  /**
   * @param iconObject - the icon to be shown when the button is toggled off
   */
  set offIcon(iconObject: SceneObject) {
    this._offIcon = iconObject
    this.refreshVisual()
  }

  /**
   * @returns the current toggle state of the button
   */
  get isToggledOn(): boolean {
    return this._isToggledOn
  }

  /**
   * @param toggleOn - the new state of the button, invoking the toggle event if different than current state.
   */
  set isToggledOn(toggleOn: boolean) {
    // Return if the requested state is the same as the current state (no change)
    if (toggleOn === this._isToggledOn) {
      return
    }
    this.toggleState()
  }

  private refreshVisual() {
    if (this._onIcon !== undefined) {
      this._onIcon.enabled = this._isToggledOn
    }

    if (this._offIcon !== undefined) {
      this._offIcon.enabled = !this._isToggledOn
    }
  }

  private toggleState() {
    this._isToggledOn = !this._isToggledOn
    this.refreshVisual()
    this.onStateChangedEvent.invoke(this._isToggledOn)
  }
}
