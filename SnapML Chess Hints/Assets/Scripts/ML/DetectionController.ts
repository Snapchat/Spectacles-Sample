
import { DetectionHelpers, Detection } from "./DetectionHelpers";
import { ChessBoardPredictor } from "../ChessBoardPredictor";

export type Tracklet = {
  sceneObject: SceneObject;
  transform: Transform;
  screenTransform: ScreenTransform;
  detection: Detection;
  active: boolean;
  updated: boolean;
  lostFrames: number;
}

@component
export class DetectionController extends BaseScriptComponent {
  @input()
  @hint("Object used to copy and place over the detected objects")
  objectToCopy: SceneObject;


  @input()
  @hint("Number of instances of the object")
  @widget(new SliderWidget(0, 100, 1))
  maxCount: number = 70;

  @input
  @hint("set object position")
  setObjectPosition: boolean = true;

  @input
  @hint("try to match current detections with ones from the previous frame, reuse same scene objects if match")
  matchDetections: boolean;

  @ui.group_start('Match Settings')
  @showIf('matchDetections')

  @input
  @hint("If the detection isn't matched then it will remain active during <lostFrameThreshold> updates")
  @widget(new SliderWidget(0, 0.95, 0.05))
  matchThreshold: number = 0.5;


  @input
  @hint("Lost Frames")
  @widget(new SliderWidget(0, 10, 1))
  lostFramesThreshold: number = 4;



  @input
  @hint("smooth coefficient")
  @widget(new SliderWidget(0, 1, 0.01))
  smoothCoef: number = 0;

  @ui.group_end

  private origin: SceneObject;
  private lerpCoef: number;
  private camera: Camera;
  private cameraTransform: Transform;
  private depth: number = 0;
  private trackletObjects: Tracklet[];

  private colors = [
    new vec4(0.8, 0.6, 0.6, 1), // darker pastel red        "black-bishop",
    new vec4(0.6, 0.8, 0.6, 1), // darker pastel green      "black-king",
    new vec4(0.6, 0.6, 0.8, 1), // darker pastel blue       "black-knight",
    new vec4(0.8, 0.8, 0.6, 1), // darker pastel yellow     "black-pawn",
    new vec4(0.8, 0.6, 0.8, 1), // darker pastel pink       "black-queen",
    new vec4(0.6, 0.8, 0.8, 1), // darker pastel cyan       "black-rook",
    new vec4(0.8, 0.7, 0.5, 1), // darker pastel peach      "corners",
    new vec4(0.7, 0.8, 0.7, 1), // darker pastel mint       "white-bishop",
    new vec4(0.7, 0.5, 0.8, 1), // darker pastel lavender   "white-king",
    new vec4(0.8, 0.8, 0.7, 1), // darker pastel cream      "white-knight",
    new vec4(0.6, 0.7, 0.8, 1), // darker pastel sky blsue   "white-pawn",
    new vec4(0.8, 0.6, 0.7, 1), // darker pastel rose       "white-queen",
    new vec4(0.7, 0.8, 0.6, 1), // darker pastel lime       "white-rook"
  ];

  onAwake() {
    this.origin = this.objectToCopy;
    this.lerpCoef = 1.0 - this.smoothCoef * 0.95;

    if (this.checkInputs()) {
      this.trackletObjects = this.instantiateObjects(this.origin, this.maxCount);
    }
  }

  updateDetection(tracklet: Tracklet, detection: Detection) {
    // set material color based on script index
    tracklet.detection = detection;
    let object = tracklet.sceneObject;
    let col = this.colors[detection.index]
    object.getChild(0).getComponent("Component.Image").mainMaterial.mainPass.baseColor = col;

    let labelText = object.getChild(1).getComponent("Component.Text");
    // set text background color
    labelText.backgroundSettings.fill.color = new vec4(0, 0, 0, 0.5);

    // set label 
    labelText.text = detection.label; //+ " " + detection.score.toFixed(2);
  }

  public onUpdate(detections: Detection[]) {
    if (this.matchDetections) {
      this.updateDetectionBoxesWithMatching(detections);
    } else {
      this.updateDetectionBoxes(detections);
    }
  }

  private instantiateObjects(origin: SceneObject, count: number): Tracklet[] {
    const parent = origin.getParent();
    const arr: Tracklet[] = [];
    if (origin.getComponent("ScreenTransform") == null) {
      if (!this.camera) {
        print("Warning, please set Camera input to calculate world position of instantiated object");
        return arr;
      } else {
        this.cameraTransform = this.camera.getSceneObject().getTransform();
        this.depth = origin.getTransform().getWorldPosition().distance(this.cameraTransform.getWorldPosition());
      }
    }
    for (let i = 0; i < count; i++) {
      const sceneObject = i === 0 ? origin : parent.copyWholeHierarchy(origin);
      let img = sceneObject.getChild(0).getComponent("Component.Image");
      img.mainMaterial = img.mainMaterial.clone();
      arr.push({
        sceneObject: sceneObject,
        transform: sceneObject.getTransform(),
        screenTransform: sceneObject.getComponent("ScreenTransform"),
        detection: null,
        active: false,
        updated: true,
        lostFrames: 0,
      });
    }
    return arr;
  }

