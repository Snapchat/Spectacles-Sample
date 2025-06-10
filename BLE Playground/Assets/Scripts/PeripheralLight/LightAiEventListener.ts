import { ButtonFeedback } from "SpectaclesInteractionKit.lspkg/Components/Helpers/ButtonFeedback"
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import { LightAiInputManager } from "./LightAiInputManager"
import { LightController } from "./LightController"
import { Colors } from "Scripts/Helpers/Colors"
import { ButtonFeedback_ForceVisualState } from "../Helpers/ButtonFeedback_ForceVisualState"

@component
export class LightAiEventListener extends BaseScriptComponent {

    @input
    text: Text

    @input
    toggleButton: ToggleButton

    @input
    buttonFeedback_ForceVisualState: ButtonFeedback_ForceVisualState

    @input
    lightAiInputManager: LightAiInputManager

    @input
    lightController: LightController

    private color:vec4
    private so:SceneObject

    onAwake() {
        this.color = Colors.black();
        this.lightAiInputManager.addListener(this);
        this.so = this.getSceneObject();
    }

    // Called from toggle button
    onToggleButton(on: boolean) {
        this.lightController.resetBrightnessAndColorStates();
        // cooldown in place
        this.lightAiInputManager.onToggle(on, this.so);
        this.buttonFeedback_ForceVisualState.onCodeChangeButtonState();
        this.text.text = on ? "Ai Control ON" : "Ai Control OFF";
    }

    // Called from lightAiController 
    onAiSetBrightnessAndColor(brightness: number, r:number, g:number, b:number) {
        this.color.r = r, this.color.g = g, this.color.b = b, this.color.a = 1;
        this.lightController.aiSetBrightnessAndColor(brightness, this.color);
    }
}