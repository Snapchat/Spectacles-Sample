// @input Component.AnimationPlayer vinylShow
// @input Component.AnimationAsset vinylShowAsset
// @input string firstClipName
// @input string secondClipName
// @input string thirdClipName
// @input SceneObject movableVinyl
// @input SceneObject defaultDisk
// @input SceneObject deckLeft
// @input SceneObject deckRight
// @input Component.ScriptComponent vinylInteractable
// @input Component.ScriptComponent leftRotator
// @input Component.ScriptComponent rightRotator

const BLUE_COLOR = new vec4(165, 241, 255, 255).uniformScale(1 / 255);
const PINK_COLOR = new vec4(186, 123, 255, 255).uniformScale(1 / 255);

const movableTransform = script.movableVinyl.getTransform();
const deckLeftTransform = script.deckLeft.getTransform();
const deckRightTransform = script.deckRight.getTransform();

const movablePass = script.movableVinyl.getComponent("RenderMeshVisual").mainMaterial.mainPass;
const leftDeckPass = script.deckLeft.getComponent("RenderMeshVisual").mainMaterial.mainPass;
const rightDeckPass = script.deckRight.getComponent("RenderMeshVisual").mainMaterial.mainPass;

const REFL_BLUE = movablePass.Tweak_N15;
const REFL_PINK = leftDeckPass.Tweak_N15;

let DEFAULT_POSITION = null;
let DEFAULT_ROTATION = null;

const MANIPULATION_START_EVENT_NAME = "manipulation_start";

let isMoving = false;
let isOutOfBox = false;

initialize();

function initialize() {
  setColor(movablePass, PINK_COLOR, REFL_PINK);
  script.vinylInteractable.setCanTranslate(false);
  script.vinylInteractable.onTranslationStart.add(() => {
    if (!isMoving) {
      let prevClip = script.vinylShow.getClip(script.firstClipName);
      let clip = script.vinylShow.getClip(script.secondClipName);
      prevClip.weight = 0.0;
      clip.weight = 1.0;
      script.vinylShow.playClipAt(script.secondClipName, clip.begin);
      isMoving = true;
      isOutOfBox = true;
    }
  });

  script.vinylInteractable.onTranslationEndEvent.add(() => {
    if (isOutOfBox) {
      isMoving = false;
    }
  });

  script.vinylShow.onEvent.add(function (eventData) {
    if (eventData.eventName === MANIPULATION_START_EVENT_NAME) {
      if (!script.leftRotator.isOnDeck() || !script.rightRotator.isOnDeck()) {
        script.vinylInteractable.setCanTranslate(true);
      }
    }
  });
}

script.setTrack = (InteractorEvent) => {
  global.currentTrackIndex = InteractorEvent.target.getSceneObject().getParent().getComponent("ScriptComponent").index;
  if (movablePass.Tweak_N1.distance(BLUE_COLOR) < 0.1) {
    setColor(movablePass, PINK_COLOR, REFL_PINK);
  } else {
    setColor(movablePass, BLUE_COLOR, REFL_BLUE);
  }
  showTrack();
};

function showTrack() {
  isMoving = false;

  script.vinylInteractable.setCanTranslate(false);

  if (DEFAULT_POSITION) {
    movableTransform.setWorldPosition(script.defaultDisk.getTransform().getWorldPosition());
  } else {
    DEFAULT_POSITION = script.defaultDisk.getTransform().getWorldPosition();
  }
  if (DEFAULT_ROTATION) {
    movableTransform.setWorldRotation(script.defaultDisk.getTransform().getWorldRotation());
  } else {
    DEFAULT_ROTATION = script.defaultDisk.getTransform().getWorldRotation();
  }
  if (script.vinylShow) {
    let prevClip = script.vinylShow.getClip(script.secondClipName);
    let clip = script.vinylShow.getClip(script.firstClipName);
    prevClip.weight = 0.0;
    clip.weight = 1.0;
    script.vinylShow.playClipAt(script.firstClipName, clip.begin);
    script.vinylShowAsset.createEvent(MANIPULATION_START_EVENT_NAME, clip.duration);
  }
}

