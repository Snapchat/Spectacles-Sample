import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { SnapToWorld } from "./SnapToWorld";

@component
export class SnapToWorldInit extends BaseScriptComponent {
  @input private previewInWorld: SceneObject;
  @input private voiceMLModule: WorldQueryModule;
  @input private snappingToggle: ToggleButton;

  private snapToWorld: SnapToWorld;

  onAwake() {
    this.snapToWorld = SnapToWorld.getInstance();
    this.snapToWorld.init(this.voiceMLModule, this.previewInWorld);

    this.createEvent("OnStartEvent").bind(() => {
      this.snappingToggle.onStateChanged.add((isOn) =>
        this.handleToggleStateChanged(isOn)
      );
    });

    this.createEvent("UpdateEvent").bind(() => {
      this.snapToWorld.tick();
    });
  }

  private handleToggleStateChanged(isToggledOn: boolean) {
    this.snapToWorld.isOn = isToggledOn;
  }
}
