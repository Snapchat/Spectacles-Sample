import {PublicApi} from "../../../../Utils/Event"
import HciPinchDetectionStrategy, {
  HciPinchDetectionStrategyConfig,
} from "./DetectionStrategies/HciPinchDetectionStrategy"
import HeuristicPinchDetectionStrategy, {
  HeuristicPinchDetectionStrategyConfig,
} from "./DetectionStrategies/HeuristicPinchDetectionStrategy"
import {PinchDetectionStrategy} from "./DetectionStrategies/PinchDetectionStrategy"
import PinchDetectorStateMachine from "./PinchDetectorStateMachine"

const TAG = "PinchDetector"

export enum PinchDetectionSelection {
  Heuristic = "Heuristic",
  LensCoreML = "LensCore ML",
  Mock = "Mock",
}

export type PinchDetectorConfig = HciPinchDetectionStrategyConfig &
  HeuristicPinchDetectionStrategyConfig & {
    onHandLost: PublicApi<void>
    isTracked: () => boolean
    pinchDownThreshold?: number
    pinchDetectionSelection?: PinchDetectionSelection
  }

/**
 * Wraps PinchDetectionStrategy inside PinchDetectorStateMachine for pinch events
 */
export class PinchDetector {
  private pinchDetectionStrategy
  private pinchDetectorStateMachine = new PinchDetectorStateMachine()

  private pinchStrength = 0

  constructor(private config: PinchDetectorConfig) {
    config.pinchDownThreshold ??= 1.75
    config.pinchDetectionSelection ??= PinchDetectionSelection.LensCoreML

    this.pinchDetectionStrategy = this.createPinchDetectionStrategy()

    this.setupPinchEventCallback()
  }

  /**
   * Event called when the user has successfully pinched down.
   */
  get onPinchDown(): PublicApi<void> {
    return this.pinchDetectorStateMachine.onPinchDown
  }

  /**
   * Event called when the user has released pinching after they
   * have successfully pinched down.
   */
  get onPinchUp(): PublicApi<void> {
    return this.pinchDetectorStateMachine.onPinchUp
  }

  /**
   * Event called when the user's pinch is canceled by the system.
   */
  get onPinchCancel(): PublicApi<void> {
    return this.pinchDetectorStateMachine.onPinchCancel
  }

  /**
   * Determines if the user is pinching
   */
  isPinching(): boolean {
    return this.pinchDetectorStateMachine.isPinching()
  }

  /**
   * Returns a normalized value from 0-1, where:
   * 0 is the distance from a finger tip to the thumb tip in
   * resting/neutral hand pose.
   * 1 is when a finger tip to thumb tip are touching/pinching
   */
  getPinchStrength(): number {
    if (this.config.isTracked()) {
      return this.pinchStrength
    }

    return 0
  }

  private createPinchDetectionStrategy(): PinchDetectionStrategy {
    const pinchDetection = this.config.pinchDetectionSelection
    if (pinchDetection === undefined) {
      throw new Error("A PinchDetectionStrategy needs to be specified.")
    }
    switch (pinchDetection) {
      case PinchDetectionSelection.Heuristic: {
        return new HeuristicPinchDetectionStrategy({
          ...this.config,
          pinchDownThreshold: this.config.pinchDownThreshold,
        })
      }
      case PinchDetectionSelection.LensCoreML: {
        return new HciPinchDetectionStrategy(this.config)
      }
      default: {
        throw new Error(
          `${TAG}: No matching PinchDetectionSelection found, could not create strategy`
        )
      }
    }
  }

  private setupPinchEventCallback() {
    this.pinchDetectionStrategy.onPinchDetected.add((pinchEvent) => {
      this.pinchDetectorStateMachine.notifyPinchEvent(pinchEvent)
    })

    this.pinchDetectionStrategy.onPinchProximity.add((proximity: number) => {
      this.pinchStrength = proximity
    })
  }
}
