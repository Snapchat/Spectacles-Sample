import {LocatedObject} from "./LocatedObject"

/**
 * Animates appearing and disappearing through scaling.
 */
@component
export class ScaleInLocatedObject extends BaseScriptComponent implements LocatedObject {
  @input
  @allowUndefined
  @hint("Will be enabled the first time it is activated")
  contentSceneObject: SceneObject

  @input
  private animationSpeed: number = 0.0
  private targetScaleIn: number = 0.0

  onAwake() {
    const t = this.contentSceneObject.getTransform()
    this.targetScaleIn = t.getLocalScale().x
    t.setLocalScale(new vec3(0, 0, 0))

    this.createEvent("UpdateEvent").bind(() => {
      if (this.animationSpeed !== 0.0) {
        const t = this.contentSceneObject.getTransform()
        let currScale = t.getLocalScale().x + this.animationSpeed

        if (currScale < 0) {
          currScale = 0
          this.animationSpeed = 0
        } else if (currScale > this.targetScaleIn) {
          currScale = this.targetScaleIn
          this.animationSpeed = 0
        }

        t.setLocalScale(new vec3(currScale, currScale, currScale))
      }
    })
  }

  public activate(): void {
    if (this.contentSceneObject) {
      if (!this.contentSceneObject.enabled) {
        this.contentSceneObject.enabled = true
      }
    }

    this.animationSpeed = this.targetScaleIn * 0.05
  }

  public deactivate(): void {
    this.animationSpeed = this.targetScaleIn * -0.05
  }

  public localize() {}
}
