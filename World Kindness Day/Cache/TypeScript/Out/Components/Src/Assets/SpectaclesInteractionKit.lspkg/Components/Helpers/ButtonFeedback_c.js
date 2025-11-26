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
// @input int buttonType {"hint":"Defines the interactive behavior and visual feedback style of the button:\n- Pinch Button: Standard button with hover/pinch states.\n- Toggle Button: Switches between on/off states and maintains state after interaction.\n- State Button: Similar to toggle button but with optional Persistent Pinched State.", "widget":"combobox", "values":[{"label":"Pinch Button", "value":0}, {"label":"Toggle Button", "value":1}, {"label":"State Button", "value":2}]}
// @ui {"widget":"separator"}
// @input Component.RenderMeshVisual renderMeshVisual {"hint":"The RenderMeshVisual component of the button that will be used for ButtonFeedback."}
// @input bool useGlowMesh {"hint":"When enabled, adds a glow effect to the button that can be independently animated with its own materials and blend shapes during interactions.", "showIf":"buttonType", "showIfValue":0}
// @input Component.RenderMeshVisual glowRenderMeshVisual {"hint":"The secondary mesh that displays the glow effect around the button. This mesh will receive its own material changes and blend shape animations independent from the main button mesh during interactions.", "showIf":"useGlowMesh", "showIfValue":true}
// @input float maxBlendShapeWeight = 1 {"hint":"Controls the maximum intensity of the button's deformation effect when interacted with. This scales the weight applied to the mesh's blend shape (defined by Mesh Blend Shape Name). Higher values create more pronounced visual feedback during interactions. Range: 0.0 (no effect) to 1.0 (maximum effect)."}
// @ui {"widget":"separator"}
// @input string meshBlendShapeName = "Pinch" {"hint":"References the blend shape on the button mesh that will be animated during interactions. Must match an existing blend shape name in your mesh. Default is \"Pinch\", but should be set to match a blend shape available in your mesh."}
// @input Asset.Material meshIdleMaterial {"hint":"The material applied to the button when not being interacted with (idle state)."}
// @input Asset.Material meshHoverMaterial {"hint":"The material applied to the button when an Interactor is hovering over it."}
// @input Asset.Material meshPinchedMaterial {"hint":"The material applied to the button when the user is actively interacting with it."}
// @ui {"widget":"separator"}
// @input string glowBlendShapeName = "Pinch" {"hint":"References the blend shape on the glow mesh that will be animated during interactions. Must match an existing blend shape name in your glow mesh. This controls the shape animation of the glow effect as the button is interacted with.", "showIf":"useGlowMesh", "showIfValue":true}
// @input Asset.Material glowIdleMaterial {"hint":"The material applied to the glow mesh when the button is in its default state (not being interacted with).", "showIf":"useGlowMesh", "showIfValue":true}
// @input Asset.Material glowHoverMaterial {"hint":"The material applied to the glow mesh when a user's hand is hovering over the button.", "showIf":"useGlowMesh", "showIfValue":true}
// @input Asset.Material glowPinchedMaterial {"hint":"The material applied to the glow mesh when the user is actively interacting with the button.", "showIf":"useGlowMesh", "showIfValue":true}
// @input Asset.Material meshToggledPinchedMaterial {"hint":"The material applied to the toggled button when the user is actively interacting with it.", "showIf":"buttonType", "showIfValue":1}
// @input Asset.Material meshToggledHoverMaterial {"hint":"The material applied to the button when it's in the toggled \"on\" state AND being hovered over.", "showIf":"buttonType", "showIfValue":1}
// @input Asset.Material meshToggledIdleMaterial {"hint":"The material applied to the button when it's in the toggled \"on\" state and not being interacted with.", "showIf":"buttonType", "showIfValue":1}
// @input Asset.Material meshStatePinchedMaterial {"hint":"The material applied to the State Button when it's being actively interacted with. This provides visual feedback during interaction and may remain applied after the interaction ends if persistentPinchedState is enabled.", "showIf":"buttonType", "showIfValue":2}
// @input Asset.Material meshStateHoverMaterial {"hint":"The material applied to the State Button when a user's hand is hovering over it.", "showIf":"buttonType", "showIfValue":2}
// @input Asset.Material meshStateIdleMaterial {"hint":"The material applied to the State Button when it's in its default state (not being interacted with).", "showIf":"buttonType", "showIfValue":2}
// @input bool persistentPinchedState {"hint":"When enabled, the State Button will maintain its pressed visual appearance after interaction ends while in the toggled state.", "showIf":"buttonType", "showIfValue":2}
// @ui {"widget":"separator"}
// @input Asset.Texture defaultIcon {"hint":"The texture displayed on the button in its default state (not toggled). Applied to idle, hover, and pinched materials."}
// @input Asset.Texture onIcon {"hint":"The texture displayed when the button is toggled on. Replaces defaultIcon for toggle and state buttons when activated."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/ButtonFeedback");
Object.setPrototypeOf(script, Module.ButtonFeedback.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("buttonType", []);
    checkUndefined("renderMeshVisual", []);
    checkUndefined("useGlowMesh", [["buttonType",0]]);
    checkUndefined("maxBlendShapeWeight", []);
    checkUndefined("meshBlendShapeName", []);
    checkUndefined("meshIdleMaterial", []);
    checkUndefined("meshHoverMaterial", []);
    checkUndefined("meshPinchedMaterial", []);
    checkUndefined("persistentPinchedState", [["buttonType",2]]);
    if (script.onAwake) {
       script.onAwake();
    }
});
