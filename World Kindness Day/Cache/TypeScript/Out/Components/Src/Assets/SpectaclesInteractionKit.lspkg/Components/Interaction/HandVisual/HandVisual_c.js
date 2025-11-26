if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef HandVisualOverrideItem
@property {float} overrideType {"widget":"combobox", "values":[{"label":"Force Pinch Visual", "value":0}, {"label":"Force Poke Visual", "value":1}, {"label":"Exclude Pinch Visual", "value":2}, {"label":"Exclude Poke Visual", "value":3}, {"label":"Pinch Distance Override", "value":4}, {"label":"Poke Distance Override", "value":5}]}
@property {float} pinchDistance {"showIf":"overrideType", "showIfValue":4}
@property {float} pokeDistance {"showIf":"overrideType", "showIfValue":5}
*/
/*
@typedef HandVisualOverride
@property {SceneObject} interactableSceneObject
@property {HandVisualOverrideItem[]} overrides
*/
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
// @ui {"hint":"Core settings that control how the user's hand appears in the AR environment.", "widget":"group_start", "label":"Hand Visual"}
// @input bool debugModeEnabled {"hint":"Display debug rendering for the hand visual."}
// @input string handType {"hint":"Specifies which hand (Left or Right) this visual representation tracks and renders.", "widget":"combobox", "values":[{"label":"Left", "value":"left"}, {"label":"Right", "value":"right"}]}
// @input string _meshType {"hint":"Specifies the hand mesh to display. Can be changed at runtime.", "widget":"combobox", "values":[{"label":"Full", "value":"Full"}, {"label":"Index & Thumb", "value":"IndexThumb"}]}
// @input string selectVisual = "Default" {"hint":"Sets the hand visual style. \"Default\" shows glowing fingertips during interactions. \"AlwaysOn\" always shows glowing fingertips. \"Occluder\" blocks content behind the hand. \"None\" disables all hand visuals.", "widget":"combobox", "values":[{"label":"Default", "value":"Default"}, {"label":"AlwaysOn", "value":"AlwaysOn"}, {"label":"Occluder", "value":"Occluder"}, {"label":"None", "value":"None"}]}
// @input AssignableType handInteractor {"hint":"Reference to the HandInteractor component that provides gesture recognition and tracking for this hand."}
// @input Component.RenderMeshVisual handMeshFull {"hint":"Reference to the RenderMeshVisual of the full hand mesh."}
// @input Component.RenderMeshVisual handMeshIndexThumb {"hint":"The RenderMeshVisual for the index & thumb only hand."}
// @input Component.RenderMeshVisual handMeshPin {"hint":"Reference to the RenderMeshVisual of the full hand mesh to pin SceneObjects to."}
// @input float handMeshRenderOrder = 9999 {"hint":"Sets the rendering priority of the handMesh. Higher values (e.g., 9999) make the hand render on top of objects with lower values."}
// @input SceneObject root {"hint":"Reference to the parent SceneObject that contains both the hand's rig and mesh."}
// @input bool autoJointMapping = true {"hint":"When enabled, the system will automatically map tracking data to the hand model's joints. Disable only if you need manual control over individual joint assignments."}
// @ui {"widget":"group_start", "label":"Joint Setup", "showIf":"autoJointMapping", "showIfValue":false}
// @input SceneObject wrist
// @input SceneObject thumbToWrist
// @input SceneObject thumbBaseJoint
// @input SceneObject thumbKnuckle
// @input SceneObject thumbMidJoint
// @input SceneObject thumbTip
// @input SceneObject indexToWrist
// @input SceneObject indexKnuckle
// @input SceneObject indexMidJoint
// @input SceneObject indexUpperJoint
// @input SceneObject indexTip
// @input SceneObject middleToWrist
// @input SceneObject middleKnuckle
// @input SceneObject middleMidJoint
// @input SceneObject middleUpperJoint
// @input SceneObject middleTip
// @input SceneObject ringToWrist
// @input SceneObject ringKnuckle
// @input SceneObject ringMidJoint
// @input SceneObject ringUpperJoint
// @input SceneObject ringTip
// @input SceneObject pinkyToWrist
// @input SceneObject pinkyKnuckle
// @input SceneObject pinkyMidJoint
// @input SceneObject pinkyUpperJoint
// @input SceneObject pinkyTip
// @ui {"widget":"group_end"}
// @ui {"hint":"Controls the visual feedback that appears around fingertips during interactions. The glow effect provides users with real-time visual cues about interaction states: when hovering near interactive elements, actively pinching/poking,or when interactions are out of range.", "widget":"group_start", "label":"Glow Effect"}
// @input Asset.RenderMesh unitPlaneMesh {"hint":"The plane mesh on which the glow texture/material will be rendered."}
// @input Asset.Material tipGlowMaterial {"hint":"The material which will be manipulated to create the glow effect."}
// @input float tipGlowRenderOrder = 10000 {"hint":"The render order of the quad on which the tip glow effect occurs."}
// @input float tipGlowWorldScale = 0.3 {"hint":"The world scale of the quad on which the tip glow effect occurs."}
// @input vec4 hoverColor {"hint":"The color the glow will be when you are not pinching/poking.", "widget":"color"}
// @input vec4 triggerColor {"hint":"The color the glow will be when you are pinching/poking.", "widget":"color"}
// @input float triggeredLerpDurationSeconds = 0.1 {"hint":"Duration in seconds for transitioning between normal and triggered states."}
// @input float pinchValidLerpDurationSeconds = 0.25 {"hint":"Duration in seconds for transitioning pinch effects when acquiring or losing valid targets."}
// @input float pokeValidLerpDurationSeconds = 0.5 {"hint":"Duration in seconds for transitioning poke effects when acquiring or losing valid targets."}
// @ui {"widget":"group_start", "label":"Pinch Params"}
// @input float pinchBrightnessMax = 1 {"label":"Brightness Max", "hint":"Maximum brightness value for the pinch effect."}
// @input float pinchGlowBrightnessMax = 0.33 {"label":"Glow Brightness Max", "hint":"Maximum brightness value for the pinch glow's outer radial effect."}
// @input float pinchTriggeredMult = 1.2 {"label":"Triggered Mult", "hint":"Multiplier applied to pinchBrightnessMax when user is actively pinching."}
// @input float pinchBrightnessMaxStrength = 0.75 {"label":"Brightness Max Strength", "hint":"The pinch strength threshold at which maximum brightness is reached."}
// @input float pinchExponent = 2 {"label":"Exponent", "hint":"Default value for the pinch exponent uniform when not actively pinching."}
// @input float pinchExponentTriggered = 2 {"label":"Exponent Triggered", "hint":"Target value for the pinch exponent uniform when actively pinching."}
// @input float pinchHighlightThresholdFar = 18 {"label":"Highlight Threshold Far", "hint":"Distance in cm at which pinch highlighting effects begin to fade in."}
// @input float pinchHighlightThresholdNear = 4 {"label":"Highlight Threshold Near", "hint":"Distance in cm at which pinch highlighting effects reach maximum intensity."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Poke Params"}
// @input float pokeBrightnessMax = 1.1 {"label":"Brightness Max", "hint":"Maximum brightness value for the poke effect."}
// @input float pokeGlowBrightnessMax = 0.33 {"label":"Glow Brightness Max", "hint":"Maximum brightness value for the poke glow's outer radial effect."}
// @input float pokeTriggeredMult = 1.5 {"label":"Triggered Mult", "hint":"Multiplier applied to pokeBrightnessMax when user is actively poking."}
// @input float pokeHighlightThresholdFar = 18 {"label":"Highlight Threshold Far", "hint":"Distance in cm at which poke highlighting effects begin to fade in."}
// @input float pokeHighlightThresholdNear = 4 {"label":"Highlight Threshold Near", "hint":"Distance in cm at which poke highlighting effects reach maximum intensity."}
// @input float pokeOccludeThresholdFar = 12 {"label":"Occlude Threshold Far", "hint":"Distance in cm at which poke occlusion effects begin to fade in."}
// @input float pokeOccludeThresholdNear {"label":"Occlude Threshold Near", "hint":"Distance in cm at which poke occlusion effects reach maximum intensity."}
// @input float pokeExponent = 1.8 {"label":"Exponent", "hint":"Default value for the poke exponent uniform when not actively poking."}
// @input float pokeExponentTriggered = 1.2 {"label":"Exponent Triggered", "hint":"Target value for the poke exponent uniform when actively poking."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_end"}
// @ui {"hint":"Materials that control the appearance of the hand mesh by specifying materials for different hand visual styles.", "widget":"group_start", "label":"Hand Mesh Materials"}
// @input Asset.Material handOccluderMaterial {"hint":"The material which will create the occluder visual effect on the hand mesh."}
// @ui {"widget":"group_end"}
// @input HandVisualOverride[] overrides = {}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Interaction/HandVisual/HandVisual");
Object.setPrototypeOf(script, Module.HandVisual.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("debugModeEnabled", []);
    checkUndefined("handType", []);
    checkUndefined("_meshType", []);
    checkUndefined("selectVisual", []);
    checkUndefined("handInteractor", []);
    checkUndefined("handMeshRenderOrder", []);
    checkUndefined("root", []);
    checkUndefined("autoJointMapping", []);
    checkUndefined("unitPlaneMesh", []);
    checkUndefined("tipGlowMaterial", []);
    checkUndefined("tipGlowRenderOrder", []);
    checkUndefined("tipGlowWorldScale", []);
    checkUndefined("hoverColor", []);
    checkUndefined("triggerColor", []);
    checkUndefined("triggeredLerpDurationSeconds", []);
    checkUndefined("pinchValidLerpDurationSeconds", []);
    checkUndefined("pokeValidLerpDurationSeconds", []);
    checkUndefined("pinchBrightnessMax", []);
    checkUndefined("pinchGlowBrightnessMax", []);
    checkUndefined("pinchTriggeredMult", []);
    checkUndefined("pinchBrightnessMaxStrength", []);
    checkUndefined("pinchExponent", []);
    checkUndefined("pinchExponentTriggered", []);
    checkUndefined("pinchHighlightThresholdFar", []);
    checkUndefined("pinchHighlightThresholdNear", []);
    checkUndefined("pokeBrightnessMax", []);
    checkUndefined("pokeGlowBrightnessMax", []);
    checkUndefined("pokeTriggeredMult", []);
    checkUndefined("pokeHighlightThresholdFar", []);
    checkUndefined("pokeHighlightThresholdNear", []);
    checkUndefined("pokeOccludeThresholdFar", []);
    checkUndefined("pokeOccludeThresholdNear", []);
    checkUndefined("pokeExponent", []);
    checkUndefined("pokeExponentTriggered", []);
    checkUndefined("handOccluderMaterial", []);
    checkUndefined("overrides", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
