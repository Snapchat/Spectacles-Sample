import {BaseHand} from "../../../Providers/HandInputData/BaseHand"
import {RaycastInfo} from "../RayProvider"
import RaycastBase from "./RaycastBase"

const TAG = "RaycastProxy"

/**
 * RaycastProxy forwards the TargetingData received from LensCore's Gesture Module.
 */
export default class RaycastProxy extends RaycastBase {
  constructor(hand: BaseHand) {
    super(hand)
  }

  /**
   * Forwards the TargetingData received from LensCore's Gesture Module.
   *
   * @returns RaycastInfo (locus and direction of the ray) filled with
   * the data received from LensCore's Gesture Module.
   * If no data has been received (e.g.: couldn't subscribe because the API is not yet present in LensCore), it can return null.
   */
  getRay(): RaycastInfo | null {
    const targetingData = this.hand.targetingData
    if (targetingData !== null) {
      return {
        locus: targetingData.targetingLocusInWorld,
        direction: targetingData.targetingDirectionInWorld,
      }
    } else {
      return null
    }
  }
}
