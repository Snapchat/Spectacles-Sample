// Import module
const placesModule = require("./Snapchat Places API Module");

import { getPhysicalDistanceBetweenLocations } from "./MapUtils";

export type Address = {
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
  country_code: string;
};

export type time = {
  hour: number;
  minute: number;
};

export type timeInterval = {
  start_hour: time;
  end_hour: time;
};

export type dayHours = {
  day: string;
  hours: timeInterval[];
};

export type openingHours = {
  dayHours: dayHours[];
  time_zone: string;
};

export type PlaceInfo = {
  placeId: string;
  category: string;
  name: string;
  phone_number: string;
  address: Address;
  opening_hours: openingHours;
  centroid: GeoPosition;
};

@component
export class SnapPlacesProvider extends BaseScriptComponent {
  @input
  private remoteServiceModule: RemoteServiceModule
  private apiModule: any;

  private locationToPlaces: Map<GeoPosition, PlaceInfo[]> = new Map<
    GeoPosition,
    PlaceInfo[]
  >();

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.apiModule = new placesModule.ApiModule(this.remoteServiceModule);
    });
  }

  getNearbyPlacesInfo(
    location: GeoPosition,
    numberNearbyPlaces: number,
    nearbyDistanceThreshold: number,
    filter: string[] = null
  ): Promise<PlaceInfo[]> {
    if (location.latitude === 0 && location.longitude === 0) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    const nearbyPlaces = this.getNearbyPlacesFromCache(
      location,
      nearbyDistanceThreshold
    );
    if (nearbyPlaces !== null) {
      return new Promise((resolve) => {
        resolve(nearbyPlaces);
      });
    } else {
      return new Promise((resolve, reject) => {
        this.getNearbyPlaces(location, numberNearbyPlaces, filter)
          .then((places) => {
            this.getPlacesInfo(places)
              .then((places) => {
                this.locationToPlaces.set(location, places);
                resolve(places);
              })
              .catch((error) => {
                reject(`Error getting places info: ${error}`);
              });
          })
          .catch((error) => {
            reject(`Error getting nearby places: ${error}`);
          });
      });
    }
  }

  getNearbyPlaces(
    location: GeoPosition,
    numberNearbyPlaces: number,
    filter: string[] = null
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.apiModule
        .get_nearby_places({
          parameters: {
            lat: location.latitude.toString(),
            lng: location.longitude.toString(),
            gps_accuracy_m: "100",
            places_limit: numberNearbyPlaces.toString(),
          },
        })
        .then((response) => {
          const results = response.bodyAsJson();
          if (filter !== null) {
            const places: any[] = [];
            (results.nearbyPlaces as any[]).forEach((place) => {
              const categoryName = place.categoryName as string;
              for (let i = 0; i < filter.length; i++) {
                if (categoryName.includes(filter[i])) {
                  places.push(place);
                  break;
                }
              }
            });
            resolve(places);
          } else {
            resolve(results.nearbyPlaces);
          }
        })
        .catch((error) => {
          reject(`Error retrieving nearby places: ${error}`);
        });
    });
  }

  getPlacesInfo(places: any[]): Promise<PlaceInfo[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<PlaceInfo>[] = [];
      places.forEach((place) => {
        if (place.placeTypeEnum && place.placeTypeEnum === "VENUE") {
          const getPlacePromise = new Promise<PlaceInfo>((resolve, reject) => {
            this.apiModule
              .get_place({
                parameters: {
                  place_id: place.placeId,
                },
              })
              .then((response) => {
                try {
                  const placeInfo = this.parsePlace(
                    response.bodyAsString(),
                    place.categoryName
                  );
                  resolve(placeInfo);
                } catch (error) {
                  reject(error);
                }
              })
              .catch((error) => {
                reject(error);
              });
          });
          promises.push(getPlacePromise);
        }
      });
      Promise.all(promises).then((places) => {
        resolve(places);
      });
    });
  }

  private parsePlace(jsonString: string, categoryName: string): PlaceInfo {
    const placeObject: any = JSON.parse(jsonString).place;
    const longlat = GeoPosition.create();
    longlat.latitude = placeObject.geometry.centroid.lat;
    longlat.longitude = placeObject.geometry.centroid.lng;
    const place: PlaceInfo = {
      placeId: placeObject.id,
      category: categoryName,
      name: placeObject.name,
      phone_number: placeObject.contactInfo.phoneNumber?.phoneNumber ?? "",
      address: {
        street_address: placeObject.address.address1,
        locality: placeObject.address.locality,
        region: placeObject.address.region,
        postal_code: placeObject.address.postalCode,
        country: placeObject.address.country,
        country_code: placeObject.countryCode,
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
                          minute: hour.start?.minute ?? 0,
                        },
                        end_hour: {
                          hour: hour.end?.hour ?? 0,
                          minute: hour.end?.minute ?? 0,
                        },
                      };
                    }),
                  };
                })
              : {},
            time_zone: placeObject.openingHours.timeZone
              ? placeObject.openingHours.timeZone
              : "",
          }
        : {
            dayHours: [],
            time_zone: "",
          },
      centroid: longlat,
    };
    return place;
  }

  private getNearbyPlacesFromCache(
    location: GeoPosition,
    nearbyPlacesRefreshMinimumDistanceThreshold: number
  ): PlaceInfo[] | null {
    let nearestDistance = Number.MAX_VALUE;
    let cachedNearbyPlaces: PlaceInfo[] | null = null;
    for (let cachedLocation of this.locationToPlaces.keys()) {
      const distance = getPhysicalDistanceBetweenLocations(
        location,
        cachedLocation
      );
      if (distance < nearestDistance) {
        cachedNearbyPlaces = this.locationToPlaces.get(location);
        nearestDistance = distance;
      }
    }
    return nearestDistance <= nearbyPlacesRefreshMinimumDistanceThreshold
      ? cachedNearbyPlaces
      : null;
  }
}
