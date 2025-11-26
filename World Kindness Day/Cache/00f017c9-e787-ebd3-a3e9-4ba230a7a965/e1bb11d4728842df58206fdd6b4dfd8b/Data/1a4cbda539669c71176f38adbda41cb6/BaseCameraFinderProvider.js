"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithms_1 = require("../../Utils/algorithms");
const BaseWorldCameraProvider_1 = require("./BaseWorldCameraProvider");
/**
 * Extends {@link BaseWorldCameraProvider} by providing functionality that
 * allows for searching for the {@link Camera} during construction.
 */
class BaseCameraFinderProvider extends BaseWorldCameraProvider_1.default {
    /**
     * Checks the {@link SceneObject} passed if it has a {@link Camera} component
     * with the right render target.
     * Returns a reference to the {@link Camera} if true, null if not.
     */
    getSameRenderTargetCamera(object) {
        const cameraComponent = object.getComponent("Component.Camera");
        // It is possible the liveTarget is not set, in this case we use the captureTarget
        const targetRenderTarget = global.scene.liveTarget !== null ? global.scene.liveTarget : global.scene.captureTarget;
        if (object.enabled &&
            cameraComponent !== null &&
            cameraComponent.type === Camera.Type.Perspective &&
            cameraComponent.renderTarget.isSame(targetRenderTarget)) {
            return cameraComponent;
        }
        else {
            return null;
        }
    }
    setCamera(cameraComponent) {
        if (cameraComponent === null) {
            throw new Error("Could not find any suitable camera in the scene, make sure it is setup correctly");
        }
        if (this.lookForDeviceTrackingComponent(cameraComponent.getSceneObject()) === null) {
            throw new Error("Your main camera is currently missing a 'Device Tracking Component'. Set your `Device Tracking Component` with Tracking Mode: World for spatial movement in your Lens.");
        }
        this.cameraComponent = cameraComponent;
        this.cameraTransform = this.cameraComponent.getTransform();
    }
    lookForDeviceTrackingComponent(sceneObject) {
        const deviceTrackingComponent = sceneObject.getComponent("Component.DeviceTracking");
        return deviceTrackingComponent;
    }
    bfsFromRoot(predicate) {
        // Get root objects from the scene
        const rootObjects = [];
        const objectCount = global.scene.getRootObjectsCount();
        for (let i = 0; i < objectCount; i++) {
            rootObjects.push(global.scene.getRootObject(i));
        }
        return (0, algorithms_1.bfs)(rootObjects, predicate);
    }
}
exports.default = BaseCameraFinderProvider;
//# sourceMappingURL=BaseCameraFinderProvider.js.map