@component
export class NewScript extends BaseScriptComponent {
  @input
  audio: AudioComponent;
  onAwake() {
    this.audio.play(1);
  }
}