import {getPhysicalDistanceBetweenLocations} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationUtils"
import {IPlacesApi} from "./IPlacesApi"

/**
 * Provides an API for finding nearby places.
 */
@component
export class PlacesApi extends BaseScriptComponent implements IPlacesApi {
  @input private remoteServiceModule: RemoteServiceModule

  private locationToPlaces: Map<GeoPosition, SnapPlaceInfo[]> = new Map<GeoPosition, SnapPlaceInfo[]>()

  /**
   * Get nearby places info.
   */
  public getNearbyPlacesInfo(
    location: GeoPosition,
    numberNearbyPlaces: number,
    nearbyDistanceThreshold: number
  ): Promise<SnapPlaceInfo[]> {
    if (location.latitude === 0 && location.longitude === 0) {
      return new Promise((resolve) => {
        resolve([])
      })
    }

    const nearbyPlaces = this.getNearbyPlacesFromCache(location, nearbyDistanceThreshold)
    if (!isNull(nearbyPlaces)) {
      return new Promise((resolve) => {
        resolve(nearbyPlaces)
      })
    } else {
      return new Promise((resolve, reject) => {
        this.getNearbyPlaces(location, numberNearbyPlaces)
          .then((places) => {
            this.getPlacesInfo(places)
              .then((places) => {
                this.locationToPlaces.set(
                  location,
                  places.filter((e) => true) // TODO: Revive filtering
                )
                resolve(places)
              })
              .catch((error) => {
                reject(`Error getting places info: ${error}`)
              })
          })
          .catch((error) => {
            reject(`Error getting nearby places: ${error}`)
          })
      })
    }
  }

  /**
   * Get nearby places.
   */
  public getNearbyPlaces(location: GeoPosition, numberNearbyPlaces: number): Promise<SnapNearbyPlace[]> {
    return new Promise((resolve, reject) => {
      const request = RemoteApiRequest.create()
      request.endpoint = "get_nearby_places"
      request.parameters = {
        lat: location.latitude.toString(),
        lng: location.longitude.toString(),
        gps_accuracy_m: "100",
        places_limit: numberNearbyPlaces.toString()
      }

      this.remoteServiceModule.performApiRequest(request, (response: RemoteApiResponse) => {
        if (response.statusCode !== 1) {
          reject("Error in API request " + response.statusCode + " " + response.body)
          return
        }

        const results = JSON.parse(response.body)
        const nearbyPlaces = results.nearbyPlaces as SnapNearbyPlace[]
        // TODO: Filter here
        const places: SnapNearbyPlace[] = []
        nearbyPlaces.forEach((place) => {
          places.push(place)
        })
        resolve(places)
      })
    })
  }

  /**
   * Get places info.
   */
  getPlacesInfo(places: SnapNearbyPlace[]): Promise<SnapPlaceInfo[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<SnapPlaceInfo>[] = []

      places.forEach((place) => {
        if (place.placeTypeEnum && place.placeTypeEnum === "VENUE") {
          const getPlacePromise = new Promise<SnapPlaceInfo>((resolve, reject) => {
            const request = RemoteApiRequest.create()
            request.endpoint = "get_place"
            request.parameters = {
              place_id: place.placeId
            }

            this.remoteServiceModule.performApiRequest(request, (response: RemoteApiResponse) => {
              if (response.statusCode !== 1) {
                resolve(null)
                return
              }

              const placeInfo = this.parsePlace(response.body, place)
              resolve(placeInfo)
            })
          })
          promises.push(getPlacePromise)
        }
      })
      Promise.all(promises)
        .then((places) => {
          resolve(places)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private parsePlace(jsonString: string, info: SnapNearbyPlace): SnapPlaceInfo {
    const placeObject: any = JSON.parse(jsonString).place
    const longlat = GeoPosition.create()
    longlat.latitude = placeObject.geometry.centroid.lat
    longlat.longitude = placeObject.geometry.centroid.lng
    const place: SnapPlaceInfo = {
      placeId: placeObject.id,
      category: info.categoryName,
      name: placeObject.name,
      subtitle: info.subtitle,
      phone_number: placeObject.contactInfo?.phoneNumber?.phoneNumber ?? "",
      address: {
        street_address: placeObject.address.address1,
        locality: placeObject.address.locality,
        region: placeObject.address.region,
        postal_code: placeObject.address.postalCode,
        country: placeObject.address.country,
        country_code: placeObject.countryCode
      },
      opening_hours: placeObject.openingHours
        ? {
            dayHours: placeObject.openingHours.dayHours
              ? placeObject.openingHours.dayHours.map((dayHour) => {
                  return {
                    day: dayHour.day,
                    hours: dayHour.hours.map((hour) => {
                      return {
                        start_hour: {
                          hour: hour.start?.hour ?? 0,
                          minute: hour.start?.minute ?? 0
                        },
                        end_hour: {
                          hour: hour.end?.hour ?? 0,
                          minute: hour.end?.minute ?? 0
                        }
                      }
                    })
                  }
                })
              : {},
            time_zone: placeObject.openingHours.timeZone ? placeObject.openingHours.timeZone : ""
          }
        : {
            dayHours: [],
            time_zone: ""
          },
      centroid: longlat
    }
    return place
  }

  private getNearbyPlacesFromCache(
    location: GeoPosition,
    nearbyPlacesRefreshMinimumDistanceThreshold: number
  ): SnapPlaceInfo[] | null {
    let nearestDistance = Number.MAX_VALUE
    let cachedNearbyPlaces: SnapPlaceInfo[] | null = null
    for (const cachedLocation of this.locationToPlaces.keys()) {
      const distance = getPhysicalDistanceBetweenLocations(location, cachedLocation)
      if (distance < nearestDistance) {
        cachedNearbyPlaces = this.locationToPlaces.get(cachedLocation)
        nearestDistance = distance
      }
    }

    return nearestDistance <= nearbyPlacesRefreshMinimumDistanceThreshold ? cachedNearbyPlaces : null
  }
}

export class SnapNearbyPlace {
  placeId: string
  name: string
  rank: number
  subtitle: string
  isReportable: boolean
  placeTypeEnum: string
  categoryId: string
  categoryName: string
}

export type SnapPlaceInfo = {
  placeId: string
  category: string
  name: string
  subtitle: string
  phone_number: string
  address: Address
  opening_hours: openingHours
  centroid: GeoPosition
}

export type Address = {
  street_address: string
  locality: string
  region: string
  postal_code: string
  country: string
  country_code: string
}

export type time = {
  hour: number
  minute: number
}

export type timeInterval = {
  start_hour: time
  end_hour: time
}

export type dayHours = {
  day: string
  hours: timeInterval[]
}

export type openingHours = {
  dayHours: dayHours[]
  time_zone: string
}
