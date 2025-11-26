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
// @input bool enableCursorHolding = true {"hint":"Controls the \"stickiness\" of the cursor when hovering over interactable objects. When enabled, the cursor maintains its position on the target object, even when the hand moves slightly, making interaction with small targets easier. Only applies to hand-based interactions, not other input types like mouse. Disable for immediate 1:1 cursor movement that follows the hand position exactly."}
// @input bool enableFilter {"hint":"Applies smoothing to cursor movement for hand-based interactions. When enabled, reduces jitter and makes cursor motion appear more stable, improving precision when interacting with small targets. Only applies to hand-based interactions."}
// @input Component.ScriptComponent _interactor {"hint":"Reference to the component that this cursor will visualize. The cursor will update its position and appearance based on the interactor's state."}
// @input bool drawDebug {"hint":"Enable debug rendering for this cursor (cone collider, center ray, and closest-point helpers)"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorCursor/InteractorCursor");
Object.setPrototypeOf(script, Module.InteractorCursor.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("enableCursorHolding", []);
    checkUndefined("enableFilter", []);
    checkUndefined("drawDebug", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
