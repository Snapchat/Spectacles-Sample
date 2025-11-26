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
// @ui {"hint":"Settings for positioning a SceneObject relative to the user's head movements. This contains configuration options for distance, translation, and rotation behaviors to control how the SceneObject follows or stays fixed as the user moves their head. These settings create a balanced experience between head-locked objects (which move with the head) and world-space objects (which stay fixed in the environment).", "widget":"group_start", "label":"Headlock"}
// @input float _distance = 50 {"hint":"How far away the SceneObject will be from the camera."}
// @ui {"hint":"Controls how the SceneObject responds to physical head movement in space. These settings determine if and how quickly the object follows when the user physically moves their head in different directions.", "widget":"group_start", "label":"Head Translation"}
// @input bool _xzEnabled = true {"hint":"When enabled, the SceneObject will follow when the user moves their head along XZ-plane."}
// @input float _xzEasing = 1 {"hint":"How fast the SceneObject will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow."}
// @input bool _yEnabled = true {"hint":"When enabled, the SceneObject will follow when the user moves their head along Y-axis."}
// @input float _yEasing = 1 {"hint":"How fast the SceneObject will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow."}
// @input float _translationBuffer {"hint":"The magnitude of change needed to activate a translation for the SceneObject to follow the camera."}
// @ui {"widget":"group_end"}
// @ui {"hint":"Controls how the SceneObject responds to head rotation. These settings determine if and how quickly the object adjusts its position when the user rotates their head up/down (pitch) and left/right (yaw).", "widget":"group_start", "label":"Head Rotation"}
// @input bool _lockedPitch = true {"hint":"When enabled, locks the SceneObject's position relative to the pitch-axis, keeping it fixed in place as the user rotates their head up/down."}
// @input float _pitchEasing = 1 {"hint":"How fast the SceneObject will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow."}
// @input float _pitchOffsetDegrees {"hint":"How many degrees of offset from the center point should the SceneObject sit. Positive values place the element below the center."}
// @input float _pitchBufferDegrees {"hint":"How many degrees of leeway along each direction (up/down) before change starts to occur."}
// @input bool _lockedYaw = true {"hint":"When enabled, locks the SceneObject's position relative to the yaw-axis, keeping it fixed in place as the user rotates their head left/right."}
// @input float _yawEasing = 1 {"hint":"How fast the SceneObject will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow."}
// @input float _yawOffsetDegrees {"hint":"How many degrees of offset from the center point should the SceneObject sit. Positive values place the element to the left."}
// @input float _yawBufferDegrees {"hint":"How many degrees of leeway along each direction (left/right) before change starts to occur."}
// @ui {"widget":"group_end"}
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
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/Headlock/Headlock");
Object.setPrototypeOf(script, Module.Headlock.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_distance", []);
    checkUndefined("_xzEnabled", []);
    checkUndefined("_xzEasing", []);
    checkUndefined("_yEnabled", []);
    checkUndefined("_yEasing", []);
    checkUndefined("_translationBuffer", []);
    checkUndefined("_lockedPitch", []);
    checkUndefined("_pitchEasing", []);
    checkUndefined("_pitchOffsetDegrees", []);
    checkUndefined("_pitchBufferDegrees", []);
    checkUndefined("_lockedYaw", []);
    checkUndefined("_yawEasing", []);
    checkUndefined("_yawOffsetDegrees", []);
    checkUndefined("_yawBufferDegrees", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
