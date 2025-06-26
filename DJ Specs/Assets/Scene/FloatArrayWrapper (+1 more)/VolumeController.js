// @input Component.ScriptComponent audioController



script.setVolume = function(value) {
    script.audioController.volume = value;
    script.audioController.volume2 = 1.0 - value;
}


script.setVolume(0.5)