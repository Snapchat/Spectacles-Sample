import {BaseHand} from "../../../Providers/HandInputData/BaseHand"
import {Keypoint} from "../../../Providers/HandInputData/Keypoint"
import {inverseLerp} from "../../../Utils/mathUtils"
import NativeLogger from "../../../Utils/NativeLogger"
import {LowPassFilterVec3_v2} from "../../../Utils/OneEuroFilter"
import AxisAngle from "./AxisAngle"
import {WindowMode} from "./TimeDataContainer"
import {TimedVec2Container} from "./TimedVec2Container"
import {TimedScalarContainer} from "./TimeScalarContainer"

const TAG = "PinchJumpSuppressor"

/**
 * Options for spaces where knuckles are
 * transformed from world to be smoothed.
 */
export type KnuckleSmoothingSpace = "DeviceCenter" | "TrackingCamera"

type PinchJumpSuppressorConfig = {
  /**
   * The space where knuckles are transformed from world
   * to be smoothed.
   * Two options are available: device center or tracking camera
   * Default: device center
   */
  knuckleSmoothingSpace: KnuckleSmoothingSpace

  /**
   * Lower bound for normalized pinch intensity
   * calculated based on the proximity of fingers
   */
  minPinchDistanceCm: number

  /**
   * Upper bound for normalized pinch intensity
   * calculated based on the proximity of fingers
   */
  maxPinchDistanceCm: number

  /**
   * Maximum speed value for normalizing the pinch intensity
   * calculated based on the relative velocity of fingers
   */
  maxPinchSpeedCmPerSec: number

  /**
   * Window size (in frame numbers) to aggregate pinch radius measurements
   * for calculating relative finger velocity based pinch intensity
   */
  pinchDistanceTimeSeriesWindowSizeFrame: number

  /**
   * Window size (in seconds) to aggregate measurements
   * for calculating average distance of knuckles relative to the smoothing space origin
   */
  stableFingerRootsAverageDistanceWindowSizeSec: number

  /**
   * Window size (in seconds) to aggregate measurements
   * for calculating knuckles' velocity
   */
  stableFingerKnuckleVelocityWindowSizeSec: number

  /**
   * If true, the smoothed knuckles are transformed back to world to compute their velocity
   * after smoothed in the space selected by "knuckleSmoothingSpace".
   * If false, the velocity will be calculated in the smoothing space.
   */
  transformStableKnucklesBackToWorld: boolean

  /**
   * Lower bound for normalized knuckle movement intensity
   * calculated based on the knuckles' velocity
   */
  minKnuckleSpeedCmPerSec: number

  /**
   * Upper bound for normalized knuckle movement intensity
   * calculated based on the knuckles' velocity
   */
  maxKnuckleSpeedCmPerSec: number

  /**
   * Whether to use the combined position+pinch intensity for comparision
   * when deciding to leave the active state
   */
  useCombinedIntensityAtActiveStateLeave: boolean

  /**
   * Threshold to compare intensity indicators to, when deciding to enter the active state
   */
  activeStateEnterIntensityThreshold: number

  /**
   * Threshold to compare intensity indicators to, when deciding to leave the active state
   */
  activeStateLeaveIntensityThreshold: number

  /**
   * The interval during which the ray's locus and direction
   * is strongly filtered to suppress the jump.
   * At the end of this interval, the so-called delta replaces the filter.
   */
  suppressionBuildUpInterval: number

  /**
   * If gradualDeltaReleaseEnabled is true, this will be the length of the interval
   * during which the delta is gradually reduced to zero.
   */
  suppressionTearDownInterval: number

  /**
   * Activates that part of the logic which replaces the effect
   * of a time-limited filter with a displacement (the delta)
   * during the interval the pinch is held
   */
  pinchJumpSuppressionDeltaEnabled: boolean

  /**
   * If true, the delta is removed gradually at the end, not abruptly
   */
  gradualDeltaReleaseEnabled: boolean

  /**
   * Activates logging in the PinchJumpSuppressor
   */
  verbosePinchJumpSuppressor: boolean
}

