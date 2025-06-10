// ObjectDetectionController.js
// Version: 2.0.0
// Event: OnAwake
// Creates copies of specified object and passes detection information to the script component attached to instantiated scene object


// @input SceneObject objectToCopy {"hint" : "Object used to copy and place over the detected objects"}
/** @type {SceneObject} */
var origin = script.objectToCopy;

// @input int maxCount = 30 {"widget":"slider", "min":0, "max": 100, "hint" : "Number of instances of the object"}
/** @type {number} */
var maxCount = script.maxCount;

// @ui {"widget" : "separator"}
// @input bool matchDetections {"hint" : "try to match current detections with ones from the previous frame, reuse same scene objects if match"}
/** @type {boolean} */
var matchDetections = script.matchDetections;

// @input float matchThreshold = 0.5 {"widget":"slider", "min":0.0, "max":0.95, "step" : 0.05, "showIf":"matchDetections"}
/** @type {number} */
var matchThreshold = script.matchThreshold;

// @input int lostFramesThreshold = 4 {"label" : "Lost Frames", "showIf":"matchDetections", "hint" : "If the detection isn't matched then it will remain active during <lostFrameThreshold> updates"}
/** @type {number} */
var lostFramesThreshold = script.lostFramesThreshold;
// @ui {"widget":"separator"}

//@input bool setObjectPosition
/** @type {boolean} */
var setObjectPosition = script.setObjectPosition;

//@input float smoothCoef = 0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01 , "showIf" : "setObjectPosition", "hint":"Requires 'Match Detections' enabled"}
/** @type {number} */
var lerpCoef = (1.0 - script.smoothCoef * 0.95);
// @ui {"widget":"separator"}

// @input bool connections
// @input Component.ScriptComponent mlController { "showIf" : "connections"}
/** @type {ScriptComponent} */
var mlController = script.mlController;
//@input Component.Camera camera {"hint" : "set camera if obejct is not using screen transform", "showIf" : "connections"}
/** @type {Camera} */
var camera = script.camera;
/** @type {Transform} */
var cameraTransform;
/** @type {number} */
var depth = 0;



var DetectionHelpers = require("./Modules/DetectionHelpersModule");

/**
 * @typedef {Object} Tracklet 
 * @property {SceneObject} sceneObject - instantiated scene object
 * @property {ScriptComponent} scriptComponent - a script component attached to scene object
 * @property {ScreenTransform} screenTransform - screen transform if available
 * @property {Transform} transform - object transform
 * @property {DetectionHelpers.Detection} detection - a detection corresponding to this tracklet
 * @prop {boolean} active=false - is this tracklet active
 * @prop {number} updated=false - is this tracklet updated
 * @prop {number} lostFrames=0 - for how many frames this tracklet is lost
 */

/** @type {Tracklet[]} */
var trackletObjects;

if (checkInputs()) {
    trackletObjects = instantiateObjects(origin, maxCount);
    //add a callback 
    mlController.onDetectionsUpdated.add(onUpdate);
}

/**
 * updates tracklets based on detections 
 * @param {DetectionHelpers.Detection} detections 
 */
function onUpdate(detections) {
    if (matchDetections) {
        updateDetectionBoxesWithMatching(detections);
    } else {
        updateDetectionBoxes(detections);
    }
}

/**
 * 
 * @param {SceneObject} origin 
 * @param {number} count 
 * @returns {Tracklet[]}
 */
function instantiateObjects(origin, count) {
    var parent = origin.getParent();
    var arr = [];
    if (origin.getComponent("ScreenTransform") == null) {
        if (!script.camera) {
            print("Warning, please set Camera input to calculate world position of instantiated object");
            return arr;
        } else {
            //calculate settings used for 3d transform
            cameraTransform = script.camera.getSceneObject().getTransform();
            depth = origin.getTransform().getWorldPosition().distance(cameraTransform.getWorldPosition());
        }
    }
    for (var i = 0; i < count; i++) {
        var sceneObject = i == 0 ? origin : parent.copyWholeHierarchy(origin);
        //create a tracklet object for each instantiated scene object 
        arr.push({
            sceneObject: sceneObject,
            transform: sceneObject.getTransform(),
            scriptComponent: sceneObject.getComponent("ScriptComponent"),
            screenTransform: sceneObject.getComponent("ScreenTransform"),
            detection: null,
            active: false,
            updated: false,
            lostFrames: 0,
        });
    }
    return arr;
}

function updateDetectionBoxes(detections) {
    for (var i = 0; i < detections.length; i++) {
        if (i < maxCount) {
            trackletObjects[i].detection = detections[i];
            trackletObjects[i].sceneObject.enabled = true;
            //if api available 
            if (trackletObjects[i].scriptComponent && trackletObjects[i].scriptComponent.updateDetection) {
                trackletObjects[i].scriptComponent.updateDetection(detections[i]);
            }
            updatePosition(trackletObjects[i]);

        } else {
            //interrupt if no more spawned objects
            break;
        }
    }
    // disable the rest of scebe objecrs and reset their detection
    for (var j = detections.length; j < maxCount; j++) {
        trackletObjects[j].sceneObject.enabled = false;
        trackletObjects[i].detection = null;
    }
}

