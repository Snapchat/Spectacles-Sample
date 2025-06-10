import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { createCallback } from "SpectaclesInteractionKit.lspkg/Utils/InspectorCallbacks";

const TAG = "PinchDownButton";

@component
export class TouchDownButton extends BaseScriptComponent {
  @input
  @hint(
    "Enable this to add functions from another script to this component's callback events"
  )
  editEventCallbacks: boolean = false;
  @ui.group_start("On Button Pinched Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @allowUndefined
  private customFunctionForOnButtonPinchedDown: ScriptComponent | undefined;
  @input("Component.ScriptComponent")
  @allowUndefined
  private customFunctionForOnButtonPinchedUp: ScriptComponent | undefined;
  @input
  @allowUndefined
  private onButtonPinchedDownFunctionNames: string[] = [];
  @input
  @allowUndefined
  private onButtonPinchedUpFunctionNames: string[] = [];
  @ui.group_end
  private interactable: Interactable | null = null;

  private onButtonPinchedEventDown = new Event<InteractorEvent>();
  public readonly onButtonPinchedDown =
    this.onButtonPinchedEventDown.publicApi();
  private onButtonPinchedEventUp = new Event<InteractorEvent>();
  public readonly onButtonPinchedUp = this.onButtonPinchedEventUp.publicApi();

  // Native Logging
  private log = new NativeLogger(TAG);

  onAwake(): void {
    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    );

    this.createEvent("OnStartEvent").bind(() => {
      if (!this.interactable) {
        throw new Error(
          "Pinch Button requires an Interactable Component on the same Scene object in order to work - please ensure one is added."
        );
      }
      this.interactable.onTriggerStart.add(
        (interactorEvent: InteractorEvent) => {
          try {
            if (this.enabled) {
              this.onButtonPinchedEventDown.invoke(interactorEvent);
            }
          } catch (e) {
            this.log.e("Error invoking onButtonPinchedEvent!");
            print(e);
          }
        }
      );
      this.interactable.onTriggerEnd.add((interactorEvent: InteractorEvent) => {
        try {
          if (this.enabled) {
            this.onButtonPinchedEventUp.invoke(interactorEvent);
          }
        } catch (e) {
          this.log.e("Error invoking onButtonPinchedEvent!");
          print(e);
        }
      });
    });
    if (this.editEventCallbacks && this.customFunctionForOnButtonPinchedDown) {
      this.onButtonPinchedDown.add(
        createCallback<InteractorEvent>(
          this.customFunctionForOnButtonPinchedDown,
          this.onButtonPinchedDownFunctionNames
        )
      );
      if (this.editEventCallbacks && this.customFunctionForOnButtonPinchedUp) {
        this.onButtonPinchedUp.add(
          createCallback<InteractorEvent>(
            this.customFunctionForOnButtonPinchedUp,
            this.onButtonPinchedUpFunctionNames
          )
        );
      }
    }
  }
}
