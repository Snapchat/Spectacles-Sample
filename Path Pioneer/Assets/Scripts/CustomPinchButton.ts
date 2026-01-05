import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {lerp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"

@component
export class CustomPinchButton extends BaseScriptComponent {
  @input
  interactable: Interactable

  @input
  rmv: RenderMeshVisual

  private targetVal: number = 0
  private mat: Material = null

  onAwake() {
    this.mat = this.rmv.mainMaterial
    this.interactable.onHoverEnter.add(() => this.onHoverEnter())
    this.interactable.onHoverExit.add(() => this.onHoverExit())
    this.interactable.onTriggerStart.add(() => this.onTriggerEnter())
    this.interactable.onTriggerEnd.add(() => this.onTriggerExit())
    this.createEvent("UpdateEvent").bind(() => this.onUpdate())
  }

  private onUpdate() {
    // Lerp to target
    let val = this.mat.mainPass.hover
    val = lerp(val, this.targetVal, 3 * getDeltaTime())
    this.mat.mainPass.hover = val
  }

  private onHoverEnter() {
    this.targetVal = 0.7
  }

  private onHoverExit() {
    this.targetVal = 0
  }

  private onTriggerEnter() {
    this.targetVal = 1
  }

  private onTriggerExit() {
    this.targetVal = 0
  }
}
