@component
export class AccessComponentOnChildSceneObjectTS extends BaseScriptComponent {
  @input
  @allowUndefined
  @hint("The parent component")
  parentSceneobject: SceneObject

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

    if (this.parentSceneobject !== null && this.parentSceneobject.getChild(0) !== null) {
      this.debug && print("Parent scene object is not null")
      this.debug && print("Parent scene object name: " + this.parentSceneobject.name)
      this.debug && print("Parent child object name: " + this.parentSceneobject.getChild(0).name)
    }

    if (this.parentSceneobject.getChild(0).getComponent("Component.RenderMeshVisual").getTypeName()) {
      this.debug && print("Parent child object has a RenderMeshVisual component")
    } else {
      this.debug && print("Parent child object does not have a RenderMeshVisual component")
    }
  }
}
