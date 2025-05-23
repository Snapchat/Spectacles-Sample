import {BaseHand} from "../../../Providers/HandInputData/BaseHand"
import {HandType} from "../../../Providers/HandInputData/HandType"
import {interpolateVec3} from "../../../Utils/mathUtils"
import {validate} from "../../../Utils/validate"
import {RaycastInfo} from "../RayProvider"
import ContinuousIrInteractionTransition from "./ContinousIrInteractionTransition"
import {IrInteractionTransition} from "./IrInteractionTransition"
import {PinchJumpSuppressor} from "./PinchJumpSuppressor"
import RaycastBase, {RayAlgorithmData} from "./RaycastBase"
import RgbIrTransitionJumpSuppressor from "./RgbIrTransitionJumpSuppressor"
import SwitchIrInteractionTransition from "./SwitchIrInteractionTransition"

const TAG = "RaycastAnchorHead"

const farDirectionStartPointEnum = Object.freeze({
  CERVICAL_LINK: "CervicalLink",
  EPAULET: "Epaulet",
})

const highLowTargetingInputEnum = Object.freeze({
  HAND_PITCH: "HandPitch",
  GAZE_PITCH: "GazePitch",
})

const situationSpaceUpEnum = Object.freeze({
  WORLD_UP: "WorldUp",
  DEVICE_UP: "DeviceUp",
})

const situationSpaceForwardEnum = Object.freeze({
  WORLD_FORWARD: "WorldForward",
  DEVICE_FORWARD: "DeviceForward",
})

//Linear Transition Mode if true, Switch Transition Mode if false
export type IrInteractionTransitionMode = "Continuous" | "Switch"

export type RaycastAnchorHeadConfig = {
  /**
   * Enable/Disable IR interaction rotation on targeting direction
   */
  allowIrInteractionRotation: boolean

  /**
   * Switches between strategies for Ir interaction transition
   * Options:
   * - Continuous: Directly controlled continuous IR Transition Mode
   * - Switch: Switch-like IR Transition Mode
   * Default: Continuous
   */
  irInteractionTransitionMode: IrInteractionTransitionMode

  /**
   * Amplification value for the wrist based direction component
   */
  wristAmplificationForAnchorHead: number

  /**
   * Selects the start point for the far direction component
   * This can be one of the following:
   *  - CervicalLink
   *  - Epaulet
   */
  farDirectionStartPoint: string

  /**
   * Offset of the Cervical Link point in device space
   * relative the device center
   */
  cervicalLinkOffsetInDeviceSpace: vec3

  /**
   * Offset of the epaulet point in situation space (composed by using the selected up and forward vectors)
   * relative to the Cervical Link point
   */
  epauletOffsetInSituationSpace: vec3

  /**
   * Selects the up vector of the space in which the epaulet is defined relative to the Cervical Link.
   * This can be either the up vector of the world coordinate system ("WorldUp")
   * or the up vector of the device ("DeviceUp")
   */
  situationSpaceUp: string

  /**
   * Selects the forward vector of the space in which the epaulet is defined relative to the Cervical Link.
   * This can be either the forward vector of the world coordinate system ("WorldForward")
   * or the forward vector of the device ("DeviceForward")
   */
  situationSpaceForward: string

  /**
   * The used start point for the far direction component
   * can be adjusted between the computed Cervical Link (at 0) and the epaulet points (at 1)
   */
  epauletWeight: number

  /**
   * additional rotation of ray around X axis, in degrees
   */
  extraXRotationDeg: number

  /**
   * additional rotation of ray around Y axis, in degrees (for right hand)
   */
  extraYRotationDeg: number

  /**
   * Whether to ease targeting to high and low targets, or not
   */
  facilitateHighLowTargeting: boolean

  /**
   * The source of input to control targeting height. Options:
   *  - HandPitch
   *  - GazePitch
   */
  highLowTargetingInput: string

  /**
   * Cervical Link--Hip transition threshold-pair's high end (for hand-pitch, in degrees)
   */
  handPitchUpperThresholdPairHighDeg: number

  /**
   * Cervical Link--Hip transition threshold-pair's low end (for hand-pitch, in degrees)
   */
  handPitchUpperThresholdPairLowDeg: number

  /**
   * Halo--Cervical Link transition threshold-pair's high end (for hand-pitch, in degrees)
   */
  handPitchLowerThresholdPairHighDeg: number

  /**
   * Halo-Cervical Link transition threshold-pair's low end (for hand-pitch, in degrees)
   */
  handPitchLowerThresholdPairLowDeg: number

  /**
   * Cervical Link--Hip transition threshold-pair's high end (for gaze-pitch, in degrees)
   */
  gazePitchUpperThresholdPairHighDeg: number

  /**
   * Cervical Link--Hip transition threshold-pair's low end (for gaze-pitch, in degrees)
   */
  gazePitchUpperThresholdPairLowDeg: number

  /**
   * Halo--Cervical Link transition threshold-pair's high end (for gaze-pitch, in degrees)
   */
  gazePitchLowerThresholdPairHighDeg: number

  /**
   * Halo-Cervical Link transition threshold-pair's low end (for gaze-pitch, in degrees)
   */
  gazePitchLowerThresholdPairLowDeg: number

  /**
   * Halo level's Y offset in situation space, from Cervical Link
   */
  haloLevelYOffsetFromCervicalLinkInSituationSpace: number

  /**
   * Hip level's Y offset in situation space, from Cervical Link
   */
  hipLevelYOffsetFromCervicalLinkInSituationSpace: number

  /**
   * Activates suppression logic to overcome pinch jumps
   */
  pinchJumpSuppressionEnabled: boolean

  /**
   * Activates suppression logic to overcome RGB-IR transition jumps
   */
  rgbIrTransitionJumpSuppressorEnabled: boolean
}
const RaycastAnchorHeadConfigDefault: RaycastAnchorHeadConfig = {
  allowIrInteractionRotation: true,
  irInteractionTransitionMode: "Continuous", //Continuous, Switch
  wristAmplificationForAnchorHead: 6.5,
  farDirectionStartPoint: "CervicalLink", //CervicalLink, Epaulet
  cervicalLinkOffsetInDeviceSpace: new vec3(0, -7.5, 8),
  epauletOffsetInSituationSpace: new vec3(17.9, 0, 0),
  situationSpaceUp: "WorldUp", //WorldUp, DeviceUp
  situationSpaceForward: "DeviceForward", //WorldForward, DeviceForward
  epauletWeight: 1,
  extraXRotationDeg: 2,
  extraYRotationDeg: 3,
  facilitateHighLowTargeting: true,
  highLowTargetingInput: "GazePitch", //HandPitch, GazePitch
  handPitchUpperThresholdPairHighDeg: 90,
  handPitchUpperThresholdPairLowDeg: 50,
  handPitchLowerThresholdPairHighDeg: 50,
  handPitchLowerThresholdPairLowDeg: 10,
  gazePitchUpperThresholdPairHighDeg: 90,
  gazePitchUpperThresholdPairLowDeg: 15,
  gazePitchLowerThresholdPairHighDeg: -20,
  gazePitchLowerThresholdPairLowDeg: -90,
  haloLevelYOffsetFromCervicalLinkInSituationSpace: 64.3,
  hipLevelYOffsetFromCervicalLinkInSituationSpace: -64.3,
  pinchJumpSuppressionEnabled: true,
  rgbIrTransitionJumpSuppressorEnabled: true,
}

