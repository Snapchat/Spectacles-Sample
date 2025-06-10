/**
 * This script smooths out the heading direction of the provided camera.
 */
@component
export class HeadDirectionLerper extends BaseScriptComponent {
  @input private camera: Camera
  @input private maxOffset = 1

  private transform: Transform
  private camTransform: Transform
  private currentRotation: quat

  private onAwake(): void {
    this.transform = this.getSceneObject().getTransform()
    this.camTransform = this.camera.getTransform()

    this.currentRotation = this.transform.getWorldRotation()

    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  private update(): void {
    let fwd = this.camTransform.forward
    fwd = fwd.normalize()

    const up = this.camTransform.up
    const newRot = quat.lookAt(fwd, up)
    const lerpT = 1 - Math.pow(0.05, getDeltaTime())

    const change = quat.angleBetween(this.currentRotation, newRot)
    if (change > this.maxOffset) {
      this.currentRotation = quat.slerp(this.currentRotation, newRot, 1 - this.maxOffset / change)
    }

    this.currentRotation = quat.slerp(this.currentRotation, newRot, lerpT)
    this.transform.setWorldRotation(this.currentRotation)
  }

  public setCurrent(): void {
    this.currentRotation = this.transform.getWorldRotation()
  }
}
