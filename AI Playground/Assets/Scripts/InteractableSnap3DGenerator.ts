import { ASRQueryController } from "./ASRQueryController";
import { Snap3DInteractableFactory } from "./Snap3DInteractableFactory";

@component
export class InteractableImageGenerator extends BaseScriptComponent {
  @ui.separator
  @ui.label("Example of using generative 3D with Snap3D")
  @input
  snap3DFactory: Snap3DInteractableFactory;
  @ui.separator
  @input
  private asrQueryController: ASRQueryController;
  @input
  private targetPosition: SceneObject;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.asrQueryController.onQueryEvent.add((query) => {
        this.snap3DFactory.createInteractable3DObject(
          query,
          this.targetPosition.getTransform().getWorldPosition()
        );
      });
    });
  }
}
