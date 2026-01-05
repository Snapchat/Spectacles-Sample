import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {StorageProperty} from "SpectaclesSyncKit.lspkg/Core/StorageProperty"
import {SyncEntity} from "SpectaclesSyncKit.lspkg/Core/SyncEntity"

@component
export class AirHockeyPuck extends BaseScriptComponent {
  @input
  controllerJS: ScriptComponent

  body: BodyComponent = this.getSceneObject().getComponent("Physics.BodyComponent")
  transform: Transform = this.getTransform()
  syncEntity: SyncEntity
  isResetting: boolean = false
  sessionController: SessionController = SessionController.getInstance()

  private positionProp = StorageProperty.manualVec3("position", this.transform.getLocalPosition())
  private velocityProp = StorageProperty.manualVec3("velocity", vec3.zero())
  private timestampProp = StorageProperty.manualDouble("lastChanged", -1)

  MAX_ADDED_VELOCITY: number = 20

  randomRange(min: number, max: number) {
    return min + Math.random() * (max - min)
  }

  randomChoice(args: number[]) {
    return args[Math.floor(Math.random() * args.length)]
  }

  extrapolatePos(position: vec3, velocity: vec3, initialTime: number, currentTime: number) {
    const elapsedTime = currentTime - initialTime
    return position.add(velocity.uniformScale(elapsedTime))
  }

  onCollisionEnter(collisionArgs) {
    const collision = collisionArgs.collision
    const otherObj = collision.collider.getSceneObject()

    // Collision with wall
    if (otherObj.name.startsWith("Wall")) {
      const normal = collision.contacts[0].normal
      const worldToLocal = this.transform.getInvertedWorldTransform()
      const relativePos = worldToLocal.multiplyDirection(normal)
      const curVelocity = this.velocityProp.currentOrPendingValue

      if (Math.abs(relativePos.x) > 0.005) {
        curVelocity.x *= -1
      }

      if (Math.abs(relativePos.z) > 0.005) {
        curVelocity.z *= -1
      }

      this.updateMovementState(this.transform.getLocalPosition(), curVelocity)

      return
    }

    // Collision with paddle
    if (otherObj.name.startsWith("Paddle")) {
      let paddleVelocity = this.velocityProp.currentOrPendingValue
      paddleVelocity.z *= -1

      const otherVel = collision.collider.velocity
      const paddleWorldToLocal = this.transform.getInvertedWorldTransform()
      const otherVelLocal = paddleWorldToLocal.multiplyDirection(otherVel).normalize().uniformScale(otherVel.length)

      paddleVelocity.x += Math.max(-this.MAX_ADDED_VELOCITY, Math.min(otherVelLocal.x, this.MAX_ADDED_VELOCITY))
      paddleVelocity = paddleVelocity.uniformScale(1.1)

      this.updateMovementState(this.transform.getLocalPosition(), paddleVelocity)
    }
  }

  onUpdate() {
    if (!this.syncEntity.isSetupFinished) return

    // Update puck position
    const startTime = this.timestampProp.currentOrPendingValue
    const newPos = this.extrapolatePos(
      this.positionProp.currentOrPendingValue,
      this.velocityProp.currentOrPendingValue,
      startTime,
      this.sessionController.getServerTimeInSeconds()
    )
    newPos.y = 0
    this.transform.setLocalPosition(newPos)
    this.transform.setLocalRotation(quat.quatIdentity())
  }

  resetPuck() {
    if (this.isResetting) return

    this.isResetting = true
    this.transform.setLocalPosition(vec3.zero())
    this.updateMovementState(vec3.zero(), vec3.zero())

    const delayEvent = this.createEvent("DelayedCallbackEvent")
    delayEvent.bind(() => {
      print("Resetting puck")
      this.removeEvent(delayEvent)
      this.isResetting = false
      this.startMovement()
    })
    delayEvent.reset(1.5)
  }

  startMovement() {
    print("random choice: " + this.randomChoice([-1, 1]))
    const initVelocity = new vec3(this.randomRange(-20, 20), 0, this.randomChoice([-1, 1]) * 40)
    this.updateMovementState(this.transform.getLocalPosition(), initVelocity)
  }

  stopMovement() {
    print("Stopping puck movement")
    this.updateMovementState(this.transform.getLocalPosition(), vec3.zero())
  }

  updateMovementState(position: vec3, velocity: vec3) {
    this.positionProp.setPendingValue(position)
    this.velocityProp.setPendingValue(velocity)
    this.timestampProp.setPendingValue(this.sessionController.getServerTimeInSeconds())
  }

  onAwake() {
    if (this.controllerJS.getSceneObject().enabled) {
      print("Javascript controller is enabled, skipping initialization")
      return
    }
    this.syncEntity = new SyncEntity(this, null, false)
    this.syncEntity.addStorageProperty(this.positionProp)
    this.syncEntity.addStorageProperty(this.velocityProp)
    this.syncEntity.addStorageProperty(this.timestampProp)
    this.syncEntity.notifyOnReady(() => {
      this.body.onCollisionEnter.add((e) => this.onCollisionEnter(e))
    })

    this.body.overlapFilter.includeStatic = true

    this.createEvent("UpdateEvent").bind(() => this.onUpdate())

    print("Puck initialized")
  }
}
