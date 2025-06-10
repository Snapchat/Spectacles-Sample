import { GeminiAPI } from "./GeminiAPI";
import { SpeechUI } from "./SpeechUI";
import { ResponseUI } from "./ResponseUI";
import { Loading } from "./Loading";
import { DepthCache } from "./DepthCache";
import { DebugVisualizer } from "./DebugVisualizer";

@component
export class SceneController extends BaseScriptComponent {
  static SHOW_DEBUG: boolean = true;

  @input debugVisualizer: DebugVisualizer;
  @input speechUI: SpeechUI;
  @input gemini: GeminiAPI;
  @input responseUI: ResponseUI;
  @input loading: Loading;
  @input depthCache: DepthCache;

  private isRequestRunning = false;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    var tapEvent = this.createEvent("TapEvent");
    tapEvent.bind(() => {
      print("Editor tap event...");
      this.onSpeechRecieved("Can you show me all the objects you see?");
    });

    //listen to new speech input
    this.speechUI.onSpeechReady.add((text) => {
      this.onSpeechRecieved(text);
    });
  }

  onSpeechRecieved(text: string) {
    this.speechUI.activateSpeechButton(false);
    if (this.isRequestRunning) {
      print("REQUEST ALREADY RUNNING");
      return;
    }
    print("MAKING REQUEST~~~~~");
    this.isRequestRunning = true;
    this.loading.activateLoder(true);
    //reset everything
    this.responseUI.clearLabels();
    this.responseUI.closeResponseBubble();
    //save depth frame
    let depthFrameID = this.depthCache.saveDepthFrame();
    let camImage = this.depthCache.getCamImageWithID(depthFrameID);
    //take capture
    this.sendToGemini(camImage, text, depthFrameID);
    if (SceneController.SHOW_DEBUG) {
      this.debugVisualizer.updateCameraFrame(camImage);
    }
  }

  private sendToGemini(
    cameraFrame: Texture,
    text: string,
    depthFrameID: number
  ) {
    this.gemini.makeGeminiRequest(cameraFrame, text, (response) => {
      this.isRequestRunning = false;
      this.speechUI.activateSpeechButton(true);
      this.loading.activateLoder(false);
      print("GEMINI Points LENGTH: " + response.points.length);
      this.responseUI.openResponseBubble(response.aiMessage);
      //create points and labels
      for (var i = 0; i < response.points.length; i++) {
        var pointObj = response.points[i];
        if (SceneController.SHOW_DEBUG) {
          this.debugVisualizer.visualizeLocalPoint(
            pointObj.pixelPos,
            cameraFrame
          );
        }
        var worldPosition = this.depthCache.getWorldPositionWithID(
          pointObj.pixelPos,
          depthFrameID
        );
        if (worldPosition != null) {
          //create and position label in world space
          this.responseUI.loadWorldLabel(
            pointObj.label,
            worldPosition,
            pointObj.showArrow
          );
        }
      }
      //create lines
      for (var i = 0; i < response.lines.length; i++) {
        var lineObj = response.lines[i];
        if (SceneController.SHOW_DEBUG) {
          this.debugVisualizer.visualizeLocalPoint(
            lineObj.startPos,
            cameraFrame
          );
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
