import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";

export enum RecoverState {
  Recover,
  Save,
}

export type RecoverEvent = {
  state: RecoverState;
};

@component
export class RecoverWidgetButton extends BaseScriptComponent {
  private interactable: Interactable;

  @input
  private text: Text;

  private _recoverState: RecoverState;

  private onRecoverEvent: Event<RecoverEvent> = new Event<RecoverEvent>();
  readonly onRecover: PublicApi<RecoverEvent> = this.onRecoverEvent.publicApi();

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    this.interactable.onTriggerEnd.add(() => {
      this.onRecoverEvent.invoke({ state: this.recoverState });
    });

    this.recoverState = RecoverState.Recover;
  }

  set recoverState(state: RecoverState) {
    this._recoverState = state;
    this.text.text = state === RecoverState.Recover ? "Recover" : "Save";
  }

  get recoverState(): RecoverState {
    return this._recoverState;
  }
}
