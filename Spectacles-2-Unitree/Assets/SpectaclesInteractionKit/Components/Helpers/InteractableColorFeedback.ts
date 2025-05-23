import {Interactable} from "../Interaction/Interactable/Interactable"
import {validate} from "../../Utils/validate"

/**
 * This class provides visual feedback by changing the color of mesh visuals based on interaction events such as hover, pinch, and disable. It allows customization of colors for different interaction states.
 */
@component
export class InteractableColorFeedback extends BaseScriptComponent {
  @input("vec4", "{0.28, 0.28, 0.28, 1}")
  @widget(new ColorWidget())
  defaultColor: vec4 = new vec4(0.28, 0.28, 0.28, 1)

  @input("vec4", "{0.28, 0.28, 0.28, 1}")
  @widget(new ColorWidget())
  hoverColor: vec4 = new vec4(0.28, 0.28, 0.28, 1)

  @input("vec4", "{0.46, 0.46, 0.46, 1}")
  @widget(new ColorWidget())
  pinchedColor: vec4 = new vec4(0.46, 0.46, 0.46, 1)

  @input("vec4", "{1, 1, 1, 0}")
  @widget(new ColorWidget())
  disabledColor: vec4 = new vec4(1, 1, 1, 0)

  @input
  @hint(
    "The meshes which will have their baseColor changed on pinch/hover events",
  )
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
    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName(),
    )
    validate(
      this.interactable,
      "InteractableColorFeedback requires Interactable.",
    )
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
    interactable.onHoverEnter.add(() => {
      this.changeColor(this.hoverColor)
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
    interactable.onTriggerCanceled.add(() => {
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
    for (var i = 0; i < this.meshVisuals.length; i++) {
      let clonedMaterial = this.meshVisuals[i].mainMaterial.clone()
      this.meshMaterials.push(clonedMaterial)
      this.meshVisuals[i].mainMaterial = clonedMaterial
    }
    this.changeColor(this.defaultColor)
  }
}
