import {InteractorEvent} from "../../Core/Interactor/InteractorEvent"
import {validate} from "../../Utils/validate"
import {Interactable} from "../Interaction/Interactable/Interactable"

/**
 * This class provides visual feedback by squishing a specified SceneObject when it is hovered or triggered. It allows
 * customization of the squish amount along the x-axis and y-axis.
 */
@component
export class InteractableSquishFeedback extends BaseScriptComponent {
  /**
   * This is the SceneObject that will be squished on hover/trigger.
   */
  @input
  @hint("This is the SceneObject that will be squished on hover/trigger.")
  squishObject!: SceneObject
  /**
   * This is how much the squishObject will squish along the y-axis.
   */
  @input
  @hint("This is how much the squishObject will squish along the y-axis.")
  @widget(new SliderWidget(0, 1, 0.01))
  verticalSquish: number = 0.5
  /**
   * This is how much the squishObject will squish along the x-axis.
   */
  @input
  @hint("This is how much the squishObject will squish along the x-axis.")
  @widget(new SliderWidget(0, 1.5, 0.01))
  horizontalSquish: number = 0.5

  private interactable: Interactable | null = null
  private initialPinch: number | null = null
  private initialScale: vec3 | undefined
  private squishScale: vec3 | undefined
  private squishEnabled: boolean = true

  onAwake(): void {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()

      this.createEvent("OnEnableEvent").bind(() => {
        this.squishEnabled = true
      })

      this.createEvent("OnDisableEvent").bind(() => {
        this.squishEnabled = false
      })
    })
  }

  init(): void {
    this.initialScale = this.squishObject.getTransform().getLocalScale()
    this.squishScale = new vec3(
      this.initialScale.x * this.horizontalSquish,
      this.initialScale.y * this.verticalSquish,
      this.initialScale.z
    )

    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
    if (!this.interactable) {
      throw new Error("InteractableSquishFeedback script requires an Interactable")
    }

    this.setupInteractableCallbacks()
  }

  resetScale(event: InteractorEvent): void {
    validate(this.initialScale)

    if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
      return
    }

    this.squishObject.getTransform().setLocalScale(this.initialScale)
    this.initialPinch = null
  }

  updateSquish(event: InteractorEvent): void {
    validate(this.initialScale)
    validate(this.squishScale)

    const currentPinch = event.interactor.interactionStrength
    if (currentPinch !== null && this.initialPinch !== null && this.squishEnabled) {
      const pinchScale = MathUtils.remap(
        Math.max(this.initialPinch, currentPinch),
        Math.min(this.initialPinch, 0.95),
        1,
        0,
        1
      )
      this.squishObject.getTransform().setLocalScale(vec3.lerp(this.initialScale, this.squishScale, pinchScale))
    }
  }

  setupInteractableCallbacks(): void {
    validate(this.interactable)

    this.interactable.onHoverEnter.add((event) => {
      this.initialPinch = event.interactor.interactionStrength
    })
    this.interactable.onHoverUpdate.add(this.updateSquish.bind(this))
    this.interactable.onHoverExit.add(this.resetScale.bind(this))
    this.interactable.onTriggerEndOutside.add(this.resetScale.bind(this))
    this.interactable.onTriggerCanceled.add(this.resetScale.bind(this))

    this.interactable.onSyncHoverEnter.add((event) => {
      this.initialPinch = event.interactor.interactionStrength
    })
    this.interactable.onSyncHoverUpdate.add(this.updateSquish.bind(this))
    this.interactable.onSyncHoverExit.add(this.resetScale.bind(this))
    this.interactable.onSyncTriggerEndOutside.add(this.resetScale.bind(this))
    this.interactable.onSyncTriggerCanceled.add(this.resetScale.bind(this))
  }
}
