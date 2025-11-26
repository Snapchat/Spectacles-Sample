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
// @input bool editEventCallbacks {"hint":"Enable this to add functions from another script to this component's pinch callback events."}
// @ui {"widget":"group_start", "label":"On Button Pinched Callbacks", "showIf":"editEventCallbacks"}
// @input Component.ScriptComponent customFunctionForOnButtonPinched {"hint":"The script containing functions to be called when button is pinched. Functions can accept an InteractorEvent parameter (optional)."}
// @input string[] onButtonPinchedFunctionNames = {} {"hint":"The names for the functions on the provided script, to be called on button pinch. Functions can accept an InteractorEvent parameter (optional)."}
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
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton");
Object.setPrototypeOf(script, Module.PinchButton.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("editEventCallbacks", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
