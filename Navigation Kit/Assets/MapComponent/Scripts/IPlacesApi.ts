/**
 * Defines an API for finding nearby places.
 */
export interface IPlacesApi extends BaseScriptComponent {
    getNearbyPlacesInfo(
      location: GeoPosition,
      numberNearbyPlaces: number,
      nearbyDistanceThreshold: number,
    ): Promise<PlaceInfo[]>
  }
  
  /**
   * Represents a nearby place.
   */
  export class NearbyPlace {
    placeId: string
    name: string
    subtitle: string
  }
  
  /**
   * Represents information about a place.
   */
  export type PlaceInfo = {
    placeId: string
    name: string
    subtitle: string
    centroid: GeoPosition
  }
  