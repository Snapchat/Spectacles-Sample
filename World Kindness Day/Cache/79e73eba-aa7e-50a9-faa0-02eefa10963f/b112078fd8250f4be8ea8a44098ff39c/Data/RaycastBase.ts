import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {BaseHand} from "../../../Providers/HandInputData/BaseHand"
import {HandInputData} from "../../../Providers/HandInputData/HandInputData"
import {Keypoint} from "../../../Providers/HandInputData/Keypoint"
import NativeLogger from "../../../Utils/NativeLogger"
import {OneEuroFilter, OneEuroFilterConfig, OneEuroFilterVec3} from "../../../Utils/OneEuroFilter"
import {validate} from "../../../Utils/validate"
import {RaycastInfo} from "../RayProvider"

const smoothedThumbScale: number = 0.4
const smoothedMidScale: number = 0.6

const locusIndexKnuckleScale: number = 0.6
const locusThumbKnuckleScale: number = 0.4

const defaultOneEuroFrequency: number = 60
const defaultOneEuroDCutoff: number = 0.16

const knuckleSmoothingEnabled: boolean = false
const knuckleOneEuroMinCutoff: number = 1
const knuckleOneEuroBeta: number = 0.0001

const wristSmoothingEnabled: boolean = false
const wristOneEuroMinCutoff: number = 3.5
const wristOneEuroBeta: number = 0.0001

const directionSmoothingEnabled: boolean = true
const directionOneEuroMinCutoff: number = 0.5
const directionOneEuroBeta: number = 0.2

const locusSmoothingEnabled: boolean = true
const locusOneEuroMinCutoff: number = 0.5
const locusOneEuroBeta: number = 0.2

const shoulderSmoothingEnabled: boolean = true
const shoulderOneEuroMinCutoff: number = 0.1
const shoulderOneEuroBeta: number = 0.0001

const zSmoothingEnabled: boolean = false
const zOneEuroDCutoff: number = 0.16
const zOneEuroMinCutoff: number = 0.001
const zOneEuroBeta: number = 0.2

const TAG = "RaycastBase"

export const RIGHT_HAND = "right"
export const LEFT_HAND = "left"

const DEFAULT_ONE_EURO_PARAMS = {
  frequency: defaultOneEuroFrequency,
  dcutoff: defaultOneEuroDCutoff
}

const KNUCKLE_ONE_EURO_FILTER_CONFIG: OneEuroFilterConfig = {
  ...DEFAULT_ONE_EURO_PARAMS,
  minCutoff: knuckleOneEuroMinCutoff,
  beta: knuckleOneEuroBeta
}

const WRIST_ONE_EURO_FILTER_CONFIG: OneEuroFilterConfig = {
  ...DEFAULT_ONE_EURO_PARAMS,
  minCutoff: wristOneEuroMinCutoff,
  beta: wristOneEuroBeta
}

const DIRECTION_ONE_EURO_FILTER_CONFIG: OneEuroFilterConfig = {
  ...DEFAULT_ONE_EURO_PARAMS,
  minCutoff: directionOneEuroMinCutoff,
  beta: directionOneEuroBeta
}

const LOCUS_ONE_EURO_FILTER_CONFIG: OneEuroFilterConfig = {
  ...DEFAULT_ONE_EURO_PARAMS,
  minCutoff: locusOneEuroMinCutoff,
  beta: locusOneEuroBeta
}

const SHOULDER_ONE_EURO_FILTER_CONFIG: OneEuroFilterConfig = {
  ...DEFAULT_ONE_EURO_PARAMS,
  minCutoff: shoulderOneEuroMinCutoff,
  beta: shoulderOneEuroBeta
}

const Z_ONE_EURO_FILTER_CONFIG: OneEuroFilterConfig = {
  frequency: DEFAULT_ONE_EURO_PARAMS.frequency,
  dcutoff: zOneEuroDCutoff,
  minCutoff: zOneEuroMinCutoff,
  beta: zOneEuroBeta
}

const SMOOTHED_THUMB_SCALE = smoothedThumbScale
const SMOOTHED_MID_SCALE = smoothedMidScale

