import {PublicApi} from "../../../../Utils/Event"
import NativeLogger from "../../../../Utils/NativeLogger"
import {PinchEventType} from "../PinchEventType"
import HciPinchDetectionStrategy, {
  HciPinchDetectionStrategyConfig
} from "./DetectionStrategies/HciPinchDetectionStrategy"
import PinchDetectorStateMachine from "./PinchDetectorStateMachine"

export enum PinchDetectionSelection {
  Heuristic = "Heuristic",
  LensCoreML = "LensCore ML",
  Mock = "Mock"
}

export type PinchDetectorConfig = HciPinchDetectionStrategyConfig & {
  onHandLost: PublicApi<void>
  isTracked: () => boolean
  pinchDownThreshold?: number
  pinchDetectionSelection?: PinchDetectionSelection
}

export type PinchEvent = {
  eventType: PinchEventType
  isFiltered: boolean
}

/**
 * Wraps PinchDetectionStrategy inside PinchDetectorStateMachine for pinch events
 */
export class PinchDetector {
  /**
   * Determines if the pinch detector should listen to filtered or unfiltered pinch events.
   */
  useFilteredPinch = false

  private pinchDetectionStrategy = new HciPinchDetectionStrategy(this.config)
  private pinchDetectorStateMachine = new PinchDetectorStateMachine()

  private pinchStrength = 0

  constructor(private config: PinchDetectorConfig) {
    config.pinchDownThreshold ??= 1.75
    config.pinchDetectionSelection ??= PinchDetectionSelection.LensCoreML

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

  private log = new NativeLogger("PinchDetector")

  private setupPinchEventCallback() {
    /**
     * If the pinch detector is not set to the same filtering as the detected event when filtered events are available,
     * ignore the event entirely. If filtered events are not available, process every regular pinch event.
     */
    this.pinchDetectionStrategy.onPinchDetected.add((pinchEvent) => {
      if (!this.pinchDetectionStrategy.isFilteredPinchAvailable || pinchEvent.isFiltered === this.useFilteredPinch) {
        this.pinchDetectorStateMachine.notifyPinchEvent(pinchEvent.eventType)
      }
    })

    this.pinchDetectionStrategy.onPinchProximity.add((proximity: number) => {
      this.pinchStrength = proximity
    })
  }
}
