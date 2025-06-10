require("LensStudio:RawLocationModule");

import { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import Event, { callback } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { LensConfig } from "SpectaclesInteractionKit.lspkg/Utils/LensConfig";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { UpdateDispatcher } from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher";
import { Cell, TileViewEvent } from "./Cell";
import MapConfig from "./MapConfig";
import { MapGridView } from "./MapGridView";
import { MapPin } from "./MapPin";
import {
  clip,
  forEachSceneObjectInSubHierarchy,
  getOffsetForLocation,
  interpolate,
  makeTween,
  MapParameter,
  lerp,
  calculateZoomOffset,
  addRenderMeshVisual,
  makeCircle2DMesh,
  makeLineStrip2DMeshWithJoints,
  normalizeAngle,
  customGetEuler,
} from "./MapUtils";
import { PinOffsetter } from "./PinOffsetter";
import { PlaceInfo, SnapPlacesProvider } from "./SnapPlacesProvider";

const TEXTURE_SIZE = 512;

const MAX_LATITUDE = 85.05112878;
const MAX_LONGITUDE = -180;

const NEARBY_PLACES_RANGE = 100;

const CENTER_MAP_TWEEN_DURATION = 0.5;

const TAG = "[Map Controller]";
const log = new NativeLogger(TAG);

@component
export class MapController extends BaseScriptComponent {
  @input
  mapModule: MapModule;
  @input
  mapTilePrefab: ObjectPrefab;
  @input
  lineMaterial: Material;

  @input
  mapRenderPrefab: ObjectPrefab;

  @input
  @allowUndefined
  placesProvider: SnapPlacesProvider;

  private locationService: LocationService;

  private isMapComponent: boolean = true; // this is used by the MapComponent to find this component on one of the child
  mapParameters: MapParameter;
  mapGridObject: SceneObject;
  mapPinsAnchor: SceneObject;

  //Grid
  public pinOffsetter: PinOffsetter;
  public gridView: MapGridView;
  public config: MapConfig;
  public referencePositionLocationAsset: LocationAsset;
  private northwestLocationAsset: LocationAsset;

  public offsetForLocation: vec2;
  private mapRenderOrder = 1;
  private initialMapLocation: GeoPosition; // named initialMapTileLocation in js

  // Map
  private userPin: MapPin;
  private mapLocation: GeoPosition;
  private shouldFollowMapLocation = false;
  private viewScrolled: boolean;
  private lastMapUpdate = 0;
  private userLocation: GeoPosition;
  private loadedCells = 0;
  private mapCellCount = 0;

  // Pin
  private hoveringPinSet: Set<MapPin> = new Set();
  private pinSet: Set<MapPin> = new Set();
  private pinnedPlaceSet: Set<string> = new Set();
  private isDraggingPin: boolean = false;
  private draggingPin: MapPin | null = null;

  // Map Render
  private mapRenderObject: SceneObject;
  private mapScreenTransform: ScreenTransform;

  // Rotations
  private currentUserRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private targetUserRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private currentMapRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private targetMapRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private currentPinRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private targetPinRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private heading = 0; // in radians
  private orientation = quat.quatIdentity();

  private tweenCancelFunction: CancelFunction;

  private geometryObjects: SceneObject[] = [];

  private updateDispatcher: UpdateDispatcher =
    LensConfig.getInstance().updateDispatcher;

  private isInitialized: boolean = false;

  private onInitialLocationSetEvent = new Event<GeoPosition>();
  public onInitialLocationSet = this.onInitialLocationSetEvent.publicApi();

  private onMapTilesLoadedEvent = new Event();
  public onMapTilesLoaded = this.onMapTilesLoadedEvent.publicApi();

  private onUserLocationSetEvent = new Event<GeoPosition>();
  public onUserLocationSet = this.onUserLocationSetEvent.publicApi();

  private onMapCenteredEvent = new Event();
  public onMapCentered = this.onMapCenteredEvent.publicApi();

  private onMapScrolledEvent = new Event();
  public onMapScrolled = this.onMapScrolledEvent.publicApi();

  private onTileWentOutOfViewEvent = new Event<TileViewEvent>();
  public onTileWentOutOfView = this.onTileWentOutOfViewEvent.publicApi();

  private onTileCameIntoViewEvent = new Event<TileViewEvent>();
  public onTileCameIntoView = this.onTileCameIntoViewEvent.publicApi();

  private onMapPinAddedEvent = new Event<MapPin>();
  public onMapPinAdded = this.onMapPinAddedEvent.publicApi();

  private onMapPinRemovedEvent = new Event<MapPin>();
  public onMapPinRemoved = this.onMapPinRemovedEvent.publicApi();

  private onAllMapPinsRemovedEvent = new Event();
  public onAllMapPinsRemoved = this.onAllMapPinsRemovedEvent.publicApi();

  private onMiniMapToggledEvent = new Event<boolean>();
  public onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();

  private onNoNearbyPlacesFoundEvent = new Event();
  public onNoNearbyPlacesFound = this.onNoNearbyPlacesFoundEvent.publicApi();

  private onNearbyPlacesFailedEvent = new Event();
  public onNearbyPlacesFailed = this.onNearbyPlacesFailedEvent.publicApi();

  /**
   * Called from Map component script to initialize the script
   */
  initialize(mapParameters: MapParameter, startedAsMiniMap: boolean): void {
    log.i("Initializing Map Controller");
    this.locationService = GeoLocation.createLocationService();
    this.locationService.onNorthAlignedOrientationUpdate.add(
      this.handleNorthAlignedOrientationUpdate.bind(this)
    );
    this.locationService.accuracy = GeoLocationAccuracy.Navigation;

    this.mapParameters = mapParameters;

    this.mapRenderObject = this.mapRenderPrefab.instantiate(
      mapParameters.renderParent
    );

    this.mapRenderObject.getTransform().setLocalPosition(vec3.zero());

    this.mapGridObject = this.mapRenderObject.getChild(0);
    this.mapScreenTransform = this.mapGridObject.getComponent(
      "Component.ScreenTransform"
    );

    this.mapPinsAnchor = this.mapGridObject.getChild(0);

    if (this.mapParameters.setMapToCustomLocation) {
      this.mapLocation = this.mapParameters.mapLocation;
    }

    this.fetchLocation((location: GeoPosition) => {
      if (!this.mapParameters.setMapToCustomLocation) {
        this.mapLocation = location;
      }

      this.createMapGrid();
      this.centerMap();

      if (mapParameters.showUserPin) {
        this.spawnUserPin(
          mapParameters.userPinVisual,
          location,
          mapParameters.userPinScale
        );
      }

      this.updateDispatcher
        .createUpdateEvent("UpdateEvent")
        .bind(this.onUpdate.bind(this));
      this.updateDispatcher
        .createLateUpdateEvent("LateUpdateEvent")
        .bind(() => this.gridView.updateGridView(this.pinSet, this.userPin));

      if (startedAsMiniMap) {
        this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false);
      }

      log.i("Map Controller initialized");
      this.isInitialized = true;
    });
  }

  private onUpdate() {
    if (!this.isInitialized) {
      return;
    }

    //User / Map location update
    if (
      getTime() - this.lastMapUpdate >
      this.mapParameters.mapUpdateThreshold
    ) {
      this.fetchLocation((location: GeoPosition) => {
        if (!this.mapParameters.setMapToCustomLocation) {
          this.setNewMapLocation(location);
        }

        if (this.mapParameters.showUserPin) {
          this.setNewUserPosition(location);
        }
      });

      this.lastMapUpdate = getTime();
    }
    this.updateRotations();
  }

  private fetchLocation(callback: callback<GeoPosition>) {
    this.locationService.getCurrentPosition(
      (geoPosition) => {
        callback(geoPosition);
      },
      (error) => {
        log.e(`Error fetching location: ${error} \n ${Error().stack}`);
      }
    );
  }

  private handleNorthAlignedOrientationUpdate(orientation: quat) {
    this.orientation = orientation;

    // GeoLocation.getNorthAlignedHeading() currently returns a offsetted heading when the user tilts their head in multiple axis.
    // (e.g. tilting upward in x-axis and then to the left along the z-axis. The heading calculated from GeoLocation.getNorthAlignedHeading() will then start shifting to the left)
    // This is a temporary fix to minimize the shifting. This will be replaced by GeoLocation.getNorthAlignedHeading when the issue is fixed.
    this.heading = normalizeAngle(customGetEuler(orientation).y);
  }

  private updateRotations() {
    const pinRotation = -this.getUserHeading();

    if (this.mapParameters.showUserPin) {
      //setting user pin rotation
      this.updateUserPinRotation(pinRotation);
    }

    if (this.mapParameters.setMapToCustomLocation) {
      return;
    }

    // Rotate the map only when the map is centered at the user location (not scrolled) and minimap mode is activated
    if (
      this.mapParameters.isMinimapAutoRotate &&
      !this.viewScrolled &&
      this.config.isMiniMap
    ) {
      this.updateMapRotation();
      this.updateMapPinRotations(pinRotation);
    }
  }

  private updateMapPinRotations(pinRotation: number) {
    if (this.mapParameters.mapPinsRotated) {
      if (this.mapParameters.enableMapSmoothing) {
        this.targetPinRotation = quat.fromEulerAngles(0, 0, pinRotation);
        this.currentPinRotation = interpolate(
          this.currentPinRotation,
          this.targetPinRotation,
          4
        );
        this.pinSet.forEach((pin: MapPin) => {
          pin.screenTransform.rotation = this.currentPinRotation;
        });
      } else {
        this.pinSet.forEach((pin: MapPin) => {
          pin.screenTransform.rotation = quat.fromEulerAngles(
            0,
            0,
            pinRotation
          );
        });
      }
    }
  }

  private updateMapRotation() {
    if (this.mapParameters.enableMapSmoothing) {
      this.targetMapRotation = quat.fromEulerAngles(
        0,
        0,
        this.getUserHeading()
      );

      this.currentMapRotation = interpolate(
        this.currentMapRotation,
        this.targetMapRotation,
        4
      );
      this.config.gridScreenTransform.rotation = this.currentMapRotation;
    } else {
      this.config.gridScreenTransform.rotation = quat.fromEulerAngles(
        0,
        0,
        this.getUserHeading()
      );
    }
  }

  private updateUserPinRotation(pinRotation: number) {
    if (
      this.userPin.screenTransform &&
      this.mapParameters.userPinAlignedWithOrientation
    ) {
      if (this.mapParameters.enableMapSmoothing) {
        this.targetUserRotation = quat.fromEulerAngles(0, 0, pinRotation);
        this.currentUserRotation = interpolate(
          this.currentUserRotation,
          this.targetUserRotation,
          4
        );
        this.userPin.screenTransform.rotation = this.currentUserRotation;
      } else {
        this.userPin.screenTransform.rotation = quat.fromEulerAngles(
          0,
          0,
          pinRotation
        );
      }
    }
  }

  //  Exposed functions
  // =====

  getUserLocation(): GeoPosition {
    return this.userLocation;
  }

  getUserHeading(): number {
    // TODO: Remove the negative sign when the heading is fixed in the Lens Studio
    if (global.deviceInfoSystem.isEditor()) {
      return -this.heading;
    }
    return this.heading;
  }

  getUserOrientation(): quat {
    return this.orientation;
  }

  /**
   * For creating a new map pin for the map
   */
  createMapPin(
    location: GeoPosition,
    placeInfo: PlaceInfo = undefined
  ): MapPin {
    const pin = MapPin.makeMapPin(
      this.mapParameters.mapPinPrefab,
      this.mapGridObject,
      this.mapPinsAnchor.layer,
      this.mapRenderOrder,
      location,
      placeInfo
    );

    this.pinSet.add(pin);

    // Bind a location pin
    this.pinOffsetter.bindScreenTransformToLocation(
      pin.screenTransform,
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    pin.highlight();

    this.onMapPinAddedEvent.invoke(pin);
    return pin;
  }

  /**
   * Removing map pin
   */
  removeMapPin(mapPin: MapPin) {
    if (this.pinSet.has(mapPin)) {
      this.pinSet.delete(mapPin);
    }

    if (mapPin.placeInfo !== undefined) {
      this.pinnedPlaceSet.delete(mapPin.placeInfo.placeId);
    }

    const pinScreenTransform =
      mapPin.sceneObject.getComponent("ScreenTransform");
    this.pinOffsetter.unbindScreenTransform(pinScreenTransform);
    mapPin.sceneObject.destroy();

    this.onMapPinRemovedEvent.invoke(mapPin);
  }

  /**
   * Removes all the map pins from the map
   */
  removeMapPins() {
    this.pinSet.forEach((pin: MapPin) => {
      this.pinOffsetter.unbindScreenTransform(pin.screenTransform);
      this.pinSet.delete(pin);
      pin.sceneObject.destroy();
    });

    this.pinnedPlaceSet.clear();

    this.onAllMapPinsRemovedEvent.invoke();
  }

  addPinByLocalPosition(localPosition: vec2): MapPin {
    const newPin = MapPin.makeMapPin(
      this.mapParameters.mapPinPrefab,
      this.mapGridObject,
      this.mapPinsAnchor.layer,
      this.mapRenderOrder,
      null
    );
    this.pinSet.add(newPin);

    this.pinOffsetter.layoutScreenTransforms(this.gridView);

    newPin.sceneObject.enabled = true;

    const adjustedAnchoredPosition =
      this.getPositionWithMapRotationOffset(localPosition);

    this.setPinLocation(newPin, adjustedAnchoredPosition);

    return newPin;
  }

  private setPinLocation(pin: MapPin, adjustedAnchoredPosition: vec2) {
    const offset = this.gridView
      .getOffset()
      .sub(this.offsetForLocation)
      .sub(new vec2(0.5, 0.5));
    const location: GeoPosition = this.fromLocalPositionToLongLat(
      new vec2(
        adjustedAnchoredPosition.x - offset.x,
        adjustedAnchoredPosition.y + offset.y
      ),
      this.mapParameters.zoomLevel
    );
    pin.location = location;
    this.pinOffsetter.bindScreenTransformToLocation(
      pin.screenTransform,
      pin.location.longitude,
      pin.location.latitude
    );
    pin.location.altitude = this.userLocation.altitude;

    this.onMapPinAddedEvent.invoke(pin);
  }

  private fromLocalPositionToLongLat(
    localPosition: vec2,
    zoomLevel: number
  ): GeoPosition {
    const pixelOffsetFromMapLocationX = localPosition.x * TEXTURE_SIZE;
    const pixelOffsetFromMapLocationY = -localPosition.y * TEXTURE_SIZE;

    const mapImageOffset = this.mapModule.longLatToImageRatio(
      this.mapLocation.longitude,
      this.mapLocation.latitude,
      this.northwestLocationAsset
    );

    const pixelX =
      mapImageOffset.x * TEXTURE_SIZE + pixelOffsetFromMapLocationX;
    const pixelY =
      mapImageOffset.y * TEXTURE_SIZE + pixelOffsetFromMapLocationY;

    const mapSize = TEXTURE_SIZE << zoomLevel;

    const x = clip(pixelX, 0, mapSize - 1) / mapSize - 0.5;
    const y = 0.5 - clip(pixelY, 0, mapSize - 1) / mapSize;

    const latitude =
      90 - (360 * Math.atan(Math.exp(-y * 2 * Math.PI))) / Math.PI;
    const longitude = 360 * x;

    const location = GeoPosition.create();
    location.longitude = longitude;
    location.latitude = latitude;

    return location;
  }

  createMapPinAtUserLocation() {
    return this.createMapPin(this.userLocation);
  }

  updateLocationOffset() {
    this.offsetForLocation = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
  }

  private createMapGrid() {
    const gridScreenTransform =
      this.mapGridObject.getComponent("ScreenTransform");

    this.gridView = MapGridView.makeGridView(this);

    this.config = MapConfig.makeConfig(
      this.mapPinsAnchor,
      this.mapScreenTransform,
      gridScreenTransform,
      this.mapTilePrefab,
      this,
      this.mapParameters.enableScrolling,
      this.mapParameters.scrollingFriction,
      this.mapParameters.tileCount
    );

    this.initialMapLocation = GeoPosition.create();
    this.initialMapLocation.longitude = this.mapLocation.longitude;
    this.initialMapLocation.latitude = this.mapLocation.latitude;
    this.onInitialLocationSetEvent.invoke(this.initialMapLocation);

    this.shouldFollowMapLocation = true;

    this.setUpZoom();
  }

  /**
   * Provide the cells to be configures / built. Cells are reused as data is scrolled.
   */
  configureCell(cell: Cell) {
    cell.imageComponent = cell.sceneObject.getComponent("Component.Image");

    cell.imageComponent.mainMaterial = cell.imageComponent.mainMaterial.clone();

    // Creating Map Texture Provider
    const mapTexture = this.mapModule.createMapTextureProvider();
    cell.textureProvider = mapTexture.control as MapTextureProvider;

    cell.imageComponent.mainPass.baseTex = mapTexture;

    cell.onTileCameIntoView.add((event) =>
      this.onTileCameIntoViewEvent.invoke(event)
    );

    cell.onTileWentOutOfView.add((event) =>
      this.onTileWentOutOfViewEvent.invoke(event)
    );

    //A function that gets called when location data fails to download.
    cell.textureProvider.onFailed.add(() => {
      log.e("Location data failed to download");
      cell.retryTextureLoading();
    });

    //A function that gets called when location data is downloaded.
    cell.textureProvider.onReady.add(() => {
      this.mapTileloaded();
    });
  }

  //Called when individual map tile is loaded
  private mapTileloaded() {
    this.loadedCells++;

    if (this.loadedCells == this.mapCellCount) {
      this.onMapTilesLoadedEvent.invoke();
    }
  }

  onCellCountChanged(cellCount: number): void {
    this.mapCellCount = cellCount;
  }

  private setUpZoom() {
    this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(
      this.mapLocation.longitude,
      this.mapLocation.latitude
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
    this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(
      MAX_LONGITUDE,
      MAX_LATITUDE
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);

    // Calculate how much the map needs to be scrolled to match the geo position of the tile
    this.updateLocationOffset();

    // Offset the map so that it include the map focus position and the offset for the initial location for the provided tile
    this.gridView.setOffset(
      this.offsetForLocation.add(this.mapParameters.mapFocusPosition)
    );

    // Create a binder that can offset a screen transfor for a given location
    this.pinOffsetter = PinOffsetter.makeMapLocationOffsetter(
      this.mapModule,
      this.referencePositionLocationAsset
    );

    // Apply the config (will build the grid view if not already, then will apply the settings)
    this.gridView.handleUpdateConfig(this.config);
  }

  /**
   * Spawning a user pin
   */
  spawnUserPin(
    mapPinPrefab: ObjectPrefab,
    location: GeoPosition,
    mapPinScale: vec2
  ) {
    this.userPin = MapPin.makeMapPin(
      mapPinPrefab,
      this.mapGridObject,
      this.mapPinsAnchor.layer,
      this.mapRenderOrder + 2,
      location,
      undefined,
      true
    );

    this.userPin.screenTransform.scale = new vec3(
      mapPinScale.x,
      mapPinScale.y,
      1.0
    );

    // Bind a location pin
    this.pinOffsetter.bindScreenTransformToLocation(
      this.userPin.screenTransform,
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);
  }

  /**
   * For enabling/disabling scrolling of the map
   */
  setMapScrolling(value: boolean): void {
    this.config.horizontalScrollingEnabled = value;
    this.config.verticalScrollingEnabled = value;
  }

  /**
   * Setting if user pin should be rotated
   */
  setUserPinRotated(value: boolean): void {
    this.mapParameters.userPinAlignedWithOrientation = value;
  }

  /**
   * Getting initial map location (middle tile)
   */
  getInitialMapTileLocation(): GeoPosition {
    return this.initialMapLocation;
  }

  handleHoverUpdate(localPosition: vec2): void {
    if (!this.isInitialized) {
      return;
    }
    if (this.isDraggingPin) {
      return;
    }
    localPosition = localPosition.uniformScale(0.5);
    const adjustedAnchoredPosition =
      this.getPositionWithMapRotationOffset(localPosition);

    this.pinSet.forEach((pin: MapPin) => {
      const isHoveringPin =
        adjustedAnchoredPosition.distance(
          pin.screenTransform.anchors.getCenter()
        ) < this.mapParameters.mapPinCursorDetectorSize;
      if (isHoveringPin) {
        log.i("Pin hovered");
        if (!this.hoveringPinSet.has(pin)) {
          this.hoveringPinSet.add(pin);
          // Enable outline object
          pin.enableOutline(true);
        }
      } else if (this.hoveringPinSet.has(pin)) {
        log.i("Pin exit hover");

        this.hoveringPinSet.delete(pin);
        // Disable outline object
        pin.enableOutline(false);
      }
    });
  }

  handleTouchStart(localPosition: vec2): void {
    if (!this.isInitialized) {
      return;
    }
    if (this.hoveringPinSet.size > 0) {
      log.i(`handleTouchStart`);
      for (let value of this.hoveringPinSet.values()) {
        this.draggingPin = value;
        break;
      }
      this.isDraggingPin = true;
    } else {
      this.gridView.handleScrollStart(localPosition);
    }
  }

  handleTouchUpdate(localPosition: vec2): void {
    if (!this.isInitialized) {
      return;
    }
    if (this.isDraggingPin) {
      localPosition = localPosition.uniformScale(0.5);
      const adjustedAnchoredPosition =
        this.getPositionWithMapRotationOffset(localPosition);
      this.pinOffsetter.layoutScreenTransforms(this.gridView);
      this.pinOffsetter.unbindScreenTransform(this.draggingPin.screenTransform);
      this.draggingPin.screenTransform.anchors.setCenter(
        adjustedAnchoredPosition
      );
    } else {
      this.gridView.handleScrollUpdate(localPosition);
    }
  }

  handleTouchEnd(localPosition: vec2): void {
    if (!this.isInitialized) {
      return;
    }
    if (this.isDraggingPin) {
      localPosition = localPosition.uniformScale(0.5);
      const adjustedAnchoredPosition =
        this.getPositionWithMapRotationOffset(localPosition);
      log.i(`handleTouchEnd at: ${adjustedAnchoredPosition}`);

      this.setPinLocation(
        this.draggingPin,
        adjustedAnchoredPosition.uniformScale(0.5)
      );

      this.hoveringPinSet.add(this.draggingPin);
      this.draggingPin.sceneObject.getChild(0).enabled = true;

      this.draggingPin = null;
      this.isDraggingPin = false;
    } else {
      this.gridView.handleScrollEnd();
    }
  }

  handleZoomIn(): void {
    this.mapParameters.zoomLevel++;
    this.mapParameters.zoomOffet = calculateZoomOffset(
      this.mapParameters.zoomLevel
    );
    this.setUpZoom();
    this.gridView.layoutCells(true);
    this.pinSet.forEach((pin: MapPin) => {
      this.pinOffsetter.bindScreenTransformToLocation(
        pin.screenTransform,
        pin.location.longitude,
        pin.location.latitude
      );
    });
  }

  handleZoomOut(): void {
    this.mapParameters.zoomLevel--;
    this.mapParameters.zoomOffet = calculateZoomOffset(
      this.mapParameters.zoomLevel
    );
    this.setUpZoom();
    this.gridView.layoutCells(true);
    this.pinSet.forEach((pin: MapPin) => {
      this.pinOffsetter.bindScreenTransformToLocation(
        pin.screenTransform,
        pin.location.longitude,
        pin.location.latitude
      );
    });
  }

  toggleMiniMap(isOn: boolean): void {
    if (this.gridView === undefined) {
      return;
    }
    this.config.gridScreenTransform.rotation = quat.quatIdentity();
    this.gridView.toggleMiniMap(isOn, this.pinSet, this.userPin);

    if (!isOn) {
      this.pinSet.forEach((pin: MapPin) => {
        pin.screenTransform.rotation = quat.quatIdentity();
      });
    }

    this.onMiniMapToggledEvent.invoke(isOn);
  }

  //  Map functionality
  // =====

  /**
   * Setting new position for user pin
   */
  private setNewUserPosition(location: GeoPosition): void {
    const oldUserLocation = this.userLocation;

    this.userLocation = location;
    this.pinOffsetter.bindScreenTransformToLocation(
      this.userPin.screenTransform,
      location.longitude,
      location.latitude
    );
    this.pinOffsetter.layoutScreenTransforms(this.gridView);

    if (oldUserLocation === undefined && location !== undefined) {
      this.onUserLocationSetEvent.invoke(location);
    }
  }

  /**
   * Setting a new location for the map
   */
  private setNewMapLocation(location: GeoPosition): void {
    this.mapLocation = location;
    this.pinOffsetter.bindScreenTransformToLocation(
      this.mapPinsAnchor.getComponent("ScreenTransform"),
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);

    if (this.shouldFollowMapLocation) {
      this.offsetForLocation = getOffsetForLocation(
        this.mapModule,
        this.referencePositionLocationAsset,
        location.longitude,
        location.latitude
      );
      this.gridView.setOffset(
        this.offsetForLocation.add(this.mapParameters.mapFocusPosition)
      );
    }
  }

  //  Drawing geometry to map
  // =====

  /**
   * Drawing geometry point to map
   */
  drawGeometryPoint(geometryPoint: vec2, radius: number = 0.1) {
    const position: vec3 = this.getWorldPositionForGeometryPoint(geometryPoint);

    const sceneObject = global.scene.createSceneObject("");
    sceneObject.setParent(this.getSceneObject());
    const screenTransform = sceneObject.createComponent(
      "Component.ScreenTransform"
    );
    screenTransform.rotation = this.currentMapRotation.invert();

    const renderMeshSceneObject = global.scene.createSceneObject("");
    renderMeshSceneObject.setParent(sceneObject);
    renderMeshSceneObject.layer = this.getSceneObject().layer;

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeCircle2DMesh(position, radius),
      this.lineMaterial,
      this.mapRenderOrder + 1
    );

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    this.geometryObjects.push(sceneObject);
  }

  /**
   * Drawing geometry line to map
   */
  drawGeometryLine(geometryLine: vec2[], thickness: number = 0.2) {
    const start = this.getWorldPositionForGeometryPoint(geometryLine[0]);
    const end = this.getWorldPositionForGeometryPoint(geometryLine[1]);

    const sceneObject = global.scene.createSceneObject("");
    sceneObject.setParent(this.getSceneObject());
    const screenTransform = sceneObject.createComponent(
      "Component.ScreenTransform"
    );
    screenTransform.rotation = this.currentMapRotation.invert();

    var renderMeshSceneObject = global.scene.createSceneObject("");
    renderMeshSceneObject.setParent(sceneObject);
    renderMeshSceneObject.layer = this.getSceneObject().layer;

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeLineStrip2DMeshWithJoints([start, end], thickness),
      this.lineMaterial,
      this.mapRenderOrder + 1
    );

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    this.geometryObjects.push(sceneObject);
  }

  /**
   * Drawing geometry multiline to map
   */
  drawGeometryMultiline(geometryMultiline, thickness: number = 0.2) {
    const sceneObject = global.scene.createSceneObject("");
    sceneObject.setParent(this.getSceneObject());
    const screenTransform = sceneObject.createComponent(
      "Component.ScreenTransform"
    );
    screenTransform.rotation = this.currentMapRotation.invert();

    const renderMeshSceneObject = global.scene.createSceneObject("");
    renderMeshSceneObject.setParent(sceneObject);
    renderMeshSceneObject.layer = this.getSceneObject().layer;

    const positions: vec3[] = geometryMultiline.map((point) =>
      this.getWorldPositionForGeometryPoint(point)
    );

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeLineStrip2DMeshWithJoints(positions, thickness),
      this.lineMaterial,
      this.mapRenderOrder + 1
    );

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    this.geometryObjects.push(sceneObject);
  }

  /**
   * Clearing all drawn geometry
   */
  clearGeometry(): void {
    this.geometryObjects.forEach((sceneObject: SceneObject) => {
      this.pinOffsetter.unbindScreenTransform(
        sceneObject.getComponent("Component.ScreenTransform")
      );
      sceneObject.destroy();
    });
  }

  /**
   * Getting world position for geometry
   */
  getWorldPositionForGeometryPoint(geometryPoint: vec2) {
    var offset = this.gridView.getOffset();

    var initialTileOffset = this.mapModule.longLatToImageRatio(
      geometryPoint.x,
      geometryPoint.y,
      this.referencePositionLocationAsset
    );
    var localPoint = new vec2(
      lerp(-1, 1, offset.x + initialTileOffset.x),
      lerp(1, -1, offset.y + initialTileOffset.y)
    );
    return this.config.gridScreenTransform.localPointToWorldPoint(localPoint);
  }

  // Config bindings
  // =====

  /**
   * Assign the renderLayer to all the content on the content anchor
   */
  onContentMaskRenderLayer(renderLayer) {
    forEachSceneObjectInSubHierarchy(this.mapPinsAnchor, (sceneObject) => {
      sceneObject.layer = renderLayer;
    });
  }

  /**
   * If the grid view scrolls, stop moving the view
   */
  onScrollingStarted() {
    log.i("onScrollingStarted");
    this.shouldFollowMapLocation = false;
    this.viewScrolled = true;
    this.onMapScrolledEvent.invoke();
  }

  /**
   *  Every tile the map updates it layout
   */
  onLayout() {
    this.pinOffsetter.layoutScreenTransforms(this.gridView);
  }

  /**
   * On the recenter call, scroll back to centre of the map
   */
  centerMap(): void {
    if (!this.isInitialized) {
      return;
    }

    if (this.tweenCancelFunction) {
      this.tweenCancelFunction();
    }

    const currentOffset = this.gridView.getOffset();
    const userOffset: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    const targetOffset = userOffset.add(new vec2(0.5, 0.5));
    this.tweenCancelFunction = makeTween((t) => {
      // Stop the scroll view from scrolling
      this.gridView.resetVelocity();

      // Move it towards it's target position
      this.gridView.setOffset(vec2.lerp(currentOffset, targetOffset, t));
      if (t === 1) {
        this.shouldFollowMapLocation = true;
        this.viewScrolled = false;
        this.onMapCenteredEvent.invoke();
      }
    }, CENTER_MAP_TWEEN_DURATION);
  }

  isMapCentered(): boolean {
    const currentOffset: vec2 = this.gridView.getOffset();
    const userOffset: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    return currentOffset === userOffset.add(new vec2(0.5, 0.5));
  }

  getPositionWithMapRotationOffset(localPosition: vec2): vec2 {
    const degInRad = Math.atan2(localPosition.y, localPosition.x);
    const distance = Math.sqrt(
      localPosition.x * localPosition.x + localPosition.y * localPosition.y
    );
    const mapRotInRad = customGetEuler(
      this.config.gridScreenTransform.rotation
    ).z;
    const adjustedRotationInRad = degInRad - mapRotInRad;
    const adjustedLocalPosition = new vec2(
      Math.cos(adjustedRotationInRad),
      Math.sin(adjustedRotationInRad)
    ).uniformScale(distance);
    return adjustedLocalPosition;
  }

  showNearbyPlaces(category: string[]): void {
    this.placesProvider
      .getNearbyPlaces(this.mapLocation, NEARBY_PLACES_RANGE, category)
      .then((places) => {
        if (places.length === 0) {
          this.onNoNearbyPlacesFoundEvent.invoke();
          return;
        }

        const placeString: string = places
          .map((place) => {
            return `${place.name}`;
          })
          .join("\n");
        log.i("get nearby places: " + placeString);

        this.placesProvider
          .getPlacesInfo(places)
          .then((placesInfo: PlaceInfo[]) => {
            for (let i = 0; i < placesInfo.length; i++) {
              // Check if the place is already pinned
              if (!this.pinnedPlaceSet.has(placesInfo[i].placeId)) {
                this.createMapPin(placesInfo[i].centroid, placesInfo[i]);
                this.pinnedPlaceSet.add(placesInfo[i].placeId);
              }
            }
          })
          .catch((error) => {
            log.e(error);
          });
      })
      .catch((error) => {
        log.e(error);
        this.onNearbyPlacesFailedEvent.invoke();
      });
  }
}
