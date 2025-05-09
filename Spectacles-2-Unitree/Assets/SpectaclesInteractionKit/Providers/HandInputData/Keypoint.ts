import WorldCameraFinderProvider from "../CameraProvider/WorldCameraFinderProvider"
import {validate} from "../../Utils/validate"

const TAG = "Keypoint"

/**
 * This class represents a keypoint represneting one of the many joints of a Hand in 3D space, providing methods to retrieve its world position, world rotation, and screen-space position. It uses an ObjectTracking3D component to create an attachment point and a WorldCameraFinderProvider to convert world coordinates to screen coordinates.
 *
 */
export class Keypoint {
  private worldCamera = WorldCameraFinderProvider.getInstance()
  private transform: Transform
  private attachmentPoint: SceneObject

  constructor(
    readonly name: string,
    private objectTracking3DComponent: ObjectTracking3D,
  ) {
    this.attachmentPoint = this.objectTracking3DComponent.createAttachmentPoint(
      this.name,
    )
    this.transform = this.attachmentPoint.getTransform()
  }

  /**
   * Returns the world position of this keypoint
   */
  get position(): vec3 {
    return this.transform.getWorldPosition()
  }

  /**
   * Returns the world rotation of this keypoint
   */
  get rotation(): quat {
    return this.transform.getWorldRotation()
  }

  /**
   * Returns the screen-space position of this keypoint
   */
  get screenPosition(): vec2 {
    return this.worldCamera.worldSpaceToScreenSpace(
      this.position.x,
      this.position.y,
      this.position.z,
    )
  }

  /**
   * Returns the normalized right vector of this keypoint
   */
  get right(): vec3 {
    return this.transform.right
  }

  /**
   * Returns the normalized right vector of this keypoint
   */
  get up(): vec3 {
    return this.transform.up
  }

  /**
   * Returns the normalized right vector of this keypoint
   */
  get forward(): vec3 {
    return this.transform.forward
  }

  /**
   * Returns the normalized right vector of this keypoint
   */
  get left(): vec3 {
    return this.transform.left
  }

  /**
   * Returns the normalized right vector of this keypoint
   */
  get down(): vec3 {
    return this.transform.down
  }

  /**
   * Returns the normalized right vector of this keypoint
   */
  get back(): vec3 {
    return this.transform.back
  }

  /**
   * Get the {@link SceneObject} attached to this keypoint
   *
   * @returns sceneObject - object attached to this keypoint
   */
  getAttachmentPoint(): SceneObject {
    return this.attachmentPoint
  }

  /**
   * Overrides the {@link SceneObject} attached to this keypoint
   *
   * @param sceneObject - object to attach
   */
  addAttachmentPoint(sceneObject: SceneObject | undefined): void {
    validate(sceneObject)
    this.objectTracking3DComponent.removeAttachmentPoint(this.attachmentPoint)
    this.attachmentPoint = sceneObject
    this.transform = sceneObject.getTransform()
    this.objectTracking3DComponent.addAttachmentPoint(this.name, sceneObject)
  }

  /**
   * Sets the attachment point to the default created one. This function
   * is usually called when the {@link HandVisuals} is destroyed, and we don't
   * need to remove the attachment point.
   */
  clearAttachmentPoint(): void {
    this.attachmentPoint = this.objectTracking3DComponent.createAttachmentPoint(
      this.name,
    )
    this.transform = this.attachmentPoint.getTransform()
  }
}
