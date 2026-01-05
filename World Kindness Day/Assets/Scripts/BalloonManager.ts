import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import {KindnessCounter} from "./KindnessCounter"
import {PledgeReadInOrder} from "./PledgeReadInOrder"

@component
export class BalloonManager extends BaseScriptComponent {
  @input KindnessCounter: KindnessCounter

  @input balloons!: SceneObject[]

  @input endScreenBalloons: SceneObject

  @input PledgeReadInOrder: PledgeReadInOrder

  private selectedBalloon: SceneObject

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }

  private onStart() {
    const interactionManager = SIK.InteractionManager

    this.balloons.forEach((obj, i) => {
      if (!obj) return

      // Get the Interactable on this object
      let interactable = obj.getComponent(Interactable.getTypeName()) as unknown as Interactable
      if (!interactable) {
        interactable = interactionManager.getInteractableBySceneObject(obj) as Interactable
      }
      if (!interactable) {
        print(`[BalloonsManager] Balloon[${i}] "${obj.name}" has no Interactable + Collider.`)
        return
      }

      // When interaction ends mark the balloon and go to next step
      interactable.onInteractorTriggerEnd((_event: InteractorEvent) => {
        this.selectedBalloon = obj
        this.nextStep(obj)
        print(`[BalloonsManager] END ${obj.name}`)
      })
    })
  }

  // Animates the selected balloon upwards and notifies KindnessCounter that a pledge was made
  public changeTransform() {
    const startPosition = this.selectedBalloon.getTransform().getLocalPosition()
    const destinationPosition = new vec3(startPosition.x, 50, startPosition.z)
    LSTween.moveFromToLocal(this.selectedBalloon.getTransform(), startPosition, destinationPosition, 1500)
      .easing(Easing.Cubic.InOut)
      .delay(100) // There is a bug in TweenJS where the yoyo value will jump if no delay is set.
      .yoyo(false)
      .repeat(0)
      .start()

    this.KindnessCounter.onBalloonSelected()
  }

  // Hides all non-selected balloons and starts the pledge-reading flow
  private nextStep(selected) {
    this.delay(1, () => {
      this.balloons.forEach((obj) => {
        if (obj && obj !== selected) {
          obj.enabled = false
        }
      })
    })
    this.PledgeReadInOrder.init()
  }

  // Utility: run a callback after a specified delay in seconds
  private delay(seconds: number, callback: () => void) {
    const evt = this.createEvent("DelayedCallbackEvent")
    evt.bind(callback)
    evt.reset(seconds)
  }
}
