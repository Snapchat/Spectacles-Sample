import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"
import {MapComponent} from "../MapComponent/Scripts/MapComponent"

@component
export class MapMessageController extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent
  @input
  private container: ContainerFrame
  @input
  private textComponent: Text
  @input
  private renderOrder: number

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    this.container.renderOrder = this.renderOrder
    this.container.closeButton.onTrigger.add(() => this.handleCloseButtonTriggered())
    this.mapComponent.subscribeOnNoNearbyPlacesFound(() => this.showMessage("No nearby places found"))

    this.mapComponent.subscribeOnNearbyPlacesFailed(() =>
      this.showMessage("Failed to received nearby places. Please check your internet connection."),
    )

    this.handleCloseButtonTriggered()
  }

  showMessage(message: string) {
    this.container.sceneObject.enabled = true
    this.textComponent.text = message
  }

  private handleCloseButtonTriggered() {
    this.container.sceneObject.enabled = false
    this.textComponent.text = ""
  }
}