/**
 * RaycastAnchorHead uses the Cervical Link location in device space to stabilize the ray, making it more tolerant to head movements.
 */
export default class RaycastAnchorHead extends RaycastBase {
  private config: RaycastAnchorHeadConfig = RaycastAnchorHeadConfigDefault

  private pinchJumpSuppressor: PinchJumpSuppressor | null
  private rgbIrTransitionJumpSuppressor: RgbIrTransitionJumpSuppressor | null

  private extraXRotationRad = MathUtils.DegToRad * this.config.extraXRotationDeg
  private extraYRotationRad = MathUtils.DegToRad * this.config.extraYRotationDeg

  private irInteractionTransitionStrategy =
    this.config.allowIrInteractionRotation === true
      ? this.createIrInteractionTransitionStrategy()
      : undefined

  constructor(hand: BaseHand) {
    super(hand)
    this.pinchJumpSuppressor = this.config.pinchJumpSuppressionEnabled
      ? new PinchJumpSuppressor(hand)
      : null

    this.rgbIrTransitionJumpSuppressor = this.config
      .rgbIrTransitionJumpSuppressorEnabled
      ? new RgbIrTransitionJumpSuppressor(hand)
      : null
  }

  private createIrInteractionTransitionStrategy(): IrInteractionTransition {
    const irInteractionTransitionMode = this.config.irInteractionTransitionMode

    switch (irInteractionTransitionMode) {
      case "Continuous": {
        return new ContinuousIrInteractionTransition()
      }
      case "Switch": {
        return new SwitchIrInteractionTransition()
      }
      default: {
        throw new Error(
          `${TAG}: No matching IrInteractionTransitionStrategy found, could not create strategy`
        )
      }
    }
  }

