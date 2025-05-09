import {PublicApi} from "../../../../../Utils/Event"
import {PinchEventType} from "../../PinchEventType"

/**
 * Interface that all methods of detecting pinch should adhere to in order to be usable in PinchDetector
 */
export interface PinchDetectionStrategy {
  /**
   * Event invokes when a pinch is down or up or cancelled
   */
  onPinchDetected: PublicApi<PinchEventType>

  /**
   * Event invoked when a pinch proximity occurs.
   * Normalized value from 0-1, where:
   * 0 is the distance from a finger tip to the thumb tip in
   * resting/neutral hand pose.
   * 1 is when a finger tip to thumb tip are touching/pinching
   */
  onPinchProximity: PublicApi<number>
}
