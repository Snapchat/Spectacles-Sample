import { GeminiAPI } from "DepthCacheGemini/Scripts/GeminiAPI";
import { ResponseUI } from "DepthCacheGemini/Scripts/ResponseUI";
import { DepthCache } from "DepthCacheGemini/Scripts/DepthCache";
import { DebugVisualizer } from "DepthCacheGemini/Scripts/DebugVisualizer";
import { GeminiDepthLightEstimatorListener } from "./GeminiDepthLightEstimatorListener";
import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

@component
export class GeminiDepthLightEstimator extends BaseScriptComponent {

    @input debugVisualizer: DebugVisualizer;
    @input gemini: GeminiAPI;
    @input responseUI: ResponseUI;
    @input depthCache: DepthCache;

    private isRequestRunning: boolean = false;
    private instruction: string
    private showDebug: boolean

    private geminiDepthLightEstimatorListeners: GeminiDepthLightEstimatorListener[]
    private colorsSetCount: number;

    onAwake() {
        this.geminiDepthLightEstimatorListeners = [];
        this.colorsSetCount = 0;
        this.isRequestRunning = false;
        this.showDebug = false;
        this.instruction = "Find the lamps and order them by color "; // append with color value  
    }

    addListener(lightAiDetectionRegistration: GeminiDepthLightEstimatorListener) {
        this.geminiDepthLightEstimatorListeners.push(lightAiDetectionRegistration);
    }

    onStartColorSet() {
        this.colorsSetCount++;
        print("LightAiDetection onStartColorSet colors count " + this.colorsSetCount);

        if (this.colorsSetCount == this.geminiDepthLightEstimatorListeners.length) {
            print("LightAiDetection requestAllPositions");
            setTimeout(()=>this.requestAllPositions(), 3);
        }
    }

    requestAllPositions() {
        return;
        if (this.isRequestRunning) {
            print("LightAiDetection requestAllPositions request is running.");
            return;
        }
        let lampInstruction = this.instruction;
        this.geminiDepthLightEstimatorListeners.forEach(l => {
            lampInstruction += l.startColor.uniformScale(255).toString() + ", ";
        });

        //reset
        this.responseUI.clearLabels();

        this.isRequestRunning = true;
        let depthFrameID = this.depthCache.saveDepthFrame();
        let camImage = this.depthCache.getCamImageWithID(depthFrameID);

        this.sendToGemini(camImage, lampInstruction, depthFrameID);
        if (this.showDebug) {
            this.debugVisualizer.updateCameraFrame(camImage);
        }
    }

    private sendToGemini(
        cameraFrame: Texture,
        text: string,
        depthFrameID: number
    ) {
        print("LightAiDetection sendToGemini");

        this.gemini.makeGeminiRequest(cameraFrame, text, (response) => {
            this.isRequestRunning = false;
            print("LightAiDetection makeGeminiRequest response " + response);

            //create points and labels
            for (var i = 0; i < response.points.length; i++) {
                var pointObj = response.points[i];
                if (this.showDebug) {
                    this.debugVisualizer.visualizeLocalPoint(
                        pointObj.pixelPos,
                        cameraFrame
                    )
                }
                var worldPosition = this.depthCache.getWorldPositionWithID(
                    pointObj.pixelPos,
                    depthFrameID
                );
                if (worldPosition != null) {
                    if (this.geminiDepthLightEstimatorListeners.length > i) {
                        print("LightAiDetection setLightWorldPosition " + worldPosition + ", i " + i);
                        this.geminiDepthLightEstimatorListeners[i].setLightWorldPosition(worldPosition, i);
                    }

                    //create and position label in world space
                    // Hiding labels because they're not that accurate for me at the moment
                    // this.responseUI.loadWorldLabel(
                    //     pointObj.label + " " + i, //+ ", rgb: " + color.toString() + ", " + i,
                    //     worldPosition,
                    //     pointObj.showArrow
                    // );
                } else {
                    print("AiLampDetection world pos is null");
                }
            }
            //create lines
            for (var i = 0; i < response.lines.length; i++) {
                var lineObj = response.lines[i];
                if (this.showDebug) {
                    this.debugVisualizer.visualizeLocalPoint(
                        lineObj.startPos,
                        cameraFrame
                    )
                    this.debugVisualizer.visualizeLocalPoint(lineObj.endPos, cameraFrame);
                }
                var startPos = this.depthCache.getWorldPositionWithID(
                    lineObj.startPos,
                    depthFrameID
                );
                var endPos = this.depthCache.getWorldPositionWithID(
                    lineObj.endPos,
                    depthFrameID
                );
                if (startPos != null || endPos != null) {
                    //create and position label in world space
                    this.responseUI.loadWorldLine(startPos, endPos);
                }
            }
            this.depthCache.disposeDepthFrame(depthFrameID);
        });
    }
}