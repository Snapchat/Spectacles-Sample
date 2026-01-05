import {BaseButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton"
import {MicrophoneRecorder} from "./MicrophoneRecorder"

@component
export class PlaybackActivateMicrophoneRecorder extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder

  @input
  @allowUndefined
  button: BaseButton | undefined

  onAwake() {
    if (this.button) {
      this.button.onTriggerDown.add(() => {
        this.microphoneRecorder.playbackRecordedAudio()
      })
    }
  }
}
