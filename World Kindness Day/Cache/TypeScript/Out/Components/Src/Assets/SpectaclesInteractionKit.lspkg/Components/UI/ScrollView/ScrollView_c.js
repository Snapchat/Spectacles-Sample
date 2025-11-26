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
// @input bool _debugDrawEnabled {"hint":"Shows visual debugging elements for scroll area bounds and content."}
// @input bool enableHorizontalScroll {"hint":"Allows content to be scrolled horizontally."}
// @input bool enableVerticalScroll = true {"hint":"Allows content to be scrolled vertically."}
// @input bool _enableScrollInertia = true {"hint":"Enables physics-based scrolling where content continues moving after release with gradual deceleration and elastic bounce-back at boundaries."}
// @input bool enableScrollLimit = true {"hint":"When enabled, prevents content from scrolling beyond designated boundaries defined by the Scroll Limit."}
// @input float _scrollLimit = 0.3 {"hint":"Controls how much content must remain visible.\n- 0: Content can scroll completely out of view.\n- 0.5: At least 50% of the content will remain in the visible area.\n- 1: Content can't scroll out of view at all.", "widget":"slider", "min":0, "max":1, "step":0.01, "showIf":"enableScrollLimit"}
// @input vec2 scrollAreaBounds = "{1, 1}" {"hint":"Defines the size of the interactive area in normalized local coordinates, where (1,1) uses the full component size."}
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Sync Kit Support"}
// @input bool isSynced {"hint":"Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. If set to true before runtime, the ScrollView's position will be synced whenever a new user joins the same Connected Lenses session."}
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
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/UI/ScrollView/ScrollView");
Object.setPrototypeOf(script, Module.ScrollView.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_debugDrawEnabled", []);
    checkUndefined("enableHorizontalScroll", []);
    checkUndefined("enableVerticalScroll", []);
    checkUndefined("_enableScrollInertia", []);
    checkUndefined("enableScrollLimit", []);
    checkUndefined("_scrollLimit", [["enableScrollLimit",true]]);
    checkUndefined("scrollAreaBounds", []);
    checkUndefined("isSynced", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
