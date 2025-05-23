import {IrInteractionTransition} from "./IrInteractionTransition"

export type SwitchIrInteractionTransitionConfig = {
  /**
   * Rotation applied around X axis in degrees when the ray is in IR FoV mode
   */
  rotationXDegrees: number

  /**
   * Height difference between neck and hand - above this value, switch to IR mode
   */
  neckHandHeightDifferenceToIr: number

  /**
   * Height difference between neck and hand - under this value, switch to Default mode
   */
  neckHandHeightDifferenceToDefault: number

  /**
   * Gaze pitch in degrees - below this value, switch to IR mode
   */
  gazePitchDegreesToIr: number

  /**
   * Gaze pitch in degrees - above this value, switch to Default mode
   */
  gazePitchDegreesToDefault: number

  /**
   * Duration time in seconds for the transition between modes when the mode is switched
   */
  transitionSeconds: number

  /**
   * Debounce time in seconds to switch to IR mode
   */
  debounceToIrSeconds: number

  /**
   * Debounce time in seconds to switch to Default mode
   */
  debounceToDefaultSeconds: number
}

const SwitchIrInteractionTransitionConfigDefault = {
  rotationXDegrees: 35,
  neckHandHeightDifferenceToIr: 35,
  neckHandHeightDifferenceToDefault: 30,
  gazePitchDegreesToIr: 25,
  gazePitchDegreesToDefault: 25,
  transitionSeconds: 0.2,
  debounceToIrSeconds: 0.2,
  debounceToDefaultSeconds: 0.1,
}

/**
 * Class to implement Switch-like IR Transition Strategy
 */
export default class SwitchIrInteractionTransition
  implements IrInteractionTransition
{
  private inIrMode = false
  private irModeSaturationProgress = 0
  private debounceProgress = 0

  private config: SwitchIrInteractionTransitionConfig =
    SwitchIrInteractionTransitionConfigDefault

  private transitionSeconds =
    this.config.transitionSeconds > 0 ? this.config.transitionSeconds : 0.2
  private debounceToIrSeconds =
    this.config.debounceToIrSeconds > 0 ? this.config.debounceToIrSeconds : 0.2
  private debounceToDefaultSeconds =
    this.config.debounceToDefaultSeconds > 0
      ? this.config.debounceToDefaultSeconds
      : 0.1

  /** @inheritdoc */
  computeXRotationInDegrees(
    gazePitchInDegrees: number,
    toWorldFromSituationSpace: mat4,
    handPoint: vec3
  ): number {
    const transformedHandPoint = toWorldFromSituationSpace
      .inverse()
      .multiplyPoint(handPoint)

    const rotationInDegrees =
      this.computeMultiplier(transformedHandPoint, gazePitchInDegrees) *
      this.config.rotationXDegrees
    return rotationInDegrees
  }

  /** @inheritdoc */
  computeXRotationInRadians(
    gazePitchInRadians: number,
    toWorldFromSituationSpace: mat4,
    handPoint: vec3
  ): number {
    return (
      MathUtils.DegToRad *
      this.computeXRotationInDegrees(
        MathUtils.RadToDeg * gazePitchInRadians,
        toWorldFromSituationSpace,
        handPoint
      )
    )
  }

  /**
   * Computes the multiplier for the Ir interaction additional rotation in switch transition mode
   * @param handPoint - hand point used for height estimation
   * @param gazePitchInDegrees - gaze pitch given in degrees
   * @returns multiplier for the Ir interaction interaction rotation
   */
  private computeMultiplier(
    handPoint: vec3,
    gazePitchInDegrees: number
  ): number {
    if (this.inIrMode === false) {
      this.switchTransitionStrategyInDefaultMode(handPoint, gazePitchInDegrees)
    } else {
      this.switchTransitionStrategyInIrMode(handPoint, gazePitchInDegrees)
    }
    return this.irModeSaturationProgress
  }

  /**
   * Steps the switch transition strategy while in default mode
   * @param handPoint - hand point used for height estimation
   * @param gazePitchInDegrees - gaze pitch given in degrees
   */
  private switchTransitionStrategyInDefaultMode(
    handPoint: vec3,
    gazePitchInDegrees: number
  ): void {
    if (
      handPoint.y < -this.config.neckHandHeightDifferenceToIr &&
      gazePitchInDegrees > -this.config.gazePitchDegreesToIr
    ) {
      this.debounceProgress += getDeltaTime() / this.debounceToIrSeconds
      this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1)
      if (this.debounceProgress === 1) {
        this.inIrMode = true
        this.debounceProgress = 0
      }
    } else {
      this.irModeSaturationProgress -= getDeltaTime() / this.transitionSeconds
      this.irModeSaturationProgress = MathUtils.clamp(
        this.irModeSaturationProgress,
        0,
        1
      )
      this.debounceProgress -= getDeltaTime() / this.debounceToIrSeconds
      this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1)
    }
  }

  /**
   * Steps the switch transition strategy while in IR mode
   * @param handPoint - hand point used for height estimation
   * @param gazePitchInDegrees - gaze pitch given in degrees
   */
  private switchTransitionStrategyInIrMode(
    handPoint: vec3,
    gazePitchInDegrees: number
  ): void {
    if (
      handPoint.y >= -this.config.neckHandHeightDifferenceToDefault ||
      gazePitchInDegrees <= -this.config.gazePitchDegreesToDefault
    ) {
      this.debounceProgress += getDeltaTime() / this.debounceToDefaultSeconds
      this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1)
      if (this.debounceProgress === 1) {
        this.inIrMode = false
        this.debounceProgress = 0
      }
    } else {
      this.irModeSaturationProgress += getDeltaTime() / this.transitionSeconds
      this.irModeSaturationProgress = MathUtils.clamp(
        this.irModeSaturationProgress,
        0,
        1
      )
      this.debounceProgress -= getDeltaTime() / this.debounceToDefaultSeconds
      this.debounceProgress = MathUtils.clamp(this.debounceProgress, 0, 1)
    }
  }
}