const PinchJumpSuppressorConfigDefault: PinchJumpSuppressorConfig = {
  knuckleSmoothingSpace: "DeviceCenter",
  minPinchDistanceCm: 3.5,
  maxPinchDistanceCm: 4,
  maxPinchSpeedCmPerSec: 60,
  pinchDistanceTimeSeriesWindowSizeFrame: 4,
  stableFingerRootsAverageDistanceWindowSizeSec: 0.66,
  stableFingerKnuckleVelocityWindowSizeSec: 0.3,
  transformStableKnucklesBackToWorld: true,
  minKnuckleSpeedCmPerSec: 10.0,
  maxKnuckleSpeedCmPerSec: 20.0,
  useCombinedIntensityAtActiveStateLeave: false,
  activeStateEnterIntensityThreshold: 0.6,
  activeStateLeaveIntensityThreshold: 0.2,
  suppressionBuildUpInterval: 0.5,
  suppressionTearDownInterval: 0.5,
  pinchJumpSuppressionDeltaEnabled: true,
  gradualDeltaReleaseEnabled: true,
  verbosePinchJumpSuppressor: false
}
/**
 * Speed descriptor of a pinch (nearing or opening finger tips)
 * Constains a sign indicator and an absolute vlaue
 */
export type PinchSpeedDescriptor = {
  /**
   * isNegative=true corresponds to a pinch
   * that is building up (the fingers are nearing)
   */
  isNegative: boolean
  absoluteValue: number
}

export enum DeltaMode {
  IDLE,
  MEASURE,
  APPLY
}

export type RayData = {
  direction: vec3
  locus: vec3
}

export enum SuppressionState {
  NOT_ACTIVE,
  ACTIVE
}

/**
 * A major issue with far field targetging is that the ray
 * jumps during pinching even if the hand remains still
 * (aside from the movement of the fingers performing the pinch).
 *
 * This class contains the logic to suppress this undesirable jump effect.
 * It aims to handle this problem without freezing the ray
 * so when the pinch is held out for longer periods,
 * the possibility to drag or move the targeted object is still retained.
 */
export class PinchJumpSuppressor {
  // Native Logging
  private log = new NativeLogger(TAG)

  protected stableFingerRootsAverageDistance = new TimedScalarContainer(
    WindowMode.TIME,
    PinchJumpSuppressorConfigDefault.stableFingerRootsAverageDistanceWindowSizeSec
  )
  protected stableFingerRootsTimeSeries: TimedVec2Container[] = []

  protected pinchDistance: number | null = null
  protected pinchDistanceTimeSeries = new TimedScalarContainer(
    WindowMode.FRAME,
    PinchJumpSuppressorConfigDefault.pinchDistanceTimeSeriesWindowSizeFrame
  )
  protected pinchSpeed: number | null = null

  protected deltaMode = DeltaMode.IDLE
  protected deltaMultiplier = 1
  protected directionDelta = new AxisAngle(vec3.zero(), 0)
  protected locusDelta = vec3.zero()

  protected directionLowpassFilter = new LowPassFilterVec3_v2(1.0)
  protected locusLowpassFilter = new LowPassFilterVec3_v2(1.0)

  private lastActivationTimestampInSecond: number | null = null
  private lastDeactivationTimestampInSecond: number | null = null
  private suppressionState = SuppressionState.NOT_ACTIVE

  private deltaEnabled: boolean = PinchJumpSuppressorConfigDefault.pinchJumpSuppressionDeltaEnabled
  private gradualDeltaReleaseEnabled: boolean = PinchJumpSuppressorConfigDefault.gradualDeltaReleaseEnabled
  private verboseMode: boolean = PinchJumpSuppressorConfigDefault.verbosePinchJumpSuppressor

  private minKnuckleSpeedCmPerSec: number = PinchJumpSuppressorConfigDefault.minKnuckleSpeedCmPerSec
  private maxKnuckleSpeedCmPerSec: number = PinchJumpSuppressorConfigDefault.maxKnuckleSpeedCmPerSec

  private minPinchDistanceCm: number = PinchJumpSuppressorConfigDefault.minPinchDistanceCm
  private maxPinchDistanceCm: number = PinchJumpSuppressorConfigDefault.maxPinchDistanceCm

  private maxPinchSpeedCmPerSec: number = PinchJumpSuppressorConfigDefault.maxPinchSpeedCmPerSec

