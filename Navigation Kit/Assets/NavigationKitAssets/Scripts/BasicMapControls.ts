import {MapComponent} from "MapComponent/Scripts/MapComponent"
import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"

/**
 * A simplified script that adds {@link PinchButton} controls to the {@link MapComponent}.
 */
@component
export class BasicMapControls extends BaseScriptComponent {
  @input
  private zoomInButton: PinchButton
  @input
  private zoomOutButton: PinchButton
  @input
  private centerMapButton: PinchButton
  @input
  private mapComponent: MapComponent

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.zoomInButton.onButtonPinched.add(() => {
        this.mapComponent.zoomIn()
      })
      this.zoomOutButton.onButtonPinched.add(() => {
        this.mapComponent.zoomOut()
      })
      this.centerMapButton.onButtonPinched.add(() => {
        this.mapComponent.centerMap()
      })
    })
  }
}
