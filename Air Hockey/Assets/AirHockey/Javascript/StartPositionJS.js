// @input SceneObject camera

const cameraTransform = script.camera.getTransform();
const transform = script.getSceneObject().getTransform();

function setPosition() {
  if (global.sessionController.getUsers().length === 1) {
    let cameraPosition = cameraTransform.getWorldPosition();
    let offset = cameraTransform.forward.mult(new vec3(1, 0, 1)).uniformScale(-100);
    offset.y = -60;
    let startPosition = cameraPosition.add(offset);
    transform.setWorldPosition(startPosition);
    script.getSceneObject().enabled = true;
    print("Start position set");
  }
}

global.sessionController.notifyOnReady(setPosition);
