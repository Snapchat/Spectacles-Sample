// AirHockeyPuck.js
// Description: Puck controller used in Air Hockey.

// @input Component.ScriptComponent controller

const puckBody = script.getSceneObject().getComponent("Physics.BodyComponent");
const transform = script.getTransform();

const MAX_ADDED_VELOCITY = 20;

let syncEntity;
let posProp;
let velocityProp;
let timestampProp;
let isResetting;

function extrapolatePos(pos, velocity, initialTime, currentTime) {
  const elapsedTime = currentTime - initialTime;
  return pos.add(velocity.uniformScale(elapsedTime));
}

function resetPuck() {
  if (isResetting) return;

  isResetting = true;
  transform.setLocalPosition(vec3.zero());
  updateMovementState(vec3.zero(), vec3.zero());

  const delayEvent = script.createEvent("DelayedCallbackEvent");
  delayEvent.bind(function () {
    script.removeEvent(delayEvent);
    isResetting = false;
    startMovement();
  });
  delayEvent.reset(1.5);
}

function startMovement() {
  const initVelocity = new vec3(randomRange(-20, 20), 0, randomChoice(-1, 1) * 40);
  updateMovementState(transform.getLocalPosition(), initVelocity);
}

function updateMovementState(position, velocity) {
  posProp.setPendingValue(position);
  velocityProp.setPendingValue(velocity);
  timestampProp.setPendingValue(global.sessionController.getServerTimeInSeconds());
}

// Collider Callback

function onCollisionEnter(collisionArgs) {
  const collision = collisionArgs.collision;
  const otherObj = collision.collider.getSceneObject();

  // Collision with wall
  if (otherObj.name.startsWith("Wall")) {
    const normal = collision.contacts[0].normal;
    const worldToLocal = transform.getInvertedWorldTransform();
    const relativePos = worldToLocal.multiplyDirection(normal);
    let curVelocity = velocityProp.currentOrPendingValue;

    if (Math.abs(relativePos.x) > 0.005) {
      curVelocity.x *= -1;
    }

    if (Math.abs(relativePos.z) > 0.005) {
      curVelocity.z *= -1;
    }

    updateMovementState(transform.getLocalPosition(), curVelocity);

    return;
  }

  // Collision with paddle
  if (otherObj.name.startsWith("Paddle")) {
    let paddleVelocity = velocityProp.currentOrPendingValue;
    paddleVelocity.z *= -1;

    const otherVel = collision.collider.velocity;
    const paddleWorldToLocal = transform.getInvertedWorldTransform();
    const otherVelLocal = paddleWorldToLocal.multiplyDirection(otherVel).normalize().uniformScale(otherVel.length);

    paddleVelocity.x += Math.max(-MAX_ADDED_VELOCITY, Math.min(otherVelLocal.x, MAX_ADDED_VELOCITY));
    paddleVelocity = paddleVelocity.uniformScale(1.1);

    updateMovementState(transform.getLocalPosition(), paddleVelocity);
  }
}

// Update -----

function onUpdate() {
  if (!syncEntity.isSetupFinished) return;

  // Update puck position
  const startTime = timestampProp.currentOrPendingValue;
  let newPos = extrapolatePos(
    posProp.currentOrPendingValue,
    velocityProp.currentOrPendingValue,
    startTime,
    global.sessionController.getServerTimeInSeconds()
  );
  newPos.y = 0;
  transform.setLocalPosition(newPos);
  transform.setLocalRotation(quat.quatIdentity());
}

// Initialization -----

function init() {
  if (!script.controller.getSceneObject().enabled) return;

  syncEntity = new SyncEntity(script, null, false);

  // Last known position
  posProp = syncEntity.addStorageProperty(StorageProperty.manualVec3("pos", transform.getLocalPosition()));

  // Last known velocity
  velocityProp = syncEntity.addStorageProperty(StorageProperty.manualVec3("velocity", vec3.zero()));

  // Timestamp of last change
  timestampProp = syncEntity.addStorageProperty(StorageProperty.manualDouble("lastChanged", -1));

  syncEntity.notifyOnReady(function () {
    // Set up collisions
    puckBody.onCollisionEnter.add(onCollisionEnter);
  });

  isResetting = false;

  puckBody.overlapFilter.includeStatic = true;

  print("Puck initialized.");

  script.createEvent("UpdateEvent").bind(onUpdate);
}

init();

// Script API -----

script.syncEntity = syncEntity;
script.resetPuck = resetPuck;
script.startMovement = startMovement;
script.bodyComponent = puckBody;

// Helpers -----

/**
 * Returns a random value between `min` and `max`
 * @param {number} min
 * @param {number} max
 * @returns {number} Random value between `min` and `max`
 */

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * @template T
 * @param {...T} args
 * @returns {T}
 */

function randomChoice(args) {
  return arguments[Math.floor(Math.random() * arguments.length)];
}
