import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";
import { LightHandEventListener } from "./LightHandEventListener";

@component
export class LightHandInputManager extends BaseScriptComponent {

    private lightHandEventListeners: LightHandEventListener[]
    public cooldown = false;

    onAwake() {
        this.lightHandEventListeners = [];
    }

    addListener(lightHandEventListener: LightHandEventListener) {
        this.lightHandEventListeners.push(lightHandEventListener);
    }

    // Hand controls are global to all lights
    // Toggling hand controls for one enables them for all
    onToggle(on: boolean) {
        if (this.cooldown === true) {
            return;
        }
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 3);

        this.lightHandEventListeners.forEach(hc => {
            hc.HandControlToggle.isToggledOn = on;
        });
    }

    onSurfaceDetected(pos: vec3) {
        this.lightHandEventListeners.forEach(hc => {
            hc.trySetTempPosition(pos);
        });
    }
}