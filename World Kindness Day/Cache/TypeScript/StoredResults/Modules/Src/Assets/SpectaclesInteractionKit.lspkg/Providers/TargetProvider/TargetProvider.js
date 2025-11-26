"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InteractionManager_1 = require("../../Core/InteractionManager/InteractionManager");
const SceneObjectUtils_1 = require("../../Utils/SceneObjectUtils");
const WorldCameraFinderProvider_1 = require("../CameraProvider/WorldCameraFinderProvider");
/**
 * Base class for all target providers
 */
class TargetProvider {
    constructor() {
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this._currentInteractableHitInfo = null;
        this._currentInteractableSet = new Set();
    }
    /**
     * @returns the hit information {@link InteractableHitInfo} for the current interactable or null if there was no hit
     */
    get currentInteractableHitInfo() {
        return this._currentInteractableHitInfo;
    }
    /**
     * Set the _currentInteractableHitInfo to null, used when an Interactable is deleted from Lens Studio, to keep state in sync
     */
    clearCurrentInteractableHitInfo() {
        this._currentInteractableHitInfo = null;
        this._currentInteractableSet.clear();
    }
    /**
     * @returns whether the provider has found a target or not
     */
    hasTarget() {
        return this._currentInteractableHitInfo !== null;
    }
    /**
     * @returns whether the TargetProvider is intersecting with the Interactable
     */
    isHoveringInteractable(interactable) {
        return this._currentInteractableSet.has(interactable);
    }
    get currentInteractableSet() {
        return this._currentInteractableSet;
    }
    updateCurrentInteractableSet(hits) {
        this._currentInteractableSet.clear();
        for (const hit of hits) {
            const interactable = this.interactionManager.getInteractableByCollider(hit.collider);
            if (interactable !== null && (interactable.targetingMode & this.targetingMode) !== 0) {
                this._currentInteractableSet.add(interactable);
            }
        }
    }
    deleteFromCurrentInteractableSet(interactable) {
        if (interactable !== null) {
            this._currentInteractableSet.delete(interactable);
        }
    }
    /**
     * @param hits - list of {@link RayCastHit}
     * @param targetingMode  - targeting mode used to filter hits
     * @param getInteractableByCollider - function that is used to get the interactable associated to the collider
     * (to enable the method to be static)
     * @param offset - offset value that defines if the raycast was offset from the start point
     * @param camera - camera used to verify FoV
     * @param allowOutOfFovInteraction - whether interactions that are out of the camera's field of view are allowed
     * @returns the hit corresponding to the target from the list of hits
     */
    static getInteractableHitFromRayCast(hits, targetingMode, getInteractableByCollider, offset = 0, camera = null, allowOutOfFovInteraction = false) {
        const hitInfos = [];
        for (const hit of hits) {
            if (!allowOutOfFovInteraction && camera !== null && !camera.inFoV(hit.position)) {
                continue;
            }
            const interactable = getInteractableByCollider(hit.collider);
            if (interactable !== null && (interactable.targetingMode & targetingMode) !== 0) {
                hit.skipRemaining = false;
                hitInfos.push({
                    interactable: interactable,
                    localHitPosition: interactable.sceneObject
                        .getTransform()
                        .getInvertedWorldTransform()
                        .multiplyPoint(hit.position),
                    hit: {
                        collider: hit.collider,
                        distance: hit.distance + offset,
                        normal: hit.normal,
                        position: hit.position,
                        skipRemaining: false,
                        t: 0,
                        triangle: hit.triangle,
                        getTypeName: hit.getTypeName,
                        isOfType: hit.isOfType,
                        isSame: hit.isSame
                    },
                    targetMode: targetingMode
                });
            }
        }
        return TargetProvider.getNearestDeeplyNestedInteractable(hitInfos);
    }
    /**
     * The nearest deeply nested interactable, is the latest descendant of a list of
     * interactables, when they are ordered by distance.
     * @param hitInfos - list of hits
     * @returns - the most deeply nested interactable of the nearest interactable
     */
    static getNearestDeeplyNestedInteractable(hitInfos) {
        hitInfos.sort((hitA, hitB) => {
            return hitA.hit.distance - hitB.hit.distance;
        });
        let targetHitInfo = null;
        for (const currentHitInfo of hitInfos) {
            if (targetHitInfo === null ||
                (0, SceneObjectUtils_1.isDescendantOf)(currentHitInfo.interactable.sceneObject, targetHitInfo.interactable.sceneObject)) {
                targetHitInfo = currentHitInfo;
            }
        }
        return targetHitInfo;
    }
    getInteractableHitFromRayCast(hits, offset = 0, allowOutOfFovInteraction = false) {
        return TargetProvider.getInteractableHitFromRayCast(hits, this.targetingMode, this.interactionManager.getInteractableByCollider.bind(this.interactionManager), offset, this.camera, allowOutOfFovInteraction);
    }
}
exports.default = TargetProvider;
//# sourceMappingURL=TargetProvider.js.map