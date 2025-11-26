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
// @input SceneObject _onIcon {"hint":"The icon to be shown when the button is toggled on."}
// @input SceneObject _offIcon {"hint":"The icon to be shown when the button is toggled off."}
// @input bool _isToggledOn {"hint":"The initial state of the button, set to true if toggled on upon lens launch."}
// @input bool editEventCallbacks {"hint":"Enable this to add functions from another script to this component's callback events."}
// @ui {"widget":"group_start", "label":"On State Changed Callbacks", "showIf":"editEventCallbacks"}
// @input Component.ScriptComponent customFunctionForOnStateChanged {"hint":"The script containing functions to be called on toggle state change."}
// @input string[] onStateChangedFunctionNames = {} {"hint":"The names for the functions on the provided script, to be called on toggle state change."}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Sync Kit Support"}
// @input bool isSynced {"hint":"Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. If set to true, the ToggleButton's value will be synced whenever a new user joins the same Connected Lenses session. You must also enabled isSynced on the ToggleButton's Interactable."}
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
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton");
Object.setPrototypeOf(script, Module.ToggleButton.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_isToggledOn", []);
    checkUndefined("editEventCallbacks", []);
    checkUndefined("isSynced", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
