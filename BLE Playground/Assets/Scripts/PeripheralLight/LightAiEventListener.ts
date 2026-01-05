import {Colors} from "Scripts/Helpers/Colors"
import {LightAiInputManager} from "./LightAiInputManager"
import {LightController} from "./LightController"

@component
export class LightAiEventListener extends BaseScriptComponent {
  // @input
  // buttonFeedback_ForceVisualState: ButtonFeedback_ForceVisualState

  @input
  lightAiInputManager: LightAiInputManager

  @input
  lightController: LightController

  private color: vec4

  onAwake() {
    this.color = Colors.black()
    this.lightAiInputManager.addListener(this)
  }

  onToggleButton(on: boolean) {
    this.lightController.resetBrightnessAndColorStates()
    // this.buttonFeedback_ForceVisualState.onCodeChangeButtonState();
  }

  // Called from lightAiController
  onAiSetBrightnessAndColor(brightness: number, r: number, g: number, b: number) {
    ;(this.color.r = r), (this.color.g = g), (this.color.b = b), (this.color.a = 1)
    this.lightController.aiSetBrightnessAndColor(brightness, this.color)
  }
}