  private useCombinedIntensityAtActiveStateLeave: boolean =
    PinchJumpSuppressorConfigDefault.useCombinedIntensityAtActiveStateLeave
  private activeStateEnterIntensity: number = PinchJumpSuppressorConfigDefault.activeStateEnterIntensityThreshold
  private activeStateLeaveIntensity: number = PinchJumpSuppressorConfigDefault.activeStateLeaveIntensityThreshold

  private suppressionBuildUpInterval: number = PinchJumpSuppressorConfigDefault.suppressionBuildUpInterval
  private suppressionTearDownInterval: number = PinchJumpSuppressorConfigDefault.suppressionTearDownInterval

  private _knuckleSmoothingSpace: KnuckleSmoothingSpace = PinchJumpSuppressorConfigDefault.knuckleSmoothingSpace

  constructor(protected hand: BaseHand) {
    for (let i = 0; i < this.stableKnuckleKeypoints.length; i++) {
      const series = new TimedVec2Container(
        WindowMode.TIME,
        PinchJumpSuppressorConfigDefault.stableFingerKnuckleVelocityWindowSizeSec
      )
      this.stableFingerRootsTimeSeries.push(series)
    }
  }

  /**
   * @returns the name of the selected space
   * where knuckles are transformed from world to be smoothed.
   */
  get knuckleSmoothingSpace(): string {
    return this._knuckleSmoothingSpace
  }

  /**
   * Determines the necessary suppression for the current frame
   * @param knuckleSmoothingSpaceFromWorld - smoothingSpace-from-world transformation
   */
  updateState(knuckleSmoothingSpaceFromWorld: mat4): void {
    this.updatePinchDistance()
    this.updateSuppressionState()
    const stableKnuckleKeypoints = this.stableKnuckleKeypoints
    const knucklesDistance = this.computeKnucklesDistanceFromSmootingSpaceOrigin(
      knuckleSmoothingSpaceFromWorld,
      stableKnuckleKeypoints
    )
    const maxKnuckleMoveIntensity = this.computeMaxKnuckleMoveIntensity(
      knucklesDistance,
      knuckleSmoothingSpaceFromWorld,
      stableKnuckleKeypoints
    )
    this.updateSuppressionParameters(maxKnuckleMoveIntensity)
  }

  /**
   * Applies suppression to the given ray by returning its modified value.
   * @param direction - the direction of the ray to work on
   * @param locus - the locus of the ray to work on
   * @returns the components of the ray after applying suppression to them.
   */
  applySuppression(direction: vec3, locus: vec3): RayData {
    let modifiedDirection = this.applyDirectionLowpassFilter(direction)
    modifiedDirection = this.applyDirectionDelta(modifiedDirection)

    let modifiedLocus = this.applyLocusLowpassFilter(locus)
    modifiedLocus = this.applyLocusDelta(modifiedLocus)

    return {
      direction: modifiedDirection,
      locus: modifiedLocus
    }
  }

  /**
   * @returns the position of 4 knuckle landmarks if they are available
   */
  private get stableKnuckleKeypoints(): (Keypoint | null)[] {
    return [this.hand.indexKnuckle, this.hand.middleKnuckle, this.hand.ringKnuckle, this.hand.pinkyKnuckle]
  }

  /**
   * Calculates average distance of knuckles relative to the smoothing space origin.
   * @param knuckleSmoothingSpaceFromWorld - smoothingSpace-from-world transformation
   * @param stableKnuckleKeypoints - position of 4 knuckle landmarks, assumed to be stable while pinching
   * @returns the calculated distance value
   */
  private computeKnucklesDistanceFromSmootingSpaceOrigin(
    knuckleSmoothingSpaceFromWorld: mat4,
    stableKnuckleKeypoints: (Keypoint | null)[]
  ): number | null {
    let averageDistance = 0
    let length = 0
    for (const keypoint of stableKnuckleKeypoints) {
      if (keypoint === null) {
        continue
      }
      const position = knuckleSmoothingSpaceFromWorld.multiplyPoint(keypoint.position)
      averageDistance += position.z
      length++
    }

    if (length > 0) {
      averageDistance /= length
    }

    this.stableFingerRootsAverageDistance.pushData(getTime(), averageDistance)
    return this.stableFingerRootsAverageDistance.average()
  }

