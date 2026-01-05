// AirHockeyPaddle.js
// Description: Controls a paddle in the Air Hockey example.

// @input Component.ScriptComponent controller

const transform = script.getTransform();
const body = script.getSceneObject().getComponent("Physics.BodyComponent");

let syncEntity;

function getPos() {
  return transform.getLocalPosition().x;
}

function getXVelocity() {
  const velocity = body.velocity;
  if (velocity.lengthSquared > 0.0001) {
    const worldToLocal = transform.getInvertedWorldTransform();
    const velLocal = worldToLocal.multiplyDirection(velocity).normalize().uniformScale(velocity.length);
    return velLocal.x;
  } else {
    return 0;
  }
}

function setPos(x) {
  let pos = transform.getLocalPosition();
  pos.x = x;
  transform.setLocalPosition(pos);
}

// Initialization

function init() {
  if (!script.controller.getSceneObject().enabled) return;
  syncEntity = new SyncEntity(script);
  syncEntity.addStorageProperty(StorageProperty.autoFloat("posX", getPos, setPos));
  print("Paddle initialized.");
}

init();

// Script API

script.syncEntity = syncEntity;
script.getXVelocity = getXVelocity;
