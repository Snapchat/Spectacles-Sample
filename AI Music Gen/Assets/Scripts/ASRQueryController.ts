import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {RoundButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RoundButton"

@component
export class ASRQueryController extends BaseScriptComponent {
  @input
  private button: RoundButton
  @input
  private activityRenderMesh: RenderMeshVisual
  private activityMaterial: Material

  private asrModule: AsrModule = require("LensStudio:AsrModule")
  private isRecording: boolean = false

  public onQueryEvent: Event<string> = new Event<string>()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.init.bind(this))
  }

  private init() {
    this.activityMaterial = this.activityRenderMesh.mainMaterial.clone()
    this.activityRenderMesh.clearMaterials()
    this.activityRenderMesh.mainMaterial = this.activityMaterial
    this.activityMaterial.mainPass.in_out = 0
    this.button.onInitialized.add(() => {
      this.button.onTriggerUp.add(() => {
        this.getVoiceQuery().then((query) => {
          this.onQueryEvent.invoke(query)
        })
      })
    })
  }

  public getVoiceQuery(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isRecording) {
        this.animateVoiceIndicator(false)
        this.asrModule.stopTranscribing()
        this.isRecording = false
        reject("Already recording, cancel recording")
        return
      }
      this.isRecording = true
      const asrSettings = AsrModule.AsrTranscriptionOptions.create()
      asrSettings.mode = AsrModule.AsrMode.HighAccuracy
      asrSettings.silenceUntilTerminationMs = 1500
      asrSettings.onTranscriptionUpdateEvent.add((asrOutput) => {
        if (asrOutput.isFinal) {
          this.isRecording = false
          this.animateVoiceIndicator(false)
          this.asrModule.stopTranscribing()
          resolve(asrOutput.text)
        }
      })
      asrSettings.onTranscriptionErrorEvent.add((asrOutput) => {
        this.isRecording = false
        this.animateVoiceIndicator(false)
        reject(asrOutput)
      })
      this.animateVoiceIndicator(true)
      this.asrModule.startTranscribing(asrSettings)
    })
  }

  private animateVoiceIndicator(on: boolean) {
    if (on) {
      animate({
        duration: 0.25,
        update: (t: number) => {
          this.activityMaterial.mainPass.in_out = t
        }
      })
    } else {
      animate({
        duration: 0.25,
        update: (t: number) => {
          this.activityMaterial.mainPass.in_out = 1 - t
        }
      })
    }
  }
}
