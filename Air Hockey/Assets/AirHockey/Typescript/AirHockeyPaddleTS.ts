import {StorageProperty} from "SpectaclesSyncKit.lspkg/Core/StorageProperty"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"

@component
export class AirHockeyPaddle extends BaseScriptComponent {
  @input
  controllerJS: ScriptComponent

  transform: Transform = this.getTransform()
  body: BodyComponent = this.getSceneObject().getComponent("Physics.BodyComponent")
  syncEntity: SyncEntity

  getXPosition() {
    return this.transform.getLocalPosition().x
  }

  getXVelocity() {
    const velocity = this.body.velocity
    if (velocity.lengthSquared > 0.0001) {
      const worldToLocal = this.transform.getInvertedWorldTransform()
      const velLocal = worldToLocal.multiplyDirection(velocity).normalize().uniformScale(velocity.length)
      return velLocal.x
    } else {
      return 0
    }
  }

  setPosition(x: number) {
    const position = this.transform.getLocalPosition()
    position.x = x
    this.transform.setLocalPosition(position)
  }

  onAwake() {
    if (this.controllerJS.getSceneObject().enabled) {
      print("Javascript controller is enabled, skipping initialization")
      return
    }
    this.syncEntity = new SyncEntity(this)
    this.syncEntity.addStorageProperty(
      StorageProperty.autoFloat(
        "posX",
        () => this.getXPosition(),
        (x: number) => this.setPosition(x)
      )
    )
    print("Paddle initialized")
  }
}
