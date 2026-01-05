import {LinearAlgebra} from "./Helpers/LinearAlgebra"
import {PathCollisionEvents} from "./PathCollisionEvents"
import {PathWalker} from "./PathWalker"
import {SoundController} from "./SoundController"
@component
export class LineController extends BaseScriptComponent {
  @input
  visualSo: SceneObject

  @input
  startVisual: SceneObject

  @input
  finishVisual: SceneObject

  @input
  countdownSo: SceneObject

  @input
  countdownSoArray: SceneObject[]

  @input
  countdownCollider: ColliderComponent

  @input
  camCol: ColliderComponent

  @input
  lapCounter3Dtext: Text3D

  @input
  realVisualsParent: SceneObject

  @input
  hintVisualsParent: SceneObject

  @input
  startLineTurnArrow: SceneObject

  @input
  finishLineTurnArrow: SceneObject

  @input
  hintStartVisual: SceneObject

  @input
  hintFinishVisual: SceneObject

  @input
  pathCollisionEvents: PathCollisionEvents

  @input
  pathWalker: PathWalker

  private enableWalkCountdown: boolean = false
  private lapCounterSo: SceneObject = null
  private visualTr: Transform = null

  private isStart: boolean | undefined
  private collisionStayRemover: EventRegistration | undefined

  init(beginsAsStartLine: boolean) {
    this.countdownSo.enabled = false
    this.collisionStayRemover = this.countdownCollider.onCollisionStay.add((e: CollisionStayEventArgs) =>
      this.onCollisionStay(e)
    )
    this.lapCounterSo = this.lapCounter3Dtext.getSceneObject()
    this.lapCounterSo.enabled = false

    this.isStart = beginsAsStartLine
    if (!beginsAsStartLine) {
      const pos = this.countdownCollider.getTransform().getLocalPosition()
      pos.z = -pos.z
      this.countdownCollider.getTransform().setLocalPosition(pos)
    }
    this.setVisual()
    this.visualTr = this.visualSo.getTransform()
    this.setHintVisual()

    this.pathCollisionEvents.init(
      this.isStart ? "start" : "finish",
      this.camCol.getSceneObject().getParent().getTransform(),
      this.camCol,
      this.pathWalker
    )
  }

  setHintVisual() {
    this.hintStartVisual.enabled = this.isStart
    this.hintFinishVisual.enabled = !this.isStart

    this.realVisualsParent.enabled = false
    this.hintVisualsParent.enabled = true
  }

  setRealVisual() {
    this.realVisualsParent.enabled = true
    this.hintVisualsParent.enabled = false
  }

  setEnableWalkCountdown() {
    this.enableWalkCountdown = true
  }

  private startCountDown() {
    const delay = 1
    for (let i = 0; i < this.countdownSoArray.length + 1; i++) {
      const evt = this.createEvent("DelayedCallbackEvent")
      evt.bind(() => {
        this.countdownSoArray.forEach((so) => {
          so.enabled = false
        })

        if (i == 0) {
          SoundController.getInstance().playSound("onCountdown")
        }

        if (i < this.countdownSoArray.length) {
          this.countdownSo.enabled = true
          this.countdownSoArray[i].enabled = true
        }

        if (i == this.countdownSoArray.length) {
          this.countdownSo.enabled = false
        }
      })
      evt.reset(delay * i)
    }

    // return delay
    return delay * (this.countdownSoArray.length + 1)
  }

  onStartSprint() {
    this.startLineTurnArrow.enabled = true
    this.finishLineTurnArrow.enabled = true
  }

  setVisual() {
    this.startVisual.enabled = this.isStart
    this.finishVisual.enabled = !this.isStart
  }

  onSprintStartAreaCollision() {
    this.enableWalkCountdown = false
    if (this.collisionStayRemover) {
      this.countdownCollider.onCollisionStay.remove(this.collisionStayRemover)
    }
    this.countdownCollider.enabled = false

    if (this.isStart) {
      this.startCountDown()
    }
  }

  onReverseSprintTrackVisuals() {
    this.isStart = !this.isStart
    this.setVisual()

    const rot = LinearAlgebra.flippedRot(this.visualTr.getWorldRotation(), this.visualTr.up)
    this.visualTr.setWorldRotation(rot)
  }

  // This is only called on the start visual
  onIncrementLoop(nextLapCount: number) {
    this.startVisual.enabled = false
    this.lapCounterSo.enabled = true
    this.lapCounter3Dtext.text = "LAP " + nextLapCount
  }

  onCollisionStay(e: CollisionEnterEventArgs) {
    if (this.enableWalkCountdown) {
      if (e.collision.collider.isSame(this.camCol)) {
        this.pathWalker.onSprintStartAreaCollision(!this.isStart)
        this.enableWalkCountdown = false
      }
    }
  }
}
