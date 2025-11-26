import {Interactor} from "../../../Core/Interactor/Interactor"
import BillboardController, {BillboardConfig, RotationAxis} from "./BillboardController"

/**
 * Billboard allows an object to rotate to face the camera.
 */
@component
export class Billboard extends BaseScriptComponent {
  private controller!: BillboardController

  @ui.group_start("Billboard")
  @hint("Settings to configure how this object rotates to face the camera.")
  /**
   * Enables pitch rotation of the object to face the camera. When enabled, the object rotates around its X-axis to
   * maintain camera orientation.
   */
  @input
  @hint(
    "Enables pitch rotation of the object to face the camera. When enabled, the object rotates around its X-axis to \
maintain camera orientation."
  )
  private _xAxisEnabled: boolean = false

  /**
   * Enables yaw rotation of the object to face the camera. When enabled, the object rotates around its Y-axis to
   * track camera position.
   */
  @input
  @hint(
    "Enables yaw rotation of the object to face the camera. When enabled, the object rotates around its Y-axis to \
track camera position."
  )
  private _yAxisEnabled: boolean = true

  /**
   * Enables roll rotation of the object to align with camera orientation. When enabled, the object rotates around
   * its Z-axis to match camera's up direction.
   */
  @input
  @hint(
    "Enables roll rotation of the object to align with camera orientation. When enabled, the object rotates around \
its Z-axis to match camera's up direction."
  )
  private _zAxisEnabled: boolean = false

  /**
   * Defines a threshold in degrees before rotation is applied for each axis. The object only rotates when the angle
   * between its orientation and the camera exceeds this buffer, preventing small unwanted movements. Larger values
   * create more stable objects that rotate less frequently.
   */
  @input
  @hint(
    "Defines a threshold in degrees before rotation is applied for each axis. The object only rotates when the angle \
between its orientation and the camera exceeds this buffer, preventing small unwanted movements. Larger values create \
more stable objects that rotate less frequently."
  )
  private _axisBufferDegrees: vec3 = new vec3(0, 0, 0)

  /**
   * Controls how fast the object rotates around each axis to follow camera movement. Configurable per axis (X,Y,Z)
   * where higher values (1.0) create instant following, while lower values (0.1) create a delayed, smoother follow
   * effect.
   */
  @input
  @hint(
    "Controls how fast the object rotates around each axis to follow camera movement. Configurable per axis (X,Y,Z) \
where higher values (1.0) create instant following, while lower values (0.1) create a delayed, smoother follow effect."
  )
  private _axisEasing: vec3 = new vec3(1, 1, 1)

  /**
   * @deprecated This property no longer changes the speed of the follow rotation. Use _axisEasing instead.
   */
  @input
  @hint("Deprecated. Please use the property Axis Easing to adjust the rotation speed")
  duration: number = 0.033

  @ui.group_end
  onAwake(): void {
    const billboardConfig: BillboardConfig = {
      script: this,
      target: this.getSceneObject(),
      xAxisEnabled: this._xAxisEnabled,
      yAxisEnabled: this._yAxisEnabled,
      zAxisEnabled: this._zAxisEnabled,
      axisBufferDegrees: this._axisBufferDegrees,
      axisEasing: this._axisEasing
    }
    this.controller = new BillboardController(billboardConfig)
  }

  /**
   * Immediately resets the SceneObject to the rotation according to inputs regardless of easing.
   */
  snapToOffsetRotation(): void {
    this.controller.resetRotation()
  }

  get targetTransform(): Transform {
    return this.controller.targetTransform
  }

  /**
   * @returns if the SceneObject billboards about the x-axis.
   */
  get xAxisEnabled(): boolean {
    return this._xAxisEnabled
  }

  /**
   * @param enabled - defines if the SceneObject billboards about the x-axis.
   */
  set xAxisEnabled(enabled: boolean) {
    if (enabled === this._xAxisEnabled) {
      return
    }
    this._xAxisEnabled = enabled
    this.controller.enableAxisRotation(RotationAxis.X, enabled)
  }

  /**
   * @returns if the SceneObject billboards about the y-axis.
   */
  get yAxisEnabled(): boolean {
    return this._yAxisEnabled
  }

  /**
   * @param enabled - defines if the SceneObject billboards about the y-axis.
   */
  set yAxisEnabled(enabled: boolean) {
    if (enabled === this._yAxisEnabled) {
      return
    }
    this._yAxisEnabled = enabled
    this.controller.enableAxisRotation(RotationAxis.Y, enabled)
  }

  /**
   * @returns if the SceneObject billboards about the z-axis.
   */
  get zAxisEnabled(): boolean {
    return this._zAxisEnabled
  }

  /**
   * @param enabled - defines if the SceneObject billboards about the z-axis.
   */
  set zAxisEnabled(enabled: boolean) {
    if (enabled === this._zAxisEnabled) {
      return
    }
    this._zAxisEnabled = enabled
    this.controller.enableAxisRotation(RotationAxis.Z, enabled)
  }

  /**
   * @param easing - the vector defining the easing for each axis. For instant follow, use easing = (1,1,1).
   */
  set axisEasing(easing: vec3) {
    if (easing.equal(this._axisEasing)) {
      return
    }
    this._axisEasing = easing
    this.controller.axisEasing = easing
  }

  /**
   * @returns the vector defining the easing for each axis.
   */
  get axisEasing(): vec3 {
    return this._axisEasing
  }

  /**
   * @param bufferDegrees - the vector defining the buffer for each axis.
   */
  set axisBufferDegrees(bufferDegrees: vec3) {
    if (bufferDegrees.equal(this._axisBufferDegrees)) {
      return
    }

    this._axisBufferDegrees = bufferDegrees
    this.controller.axisBufferDegrees = bufferDegrees
  }

  /**
   * @returns the vector defining the buffer for each axis.
   */
  get axisBufferDegrees(): vec3 {
    return this._axisBufferDegrees
  }

  /**
   * Set the pivot point and pivoting Interactor to control the Billboard's pivot axis.
   * To turn off pivoting about a point, reset the pivot point to vec3.zero()
   * @param pivotPoint - the pivot point to billboard the target about in local space.
   * @param interactor - the pivoting Interactor.
   */
  public setPivot(pivotPoint: vec3, interactor: Interactor) {
    this.controller.setPivot(pivotPoint, interactor)
  }

  /**
   * Resets the pivot point to billboard the target about its own origin. Recommended to use after finishing
   * some spatial interaction that sets the pivotPoint of this component manually.
   */
  public resetPivotPoint() {
    this.controller.resetPivotPoint()
  }
}
