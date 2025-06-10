import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event"

/**
 * A simple button using SpectaclesInteractionKit events to signal user intent to open the area selection menu.
 */
@component
export class AreaPromptButton extends BaseScriptComponent {
  private interactable: Interactable

  private onPromptEvent: Event<void> = new Event<void>()
  readonly onPrompt: PublicApi<void> = this.onPromptEvent.publicApi()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    )

    this.interactable.onTriggerEnd.add((event) => {
      this.onPromptEvent.invoke()
    })
  }
}
