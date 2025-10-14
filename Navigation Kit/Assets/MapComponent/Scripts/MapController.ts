require("LensStudio:RawLocationModule")

import {Cell, TileViewEvent} from "./Cell"
import {
  MapParameter,
  addRenderMeshVisual,
  calculateZoomOffset,
  clip,
  customGetEuler,
  forEachSceneObjectInSubHierarchy,
  getOffsetForLocation,
  interpolate,
  lerp,
  makeCircle2DMesh,
  makeLineStrip2DMeshWithJoints,
  makeTween,
} from "./MapUtils"
import {MapPin, MapPinRenderConfig} from "./MapPin"

import {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {GeoLocationPlace} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/GeoLocationPlace"
import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import { LocationAccuracyDisplay } from "../../NavigationKitAssets/Scripts/LocationAccuracyDisplay"
import MapConfig from "./MapConfig"
import {MapGridView} from "./MapGridView"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {PinOffsetter} from "./PinOffsetter"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import { PlaceListCreator } from "../../NavigationKitAssets/Scripts/PlaceListCreator"
import {TWEEN_DURATION} from "MapComponent/MapUIController"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"
import {UserPosition} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/UserPosition"

const TEXTURE_SIZE = 512

const MAX_LATITUDE = 85.05112878
const MAX_LONGITUDE = -180

const NEARBY_PLACES_RANGE = 100

const CENTER_MAP_TWEEN_DURATION = 0.5

const TAG = "[Map Controller]"
const log = new NativeLogger(TAG)

@component
export class MapController extends BaseScriptComponent {
  @input
  mapModule: MapModule
  @input
  mapTilePrefab: ObjectPrefab
  @input
  lineMaterial: Material
  @input
  mapScale: number = 2
  @input
  mapRenderPrefab: ObjectPrefab

  @input
  @hint("If the user is less that this distance from a placed pin, it will be considered visited.")
  private visitedDistance: number = 10

  private navigationComponent: NavigationDataComponent
  private userPosition: UserPosition
  private selectedPin: MapPin | null = null
  private placeListCreator?: PlaceListCreator

  private isMapComponent: boolean = true // this is used by the MapComponent to find this component on one of the child
  private startedAsMiniMap: boolean
  mapParameters: MapParameter
  mapGridObject: SceneObject
  mapPinsAnchor: SceneObject

  //Grid
  public pinOffsetter: PinOffsetter
  public gridView: MapGridView
  public config: MapConfig
  public referencePositionLocationAsset: LocationAsset
  private northwestLocationAsset: LocationAsset

  public offsetForLocation: vec2
  private mapRenderOrder = 1
  private initialMapLocation: GeoPosition // named initialMapTileLocation in js

  // Map
  private userPin: MapPin
  private mapLocation: GeoPosition
  private shouldFollowMapLocation = false
  private viewScrolled: boolean
  private loadedCells = 0
  private mapCellCount = 0

  // Pin
  private hoveringPinSet: Set<MapPin> = new Set()
  private pinSet: Set<MapPin> = new Set()
  private pinnedPlaceSet: Set<string> = new Set()
  private isDraggingPin: boolean = false
  private draggingPin: MapPin | null = null
  private userPinDefaultScale: vec3

  // Map Render
  private mapRenderObject: SceneObject
  private mapScreenTransform: ScreenTransform

  // Rotations
  private currentUserRotation: quat = quat.fromEulerAngles(0, 0, 0)
  private targetUserRotation: quat = quat.fromEulerAngles(0, 0, 0)
  private currentMapRotation: quat = quat.fromEulerAngles(0, 0, 0)
  private targetMapRotation: quat = quat.fromEulerAngles(0, 0, 0)
  private currentPinRotation: quat = quat.fromEulerAngles(0, 0, 0)
  private targetPinRotation: quat = quat.fromEulerAngles(0, 0, 0)

  private tweenCancelFunction: CancelFunction

  private geometryObjects: SceneObject[] = []

  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher

  public isInitialized: boolean = false

  private onInitialLocationSetEvent = new Event<GeoPosition>()
  public onInitialLocationSet = this.onInitialLocationSetEvent.publicApi()

  private onMapTilesLoadedEvent = new Event()
  public onMapTilesLoaded = this.onMapTilesLoadedEvent.publicApi()

  private onUserLocationSetEvent = new Event<GeoPosition>()
  public onUserLocationSet = this.onUserLocationSetEvent.publicApi()

  private onMapCenteredEvent = new Event()
  public onMapCentered = this.onMapCenteredEvent.publicApi()

  private onMapScrolledEvent = new Event()
  public onMapScrolled = this.onMapScrolledEvent.publicApi()

  private onTileWentOutOfViewEvent = new Event<TileViewEvent>()
  public onTileWentOutOfView = this.onTileWentOutOfViewEvent.publicApi()

  private onTileCameIntoViewEvent = new Event<TileViewEvent>()
  public onTileCameIntoView = this.onTileCameIntoViewEvent.publicApi()

  private onMapPinAddedEvent = new Event<MapPin>()
  public onMapPinAdded = this.onMapPinAddedEvent.publicApi()

  private onMapPinRemovedEvent = new Event<MapPin>()
  public onMapPinRemoved = this.onMapPinAddedEvent.publicApi()

  private onAllMapPinsRemovedEvent = new Event()
  public onAllMapPinsRemoved = this.onAllMapPinsRemovedEvent.publicApi()

  private onMiniMapToggledEvent = new Event<boolean>()
  public onMiniMapToggled = this.onMiniMapToggledEvent.publicApi()

  private onNoNearbyPlacesFoundEvent = new Event()
  public onNoNearbyPlacesFound = this.onNoNearbyPlacesFoundEvent.publicApi()

  private onNearbyPlacesFailedEvent = new Event()
  public onNearbyPlacesFailed = this.onNearbyPlacesFailedEvent.publicApi()

  public get zoomLevel(): number {
    return this.mapParameters.zoomLevel
  }

  /**
   * Called from Map component script to initialize the script
   */
  initialize(
    mapParameters: MapParameter,
    navigationComponent: NavigationDataComponent,
    startedAsMiniMap: boolean,
    placeListCreator: PlaceListCreator | null = null,
  ): void {
    log.i("Initializing Map Controller")

    this.navigationComponent = navigationComponent
    this.userPosition = this.navigationComponent.getUserPosition()
    this.mapParameters = mapParameters
    this.startedAsMiniMap = startedAsMiniMap
    this.placeListCreator = placeListCreator

    this.mapRenderObject = this.mapRenderPrefab.instantiate(mapParameters.renderParent)

    this.mapRenderObject.getTransform().setLocalPosition(vec3.zero())

    this.mapGridObject = this.mapRenderObject.getChild(0)
    this.mapScreenTransform = this.mapGridObject.getComponent("Component.ScreenTransform")

    this.mapPinsAnchor = this.mapGridObject.getChild(0)

    if (this.mapParameters.setMapToCustomLocation) {
      this.mapLocation = this.mapParameters.mapLocation
    }

    this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  private onUpdate() {
    if (!this.isInitialized) {
      const location = this.userPosition.getGeoPosition()
      if (!isNull(location)) {
        this.initializeWithFirstGeoPosition(location)
      }
      return
    }

    //User / Map location update
    const location = this.userPosition.getGeoPosition()
    if (!this.mapParameters.setMapToCustomLocation) {
      this.setNewMapLocation(location)
    }

    if (this.mapParameters.showUserPin) {
      this.setNewUserPosition(location)
    }

    this.pinSet.forEach((p) => {
      this.updatePinPositionOnMap(p)
    })

    this.updateRotations()
  }

  private initializeWithFirstGeoPosition(location: GeoPosition): void {
    if (!this.mapParameters.setMapToCustomLocation) {
      this.mapLocation = location
    }

    this.createMapGrid()
    this.centerMap()

    if (this.mapParameters.showUserPin) {
      this.spawnUserPin(this.mapParameters.userPinVisual, location, this.mapParameters.userPinScale)
      this.userPin.toggleMiniMap(this.config.isMiniMap)
    }

    if (this.startedAsMiniMap) {
      this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false)
    }

    this.updateDispatcher
      .createLateUpdateEvent("LateUpdateEvent")
      .bind(() => this.gridView.updateGridView(this.pinSet, this.userPin))

    this.isInitialized = true
    this.onUserLocationSetEvent.invoke(location)
    log.i("Map Controller initialized")
  }

  private updateRotations() {
    const pinRotation = -this.userPosition.getBearing()

    if (this.mapParameters.showUserPin) {
      //setting user pin rotation
      this.updateUserPinRotation(pinRotation)
    }

    if (this.mapParameters.setMapToCustomLocation) {
      return
    }

    // Rotate the map only when the map is centered at the user location (not scrolled) and minimap mode is activated
    if (this.mapParameters.isMinimapAutoRotate && !this.viewScrolled && this.config.isMiniMap) {
      this.updateMapRotation()
      this.updateMapPinRotations(pinRotation)
    }
  }

  private updateMapPinRotations(pinRotation: number) {
    if (this.mapParameters.mapPinsRotated) {
      if (this.mapParameters.enableMapSmoothing) {
        this.targetPinRotation = quat.fromEulerAngles(0, 0, pinRotation)
        this.currentPinRotation = interpolate(this.currentPinRotation, this.targetPinRotation, 4)
        this.pinSet.forEach((pin: MapPin) => {
          pin.screenTransform.rotation = this.currentPinRotation
        })
      } else {
        this.pinSet.forEach((pin: MapPin) => {
          pin.screenTransform.rotation = quat.fromEulerAngles(0, 0, pinRotation)
        })
      }
    }
  }

  private updateMapRotation() {
    const userBearing = this.userPosition.getBearing()
    if (this.mapParameters.enableMapSmoothing) {
      this.targetMapRotation = quat.fromEulerAngles(0, 0, userBearing)

      this.currentMapRotation = interpolate(this.currentMapRotation, this.targetMapRotation, 4)
      this.config.gridScreenTransform.rotation = this.currentMapRotation
    } else {
      this.config.gridScreenTransform.rotation = quat.fromEulerAngles(0, 0, userBearing)
    }
  }

  private updateUserPinRotation(pinRotation: number) {
    if (this.userPin.screenTransform && this.mapParameters.userPinAlignedWithOrientation) {
      if (this.mapParameters.enableMapSmoothing) {
        this.targetUserRotation = quat.fromEulerAngles(0, 0, pinRotation)
        this.currentUserRotation = interpolate(this.currentUserRotation, this.targetUserRotation, 4)
        this.userPin.screenTransform.rotation = this.currentUserRotation
      } else {
        this.userPin.screenTransform.rotation = quat.fromEulerAngles(0, 0, pinRotation)
      }
    }
  }

  /**
   * For creating a new map pin for the map
   */
  createMapPin(place: Place): MapPin {
    let alreadyRegistered = false
    this.pinSet.forEach((e) => {
      alreadyRegistered = alreadyRegistered || e.place === place
    })

    if (alreadyRegistered) {
      log.i("Only one pin is allowed per place.")
      return
    }

    const pin = MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, place, this.getRenderConfig())
    pin.label.text = place.name

    this.pinSet.add(pin)

    const geoPosition = place.getGeoPosition()

    if (isNull(geoPosition)) {
      log.i("Received a null geo position from " + place.name)
    }

    // Bind a location pin
    this.updatePinLocation(pin, geoPosition)

    this.pinOffsetter.layoutScreenTransforms(this.gridView)
    pin.highlight()

    this.onMapPinAddedEvent.invoke(pin)
    this.navigationComponent.addPlace(place)

    return pin
  }

  private updatePinLocation(pin: MapPin, position: GeoPosition): void {
    this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, position?.longitude, position?.latitude)
    pin.setVisible(!isNull(position))
  }

  /**
   * Removing map pin
   */
  removeMapPin(mapPin: MapPin) {
    if (this.pinSet.has(mapPin)) {
      this.pinSet.delete(mapPin)
    }

    this.navigationComponent.removePlace(mapPin.place)
    const pinScreenTransform = mapPin.sceneObject.getComponent("ScreenTransform")
    this.pinOffsetter.unbindScreenTransform(pinScreenTransform)
    mapPin.sceneObject.destroy()

    this.onMapPinRemovedEvent.invoke(mapPin)
  }

  /**
   * Removes all the map pins from the map
   */
  removeMapPins() {
    this.pinSet.forEach((pin: MapPin) => {
      this.pinOffsetter.unbindScreenTransform(pin.screenTransform)
      this.pinSet.delete(pin)
      this.navigationComponent.removePlace(pin.place)
      pin.sceneObject.destroy()
    })

    this.pinnedPlaceSet.clear()

    this.onAllMapPinsRemovedEvent.invoke()
  }

  addPinByLocalPosition(localPosition: vec2): MapPin {
    const newPin = MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, null, this.getRenderConfig())
    this.pinSet.add(newPin)

    this.pinOffsetter.layoutScreenTransforms(this.gridView)

    newPin.sceneObject.enabled = true

    const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition)

    this.setPinLocation(newPin, adjustedAnchoredPosition)

    return newPin
  }

  public getPins(): MapPin[] {
    return Array.from(this.pinSet.values())
  }

  private setPinLocation(pin: MapPin, adjustedAnchoredPosition: vec2) {
    const offset = this.gridView.getOffset().sub(this.offsetForLocation).sub(new vec2(0.5, 0.5))
    const location: GeoPosition = this.fromLocalPositionToLongLat(
      new vec2(adjustedAnchoredPosition.x - offset.x, adjustedAnchoredPosition.y + offset.y),
      this.mapParameters.zoomLevel,
    )
    location.altitude = this.userPosition.getGeoPosition().altitude

    if (isNull(pin.place)) {
      pin.place = this.createPlaceFromGeoPosition(location)
    } else {
      const newPositionAccepted: boolean = pin.place.requestNewGeoPosition(location)
      if (!newPositionAccepted) {
        log.i("Setting new position for pin rejected.")
      }
    }

    this.updatePinPositionOnMap(pin)
    this.onMapPinAddedEvent.invoke(pin)
  }

  private updatePinPositionOnMap(pin: MapPin): void {
    const position = pin.place.getGeoPosition()
    this.updatePinLocation(pin, position)
  }

  private fromLocalPositionToLongLat(localPosition: vec2, zoomLevel: number): GeoPosition {
    const pixelOffsetFromMapLocationX = localPosition.x * TEXTURE_SIZE
    const pixelOffsetFromMapLocationY = -localPosition.y * TEXTURE_SIZE

    const mapImageOffset = this.mapModule.longLatToImageRatio(
      this.mapLocation.longitude,
      this.mapLocation.latitude,
      this.northwestLocationAsset,
    )

    const pixelX = mapImageOffset.x * TEXTURE_SIZE + pixelOffsetFromMapLocationX
    const pixelY = mapImageOffset.y * TEXTURE_SIZE + pixelOffsetFromMapLocationY

    const mapSize = TEXTURE_SIZE << zoomLevel

    const x = clip(pixelX, 0, mapSize - 1) / mapSize - 0.5
    const y = 0.5 - clip(pixelY, 0, mapSize - 1) / mapSize

    const latitude = 90 - (360 * Math.atan(Math.exp(-y * 2 * Math.PI))) / Math.PI
    const longitude = 360 * x

    const location = GeoPosition.create()
    location.longitude = longitude
    location.latitude = latitude

    return location
  }

  createMapPinAtUserLocation(): MapPin {
    return this.createMapPin(this.createPlaceFromUserPosition(null))
  }

  updateLocationOffset(): void {
    this.offsetForLocation = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude,
    )
  }

  private createMapGrid() {
    const gridScreenTransform = this.mapGridObject.getComponent("ScreenTransform")

    this.gridView = MapGridView.makeGridView(this, this.mapScale)

    this.config = MapConfig.makeConfig(
      this.mapPinsAnchor,
      this.mapScreenTransform,
      gridScreenTransform,
      this.mapTilePrefab,
      this,
      this.mapParameters.enableScrolling,
      this.mapParameters.scrollingFriction,
      this.mapParameters.tileCount,
    )
    this.config.isMiniMap = this.startedAsMiniMap

    this.initialMapLocation = GeoPosition.create()
    this.initialMapLocation.longitude = this.mapLocation.longitude
    this.initialMapLocation.latitude = this.mapLocation.latitude
    this.onInitialLocationSetEvent.invoke(this.initialMapLocation)

    this.shouldFollowMapLocation = true

    this.setUpZoom()
  }

  /**
   * Provide the cells to be configures / built. Cells are reused as data is scrolled.
   */
  configureCell(cell: Cell): void {
    cell.imageComponent = cell.sceneObject.getComponent("Component.Image")

    cell.imageComponent.mainMaterial = cell.imageComponent.mainMaterial.clone()

    // Creating Map Texture Provider
    const mapTexture = this.mapModule.createMapTextureProvider()
    cell.textureProvider = mapTexture.control as MapTextureProvider

    cell.imageComponent.mainPass.baseTex = mapTexture

    cell.onTileCameIntoView.add((event) => this.onTileCameIntoViewEvent.invoke(event))

    cell.onTileWentOutOfView.add((event) => this.onTileWentOutOfViewEvent.invoke(event))

    //A function that gets called when location data fails to download.
    cell.textureProvider.onFailed.add(() => {
      cell.retryTextureLoading()
    })

    //A function that gets called when location data is downloaded.
    cell.textureProvider.onReady.add(() => {
      this.mapTileloaded()
    })
  }

  //Called when individual map tile is loaded
  private mapTileloaded() {
    this.loadedCells++

    if (this.loadedCells === this.mapCellCount) {
      this.onMapTilesLoadedEvent.invoke()
    }
  }

  onCellCountChanged(cellCount: number): void {
    this.mapCellCount = cellCount
  }

  private setUpZoom() {
    this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(
      this.mapLocation.longitude,
      this.mapLocation.latitude,
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet)
    this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(
      MAX_LONGITUDE,
      MAX_LATITUDE,
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet)

    // Calculate how much the map needs to be scrolled to match the geo position of the tile
    this.updateLocationOffset()

    // Offset the map so that it include the map focus position and the offset for the initial location for the provided tile
    this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition))

    // Create a binder that can offset a screen transfor for a given location
    this.pinOffsetter = PinOffsetter.makeMapLocationOffsetter(this.mapModule, this.referencePositionLocationAsset)

    // Apply the config (will build the grid view if not already, then will apply the settings)
    this.gridView.handleUpdateConfig(this.config)
  }

  /**
   * Spawning a user pin
   */
  spawnUserPin(mapPinPrefab: ObjectPrefab, location: GeoPosition, mapPinScale: vec2) {
    const place = this.createPlaceFromGeoPosition(location, "User")
    this.userPin = MapPin.makeMapPin(mapPinPrefab, this.mapGridObject, place, this.getRenderConfig(), true)
    this.userPinDefaultScale = this.userPin.sceneObject.getTransform().getLocalScale()

    this.userPin.screenTransform.scale = new vec3(mapPinScale.x, mapPinScale.y, 1.0)
    this.userPinDefaultScale = this.userPin.screenTransform.scale

    // Bind a location pin
    this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude)

    this.pinOffsetter.layoutScreenTransforms(this.gridView)

    const accuracy = this.userPin.sceneObject.getComponent(LocationAccuracyDisplay.getTypeName())
    if (!isNull(accuracy)) {
      accuracy.initialize(this.navigationComponent, this)
    }
  }

  /**
   * For enabling/disabling scrolling of the map
   */
  setMapScrolling(value: boolean): void {
    this.config.horizontalScrollingEnabled = value
    this.config.verticalScrollingEnabled = value
  }

  /**
   * Setting if user pin should be rotated
   */
  setUserPinRotated(value: boolean): void {
    this.mapParameters.userPinAlignedWithOrientation = value
  }

  /**
   * Getting initial map location (middle tile)
   */
  getInitialMapTileLocation(): GeoPosition {
    return this.initialMapLocation
  }

  handleHoverUpdate(localPosition: vec2): void {
    if (!this.isInitialized) {
      return
    }
    if (this.isDraggingPin) {
      return
    }
    localPosition = localPosition.uniformScale(0.5)
    const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition)

    this.pinSet.forEach((pin: MapPin) => {
      const isHoveringPin =
        adjustedAnchoredPosition.distance(pin.screenTransform.anchors.getCenter()) <
        this.mapParameters.mapPinCursorDetectorSize
      if (isHoveringPin) {
        log.i("Pin hovered")
        if (!this.hoveringPinSet.has(pin)) {
          this.hoveringPinSet.add(pin)
          // Enable outline object
          pin.enableOutline(true)
        }
      } else if (this.hoveringPinSet.has(pin)) {
        log.i("Pin exit hover")

        this.hoveringPinSet.delete(pin)
        // Disable outline object
        pin.enableOutline(false)
      }
    })

    const firstHover: MapPin | null = this.hoveringPinSet.size > 0 ? this.hoveringPinSet.values().next().value : null
    this.placeListCreator?.setHoverOf(firstHover?.place)
  }

  handleTouchStart(localPosition: vec2): void {
    if (!this.isInitialized) {
      return
    }
    if (this.hoveringPinSet.size > 0) {
      log.i(`handleTouchStart`)
      for (let value of this.hoveringPinSet.values()) {
        this.draggingPin = value
        break
      }
      this.isDraggingPin = true
    } else {
      this.gridView.handleScrollStart(localPosition)
    }
  }

  handleTouchUpdate(localPosition: vec2): void {
    if (!this.isInitialized) {
      return
    }
    if (this.isDraggingPin && this.draggingPin.canBeMoved) {
      localPosition = localPosition.uniformScale(0.5)
      const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition)
      this.pinOffsetter.layoutScreenTransforms(this.gridView)
      this.pinOffsetter.unbindScreenTransform(this.draggingPin.screenTransform)
      this.draggingPin.screenTransform.anchors.setCenter(adjustedAnchoredPosition)
    } else {
      this.gridView.handleScrollUpdate(localPosition)
    }
  }

  handleTouchEnd(localPosition: vec2): void {
    if (!this.isInitialized) {
      return
    }
    if (this.isDraggingPin) {
      localPosition = localPosition.uniformScale(0.5)
      const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition)
      log.i(`handleTouchEnd at: ${adjustedAnchoredPosition}`)

      this.setPinLocation(this.draggingPin, adjustedAnchoredPosition.uniformScale(0.5))

      this.hoveringPinSet.add(this.draggingPin)
      this.draggingPin.sceneObject.getChild(0).enabled = true
      this.setSelectedPin(this.draggingPin)

      this.draggingPin = null
      this.isDraggingPin = false
    } else {
      this.gridView.handleScrollEnd()
    }
  }

  setZoomLevel(zoomLevel: number): void {
    zoomLevel = MathUtils.clamp(zoomLevel, 1, 20)
    this.mapParameters.zoomLevel = zoomLevel
    this.updateZoom()
  }

  handleZoomIn(): void {
    this.mapParameters.zoomLevel++
    this.updateZoom()
  }

  handleZoomOut(): void {
    this.mapParameters.zoomLevel--
    this.updateZoom()
  }

  toggleMiniMap(isOn: boolean, isAnimated: boolean = true): void {
    if (this.gridView === undefined) {
      return
    }
    this.config.isMiniMap = isOn
    this.config.gridScreenTransform.rotation = quat.quatIdentity()
    this.gridView.toggleMiniMap(isOn, this.pinSet, this.userPin, isAnimated)

    if (!isOn) {
      this.pinSet.forEach((pin: MapPin) => {
        pin.screenTransform.rotation = quat.quatIdentity()
      })
    }

    const scaleStart = !isOn
      ? this.userPinDefaultScale.uniformScale(this.mapParameters.userPinMinimizedScale)
      : this.userPinDefaultScale
    const scaleEnd = isOn
      ? this.userPinDefaultScale.uniformScale(this.mapParameters.userPinMinimizedScale)
      : this.userPinDefaultScale
    makeTween((t) => {
      this.userPin.screenTransform.scale = vec3.lerp(scaleStart, scaleEnd, t)
    }, TWEEN_DURATION)

    this.userPin.screenTransform.pivot = isOn ? vec2.zero() : new vec2(0.0, -0.5)
    this.onMiniMapToggledEvent.invoke(isOn)
  }

  private updateZoom(): void {
    this.mapParameters.zoomLevel = MathUtils.clamp(this.mapParameters.zoomLevel, 1, 20)
    this.mapParameters.zoomOffet = calculateZoomOffset(this.mapParameters.zoomLevel)
    this.setUpZoom()
    this.gridView.layoutCells(true)
    this.pinSet.forEach((pin: MapPin) => {
      const position = pin.place.getGeoPosition()
      this.updatePinLocation(pin, position)
    })
  }

  //  Map functionality
  // =====

  /**
   * Setting new position for user pin
   */
  private setNewUserPosition(location: GeoPosition): void {
    this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude)
    this.pinOffsetter.layoutScreenTransforms(this.gridView)
  }

  /**
   * Setting a new location for the map
   */
  public setNewMapLocation(location: GeoPosition): void {
    this.mapLocation = location
    this.pinOffsetter.bindScreenTransformToLocation(
      this.mapPinsAnchor.getComponent("ScreenTransform"),
      location.longitude,
      location.latitude,
    )

    this.pinOffsetter.layoutScreenTransforms(this.gridView)

    if (this.shouldFollowMapLocation) {
      this.offsetForLocation = getOffsetForLocation(
        this.mapModule,
        this.referencePositionLocationAsset,
        location.longitude,
        location.latitude,
      )
      this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition))
    }
  }

  //  Drawing geometry to map
  // =====

  /**
   * Drawing geometry point to map
   */
  drawGeometryPoint(geometryPoint: vec2, radius: number = 0.1) {
    const position: vec3 = this.getWorldPositionForGeometryPoint(geometryPoint)

    const sceneObject = global.scene.createSceneObject("")
    sceneObject.setParent(this.getSceneObject())
    const screenTransform = sceneObject.createComponent("Component.ScreenTransform")
    screenTransform.rotation = this.currentMapRotation.invert()

    const renderMeshSceneObject = global.scene.createSceneObject("")
    renderMeshSceneObject.setParent(sceneObject)
    renderMeshSceneObject.layer = this.getSceneObject().layer

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeCircle2DMesh(position, radius),
      this.lineMaterial,
      this.mapRenderOrder + 1,
    )

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude,
    )
    this.geometryObjects.push(sceneObject)
  }

  /**
   * Drawing geometry line to map
   */
  drawGeometryLine(geometryLine: vec2[], thickness: number = 0.2) {
    const start = this.getWorldPositionForGeometryPoint(geometryLine[0])
    const end = this.getWorldPositionForGeometryPoint(geometryLine[1])

    const sceneObject = global.scene.createSceneObject("")
    sceneObject.setParent(this.getSceneObject())
    const screenTransform = sceneObject.createComponent("Component.ScreenTransform")
    screenTransform.rotation = this.currentMapRotation.invert()

    var renderMeshSceneObject = global.scene.createSceneObject("")
    renderMeshSceneObject.setParent(sceneObject)
    renderMeshSceneObject.layer = this.getSceneObject().layer

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeLineStrip2DMeshWithJoints([start, end], thickness),
      this.lineMaterial,
      this.mapRenderOrder + 1,
    )

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude,
    )
    this.geometryObjects.push(sceneObject)
  }

  /**
   * Get the current location focus.
   */
  public getCurrentLocationFocus(): GeoPosition | null {
    if (!this.isInitialized) {
      return null
    }

    this.updateLocationOffset()
    const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(vec2.zero())
    const offset = this.gridView.getOffset().sub(this.offsetForLocation).sub(new vec2(0.5, 0.5))

    const location: GeoPosition = this.fromLocalPositionToLongLat(
      new vec2(adjustedAnchoredPosition.x - offset.x, adjustedAnchoredPosition.y + offset.y),
      this.mapParameters.zoomLevel,
    )
    return location
  }

  /**
   * Drawing geometry multiline to map
   */
  drawGeometryMultiline(geometryMultiline, thickness: number = 0.2) {
    const sceneObject = global.scene.createSceneObject("")
    sceneObject.setParent(this.getSceneObject())
    const screenTransform = sceneObject.createComponent("Component.ScreenTransform")
    screenTransform.rotation = this.currentMapRotation.invert()

    const renderMeshSceneObject = global.scene.createSceneObject("")
    renderMeshSceneObject.setParent(sceneObject)
    renderMeshSceneObject.layer = this.getSceneObject().layer

    const positions: vec3[] = geometryMultiline.map((point) => this.getWorldPositionForGeometryPoint(point))

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeLineStrip2DMeshWithJoints(positions, thickness),
      this.lineMaterial,
      this.mapRenderOrder + 1,
    )

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude,
    )
    this.geometryObjects.push(sceneObject)
  }

  /**
   * Clearing all drawn geometry
   */
  clearGeometry(): void {
    this.geometryObjects.forEach((sceneObject: SceneObject) => {
      this.pinOffsetter.unbindScreenTransform(sceneObject.getComponent("Component.ScreenTransform"))
      sceneObject.destroy()
    })
  }

  /**
   * Getting world position for geometry
   */
  getWorldPositionForGeometryPoint(geometryPoint: vec2) {
    var offset = this.gridView.getOffset()

    var initialTileOffset = this.mapModule.longLatToImageRatio(
      geometryPoint.x,
      geometryPoint.y,
      this.referencePositionLocationAsset,
    )
    var localPoint = new vec2(lerp(-1, 1, offset.x + initialTileOffset.x), lerp(1, -1, offset.y + initialTileOffset.y))
    return this.config.gridScreenTransform.localPointToWorldPoint(localPoint)
  }

  // Config bindings
  // =====

  /**
   * Assign the renderLayer to all the content on the content anchor
   */
  onContentMaskRenderLayer(renderLayer) {
    forEachSceneObjectInSubHierarchy(this.mapPinsAnchor, (sceneObject) => {
      sceneObject.layer = renderLayer
    })
  }

  /**
   * If the grid view scrolls, stop moving the view
   */
  onScrollingStarted() {
    log.i("onScrollingStarted")
    this.shouldFollowMapLocation = false
    this.viewScrolled = true
    this.onMapScrolledEvent.invoke()
  }

  /**
   *  Every tile the map updates it layout
   */
  onLayout() {
    this.pinOffsetter.layoutScreenTransforms(this.gridView)
  }

  /**
   * On the recenter call, scroll back to centre of the map
   */
  centerMap(): void {
    if (!this.isInitialized) {
      return
    }

    if (this.tweenCancelFunction) {
      this.tweenCancelFunction()
    }

    const currentOffset = this.gridView.getOffset()
    const userOffset: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude,
    )
    const targetOffset = userOffset.add(new vec2(0.5, 0.5))
    this.tweenCancelFunction = makeTween((t) => {
      // Stop the scroll view from scrolling
      this.gridView.resetVelocity()

      // Move it towards it's target position
      this.gridView.setOffset(vec2.lerp(currentOffset, targetOffset, t))
      if (t === 1) {
        this.shouldFollowMapLocation = true
        this.viewScrolled = false
        this.onMapCenteredEvent.invoke()
      }
    }, CENTER_MAP_TWEEN_DURATION)
  }

  isMapCentered(): boolean {
    const currentOffset: vec2 = this.gridView.getOffset()
    const userOffset: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude,
    )
    return currentOffset === userOffset.add(new vec2(0.5, 0.5))
  }

  getPositionWithMapRotationOffset(localPosition: vec2): vec2 {
    const degInRad = Math.atan2(localPosition.y, localPosition.x)
    const distance = Math.sqrt(localPosition.x * localPosition.x + localPosition.y * localPosition.y)
    const mapRotInRad = customGetEuler(this.config.gridScreenTransform.rotation).z
    const adjustedRotationInRad = degInRad - mapRotInRad
    const adjustedLocalPosition = new vec2(
      Math.cos(adjustedRotationInRad),
      Math.sin(adjustedRotationInRad),
    ).uniformScale(distance)
    return adjustedLocalPosition
  }

  private setSelectedPin(pin: MapPin): void {
    if (this.selectedPin === pin) {
      pin = null
    }

    this.pinSet.forEach((p) => {
      p.selected = p === pin
    })
    if (!this.config.isMiniMap) {
      this.navigationComponent.navigateToPlace(pin?.place ?? null)
    }
    this.selectedPin = pin
  }

  private getRenderConfig(): MapPinRenderConfig {
    return new MapPinRenderConfig(
      this.mapPinsAnchor.layer,
      this.mapRenderOrder,
      this.mapParameters.highlightPinColor,
      this.mapParameters.selectedPinColor,
    )
  }

  private createPlaceFromGeoPosition(position: GeoPosition, name: string | null = null) {
    const newPlace = new GeoLocationPlace(
      position,
      this.visitedDistance,
      name,
      null,
      "User created map pin.",
      this.userPosition,
    )

    return newPlace
  }

  private createPlaceFromUserPosition(name: string): Place {
    const newPlace = new GeoLocationPlace(
      this.userPosition.getGeoPosition(),
      this.visitedDistance,
      name,
      null,
      "User created map pin.",
      this.userPosition,
    )
    return newPlace
  }
}
