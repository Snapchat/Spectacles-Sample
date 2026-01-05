import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {MapGridView} from "./MapGridView"
import {LocationBoundScreenTransform, setScreenTransformRect01} from "./MapUtils"

const TAG = "[PinOffsetter]"
const log = new NativeLogger(TAG)

export class PinOffsetter {
  locationBoundScreenTransforms: {
    [id: string]: LocationBoundScreenTransform
  } = {}
  mapModule: MapModule
  initialLocationAsset: LocationAsset

  static makeMapLocationOffsetter(mapModule: MapModule, initialLocationAsset: LocationAsset): PinOffsetter {
    const pinOffsetter = new PinOffsetter()
    pinOffsetter.mapModule = mapModule
    pinOffsetter.initialLocationAsset = initialLocationAsset
    return pinOffsetter
  }

  bindScreenTransformToLocation(screenTransform: ScreenTransform, longitude: number, latitude: number): void {
    if (isNull(longitude) || isNull(latitude)) {
      return
    }
    this.locationBoundScreenTransforms[screenTransform.uniqueIdentifier] = {
      screenTransform: screenTransform,
      longitude: longitude,
      latitude: latitude
    }
  }
  unbindScreenTransform(screenTransform: ScreenTransform): void {
    delete this.locationBoundScreenTransforms[screenTransform.uniqueIdentifier]
  }
  layoutScreenTransforms(gridView: MapGridView): void {
    Object.keys(this.locationBoundScreenTransforms).forEach((locationKey) => {
      const offset = gridView.getOffset()
      const boundLocation = this.locationBoundScreenTransforms[locationKey]
      const initialTileOffset = this.mapModule.longLatToImageRatio(
        boundLocation.longitude,
        boundLocation.latitude,
        this.initialLocationAsset
      )
      setScreenTransformRect01(
        boundLocation.screenTransform,
        offset.x + initialTileOffset.x,
        offset.y + initialTileOffset.y,
        0,
        0
      )
    })
  }
}
