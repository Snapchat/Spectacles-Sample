import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"

@component
export class TourFinishText extends BaseScriptComponent {
  @input navigationComponent: NavigationDataComponent

  @input duringTourObjects: SceneObject[]

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.navigationComponent.onAllPlacesVisited.add(() => {
        this.finishExperience()
      })

      this.sceneObject.enabled = false
    })
  }

  private finishExperience(): void {
    this.sceneObject.enabled = true
    this.duringTourObjects.forEach((e) => {
      if (!isNull(e)) {
        e.enabled = false
      }
    })
  }
}
