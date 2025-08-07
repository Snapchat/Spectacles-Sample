@component
export class ScaleResetter extends BaseScriptComponent {
  private innerObject: SceneObject = global.scene.createSceneObject("ScaleResetter")

  private innerTransform = this.innerObject.getTransform()

  private transform = this.sceneObject.getTransform()
  private parent = this.sceneObject.getParent()
  private parentTransform = this.parent?.getTransform()

  private lastScale: vec3 = vec3.one()

  onAwake() {
    const parent = this.sceneObject.getParent()
    if (parent !== null) {
      this.innerObject.setParent(parent)
    }
    this.sceneObject.setParent(this.innerObject)
    this.resetScale()

    this.createEvent("UpdateEvent").bind(this.onUpdate)
  }

  onUpdate = () => {
    this.resetScale()
  }

  private resetScale = () => {
    if (this.parent !== null) {
      const currentScale = this.parentTransform.getWorldScale()
      if (!currentScale.equal(this.lastScale)) {
        this.innerTransform.setLocalScale(vec3.one().div(currentScale))
        this.lastScale = currentScale.uniformScale(1)
      }
    }
  }
}
