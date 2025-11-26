import {InteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import Event from "../../../Utils/Event"
import {createCallback} from "../../../Utils/InspectorCallbacks"
import NativeLogger from "../../../Utils/NativeLogger"
import {Interactable} from "../../Interaction/Interactable/Interactable"

const TAG = "PinchButton"

/**
 * This class provides basic pinch button functionality for the prefab pinch button. It is meant to be added to a Scene
 * Object with an Interactable component, with visual behavior configured in the Lens Studio scene.
 */
@component
export class PinchButton extends BaseScriptComponent {
  /**
   * Enable this to add functions from another script to this component's pinch callback events.
   */
  @input
  @hint("Enable this to add functions from another script to this component's pinch callback events.")
  editEventCallbacks: boolean = false
  @ui.group_start("On Button Pinched Callbacks")
  @showIf("editEventCallbacks")
  /**
   * The script containing functions to be called when button is pinched. Functions can accept an InteractorEvent
   * parameter (optional).
   */
  @input("Component.ScriptComponent")
  @hint(
    "The script containing functions to be called when button is pinched. Functions can accept an InteractorEvent \
parameter (optional)."
  )
  @allowUndefined
  private customFunctionForOnButtonPinched: ScriptComponent | undefined
  /**
   * The names for the functions on the provided script, to be called on button pinch. Functions can accept an
   * InteractorEvent parameter (optional).
   */
  @input
  @hint(
    "The names for the functions on the provided script, to be called on button pinch. Functions can accept an \
InteractorEvent parameter (optional)."
  )
  @allowUndefined
  private onButtonPinchedFunctionNames: string[] = []
  @ui.group_end
  private interactable: Interactable | null = null

  private onButtonPinchedEvent = new Event<InteractorEvent>()
  public readonly onButtonPinched = this.onButtonPinchedEvent.publicApi()

  // Native Logging
  private log = new NativeLogger(TAG)

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())

      if (!this.interactable) {
        throw new Error(
          "Pinch Button requires an Interactable Component on the same Scene object in order to work - please ensure one is added."
        )
      }
      this.interactable.onTriggerEnd.add((interactorEvent: InteractorEvent) => {
        if (this.enabled) {
          this.onButtonPinchedEvent.invoke(interactorEvent)
        }
      })
    })
    if (this.editEventCallbacks && this.customFunctionForOnButtonPinched) {
      this.onButtonPinched.add(
        createCallback<InteractorEvent>(this.customFunctionForOnButtonPinched, this.onButtonPinchedFunctionNames)
      )
    }
  }
}
