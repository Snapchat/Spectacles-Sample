import { Colors } from "Scripts/Helpers/Colors";
import { GeminiDepthLightEstimator } from "./GeminiDepthLightEstimator";

@component
export class GeminiDepthLightEstimatorListener extends BaseScriptComponent {

    @input
    geminiDepthLightEstimator: GeminiDepthLightEstimator

    public startColor: vec4
    private lightWorldPos: vec3

    onAwake() {
        this.lightWorldPos = undefined;
    }

    onHueSetStartColor() {
        this.geminiDepthLightEstimator.onStartColorSet();
    }

    init(color: vec4) {
        print("LightAiDetectionRegistration init " + color);
        this.startColor = color;
        if (global.deviceInfoSystem.isEditor()) {
            // In editor, use the Evening Room preview and look at the lamp 
            this.startColor = Colors.white();
        }
        this.geminiDepthLightEstimator.addListener(this);
    }

    setLightWorldPosition(lightWorldPos: vec3, responseIndex: number) {
        print("LightAiDetectionRegistration setLightWorldPosition first " + lightWorldPos);
        this.lightWorldPos = lightWorldPos;
    }

    getLightWorldPosition() {
        print("LightAiDetectionRegistration getLightWorldPosition " + this.lightWorldPos);

        return this.lightWorldPos;
    }
}