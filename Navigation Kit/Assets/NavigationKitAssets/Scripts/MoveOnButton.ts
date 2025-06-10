import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"

/**
 * On pressing, a new unvisited location from the {@link NavigationDataComponent} is selected to go to.
 */
@component
export class MoveOnButton extends BaseScriptComponent {
  @input private pinchButton: PinchButton
  @input private navigation: NavigationDataComponent

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.pinchButton.onButtonPinched.add(() => this.moveOn())
      this.navigation.onAllPlacesVisited.add(() => {
        this.sceneObject.enabled = false
      })
    })
  }

  private moveOn(): void {
    this.sceneObject.enabled = false
    const places = this.navigation.places
    for (let i = 0; i < places.length; i++) {
      const place = places[i]
      if (!place.visited) {
        this.navigation.navigateToPlace(place)
        return
      }
    }
  }
}
