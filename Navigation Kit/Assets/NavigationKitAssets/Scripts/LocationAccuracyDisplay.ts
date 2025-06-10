import {UserPosition, UserPositionStatus} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"

import { MapController } from "../../MapComponent/Scripts/MapController"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"

/**
 * Scales a graphic representation of the current accuracy reported from the {@link UserPosition}.
 */
@component
export class LocationAccuracyDisplay extends BaseScriptComponent {
  private navigationComponent: NavigationDataComponent
  private userPosition: UserPosition
  private mapController: MapController
  private scale = 3

  @input private target: SceneObject
  @input private pinImage: Image
  @input private hadHeadingTexture: Texture
  @input private noHeadingTexture: Texture
  @input private minimumAccuracy = 10

  public initialize(navigationComponent: NavigationDataComponent, mapController: MapController): void {
    this.navigationComponent = navigationComponent
    this.mapController = mapController
    this.target.enabled = false

    if (global.deviceInfoSystem.isEditor()) {
      return
    }

    this.userPosition = this.navigationComponent.getUserPosition()
    this.userPosition.onUserPositionUpdated.add(() => {
      this.update()
    })

    this.mapController.onMapCentered.add(() => {
      this.update()
    })
    this.target.enabled = true
  }

  private update(): void {
    const geoPosition = this.userPosition.getGeoPosition()
    if (isNull(geoPosition) || !this.userPosition.gpsActive) {
      return
    }

    let accuracy = geoPosition.horizontalAccuracy as number
    if (isNull(accuracy)) {
      return
    }

    accuracy = Math.max(this.minimumAccuracy, accuracy)

    const mapZoomFactor = 1 / (6378000 * 0.5 ** this.mapController.zoomLevel)
    this.target.enabled = true
    this.target.getTransform().setLocalScale(vec3.one().uniformScale(mapZoomFactor * accuracy * this.scale))

    const hasHeading = this.userPosition.status === UserPositionStatus.GeoLocalizationAvailable
    this.pinImage.mainPass.baseTex = hasHeading ? this.hadHeadingTexture : this.noHeadingTexture
  }
}
