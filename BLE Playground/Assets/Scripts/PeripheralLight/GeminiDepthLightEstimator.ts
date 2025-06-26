import { GeminiAPI } from "DepthCacheGemini/Scripts/GeminiAPI";
import { ResponseUI } from "DepthCacheGemini/Scripts/ResponseUI";
import { DepthCache } from "DepthCacheGemini/Scripts/DepthCache";
import { DebugVisualizer } from "DepthCacheGemini/Scripts/DebugVisualizer";
import { LightHandInputManager } from "./LightHandInputManager";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class GeminiDepthLightEstimator extends BaseScriptComponent {

    @input 
    debugVisualizer: DebugVisualizer;

    @input 
    gemini: GeminiAPI

    @input 
    responseUI: ResponseUI

    @input 
    depthCache: DepthCache

    @input
    lightHandInputManager: LightHandInputManager

    @input
    text: Text

    get lightPlaced(){
        return this.lightPlacedEvent.publicApi();
    }

    private lightPlacedEvent: Event = new Event();

    private isRequestRunning: boolean = false
    private instruction: string
    private showDebug: boolean

    public lightPositions:vec3[]

    onAwake() {
        this.isRequestRunning = false;
        this.showDebug = false;
        this.instruction = "Find the lamps."; 
        this.lightPositions = [];

        this.text.text = "Look at lights and pinch camera\nto get positions from Gemini!"
    }

    requestAllPositions() {
        if (this.isRequestRunning) {
            this.text.text = "Already finding lamps...";
            return;
        }

        //reset
        // this.responseUI.clearLabels();
        // this.lightPositions = [];

        this.isRequestRunning = true;
        let depthFrameID = this.depthCache.saveDepthFrame();
        let camImage = this.depthCache.getCamImageWithID(depthFrameID);

        this.sendToGemini(camImage, this.instruction, depthFrameID);
        if (this.showDebug) {
            this.debugVisualizer.updateCameraFrame(camImage);
        }
    }

    show(val:boolean){
        this.responseUI.showLabels(val);
    }

    private sendToGemini(
        cameraFrame: Texture,
        text: string,
        depthFrameID: number
    ) {
        this.text.text = "Looking for lights now!";

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
                    // create and position label in world space
                    // Hiding labels because they're not that accurate for me at the moment
                    this.responseUI.loadWorldLabel(
                        pointObj.label,
                        worldPosition,
                        pointObj.showArrow
                    );

                    this.lightPlacedEvent.invoke();

                    this.lightPositions.push(worldPosition);
                    this.text.text = "";
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