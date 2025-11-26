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
// @input Asset.Material targetOutlineMaterial {"hint":"This is the material that will provide the mesh outline."}
// @input vec4 hoveringColor = "{1, 1, 0.04, 1}" {"hint":"This is the color of the outline when hovered.", "widget":"color"}
// @input vec4 activatingColor = "{1, 1, 1, 1}" {"hint":"This is the color of the outline when triggered.", "widget":"color"}
// @input float outlineWeight = 0.25 {"hint":"This is the thickness of the outline."}
// @input Component.RenderMeshVisual[] meshVisuals = {} {"hint":"These are the meshes that will be outlined on pinch/hover."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableOutlineFeedback");
Object.setPrototypeOf(script, Module.InteractableOutlineFeedback.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("targetOutlineMaterial", []);
    checkUndefined("hoveringColor", []);
    checkUndefined("activatingColor", []);
    checkUndefined("outlineWeight", []);
    checkUndefined("meshVisuals", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
