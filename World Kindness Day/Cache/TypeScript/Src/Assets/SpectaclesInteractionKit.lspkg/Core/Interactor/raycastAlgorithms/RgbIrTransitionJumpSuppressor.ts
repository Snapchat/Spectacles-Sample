import {BaseHand} from "../../../Providers/HandInputData/BaseHand"
import {Keypoint} from "../../../Providers/HandInputData/Keypoint"
import NativeLogger from "../../../Utils/NativeLogger"
import AxisAngle from "./AxisAngle"
import {WindowMode} from "./TimeDataContainer"
import {TimedScalarContainer} from "./TimeScalarContainer"

const TAG = "RgbIrTransitionJumpSuppressor"
const DEFAULT_DECAY_DURATION_SEC = 3

type RgbIrTransitionJumpSuppressorConfig = {
  /*
   * Defines the threshold value for the relative
   * change of the bone lengths on successive frames.
   * Above this value, the change is considered to be because of the handover
   */
  boneRatioChangeLimit: number

  /*
   * Window size in frame count for smoothing the bone lengths
   */
  boneLengthAverageWindowFrames: number

  /*
   * Maximum capacity for storing the applied deltas. If set below 1, this is ignored.
   */
  maxCapacity: number

  /*
   * Duration in seconds for decaying the deltas
   */
  decayDurationSec: number

  /*
   * Unpaired delta will be decayed after this time given in seconds.
   * If negative, unpaired deltas won't be decayed
   */
  maxTimespentWithoutDecaying: number

  /*
   * If true, all deltas will start to decay immediately
   */
  enableDecayImmediately: boolean

  /*
   * If true, the logic only register and apply deltas
   * if the direction of the detected handover is pointing to
   * the opposite model/camera type then the previous detection
   */
  registerOnlySignedPairs: boolean
}

export type HandOverDetection = {
  isHandOver: boolean
  sign: number
}

export type ModifiedValues = {
  currentDirection: vec3
  previousDirection: vec3
  currentLocus: vec3
  previousLocus: vec3
}

export type DeltaConfig = {
  direction: AxisAngle
  locus: vec3
  sign: number
  multiplier: number
}

const RgbIrTransitionJumpSuppressorConfigDefault: RgbIrTransitionJumpSuppressorConfig = {
  boneRatioChangeLimit: 0.1,
  boneLengthAverageWindowFrames: 5,
  maxCapacity: 50,
  decayDurationSec: 3,
  maxTimespentWithoutDecaying: -1,
  enableDecayImmediately: false,
  registerOnlySignedPairs: true
}

export class Delta {
  static nextId = 0
  readonly id = Delta.nextId++
  private decayDurationSec: number
  private _canDecay = RgbIrTransitionJumpSuppressorConfigDefault.enableDecayImmediately
  private decayStartTime: number | undefined = undefined
  private decayStopTime: number | undefined = undefined
  private creationTime = getTime()

  private constructor(private config: DeltaConfig) {
    this.decayDurationSec =
      RgbIrTransitionJumpSuppressorConfigDefault.decayDurationSec > 0
        ? RgbIrTransitionJumpSuppressorConfigDefault.decayDurationSec
        : DEFAULT_DECAY_DURATION_SEC
  }

  /**
   * Helper method to create a new delta object instance
   * @param detection - handover detection object to get sign (handover direction) metadata from it
   * @param modifiedValues - targeting directin and locus (origin) on the previous and current frame to measure delta between them
   * @returns the created delta instance
   */
  static createDelta(detection: HandOverDetection, modifiedValues: ModifiedValues): Delta {
    return new Delta({
      direction: AxisAngle.getRotationBetween(modifiedValues.currentDirection, modifiedValues.previousDirection),
      locus: modifiedValues.previousLocus.sub(modifiedValues.currentLocus),
      sign: detection.sign,
      multiplier: 1
    })
  }

  /**
   * @returns the direction of the detected handover when the delta is measured
   *  1: from UL to HLMT
   * -1: from HLMT to UL
   */
  get sign(): number {
    return this.config.sign
  }

  /**
   * @returns if the delta can be decayed
   */
  get canDecay(): boolean {
    return this._canDecay
  }

  /**
   * Sets if the delta can be decayed
   */
  set canDecay(value: boolean) {
    if (this._canDecay === false && value === true) {
      this.decayStartTime = getTime()
    }
    this._canDecay = value
  }

  /**
   * Steps the decay
   */
  decay(): void {
    if (this.canDecay === false) {
      return
    }
    this.config.multiplier -= getDeltaTime() / this.decayDurationSec
    if (this.decayStopTime === undefined && this.config.multiplier <= 0) {
      this.decayStopTime = getTime()
    }
  }

  /**
   * @returns the current duration of the decaying in seconds
   * Returns zero seconds if the decaying hasn't been started.
   * Stops increasing after the delta is completely decayed.
   */
  decayDuration(): number {
    if (this.decayStartTime === undefined) {
      return 0
    } else if (this.decayStopTime === undefined) {
      return getTime() - this.decayStartTime
    } else {
      return this.decayStopTime - this.decayStartTime
    }
  }

