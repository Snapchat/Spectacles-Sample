import {MapComponent} from "MapComponent/Scripts/MapComponent"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"

/**
 * This script scales the {@link MapComponent} so that both the users pin and the destination pin are visible at the
 * same time.
 */
@component
export class MapAnimator extends BaseScriptComponent {
  private userPosition: UserPosition

  @input private navigationComponent: NavigationDataComponent
  @input private mapComponent: MapComponent

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.start()
    })
  }

  private start(): void {
    this.userPosition = this.navigationComponent.getUserPosition()
    this.navigationComponent.onNavigationStarted.add((place) => {
      if (isNull(place)) {
        return
      }

      const placeGeo = place.getGeoPosition()
      const userGeo = this.userPosition.getGeoPosition()

      if (isNull(placeGeo) || isNull(userGeo)) {
        return
      }

      const halfLat = (placeGeo.latitude + userGeo.latitude) / 2
      const halfLong = (placeGeo.longitude + userGeo.longitude) / 2

      const latitudeDelta = placeGeo.latitude - userGeo.latitude
      const longitudeDelta = placeGeo.longitude - userGeo.longitude
      const angularDifference = Math.sqrt(latitudeDelta * latitudeDelta + longitudeDelta * longitudeDelta)

      const mapZoom = this.getMapZoom(angularDifference) - 2

      const midwayGeo = GeoPosition.create()
      midwayGeo.longitude = halfLong
      midwayGeo.latitude = halfLat

      this.mapComponent.setMapPosition(midwayGeo)
      this.mapComponent.setZoom(Math.floor(mapZoom))
    })
  }

  private getMapZoom(angularDistance: number): number {
    return -Math.log2(angularDistance / 360)
  }
}