  /**
   * Computes the transform between world and Situation space
   */
  private createTransformToWorldFromSituationBasedSpace(
    up: vec3,
    forward: vec3,
    cervicalLinkPos: vec3
  ): mat4 {
    up = up.normalize()
    vec3.orthonormalize(up, forward)
    const right = up.cross(forward).normalize()

    const rotation = mat4.makeBasis(right, up, forward)
    const translation = mat4.fromTranslation(cervicalLinkPos)
    return translation.mult(rotation)
  }

  /**
   * Computes the Cervical Link position in world
   */
  private computeCervicalLink(
    deviceCenterToWorld: mat4,
    deviceCenterInDeviceSpace: vec3
  ): vec3 {
    const cervicalLinkInDeviceSpace = deviceCenterInDeviceSpace.add(
      this.config.cervicalLinkOffsetInDeviceSpace
    )
    return deviceCenterToWorld.multiplyPoint(cervicalLinkInDeviceSpace)
  }

  /**
   * Computes 'situation space' -> world space transformation.
   * 'Situation space' can be defined by using
   * the up vector of the world or the device and
   * the forward vector of the world or the device.
   * The center of this space is the user's Cervical Link.
   * The returned epaulet point is transformed to world.
   *
   * Recommended using: world's up and device's forward
   * This assures that the user's body rotates with the device around the Y axis
   * but won't be affected by head (device) rotation around its X and Z axes
   */
  private computeTrasformToWorldFromSituationBasedSpace(
    deviceCenterToWorld: mat4,
    cervicalLinkInWorld: vec3
  ) {
    let up = vec3.zero()
    if (this.config.situationSpaceUp === situationSpaceUpEnum.WORLD_UP) {
      up = vec3.up()
    } else {
      const deviceUpwardInWorld = deviceCenterToWorld.multiplyDirection(
        vec3.up()
      )
      up = deviceUpwardInWorld
    }

    let forward = vec3.zero()
    if (
      this.config.situationSpaceForward ===
      situationSpaceForwardEnum.WORLD_FORWARD
    ) {
      forward = vec3.forward()
    } else {
      const deviceForwardInWorld = deviceCenterToWorld.multiplyDirection(
        vec3.forward()
      )
      forward = deviceForwardInWorld
    }

    const toWorldFromSituationSpace =
      this.createTransformToWorldFromSituationBasedSpace(
        up,
        forward,
        cervicalLinkInWorld
      )

    return toWorldFromSituationSpace
  }

  /**
   * Computes the Epaulet position (point above shoulder) in world
   */
  private computeEpaulet(toWorldFromSituationSpace: mat4): vec3 {
    const cervicalLinkInSituation = vec3.zero()
    const epauletOffsetInSituationSpace = new vec3(
      this.hand.handType === "left"
        ? -this.config.epauletOffsetInSituationSpace.x
        : this.config.epauletOffsetInSituationSpace.x,
      this.config.epauletOffsetInSituationSpace.y,
      this.config.epauletOffsetInSituationSpace.z
    )
    const epauletInSituation = cervicalLinkInSituation.add(
      epauletOffsetInSituationSpace
    )
    return toWorldFromSituationSpace.multiplyPoint(epauletInSituation)
  }

  private applyXRotation(
    vector: vec3,
    angleRad: number,
    toWorldFromSituationSpace: mat4
  ): vec3 {
    const vector4d = new vec4(vector.x, vector.y, vector.z, 1)

    const situSpaceRight = toWorldFromSituationSpace.multiplyDirection(
      vec3.right()
    )

    const rotQuat = quat.angleAxis(angleRad, situSpaceRight)
    const rotMat = mat4.compose(vec3.zero(), rotQuat, vec3.one())
    const vectorRotated4d = rotMat.multiplyVector(vector4d)
    return new vec3(vectorRotated4d.x, vectorRotated4d.y, vectorRotated4d.z)
  }

  private applyYRotation(
    vector: vec3,
    angleRad: number,
    handType: HandType
  ): vec3 {
    const vector4d = new vec4(vector.x, vector.y, vector.z, 1)

    const sign = handType === "left" ? -1 : 1

    const rotQuat = quat.angleAxis(sign * angleRad, vec3.up())
    const rotMat = mat4.compose(vec3.zero(), rotQuat, vec3.one())
    const vectorRotated4d = rotMat.multiplyVector(vector4d)
    return new vec3(vectorRotated4d.x, vectorRotated4d.y, vectorRotated4d.z)
  }

