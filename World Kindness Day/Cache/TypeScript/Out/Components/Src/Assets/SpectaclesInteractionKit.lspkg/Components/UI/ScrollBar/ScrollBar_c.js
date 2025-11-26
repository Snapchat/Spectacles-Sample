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
// @input Component.RenderMeshVisual _scrollBarMeshVisual {"hint":"The mesh visual of the scroll bar, used to calculate the height offset that should be used to prevent the mesh from extending past the canvas. This mesh will also be disabled whenever setting this component to disabled."}
// @input float _boundingHeightOffset {"hint":"Additional offset (in cm) determining how far the top edge of the ScrollBar mesh should sit from the edge of the canvas when at the top of the content."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/UI/ScrollBar/ScrollBar");
Object.setPrototypeOf(script, Module.ScrollBar.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_boundingHeightOffset", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
