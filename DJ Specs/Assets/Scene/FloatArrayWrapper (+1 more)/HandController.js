// @input SceneObject handObject
// @input SceneObject handObject1
// @input SceneObject vinylCenterObject
// @input Component.Camera cam
// @input Component.ObjectTracking3D tracking
// @input Component.ObjectTracking3D tracking1

let tracking = script.tracking;
let tracking1 = script.tracking1;
let transform = script.handObject.getTransform();
let transform1 = script.handObject1.getTransform();
let vinylTransform = script.vinylCenterObject.getTransform();
let prevPosition = null;
let prevAngle = null;
let prevSpeed = 0;
let handPosition = vec3.zero();

script.speed = 0.0;
script.angle = 1.0;
script.position = vec3.zero();
script.isTracking = false;

function getRotationDirection(handPosition) {
  let vinylPosition = vinylTransform.getWorldPosition();
  let directionVector = handPosition.sub(vinylPosition);
  let upVec = vec3.right();
  let angle = upVec.angleTo(directionVector);
  if (prevAngle === null) {
    prevAngle = angle;
  }
  let resultAngle = angle - prevAngle;
  if (handPosition.z > vinylPosition.z) {
    resultAngle = -resultAngle;
  }
  prevAngle = angle;
  return resultAngle;
}

function getTouchMoveSpeed(handPosition) {
  if (prevPosition === null) {
    prevPosition = handPosition;
  }
  let speed = handPosition.distance(prevPosition);
  prevPosition = handPosition;
  return speed;
}

function onTouchStartedOrMoved(eventData) {
  let vinylPosition = vinylTransform.getWorldPosition();
  if (tracking1.isTracking() && tracking.isTracking()) {
    let distance1 = transform1.getWorldPosition().distance(vinylPosition);
    let distance = transform.getWorldPosition().distance(vinylPosition);
    if (distance >= distance1) {
      handPosition = transform1.getWorldPosition();
    } else {
      handPosition = transform.getWorldPosition();
    }
  } else if (tracking1.isTracking()) {
    handPosition = transform1.getWorldPosition();
  } else if (tracking.isTracking()) {
    handPosition = transform.getWorldPosition();
  }

  if (
    new vec3(0, handPosition.y, 0).distance(new vec3(0, vinylPosition.y, 0)) < 10 &&
    new vec2(handPosition.x, handPosition.z).distance(new vec2(vinylPosition.x, vinylPosition.z)) < 15
  ) {
    script.isTracking = true;

    script.angle = getRotationDirection(handPosition);
    script.speed = getTouchMoveSpeed(handPosition) * 0.01;
  } else {
    script.isTracking = false;
    prevAngle = null;
    prevSpeed = null;
  }
}

script.createEvent("UpdateEvent").bind(onTouchStartedOrMoved);
