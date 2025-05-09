import {setTimeout} from "../../../../Utils/debounce"
import {
  clamp,
  DegToRad,
  smoothDamp,
  smoothDampAngle,
} from "../../../../Utils/mathUtils"
import {validate} from "../../../../Utils/validate"
import {ContainerFrame} from "../ContainerFrame"

export class SmoothFollowOptions {
  public frame: ContainerFrame
  constructor(frame: ContainerFrame) {
    this.frame = frame
  }
}

/**
 * SmoothFollow is a body dynamic behavior which when applied to a scene object,
 * makes it stay in the same relative horizontal position and distance to the
 * user's field of view as they turn their head left and right and move around.
 * It doesn't affect the positioning of the scene object when the user looks up
 * and down or changes elevation. Interpolation is handled by a spring-damper
 * in cylindrical coordinates.
 */
export class SmoothFollow {
  private frame: ContainerFrame = this.options.frame
  private mainCamera: Camera = this.frame.worldCamera
  private cameraTransform: Transform = this.mainCamera.getTransform()
  private transform: Transform | undefined = this.frame.parentTransform
  private fieldOfView: number = 26
  private visibleWidth: number = 20
  private minDistance: number = 25
  private maxDistance: number = 110
  private minElevation: number = -40
  private maxElevation: number = 40
  private translationTime: number = 0.35
  private rotationTime: number = 0.55

  private target: vec3 // cylindrical coords of where the follower wants to be
  private velocity: vec3 // current velocity of follower in cylindrical space
  private omega: number // current rotational velocity of the follower's heading
  private heading: number // current direction the follower is facing in world space, with -z being 0
  private initialRot: quat // original orientation of the follower that the dynamic heading is applied to
  private dragging: boolean // to reposition the follow position, the manipulator will turn this on then back off

  constructor(private options: SmoothFollowOptions) {
    validate(this.transform)

    this.target = vec3.zero()
    this.velocity = vec3.zero()
    this.omega = 0
    this.heading = 0
    this.dragging = false
    this.initialRot = this.transform.getLocalRotation()
    this.heading = this.cameraHeading

    this.worldRot = quat
      .angleAxis(this.heading, vec3.up())
      .multiply(this.initialRot)
    this.resize(
      this.frame.innerSize.x +
        this.frame.border * 2 +
        this.frame.constantPadding.x
    )
    setTimeout(() => {
      this.clampPosition()
    }, 32)
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

    this.target.z = clamp(this.target.z, this.minDistance, this.maxDistance)
    this.target.z = Math.max(
      this.target.z,
      (1.1 * this.visibleWidth) /
        2 /
        Math.tan((this.fieldOfView / 2) * DegToRad)
    ) // handle very wide panels
    this.target.y = clamp(this.target.y, this.minElevation, this.maxElevation)
    const dist = new vec2(this.target.y, this.target.z).length
    const halfFov = Math.atan(
      (Math.tan((this.fieldOfView / 2) * DegToRad) * dist -
        this.visibleWidth / 2) /
        this.target.z
    )
    this.target.x = clamp(this.target.x, -halfFov, halfFov)
    this.velocity = vec3.zero()
    this.omega = 0
  }

  onUpdate() {
    if (!this.dragging) {
      const pos = this.cartesianToCylindrical(this.worldToBody(this.worldPos))

      // y is special because target elevation is leashed between a range of values,
      // rather <than how x and z work where they are leashed to a single value.
      this.target.y = clamp(pos.y, this.minElevation, this.maxElevation)
      ;[pos.x, this.velocity.x] = smoothDamp(
        pos.x,
        this.target.x,
        this.velocity.x,
        this.translationTime,
        getDeltaTime()
      )
      ;[pos.y, this.velocity.y] = smoothDamp(
        pos.y,
        this.target.y,
        this.velocity.y,
        this.translationTime,
        getDeltaTime()
      )
      ;[pos.z, this.velocity.z] = smoothDamp(
        pos.z,
        this.target.z,
        this.velocity.z,
        this.translationTime,
        getDeltaTime()
      )
      this.worldPos = this.bodyToWorld(this.cylindricalToCartesian(pos))
      ;[this.heading, this.omega] = smoothDampAngle(
        this.heading,
        this.cameraHeading,
        this.omega,
        this.rotationTime,
        getDeltaTime()
      )
      // force billboard
      this.worldRot = quat
        .lookAt(this.cameraPos.sub(this.worldPos).normalize(), vec3.up())
        .multiply(this.initialRot)
    }
  }

  private cartesianToCylindrical(v: vec3): vec3 {
    return new vec3(
      Math.atan2(-v.x, -v.z),
      v.y,
      Math.sqrt(v.x * v.x + v.z * v.z)
    )
  }

  private cylindricalToCartesian(v: vec3): vec3 {
    return new vec3(v.z * -Math.sin(v.x), v.y, v.z * -Math.cos(v.x))
  }

  private worldToBody(v: vec3): vec3 {
    return quat
      .angleAxis(-this.cameraHeading, vec3.up())
      .multiplyVec3(v.sub(this.cameraPos))
  }

  private bodyToWorld(v: vec3): vec3 {
    return quat
      .angleAxis(this.cameraHeading, vec3.up())
      .multiplyVec3(v)
      .add(this.cameraPos)
  }

  private get cameraHeading(): number {
    const forward = this.cameraTransform
      .getWorldTransform()
      .multiplyDirection(new vec3(0, 0, -1))
    return Math.atan2(-forward.x, -forward.z)
  }

  private get cameraPos(): vec3 {
    return this.cameraTransform.getWorldPosition()
  }

  private get worldRot(): quat {
    validate(this.transform)
    return this.transform.getWorldRotation()
  }

  private set worldRot(value: quat) {
    validate(this.transform)
    this.transform.setWorldRotation(value)
  }

  private get worldPos(): vec3 {
    validate(this.transform)
    return this.transform.getWorldPosition()
  }

  private set worldPos(value: vec3) {
    validate(this.transform)
    this.transform.setWorldPosition(value)
  }
}
