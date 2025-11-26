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
// @input bool _playAudioOnHover = true {"hint":"Controls whether sound feedback plays when a user's hand hovers over this Interactable."}
// @input Asset.AudioTrackAsset _hoverAudioTrack {"hint":"The sound that plays when the Interactable is hovered.", "showIf":"_playAudioOnHover", "showIfValue":true}
// @input bool _playAudioOnTriggerStart = true {"hint":"Controls whether sound feedback plays when a user starts interacting with this Interactable."}
// @input Asset.AudioTrackAsset _triggerStartAudioTrack {"hint":"The sound that plays when interaction with this Interactable begins.", "showIf":"_playAudioOnTriggerStart", "showIfValue":true}
// @input bool _playAudioOnTriggerEnd = true {"hint":"Controls whether sound feedback plays when a user stops interacting with this Interactable."}
// @input Asset.AudioTrackAsset _triggerEndAudioTrack {"hint":"The sound that plays when interaction with this Interactable ends.", "showIf":"_playAudioOnTriggerEnd", "showIfValue":true}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Assets/SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableAudioFeedback");
Object.setPrototypeOf(script, Module.InteractableAudioFeedback.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_playAudioOnHover", []);
    checkUndefined("_playAudioOnTriggerStart", []);
    checkUndefined("_playAudioOnTriggerEnd", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