/**
 * tries to match each new detection to one from the prevoious frame
 * @param {DetectionHelper.Detection[]} detections 
 */
function updateDetectionBoxesWithMatching(detections) {
    var active_tracklets = Array(maxCount);
    var num_active = 0;
    var num_new = 0;
    var first_new = 0;

    var new_tracklets = Array(maxCount);

    for (var j = 0; j < maxCount; j++) {
        if (trackletObjects[j].active) {
            active_tracklets[num_active] = j;
            num_active++;
        }
        trackletObjects[j].updated = false;
    }

    for (var i = 0; i < detections.length; i++) {
        var temp = detections[i];

        var best_tracklet_idx = -1;
        var best_iou = 0;

        for (var k = 0; k < num_active; k++) {
            if (active_tracklets[k] == -1) {
                continue;
            }

            if (temp.index != trackletObjects[active_tracklets[k]].detection.index) {
                continue;
            }

            var iou = DetectionHelpers.iou(detections[i].bbox, trackletObjects[active_tracklets[k]].detection.bbox);
            if (iou > best_iou) {
                best_iou = iou;
                best_tracklet_idx = k;
            }
        }
        if (best_tracklet_idx == -1 || best_iou < matchThreshold) {
            // Not matched to any existing tracklet => create a new one
            new_tracklets[num_new] = temp;
            num_new++;
        } else {
            var temp_idx = active_tracklets[best_tracklet_idx];
            trackletObjects[temp_idx].detection = temp;
            trackletObjects[temp_idx].active = true;
            trackletObjects[temp_idx].updated = true;
            trackletObjects[temp_idx].lostFrames = 0;

            if (trackletObjects[temp_idx].scriptComponent && trackletObjects[temp_idx].scriptComponent.updateDetection) {
                trackletObjects[temp_idx].scriptComponent.updateDetection(temp);
            }
            updatePosition(trackletObjects[temp_idx]);
            active_tracklets[best_tracklet_idx] = -1;
        }
    }
    // remove all trackletObjects which weren't matched with any candidate detection
    for (var l = 0; l < maxCount; l++) {
        if (!trackletObjects[l].updated) {
            if (trackletObjects[l].active && trackletObjects[l].lostFrames < lostFramesThreshold) {
                trackletObjects[l].lostFrames++;
                continue;
            }
            if (num_new > 0) {
                num_new--;
                trackletObjects[l].detection = new_tracklets[first_new];
                trackletObjects[l].active = true;
                trackletObjects[l].sceneObject.enabled = true;

                if (trackletObjects[l].scriptComponent != null) {
                    if (trackletObjects[l].scriptComponent.resetDetection) {
                        trackletObjects[l].scriptComponent.resetDetection();
                    }

                    if (trackletObjects[l].scriptComponent.updateDetection) {
                        trackletObjects[l].scriptComponent.updateDetection(new_tracklets[first_new]);
                    }
                }
                updatePosition(trackletObjects[l]);
                first_new++;
            } else {
                trackletObjects[l].sceneObject.enabled = false;
                trackletObjects[l].active = false;
                trackletObjects[l].detection = null;
            }
            trackletObjects[l].lostFrames = 0;
        }
    }
}

/**
 * 
 * @param {Tracklet} tracklet 
 */
function updatePosition(tracklet) {
    if (!setObjectPosition) {
        return;
    }
    if (tracklet.screenTransform) {
        var newAnchors = tracklet.detection.getScreenRect();
        if (tracklet.updated) {
            newAnchors = lerpRect(tracklet.screenTransform.anchors, newAnchors, lerpCoef);
        } 
        tracklet.screenTransform.anchors = newAnchors;
        
    } else {
        var newPos = camera.screenSpaceToWorldSpace(tracklet.detection.getScreenPos(), depth);
        if (tracklet.updated) {
            newPos = vec3.lerp(tracklet.transform.getWorldPosition(), newPos, lerpCoef);
        } 
        tracklet.transform.setWorldPosition(newPos);
    }
}

/**
 * @param {Rect} a 
 * @param {Rect} b 
 * @param {number} t 
 * @returns {Rect} 
 */
function lerpRect(a, b, t) {
    a.left = a.left + (b.left - a.left) * t;
    a.right = a.right + (b.right - a.right) * t;
    a.bottom = a.bottom + (b.bottom - a.bottom) * t;
    a.top = a.top + (b.top - a.top) * t;
    return a;
}

/**
 * checks if inputs are set
 * @returns {boolean}
 */
function checkInputs() {
    if (!origin) {
        print("Error, Please set the object you would like to instantiate for each detected object");
        return false;
    }
    if (!mlController || !mlController.onDetectionsUpdated) {
        print("Error, MLController script input is not set or wrong script referenced");
        return false;
    }

    return true;
}