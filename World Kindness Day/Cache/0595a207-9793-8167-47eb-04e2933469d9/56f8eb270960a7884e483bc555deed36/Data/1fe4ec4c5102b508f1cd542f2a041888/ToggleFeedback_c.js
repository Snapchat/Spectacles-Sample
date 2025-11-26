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
// @input Asset.Material toggledOffMaterial {"hint":"The material applied to the toggle button when it's in the \"off\" state and not being interacted with. This defines the button's default visual appearance when it's unchecked."}
// @input Asset.Material toggledOffSelectMaterial {"hint":"The material applied to the toggle button when it's in the \"off\" state and being actively triggered. This provides visual feedback during active interaction with an unchecked button."}
// @input Asset.Material toggledOnMaterial {"hint":"The material applied to the toggle button when it's in the \"on\" state and not being interacted with. This defines the button's visual appearance when it's enabled/checked."}
// @input Asset.Material toggledOnSelectMaterial {"hint":"The material applied to the toggle button when it's in the \"on\" state and being actively triggered. This provides visual feedback during active interaction with a checked button."}
// @input Asset.Material disabledMaterial {"hint":"The material applied to the toggle button when it's disabled and cannot be interacted with. This provides visual feedback that the button is currently inactive."}
// @input Component.RenderMeshVisual[] meshVisuals = {} {"hint":"An array of RenderMeshVisual components whose materials will be updated to reflect the toggle button's current state."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/ToggleFeedback");
Object.setPrototypeOf(script, Module.ToggleFeedback.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("toggledOffMaterial", []);
    checkUndefined("toggledOffSelectMaterial", []);
    checkUndefined("toggledOnMaterial", []);
    checkUndefined("toggledOnSelectMaterial", []);
    checkUndefined("disabledMaterial", []);
    checkUndefined("meshVisuals", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
