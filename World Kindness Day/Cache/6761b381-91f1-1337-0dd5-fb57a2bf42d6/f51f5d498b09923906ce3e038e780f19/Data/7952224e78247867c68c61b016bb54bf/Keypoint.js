"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keypoint = void 0;
const validate_1 = require("../../Utils/validate");
const WorldCameraFinderProvider_1 = require("../CameraProvider/WorldCameraFinderProvider");
/**
 * This class represents a keypoint represneting one of the many joints of a Hand in 3D space, providing methods to retrieve its world position, world rotation, and screen-space position. It uses an ObjectTracking3D component to create an attachment point and a WorldCameraFinderProvider to convert world coordinates to screen coordinates.
 *
 */
class Keypoint {
    constructor(name, objectTracking3DComponent) {
        this.name = name;
        this.objectTracking3DComponent = objectTracking3DComponent;
        this.worldCamera = WorldCameraFinderProvider_1.default.getInstance();
        this.attachmentPoint = this.objectTracking3DComponent.createAttachmentPoint(this.name);
        this.transform = this.attachmentPoint.getTransform();
    }
    /**
     * Returns the world position of this keypoint
     */
    get position() {
        return this.transform.getWorldPosition();
    }
    /**
     * Returns the world rotation of this keypoint
     */
    get rotation() {
        return this.transform.getWorldRotation();
    }
    /**
     * Returns the screen-space position of this keypoint
     */
    get screenPosition() {
        return this.worldCamera.worldSpaceToScreenSpace(this.position.x, this.position.y, this.position.z);
    }
    /**
     * Returns the normalized right vector of this keypoint
     */
    get right() {
        return this.transform.right;
    }
    /**
     * Returns the normalized right vector of this keypoint
     */
    get up() {
        return this.transform.up;
    }
    /**
     * Returns the normalized right vector of this keypoint
     */
    get forward() {
        return this.transform.forward;
    }
    /**
     * Returns the normalized right vector of this keypoint
     */
    get left() {
        return this.transform.left;
    }
    /**
     * Returns the normalized right vector of this keypoint
     */
    get down() {
        return this.transform.down;
    }
    /**
     * Returns the normalized right vector of this keypoint
     */
    get back() {
        return this.transform.back;
    }
    /**
     * Get the {@link SceneObject} attached to this keypoint
     *
     * @returns sceneObject - object attached to this keypoint
     */
    getAttachmentPoint() {
        return this.attachmentPoint;
    }
    /**
     * Overrides the {@link SceneObject} attached to this keypoint
     *
     * @param sceneObject - object to attach
     */
    addAttachmentPoint(sceneObject) {
        (0, validate_1.validate)(sceneObject);
        this.objectTracking3DComponent.removeAttachmentPoint(this.attachmentPoint);
        this.attachmentPoint = sceneObject;
        this.transform = sceneObject.getTransform();
        this.objectTracking3DComponent.addAttachmentPoint(this.name, sceneObject);
    }
    /**
     * Sets the attachment point to the default created one. This function
     * is usually called when the {@link HandVisuals} is destroyed, and we don't
     * need to remove the attachment point.
     */
    clearAttachmentPoint() {
        this.attachmentPoint = this.objectTracking3DComponent.createAttachmentPoint(this.name);
        this.transform = this.attachmentPoint.getTransform();
    }
}
exports.Keypoint = Keypoint;
//# sourceMappingURL=Keypoint.js.map