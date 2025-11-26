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
// @ui {"hint":"Settings to configure how this object rotates to face the camera.", "widget":"group_start", "label":"Billboard"}
// @input bool _xAxisEnabled {"hint":"Enables pitch rotation of the object to face the camera. When enabled, the object rotates around its X-axis to maintain camera orientation."}
// @input bool _yAxisEnabled = true {"hint":"Enables yaw rotation of the object to face the camera. When enabled, the object rotates around its Y-axis to track camera position."}
// @input bool _zAxisEnabled {"hint":"Enables roll rotation of the object to align with camera orientation. When enabled, the object rotates around its Z-axis to match camera's up direction."}
// @input vec3 _axisBufferDegrees = {0,0,0} {"hint":"Defines a threshold in degrees before rotation is applied for each axis. The object only rotates when the angle between its orientation and the camera exceeds this buffer, preventing small unwanted movements. Larger values create more stable objects that rotate less frequently."}
// @input vec3 _axisEasing = {1,1,1} {"hint":"Controls how fast the object rotates around each axis to follow camera movement. Configurable per axis (X,Y,Z) where higher values (1.0) create instant following, while lower values (0.1) create a delayed, smoother follow effect."}
// @input float duration = 0.033 {"hint":"Deprecated. Please use the property Axis Easing to adjust the rotation speed"}
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
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard");
Object.setPrototypeOf(script, Module.Billboard.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_xAxisEnabled", []);
    checkUndefined("_yAxisEnabled", []);
    checkUndefined("_zAxisEnabled", []);
    checkUndefined("_axisBufferDegrees", []);
    checkUndefined("_axisEasing", []);
    checkUndefined("duration", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
