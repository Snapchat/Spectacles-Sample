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
// @input Asset.Material lineMaterial {"hint":"The material used to render the interactor line visual. Can be set to InteractorLineMaterial."}
// @input vec3 _beginColor = "{1, 1, 0}" {"hint":"The color at the start (origin) of the interactor line visual.", "widget":"color"}
// @input vec3 _endColor = "{1, 1, 0}" {"hint":"The color at the end (target) of the interactor line visual.", "widget":"color"}
// @input float lineWidth = 0.5 {"hint":"The width of the interactor line visual."}
// @input float lineLength = 160 {"hint":"The default length of the interactor line visual. Controls how far the ray extends when not targeting any object."}
// @input float lineStyle = 2 {"hint":"Controls the visual style of the interactor line:\n- Full: Renders a continuous line from start to end.\n- Split: Creates a segmented line with gaps between sections.\n- FadedEnd: Gradually fades out the line toward its end point.", "widget":"combobox", "values":[{"label":"Full", "value":0}, {"label":"Split", "value":1}, {"label":"FadedEnd", "value":2}]}
// @input bool shouldStick = true {"hint":"When enabled, makes the interactor line 'stick' to targeted Interactables by pointing directly at them when the user interacts with them."}
// @input Component.ScriptComponent _interactor {"hint":"Reference to the Interactor component that this line will visualize. The line visual appears only when the referenced interactor is using Indirect targeting mode and is actively targeting."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorLineVisual/InteractorLineVisual");
Object.setPrototypeOf(script, Module.InteractorLineVisual.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("lineMaterial", []);
    checkUndefined("_beginColor", []);
    checkUndefined("_endColor", []);
    checkUndefined("lineWidth", []);
    checkUndefined("lineLength", []);
    checkUndefined("lineStyle", []);
    checkUndefined("shouldStick", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
