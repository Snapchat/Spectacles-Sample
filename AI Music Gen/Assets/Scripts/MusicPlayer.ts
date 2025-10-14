import { DynamicAudioOutput } from "RemoteServiceGateway.lspkg/Helpers/DynamicAudioOutput";
@component
export class MusicPlayer extends BaseScriptComponent {
  @input private _dynamicAudioOutput: DynamicAudioOutput;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this._dynamicAudioOutput.initialize(48000);
    });
  }

  playAudio(uint8Array: Uint8Array) {
    print("Playing audio");
    this._dynamicAudioOutput.interruptAudioOutput();
    this._dynamicAudioOutput.addAudioFrame(uint8Array, 2);
  }
}
