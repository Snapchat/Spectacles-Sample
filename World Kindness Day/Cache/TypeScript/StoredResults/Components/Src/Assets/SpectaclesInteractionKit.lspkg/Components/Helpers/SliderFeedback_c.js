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
// @input Component.RenderMeshVisual renderMeshVisual {"hint":"The RenderMeshVisual component of the slider track that visualizes the slider's value. This mesh will have its material's level property updated to reflect the current slider position, and its pinch property modified during interaction events to provide additional visual feedback."}
// @input SceneObject knobObject {"hint":"Reference to the SceneObject containing the slider's interactive knob. This object must have an Interactable component attached to allow user interaction."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/SliderFeedback");
Object.setPrototypeOf(script, Module.SliderFeedback.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("renderMeshVisual", []);
    checkUndefined("knobObject", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
