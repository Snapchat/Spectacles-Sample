// HintController.js
// Version: 1.0.0
// Event: Initialized
// Description: Controls hint behavior of the object detection template
// Shows hint only if objects were not detected for certain amount of frames
//@input Component.ScriptComponent mlController
//@input int minLostFrames {"hint" : "Hint will show up if there were no detections found for this amount of frames in a row"}
//@input SceneObject hintSceneObject
//@input bool hideOnCapture

var frameWindow = 0;
var isEnabled = true;

if (!script.hintSceneObject) {
  debugPrint("Warning, please set Hint SceneObject");
  return;
}

if (!script.mlController) {
  debugPrint("Warning, please set MLController script input");
  return;
} else if (script.mlController.onDetectionsUpdated != undefined) {
  script.mlController.onDetectionsUpdated.add(onDetectionsUpdated);
}

if (script.hideOnCapture) {
  script.createEvent("SnapImageCaptureEvent").bind(hideOnCapture);
  script.createEvent("SnapRecordStartEvent").bind(hideOnCapture);
}

function showHint(visible) {
  if (visible) {
    show();
  } else {
    frameWindow = 0;
    hide();
  }
}

function show() {
  if (!isEnabled) {
    if (frameWindow >= script.minLostFrames) {
      script.hintSceneObject.enabled = true;
      isEnabled = true;
    } else {
      frameWindow += 1;
    }
  }
}

function hide() {
  frameWindow = 0;
  if (isEnabled) {
    script.hintSceneObject.enabled = false;
    isEnabled = false;
  }
}

function onDetectionsUpdated(detections) {
  showHint(detections.length == 0);
}

function hideOnCapture() {
  script.hintSceneObject.enabled = false;
}

function debugPrint(text) {
  print("HintControllerWithWindow, " + text);
}

//public api
//usage - hintController.showHint(true);
script.showHint = showHint;
