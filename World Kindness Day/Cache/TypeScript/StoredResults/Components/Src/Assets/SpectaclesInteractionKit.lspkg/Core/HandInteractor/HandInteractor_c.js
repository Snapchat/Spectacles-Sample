if (script.onAwake) {
    script.onAwake();
    return;
}
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @ui {"widget":"group_start", "label":"Interactor"}
// @input bool _drawDebug {"hint":"Should draw gizmos for visual debugging."}
// @ui {"widget":"group_start", "label":"Spherecast Configuration"}
// @input bool sphereCastEnabled {"hint":"Should use spherecast for targeting when raycast does not register a hit."}
// @input number[] spherecastRadii = "{0.5, 2.0, 4.0}" {"hint":"Defines the radii (in cm) used for progressive spherecasting when raycast fails to hit a target. Used in sequence with spherecastDistanceThresholds to perform increasingly larger sphere casts until a target is found. Smaller radii provide more precise targeting while larger radii help target small or distant objects. Must have the same array length as spherecastDistanceThresholds.", "showIf":"sphereCastEnabled", "showIfValue":true}
// @input number[] spherecastDistanceThresholds = "{0, 12, 30}" {"hint":"Defines distance offsets (in cm) from the ray origin for performing sphere casts. Each value creates a sphere cast starting point at [ray origin + (direction * offset)]. Used in sequence with spherecastRadii, with the system trying progressively larger sphere casts until a target is found. Helps improve targeting of small or distant objects. Must have the same array length as spherecastRadii.", "showIf":"sphereCastEnabled", "showIfValue":true}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Targeting Configuration"}
// @input float _maxRaycastDistance = 500 {"hint":"The maximum distance at which the interactor can target interactables."}
// @input float indirectTargetingVolumeMultiplier = 1 {"hint":"A multiplier applied to spherecast radii when using indirect targeting. Larger values create wider targeting areas, making it easier to target objects at the expense of precision. Smaller values provide more precise targeting."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Indirect Drag Provider"}
// @input float indirectDragThreshold = 3 {"hint":"Controls the minimum distance (in cm) the hand must move during indirect interaction to be considered a drag. When the distance between the interaction origin position and current position exceeds this threshold, dragging behavior is detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher values require more deliberate movement before dragging begins."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Hand Interactor"}
// @input string handType = "right" {"hint":"Specifies which hand this interactor tracks (left or right).", "widget":"combobox", "values":[{"label":"Left", "value":"left"}, {"label":"Right", "value":"right"}]}
// @input bool forcePokeOnNonDominantPalmProximity {"hint":"Forces the usage of Poke targeting when interacting near the nondominant hand's palm."}
// @input float directColliderEnterRadius = 1 {"hint":"The radius in cm around the midpoint of the index/thumb to target Interactables."}
// @input float directColliderExitRadius = 1.5 {"hint":"The radius in cm around the midpoint of the index/thumb to de-target Interactables (for bistable thresholding)."}
// @input float directDragThreshold = 3 {"hint":"Controls the minimum distance the hand must move during direct interaction to be considered a drag. When the distance between the interaction origin position and current position exceeds this threshold, dragging behavior is detected and tracked. Lower values make dragging more sensitive and easier to trigger, while higher values require more deliberate movement before dragging begins."}
// @ui {"widget":"group_end"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Core/HandInteractor/HandInteractor");
Object.setPrototypeOf(script, Module.HandInteractor.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_drawDebug", []);
    checkUndefined("sphereCastEnabled", []);
    checkUndefined("spherecastRadii", [["sphereCastEnabled",true]]);
    checkUndefined("spherecastDistanceThresholds", [["sphereCastEnabled",true]]);
    checkUndefined("_maxRaycastDistance", []);
    checkUndefined("indirectTargetingVolumeMultiplier", []);
    checkUndefined("indirectDragThreshold", []);
    checkUndefined("handType", []);
    checkUndefined("forcePokeOnNonDominantPalmProximity", []);
    checkUndefined("directColliderEnterRadius", []);
    checkUndefined("directColliderExitRadius", []);
    checkUndefined("directDragThreshold", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
