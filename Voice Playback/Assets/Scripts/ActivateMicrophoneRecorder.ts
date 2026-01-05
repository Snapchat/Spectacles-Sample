import {BaseButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton"
import {MicrophoneRecorder} from "./MicrophoneRecorder"

@component
export class ActivateMicrophoneRecorder extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder

  @input
  @allowUndefined
  button: BaseButton | undefined

  onAwake() {
    if (this.button) {
      this.button.onTriggerDown.add(() => {
        this.microphoneRecorder.recordMicrophoneAudio(true)
      })
      this.button.onTriggerUp.add(() => {
        this.microphoneRecorder.recordMicrophoneAudio(false)
      })
    }
  }
}
