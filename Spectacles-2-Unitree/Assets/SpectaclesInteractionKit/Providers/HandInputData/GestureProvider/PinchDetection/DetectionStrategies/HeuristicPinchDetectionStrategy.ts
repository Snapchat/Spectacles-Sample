import BistableThreshold from "../../../../../Utils/BistableThreshold"
import Event, {PublicApi} from "../../../../../Utils/Event"
import {LensConfig} from "../../../../../Utils/LensConfig"
import {clamp, mapValue} from "../../../../../Utils/mathUtils"
import NativeLogger from "../../../../../Utils/NativeLogger"
import WorldCameraFinderProvider from "../../../../CameraProvider/WorldCameraFinderProvider"
import {Keypoint} from "../../../Keypoint"
import {PinchEventType} from "../../PinchEventType"
import {PinchDetectionStrategy} from "../DetectionStrategies/PinchDetectionStrategy"

const TAG = "HeuristicPinchDetection"
const MIN_PINCH_DISTANCE = 2
const MAX_PINCH_DISTANCE = 7

export type HeuristicPinchDetectionStrategyConfig = {
  thumbTip: Keypoint
  indexTip: Keypoint
  pinchDownThreshold?: number
}

/**
 * Class to detect pinch using a bistable threshold and the distance between index and thumb tips
 */
export default class HeuristicPinchDetectionStrategy
  implements PinchDetectionStrategy
{
  // Native Logging
  private log = new NativeLogger(TAG)

  private worldCamera = WorldCameraFinderProvider.getInstance()

  private pinchEnterThreshold = new BistableThreshold({
    edgeActivate: this.config.pinchDownThreshold ?? 1.75,
    edgeDeactivate: 3.5,
  })
  private thumbProjectThreshold = new BistableThreshold({
    edgeActivate: 3.0,
    edgeDeactivate: 4.5,
  })

  private currentPinchProximity = 0
  private previousPinchProximity = 0

  private _onPinchDetectedEvent = new Event<PinchEventType>()
  private _onPinchDetected = this._onPinchDetectedEvent.publicApi()

  private _onPinchProximityEvent = new Event<number>()
  private _onPinchProximity = this._onPinchProximityEvent.publicApi()

  constructor(private config: HeuristicPinchDetectionStrategyConfig) {
    const lensConfig = LensConfig.getInstance()
    const updateDispatcher = lensConfig.updateDispatcher
    updateDispatcher
      .createUpdateEvent("HeuristicPinchDetectionStrategyUpdate")
      .bind(() => {
        this.update()
      })
  }

  /** @inheritdoc */
  get onPinchDetected(): PublicApi<PinchEventType> {
    return this._onPinchDetected
  }

  /** @inheritdoc */
  get onPinchProximity(): PublicApi<number> {
    return this._onPinchProximity
  }

  private update() {
    const adjustedThumbPosition = this.adjustThumbDepthToPointer(
      this.config.thumbTip.position,
      this.config.indexTip.position
    )

    const pinchDistance = adjustedThumbPosition.sub(
      this.config.indexTip.position
    ).lengthSquared
    const thresholdResult = this.pinchEnterThreshold.update(pinchDistance)

    // thresholdResult will be null if the bistable threshold was not just crossed, false if just crossed to "deactivate" side, and true if just crossed to "activate" side
    if (thresholdResult === false) {
      this._onPinchDetectedEvent.invoke(PinchEventType.Up)
    } else if (thresholdResult === true) {
      this._onPinchDetectedEvent.invoke(PinchEventType.Down)
    }

    this.updatePinchProximity()
  }

  private updatePinchProximity(): void {
    const distance = this.config.thumbTip.position.distance(
      this.config.indexTip.position
    )
    if (distance === null || distance > MAX_PINCH_DISTANCE) {
      this.currentPinchProximity = 0
    }

    const mappedDistance = mapValue(
      clamp(distance, MIN_PINCH_DISTANCE, MAX_PINCH_DISTANCE),
      MAX_PINCH_DISTANCE,
      MIN_PINCH_DISTANCE,
      1,
      0
    )

    this.currentPinchProximity = 1 - mappedDistance

    if (this.currentPinchProximity !== this.previousPinchProximity) {
      this.previousPinchProximity = this.currentPinchProximity
      this._onPinchProximityEvent.invoke(this.currentPinchProximity)
    }
  }

  private adjustThumbDepthToPointer(thumb: vec3, pointer: vec3) {
    // project the thumb onto the plane that the pointer is on
    const cameraPosition = this.worldCamera.getWorldPosition()
    const thumbRay = thumb.sub(cameraPosition)
    const thumbDir = thumbRay.normalize()
    const pointerRay = pointer.sub(cameraPosition)
    const pointerDist = pointerRay.length
    const adjustedThumb = cameraPosition.add(thumbDir.uniformScale(pointerDist))
    const change = adjustedThumb.sub(thumb).length
    this.thumbProjectThreshold.update(change)
    const closeEnough = this.thumbProjectThreshold.getState()
    return closeEnough === true ? adjustedThumb : thumb
  }
}
