"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TargetProvider_1 = require("../../Providers/TargetProvider/TargetProvider");
const Interactor_1 = require("./Interactor");
/**
 * Target provider for MouseInteractor. Can target all Interactables regardless of their targetingMode.
 */
class MouseTargetProvider extends TargetProvider_1.default {
    constructor(interactor, config) {
        super();
        this.interactor = interactor;
        this.config = config;
        this.targetingMode = Interactor_1.TargetingMode.Indirect | Interactor_1.TargetingMode.Direct | Interactor_1.TargetingMode.Poke;
        this.probe = Physics.createGlobalProbe();
        this.currentRay = null;
        this.targetingVolumeMultiplier = this.config.targetingVolumeMultiplier ?? 1;
        this.spherecastRadii = this.config.spherecastRadii;
        this.spherecastDistanceThresholds = this.config.spherecastDistanceThresholds;
        this._drawDebug = this.interactor.drawDebug;
        this._drawDebug = this.interactor.drawDebug;
        this.probe.debugDrawEnabled = this.interactor.drawDebug;
        if (this.config.spherecastRadii.length !== this.config.spherecastDistanceThresholds.length) {
            throw new Error("An Interactor's Spherecast Radii and Spherecast Distance Thresholds input arrays are not the same length!");
        }
    }
    /**
     * @inheritdoc
     */
    get startPoint() {
        return this.currentRay?.locus ?? vec3.zero();
    }
    /**
     * @inheritdoc
     */
    get endPoint() {
        return this.startPoint.add(this.direction.uniformScale(this.config.maxRayDistance));
    }
    /**
     * Returns the direction the mouse ray is pointing toward.
     */
    get direction() {
        return this.currentRay?.direction ?? vec3.zero();
    }
    /**
     * Set if the mouse is should draw a debug gizmo of collider/raycasts in the scene.
     */
    set drawDebug(debug) {
        this._drawDebug = debug;
        this.probe.debugDrawEnabled = debug;
    }
    /**
     * @returns if the mouse is should draw a debug gizmo of collider/raycasts in the scene.
     */
    get drawDebug() {
        return this._drawDebug;
    }
    /**
     * Can be used to reset inner states
     * Should be called when the hand is not tracked or targeting is blocked
     */
    reset() {
        this.config.rayProvider.reset();
    }
    /** @inheritdoc */
    update() {
        if (!this.config.rayProvider.isAvailable()) {
            this.config.rayProvider.reset();
            this.updateTargetedItem(null);
            return;
        }
        this.currentRay = this.config.rayProvider.getRaycastInfo();
        if (this.currentRay) {
            this.mouseRayCast(this.currentRay);
        }
    }
    /** @inheritdoc */
    destroy() { }
    /**
     * Uses a ray cast to detect items in the direct path
     * Starts sphere casting if and only if nothing is found with the ray
     */
    mouseRayCast(ray) {
        this.probe.rayCastAll(ray.locus, this.endPoint, 
        // RaycastHits are automatically sorted from nearest to farthest
        (hits) => {
            this.updateCurrentInteractableSet(hits);
            const hitInfo = this.getInteractableHitFromRayCast(hits);
            if (hitInfo) {
                this.updateTargetedItem(hitInfo);
                return;
            }
            /*
             * If nothing is hit directly by the ray, try sphere cast if ray is sticky or set targeted item to null if not
             * Also, reset to default mouse mode
             */
            if (this.interactor.sphereCastEnabled) {
                this.mouseSphereCast(ray);
            }
            else {
                this.updateTargetedItem(null);
            }
        });
    }
    /**
     * Does a sphere cast to look for interactables
     * Iterates through size options from smallest to largest until something is found/all options are checked
     */
    mouseSphereCast(ray, index = 0) {
        // Nothing is targeted if no interactables exist, or we've iterated through all sphere options
        if (index >= this.spherecastDistanceThresholds.length) {
            this.updateTargetedItem(null);
            return;
        }
        const offset = this.spherecastDistanceThresholds[index];
        const castOrigin = ray.locus.add(ray.direction.uniformScale(offset));
        const castEnd = castOrigin.add(ray.direction.uniformScale(this.config.maxRayDistance - offset));
        this.probe.sphereCastAll(this.spherecastRadii[index] * this.targetingVolumeMultiplier, castOrigin, castEnd, (hits) => {
            const hitInfo = this.getInteractableHitFromRayCast(hits, offset);
            if (hitInfo) {
                this.updateTargetedItem(hitInfo);
                return;
            }
            this.mouseSphereCast(ray, index + 1);
        });
    }
    updateTargetedItem(hitInfo) {
        /*
         * We check if the new target is the same, we always update the hit data with the new
         * value
         */
        if (hitInfo !== null &&
            this.currentInteractableHitInfo !== null &&
            this.currentInteractableHitInfo.interactable === hitInfo.interactable) {
            this.currentInteractableHitInfo.hit = hitInfo.hit;
        }
        // If we shouldn't update the target, we return early
        if (this.config.shouldPreventTargetUpdate()) {
            return;
        }
        this._currentInteractableHitInfo = hitInfo;
    }
}
exports.default = MouseTargetProvider;
//# sourceMappingURL=MouseTargetProvider.js.map