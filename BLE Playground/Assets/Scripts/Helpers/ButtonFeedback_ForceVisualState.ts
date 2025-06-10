/**
 * This is a helper to the Button Feedback SIK componenet, which forces button visual state when the toggle state is set via code. 
 */

import { ButtonFeedback } from "SpectaclesInteractionKit.lspkg/Components/Helpers/ButtonFeedback";
import { reportError } from "./ErrorUtils";
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { validate } from "SpectaclesInteractionKit.lspkg/Utils/validate";

@component
export class ButtonFeedback_ForceVisualState extends BaseScriptComponent {

    @input
    buttonFeedback: ButtonFeedback

    @input
    toggleButton: ToggleButton

    @input
    renderMeshVisual: RenderMeshVisual

    onAwake() {

    }

    public onCodeChangeButtonState() {
        if (this.buttonFeedback.meshToggledIdleMaterial !== undefined && this.buttonFeedback.meshIdleMaterial !== undefined) {
            try {
                this.changeButtonState(this.toggleButton.isToggledOn ? this.buttonFeedback.meshToggledIdleMaterial : this.buttonFeedback.meshIdleMaterial);
            } catch (error) {
                reportError(error);
            }
        }
    }

    private changeButtonState = (material: Material | undefined): void => {
        if (material === undefined) return
        this.renderMeshVisual.mainMaterial = material
    }
}