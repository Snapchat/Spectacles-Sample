import {DynamicAudioOutput} from "RemoteServiceGateway.lspkg/Helpers/DynamicAudioOutput"
@component
export class MusicPlayer extends BaseScriptComponent {
  @input private _dynamicAudioOutput: DynamicAudioOutput
  @input private _audioComponent: AudioComponent
  private _onFinishCallback: () => void
  private _wasPlaying: boolean = false
  private _updateEvent: SceneEvent

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this._dynamicAudioOutput.initialize(48000)
      // Set up finish callback on AudioComponent if provided
      if (this._audioComponent) {
        this._audioComponent.setOnFinish((audioComponent: AudioComponent) => {
          if (this._onFinishCallback) {
            this._onFinishCallback()
          }
        })
      }
      // Set up update event to check if audio finished
      this._updateEvent = this.createEvent("UpdateEvent")
      this._updateEvent.bind(() => this._checkAudioFinished())
    })
  }

  setOnFinish(callback: () => void) {
    this._onFinishCallback = callback
  }

  playAudio(uint8Array: Uint8Array) {
    print("Playing audio")
    this._dynamicAudioOutput.interruptAudioOutput()
    this._dynamicAudioOutput.addAudioFrame(uint8Array, 2)
    this._wasPlaying = true
  }

  pauseAudio() {
    print("Pausing audio")
    this._dynamicAudioOutput.interruptAudioOutput()
    this._wasPlaying = false
  }

  private _checkAudioFinished() {
    // Check if audio was playing but AudioComponent stopped
    if (this._wasPlaying && this._audioComponent) {
      if (!this._audioComponent.isPlaying()) {
        // Audio finished playing
        if (this._onFinishCallback) {
          this._onFinishCallback()
        }
        this._wasPlaying = false
      }
    }
  }
}
