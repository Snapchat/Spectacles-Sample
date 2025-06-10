import {MapController} from "./MapController"
import {forEachSceneObjectInSubHierarchy} from "./MapUtils"

export default class MapConfig {
  // Grid
  initialPositionLocationAsset: LocationAsset
  tileCount: number

  scrollingFriction: number

  mapComponentScreenTransform: ScreenTransform
  gridScreenTransform: ScreenTransform
  mapPinsAnchor: SceneObject
  mapTilePrefab: ObjectPrefab
  mapRenderOrder: number = 1
  isMiniMap: boolean = true

  // Horizontal
  horizontalScrollingEnabled: boolean
  horizontalMinIndex: number
  horizontalMaxIndex: number
  horizontalAllowOutOfIndexRange: boolean

  // Vertical
  verticalScrollingEnabled: boolean
  verticalMinIndex: number
  verticalMaxIndex: number
  verticalAllowOutOfIndexRange: boolean

  private mapController: MapController

  static makeConfig(
    mapPinsAnchor: SceneObject,
    mapComponentScreenTransform: ScreenTransform,
    gridScreenTransform: ScreenTransform,
    mapTilePrefab: ObjectPrefab,
    mapController: MapController,
    enableScrolling: boolean,
    scrollingFriction: number,
    tileCount: number,
  ): MapConfig {
    let config = new MapConfig()

    config.mapPinsAnchor = mapPinsAnchor
    config.mapComponentScreenTransform = mapComponentScreenTransform
    config.gridScreenTransform = gridScreenTransform
    config.mapTilePrefab = mapTilePrefab

    config.mapController = mapController

    // Set the horizontal properties
    config.horizontalScrollingEnabled = enableScrolling
    config.horizontalMinIndex = -Infinity
    config.horizontalMaxIndex = Infinity
    config.horizontalAllowOutOfIndexRange = true // When true, `onDataChanged` will be called even when a cell is out of range and the cell will not be disabled when out of range.
    config.tileCount = tileCount

    // Set the vertical properties
    config.verticalScrollingEnabled = enableScrolling
    config.verticalMinIndex = -Infinity
    config.verticalMaxIndex = Infinity
    config.verticalAllowOutOfIndexRange = false // When true, `onDataChanged` will be called even when a cell is out of range and the cell will not be disabled when out of range.

    config.scrollingFriction = scrollingFriction

    return config
  }

  /**
   * Assign the renderLayer to all the content on the content anchor
   */
  onContentMaskRenderLayer(renderLayer: LayerSet) {
    forEachSceneObjectInSubHierarchy(this.mapPinsAnchor, (sceneObject) => {
      sceneObject.layer = renderLayer
    })
  }

  onLayout() {
    this.mapController.pinOffsetter.layoutScreenTransforms(this.mapController.gridView)
  }
}
