import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"

/**
 * Tracks the users point of view and emits events on whether they are viewing
 * from a valid angle or not.
 *
 * @version 1.0.0
 */
@component
export class SpatialImageAngleValidator extends BaseScriptComponent {
  @input
  private image: SceneObject
  @input
  @allowUndefined
  private frame: ContainerFrame

  /**
   * A focal point, set behind the image, where the angle is measured from.
   */
  @input
  public validZoneFocal: number = 2.0
  /**
   * The angular range, in degrees, where no flattening is applied.
   */
  @input
  public validZoneAngle: number = 25
  /**
   * The threshold, in degrees, which must be exceeded when moving between the
   * dead zone.
   */
  @input
  private validZoneThreshold: number = 5

  @input
  private camera: SceneObject

  private onValidityCallbacks: ((valid: boolean) => void)[] = []
  private lastAngle: number

  onAwake(): void {
    this.createEvent("UpdateEvent").bind(() => {
      const angle = this.calculateObservationAngle()
      if (this.lastAngle < this.validZoneAngle && angle > this.validZoneAngle) {
        this.onValidityCallbacks.forEach((callback) => callback(false))
      } else if (
        this.lastAngle > this.validZoneAngle - this.validZoneThreshold &&
        angle < this.validZoneAngle - this.validZoneThreshold
      ) {
        this.onValidityCallbacks.forEach((callback) => callback(true))
      }

      this.lastAngle = angle
    })
  }

  private calculateObservationAngle() {
    const cameraPosition = this.camera.getTransform().getWorldPosition()
    const imageTransform = this.image.getTransform()
    const imagePos = imageTransform.getWorldPosition()
    const imageFocalDisplacement = imageTransform.getWorldRotation().multiplyVec3(new vec3(0, 0, this.validZoneFocal))
    const imageFocal = imagePos.sub(imageFocalDisplacement)
    const displacement = cameraPosition.sub(imageFocal)
    const displacementDirection = displacement.normalize()
    const angle = displacementDirection.dot(this.image.getTransform().getWorldRotation().multiplyVec3(vec3.forward()))

    return (1 - angle) * 90
  }

  /**
   * Sets the focal point of the valid zone.
   *
   * @remarks This allows the user to move their head around in front of the
   * image without it being considered an extreme angle.
   */
  public setValidZoneFocal(focal: number): void {
    this.validZoneFocal = focal
  }

  /**
   * Sets the angle, in degrees, at which the angle is considered valid.
   */
  public setValidZoneAngle(angle: number): void {
    this.validZoneAngle = angle
  }

  /**
   * Add a callback to onValidityCallbacks, to be called when the image is fully loaded.
   * @param callback - the callback to add
   */
  public addOnValidityCallback(callback: (entered: boolean) => void): void {
    this.onValidityCallbacks.push(callback)
  }

  /**
   * Remove a callback from the onValidityCallbacks.
   * @param callback - the callback to remove
   */
  public removeOnValidityCallback(callback: (entered: boolean) => void): void {
    this.onValidityCallbacks = this.onValidityCallbacks.filter((cb) => cb !== callback)
  }
}
