"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandRayProvider = void 0;
const HandInputData_1 = require("../../Providers/HandInputData/HandInputData");
const mathUtils_1 = require("../../Utils/mathUtils");
const HandInteractor_1 = require("../HandInteractor/HandInteractor");
const Interactor_1 = require("./Interactor");
const RaycastProxy_1 = require("./raycastAlgorithms/RaycastProxy");
/**
 * This class provides raycasting functionality for hand interactions. It selects the appropriate raycast algorithm based on the provided configuration.
 */
class HandRayProvider {
    constructor(config) {
        this.config = config;
        this.handProvider = HandInputData_1.HandInputData.getInstance();
        this.hand = this.handProvider.getHand(this.config.handType);
        this.lerpValue = 0;
        this.offsetDistance = 0;
        this.raycast = new RaycastProxy_1.default(this.hand);
    }
    /** @inheritdoc */
    getRaycastInfo() {
        const ray = this.raycast.getRay();
        if (ray === null) {
            return {
                direction: vec3.zero(),
                locus: vec3.zero()
            };
        }
        // When not near an InteractionPlane, use the raycast base's logic for direction / locus.
        if (this.config.handInteractor.fieldTargetingMode === HandInteractor_1.FieldTargetingMode.FarField) {
            return ray;
        }
        // When near an InteractionPlane, raycast from the index tip straight towards the plane.
        else {
            const indexTip = this.hand.indexTip?.position;
            if (indexTip === undefined) {
                return {
                    direction: vec3.zero(),
                    locus: vec3.zero()
                };
            }
            const planeProjection = this.config.handInteractor.currentInteractionPlane?.projectPoint(indexTip) ?? null;
            if (planeProjection === null) {
                return {
                    direction: vec3.zero(),
                    locus: vec3.zero()
                };
            }
            else {
                // When transitioning to/from nearfield mode, lerp between GestureModule data and projection data.
                if (this.config.handInteractor.currentTrigger === Interactor_1.InteractorTriggerType.None) {
                    this.lerpValue = planeProjection.lerpValue;
                    // Offset the locus of the raycast to be exactly where the direct zone starts to prevent physics issues.
                    const directZoneDistance = this.config.handInteractor.currentInteractionPlane.directZoneDistance;
                    this.offsetDistance =
                        planeProjection.distance <= directZoneDistance ? directZoneDistance - planeProjection.distance : 0;
                }
                const startDirection = ray.direction;
                let targetDirection = planeProjection.point.sub(indexTip).normalize();
                if (planeProjection.isWithinBehindZone) {
                    targetDirection = targetDirection.uniformScale(-1);
                }
                const lerpDirection = vec3.slerp(startDirection, targetDirection, this.lerpValue);
                const startLocus = ray.locus;
                const targetLocus = indexTip.add(targetDirection.uniformScale(-this.offsetDistance));
                const lerpLocus = (0, mathUtils_1.interpolateVec3)(startLocus, targetLocus, this.lerpValue);
                return {
                    direction: lerpDirection,
                    locus: lerpLocus
                };
            }
        }
    }
    /** @inheritdoc */
    isAvailable() {
        return (this.hand.isInTargetingPose() && this.hand.isTracked()) || this.hand.isPinching();
    }
    /** @inheritdoc */
    reset() {
        this.raycast.reset();
    }
}
exports.HandRayProvider = HandRayProvider;
//# sourceMappingURL=HandRayProvider.js.map