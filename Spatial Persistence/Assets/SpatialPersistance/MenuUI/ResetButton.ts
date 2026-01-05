import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"

/**
 * A simple button using SpectaclesInteractionKit events to signal user intent to reset the entire area to an empty state.
 */
@component
export class ResetButton extends BaseScriptComponent {
  private interactable: Interactable

  private onResetEvent: Event<void> = new Event<void>()
  readonly onReset: PublicApi<void> = this.onResetEvent.publicApi()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    this.interactable = this.sceneObject.getComponent(Interactable.getTypeName())

    this.interactable.onTriggerEnd.add((event) => {
      this.onResetEvent.invoke()
    })
  }
}
