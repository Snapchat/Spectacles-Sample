import {MobileInputData} from "../../Providers/MobileInputData/MobileInputData"
import NativeLogger from "../../Utils/NativeLogger"
import {RaycastInfo, RayProvider} from "./RayProvider"

const TAG = "MobileRayProvider"
const MOBILE_ROTATION = quat.angleAxis(Math.PI / 2, vec3.right())

/**
 * Constructs the {@link RaycastInfo} from the {@link MobileInputData} data.
 */
export class MobileRayProvider implements RayProvider {
  // Native Logging
  private log = new NativeLogger(TAG)

  private mobileInputData: MobileInputData = MobileInputData.getInstance()
  private raycastInfo: RaycastInfo | null = null

  /** @inheritdoc */
  getRaycastInfo(): RaycastInfo {
    if (this.mobileInputData.isAvailable()) {
      this.raycastInfo = {
        direction:
          this.mobileInputData.rotation
            ?.multiply(MOBILE_ROTATION)
            .multiplyVec3(vec3.back()) ?? vec3.zero(),
        locus: this.mobileInputData.position ?? vec3.zero(),
      }
    } else {
      this.log.d(
        "Mobile ray provider could not get raycast info because mobile input data provider was not available."
      )
      this.raycastInfo = {
        direction: vec3.zero(),
        locus: vec3.zero(),
      }
    }

    return this.raycastInfo
  }

  /** @inheritdoc */
  isAvailable(): boolean {
    return this.mobileInputData.isAvailable()
  }

  /** @inheritdoc */
  reset(): void {}
}
