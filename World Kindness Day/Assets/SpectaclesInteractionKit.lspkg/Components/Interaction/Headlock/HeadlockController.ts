import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {Headlock} from "./Headlock"
import HeadlockRotationCalculator from "./HeadlockRotationCalculator"
import HeadlockTranslationCalculator from "./HeadlockTranslationCalculator"

export enum RotationAxis {
  Pitch,
  Yaw
}

export type DefaultHeadlockConfig = {
  script: ScriptComponent
  target: SceneObject
  distance: number
  duration?: number
  xzEnabled?: boolean
  xzEasing?: number
  yEnabled?: boolean
  yEasing?: number
  translationBuffer?: number
  lockedPitch?: boolean
  pitchEasing?: number
  pitchOffsetDegrees?: number
  pitchBufferDegrees?: number
  lockedYaw?: boolean
  yawEasing?: number
  yawOffsetDegrees?: number
  yawBufferDegrees?: number
  headlockComponent: Headlock
}

const rotationAxes = [RotationAxis.Pitch, RotationAxis.Yaw]

const DEFAULT_DURATION = 0.033

export default class DefaultHeadlockController {
  private worldCameraProvider = WorldCameraFinderProvider.getInstance()

  // When true, the target will be moved according to the user's gaze.
  private headlocked: boolean

  // The radius of the sphere on which the target rotates on.
  private _distance: number

  // The center of the sphere that the target sits on will be controlled separately.
  private translationCalculator: HeadlockTranslationCalculator

  // The angles along each axes will be calculated separately
  private pitchCalculator: HeadlockRotationCalculator
  private yawCalculator: HeadlockRotationCalculator

  // The target will be the SceneObject to rotate.
  private target: SceneObject
  private targetTransform: Transform

  // The target will move along a sphere according to the camera's rotation, maintaining the same pitch / yaw offset wherever the user looks.
  private cameraTransform: Transform = this.worldCameraProvider.getTransform()

  private updateEvent: SceneEvent
  private enableEvent: SceneEvent

  private headlockComponent: Headlock

  constructor(private config: DefaultHeadlockConfig) {
    this.target = config.target
    this.targetTransform = this.target.getTransform()
    this.headlockComponent = config.headlockComponent

    this.headlocked = true

    this._distance = config.distance

    // Set up the translation calculator to center the sphere on the user's head with configurable behavior.
    this.translationCalculator = new HeadlockTranslationCalculator({
      center: this.cameraTransform.getWorldPosition(),
      duration: config.duration ?? DEFAULT_DURATION,
      xzEnabled: config.xzEnabled ?? true,
      xzEasing: config.xzEasing ?? 1,
      yEnabled: config.yEnabled ?? true,
      yEasing: config.yEasing ?? 1,
      translationBuffer: config.translationBuffer ?? 0
    })

    // Set up the rotation calculators to rotate the target along the sphere about the axes with configurable behavior.
    this.pitchCalculator = new HeadlockRotationCalculator({
      distance: this.distance,
      axis: RotationAxis.Pitch,
      duration: config.duration ?? DEFAULT_DURATION,
      axisEnabled: config.lockedPitch ?? true,
      axisEasing: config.pitchEasing ?? 1,
      axisOffsetRadians: MathUtils.DegToRad * (config.pitchOffsetDegrees ?? 0),
      axisBufferRadians: MathUtils.DegToRad * (config.pitchBufferDegrees ?? 0)
    })

    this.yawCalculator = new HeadlockRotationCalculator({
      distance: this.distance,
      axis: RotationAxis.Yaw,
      duration: config.duration ?? DEFAULT_DURATION,
      axisEnabled: config.lockedYaw ?? true,
      axisEasing: config.yawEasing ?? 1,
      axisOffsetRadians: MathUtils.DegToRad * (config.yawOffsetDegrees ?? 0),
      axisBufferRadians: MathUtils.DegToRad * (config.yawBufferDegrees ?? 0)
    })
    this.updateEvent = config.script.createEvent("UpdateEvent")
    this.enableEvent = config.script.createEvent("OnEnableEvent")

    this.updateEvent.bind(this.onUpdate.bind(this))

    // Whenever the script component or target object is re-enabled, reset the target to correct position.
    this.enableEvent.bind(this.resetPosition.bind(this))
    this.target.onEnabled.add(this.resetPosition.bind(this))

    this.resetPosition()
  }

  get distance(): number {
    return this._distance
  }
  set distance(distance: number) {
    this._distance = distance
    this.pitchCalculator.distance = distance
    this.yawCalculator.distance = distance
  }

  get xzEnabled(): boolean {
    return this.translationCalculator.xzEnable
  }
  set xzEnabled(enabled: boolean) {
    this.translationCalculator.xzEnable = enabled
  }

  get yEnabled(): boolean {
    return this.translationCalculator.yEnable
  }
  set yEnabled(enabled: boolean) {
    this.translationCalculator.yEnable = enabled
  }

  get xzEasing(): number {
    return this.translationCalculator.xzEasing
  }
  set xzEasing(easing: number) {
    this.translationCalculator.xzEasing = easing
  }

  get yEasing(): number {
    return this.translationCalculator.yEasing
  }
  set yEasing(easing: number) {
    this.translationCalculator.yEasing = easing
  }

  get translationBuffer(): number {
    return this.translationCalculator.translationBuffer
  }
  set translationBuffer(distance: number) {
    this.translationCalculator.translationBuffer = distance
  }