  /**
   * Calculates the movement intensity of each knuckles assumed to be stable while pinching
   * based on their 2D velocity. Returns the maximum of these intensities.
   * @param knucklesDistance - distance of knuckles relative to the smoothing space origin
   * @param knuckleSmoothingSpaceFromWorld - smoothingSpace-from-world transformation
   * @param stableKnuckleKeypoints - position of 4 knuckle landmarks, assumed to be stable while pinching
   * @returns the calculated maximum movement intensity value
   */
  private computeMaxKnuckleMoveIntensity(
    knucklesDistance: number | null,
    knuckleSmoothingSpaceFromWorld: mat4,
    stableKnuckleKeypoints: (Keypoint | null)[]
  ): number {
    let maxKnuckleSpeed = null
    if (knucklesDistance) {
      for (let i = 0; i < this.stableFingerRootsTimeSeries.length; i++) {
        const keyPoint = stableKnuckleKeypoints[i]
        const pointInWorld = keyPoint ? keyPoint.position : vec3.zero()

        const pointInSmoothingSpace = knuckleSmoothingSpaceFromWorld.multiplyPoint(pointInWorld)
        const depth = pointInSmoothingSpace.z
        const stablePointSmoothingSpace =
          depth !== 0
            ? new vec3(
                (pointInSmoothingSpace.x / depth) * knucklesDistance,
                (pointInSmoothingSpace.y / depth) * knucklesDistance,
                knucklesDistance
              )
            : new vec3(pointInSmoothingSpace.x, pointInSmoothingSpace.y, knucklesDistance)

        const usedStablePoint = PinchJumpSuppressorConfigDefault.transformStableKnucklesBackToWorld
          ? knuckleSmoothingSpaceFromWorld.inverse().multiplyPoint(stablePointSmoothingSpace)
          : stablePointSmoothingSpace

        this.stableFingerRootsTimeSeries[i].pushData(getTime(), new vec2(usedStablePoint.x, usedStablePoint.y))
        const knuckleSpeedCmPerSec = this.stableFingerRootsTimeSeries[i].aggregateAbsoluteVelocity()
        if (knuckleSpeedCmPerSec !== null && (maxKnuckleSpeed === null || knuckleSpeedCmPerSec > maxKnuckleSpeed)) {
          maxKnuckleSpeed = knuckleSpeedCmPerSec
        }
      }
    }

    let maxKnuckleMoveIntensity = 1
    if (maxKnuckleSpeed !== null) {
      maxKnuckleMoveIntensity = MathUtils.clamp(
        inverseLerp(this.minKnuckleSpeedCmPerSec, this.maxKnuckleSpeedCmPerSec, maxKnuckleSpeed),
        0,
        1
      )
    }

    if (this.verboseMode) {
      this.log.d("MaxKnuckleSpeedCmPerSec: " + maxKnuckleSpeed?.toFixed(2))
      this.log.d("MaxKnuckleMoveIntensity: " + maxKnuckleMoveIntensity.toFixed(2))
    }
    return maxKnuckleMoveIntensity
  }

  /**
   * Gets the intensity of the pinch based on the proximity of fingers
   * @returns the normalized position intensity
   */
  private getPositionIntensity(): number | null {
    if (!this.pinchDistance) {
      return null
    }

    if (this.verboseMode) {
      this.log.d("pinchDistance: " + this.pinchDistance.toFixed(2))
    }

    let normalizedRadius = inverseLerp(this.minPinchDistanceCm, this.maxPinchDistanceCm, this.pinchDistance)
    normalizedRadius = MathUtils.clamp(normalizedRadius, 0, 1)
    return 1 - normalizedRadius
  }