let movableEvent = script.createEvent("UpdateEvent");
movableEvent.bind(() => {
  if (script.leftRotator.isOnDeck() && script.rightRotator.isOnDeck()) {
    script.vinylInteractable.setCanTranslate(true);
  }
  let movablePosition = movableTransform.getWorldPosition();
  let movableRotation = movableTransform.getWorldRotation();
  let leftDeckPosition = script.leftRotator.getDeckPosition();
  let leftDeckRotation = script.leftRotator.getDeckRotation();
  let rightDeckPosition = script.rightRotator.getDeckPosition();
  let rightDeckRotation = script.rightRotator.getDeckRotation();

  if (isMoving) {
    if (leftDeckPosition.distance(movablePosition) < 50) {
      // 30
      isOutOfBox = false;
      movableTransform.setWorldRotation(quat.slerp(movableRotation, leftDeckRotation, 0.3));
      movableTransform.setWorldPosition(vec3.lerp(movablePosition, leftDeckPosition, 0.3));
      if (leftDeckPosition.distance(movablePosition) < 0.2) {
        //0.2
        movableTransform.setWorldPosition(DEFAULT_POSITION);
        movableTransform.setWorldRotation(DEFAULT_ROTATION);
        if (movablePass.Tweak_N1.distance(BLUE_COLOR) < 0.1) {
          setColor(leftDeckPass, BLUE_COLOR, REFL_BLUE);
        } else {
          setColor(leftDeckPass, PINK_COLOR, REFL_PINK);
        }
        script.vinylInteractable.setCanTranslate(false);
        isMoving = false;
      } else if (leftDeckPosition.distance(movablePosition) < 0.3) {
        if (!script.leftRotator.isOnDeck()) {
          script.leftRotator.setOnDeck(true);
        }
      }
    } else if (rightDeckPosition.distance(movablePosition) < 50) {
      // 30
      isOutOfBox = false;
      let movableRotation = movableTransform.getWorldRotation();
      movableTransform.setWorldRotation(quat.slerp(movableRotation, rightDeckRotation, 0.3));
      movableTransform.setWorldPosition(vec3.lerp(movablePosition, rightDeckPosition, 0.3));
      if (rightDeckPosition.distance(movablePosition) < 0.2) {
        //0.2
        if (!script.rightRotator.isOnDeck()) {
          script.rightRotator.setOnDeck(true);
        }
        movableTransform.setWorldPosition(DEFAULT_POSITION);
        movableTransform.setWorldRotation(DEFAULT_ROTATION);
        if (movablePass.Tweak_N1.distance(BLUE_COLOR) < 0.3) {
          setColor(rightDeckPass, BLUE_COLOR, REFL_BLUE);
        } else {
          setColor(rightDeckPass, PINK_COLOR, REFL_PINK);
        }
        isMoving = false;
      } else if (rightDeckPosition.distance(movablePosition) < 0.1) {
        script.vinylInteractable.setCanTranslate(false);
      }
    }
  } else {
    if (!isOutOfBox) {
      return;
    }
    if (DEFAULT_ROTATION) {
      movableTransform.setWorldRotation(quat.slerp(movableRotation, DEFAULT_ROTATION, 0.5));
    }
    if (DEFAULT_POSITION) {
      movableTransform.setWorldPosition(vec3.lerp(movablePosition, DEFAULT_POSITION, 0.5));
    }
    if (DEFAULT_POSITION.distance(movablePosition) < 0.1) {
      isOutOfBox = false;
    }
  }
});

function setColor(pass, color, refl) {
  pass.Tweak_N1 = color;
  pass.Tweak_N15 = refl;
}