  private determineHandPitchInRadians(
    wrist: vec3 | null,
    index: vec3 | null,
    middle: vec3 | null
  ): number {
    if (!wrist || !index || !middle) {
      return 0
    }
    const wristToIndex = index.sub(wrist)
    const wristToMiddle = middle.sub(wrist)
    const forward = wristToIndex.add(wristToMiddle)
    const forwardHoriz = Math.sqrt(
      forward.x * forward.x + forward.z * forward.z
    )
    return Math.atan2(forward.y, forwardHoriz)
  }

  private determineGazePitchInRadians(
    rayAlgorithmData: RayAlgorithmData
  ): number {
    const forward = rayAlgorithmData.deviceCenterToWorld.multiplyDirection(
      vec3.back()
    )
    const forwardHoriz = Math.sqrt(
      forward.x * forward.x + forward.z * forward.z
    )
    return Math.atan2(forward.y, forwardHoriz)
  }

  private determineLowHighRatio(
    pitchRad: number,
    lowThresholdRad: number,
    highThresholdRad: number
  ): number {
    return MathUtils.clamp(
      MathUtils.remap(pitchRad, lowThresholdRad, highThresholdRad, 0, 1),
      0,
      1
    )
  }

  private interpolateFarDirectionStartPoint(
    handPitch: number,
    lowThreshold: number,
    highThreshold: number,
    pointA: vec3,
    pointB: vec3
  ): vec3 {
    const lowHighRatio = this.determineLowHighRatio(
      handPitch,
      lowThreshold,
      highThreshold
    )
    return interpolateVec3(pointA, pointB, lowHighRatio)
  }

  private applyTargetingHeightControl(
    farDirectionStartPoint: vec3,
    rayAlgorithmData: RayAlgorithmData,
    toWorldFromSituationSpace: mat4
  ): vec3 {
    const hipOffsetFromCervicalLinkInSituationSpace = new vec3(
      0,
      this.config.hipLevelYOffsetFromCervicalLinkInSituationSpace,
      0
    )
    const haloOffsetFromCervicalLinkInSituationSpace = new vec3(
      0,
      this.config.haloLevelYOffsetFromCervicalLinkInSituationSpace,
      0
    )

    const hipOffsetFromCervicalLinkInWorld =
      toWorldFromSituationSpace.multiplyDirection(
        hipOffsetFromCervicalLinkInSituationSpace
      )
    const haloOffsetFromCervicalLinkInWorld =
      toWorldFromSituationSpace.multiplyDirection(
        haloOffsetFromCervicalLinkInSituationSpace
      )

    const farDirectionStartPointHipLevel = farDirectionStartPoint.add(
      hipOffsetFromCervicalLinkInWorld
    )
    const farDirectionStartPointHaloLevel = farDirectionStartPoint.add(
      haloOffsetFromCervicalLinkInWorld
    )

    let pitchRad = 0
    let upperThresholdPairHighRad = 0
    let upperThresholdPairLowRad = 0
    let lowerThresholdPairHighRad = 0
    let lowerThresholdPairLowRad = 0
    if (
      this.config.highLowTargetingInput === highLowTargetingInputEnum.HAND_PITCH
    ) {
      pitchRad = this.determineHandPitchInRadians(
        rayAlgorithmData.wrist,
        rayAlgorithmData.index,
        rayAlgorithmData.mid
      )
      upperThresholdPairHighRad =
        MathUtils.RadToDeg * this.config.handPitchUpperThresholdPairHighDeg
      upperThresholdPairLowRad =
        MathUtils.RadToDeg * this.config.handPitchUpperThresholdPairLowDeg

      lowerThresholdPairHighRad =
        MathUtils.RadToDeg * this.config.handPitchLowerThresholdPairHighDeg

      lowerThresholdPairLowRad =
        MathUtils.RadToDeg * this.config.handPitchLowerThresholdPairLowDeg
    } else if (
      this.config.highLowTargetingInput === highLowTargetingInputEnum.GAZE_PITCH
    ) {
      pitchRad = this.determineGazePitchInRadians(rayAlgorithmData)
      upperThresholdPairHighRad =
        MathUtils.RadToDeg * this.config.gazePitchUpperThresholdPairHighDeg

      upperThresholdPairLowRad =
        MathUtils.RadToDeg * this.config.gazePitchUpperThresholdPairLowDeg

      lowerThresholdPairHighRad =
        MathUtils.RadToDeg * this.config.gazePitchLowerThresholdPairHighDeg

      lowerThresholdPairLowRad =
        MathUtils.RadToDeg * this.config.gazePitchLowerThresholdPairLowDeg
    }

    const midThresholdRad =
      (upperThresholdPairLowRad + lowerThresholdPairHighRad) / 2

    let farDirectionStartPointUpdated = vec3.zero()
    if (pitchRad > midThresholdRad) {
      farDirectionStartPointUpdated = this.interpolateFarDirectionStartPoint(
        pitchRad,
        upperThresholdPairLowRad,
        upperThresholdPairHighRad,
        farDirectionStartPoint,
        farDirectionStartPointHipLevel
      )
    } else {
      farDirectionStartPointUpdated = this.interpolateFarDirectionStartPoint(
        pitchRad,
        lowerThresholdPairLowRad,
        lowerThresholdPairHighRad,
        farDirectionStartPointHaloLevel,
        farDirectionStartPoint
      )
    }

    return farDirectionStartPointUpdated
  }