  private updateDetectionBoxes(detections: Detection[]) {

    for (let i = 0; i < detections.length; i++) {
      if (i < this.maxCount) {
        this.trackletObjects[i].detection = detections[i];
        this.trackletObjects[i].sceneObject.enabled = true;

        this.updateDetection(this.trackletObjects[i], detections[i]);

        this.updatePosition(this.trackletObjects[i]);
      } else {
        break;
      }
    }
    for (let j = detections.length; j < this.maxCount; j++) {
      this.trackletObjects[j].sceneObject.enabled = false;
      this.trackletObjects[j].detection = null;
    }
  }

  private updateDetectionBoxesWithMatching(detections: Detection[]) {
    const activeTracklets: number[] = [];
    let numActive = 0;
    let numNew = 0;
    let firstNew = 0;
    const newTracklets: Detection[] = [];

    for (let j = 0; j < this.maxCount; j++) {
      if (this.trackletObjects[j].active) {
        activeTracklets[numActive] = j;
        numActive++;
      }
      this.trackletObjects[j].updated = false;
    }

    for (let i = 0; i < detections.length; i++) {
      const temp = detections[i];
      let bestTrackletIdx = -1;
      let bestIou = 0;

      for (let k = 0; k < numActive; k++) {
        if (activeTracklets[k] === -1) {
          continue;
        }
        if (temp.index !== this.trackletObjects[activeTracklets[k]].detection.index) {
          continue;
        }
        const iou = DetectionHelpers.iou(detections[i].bbox, this.trackletObjects[activeTracklets[k]].detection.bbox);
        if (iou > bestIou) {
          bestIou = iou;
          bestTrackletIdx = k;
        }
      }
      if (bestTrackletIdx === -1 || bestIou < this.matchThreshold) {
        newTracklets[numNew] = temp;
        numNew++;
      } else {
        const tempIdx = activeTracklets[bestTrackletIdx];
        this.trackletObjects[tempIdx].detection = temp;
        this.trackletObjects[tempIdx].active = true;
        this.trackletObjects[tempIdx].updated = true;
        this.trackletObjects[tempIdx].lostFrames = 0;

        this.updateDetection(this.trackletObjects[tempIdx], temp);
        this.updatePosition(this.trackletObjects[tempIdx]);
        activeTracklets[bestTrackletIdx] = -1;
      }
    }

    for (let l = 0; l < this.maxCount; l++) {
      if (!this.trackletObjects[l].updated) {
        if (this.trackletObjects[l].active && this.trackletObjects[l].lostFrames < this.lostFramesThreshold) {
          this.trackletObjects[l].lostFrames++;
          continue;
        }
        if (numNew > 0) {
          numNew--;
          this.trackletObjects[l].detection = newTracklets[firstNew];
          this.trackletObjects[l].active = true;
          this.trackletObjects[l].sceneObject.enabled = true;

          this.updateDetection(this.trackletObjects[l], newTracklets[firstNew]);


          this.updatePosition(this.trackletObjects[l]);
          firstNew++;
        } else {
          this.trackletObjects[l].sceneObject.enabled = false;
          this.trackletObjects[l].active = false;
          this.trackletObjects[l].detection = null;
        }
        this.trackletObjects[l].lostFrames = 0;
      }
    }
  }

  remap(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  }

  private updatePosition(tracklet: Tracklet) {
    if (!this.setObjectPosition) {
      return;
    }
    if (tracklet.screenTransform) {
      let newAnchors = tracklet.detection.getScreenRect();


      if (tracklet.updated) {
        newAnchors = this.lerpRect(tracklet.screenTransform.anchors, newAnchors, this.lerpCoef);
      }
      tracklet.screenTransform.anchors = newAnchors;
    } else {
      let newPos = this.camera.screenSpaceToWorldSpace(tracklet.detection.getScreenPos(), this.depth);
      if (tracklet.updated) {
        newPos = vec3.lerp(tracklet.transform.getWorldPosition(), newPos, this.lerpCoef);
      }
      tracklet.transform.setWorldPosition(newPos);
    }
  }

  private lerpRect(a: Rect, b: Rect, t: number): Rect {
    a.left += (b.left - a.left) * t;
    a.right += (b.right - a.right) * t;
    a.bottom += (b.bottom - a.bottom) * t;
    a.top += (b.top - a.top) * t;
    return a;
  }

  private checkInputs(): boolean {
    if (!this.origin) {
      print("Error, Please set the object you would like to instantiate for each detected object");
      return false;
    }

    return true;
  }
}
