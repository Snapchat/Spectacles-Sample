import {LocatedObject} from "./LocatedObject"

/**
 * Plays an audio sound while at a location.
 */
@component
export class AudioLocatedObject extends BaseScriptComponent implements LocatedObject {
  @input audio: AudioComponent

  public activate(): void {
    this.audio.play(1)
  }

  public deactivate(): void {
    this.audio.stop(true)
  }

  public localize(): void {}
}
