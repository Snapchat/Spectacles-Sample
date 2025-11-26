"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class that provides camera related apis
 */
class BaseWorldCameraProvider {
    /** @inheritDoc */
    attachSceneObject(sceneObject) {
        sceneObject.setParent(this.cameraComponent.getSceneObject());
    }
    /** @inheritDoc */
    getComponent() {
        return this.cameraComponent;
    }
    /** @inheritDoc */
    renderLayer() {
        return this.cameraComponent.renderLayer;
    }
    /** @inheritdoc */
    up() {
        return this.cameraTransform.up;
    }
    /** @inheritdoc */
    right() {
        return this.cameraTransform.right;
    }
    /** @inheritDoc */
    back() {
        return this.cameraTransform.back;
    }
    /** @inheritDoc */
    forward() {
        return this.cameraTransform.forward;
    }
    /** @inheritDoc */
    getWorldPosition() {
        return this.cameraTransform.getWorldPosition();
    }
    /** @inheritDoc */
    getTransform() {
        return this.cameraTransform;
    }
    /** @inheritDoc */
    getWorldTransform() {
        return this.cameraTransform.getWorldTransform();
    }
    /** @inheritDoc */
    getLocalScale() {
        return this.cameraTransform.getLocalScale();
    }
    /** @inheritDoc */
    getInvertedWorldTransform() {
        return this.cameraTransform.getInvertedWorldTransform();
    }
    /** @inheritDoc */
    screenSpaceToWorldSpace(x, y, absoluteDepth) {
        return this.cameraComponent.screenSpaceToWorldSpace(new vec2(x, y), absoluteDepth);
    }
    /** @inheritDoc */
    worldSpaceToScreenSpace(x, y, z) {
        return this.cameraComponent.worldSpaceToScreenSpace(new vec3(x, y, z));
    }
    /** @inheritDoc */
    enableClearColor(color) {
        this.cameraComponent.clearColor = color;
        this.cameraComponent.enableClearColor = true;
    }
    /** @inheritdoc */
    getClearColor() {
        return this.cameraComponent.clearColor;
    }
    /** @inheritdoc */
    inFoV(worldPosition) {
        const screenSpace = this.worldSpaceToScreenSpace(worldPosition.x, worldPosition.y, worldPosition.z);
        return screenSpace.x <= 1 && screenSpace.x >= 0 && screenSpace.y <= 1 && screenSpace.y >= 0;
    }
    /** @inheritdoc */
    getForwardPosition(x, parallelToGround = false) {
        let forwardDir = this.cameraComponent.getTransform().forward;
        if (parallelToGround) {
            forwardDir.y = 0;
            forwardDir = forwardDir.normalize();
        }
        return this.cameraComponent.getTransform().getWorldPosition().add(forwardDir.uniformScale(-x));
    }
    /** @inheritdoc */
    getForwardPositionParallelToGround(x) {
        return this.getForwardPosition(x, true);
    }
}
exports.default = BaseWorldCameraProvider;
//# sourceMappingURL=BaseWorldCameraProvider.js.map