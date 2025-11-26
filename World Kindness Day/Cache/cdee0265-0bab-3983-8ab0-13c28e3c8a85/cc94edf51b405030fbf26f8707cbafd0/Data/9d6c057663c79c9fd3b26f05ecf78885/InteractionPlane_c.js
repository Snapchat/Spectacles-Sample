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
// @input float targetingVisual {"hint":"Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).\n\n- 0: None\n- 1: Cursor (default)\n- 2: Ray", "widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Cursor", "value":1}, {"label":"Ray", "value":2}]}
// @input vec2 _planeSize = {10,10} {"hint":"The size of the interaction plane along the local X and Y axes. Defines the rectangular area of the plane where hand interactions are detected. Larger values create a bigger interactive surface area."}
// @input float _proximityDistance {"hint":"The depth of the plane's interaction zone along the local Z axis. Defines how far from the plane hand interactions are detected. Hand interactions beyond this distance will not be detected. Larger values allow interaction from greater distances."}
// @input float _directZoneDistance {"hint":"The maximum distance for Direct interaction with the plane."}
// @input bool _drawDebug {"hint":"Enables visual debugging of the Interaction Plane."}
// @input float _behindDistance {"hint":"The maximum distance for detecting interactions behind the plane. Creates a failsafe/tolerance zone where interactions can still be detected even if the user's hand accidentally penetrates through the plane."}
// @input float _lerpOffset {"hint":"The offset from the interaction zone that will be used to transition the user into near field mode. E.g. if the proximityDistance = 20 and lerpOffset = 25, a hand between 20-45cm away from the plane will be lerped into near field mode."}
// @input vec3 _offset {"hint":"Local-space offset of the plane. Allows positioning the effective interaction plane relative to the host SceneObject."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/InteractionPlane/InteractionPlane");
Object.setPrototypeOf(script, Module.InteractionPlane.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("targetingVisual", []);
    checkUndefined("_planeSize", []);
    checkUndefined("_proximityDistance", []);
    checkUndefined("_directZoneDistance", []);
    checkUndefined("_drawDebug", []);
    checkUndefined("_behindDistance", []);
    checkUndefined("_lerpOffset", []);
    checkUndefined("_offset", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
