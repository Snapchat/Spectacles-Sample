//@input float speed = 1.0
//@input vec3 axis = {0,1,0}
let t = script.getSceneObject().getTransform();

script.createEvent("UpdateEvent").bind(function () {
  var rot = quat.angleAxis(script.speed * getDeltaTime(), script.axis);
  t.setLocalRotation(rot.multiply(t.getLocalRotation()));
});
