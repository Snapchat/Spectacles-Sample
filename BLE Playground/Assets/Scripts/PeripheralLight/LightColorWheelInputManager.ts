import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import {unsubscribe} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {LightController} from "./LightController"

@component
export class LightColorWheelInputManager extends BaseScriptComponent {
  @input
  interactable: Interactable

  @input
  lightController: LightController

  private triggerUpdateRemover: unsubscribe

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }

  private onStart() {
    this.interactable.onTriggerStart.add(() => this.onTriggerStart())
    this.interactable.onTriggerEnd.add(() => this.onTriggerEnd())
    this.interactable.onTriggerCanceled(() => this.onTriggerCanceled())
  }

  private subscribe() {
    if (!this.triggerUpdateRemover) {
      this.triggerUpdateRemover = this.interactable.onTriggerUpdate.add((arg) => this.onTriggerUpdate(arg))
    }
  }

  private unsubscribe() {
    if (this.triggerUpdateRemover) {
      this.interactable.onTriggerUpdate.remove(this.triggerUpdateRemover)
      this.triggerUpdateRemover = undefined
    }
  }

  onTriggerStart() {
    this.subscribe()
  }

  onTriggerEnd() {
    this.unsubscribe()
  }

  onTriggerCanceled() {
    this.unsubscribe()
  }

  onTriggerUpdate(arg: InteractorEvent) {
    this.lightController.selectColorWheelWorldPos(arg.interactor.targetHitPosition)
  }
}
