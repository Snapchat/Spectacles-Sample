import {MapComponent} from "MapComponent/Scripts/MapComponent"
import {IPlacesApi, PlaceInfo} from "./IPlacesApi"
import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {ScrollView} from "SpectaclesInteractionKit.lspkg/Components/UI/ScrollView/ScrollView"
import {GeoLocationPlace} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/GeoLocationPlace"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"

/**
 * Searches for nearby places on the map.
 */
@component
export class PlacesSearcher extends BaseScriptComponent {
  private currentPlaces: Place[] = []

  @input
  private navigationModule: NavigationDataComponent
  @input
  private searchButton: PinchButton
  @input
  private mapComponent: MapComponent
  @input
  private placesFinder: IPlacesApi
  @input
  @allowUndefined
  private scrollView: ScrollView

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.searchButton.onButtonPinched.add(() => {
        this.searchCurrentMapPosition()
      })

      this.navigationModule.onNavigationStarted.add((place) => {
        this.removeCurrentPlaces(place)
      })

      this.mapComponent.onUserPositionSet.add(() => {
        this.searchCurrentMapPosition(false)
      })
    })
  }

  private async searchCurrentMapPosition(addCenter: boolean = true): Promise<void> {
    this.removeCurrentPlaces()

    const currentFocus = this.mapComponent.getCurrentLocationFocus()

    try {   
      if (addCenter) {
        const searchCenter = new GeoLocationPlace(    
            currentFocus,
            10,
            "Search Center",
            null,
            "",
            this.navigationModule.getUserPosition(),
        )

        this.currentPlaces.push(searchCenter)
        this.navigationModule.addPlace(searchCenter)
      }

      const nearby = await this.placesFinder.getNearbyPlacesInfo(currentFocus, 5, 500)
      nearby.forEach((p) => {
        const navigationPlace = this.createPlaceFromNearby(p)
        this.currentPlaces.push(navigationPlace)
        this.navigationModule.addPlace(navigationPlace)
      })

      if (nearby.length > 0) {
        return
      }
    } catch (e) {
      const error = e as Error
      print("error getting places: " + error.name + " " + error.message + " " + error.stack)
    }
  }

  private createPlaceFromNearby(place: PlaceInfo): Place {
    const geoPosition = place.centroid
    let name = place.name

    if (!isNull(name) && name.length > 15) {
      const splitList = name.split(" ")
      if (splitList.length > 1) {
        name = splitList[0] + " " + splitList[1]
      } else {
        name = name.substring(0, 15)
      }
    }

    const navigationPlace = new GeoLocationPlace(
      geoPosition,
      10,
      name,
      null,
      place.subtitle,
      this.navigationModule.getUserPosition(),
    )

    return navigationPlace
  }

  private removeCurrentPlaces(except: Place = null): void {
    this.currentPlaces.forEach((place) => {
      if (place === except) {
        return
      }
      this.navigationModule.removePlace(place)
    })
    this.currentPlaces = this.currentPlaces.filter((e) => e === except)

    if (!isNull(this.scrollView)) {
      this.scrollView.snapToEdges({x: 0, y: 1, type: "Content"})
    }
  }
}
