// @input Asset.AudioTrackAsset[] inputTrack
// @input Component.AudioComponent loopAudio
// @input Component.AudioComponent loopAudio2
// @input Asset.AudioTrackAsset outputAudio
// @input Component.AudioComponent audio
// @input int sampleRate
// @input SceneObject predefinedAudioParent
// @input Component.ScriptComponent gridCreator
// @input SceneObject loader
// @input SceneObject djParent

var audioData;
var audioData2;

var audioSource;

var audioSource2;

global.currentTrackIndex = 0;

var audioFrame;
var audioFrame2;
var resultFrame;

var audioOutput = script.outputAudio.control;
audioOutput.sampleRate = script.sampleRate;
audioOutput.loops = -1;

let phase = 0.0;
let phase1 = 0.0;

let trackOnDeck = false;
let trackOnDeck2 = false;

let audioArrays = [];

let loadTracksEvent = script.createEvent("DelayedCallbackEvent");

script.gridCreator.createMenu(script.inputTrack, script.setNextTrack);

loadTracks();

script.rate = 1.0;
script.rate2 = 1.0;

script.volume = 1.0;
script.volume2 = 1.0;

script.audio.play(-1);

script.setNextTrack = () => {
  script.setTrack(script.inputTrack[global.currentTrackIndex]);
};

script.setNextTrack2 = () => {
  script.setTrack2(script.inputTrack[global.currentTrackIndex]);
};

script.setTrack = (audioTrack) => {
  print(global.currentTrackIndex);
  print("SET TRACK");
  phase = 0.0;
  audioData = audioArrays[global.currentTrackIndex];
  print(audioData);

  audioSource = audioTrack.control;
  audioSource.sampleRate = script.sampleRate;
  audioSource.loops = 1;

  audioFrame = new Float32Array(audioSource.maxFrameSize);
  resultFrame = new Float32Array(audioSource.maxFrameSize);
  recordUpdate(audioTrack);
};

script.setTrack2 = (audioTrack) => {
  print(global.currentTrackIndex);
  print("SET TRACK2");
  phase1 = 0.0;
  audioData2 = audioArrays[global.currentTrackIndex];
  print(audioData2);
  audioSource2 = audioTrack.control;
  audioSource2.sampleRate = script.sampleRate;
  audioSource2.loops = 1;
  audioFrame2 = new Float32Array(audioSource2.maxFrameSize);
  resultFrame = new Float32Array(audioSource2.maxFrameSize);
  recordUpdate2(audioTrack);
};

script.setOnDeck = (onDeck) => {
  trackOnDeck = onDeck;
  audioSource = null;
  audioData = null;
  audioFrame = null;
};

script.setOnDeck2 = (onDeck) => {
  trackOnDeck2 = onDeck;
  audioSource2 = null;
  audioData2 = null;
  audioFrame2 = null;
};

function loadTracks() {
  for (let i = 0; i < script.inputTrack.length; i++) {
    // let audioComponent = script.predefinedAudioParent.createComponent("AudioComponent");
    // audioComponent.audioTrack = script.inputTrack[i];
    // audioComponent.volume = 0;
    // audioComponent.play(-1);
    let audioSource = script.inputTrack[i].control;
    let audioData = new FloatArrayWrapper();
    let audioFrame = new Float32Array(audioSource.maxFrameSize);
    let audioFrameShape = audioSource.getAudioBuffer(audioFrame, 4096);
    while (audioFrameShape.x !== 0) {
      audioData.push(audioFrame, audioFrameShape.x);
      audioFrameShape = audioSource.getAudioBuffer(audioFrame, 4096);
    }
    audioArrays[i] = audioData;
  }
}

function recordUpdate(audioTrack) {
  trackOnDeck = true;
}

function recordUpdate2(audioTrack) {
  trackOnDeck2 = true;
}

function play() {
  var size = audioOutput.getPreferredFrameSize();

  for (i = 0; i < size; i++) {
    let audioSourceUpdateData = 0.0;
    let audioSource2UpdateData = 0.0;
    if (trackOnDeck && audioData) {
      phase += script.rate;
      audioSourceUpdateData = audioData.getElement(Math.round(phase)) * script.volume;
    }
    if (trackOnDeck2 && audioData2) {
      phase1 += script.rate2;
      audioSource2UpdateData = audioData2.getElement(Math.round(phase1)) * script.volume2;
    }
    if (trackOnDeck && trackOnDeck2) {
      resultFrame[i] = audioSourceUpdateData + audioSource2UpdateData;
    } else if (trackOnDeck) {
      resultFrame[i] = audioSourceUpdateData;
    } else if (trackOnDeck2) {
      resultFrame[i] = audioSource2UpdateData;
    }
  }

  if (trackOnDeck && trackOnDeck2) {
    if (phase >= audioData.getSize() || script.rate === 0) {
      phase = 0;
    }
    if (phase1 >= audioData2.getSize() || script.rate2 === 0) {
      phase1 = 0;
    }
    audioOutput.enqueueAudioFrame(resultFrame, new vec3(size, 1, 1));
  } else if (trackOnDeck) {
    if (phase >= audioData.getSize() || script.rate === 0) {
      phase = 0;
    }
    audioOutput.enqueueAudioFrame(resultFrame, new vec3(size, 1, 1));
  } else if (trackOnDeck2) {
    if (phase1 >= audioData2.getSize() || script.rate2 === 0) {
      phase1 = 0;
    }
    audioOutput.enqueueAudioFrame(resultFrame, new vec3(size, 1, 1));
  }
}

script.createEvent("LateUpdateEvent").bind(play);
