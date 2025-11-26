"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColliderTargetProvider = void 0;
const InteractionPlane_1 = require("../../Components/Interaction/InteractionPlane/InteractionPlane");
const TargetProvider_1 = require("../../Providers/TargetProvider/TargetProvider");
const notEmpty_1 = require("../../Utils/notEmpty");
const SceneObjectUtils_1 = require("../../Utils/SceneObjectUtils");
/**
 * Uses a collider positioned to detect a target
 */
class ColliderTargetProvider extends TargetProvider_1.default {
    constructor(interactor, config) {
        super();
        this.config = config;
        // If the collider is in an interaction plane's interaction zone, cache the plane.
        this._currentInteractionPlanes = [];
        this.interactor = interactor;
        this.ownerSceneObject = global.scene.createSceneObject(config.sceneObjectName ?? "ColliderTargetProvider");
        this.ownerSceneObject.setParent(this.interactor.sceneObject);
    }
    /** @inheritdoc */
    get startPoint() {
        return this.colliderPosition;
    }
    /** @inheritdoc */
    get endPoint() {
        return this.colliderPosition;
    }
    /**
     * Returns an array of InteractionPlanes with interaction zones overlapping with the collider.
     */
    get currentInteractionPlanes() {
        return this._currentInteractionPlanes;
    }
    /**
     * Clears an InteractionPlane from the cache (in the event of the InteractionPlane being de-registered).
     * @param plane - the InteractionPlane to clear.
     */
    clearInteractionPlane(plane) {
        const index = this.currentInteractionPlanes.indexOf(plane);
        if (index !== -1) {
            this._currentInteractionPlanes.splice(index, 1);
        }
    }
    /**
     * @returns the direct collider position for direct manipulation
     */
    get colliderPosition() {
        return this.isAvailable() ? this.ownerSceneObject.getTransform().getWorldPosition() : vec3.zero();
    }
    /** @inheritdoc */
    update() {
        if (this.isAvailable()) {
            const newPosition = this.getNextPosition();
            this.ownerSceneObject.getTransform().setWorldPosition(newPosition);
            this.ownerSceneObject.enabled = true;
        }
        else {
            this.ownerSceneObject.enabled = false;
            this.clearCurrentInteractableHitInfo();
            this._currentInteractionPlanes = [];
        }
    }
    /** @inheritdoc */
    destroy() {
        this.ownerSceneObject.destroy();
    }
    createCollider(sceneObject, radius, onOverlapStay, onOverlapExit, debugDrawEnabled) {
        const collider = sceneObject.createComponent("Physics.ColliderComponent");
        const shape = Shape.createSphereShape();
        shape.radius = radius;
        collider.shape = shape;
        collider.intangible = true;
        collider.debugDrawEnabled = debugDrawEnabled;
        if (onOverlapStay !== null) {
            collider.onOverlapStay.add(onOverlapStay);
        }
        if (onOverlapExit !== null) {
            collider.onOverlapExit.add(onOverlapExit);
        }
        return collider;
    }
    onColliderOverlapStay(event, allowOutOfFovInteraction = false) {
        const hits = event.currentOverlaps
            .map((overlap) => {
            try {
                return {
                    collider: overlap.collider,
                    distance: overlap.collider.getTransform().getWorldPosition().distance(this.endPoint),
                    normal: vec3.zero(),
                    position: this.endPoint,
                    skipRemaining: false,
                    t: 0,
                    triangle: null,
                    getTypeName: overlap.collider.getTypeName,
                    isTypeOf: overlap.collider.isOfType,
                    isSame: overlap.collider.isSame,
                    isOfType: overlap.collider.isOfType
                };
            }
            catch {
                return null;
            }
        })
            .filter(notEmpty_1.notEmpty);
        this.updateCurrentInteractableSet(hits);
        if (this.config.shouldPreventTargetUpdate?.()) {
            return;
        }
        this._currentInteractableHitInfo = this.getInteractableHitFromRayCast(hits, 0, allowOutOfFovInteraction);
        this.updateInteractionPlanesFromOverlap(event.currentOverlaps);
    }
    onColliderOverlapExit(event) {
        if (event.overlap.collider === this._currentInteractableHitInfo?.hit.collider) {
            this._currentInteractableHitInfo = null;
        }
        this.removeInteractionPlaneFromOverlap(event.overlap);
    }
    updateInteractionPlanesFromOverlap(overlaps) {
        for (const overlap of overlaps) {
            const planeSceneObject = overlap.collider.getSceneObject();
            const plane = (0, SceneObjectUtils_1.findScriptComponentInSelfOrParents)(planeSceneObject, InteractionPlane_1.InteractionPlane, 1);
            if (plane !== null && !this._currentInteractionPlanes.includes(plane)) {
                this._currentInteractionPlanes.push(plane);
            }
        }
    }
    removeInteractionPlaneFromOverlap(overlap) {
        const planeSceneObject = overlap.collider.getSceneObject();
        const plane = (0, SceneObjectUtils_1.findScriptComponentInSelfOrParents)(planeSceneObject, InteractionPlane_1.InteractionPlane, 1);
        if (plane !== null && plane.collider === overlap.collider) {
            const index = this.currentInteractionPlanes.indexOf(plane);
            if (index !== -1) {
                this._currentInteractionPlanes.splice(index, 1);
            }
        }
    }
}
exports.ColliderTargetProvider = ColliderTargetProvider;
//# sourceMappingURL=ColliderTargetProvider.js.map