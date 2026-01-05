import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import type Tween from "LSTween.lspkg/TweenJS/Tween"
import {InteractableOutlineFeedback} from "SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableOutlineFeedback"
import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import {SyncTransform} from "SpectaclesSyncKit.lspkg/Components/SyncTransform"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"
import type {Controller} from "./Controller"

@component
export class Piece extends BaseScriptComponent {
  @input()
  showLogs: boolean

  @input()
  controller: Controller

  @input()
  manipulatable: InteractableManipulation

  @input()
  interactableOutlineFeedback: InteractableOutlineFeedback

  position: {layer: number; row: number; col: number}

  sceneObj: SceneObject
  syncEntity: SyncEntity
  isTurnFinished: boolean = false
  tween: Tween
  syncTransform: SyncTransform

  finishTurn() {
    if (!this.isTurnFinished) {
      if (this.tween && this.syncTransform.syncEntity.doIOwnStore()) {
        // stop tween and scale back to 1.0
        this.tween.stop()
        this.tween = LSTween.scaleToLocal(
          this.manipulatable.getSceneObject().getTransform(),
          new vec3(1.0, 1.0, 1.0),
          500
        )
        this.tween.start()
      }
      this.isTurnFinished = true
      // Can't move again after I placed my piece, piece goes dormant
      this.manipulatable.setCanTranslate(false)
      this.interactableOutlineFeedback.enabled = false
    }
  }

  smoothSnapToPosition(attachedPosition: vec3) {
    if (this.syncTransform.syncEntity.doIOwnStore()) {
      LSTween.moveToWorld(this.manipulatable.getSceneObject().getTransform(), attachedPosition, 500)
        .easing(Easing.Exponential.InOut)
        .start()
    }
  }

  onManipulationEnd() {
    this.controller.onPieceUpdated(this.sceneObj, this.finishTurn.bind(this))
  }

  playWinnerAnimation(delay: number) {
    this.tween = LSTween.scaleToLocal(this.manipulatable.getSceneObject().getTransform(), new vec3(1.5, 1.5, 1.5), 500)
      .delay(delay)
      .start()
  }

  onReady() {
    if (this.syncEntity.networkRoot.locallyCreated) {
      this.syncTransform.syncEntity.requestOwnership(
        () => {
          this.tween = LSTween.scaleFromToLocal(
            this.manipulatable.getSceneObject().getTransform(),
            new vec3(1.2, 1.2, 1.2),
            new vec3(1.0, 1.0, 1.0),
            750
          )
          // Piece belongs to me, I can move it
          this.manipulatable.setCanTranslate(true)
          this.tween.repeat(Infinity)
          this.tween.yoyo(true)
          // apparently this is a bug with LSTween, yoyo stutters when a delay hasn't been defined
          this.tween.delay(100)
          this.tween.start()
          this.manipulatable.onManipulationEnd.add(this.onManipulationEnd.bind(this))
        },
        (e) => {
          print(e)
        }
      )
    } else {
      // Piece belongs to other player, I can't move it
      this.manipulatable.setCanTranslate(false)
      this.interactableOutlineFeedback.enabled = false
    }
  }

  onAwake() {
    this.sceneObj = this.getSceneObject()

    // Get sync entity for SyncTransform script
    this.syncEntity = SyncEntity.getSyncEntityOnSceneObject(this.sceneObj)
    this.syncTransform = this.sceneObject.getComponent(SyncTransform.getTypeName())

    // Check sync entity is ready before using it
    this.syncTransform.syncEntity.notifyOnReady(() => this.onReady())
  }
}
