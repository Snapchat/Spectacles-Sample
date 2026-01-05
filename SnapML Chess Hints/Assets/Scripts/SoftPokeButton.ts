import {InteractableAudioFeedback} from "SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableAudioFeedback"
import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"

@component
export class SoftPokeButton extends BaseScriptComponent {
  @input activationDepth: number = -3.0
  private didFullPoke = false
  private isPoking = false
  private maxZ: number = 1.0
  private targetZ: number = 0
  private currentJoint = null
  private isEditor = global.deviceInfoSystem.isEditor()

  public onPoke: () => void = () => {}

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  onStart() {
    const interactable = this.getSceneObject().getComponent(Interactable.getTypeName()) as Interactable

    if (this.isEditor) {
      interactable.onInteractorTriggerEnd(() => {
        this.onPoke()
      })
    } else {
      interactable.enabled = false
    }
  }

  getPokePosition() {
    const lh = SIK.HandInputData.getHand("left")
    const rh = SIK.HandInputData.getHand("right")

    const transform = this.getSceneObject().getTransform().getInvertedWorldTransform()

    if (this.currentJoint != null) {
      return [this.currentJoint, transform.multiplyPoint(this.currentJoint.position)]
    }

    const joints = [
      lh.indexTip,
      rh.indexTip,
      lh.indexDistal,
      rh.indexDistal,
      lh.middleTip,
      rh.middleTip,
      lh.middleDistal,
      rh.middleDistal
    ]
    let minLength = Number.MAX_VALUE
    let minPos = vec3.zero()
    let minJoint = null
    for (const joint of joints) {
      if (joint.position != null) {
        const transformedPos = transform.multiplyPoint(joint.position)
        if (transformedPos.length < minLength) {
          minLength = transformedPos.length
          minPos = transformedPos
          minJoint = joint
        }
      }
    }

    return [minJoint, minPos]
  }

  onUpdate() {
    const [joint, pos] = this.getPokePosition()

    const audioFeedback = this.getSceneObject().getComponent(
      InteractableAudioFeedback.getTypeName()
    ) as InteractableAudioFeedback

    const xDist = Math.abs(pos.x)
    const yDist = Math.abs(pos.y)
    const frame = this.getSceneObject().getChild(0).getChild(1)
    const sideScale = frame.getTransform().getLocalScale().uniformScale(0.75)
    if (xDist < sideScale.x && yDist < sideScale.y && pos.z < this.maxZ && (this.isPoking || pos.z > 0.0)) {
      if (!this.isPoking) {
        this.currentJoint = joint
        audioFeedback.hoverAudioComponent.play(1)
      }
      this.isPoking = true
      this.targetZ = Math.min(Math.max(pos.z, this.activationDepth), 0.0)
    } else {
      this.isPoking = false
      this.targetZ = 0
      this.didFullPoke = false
      this.currentJoint = null
    }

    if (this.isPoking) {
      if (this.targetZ <= this.activationDepth) {
        if (!this.didFullPoke) {
          this.didFullPoke = true
          audioFeedback.triggerEndAudioComponent.play(1)
          this.onPoke()
        }
      }
    }
    const transform = this.getSceneObject().getChild(0).getTransform()
    const currentPosition = transform.getLocalPosition()
    const newPosition = vec3.lerp(currentPosition, new vec3(0, 0, this.targetZ), 0.5)
    transform.setLocalPosition(newPosition)
  }
}
