@component
export class LoadingIndicatorController extends BaseScriptComponent {
  @input
  private speed: number

  private transform: Transform

  onAwake() {
    this.transform = this.sceneObject.getTransform()
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  onUpdate() {
    const rotationQuaternion: quat = quat.angleAxis(this.speed * getDeltaTime(), this.transform.up)
    this.transform.setWorldRotation(rotationQuaternion.multiply(this.transform.getWorldRotation()))
  }
}
