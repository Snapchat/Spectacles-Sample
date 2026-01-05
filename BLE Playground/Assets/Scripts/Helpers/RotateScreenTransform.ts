@component
export class RotateScreenTransform extends BaseScriptComponent {
  @input
  screenTransform: ScreenTransform

  private updateEvent: UpdateEvent
  private startRotateTime = 0

  onAwake() {
    this.updateEvent = this.createEvent("UpdateEvent")
    this.updateEvent.bind(() => this.onUpdate())
    this.updateEvent.enabled = false
  }

  onUpdate() {
    const rotation = quat.angleAxis(getTime() - this.startRotateTime, vec3.back())
    this.screenTransform.rotation = rotation
  }

  startRotate() {
    this.startRotateTime = getTime()
    this.updateEvent.enabled = true
  }

  endRotate() {
    this.updateEvent.enabled = false
    this.screenTransform.rotation = quat.quatIdentity()
  }
}
