import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {clamp, smoothDamp, smoothDampAngle} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"
import {validate} from "SpectaclesInteractionKit.lspkg/Utils/validate"
import {MapComponent} from "../MapComponent/Scripts/MapComponent"
import {makeTween} from "../MapComponent/Scripts/MapUtils"
import {TWEEN_DURATION} from "./MapUIController"

const CONTAINER_SIZE_MINI = new vec2(10, 10)
const CONTAINER_SIZE_FULL = new vec2(54.0, 54.0)
const CONTAINER_DISTANCE_MINI = 130
const CONTAINER_DISTANCE_FULL = 160

@component
export class MapContainerController extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent

  @input
  private translationXTime: number = 1
  @input
  private translationYTime: number = 0.35
  @input
  private translationZTime: number = 0.35
  @input
  private rotationTime: number = 0.55
  @input
  private minFollowDistance: number = 50
  @input
  private maxFollowDistance: number = 160

  private container: ContainerFrame
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher

  private containerYOffset: number = 0
  private cameraTransform: Transform

  private fieldOfView: number = 26
  private visibleWidth: number = 20
  private minElevation: number = -40
  private maxElevation: number = 40
  private target: vec3 // cylindrical coords of where the follower wants to be
  private velocity: vec3 // current velocity of follower in cylindrical space
  private omega: number // current rotational velocity of the follower's heading
  private heading: number // current direction the follower is facing in world space, with -z being 0
  private initialRot: quat // original orientation of the follower that the dynamic heading is applied to
  private containerTransform: Transform
  private dragging: boolean // to reposition the follow position, the manipulator will turn this on then back off

  private tweenCancelFunction: CancelFunction

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
    const updateEvent = this.updateDispatcher.createUpdateEvent("UpdateEvent")
    updateEvent.bind(this.onUpdate.bind(this))
  }

  private onStart() {
    this.container = this.sceneObject.getComponent(ContainerFrame.getTypeName())

    this.container.setIsFollowing(this.mapComponent.startedAsMiniMap)

    this.container.followButton.onTrigger.add(this.handleFollowButtonTrigger.bind(this))

    this.mapComponent.onMiniMapToggled.add(this.handleMiniMapToggled.bind(this))

    this.cameraTransform = WorldCameraFinderProvider.getInstance().getTransform()
    this.containerYOffset = this.container.getWorldPosition().y - this.cameraTransform.getWorldPosition().y

    this.containerTransform = this.container.parentTransform

    this.initializeSmoothFollow()
  }

  private onUpdate() {
    if (!this.container.isFollowing) {
      return
    }

    this.updateSmoothFollow()
  }

  private initializeSmoothFollow() {
    this.target = vec3.zero()
    this.velocity = vec3.zero()
    this.omega = 0
    this.heading = 0
    this.dragging = false
    this.initialRot = this.containerTransform.getLocalRotation()
    this.heading = this.cameraHeading

    this.worldRot = quat.angleAxis(this.heading, vec3.up()).multiply(this.initialRot)
    this.resize(this.container.innerSize.x + this.container.border * 2 + this.container.constantPadding.x)

    this.container.onTranslationStart.add(this.startDragging.bind(this))
    this.container.onTranslationEnd.add(this.finishDragging.bind(this))
  }

  private updateSmoothFollow() {
    if (!this.dragging) {
      const pos = this.cartesianToCylindrical(this.worldToBody(this.worldPos))

      // Setting the y to follow the camera so that it can handle elevation changes
      const currentY = this.worldPos.y
      const targetY = this.cameraTransform.getWorldPosition().y + this.containerYOffset
      let newY

      ;[pos.x, this.velocity.x] = smoothDamp(
        pos.x,
        this.target.x,
        this.velocity.x,
        this.translationXTime,
        getDeltaTime()
      )
      ;[newY, this.velocity.y] = smoothDamp(currentY, targetY, this.velocity.y, this.translationYTime, getDeltaTime())
      ;[pos.z, this.velocity.z] = smoothDamp(
        pos.z,
        this.target.z,
        this.velocity.z,
        this.translationZTime,
        getDeltaTime()
      )

      const worldXZPos = this.bodyToWorld(this.cylindricalToCartesian(pos))
      this.worldPos = new vec3(worldXZPos.x, newY, worldXZPos.z)
      ;[this.heading, this.omega] = smoothDampAngle(
        this.heading,
        this.cameraHeading,
        this.omega,
        this.rotationTime,
        getDeltaTime()
      )
      // force billboard
      this.worldRot = quat.lookAt(this.cameraPos.sub(this.worldPos).normalize(), vec3.up()).multiply(this.initialRot)
    }
  }

  private handleMiniMapToggled(isMiniMap: boolean) {
    if (this.tweenCancelFunction !== undefined) {
      this.tweenCancelFunction()
      this.tweenCancelFunction = undefined
    }

    const containerWorldPosition: vec3 = this.containerTransform.getWorldPosition()

    if (isMiniMap) {
      this.mapComponent.centerMap()

      const targetWorldPosition: vec3 = containerWorldPosition
        .sub(this.cameraPos)
        .normalize()
        .uniformScale(CONTAINER_DISTANCE_MINI)
        .add(this.cameraPos)

      this.tweenCancelFunction = makeTween((t) => {
        this.container.innerSize = vec2.lerp(CONTAINER_SIZE_FULL, CONTAINER_SIZE_MINI, t)

        this.containerTransform.setWorldPosition(vec3.lerp(containerWorldPosition, targetWorldPosition, t))

        if (t > 0.9999) {
          this.container.setIsFollowing(true)
          this.clampPosition()
        }
      }, TWEEN_DURATION)
    } else {
      this.container.setIsFollowing(false)

      const targetWorldPosition: vec3 = containerWorldPosition
        .sub(this.cameraPos)
        .normalize()
        .uniformScale(CONTAINER_DISTANCE_FULL)
        .add(this.cameraPos)

      this.tweenCancelFunction = makeTween((t) => {
        this.container.innerSize = vec2.lerp(CONTAINER_SIZE_MINI, CONTAINER_SIZE_FULL, t)
        this.containerTransform.setWorldPosition(vec3.lerp(containerWorldPosition, targetWorldPosition, t))
      }, TWEEN_DURATION)
    }
  }

  private handleFollowButtonTrigger() {
    this.clampPosition()
  }

  startDragging(): void {
    this.dragging = true
  }

  finishDragging(): void {
    this.dragging = false
    this.clampPosition()
  }

  resize(visibleWidth: number): void {
    this.visibleWidth = visibleWidth
    this.clampPosition()
  }

  private clampPosition(): void {
    // the initial goal of the follower is whereever it is relative to the
    // camera when the component gets enabled. the grab bar works by disabling
    // this component when grabbed, and reenables it when let go.

    if (this.dragging) return // skip while actively scaling

    this.target = this.cartesianToCylindrical(this.worldToBody(this.worldPos))

    this.target.z = clamp(this.target.z, this.minFollowDistance, this.maxFollowDistance)

    this.target.z = Math.max(
      this.target.z,
      (1.1 * this.visibleWidth) / 2 / Math.tan((this.fieldOfView / 2) * MathUtils.DegToRad)
    ) // handle very wide panels

    this.target.y = clamp(this.target.y, this.minElevation, this.maxElevation)
    const halfFov = this.halfFov
    this.target.x = clamp(this.target.x, -halfFov, halfFov)
    this.velocity = vec3.zero()
    this.omega = 0
  }

  private get halfFov(): number {
    const dist = new vec2(this.target.y, this.target.z).length
    return Math.atan(
      (Math.tan((this.fieldOfView / 2) * MathUtils.DegToRad) * dist - this.visibleWidth / 2) / this.target.z
    )
  }

  private cartesianToCylindrical(v: vec3): vec3 {
    return new vec3(Math.atan2(-v.x, -v.z), v.y, Math.sqrt(v.x * v.x + v.z * v.z))
  }

  private cylindricalToCartesian(v: vec3): vec3 {
    return new vec3(v.z * -Math.sin(v.x), v.y, v.z * -Math.cos(v.x))
  }

  private worldToBody(v: vec3): vec3 {
    return quat.angleAxis(-this.cameraHeading, vec3.up()).multiplyVec3(v.sub(this.cameraPos))
  }

  private bodyToWorld(v: vec3): vec3 {
    return quat.angleAxis(this.cameraHeading, vec3.up()).multiplyVec3(v).add(this.cameraPos)
  }

  private get cameraHeading(): number {
    const forward = this.cameraTransform.getWorldTransform().multiplyDirection(new vec3(0, 0, -1))
    return Math.atan2(-forward.x, -forward.z)
  }

  private get cameraPos(): vec3 {
    return this.cameraTransform.getWorldPosition()
  }

  private get worldRot(): quat {
    validate(this.containerTransform)
    return this.containerTransform.getWorldRotation()
  }

  private set worldRot(value: quat) {
    validate(this.containerTransform)
    this.containerTransform.setWorldRotation(value)
  }

  private get worldPos(): vec3 {
    validate(this.containerTransform)
    return this.containerTransform.getWorldPosition()
  }

  private set worldPos(value: vec3) {
    validate(this.containerTransform)
    this.containerTransform.setWorldPosition(value)
  }
}
