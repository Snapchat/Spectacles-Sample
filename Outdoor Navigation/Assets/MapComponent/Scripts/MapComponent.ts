import Event, {callback, PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {MapController} from "./MapController"
import {MapPin} from "./MapPin"
import {calculateZoomOffset, findScriptComponent, MapParameter} from "./MapUtils"

@component
export class MapComponent extends BaseScriptComponent {
  @input
  tileCount: number = 2

  @input
  mapRenderParent: SceneObject

  @ui.separator
  @ui.label("Zoom level: 8 far zoom , 21 close zoom")
  @input
  @widget(new SliderWidget(8, 21, 1))
  mapZoomLevel: number
  @ui.separator
  @ui.label("If user pin should be shown in the ma")
  @input
  showUserPin: boolean

  @ui.group_start("User Pin")
  @showIf("showUserPin", true)
  @input
  userPinVisual: ObjectPrefab
  @input
  userPinScale: vec2
  @input
  userPinAlignedWithOrientation: boolean
  @ui.group_end
  @ui.separator
  @ui.label("Map Pins")
  @ui.label("Make sure your Pin Prefab has ScreenTransform")
  @input
  mapPinPrefab: ObjectPrefab
  @input
  @hint("All the map pins will rotate according to map rotation if enabled")
  mapPinsRotated: boolean
  @input
  @hint("A cicle shape detector is used to detect cursor")
  mapPinCursorDetectorSize: number = 0.02
  @ui.separator
  @ui.label("Interactions")
  @input
  enableScrolling: boolean
  @input
  scrollingFriction: number = 4
  @ui.separator
  @ui.label("For setting map location to custom location (not following user location)")
  @input
  setMapToCustomLocation: boolean
  @ui.group_start("Custom Location")
  @showIf("setMapToCustomLocation", true)
  @input
  longitude: string
  @input
  latitude: string
  @input rotation: number
  @ui.group_end
  @ui.separator
  @ui.label("Rotations")
  @input
  isMinimapAutoRotate: boolean
  @input
  enableMapSmoothing: boolean
  @ui.label("How often map should be updated (seconds)")
  @input
  mapUpdateThreshold: number

  @input
  startedAsMiniMap: boolean

  private componentPrefab: ObjectPrefab = requireAsset("../Prefabs/Map Controller.prefab") as ObjectPrefab

  private mapController: MapController

  private onMiniMapToggledEvent = new Event<boolean>()
  onMiniMapToggled: PublicApi<boolean> = this.onMiniMapToggledEvent.publicApi()

  private placeSearchStartedEvent = new Event()
  public onPlaceSearchStarted: PublicApi<void> = this.placeSearchStartedEvent.publicApi()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    const mapComponentInstance = this.componentPrefab.instantiate(this.getSceneObject())
    this.mapController = findScriptComponent(mapComponentInstance, "isMapComponent") as MapController

    let mapLocation: GeoPosition = null

    if (this.setMapToCustomLocation) {
      mapLocation = GeoPosition.create()
      mapLocation.longitude = parseFloat(this.longitude)
      mapLocation.latitude = parseFloat(this.latitude)
      mapLocation.heading = this.rotation
    }

    const mapFocusPosition = new vec2(0.5, 0.5)

    const mapParameters: MapParameter = {
      tileCount: this.tileCount,
      renderParent: this.mapRenderParent,
      mapUpdateThreshold: this.mapUpdateThreshold,
      setMapToCustomLocation: this.setMapToCustomLocation,
      mapLocation: mapLocation,
      mapFocusPosition: mapFocusPosition,
      userPinVisual: this.userPinVisual,
      showUserPin: this.showUserPin,
      zoomLevel: this.mapZoomLevel,
      zoomOffet: calculateZoomOffset(this.mapZoomLevel),
      enableScrolling: this.enableScrolling,
      scrollingFriction: this.scrollingFriction,
      userPinScale: this.userPinScale,
      mapPinsRotated: this.mapPinsRotated,
      isMinimapAutoRotate: this.isMinimapAutoRotate,
      userPinAlignedWithOrientation: this.userPinAlignedWithOrientation,
      enableMapSmoothing: this.enableMapSmoothing,
      mapPinPrefab: this.mapPinPrefab,
      mapPinCursorDetectorSize: this.mapPinCursorDetectorSize
    }

    this.mapController.initialize(mapParameters, this.startedAsMiniMap)
  }

  // #region Exposed functions
  // =====

  // #region subscribe callbacks

  /**
   * Setting function to call when all the initial map tiles are loaded
   */
  subscribeOnMaptilesLoaded(fn: () => void): void {
    this.mapController.onMapTilesLoaded.add(fn)
  }

  /**
   * Setting function to call when the initial location of the map is set
   */
  subscribeOnInitialLocationSet(fn: () => void): void {
    this.mapController.onInitialLocationSet.add(fn)
  }

  /**
   * Setting function to call when the user location is set in the first time
   */
  subscribeOnUserLocationFirstSet(fn: () => void): void {
    this.mapController.onUserLocationSet.add(fn)
  }

  /**
   * Setting function to call when new tile comes into the view
   */
  subscribeOnTileCameIntoView(fn: () => void): void {
    this.mapController.onTileCameIntoView.add(fn)
  }

  /**
   * Setting function to call when tile goes out of the view
   */
  subscribeOnTileWentOutOfView(fn: () => void): void {
    this.mapController.onTileWentOutOfView.add(fn)
  }

  /**
   * Setting function to call when the map is centered
   */
  subscribeOnMapCentered(fn: callback<void>): void {
    this.mapController.onMapCentered.add(fn)
  }

  /**
   * Setting function to call when a new map pin is added
   */
  subscribeOnMapAddPin(fn: callback<MapPin>): void {
    this.mapController.onMapPinAdded.add(fn)
  }

  /**
   * Setting function to call when a map pin is removed
   */
  subscribeOnMapPinRemoved(fn: callback<MapPin>): void {
    this.mapController.onMapPinRemoved.add(fn)
  }

  /**
   * Setting function to call when all map pins are
   * removed from the map
   */
  subscribeOnAllMapPinsRemoved(fn: callback<void>): void {
    this.mapController.onAllMapPinsRemoved.add(fn)
  }

  /**
   * Setting function to call when the map is scrolled
   */
  subscribeOnMapScrolled(fn: callback<void>): void {
    this.mapController.onMapScrolled.add(fn)
  }

  /**
   * Setting function to call when no nearby places are found
   */
  subscribeOnNoNearbyPlacesFound(fn: callback<void>): void {
    this.mapController.onNoNearbyPlacesFound.add(fn)
  }

  /**
   * Setting function to call when nearby places call fails
   */
  subscribeOnNearbyPlacesFailed(fn: callback<void>): void {
    this.mapController.onNearbyPlacesFailed.add(fn)
  }

  // #endregion

  /**
   * Return the initial map location (middle tile)
   */
  getInitialMapTileLocation(): GeoPosition {
    return this.mapController.getInitialMapTileLocation()
  }

  /**
   * Setting if the user pin should be rotated with user orientation
   */
  setUserPinRotated(value): void {
    this.mapController.setUserPinRotated(value)
  }

  /**
   * For enabling/disabling scrolling of the map from script
   */
  setMapScrolling(value): void {
    this.mapController.setMapScrolling(value)
  }

  /**
   * Return the user location
   */
  getUserLocation(): GeoPosition {
    return this.mapController.getUserLocation()
  }

  /**
   * Return the user heading angle in radians
   */
  getUserHeading(): number {
    return this.mapController.getUserHeading()
  }

  /**
   * Return the user orientation in quaternion.
   * Gradually becomes north-aligned when GNSS signal is available
   */
  getUserOrientation(): quat {
    return this.mapController.getUserOrientation()
  }

  /**
   * Create a new map pin with the given longitude and latitude
   */
  createMapPin(longitude: number, latitude: number): MapPin {
    const location = GeoPosition.create()
    location.longitude = longitude
    location.latitude = latitude
    return this.mapController.createMapPin(location)
  }

  /**
   * Create a new map pin at the user location
   */
  createMapPinAtUserLocation(): MapPin {
    return this.mapController.createMapPinAtUserLocation()
  }

  /**
   * Add a map pin to the map by local position.
   * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
   */
  addPinByLocalPosition(localPosition: vec2): MapPin {
    return this.mapController.addPinByLocalPosition(localPosition)
  }

  /**
   * For removing a map pin from the map
   */
  removeMapPin(mapPin: MapPin): void {
    this.mapController.removeMapPin(mapPin)
  }

  /**
   * For removing all map pins from map
   */
  removeMapPins(): void {
    this.mapController.removeMapPins()
  }

  /**
   * Centering map to intial location
   */
  centerMap(): void {
    if (this.mapController != undefined) {
      this.mapController.centerMap()
    }
  }

  /**
   * Create map pins for nearby places with the given category name
   * Currently the range is 100m from the user location
   */
  showNeaybyPlaces(categoryName: string[]): void {
    this.placeSearchStartedEvent.invoke()
    this.mapController.showNearbyPlaces(categoryName)
  }

  /**
   * Return true if the map is centered
   */
  isMapCentered(): boolean {
    return this.mapController.isMapCentered()
  }

  /**
   * Update the hover position on the map to detect the hovered map pin
   * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
   */
  updateHover(localPosition: vec2): void {
    this.mapController.handleHoverUpdate(localPosition)
  }

  /**
   * Start touch on the map for map scrolling
   * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
   */
  startTouch(localPosition: vec2): void {
    this.mapController.handleTouchStart(localPosition)
  }

  /**
   * Update touch on the map for map scrolling
   * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
   */
  updateTouch(localPosition: vec2): void {
    this.mapController.handleTouchUpdate(localPosition)
  }

  /**
   * End touch on the map for map scrolling
   * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
   */
  endTouch(localPosition: vec2): void {
    this.mapController.handleTouchEnd(localPosition)
  }

  /**
   * Zooming in the map
   */
  zoomIn(): void {
    this.mapController.handleZoomIn()
  }

  /**
   * Zooming out the map
   */
  zoomOut(): void {
    this.mapController.handleZoomOut()
  }

  /**
   * Toggling between mini map and full map
   */
  toggleMiniMap(isOn: boolean): void {
    this.mapController.toggleMiniMap(isOn)

    this.onMiniMapToggledEvent.invoke(isOn)
  }

  /**
   * Drawing geometry point to map
   */
  drawGeometryPoint(geometry, radius): void {
    this.mapController.drawGeometryPoint(geometry, radius)
  }

  /**
   * Drawing geometry line to map
   */
  drawGeometryLine(geometry, thickness): void {
    this.mapController.drawGeometryLine(geometry, thickness)
  }

  /**
   * Drawing geometry multiline to map
   */
  drawGeometryMultiline(geometry, thickness): void {
    this.mapController.drawGeometryMultiline(geometry, thickness)
  }

  /**
   * Clearing all drawn geometry
   */
  clearGeometry(): void {
    this.mapController.clearGeometry()
  }

  // #endregion
}
