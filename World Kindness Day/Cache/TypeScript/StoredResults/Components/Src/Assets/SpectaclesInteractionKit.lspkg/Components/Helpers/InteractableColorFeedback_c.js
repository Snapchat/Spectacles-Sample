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
// @input vec4 defaultColor = "{0.28, 0.28, 0.28, 1}" {"hint":"The color applied when the Interactables are in their default state (not being interacted with).", "widget":"color"}
// @input vec4 hoverColor = "{0.28, 0.28, 0.28, 1}" {"hint":"The color applied to Interactables when an Interactor is hovering over it.", "widget":"color"}
// @input vec4 pinchedColor = "{0.46, 0.46, 0.46, 1}" {"hint":"The color applied to Interactables when they are being actively pinched.", "widget":"color"}
// @input vec4 disabledColor = "{1, 1, 1, 0}" {"hint":"The color applied to Interactables when they are disabled.", "widget":"color"}
// @input Component.RenderMeshVisual[] meshVisuals = {} {"hint":"The meshes which will have their baseColor changed on pinch/hover/enable/disable events."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableColorFeedback");
Object.setPrototypeOf(script, Module.InteractableColorFeedback.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("defaultColor", []);
    checkUndefined("hoverColor", []);
    checkUndefined("pinchedColor", []);
    checkUndefined("disabledColor", []);
    checkUndefined("meshVisuals", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
