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
// @ui {"hint":"Manipulation capability settings for interactable objects, including translation, rotation, and scaling. Allows configuration of the manipulation root, scale limits, and rotation axes.", "widget":"group_start", "label":"Interactable Manipulation"}
// @input SceneObject manipulateRootSceneObject {"hint":"Root SceneObject of the set of SceneObjects to manipulate. If left blank, this script's SceneObject will be treated as the root. The root's transform will be modified by this script."}
// @input float minimumScaleFactor = 0.25 {"hint":"The smallest this object can scale down to, relative to its original scale. A value of 0.5 means it cannot scale smaller than 50% of its original size.", "widget":"slider", "min":0, "max":1, "step":0.05}
// @input float maximumScaleFactor = 20 {"hint":"The largest this object can scale up to, relative to its original scale. A value of 2 means it cannot scale larger than twice its original size.", "widget":"slider", "min":1, "max":20, "step":0.5}
// @input bool enableTranslation = true {"hint":"Controls whether the object can be moved (translated) in space."}
// @input bool enableRotation = true {"hint":"Controls whether the object can be rotated in space."}
// @input bool enableScale = true {"hint":"Controls whether the object can be scaled in size."}
// @input bool enableStretchZ = true {"hint":"Enhances depth manipulation by applying a distance-based multiplier to Z-axis movement. When enabled, objects that are farther away will move greater distances with the same hand movement, making it easier to position distant objects without requiring excessive physical reach."}
// @input bool showStretchZProperties {"hint":"Controls the visibility of advanced Z-stretch configuration options in the Inspector. When enabled, shows additional properties that fine-tune the distance-based Z-axis movement multiplier (Z Stretch Factor Min and Z Stretch Factor Max).", "showIf":"enableStretchZ", "showIfValue":true}
// @input float zStretchFactorMin = 1 {"hint":"The minimum multiplier applied to Z-axis movement when using stretch mode. This value is used when objects are close to the user. Higher values result in more responsive depth movement for nearby objects.", "showIf":"showStretchZProperties", "showIfValue":true}
// @input float zStretchFactorMax = 12 {"hint":"The maximum multiplier applied to Z-axis movement when using stretch mode. This value is used when objects are far away from the user. Higher values allow faster positioning of distant objects with minimal hand movement.", "showIf":"showStretchZProperties", "showIfValue":true}
// @input bool useFilter = true {"hint":"Applies filtering to smooth object manipulation movement. When enabled, a one-euro filter is applied to reduce jitter and make translations, rotations, and scaling appear more stable and natural. Disable for immediate 1:1 response to hand movements."}
// @input bool showFilterProperties {"hint":"Controls the visibility of advanced filtering options in the Inspector. When enabled, shows additional properties for fine-tuning the one-euro filter (minCutoff, beta, dcutoff) that smooths object manipulation.", "showIf":"useFilter", "showIfValue":true}
// @input float minCutoff = 2 {"hint":"Minimum cutoff frequency of the one-euro filter. Lower values reduce jitter during slow movements but increase lag. Adjust this parameter first with beta=0 to find a balance that removes jitter while maintaining acceptable responsiveness during slow movements.", "showIf":"showFilterProperties", "showIfValue":true}
// @input float beta = 0.015 {"hint":"Speed coefficient of the one-euro filter. Higher values reduce lag during fast movements but may increase jitter. Adjust this parameter after setting minCutoff to minimize lag during quick movements.", "showIf":"showFilterProperties", "showIfValue":true}
// @input float dcutoff = 1 {"hint":"Derivative cutoff frequency for the one-euro filter. Controls how the filter responds to changes in movement speed. Higher values make the filter more responsive to velocity changes.", "showIf":"showFilterProperties", "showIfValue":true}
// @input bool showTranslationProperties {"hint":"Controls the visibility of translation options in the Inspector."}
// @input bool _enableXTranslation = true {"hint":"Enables translation along the world's X-axis.", "showIf":"showTranslationProperties", "showIfValue":true}
// @input bool _enableYTranslation = true {"hint":"Enables translation along the world's Y-axis.", "showIf":"showTranslationProperties", "showIfValue":true}
// @input bool _enableZTranslation = true {"hint":"Enables translation along the world's Z-axis.", "showIf":"showTranslationProperties", "showIfValue":true}
// @input bool showRotationProperties {"hint":"Controls the visibility of rotation options in the Inspector."}
// @input string _rotationAxis = "All" {"hint":"Controls which axes the object can rotate around. \"All\" allows free rotation in any direction, while \"X\", \"Y\", or \"Z\" constrains rotation to only that specific world axis.", "widget":"combobox", "values":[{"label":"All", "value":"All"}, {"label":"X", "value":"X"}, {"label":"Y", "value":"Y"}, {"label":"Z", "value":"Z"}], "showIf":"showRotationProperties", "showIfValue":true}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Sync Kit Support"}
// @input bool isSynced {"hint":"Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab. If set to true, the InteractableManipulation's position will be synced whenever a new user joins the same Connected Lenses session. isSynced must also be enabled on the InteractableManipulation's Interactable."}
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
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation");
Object.setPrototypeOf(script, Module.InteractableManipulation.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("minimumScaleFactor", []);
    checkUndefined("maximumScaleFactor", []);
    checkUndefined("enableTranslation", []);
    checkUndefined("enableRotation", []);
    checkUndefined("enableScale", []);
    checkUndefined("enableStretchZ", []);
    checkUndefined("showStretchZProperties", [["enableStretchZ",true]]);
    checkUndefined("zStretchFactorMin", [["showStretchZProperties",true]]);
    checkUndefined("zStretchFactorMax", [["showStretchZProperties",true]]);
    checkUndefined("useFilter", []);
    checkUndefined("showFilterProperties", [["useFilter",true]]);
    checkUndefined("minCutoff", [["showFilterProperties",true]]);
    checkUndefined("beta", [["showFilterProperties",true]]);
    checkUndefined("dcutoff", [["showFilterProperties",true]]);
    checkUndefined("showTranslationProperties", []);
    checkUndefined("_enableXTranslation", [["showTranslationProperties",true]]);
    checkUndefined("_enableYTranslation", [["showTranslationProperties",true]]);
    checkUndefined("_enableZTranslation", [["showTranslationProperties",true]]);
    checkUndefined("showRotationProperties", []);
    checkUndefined("_rotationAxis", [["showRotationProperties",true]]);
    checkUndefined("isSynced", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