  /**
   * @returns the elapsed time in seconds since the delta object was created
   */
  timeSinceCreated(): number {
    return getTime() - this.creationTime
  }

  isValid(): boolean {
    return this.config.multiplier > 0
  }

  /**
   * Applies the delta on the targeting direction to suppress jumps because of the handover
   * @param direction - targeting direction
   * @returns targeting direction with the delta applied on it
   */
  applyDirectionDelta(direction: vec3): vec3 {
    if (!this.isValid()) {
      return direction
    }

    return AxisAngle.applyRotation(this.config.direction.multipliedBy(this.config.multiplier), direction)
  }

  /**
   * Applies the delta on the targeting locus to suppress jumps because of the handover
   * @param locus - targeting locus
   * @returns targeting locus with the delta applied on it
   */
  applyLocusDelta(locus: vec3): vec3 {
    if (!this.isValid()) {
      return locus
    }

    return locus.add(this.config.locus.uniformScale(this.config.multiplier))
  }
}

export type Bone = {
  begin: Keypoint
  end: Keypoint
  smoothedLength: TimedScalarContainer
  currentLength: number | undefined
}

/*
 * Because of the hand tracking differences between
 * the Ul and HLMT models running on the different camera types (IR - UL, RGB - HLMT)
 * there is a clearly visible jump in the targeting direction and origin (locus) point
 * which interfere with user's interaction intentions and results in bad user experience.
 * This class implements a logic to suppress the targeting jumps on IR-RGB hand tracking handover.
 */
export default class RgbIrTransitionJumpSuppressor {
  // Native Logging
  private log = new NativeLogger(TAG)

  private bones: Bone[] = []
  private deltas: Delta[] = []
  private previousLocus: vec3 | undefined = undefined
  private previousDirection: vec3 | undefined = undefined

  constructor(private hand: BaseHand) {
    /*
     * These two bones seemed the best for differentiating the different models
     * (largest change in relative length on successive frames when the handover happens)
     */
    const jointPairs = [
      [this.hand.indexKnuckle, this.hand.indexMidJoint],
      [this.hand.pinkyUpperJoint, this.hand.pinkyTip]
    ]

    for (const pair of jointPairs) {
      const begin = pair[0]
      const end = pair[1]
      if (begin === null || end === null) {
        throw new Error("Bone joints should not be null")
      }
      this.bones.push({
        begin: begin,
        end: end,
        smoothedLength: new TimedScalarContainer(
          WindowMode.FRAME,
          RgbIrTransitionJumpSuppressorConfigDefault.boneLengthAverageWindowFrames
        ),
        currentLength: undefined
      })
    }
  }

  private isHandOverToRegister(sign: number): boolean {
    const acceptBasedOnSign =
      this.deltas.length === 0 ||
      this.deltas[this.deltas.length - 1].sign !== sign ||
      RgbIrTransitionJumpSuppressorConfigDefault.registerOnlySignedPairs === false
    const withinCapacity =
      RgbIrTransitionJumpSuppressorConfigDefault.maxCapacity < 1 ||
      this.deltas.length < RgbIrTransitionJumpSuppressorConfigDefault.maxCapacity

    if (acceptBasedOnSign && withinCapacity) {
      return true
    }
    this.log.d("Handover is not registered either because of wrong transition parity or delta capacity overflow")
    this.log.d(`Parity check: ${acceptBasedOnSign}`)
    this.log.d(`Capacity check: ${withinCapacity}`)
    return false
  }

  private detectHandOver(): HandOverDetection {
    let registerAsHandOver = false
    let sign = 0

    let avgRatio = 0
    let count = 0
    this.log.v("Change of relative bone lengths:")
    for (const bone of this.bones) {
      const currentLength = bone.begin.position.distance(bone.end.position)
      if (currentLength <= 0) {
        this.log.e("Bone length should be a positive value")
        continue
      }
      bone.currentLength = currentLength

      const previousLength = bone.smoothedLength.average()
      if (previousLength !== null) {
        if (previousLength <= 0) {
          this.log.e("Bone length should be a positive value")
          continue
        }
        const ratio = bone.currentLength / previousLength
        this.log.v(
          `${bone.begin.getAttachmentPoint().name} - ${
            bone.end.getAttachmentPoint().name
          }: ${((ratio - 1) * 100).toFixed(1)} %`
        )
        avgRatio += ratio
        count++
      }
    }

    this.log.v("------------------")

    if (count > 0) {
      avgRatio /= count
    } else {
      avgRatio = 1
    }

    const ratioDifference = avgRatio - 1
    if (Math.abs(ratioDifference) >= RgbIrTransitionJumpSuppressorConfigDefault.boneRatioChangeLimit) {
      sign = Math.sign(ratioDifference)
      registerAsHandOver = this.isHandOverToRegister(sign)
      for (const bone of this.bones) {
        bone.smoothedLength.clear()
      }

      this.log.d(
        `Model swich detected: ${sign === 1 ? "HLMT" : "UL"}, diff: ${(ratioDifference * 100).toFixed(
          1
        )} %, Register: ${registerAsHandOver}`
      )
    }

    for (const bone of this.bones) {
      if (bone.currentLength === undefined) {
        this.log.e("Bone length should be defined at this point")
        continue
      }
      bone.smoothedLength.pushData(getTime(), bone.currentLength)
    }

    return {
      isHandOver: registerAsHandOver,
      sign: sign
    }
  }

