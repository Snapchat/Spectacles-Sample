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
// @input Asset.SupabaseProject supabaseProject {"hint":"SupabaseProject asset from Asset Browser (created via Supabase Plugin)"}
// @input bool allowIncrementFromLens = true
// @input Component.Text totalText
// @input SceneObject startRoot
// @input SceneObject endRoot
// @input Asset.ObjectPrefab[] balloonPrefabs
// @input SceneObject balloonsParent
// @input float maxOthers = 20
// @input SceneObject missingConfigRoot
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/KindnessCounter");
Object.setPrototypeOf(script, Module.KindnessCounter.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("allowIncrementFromLens", []);
    checkUndefined("totalText", []);
    checkUndefined("startRoot", []);
    checkUndefined("endRoot", []);
    checkUndefined("balloonPrefabs", []);
    checkUndefined("balloonsParent", []);
    checkUndefined("maxOthers", []);
    checkUndefined("missingConfigRoot", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
