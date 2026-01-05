import {GeoLocationPlace} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/GeoLocationPlace"
import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"
import {MapPin} from "./MapPin"

/**
 * A {@link Place} that's position is defined by a {@link MapPin}.
 *
 * @remarks {@link MapPin}s locations can change at will, the {@link GeoPosition} should not be cached.
 *
 * TODO: Delete once places are fully incorporated into map component.
 */
export class MapPinPlace extends GeoLocationPlace {
  private mapPin: MapPin

  constructor(
    mapPin: MapPin,
    visitDistance: number,
    name: string,
    icon: Texture,
    description: string,
    userPosition: UserPosition
  ) {
    super(mapPin.place.getGeoPosition(), visitDistance, name, icon, description, userPosition)
    this.mapPin = mapPin
  }

  public override getGeoPosition(): GeoPosition | null {
    return this.mapPin.place.getGeoPosition()
  }

  public get name(): string {
    return this.mapPin.label.text
  }
}
