import DefaultHeadlockController, {
  DefaultHeadlockConfig,
} from "./HeadlockController"

/**
 * This class provides functionality to lock the camera's position and rotation relative to the user's head movements. It allows configuration of distance, translation, and rotation settings to control how the camera follows the user's head.
 */
@component
export class Headlock extends BaseScriptComponent {
  private controller!: DefaultHeadlockController

  @ui.group_start("Headlock")
  @input
  @hint("How far away the target will be from the camera")
  private _distance: number = 50
  @ui.group_start("Head Translation")
  @input
  @hint(
    "If the camera will follow when the user moves their head along XZ-plane",
  )
  private _xzEnabled: boolean = true
  @input
  @hint(
    "How fast the camera will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow.",
  )
  private _xzEasing: number = 1
  @input
  @hint("If the camera will follow when the user moves their head along Y-axis")
  private _yEnabled: boolean = true
  @input
  @hint(
    "How fast the camera will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow.",
  )
  private _yEasing: number = 1
  @input
  @hint(
    "The magnitude of change needed to activate a translation for the target to follow the camera.",
  )
  @ui.group_end
  private _translationBuffer: number = 0
  @ui.group_start("Head Rotation")
  @input
  @hint(
    "If the camera will NOT follow when the user moves their head along the pitch-axis (looking up/down)",
  )
  private _lockedPitch: boolean = true
  @input
  @hint(
    "How fast the camera will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow.",
  )
  private _pitchEasing: number = 1
  @input
  @hint(
    "How many degrees of offset from the center point should the target sit",
  )
  private _pitchOffsetDegrees: number = 0
  @input
  @hint(
    "How many degrees of leeway along each direction (up/down) before change starts to occur",
  )
  private _pitchBufferDegrees: number = 0
  @input
  @hint(
    "If the camera will follow when the user moves their head along the yaw-axis (looking left/right)",
  )
  private _lockedYaw: boolean = true
  @input
  @hint(
    "How fast the camera will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow.",
  )
  private _yawEasing: number = 1
  @input
  @hint(
    "How many degrees of offset from the center point should the target sit",
  )
  private _yawOffsetDegrees: number = 0
  @input
  @hint(
    "How many degrees of leeway along each direction (left/right) before change starts to occur",
  )
  @ui.group_end
  @ui.group_end
  private _yawBufferDegrees: number = 0

  onAwake(): void {
    const headlockConfig: DefaultHeadlockConfig = {
      script: this,
      target: this.getSceneObject(),
      distance: this.distance,
      xzEnabled: this.xzEnabled,
      xzEasing: this.xzEasing,
      yEnabled: this.yEnabled,
      yEasing: this.yEasing,
      translationBuffer: this.translationBuffer,
      lockedPitch: this.lockedPitch,
      pitchEasing: this.pitchEasing,
      pitchOffsetDegrees: this.pitchOffsetDegrees,
      pitchBufferDegrees: this.pitchBufferDegrees,
      lockedYaw: this.lockedYaw,
      yawEasing: this.yawEasing,
      yawOffsetDegrees: this.yawOffsetDegrees,
      yawBufferDegrees: this.yawBufferDegrees,
      headlockComponent: this,
    }

    this.controller = new DefaultHeadlockController(headlockConfig)
  }
  /**
   * Snaps the object to its exact desired position, regardless of easing, unlocks, buffers, etc. Should be used after modifying values that affect the desired position (such as offset, distance) to snap the object into place without having a strange path.
   */
  snapToOffsetPosition = (): void => {
    this.controller.resetPosition()
  }
  /**
   * Get how far the SceneObject will be from the user.
   */
  get distance(): number {
    return this._distance
  }

  /**
   * Set how far the SceneObject will be from the user.
   */
  set distance(distance: number) {
    if (distance === this._distance) {
      return
    }
    this._distance = distance
    this.controller.distance = distance
  }

  /**
   * Get if the camera will follow when the user moves their head along XZ-plane. For most cases, this should stay enabled.
   */
  get xzEnabled(): boolean {
    return this._xzEnabled
  }

  /**
   * Sets if the camera will follow when the user moves their head along XZ-plane. For most cases, this should stay enabled.
   */
  set xzEnabled(enabled: boolean) {
    if (enabled === this._xzEnabled) {
      return
    }
    this._xzEnabled = enabled
    this.controller.xzEnabled = enabled
  }

  /**
   * Get how fast the camera will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow.
   */
  get xzEasing(): number {
    return this._xzEasing
  }

  /**
   * Set how fast the camera will follow along the XZ-plane, 0.1 for delayed follow, 1 for instant follow.
   */
  set xzEasing(easing: number) {
    if (easing === this._distance) {
      return
    }
    this._xzEasing = easing
    this.controller.xzEasing = easing
  }

  /**
   * Get if the camera will follow when the user moves their head along Y-axis. For most cases, this should stay enabled.
   */
  get yEnabled(): boolean {
    return this._yEnabled
  }

