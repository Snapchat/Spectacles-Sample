import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {MapComponent} from "./MapComponent"
import {MapPin} from "./MapPin"
import {PlacesSync} from "./PlacesSync"

/**
 * This script adds all places stored in the {@link NavigationDataComponent} to the {@link MapComponent}.
 */
@component
export class AddPlacesToMapComponent extends PlacesSync<MapPin> {
  private mapInitialized: boolean = false

  @input private mapComponent: MapComponent

  protected override start(): void {
    super.start()

    this.mapComponent.subscribeOnUserLocationFirstSet(() => {
      this.mapInitialized = true
      this.refresh()
    })
  }

  protected override refresh(): void {
    if (!this.mapInitialized) {
      return
    }

    this.checkAddedAndRemoved(this.mapComponent.getMapPins())
  }

  protected remove(removed: MapPin[]): void {
    removed.forEach((e) => {
      this.mapComponent.removeMapPin(e)
    })
  }

  protected add(added: Place[]): MapPin[] {
    const pins: MapPin[] = []
    added.forEach((e) => {
      const newPin = this.mapComponent.createMapPinFromPlace(e)
      pins.push(newPin)
    })
    return pins
  }

  protected override isRepresentative(existing: MapPin, place: Place): boolean {
    return existing.place === place
  }
}
