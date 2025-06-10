// ObjectCounter.js
// Provides an example of now display the number of objects detected per class
// using Component.Text
// Version 1.0.0
// Event - OnAwake

var DetectionHelpers = require("./../Modules/DetectionHelpersModule"); // eslint-disable-line no-unused-vars

//@input Component.ScriptComponent mlController
/** @type {ScriptComponent} */
var mlController = script.mlController;
if (!mlController || !mlController.onDetectionsUpdated) {
    print("Error, MLController script input is not set or wrong script referenced");
    return false;
}
//@input Component.Text[] counterText{"hint" : "index in array should match class index"}
/** @type {Text[]} */
var counterText = script.counterText;

/** @type {number} */
var classCount = script.mlController.getClassCount();

/** @type {number[]} */
var countPerClass = new Array(classCount);

/**
 * @param {DetectionHelpers.Detection} detections 
 */
function onDetectionsUpdated(detections) {
    // reset counters
    for (var i = 0; i < classCount; i++) {
        countPerClass[i] = 0;
    }
    // update from detections
    for (i = 0; i < detections.length; i++) {
        countPerClass[detections[i].index] += 1;
    }
    // update text components if set
    for (i = 0; i < classCount; i++) {
        if (!isNull(script.counterText[i])) {
            counterText[i].text = countPerClass[i].toString();
        }
    }
}
// add callback
mlController.onDetectionsUpdated.add(onDetectionsUpdated);