const LOCUS_INDEX_KNUCKLE_SCALE = locusIndexKnuckleScale
const LOCUS_THUMB_KNUCKLE_SCALE = locusThumbKnuckleScale

export type RayAlgorithmData = {
  thumb: vec3 | null
  index: vec3 | null
  mid: vec3 | null
  wrist: vec3 | null
  deviceCenterToWorld: mat4
  cameraToWorld: mat4
}

/**
 * Abstract base class for raycast calculation algorithms
 * Includes smoothing
 */
export default abstract class RaycastBase {
  // Native Logging
  private log = new NativeLogger(TAG)

  protected camera: WorldCameraFinderProvider = WorldCameraFinderProvider.getInstance()

  protected handProvider: HandInputData = HandInputData.getInstance()

  protected knuckleOneEuroFilter = knuckleSmoothingEnabled
    ? new OneEuroFilterVec3(KNUCKLE_ONE_EURO_FILTER_CONFIG)
    : null
  protected wristOneEuroFilter = wristSmoothingEnabled ? new OneEuroFilterVec3(WRIST_ONE_EURO_FILTER_CONFIG) : null

  /**
   * Direction and locus filters can be dynamically adjusted together with the same magnitude, if pinch stabilization smoothing is turned on.
   */
  protected directionOneEuroFilter = directionSmoothingEnabled
    ? new OneEuroFilterVec3(DIRECTION_ONE_EURO_FILTER_CONFIG)
    : null
  protected locusOneEuroFilter = locusSmoothingEnabled ? new OneEuroFilterVec3(LOCUS_ONE_EURO_FILTER_CONFIG) : null

  protected shoulderOneEuroFilter = shoulderSmoothingEnabled
    ? new OneEuroFilterVec3(SHOULDER_ONE_EURO_FILTER_CONFIG)
    : null

  protected handZOneEuroFilter = zSmoothingEnabled ? new OneEuroFilter(Z_ONE_EURO_FILTER_CONFIG) : null

  constructor(protected hand: BaseHand) {
    this.hand.onHandLost.add(() => {
      if (this.knuckleOneEuroFilter) this.knuckleOneEuroFilter.reset()

      if (this.wristOneEuroFilter) this.wristOneEuroFilter.reset()

      if (this.directionOneEuroFilter) this.directionOneEuroFilter.reset()

      if (this.locusOneEuroFilter) this.locusOneEuroFilter.reset()

      if (this.shoulderOneEuroFilter) this.shoulderOneEuroFilter.reset()

      if (this.handZOneEuroFilter) this.handZOneEuroFilter.reset()
    })
  }

  /**
   * Calculates anchor for the raycast, used for calculating both wrist and shoulder targeting
   * Can toggle whether or not smoothing should be used for the raycast anchor in the Script UI.
   */
  calculateCastAnchor(thumbKnuckle: vec3, middleKnuckle: vec3): vec3 {
    const middleFingerThumbOffset: vec3 = middleKnuckle.sub(thumbKnuckle)
    const rootMiddleFinger: vec3 = this.knuckleOneEuroFilter
      ? thumbKnuckle.add(this.knuckleOneEuroFilter.filter(middleFingerThumbOffset, getTime()))
      : thumbKnuckle.add(middleFingerThumbOffset)
    return rootMiddleFinger.uniformScale(SMOOTHED_MID_SCALE).add(thumbKnuckle.uniformScale(SMOOTHED_THUMB_SCALE))
  }

  private get stubbedKeypoints(): (Keypoint | null)[] {
    return [
      this.hand.indexKnuckle,
      this.hand.middleKnuckle,
      this.hand.ringKnuckle,
      this.hand.pinkyKnuckle,
      this.hand.thumbBaseJoint,
      this.hand.wrist
    ]
  }

  /**
   * Filters the palm landmark if pre-filtering is selected & returns its position in world space
   * This is used to help mitigate the increased jitter for Matador wrist landmarks
   */
  protected getWrist(): vec3 | null {
    if (this.hand.wrist === null) return null
    return this.wristOneEuroFilter?.filter(this.hand.wrist.position, getTime()) ?? null
  }

