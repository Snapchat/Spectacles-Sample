import {validate} from "../../Utils/validate"
import {Interactable} from "../Interaction/Interactable/Interactable"

/**
 * This class provides visual feedback by changing the color of mesh visuals based on interaction events such as hover,
 * pinch, and disable. It allows customization of colors for different interaction states.
 */
@component
export class InteractableColorFeedback extends BaseScriptComponent {
  /**
   * The color applied when the Interactables are in their default state (not being interacted with).
   */
  @input("vec4", "{0.28, 0.28, 0.28, 1}")
  @hint("The color applied when the Interactables are in their default state (not being interacted with).")
  @widget(new ColorWidget())
  defaultColor: vec4 = new vec4(0.28, 0.28, 0.28, 1)
  /**
   * The color applied to Interactables when an Interactor is hovering over it.
   */
  @input("vec4", "{0.28, 0.28, 0.28, 1}")
  @hint("The color applied to Interactables when an Interactor is hovering over it.")
  @widget(new ColorWidget())
  hoverColor: vec4 = new vec4(0.28, 0.28, 0.28, 1)
  /**
   * The color applied to Interactables when they are being actively pinched.
   */
  @input("vec4", "{0.46, 0.46, 0.46, 1}")
  @hint("The color applied to Interactables when they are being actively pinched.")
  @widget(new ColorWidget())
  pinchedColor: vec4 = new vec4(0.46, 0.46, 0.46, 1)
  /**
   * The color applied to Interactables when they are disabled.
   */
  @input("vec4", "{1, 1, 1, 0}")
  @hint("The color applied to Interactables when they are disabled.")
  @widget(new ColorWidget())
  disabledColor: vec4 = new vec4(1, 1, 1, 0)

  /**
   * The meshes which will have their baseColor changed on pinch/hover/enable/disable events.
   */
  @input
  @hint("The meshes which will have their baseColor changed on pinch/hover/enable/disable events.")
  meshVisuals: RenderMeshVisual[] = []

  private interactable: Interactable | null = null

  private meshMaterials: Material[] = []

  onAwake(): void {
    this.defineScriptEvents()
  }

  private defineScriptEvents(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  init(): void {
    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
    validate(this.interactable, "InteractableColorFeedback requires Interactable.")
    this.setupMaterials()
    this.setupInteractableCallbacks(this.interactable)
  }

  changeColor(color: vec4): void {
    this.meshMaterials.forEach(function (material) {
      material.mainPass.baseColor = color
    })
  }

  setupInteractableCallbacks(interactable: Interactable): void {
    validate(interactable)
    interactable.onHoverEnter.add((event) => {
      if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
        return
      }

      this.changeColor(event.interactor.isTriggering ? this.pinchedColor : this.hoverColor)
    })
    interactable.onHoverExit.add(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.onTriggerStart.add(() => {
      this.changeColor(this.pinchedColor)
    })
    interactable.onTriggerEnd.add(() => {
      this.changeColor(this.hoverColor)
    })
    interactable.onTriggerEndOutside.add(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.onTriggerCanceled.add(() => {
      this.changeColor(this.defaultColor)
    })

    interactable.onSyncHoverEnter.add((event) => {
      if (this.interactable?.keepHoverOnTrigger && event.interactor.isTriggering) {
        return
      }

      this.changeColor(event.interactor.isTriggering ? this.pinchedColor : this.hoverColor)
    })
    interactable.onSyncHoverExit.add(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.onSyncTriggerStart.add(() => {
      this.changeColor(this.pinchedColor)
    })
    interactable.onSyncTriggerEnd.add(() => {
      this.changeColor(this.hoverColor)
    })
    interactable.onSyncTriggerEndOutside.add(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.onSyncTriggerCanceled.add(() => {
      this.changeColor(this.defaultColor)
    })

    interactable.createEvent("OnEnableEvent").bind(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.createEvent("OnDisableEvent").bind(() => {
      this.changeColor(this.disabledColor)
    })
  }

  setupMaterials(): void {
    for (let i = 0; i < this.meshVisuals.length; i++) {
      const clonedMaterial = this.meshVisuals[i].mainMaterial.clone()
      this.meshMaterials.push(clonedMaterial)
      this.meshVisuals[i].mainMaterial = clonedMaterial
    }
    this.changeColor(this.defaultColor)
  }
}
