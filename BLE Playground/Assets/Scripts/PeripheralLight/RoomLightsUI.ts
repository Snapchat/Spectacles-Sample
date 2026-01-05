import {ToggleButton} from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import {ButtonFeedback_ForceVisualState} from "../Helpers/ButtonFeedback_ForceVisualState"
import {LightAiInputManager} from "./LightAiInputManager"
import {LightHandInputManager} from "./LightHandInputManager"

@component
export class RoomLightsUI extends BaseScriptComponent {
  @input
  node: SceneObject

  @input
  aiToggle: ToggleButton

  @input
  aiToggleForceVisual: ButtonFeedback_ForceVisualState

  @input
  aiText: Text

  @input
  handToggle: ToggleButton

  @input
  handToggleForceVisual: ButtonFeedback_ForceVisualState

  @input
  handText: Text

  @input
  lightAiInputManager: LightAiInputManager

  @input
  lightHandInputManager: LightHandInputManager

  private so: SceneObject
  private tr: Transform
  private initialized: boolean

  onAwake() {
    this.initialized = false
    this.so = this.getSceneObject()
    this.tr = this.getTransform()

    this.so.setParent(this.node)
    this.tr.setLocalRotation(quat.quatIdentity())
    this.tr.setLocalPosition(new vec3(0, 3000, 0))
  }

  init() {
    if (!this.initialized) {
      this.tr.setLocalPosition(vec3.zero())

      this.aiToggle.onStateChanged.add((arg) => this.onToggleAiInput(arg))
      this.handToggle.onStateChanged.add((arg) => this.onToggleHandInput(arg))

      this.initialized = true
    }
  }

  onToggleAiInput(on: boolean) {
    this.lightAiInputManager.onToggle(on)
    this.aiText.text = on ? "Ai Control ON" : "Ai Control OFF"

    // Disable Hand
    if (on) {
      this.handToggle.isToggledOn = false
      this.handToggleForceVisual.onCodeChangeButtonState()
    }
  }

  onToggleHandInput(on: boolean) {
    this.lightHandInputManager.onToggle(on)
    this.handText.text = on ? "Hand Control ON" : "Hand Control OFF"

    // Disable Ai
    if (on) {
      this.aiToggle.isToggledOn = false
      this.aiToggleForceVisual.onCodeChangeButtonState()
    }
  }
}