  get unlockPitch(): boolean {
    return !this.pitchCalculator.axisEnabled
  }
  set unlockPitch(unlocked: boolean) {
    this.pitchCalculator.axisEnabled = !unlocked
  }

  get pitchOffsetDegrees(): number {
    return MathUtils.RadToDeg * this.pitchCalculator.axisOffsetRadians
  }
  set pitchOffsetDegrees(offsetDegrees: number) {
    this.pitchCalculator.axisOffsetRadians = MathUtils.DegToRad * offsetDegrees
  }

  get pitchEasing(): number {
    return this.pitchCalculator.axisEasing
  }
  set pitchEasing(easing: number) {
    this.pitchCalculator.axisEasing = easing
  }

  get pitchBufferDegrees(): number {
    return MathUtils.RadToDeg * this.pitchCalculator.axisBufferRadians
  }
  set pitchBufferDegrees(bufferDegrees: number) {
    this.pitchCalculator.axisBufferRadians = MathUtils.DegToRad * bufferDegrees
  }

  get unlockYaw(): boolean {
    return !this.yawCalculator.axisEnabled
  }
  set unlockYaw(unlocked: boolean) {
    this.yawCalculator.axisEnabled = !unlocked
  }

  get yawOffsetDegrees(): number {
    return MathUtils.RadToDeg * this.yawCalculator.axisOffsetRadians
  }
  set yawOffsetDegrees(offsetDegrees: number) {
    this.yawCalculator.axisOffsetRadians = MathUtils.DegToRad * offsetDegrees
  }

  get yawEasing(): number {
    return this.yawCalculator.axisEasing
  }
  set yawEasing(easing: number) {
    this.yawCalculator.axisEasing = easing
  }

  get yawBufferDegrees(): number {
    return MathUtils.RadToDeg * this.yawCalculator.axisBufferRadians
  }
  set yawBufferDegrees(bufferDegrees: number) {
    this.yawCalculator.axisBufferRadians = MathUtils.DegToRad * bufferDegrees
  }

  // Returns a NON-NORMALIZED unit vector aligned with the line to the target from the sphere's center for rotation along the sphere.
  private getCenterToTargetVector() {
    return this.targetTransform.getWorldPosition().sub(this.translationCalculator.getCenter())
  }

  // Gets the direction in which the user is facing.
  private getFaceForwardVector() {
    return this.cameraTransform.back.normalize()
  }

  // Rotates the target about each enabled axis separately.
  private onUpdate(): void {
    // If headlocking is currently disabled, do not update the target.
    if (!this.headlocked) {
      return
    }

    // Move the sphere around the user's head and updates the target to maintain the same angle.
    const translationOffset = this.translationCalculator.updateCenter(this.cameraTransform.getWorldPosition())
    this.targetTransform.setWorldPosition(translationOffset.add(this.targetTransform.getWorldPosition()))

    // Rotate the target along the sphere to reach the desired offsets.
    for (const axis of rotationAxes) {
      let rotationOffset: vec3

      switch (axis) {
        // Head tilt is to be ignored for headlocking purposes, thus some vectors must be flattened on the XZ-plane if not already.
        case RotationAxis.Pitch:
          rotationOffset = this.pitchCalculator.getOffset(
            // The pitch axis is the user's X-axis if yaw is enabled, otherwise use the world's X-axis.
            this.headlockComponent.lockedYaw
              ? this.cameraTransform.left.projectOnPlane(vec3.up()).normalize() // the axis vectors depend on if the other axis is enabled e.g. yaw disabled means we always use a constant right vector for pitch
              : vec3.left(),
            this.getCenterToTargetVector(),
            vec3.up(),
            this.getFaceForwardVector(),
            this.cameraTransform.up
          )
          break
        case RotationAxis.Yaw:
          rotationOffset = this.yawCalculator.getOffset(
            // The yaw axis is the user's Y-axis projected onto a plane to prevent head-tilt from affecting positions if pitch is enabled, otherwise use the world's Y-axis.
            this.headlockComponent.lockedPitch
              ? this.cameraTransform.up.projectOnPlane(
                  new vec3(this.cameraTransform.left.x, 0, this.cameraTransform.left.z)
                )
              : vec3.up(),
            this.getCenterToTargetVector(),
            this.cameraTransform.right.projectOnPlane(vec3.up()),
            this.getFaceForwardVector()
          )
          break
        default:
          throw new Error(`Invalid axis: ${axis}`)
      }

      this.targetTransform.setWorldPosition(rotationOffset.add(this.targetTransform.getWorldPosition()))
    }
  }

  public setHeadlocked(headlocked: boolean) {
    this.headlocked = headlocked
  }

  public isHeadlocked(): boolean {
    return this.headlocked
  }

  // Place the target at correct position according to offsets.
  public resetPosition(): void {
    let offset = this.getFaceForwardVector().uniformScale(this.distance)
    const pitchQuaternion = quat.angleAxis(
      MathUtils.DegToRad * (this.headlockComponent.pitchOffsetDegrees ?? 0),
      vec3.left()
    )
    offset = pitchQuaternion.multiplyVec3(offset)
    const yawQuaternion = quat.angleAxis(MathUtils.DegToRad * (this.headlockComponent.yawOffsetDegrees ?? 0), vec3.up())
    offset = yawQuaternion.multiplyVec3(offset)
    this.targetTransform.setWorldPosition(this.cameraTransform.getWorldPosition().add(offset))
  }
}
