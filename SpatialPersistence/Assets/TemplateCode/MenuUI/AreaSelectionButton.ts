import { Interactable } from "SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable";
import { SIK } from "SpectaclesInteractionKit/SIK";
import Event, { PublicApi } from "SpectaclesInteractionKit/Utils/Event";

/**
 * A simple button using SpectaclesInteractionKit events to signal user intent to select a certain area and load serialized content.
 */
@component
export class AreaSelectionButton extends BaseScriptComponent {
  @input
  private textComponent: Text;
  @input
  buttonMesh: RenderMeshVisual;

  private interactable: Interactable;

  private onSelectEvent: Event<void> = new Event<void>();
  readonly onSelect: PublicApi<void> = this.onSelectEvent.publicApi();

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    this.interactable = this.sceneObject.getComponent(
      SIK.InteractionConfiguration.requireType("Interactable")
    ) as Interactable;

    this.interactable.onTriggerEnd.add((event) => {
      this.onSelectEvent.invoke();
    });
  }

  /**
   * Set the name of the associated area for this button.
   */
  public set text(text: string) {
    this.textComponent.text = text;
  }

  /**
   * Get the name of the associated area for this button.
   */
  public get text(): string {
    return this.textComponent.text;
  }
}