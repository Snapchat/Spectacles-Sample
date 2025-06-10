/**
 * Used to enable content when a {@link LocatedAtComponent} has been found.
 */
@component
export class EnableObjectsOnFound extends BaseScriptComponent {
  @input locatedAtComponent: LocatedAtComponent
  @input objects: SceneObject[]

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.objects.forEach((element) => {
        element.enabled = false
      })
      this.locatedAtComponent.onFound.add(() => {
        this.objects.forEach((element) => {
          element.enabled = true
        })
      })
    })
  }
}
