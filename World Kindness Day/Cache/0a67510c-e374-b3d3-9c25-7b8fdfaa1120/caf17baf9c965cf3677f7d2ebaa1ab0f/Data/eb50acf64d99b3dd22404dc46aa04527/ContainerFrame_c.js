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
// @ui {"hint":"Controls the appearance, size, and interaction behavior of the container frame.", "widget":"group_start", "label":"Frame Settings"}
// @input bool autoShowHide = true {"hint":"When enabled, the frame automatically appears when hovered and hides when not being interacted with. Disable to manually control frame visibility."}
// @input vec2 innerSize = "{32,32}" {"hint":"Size of the container's inner content area."}
// @input float border = 7 {"hint":"Width of the border around the container."}
// @input vec2 constantPadding = "{0,0}" {"hint":"Extra padding that maintains a fixed size in centimeters regardless of frame scaling, useful for toolbars and fixed-size UI elements."}
// @input bool allowScaling = true {"hint":"Enables interactive scaling of the container frame via corner handles."}
// @input bool autoScaleContent = true {"hint":"Automatically scales child content when the frame is resized to maintain proportions."}
// @input bool relativeZ {"hint":"When enabled, Z-axis scaling of content will match X-axis scaling during frame resizing."}
// @input bool isContentInteractable {"hint":"When enabled, allows interaction with content inside the container and hides the container's glow for visual clarity."}
// @input bool allowTranslation = true {"hint":"Enables moving the container frame."}
// @input bool cutOut {"hint":"When enabled, creates a transparent center in the frame, allowing content behind the container to be visible."}
// @ui {"widget":"group_end"}
// @ui {"widget":"label", "label":""}
// @ui {"hint":"Sets the minimum and maximum dimensions that the container frame can be resized to.", "widget":"group_start", "label":"Min/Max Size"}
// @input vec2 minimumSize = "{10,10}" {"hint":"Minimum dimensions in world units (cm) that the container can be resized to."}
// @input vec2 maximumSize = "{150,150}" {"hint":"Maximum dimensions in world units (cm) that the container can be resized to."}
// @ui {"widget":"group_end"}
// @ui {"widget":"label", "label":""}
// @ui {"hint":"Controls how the container frame automatically rotates to face the camera/user.", "widget":"group_start", "label":"Billboarding"}
// @input bool useBillboarding {"hint":"Enables the container to automatically rotate to face the camera/user."}
// @input bool xOnTranslate {"hint":"When enabled, the container rotates around the X-axis to face the user, but only during movement/translation unless xAlways is also enabled.", "showIf":"useBillboarding"}
// @input bool xAlways {"hint":"When enabled, the container continuously rotates around the X-axis to face the user, regardless of movement.", "showIf":"xOnTranslate"}
// @input bool yOnTranslate {"hint":"When enabled, the container rotates around the Y-axis to face the user, but only during movement/translation unless yAlways is also enabled.", "showIf":"useBillboarding"}
// @input bool yAlways {"hint":"When enabled, the container continuously rotates around the Y-axis to face the user, regardless of movement.", "showIf":"yOnTranslate"}
// @ui {"widget":"group_end"}
// @ui {"widget":"label", "label":""}
// @ui {"hint":"Controls how the container snaps to other containers or world features when moved.", "widget":"group_start", "label":"Snapping"}
// @input bool useSnapping {"hint":"Enables container snapping functionality for automatic alignment to other containers or world features when moved."}
// @input bool itemSnapping {"hint":"Enables snapping to other containers when moving.", "showIf":"useSnapping"}
// @input bool worldSnapping {"hint":"Enables snapping to physical surfaces in the real-world environment when moving.", "showIf":"useSnapping"}
// @ui {"widget":"group_end"}
// @ui {"widget":"label", "label":""}
// @ui {"hint":"Controls whether the container automatically follows the user's view when moving around.", "widget":"group_start", "label":"Follow Behavior"}
// @input bool showFollowButton {"hint":"Shows a button that allows users to toggle whether the container follows their view as they move."}
// @input bool useFOVFollow {"label":"Front Follow Behavior", "hint":"When enabled, creates a follow behavior that keeps the container in front of the user's view.", "showIf":"showFollowButton"}
// @input bool isFollowing {"hint":"Controls whether the container actively follows the user's view. Setting this defines the initial state.", "showIf":"useFOVFollow"}
// @ui {"widget":"group_end"}
// @ui {"widget":"label", "label":""}
// @ui {"hint":"Controls whether a close button is displayed in the corner of the container.", "widget":"group_start", "label":"Close Button"}
// @input bool showCloseButton = true {"hint":"Shows a button that allows users to close or dismiss the container."}
// @ui {"widget":"group_end"}
// @ui {"hint":"Settings for an interaction plane that extends around the container.", "widget":"group_start", "label":"Interaction Plane"}
// @input bool _enableInteractionPlane {"hint":"Enables an Interaction Plane that creates a near-field targeting zone around the container that improves precision when interacting with buttons and UI elements using hand tracking."}
// @input float _targetingVisual {"hint":"Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).\n\n- 0: None\n- 1: Cursor (default)\n- 2: Ray", "widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Cursor", "value":1}, {"label":"Ray", "value":2}], "showIf":"_enableInteractionPlane"}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Sync Kit Support"}
// @input bool isSynced {"hint":"Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. If set to true, the Container's position will be synced whenever a new user joins the same Connected Lenses session."}
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
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame");
Object.setPrototypeOf(script, Module.ContainerFrame.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("autoShowHide", []);
    checkUndefined("innerSize", []);
    checkUndefined("border", []);
    checkUndefined("constantPadding", []);
    checkUndefined("allowScaling", []);
    checkUndefined("autoScaleContent", []);
    checkUndefined("relativeZ", []);
    checkUndefined("isContentInteractable", []);
    checkUndefined("allowTranslation", []);
    checkUndefined("cutOut", []);
    checkUndefined("minimumSize", []);
    checkUndefined("maximumSize", []);
    checkUndefined("useBillboarding", []);
    checkUndefined("xOnTranslate", [["useBillboarding",true]]);
    checkUndefined("xAlways", [["xOnTranslate",true]]);
    checkUndefined("yOnTranslate", [["useBillboarding",true]]);
    checkUndefined("yAlways", [["yOnTranslate",true]]);
    checkUndefined("useSnapping", []);
    checkUndefined("itemSnapping", [["useSnapping",true]]);
    checkUndefined("worldSnapping", [["useSnapping",true]]);
    checkUndefined("showFollowButton", []);
    checkUndefined("useFOVFollow", [["showFollowButton",true]]);
    checkUndefined("isFollowing", [["useFOVFollow",true]]);
    checkUndefined("showCloseButton", []);
    checkUndefined("_enableInteractionPlane", []);
    checkUndefined("_targetingVisual", [["_enableInteractionPlane",true]]);
    checkUndefined("isSynced", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
