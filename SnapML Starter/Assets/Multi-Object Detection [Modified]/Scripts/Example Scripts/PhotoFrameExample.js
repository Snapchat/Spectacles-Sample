// PhotoFrameExample.js
// Provides an example of how to change properties of the scene object based on the detection class
// Sets text based on the class index and score
// Adds random rotation to the scene object
// Version 1.0.0
// Event - OnAwake

//@input Component.Text labelText {"label" : "Text"}
/** @type {Text} */
var labelText = script.labelText;
//@input vec2 zRotMinMax = {-10, 10}
/** @type {vec2} */
var zRotMinMax = script.zRotMinMax;
/** @type {number} */
var zAngle = zRotMinMax.x + Math.random() * (zRotMinMax.y - zRotMinMax.x);

/** @type {ScreenTransform} */
var screenTransform = script.getSceneObject().getComponent("ScreenTransform");
screenTransform.rotation = quat.fromEulerAngles(0, 0, (zAngle * Math.PI) / 180);

var DetectionHelpers = require("./../Modules/DetectionHelpersModule"); // eslint-disable-line no-unused-vars
/**
 * sets text based on the detection label
 * @param {DetectionHelpers.Detection} detection
 */
function updateDetection(detection) {
  labelText.text = detection.label + " " + detection.score.toFixed(2);
}

// public api, called from ObjectDetectionController.js
script.updateDetection = updateDetection;
