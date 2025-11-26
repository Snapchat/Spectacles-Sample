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
// @input AssignableType slider
// @input SceneObject animationAButton
// @input SceneObject animationBButton
// @input SceneObject animationCButton
// @input SceneObject launchButton
// @input AssignableType_1 rocketConf
// @input SceneObject launchSparks
// @input Component.AnimationPlayer rocketAnimationPlayer
// @input Component.AudioComponent rocketAudioComponent
// @input Asset.AudioTrackAsset rocketLaunchSFX
// @input Asset.AudioTrackAsset rocketLandSFX
// @input Component.Text flightPathText
// @input AssignableType_2 launchPlatformToggleButton
// @input SceneObject launchPlatform
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Packages/SpectaclesInteractionKitExamples.lspkg/Examples/RocketWorkshop/Scripts/RocketLaunchControl");
Object.setPrototypeOf(script, Module.RocketLaunchControl.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("slider", []);
    checkUndefined("animationAButton", []);
    checkUndefined("animationBButton", []);
    checkUndefined("animationCButton", []);
    checkUndefined("launchButton", []);
    checkUndefined("rocketConf", []);
    checkUndefined("launchSparks", []);
    checkUndefined("rocketAnimationPlayer", []);
    checkUndefined("rocketAudioComponent", []);
    checkUndefined("rocketLaunchSFX", []);
    checkUndefined("rocketLandSFX", []);
    checkUndefined("flightPathText", []);
    checkUndefined("launchPlatformToggleButton", []);
    checkUndefined("launchPlatform", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
