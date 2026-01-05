@typedef
export class SoundEvent {
  @input public key: string
  @input public clip: AudioTrackAsset
  @input public vol: number
  @input public loop: boolean
}

@component
export class SoundController extends BaseScriptComponent {
  @input
  soundEvents: SoundEvent[]

  @input
  auds: AudioComponent[]

  private static instance: SoundController

  private constructor() {
    super()
  }

  public static getInstance(): SoundController {
    if (!SoundController.instance) {
      throw new Error("Trying to get SoundController instance, but it hasn't been set. You need to call it later.")
    }
    return SoundController.instance
  }

  onAwake() {
    if (!SoundController.instance) {
      SoundController.instance = this
    } else {
      throw new Error("SoundController already has an instance but another one is initializing. Aborting.")
    }
  }

  stopAllSounds() {
    this.auds.forEach((a) => {
      if (a.audioTrack && !isNull(a.audioTrack) && a.isPlaying()) {
        a.stop(false)
      }
    })
  }

  playSound(myKey: string) {
    for (let i = 0; i < this.soundEvents.length; i++) {
      if (this.soundEvents[i].key === myKey) {
        const myAud = this.getAud()
        if (myAud) {
          const evt = this.soundEvents[i]
          myAud.volume = evt.vol
          myAud.audioTrack = evt.clip
          myAud.position = 0
          const loopNum = evt.loop ? -1 : 1
          myAud.play(loopNum)
        }
      }
    }
  }

  private getAud() {
    // todo: pool prefabs in available and not avaliable arrays, spawn new if none available
    for (let i = 0; i < this.auds.length; i++) {
      if (!this.auds[i].isPlaying()) {
        return this.auds[i]
      }
    }
    return undefined
  }
}
