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
// @input bool useV2 {"label":"Use V2 Cursor", "hint":"Switches to the V2 cursor implementation, designed to make targeting free-floating and distant objects easier, at a higher performance cost.\n\n- Targeting: Blends its position based on multiple nearby interactables, making it easier to aim between targets.\n- Visuals: Fades out when not aimed near any interactable objects. Also enables a 'Ray' visual that can be set per-Interactable/InteractionPlane.\n- Performance: This version is more computationally expensive due to its multi-target analysis."}
// @input bool drawDebug {"hint":"Enable debug rendering for cursors (cone collider, center ray, and closest-point helpers)"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorCursor/CursorController");
Object.setPrototypeOf(script, Module.CursorController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("useV2", []);
    checkUndefined("drawDebug", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
