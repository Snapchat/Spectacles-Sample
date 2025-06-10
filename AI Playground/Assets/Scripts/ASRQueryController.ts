import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import Tween from "LSTween.lspkg/TweenJS/Tween";
import { LSTween } from "LSTween.lspkg/LSTween";

@component
export class ASRQueryController extends BaseScriptComponent {
  @input
  private button: PinchButton;
  @input
  private activityRenderMesh: RenderMeshVisual;
  private activityMaterial: Material;

  private asrModule: AsrModule = require("LensStudio:AsrModule");
  private isRecording: boolean = false;

  public onQueryEvent: Event<string> = new Event<string>();

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.init.bind(this));
  }

  private init() {
    this.activityMaterial = this.activityRenderMesh.mainMaterial.clone();
    this.activityRenderMesh.clearMaterials();
    this.activityRenderMesh.mainMaterial = this.activityMaterial;
    this.activityMaterial.mainPass.in_out = 0;
    this.button.onButtonPinched.add(() => {
      this.getVoiceQuery().then((query) => {
        this.onQueryEvent.invoke(query);
      });
    });
  }

  public getVoiceQuery(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isRecording) {
        this.animateVoiceIndicator(false);
        this.asrModule.stopTranscribing();
        this.isRecording = false;
        reject("Already recording, cancel recording");
        return;
      }
      this.isRecording = true;
      let asrSettings = AsrModule.AsrTranscriptionOptions.create();
      asrSettings.mode = AsrModule.AsrMode.HighAccuracy;
      asrSettings.silenceUntilTerminationMs = 1500;
      asrSettings.onTranscriptionUpdateEvent.add((asrOutput) => {
        if (asrOutput.isFinal) {
          this.isRecording = false;
          this.animateVoiceIndicator(false);
          this.asrModule.stopTranscribing();
          resolve(asrOutput.text);
        }
      });
      asrSettings.onTranscriptionErrorEvent.add((asrOutput) => {
        this.isRecording = false;
        this.animateVoiceIndicator(false);
        reject(asrOutput);
      });
      this.animateVoiceIndicator(true);
      this.asrModule.startTranscribing(asrSettings);
    });
  }

  private animateVoiceIndicator(on: boolean) {
    if (on) {
      LSTween.rawTween(250)
        .onUpdate((data) => {
          let percent = data.t as number;
          this.activityMaterial.mainPass.in_out = percent;
        })
        .start();
    } else {
      LSTween.rawTween(250)
        .onUpdate((data) => {
          let percent = 1 - (data.t as number);
          this.activityMaterial.mainPass.in_out = percent;
        })
        .start();
    }
  }
}
