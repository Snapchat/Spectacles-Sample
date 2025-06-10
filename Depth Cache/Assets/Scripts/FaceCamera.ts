@component
export class FaceCamera extends BaseScriptComponent {
  @input
  camera: SceneObject;

  private camTransform: Transform;
  private transform: Transform;
  onAwake() {
    this.transform = this.getTransform();
    this.camTransform = this.camera.getTransform();
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  onUpdate() {
    var worldCameraForward = this.camTransform.right.cross(vec3.up());
    var lookRot = quat.lookAt(worldCameraForward, vec3.up());
    this.transform.setWorldRotation(lookRot);
  }
}
