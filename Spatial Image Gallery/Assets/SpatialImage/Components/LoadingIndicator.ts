/**
 * This script fills a loading indicator to represent progress while a task is
 * completed.
 *
 * @version 1.0.0
 */
@component
export class LoadingIndicator extends BaseScriptComponent {
  @input
  private progressionSpeed: number = 0.3

  private material: Material
  private progress: number = 0

  /**
   * Allows custom start and stop functions to be added to the indicator.
   */
  public checkProgressing?: () => boolean

  onAwake() {
    this.material = this.sceneObject.getComponent("Component.RenderMeshVisual").mainMaterial

    this.createEvent("OnEnableEvent").bind(() => {
      this.progress = 0
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  /**
   * Resets the progression to 0.
   */
  public reset(): void {
    this.progress = 0
  }

  private update(): void {
    if (!this.checkProgressing || this.checkProgressing()) {
      this.progress += getDeltaTime() * this.progressionSpeed
    } else {
      this.progress = 0.05
    }
    this.material.mainPass.progress_value = Math.min(this.progress, 0.95)
  }
}