  private decayAndRemoveInvalidDeltas(): void {
    const newDeltas = []
    for (const delta of this.deltas) {
      delta.decay()
      if (delta.isValid()) {
        newDeltas.push(delta)
      }
    }
    this.deltas = newDeltas
  }

  private computeModifiedValues(
    currentDirection: vec3,
    previousDirection: vec3,
    currentLocus: vec3,
    previousLocus: vec3
  ): ModifiedValues {
    let modifiedCurrentDirection = currentDirection
    let modifiedPreviousDirection = previousDirection
    let modifiedCurrentLocus = currentLocus
    let modifiedPreviousLocus = previousLocus
    for (const delta of this.deltas) {
      modifiedCurrentDirection = delta.applyDirectionDelta(modifiedCurrentDirection)
      modifiedPreviousDirection = delta.applyDirectionDelta(modifiedPreviousDirection)
      modifiedCurrentLocus = delta.applyLocusDelta(modifiedCurrentLocus)
      modifiedPreviousLocus = delta.applyLocusDelta(modifiedPreviousLocus)
    }

    return {
      currentDirection: modifiedCurrentDirection,
      previousDirection: modifiedPreviousDirection,
      currentLocus: modifiedCurrentLocus,
      previousLocus: modifiedPreviousLocus
    }
  }

  private startDecayOldLastDelta(maxTime: number): void {
    if (this.deltas.length > 0) {
      const lastDelta = this.deltas[this.deltas.length - 1]
      const timeSinceCreated = lastDelta.timeSinceCreated()
      if (timeSinceCreated > maxTime) {
        lastDelta.canDecay = true
      }
    }
  }

  private storeDelta(delta: Delta) {
    this.deltas.push(delta)

    if (this.deltas.length % 2 === 0) {
      this.deltas[this.deltas.length - 1].canDecay = true
      this.deltas[this.deltas.length - 2].canDecay = true
    }
  }

  /**
   * Resets the state of the suppressor
   * Should be called when the hand is not tracked or targeting is blocked
   */
  reset(): void {
    this.previousLocus = undefined
    this.previousDirection = undefined
    this.deltas = []
  }

  /**
   * Update the suppressor state by detecting handover and computing, storing deltas
   * @param currentDirection - targeting direction on the current frame
   * @param currentLocus - targeting locus on the current frame
   */
  update(currentDirection: vec3, currentLocus: vec3): void {
    const detection = this.detectHandOver()

    this.decayAndRemoveInvalidDeltas()

    if (RgbIrTransitionJumpSuppressorConfigDefault.maxTimespentWithoutDecaying > 0) {
      this.startDecayOldLastDelta(RgbIrTransitionJumpSuppressorConfigDefault.maxTimespentWithoutDecaying)
    }

    if (detection.isHandOver === true && this.previousDirection !== undefined && this.previousLocus !== undefined) {
      const delta = Delta.createDelta(
        detection,
        this.computeModifiedValues(currentDirection, this.previousDirection, currentLocus, this.previousLocus)
      )
      this.storeDelta(delta)

      this.log.d(`Delta registered, deltas size: ${this.deltas.length}`)
      for (const delta of this.deltas) {
        this.log.d(
          `decay: ${delta.canDecay}, id: ${delta.id}, to model: ${
            delta.sign === 1 ? "HLMT" : "UL"
          }, isValid: ${delta.isValid()}`
        )
      }
    } else if (detection.isHandOver === true) {
      this.log.d(`Cannot register because previous data is undefined: ${this.previousDirection}, ${this.previousLocus}`)
    }

    this.previousLocus = currentLocus
    this.previousDirection = currentDirection
  }

  /**
   * Applies the stored deltas on the targeting direction to suppress jumps because of the handover
   * @param currentDirection - targeting direction on the current frame
   * @returns targeting direction with deltas applied on it
   */
  applyDirectionDelta(currentDirection: vec3): vec3 {
    let direction = currentDirection
    for (const delta of this.deltas) {
      direction = delta.applyDirectionDelta(direction)
    }
    return direction
  }

  /**
   * Applies the stored deltas on the targeting locus to suppress jumps because of the handover
   * @param currentLocus - targeting locus on the current frame
   * @returns targeting locus with deltas applied on it
   */
  applyLocusDelta(currentLocus: vec3): vec3 {
    let locus = currentLocus
    for (const delta of this.deltas) {
      locus = delta.applyLocusDelta(locus)
    }
    return locus
  }
}
