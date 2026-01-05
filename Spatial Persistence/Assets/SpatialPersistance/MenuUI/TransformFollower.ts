/**
 * A simple button using SpectaclesInteractionKit events to signal user intent to select a certain area and load serialized content.
 */
@component
export class TransformFollower extends BaseScriptComponent {
  private transform: Transform = this.getTransform()
  private target: Transform
  private translationOffset: vec3
  private rotationOffset: quat

  onAwake() {
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  onUpdate() {
    if (this.target == null) {
      return
    }

    const rotation = this.target.getWorldRotation().multiply(this.rotationOffset)
    const position = this.target.getWorldPosition().add(rotation.multiplyVec3(this.translationOffset))

    this.transform.setWorldTransform(mat4.compose(position, rotation, vec3.one()))
  }

  public setTarget(target: Transform, translationOffset: vec3, rotationOffset: quat) {
    this.target = target

    this.translationOffset = translationOffset
    this.rotationOffset = rotationOffset
  }
}
