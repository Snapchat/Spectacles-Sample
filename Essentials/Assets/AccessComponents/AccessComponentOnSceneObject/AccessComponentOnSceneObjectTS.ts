@component
export class AccessComponentOnSceneObjectTS extends BaseScriptComponent {
  @input
  @allowUndefined
  @hint("The object to access the component from")
  mySceneObject: SceneObject

  @input
  @allowUndefined
  @hint("Show logs in the console")
  debug: boolean

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
      this.debug && print("Start event triggered")
    })
  }

  onStart() {
    this.debug && print("onAwake")

    if (this.mySceneObject !== null) {
      this.debug && print("Scene object is not null")
      this.debug && print("Scene object name: " + this.mySceneObject.name)
    }

    if (this.mySceneObject.getComponent("Component.RenderMeshVisual").getTypeName()) {
      this.debug && print("Scene object has a RenderMeshVisual component")
    } else {
      this.debug && print("Scene object does not have a RenderMeshVisual component")
    }
  }
}
