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
// @input SceneObject squishObject {"hint":"This is the SceneObject that will be squished on hover/trigger."}
// @input float verticalSquish = 0.5 {"hint":"This is how much the squishObject will squish along the y-axis.", "widget":"slider", "min":0, "max":1, "step":0.01}
// @input float horizontalSquish = 0.5 {"hint":"This is how much the squishObject will squish along the x-axis.", "widget":"slider", "min":0, "max":1.5, "step":0.01}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableSquishFeedback");
Object.setPrototypeOf(script, Module.InteractableSquishFeedback.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("squishObject", []);
    checkUndefined("verticalSquish", []);
    checkUndefined("horizontalSquish", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
