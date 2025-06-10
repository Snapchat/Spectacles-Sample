@component
export class SetToGround extends BaseScriptComponent {
  private transform: Transform

  @input private targetHorizontal: SceneObject
  @input private targetVertical: SceneObject
  @input private groundDisplacement = -130

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.transform = this.getSceneObject().getTransform()
      this.snapYFollow()
    })
    this.createEvent("OnEnableEvent").bind(() => {
      this.snapYFollow()
    })
  }

  private snapYFollow(): void {
    const worldPosition = this.transform.getWorldPosition()
    const targetPositionHorizontal = this.targetHorizontal.getTransform().getWorldPosition()
    const targetPositionVertical = this.targetVertical.getTransform().getWorldPosition()
    worldPosition.x = targetPositionHorizontal.x
    worldPosition.y = this.groundDisplacement + targetPositionVertical.y
    worldPosition.z = targetPositionHorizontal.z
    this.transform.setWorldPosition(worldPosition)
  }
}
