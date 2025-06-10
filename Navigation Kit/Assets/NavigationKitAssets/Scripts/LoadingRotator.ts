import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"

/**
 * Animates a two-texture loading swirly.
 */
@component
export class LoadingRotator extends BaseScriptComponent {
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher

  @input private outerImage: SceneObject
  @input private innerImage: SceneObject
  @input private outerSpeed = 0.3
  @input private innerSpeed = -0.2

  private onAwake(): void {
    this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  private update(): void {
    this.updateRotation(this.outerImage.getTransform(), this.outerSpeed)
    this.updateRotation(this.innerImage.getTransform(), this.innerSpeed)
  }

  private updateRotation(transform: Transform, speed: number): void {
    const rotation = transform.getLocalRotation()
    const appliedRotation = quat.fromEulerAngles(0, 0, speed * getDeltaTime())
    const newRotation = rotation.multiply(appliedRotation)
    transform.setLocalRotation(newRotation)
  }
}
