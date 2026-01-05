/**
 * Attach to an instance of {@link CustomLocationGroup} to disable location
 * meshes when on device but leaving them on in Lens Studio.
 */
@component
export class DeactivateLocationMeshOnDevice extends BaseScriptComponent {
  private onAwake(): void {
    if (global.deviceInfoSystem.isEditor()) {
      return
    }
    this.createEvent("OnStartEvent").bind(() => {
      this.deactivateChildMeshes()
    })
  }

  private deactivateChildMeshes(): void {
    const locatedAtChildren = this.sceneObject.children.map((element) => element.getComponent("LocatedAtComponent"))
    const withMeshVisualAttached = locatedAtChildren.map((element) =>
      element?.sceneObject.getComponent("RenderMeshVisual")
    )
    withMeshVisualAttached.forEach((element) => {
      element.enabled = false
    })
  }
}