  /**
   * Gets the intensity of the pinch based on the relative velocity of fingers
   * @returns a speed descriptor containing the normalized absolute velocity and its sign
   */
  private getPinchSpeedDescriptor(): PinchSpeedDescriptor | null {
    if (!this.pinchSpeed) {
      return null
    }

    const normalizedSpeed = MathUtils.clamp(Math.abs(this.pinchSpeed) / this.maxPinchSpeedCmPerSec, 0, 1)

    if (this.verboseMode) {
      this.log.d("pinchSpeed: " + this.pinchSpeed.toFixed(2))
      this.log.d("normalizedSpeed: " + normalizedSpeed.toFixed(2))
    }

    return {
      isNegative: this.pinchSpeed < 0,
      absoluteValue: normalizedSpeed
    }
  }

  /**
   * Updates pinch radius which indicates how close fingers are to a pinch
   */
  private updatePinchDistance(): void {
    if (this.hand.indexTip === null || this.hand.thumbTip === null) {
      this.pinchDistance = null
      this.pinchSpeed = null
      this.pinchDistanceTimeSeries.clear()
      return
    }
    const newPinchDistance = this.hand.indexTip.position.distance(this.hand.thumbTip.position)

    this.pinchDistanceTimeSeries.pushData(getTime(), newPinchDistance)

    if (this.verboseMode) {
      this.log.d("newPinchDistance: " + newPinchDistance.toFixed(3))
      const deltaTime = getDeltaTime()
      this.log.d("deltaTime: " + deltaTime.toFixed(3))
    }

    this.pinchSpeed = this.pinchDistanceTimeSeries.aggregateSignedVelocity()
    this.pinchDistance = newPinchDistance
  }

  /**
   * Executes the low-pass filter on the given targeting locus by returning its modified value.
   * @param locus - the locus to work on
   * @returns the modified locus
   */
  private applyLocusLowpassFilter(locus: vec3): vec3 {
    const filteredLocus = this.locusLowpassFilter?.filter(locus)
    if (this.deltaMode === DeltaMode.MEASURE) {
      this.locusDelta = filteredLocus.sub(locus)
    }
    return filteredLocus
  }

  /**
   * AExecutes the low-pass filter on the given targeting direction by returning its modified value.
   * @param direction - the direction to work on
   * @returns the modified direction
   */
  private applyDirectionLowpassFilter(direction: vec3): vec3 {
    const filteredDirection = this.directionLowpassFilter.filter(direction)
    if (this.deltaMode === DeltaMode.MEASURE) {
      this.directionDelta = AxisAngle.getRotationBetween(direction, filteredDirection)

      if (this.verboseMode) {
        this.log.d(
          "directionDelta: " + this.directionDelta.angle.toFixed(3) + ",  " + this.directionDelta.axis.toString()
        )
      }
    }
    return filteredDirection
  }

  /**
   * Adds the stored delta (partially or fully) to the given targeting locus by returning its modified value.
   * @param locus - the locus to work on
   * @returns the modified locus
   */
  private applyLocusDelta(locus: vec3): vec3 {
    return this.deltaMode === DeltaMode.APPLY ? locus.add(this.locusDelta.uniformScale(this.deltaMultiplier)) : locus
  }

  /**
   * Adds the stored delta (partially or fully) to the given targeting locus by returning its modified value.
   * @param direction - the direction to work on
   * @returns the modified direction
   */
  private applyDirectionDelta(direction: vec3): vec3 {
    return this.deltaMode === DeltaMode.APPLY
      ? AxisAngle.applyRotation(this.directionDelta.multipliedBy(this.deltaMultiplier), direction)
      : direction
  }