  override reset(): void {
    if (this.rgbIrTransitionJumpSuppressor) {
      this.rgbIrTransitionJumpSuppressor.reset()
    }
  }

  getRay(): RaycastInfo | null {
    const data = this.getRayAlgorithmData()

    if (!data.thumb || !data.index || !data.mid || !data.wrist) {
      return null
    }

    validate(this.directionOneEuroFilter)
    validate(this.locusOneEuroFilter)

    let locus = this.calculateInteractionLocus(data.thumb, data.index)
    const castAnchor = this.calculateCastAnchor(data.thumb, data.mid)

    const deviceCenterInDeviceSpace = vec3.zero()

    const cervicalLinkInWorld = this.computeCervicalLink(
      data.deviceCenterToWorld,
      deviceCenterInDeviceSpace
    )

    const toWorldFromSituationSpace =
      this.computeTrasformToWorldFromSituationBasedSpace(
        data.deviceCenterToWorld,
        cervicalLinkInWorld
      )

    let farDirectionStartPoint = vec3.zero()
    if (
      this.config.farDirectionStartPoint ===
      farDirectionStartPointEnum.CERVICAL_LINK
    ) {
      farDirectionStartPoint = cervicalLinkInWorld
    } else if (
      this.config.farDirectionStartPoint === farDirectionStartPointEnum.EPAULET
    ) {
      const epauletInWorld = this.computeEpaulet(toWorldFromSituationSpace)
      farDirectionStartPoint = epauletInWorld
        .uniformScale(this.config.epauletWeight)
        .add(
          cervicalLinkInWorld.uniformScale(
            Math.max(1 - this.config.epauletWeight, 0)
          )
        )
    }

    if (this.config.facilitateHighLowTargeting) {
      farDirectionStartPoint = this.applyTargetingHeightControl(
        farDirectionStartPoint,
        data,
        toWorldFromSituationSpace
      )
    }

    const farTargetingRay = castAnchor.sub(farDirectionStartPoint)
    const wristTargetingRay = castAnchor.sub(data.wrist)

    const closeTargetingRay = wristTargetingRay

    let targetingRay = farTargetingRay.add(
      closeTargetingRay.uniformScale(
        this.config.wristAmplificationForAnchorHead
      )
    )

    if (this.rgbIrTransitionJumpSuppressor) {
      this.rgbIrTransitionJumpSuppressor.update(targetingRay, locus)
      targetingRay =
        this.rgbIrTransitionJumpSuppressor.applyDirectionDelta(targetingRay)
      locus = this.rgbIrTransitionJumpSuppressor.applyLocusDelta(locus)
    }

    let smoothTargetingRay = this.directionOneEuroFilter.filter(
      targetingRay,
      getTime()
    )

    let filteredLocus = this.locusOneEuroFilter.filter(locus, getTime())

    if (this.pinchJumpSuppressor) {
      this.pinchJumpSuppressor.updateState(
        this.pinchJumpSuppressor.knuckleSmoothingSpace === "DeviceCenter"
          ? data.deviceCenterToWorld.inverse()
          : data.cameraToWorld.inverse()
      )
      const rayData = this.pinchJumpSuppressor.applySuppression(
        smoothTargetingRay,
        filteredLocus
      )
      smoothTargetingRay = rayData.direction
      filteredLocus = rayData.locus
    }

    const irInteractionXRotationInRadians =
      this.irInteractionTransitionStrategy?.computeXRotationInRadians(
        this.determineGazePitchInRadians(data),
        toWorldFromSituationSpace,
        filteredLocus
      ) ?? 0

    let normalizedDirection = smoothTargetingRay.normalize()
    normalizedDirection = this.applyYRotation(
      this.applyXRotation(
        normalizedDirection,
        this.extraXRotationRad + irInteractionXRotationInRadians,
        toWorldFromSituationSpace
      ).normalize(),
      this.extraYRotationRad,
      this.hand.handType
    ).normalize()

    return {
      locus: filteredLocus,
      direction: normalizedDirection,
    }
  }
}