  /**
   * Set if the camera will follow when the user moves their head along Y-axis. For most cases, this should stay enabled.
   */
  set yEnabled(enabled: boolean) {
    if (enabled === this._yEnabled) {
      return
    }
    this._yEnabled = enabled
    this.controller.yEnabled = enabled
  }

  /**
   * Get how fast the camera will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow.
   */
  get yEasing(): number {
    return this._yEasing
  }

  /**
   * Set how fast the camera will follow along the Y-axis, 0.1 for delayed follow, 1 for instant follow.
   */
  set yEasing(easing: number) {
    if (easing === this._yEasing) {
      return
    }
    this._yEasing = easing
    this.controller.yEasing = easing
  }

  /**
   * Get the magnitude of change (in centimeters) needed to activate a translation for the target to follow the user's head translation.
   */
  get translationBuffer(): number {
    return this._translationBuffer
  }

  /**
   * Set the magnitude of change (in centimeters) needed to activate a translation for the target to follow the user's head translation. To keep the SceneObject from 'wobbling' when the user has an unstable head, a small buffer is recommended rather than 0.
   */
  set translationBuffer(buffer: number) {
    if (buffer === this._translationBuffer) {
      return
    }
    this._translationBuffer = buffer
    this.controller.translationBuffer = buffer
  }

  /**
   * Get if the camera will follow when the user moves their head along the pitch-axis (looking up/down)
   */
  get lockedPitch(): boolean {
    return this._lockedPitch
  }

  /**
   * Set if the camera will follow when the user moves their head along the pitch-axis (looking up/down)
   */
  set lockedPitch(locked: boolean) {
    if (locked === this._lockedPitch) {
      return
    }
    this._lockedPitch = locked
    this.controller.unlockPitch = !locked
  }

  /**
   * Get how many degrees of offset from the center point should the target sit. Positive values place the element below the center.
   */
  get pitchOffsetDegrees(): number {
    return this._pitchOffsetDegrees
  }

  /**
   * Set how many degrees of offset from the center point should the target sit. Positive values place the element below the center.
   */
  set pitchOffsetDegrees(degrees: number) {
    if (degrees === this._pitchOffsetDegrees) {
      return
    }
    this._pitchOffsetDegrees = degrees
    this.controller.pitchOffsetDegrees = degrees
  }

  /**
   * Get how fast the camera will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow.
   */
  get pitchEasing(): number {
    return this._pitchEasing
  }

  /**
   * Set how fast the camera will follow along the pitch-axis, 0.1 for delayed follow, 1 for instant follow.
   */
  set pitchEasing(easing: number) {
    if (easing === this._pitchEasing) {
      return
    }
    this._pitchEasing = easing
    this.controller.pitchEasing = easing
  }

  /**
   * Get how many degrees of leeway along each direction (up/down) before change starts to occur.
   */
  get pitchBufferDegrees(): number {
    return this._pitchBufferDegrees
  }

  /**
   * Set how many degrees of leeway along each direction (up/down) before change starts to occur.
   */
  set pitchBufferDegrees(degrees: number) {
    if (degrees === this._pitchBufferDegrees) {
      return
    }
    this._pitchBufferDegrees = degrees
    this.controller.pitchBufferDegrees = degrees
  }

  /**
   * Get if the camera will follow when the user moves their head along the yaw-axis (looking left/right)
   */
  get lockedYaw(): boolean {
    return this._lockedYaw
  }

  /**
   * Set if the camera will follow when the user moves their head along the yaw-axis (looking left/right)
   */
  set lockedYaw(locked: boolean) {
    if (locked === this._lockedYaw) {
      return
    }
    this._lockedYaw = locked
    this.controller.unlockYaw = !locked
  }

  /**
   * Get how many degrees of offset from the center point should the target sit. Positive values place the element to the left.
   */
  get yawOffsetDegrees(): number {
    return this._yawOffsetDegrees
  }

  /**
   * Set how many degrees of offset from the center point should the target sit. Positive values place the element to the left.
   */
  set yawOffsetDegrees(degrees: number) {
    if (degrees === this._yawOffsetDegrees) {
      return
    }
    this._yawOffsetDegrees = degrees
    this.controller.yawOffsetDegrees = degrees
  }

  /**
   * Get how fast the camera will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow.
   */
  get yawEasing(): number {
    return this._yawEasing
  }

  /**
   * Set how fast the camera will follow along the yaw-axis, 0.1 for delayed follow, 1 for instant follow.
   */
  set yawEasing(easing: number) {
    if (easing === this._yawEasing) {
      return
    }
    this._yawEasing = easing
    this.controller.yawEasing = easing
  }

  /**
   * Get how many degrees of leeway along each direction (left/right) before change starts to occur.
   */
  get yawBufferDegrees(): number {
    return this._yawBufferDegrees
  }

  /**
   * Set how many degrees of leeway along each direction (left/right) before change starts to occur.
   */
  set yawBufferDegrees(degrees: number) {
    if (degrees === this._yawBufferDegrees) {
      return
    }
    this._yawBufferDegrees = degrees
    this.controller.yawBufferDegrees = degrees
  }
}
