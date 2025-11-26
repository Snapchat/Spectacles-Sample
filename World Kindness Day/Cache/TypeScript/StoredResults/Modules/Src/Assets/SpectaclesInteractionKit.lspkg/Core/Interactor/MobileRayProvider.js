"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileRayProvider = void 0;
const MobileInputData_1 = require("../../Providers/MobileInputData/MobileInputData");
const NativeLogger_1 = require("../../Utils/NativeLogger");
const TAG = "MobileRayProvider";
const MOBILE_ROTATION = quat.angleAxis(Math.PI / 2, vec3.right());
/**
 * Constructs the {@link RaycastInfo} from the {@link MobileInputData} data.
 */
class MobileRayProvider {
    constructor() {
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.mobileInputData = MobileInputData_1.MobileInputData.getInstance();
        this.raycastInfo = null;
    }
    /** @inheritdoc */
    getRaycastInfo() {
        if (this.mobileInputData.isAvailable()) {
            this.raycastInfo = {
                direction: this.mobileInputData.rotation?.multiply(MOBILE_ROTATION).multiplyVec3(vec3.back()) ?? vec3.zero(),
                locus: this.mobileInputData.position ?? vec3.zero()
            };
        }
        else {
            this.log.d("Mobile ray provider could not get raycast info because mobile input data provider was not available.");
            this.raycastInfo = {
                direction: vec3.zero(),
                locus: vec3.zero()
            };
        }
        return this.raycastInfo;
    }
    /** @inheritdoc */
    isAvailable() {
        return this.mobileInputData.isAvailable();
    }
    /** @inheritdoc */
    reset() { }
}
exports.MobileRayProvider = MobileRayProvider;
//# sourceMappingURL=MobileRayProvider.js.map