  /**
   * Determines the suppression state (active or not active) for the current frame.
   */
  private updateSuppressionState(): void {
    const previousState = this.suppressionState

    const pinchPositionIntensity = this.getPositionIntensity()
    const pinchSpeedDescriptor = this.getPinchSpeedDescriptor()

    if (pinchPositionIntensity === null || pinchSpeedDescriptor === null) {
      this.suppressionState = SuppressionState.NOT_ACTIVE
      return
    }

    if (this.verboseMode && pinchSpeedDescriptor) {
      this.log.d("pinchPositionIntensity: " + pinchPositionIntensity.toFixed(2))
      this.log.d(
        "pinchSpeedDescriptor: " +
          (pinchSpeedDescriptor.isNegative ? "(-)" : "(+)") +
          pinchSpeedDescriptor.absoluteValue.toFixed(2)
      )
    }

    const combinedPinchIntensity = MathUtils.clamp(pinchPositionIntensity + pinchSpeedDescriptor.absoluteValue, 0, 1)

    if (this.verboseMode) {
      this.log.d("combinedPinchIntensity: " + combinedPinchIntensity.toFixed(2))
    }

    let willBeActive
    if (previousState === SuppressionState.NOT_ACTIVE) {
      willBeActive = combinedPinchIntensity >= this.activeStateEnterIntensity && pinchSpeedDescriptor.isNegative
    } else {
      willBeActive =
        (this.useCombinedIntensityAtActiveStateLeave ? combinedPinchIntensity : pinchPositionIntensity) >=
          this.activeStateLeaveIntensity || pinchSpeedDescriptor.isNegative
    }

    this.suppressionState = willBeActive ? SuppressionState.ACTIVE : SuppressionState.NOT_ACTIVE

    if (this.verboseMode) {
      this.log.d("suppressionState: " + this.suppressionState)
    }

    if (this.suppressionState === SuppressionState.ACTIVE) {
      if (previousState === SuppressionState.NOT_ACTIVE) {
        this.lastActivationTimestampInSecond = getTime()
        this.lastDeactivationTimestampInSecond = null

        if (this.verboseMode) {
          this.log.d("lastActivationTimestampInSecond was SET")
        }
      }
    } else {
      if (previousState === SuppressionState.ACTIVE) {
        this.lastDeactivationTimestampInSecond = getTime()
      }
      this.lastActivationTimestampInSecond = null

      if (this.verboseMode) {
        this.log.d("lastActivationTimestampInSecond was RESET")
      }
    }

    if (this.verboseMode) {
      this.log.d("lastActivationTimestampInSecond: " + this.lastActivationTimestampInSecond?.toFixed(2))
      this.log.d("lastDeactivationTimestampInSecond: " + this.lastDeactivationTimestampInSecond?.toFixed(2))
    }
  }

  /**
   * Updates the suppression parameters (lowpass filter alpha; delta logic mode and multiplier) for the current frame
   * based on the suppression state and the calculated knuckle movement intensity.
   * @param knuckleMoveIntensity - the calculated knuckle movement intensity on the current frame
   */
  private updateSuppressionParameters(knuckleMoveIntensity: number): void {
    let alpha = 1
    if (this.suppressionState === SuppressionState.ACTIVE) {
      const timeSinceLastActivation = getTime() - (this.lastActivationTimestampInSecond ?? getTime())
      const suppressionBuildUpIntervalHasElapsed = timeSinceLastActivation >= this.suppressionBuildUpInterval

      if (this.deltaEnabled) {
        this.deltaMode = suppressionBuildUpIntervalHasElapsed ? DeltaMode.APPLY : DeltaMode.MEASURE
        this.deltaMultiplier = 1
      }

      const alphaBase = suppressionBuildUpIntervalHasElapsed ? 1 : knuckleMoveIntensity
      alpha = Math.min(Math.pow(alphaBase, 4), 1)

      if (this.verboseMode) {
        this.log.d("timeSinceLastActivation: " + timeSinceLastActivation.toFixed(2))
        this.log.d("suppressionBuildUpIntervalHasElapsed: " + suppressionBuildUpIntervalHasElapsed)
        this.log.d("alphaBase: " + alphaBase.toFixed(2))
      }
    } else if (this.deltaEnabled && this.lastDeactivationTimestampInSecond !== null) {
      const timeSinceLastDeactivation = getTime() - this.lastDeactivationTimestampInSecond

      if (this.gradualDeltaReleaseEnabled && timeSinceLastDeactivation < this.suppressionTearDownInterval) {
        const interpolationFactor = timeSinceLastDeactivation / this.suppressionTearDownInterval

        this.deltaMode = DeltaMode.APPLY
        this.deltaMultiplier = 1 - interpolationFactor
      } else {
        this.deltaMode = DeltaMode.IDLE
        this.deltaMultiplier = 1
      }
    }

    if (this.verboseMode) {
      this.log.d("alpha: " + alpha.toFixed(2))
    }

    this.directionLowpassFilter.setAlpha(alpha)
    this.locusLowpassFilter.setAlpha(alpha)
  }
}
