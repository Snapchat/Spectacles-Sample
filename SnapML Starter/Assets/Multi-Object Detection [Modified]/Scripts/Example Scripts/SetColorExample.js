// SetColorExample.js
// Provides an example of how to change properties of the scene object based on the detection class
// Sets text and image colors based on the class index and score
// Provides api for the ObjectDetectionController Script
// Version 1.0.0
// Event - OnAwake

//
// public api -
// script.updateDetection(detection)
//@input Component.Text labelText {"label" : "Text"}
/** @type {Text} */
var labelText = script.labelText;

//@input Component.MaterialMeshVisual meshVisual {"label" : "Image"}
/** @type {MaterialMeshVisual} */
var meshVisual = script.meshVisual;

//@input vec4[] colors {"widget" : "color"}
/** @type {vec4} */
var colors = script.colors;

var DetectionHelpers = require("./../Modules/DetectionHelpersModule"); // eslint-disable-line no-unused-vars

/** @type {Material} */
var material = meshVisual.mainMaterial.clone();
//clone material so instances do not share same material
meshVisual.mainMaterial = material;

/**
 * @param {DetectionHelpers.Detection} detection
 */
function updateDetection(detection) {
  // set material color based on script index
  material.mainPass.baseColor = colors[detection.index];

  // set text background color
  labelText.backgroundSettings.fill.color = colors[detection.index];

  // set label
  labelText.text = detection.label + " " + detection.score.toFixed(2);
}

// public api, called from ObjectDetectionController.js
script.updateDetection = updateDetection;
