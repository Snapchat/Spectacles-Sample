"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectTargetProvider = void 0;
const HandInputData_1 = require("../../Providers/HandInputData/HandInputData");
const ColliderTargetProvider_1 = require("./ColliderTargetProvider");
const Interactor_1 = require("./Interactor");
/**
 * Hand based direct target provider. Uses a collider positioned
 * at the center position of the index and thumb
 */
class DirectTargetProvider extends ColliderTargetProvider_1.ColliderTargetProvider {
    constructor(interactor, config) {
        super(interactor, config);
        this.config = config;
        this.targetingMode = Interactor_1.TargetingMode.Direct;
        this.handProvider = HandInputData_1.HandInputData.getInstance();
        this.hand = this.handProvider.getHand(this.config.handType);
        this.overlapEvent = null;
        this._drawDebug = this.config.debugEnabled;
        this.colliders = [];
        this.colliders.push(this.createCollider(this.ownerSceneObject, config.colliderEnterRadius, this.onColliderOverlapStay.bind(this), null, config.debugEnabled));
        this.colliders.push(this.createCollider(this.ownerSceneObject, config.colliderExitRadius, null, this.onColliderOverlapExit.bind(this), config.debugEnabled));
        this.ownerSceneObject.enabled = false;
        this.hand.onHandFound.add(() => {
            this.ownerSceneObject.enabled = true;
        });
        this.hand.onHandLost.add(() => {
            this.ownerSceneObject.enabled = false;
        });
    }
    set drawDebug(debug) {
        this._drawDebug = debug;
        for (const collider of this.colliders) {
            collider.debugDrawEnabled = debug;
        }
    }
    get drawDebug() {
        return this._drawDebug;
    }
    /** @inheritdoc */
    isAvailable() {
        return (this.hand.indexTip !== null &&
            this.hand.thumbTip !== null &&
            this.hand.enabled &&
            (this.hand.isTracked() || this.hand.isPinching()));
    }
    /** @inheritdoc */
    update() {
        if (this.isAvailable()) {
            const newPosition = this.getNextPosition();
            this.ownerSceneObject.getTransform().setWorldPosition(newPosition);
            this.ownerSceneObject.enabled = true;
            if (!this.config.shouldPreventTargetUpdate?.()) {
                if (this.overlapEvent === null) {
                    this.clearCurrentInteractableHitInfo();
                }
                this.overlapEvent = null;
            }
        }
        else {
            this.ownerSceneObject.enabled = false;
            this.clearCurrentInteractableHitInfo();
            this._currentInteractionPlanes = [];
        }
    }
    onColliderOverlapStay(event, allowOutOfFovInteraction = false) {
        this.overlapEvent = event;
        super.onColliderOverlapStay(event, allowOutOfFovInteraction);
    }
    onColliderOverlapExit(event) {
        const interactable = this.interactionManager.getInteractableByCollider(event.overlap.collider);
        this.deleteFromCurrentInteractableSet(interactable);
        if (this.config.shouldPreventTargetUpdate?.()) {
            return;
        }
        super.onColliderOverlapExit(event);
    }
    /** @inheritdoc */
    getNextPosition() {
        const indexTip = this.hand.indexTip?.position;
        const thumbTip = this.hand.thumbTip?.position;
        if (indexTip === undefined || thumbTip === undefined) {
            return vec3.zero();
        }
        return indexTip.add(thumbTip).uniformScale(0.5);
    }
}
exports.DirectTargetProvider = DirectTargetProvider;
//# sourceMappingURL=DirectTargetProvider.js.map