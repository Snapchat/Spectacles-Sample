/**
 * Used to enable content when a {@link LocatedAtComponent} has been found.
 */
@component
export class EnableMeshOnFound extends BaseScriptComponent {
  @input private locatedAtComponent: LocatedAtComponent
  @input private renderMesh: RenderMeshVisual

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.renderMesh.enabled = false
      this.locatedAtComponent.onFound.add(() => {
        this.renderMesh.enabled = true
      })
    })
  }
}