  /**
   * Calculates the interaction locus, where the ray cursor base is placed.
   */
  protected calculateInteractionLocus(thumbKnuckle: vec3, indexKnuckle: vec3): vec3 {
    return indexKnuckle
      .uniformScale(LOCUS_INDEX_KNUCKLE_SCALE)
      .add(thumbKnuckle.uniformScale(LOCUS_THUMB_KNUCKLE_SCALE))
  }

  /**
   * Calculates the measured and filtered average Z value of stab hand landmarks
   */
  protected filterHandZAverage(cameraToWorld: mat4) {
    validate(this.handZOneEuroFilter)

    let zAverage = 0
    let length = 0
    for (const keypoint of this.stubbedKeypoints) {
      if (keypoint === null) {
        continue
      }
      let position = keypoint.position
      if (cameraToWorld !== undefined) {
        position = cameraToWorld.inverse().multiplyPoint(position)
      }
      zAverage += position.z
      length++
    }

    if (length > 0) {
      zAverage /= length
    }
    const filteredZAverage = this.handZOneEuroFilter.filter(zAverage, getTime())
    return {zAverage: zAverage, filteredZAverage: filteredZAverage}
  }

  /**
   * Calculates corrected hand landmark positions using the measured and smoothed average Z values of stub
   */
  protected getCorrectedHandLandmarkPosition(
    cameraToWorld: mat4,
    avgZ: number,
    filteredAvgZ: number,
    worldPos: vec3 | null
  ): vec3 | null {
    if (worldPos === null) {
      return null
    }

    if (cameraToWorld === undefined) {
      return vec3.zero()
    }

    const cameraPos = cameraToWorld.inverse().multiplyPoint(worldPos)
    const newZ = cameraPos.z - avgZ + filteredAvgZ
    const newCameraPos = new vec3((cameraPos.x / cameraPos.z) * newZ, (cameraPos.y / cameraPos.z) * newZ, newZ)
    return cameraToWorld.multiplyPoint(newCameraPos)
  }

  /**
   * Gets the corrected landmark positions and the device center to world transformation
   */
  protected getRayAlgorithmData(): RayAlgorithmData {
    // Get joints from hands api
    const thumb = this.hand.thumbBaseJoint?.position ?? null
    const index = this.hand.indexKnuckle?.position ?? null
    const mid = this.hand.middleKnuckle?.position ?? null
    const wrist = this.hand.wrist?.position ?? null
    const deviceCenterToWorld = this.camera.getWorldTransform()

    let cameraToDeviceCenter = mat4.identity()
    try {
      cameraToDeviceCenter = global.deviceInfoSystem.getTrackingCamera().pose
    } catch (e) {
      this.log.e("Exception during accessing the tracking camera device: " + e)
    }
    const cameraToWorld = deviceCenterToWorld.mult(cameraToDeviceCenter)

    if (this.handZOneEuroFilter === null) {
      return {
        thumb: thumb,
        index: index,
        mid: mid,
        wrist: wrist,
        deviceCenterToWorld: deviceCenterToWorld,
        cameraToWorld: cameraToWorld
      }
    }

    const handZAverage = this.filterHandZAverage(cameraToWorld)
    const getCorrectedPosition = (position: vec3 | null) => {
      return this.getCorrectedHandLandmarkPosition(
        cameraToWorld,
        handZAverage.zAverage,
        handZAverage.filteredZAverage,
        position
      )
    }

    return {
      thumb: getCorrectedPosition(thumb),
      index: getCorrectedPosition(index),
      mid: getCorrectedPosition(mid),
      wrist: getCorrectedPosition(wrist),
      deviceCenterToWorld: deviceCenterToWorld,
      cameraToWorld: cameraToWorld
    }
  }

  /**
   * Update locus, direction, and camera position (or null if required hand landmarks are not tracked).
   */
  abstract getRay(): RaycastInfo | null

  /**
   * Can be used to reset inner states
   * Should be called when the hand is not tracked or targeting is blocked
   */
  reset(): void {}
}
