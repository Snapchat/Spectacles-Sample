import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"

/**
 * A simple button using SpectaclesInteractionKit events to signal user intent to delete the nearest widget.
 */
@component
export class DeleteButton extends BaseScriptComponent {
  private interactable: Interactable

  private onDeleteEvent: Event<void> = new Event<void>()
  readonly onDelete: PublicApi<void> = this.onDeleteEvent.publicApi()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    this.interactable = this.sceneObject.getComponent(Interactable.getTypeName())

    this.interactable.onTriggerEnd.add((event) => {
      this.onDeleteEvent.invoke()
    })
  }
}
