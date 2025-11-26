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
// @input Component.RenderMeshVisual meshVisual {"hint":"The mesh visual to modify into an extendable capsule."}
// @input float capsuleLength = 10 {"hint":"The length of the cylindric section of the capsule (not including the end caps)."}
// @input float radius = 1 {"hint":"The radius of the end caps and the radius of the cylindric section."}
// @input int radianStepCount = 16 {"hint":"The number of points per circle in the mesh. Increase for a higher poly-count mesh."}
// @input int cylinderStepCount = 16 {"hint":"The number of circles in the cylinder of the mesh. Increase for a higher poly-count mesh."}
// @input int endXStepCount = 32 {"hint":"The number of circles in the end cap of the capsule mesh. Increase for a higher poly-count mesh."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/CapsuleMeshCustomizer");
Object.setPrototypeOf(script, Module.CapsuleMeshCustomizer.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("meshVisual", []);
    checkUndefined("capsuleLength", []);
    checkUndefined("radius", []);
    checkUndefined("radianStepCount", []);
    checkUndefined("cylinderStepCount", []);
    checkUndefined("endXStepCount", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
