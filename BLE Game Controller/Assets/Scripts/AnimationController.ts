import {CharacterController} from "SpecsCharacterController.lspkg/Character Controller/Character Controller"

@component
export class AnimationController extends BaseScriptComponent {
  @input kick: AnimationAsset
  @input punch: AnimationAsset
  @input jump: AnimationAsset
  @input walk: AnimationAsset
  @input run: AnimationAsset
  @input idle: AnimationAsset
  @input characterController: CharacterController

  private animationPlayer: AnimationPlayer

  private idleClip: AnimationClip = null
  private jumpClip: AnimationClip = null
  private kickClip: AnimationClip = null
  private punchClip: AnimationClip = null
  private walkClip: AnimationClip = null
  private runClip: AnimationClip = null

  private clips: AnimationClip[] = []

  private currClip: AnimationClip = null

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  private onStart() {
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
    this.animationPlayer = this.getSceneObject().createComponent("AnimationPlayer")
    this.createAllAnimationClips()
    // set idle clip as the default animation
    this.currClip = this.idleClip
  }

  playJumpAnimation() {
    this.playSingleAnimation(this.jumpClip)
  }

  playKickAnimation() {
    this.playSingleAnimation(this.kickClip)
  }

  playPunchAnimation() {
    this.playSingleAnimation(this.punchClip)
  }

  private playSingleAnimation(clip: AnimationClip) {
    if (this.animationPlayer != null) {
      print("Playing: " + clip.name)
      this.setNewClip(clip)
      this.animationPlayer.playClip(clip.name)
    }
  }

  private createAllAnimationClips() {
    //looping animations
    this.idleClip = this.createLoopedClip("Idle", this.idle)
    this.walkClip = this.createLoopedClip("Walk", this.walk)
    this.runClip = this.createLoopedClip("Run", this.run)
    //one shot animations
    this.jumpClip = this.createSingleClip("Jump", this.jump)
    this.kickClip = this.createSingleClip("Kick", this.kick)
    this.punchClip = this.createSingleClip("Punch", this.punch)
  }

  private createLoopedClip(name: string, animAsset: AnimationAsset): AnimationClip {
    const clip = AnimationClip.createFromAnimation(name, animAsset)
    clip.weight = 0
    this.animationPlayer.addClip(clip)
    this.animationPlayer.playClip(clip.name)
    this.clips.push(clip)
    return clip
  }

  private createSingleClip(name: string, animAsset: AnimationAsset): AnimationClip {
    const clip = AnimationClip.createFromAnimation(name, animAsset)
    clip.playbackMode = PlaybackMode.Single
    this.animationPlayer.addClip(clip)
    this.clips.push(clip)
    return clip
  }

  private setNewClip(clip: AnimationClip) {
    this.currClip = clip
  }

  private blendClips() {
    for (const clip of this.clips) {
      const weight = clip.name != this.currClip.name ? 0 : 1
      clip.weight = MathUtils.lerp(clip.weight, weight, getDeltaTime() * 7)
    }
    //MAKE SURE IDLE IS ALWAYS WEIGHT 1
    this.idleClip.weight = 1
  }

  private isClipAlmostDone(clip: AnimationClip): boolean {
    return this.animationPlayer.getClipCurrentTime(clip.name) > clip.duration - 0.4
  }

  private onUpdate() {
    this.blendClips()

    //return to idle after single clip is done
    if (this.currClip.playbackMode === PlaybackMode.Single) {
      //block movement unless jumping
      if (this.currClip.name != this.jumpClip.name) {
        this.characterController.stopMovement()
      }
      if (this.isClipAlmostDone(this.currClip)) {
        this.setNewClip(this.idleClip)
      }
      return
    }

    const maxSpeed = this.characterController.getMoveSpeed()
    const currSpeed = this.characterController.getVelocity().length
    //check for idle
    if (currSpeed < 5) {
      this.setNewClip(this.idleClip)
    }
    //check for walk
    if (currSpeed > 5 && currSpeed < maxSpeed / 2) {
      this.setNewClip(this.walkClip)
    }
    //check for run
    if (currSpeed > maxSpeed / 2 && this.runClip.weight < 0.5) {
      this.setNewClip(this.runClip)
    }
  }
}
