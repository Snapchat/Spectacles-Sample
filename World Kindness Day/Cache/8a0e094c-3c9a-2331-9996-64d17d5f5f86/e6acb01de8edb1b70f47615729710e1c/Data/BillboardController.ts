import {Interactor} from "../../../Core/Interactor/Interactor"
import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {findComponentInParents} from "../../../Utils/SceneObjectUtils"
import {InteractableManipulation} from "../InteractableManipulation/InteractableManipulation"
import BillboardRotationCalculator, {ALMOST_ONE} from "./BillboardRotationCalculator"

export type BillboardConfig = {
  script: ScriptComponent
  target: SceneObject
  xAxisEnabled?: boolean
  yAxisEnabled?: boolean
  zAxisEnabled?: boolean
  // We allow the user to set the buffer in degrees for ease of customizability as we expect this to be a field in a Custom Component.
  axisBufferDegrees?: vec3
  // Easing causes the target to have a slight 'lag' in movement. This vector is unitless.
  // As an example, an entry of y=0.1 would cause the target to only rotate 10% of the desired angle per update about the y-axis.
  axisEasing?: vec3
  // Duration is the expected duration of time between updates but can be configured, lower duration leads to faster rotation.
  duration?: number
}

export enum RotationAxis {
  X,
  Y,
  Z
}
const rotationAxes = [RotationAxis.X, RotationAxis.Y, RotationAxis.Z]
const VEC_UP = vec3.up()
const VEC_DOWN = vec3.down()

export default class BillboardController {
  private worldCameraProvider = WorldCameraFinderProvider.getInstance()

  // The angles along each axes will be calculated separately
  private xAxisCalculator: BillboardRotationCalculator
  private yAxisCalculator: BillboardRotationCalculator
  private zAxisCalculator: BillboardRotationCalculator

  // The target will be the SceneObject to rotate.
  private target: SceneObject
  private _targetTransform: Transform

  // The target will rotate according to the camera's position for X/Y-axes rotation, camera's rotation for Z-axis rotation.
  private cameraTransform: Transform = this.worldCameraProvider.getTransform()

  private updateEvent: SceneEvent

  // We wait until the first update to set the rotation due to an inaccuracy of transforms on first frame.
  private firstUpdate = true

  private manipulationComponent: InteractableManipulation | null = null

  private pivotPoint: vec3 = vec3.zero()

  public pivotingInteractor: Interactor | null = null

  constructor(config: BillboardConfig) {
    this.target = config.target
    this._targetTransform = this.target.getTransform()

    this.manipulationComponent = this.findInteractableManipulation(this.target)

    // Set up the rotation calculators to rotate along the axes with specific behavior.
    this.xAxisCalculator = new BillboardRotationCalculator({
      axis: RotationAxis.X,
      axisEnabled: config.xAxisEnabled,
      axisBufferRadians: MathUtils.DegToRad * (config.axisBufferDegrees?.x ?? 0),
      axisEasing: config.axisEasing?.x ?? 1
    })
    this.yAxisCalculator = new BillboardRotationCalculator({
      axis: RotationAxis.Y,
      axisEnabled: config.yAxisEnabled,
      axisBufferRadians: MathUtils.DegToRad * (config.axisBufferDegrees?.y ?? 0),
      axisEasing: config.axisEasing?.y ?? 1
    })
    this.zAxisCalculator = new BillboardRotationCalculator({
      axis: RotationAxis.Z,
      axisEnabled: config.zAxisEnabled,
      axisBufferRadians: MathUtils.DegToRad * (config.axisBufferDegrees?.z ?? 0),
      axisEasing: config.axisEasing?.z ?? 1
    })
    this.updateEvent = config.script.createEvent("UpdateEvent")
    this.updateEvent.bind(this.onUpdate.bind(this))
  }

  public enableAxisRotation(axis: RotationAxis, enabled: boolean): void {
    let axisCalculator: BillboardRotationCalculator

    switch (axis) {
      case RotationAxis.X:
        axisCalculator = this.xAxisCalculator
        break
      case RotationAxis.Y:
        axisCalculator = this.yAxisCalculator
        break
      case RotationAxis.Z:
        axisCalculator = this.zAxisCalculator
        break
    }

    axisCalculator.axisEnabled = enabled
  }

  public get targetTransform(): Transform {
    return this._targetTransform
  }

  public get axisEasing(): vec3 {
    return new vec3(this.xAxisCalculator.axisEasing, this.yAxisCalculator.axisEasing, this.zAxisCalculator.axisEasing)
  }
  public set axisEasing(easing: vec3) {
    this.xAxisCalculator.axisEasing = easing.x
    this.yAxisCalculator.axisEasing = easing.y
    this.zAxisCalculator.axisEasing = easing.z
  }

  public get axisBufferDegrees(): vec3 {
    return new vec3(
      MathUtils.RadToDeg * this.xAxisCalculator.axisBufferRadians,
      MathUtils.RadToDeg * this.yAxisCalculator.axisBufferRadians,
      MathUtils.RadToDeg * this.zAxisCalculator.axisBufferRadians
    )
  }
  public set axisBufferDegrees(bufferDegrees: vec3) {
    this.xAxisCalculator.axisBufferRadians = MathUtils.DegToRad * bufferDegrees.x
    this.yAxisCalculator.axisBufferRadians = MathUtils.DegToRad * bufferDegrees.y
    this.zAxisCalculator.axisBufferRadians = MathUtils.DegToRad * bufferDegrees.z
  }

  /**
   * Set the pivot point and pivoting Interactor to control the Billboard's pivot axis.
   * To turn off pivoting about a point, reset the pivot point to vec3.zero()
   * @param pivotPoint - the pivot point to billboard the target about in local space.
   * @param interactor - the pivoting Interactor.
   */
  public setPivot(pivotPoint: vec3, interactor: Interactor) {
    this.pivotPoint = pivotPoint
    this.pivotingInteractor = interactor

    this.manipulationComponent = this.findInteractableManipulation(
      this.pivotingInteractor.currentInteractable?.sceneObject ?? null
    )
  }

  // The following functions aid with getting unit vectors relative to the target's current rotation.
  private getForwardVector() {
    return this.targetTransform.forward
  }

  private getUpVector() {
    return this.targetTransform.up
  }

  private getRightVector() {
    return this.targetTransform.right
  }

  // Returns a unit vector aligned with the line from the target's center to the camera for X/Y-axes rotation.
  private getTargetToCameraVector() {
    return this.cameraTransform.getWorldPosition().sub(this.targetTransform.getWorldPosition()).normalize()
  }

  // Returns the up vector of a camera for Z-axis rotation.
  private getCameraUpVector() {
    return this.cameraTransform.up
  }

  // Rotates the target about each enabled axis separately.
  private onUpdate(): void {
    if (this.firstUpdate) {
      this.firstUpdate = false
      this.resetRotation()

      return
    }

    for (const axis of rotationAxes) {
      let rotationQuaternion: quat
      switch (axis) {
        case RotationAxis.X:
          rotationQuaternion = this.xAxisCalculator.getRotation(
            this.getRightVector(),
            this.getForwardVector(),
            this.getTargetToCameraVector(),
            this.getUpVector()
          )
          break
        case RotationAxis.Y:
          {
            let upVector: vec3
            if (this.getUpVector().dot(VEC_DOWN) > ALMOST_ONE) {
              upVector = VEC_DOWN
            } else {
              upVector = VEC_UP
            }
            rotationQuaternion = this.yAxisCalculator.getRotation(
              upVector,
              this.getForwardVector(),
              this.getTargetToCameraVector(),
              this.getRightVector().uniformScale(-1)
            )
          }
          break
        case RotationAxis.Z:
          rotationQuaternion = this.zAxisCalculator.getRotation(
            this.getForwardVector(),
            this.getUpVector(),
            this.getCameraUpVector(),
            this.getRightVector()
          )
          break
        default:
          throw new Error(`Invalid axis: ${axis}`)
      }

      // If the pivot point (in local space) is not the origin of the target, modify the position as well.
      if (!this.pivotPoint.equal(vec3.zero())) {
        const worldPivotPoint = this.targetTransform.getWorldTransform().multiplyPoint(this.pivotPoint)

        const v = this.targetTransform.getWorldPosition().sub(worldPivotPoint)
        const rotatedV = rotationQuaternion.multiplyVec3(v)

        const position = rotatedV.add(worldPivotPoint)

        this.targetTransform.setWorldPosition(position)
      }

      this.targetTransform.setWorldRotation(rotationQuaternion.multiply(this.targetTransform.getWorldRotation()))

      // To help InteractableManipulation ensure 1:1 movement with the initial trigger point, update the transform.
      if (this.manipulationComponent !== null) {
        this.manipulationComponent.updateStartTransform()
      }
    }
  }

  private findInteractableManipulation(object: SceneObject | null): InteractableManipulation | null {
    if (!object) {
      return null
    }

    const interactableManipulationTypeName = InteractableManipulation.getTypeName() as unknown as keyof ComponentNameMap
    const component = object.getComponent(interactableManipulationTypeName)
    if (component) {
      return component as InteractableManipulation
    }

    return findComponentInParents<InteractableManipulation>(object, interactableManipulationTypeName, 10)
  }

  /**
   * Resets the pivot point to billboard the target about its own origin. Recommended to use after finishing
   * some spatial interaction that sets the pivotPoint of this component manually.
   */
  public resetPivotPoint() {
    this.pivotPoint = vec3.zero()
    this.pivotingInteractor = null
    this.manipulationComponent = null
  }

  public resetRotation(): void {
    for (const axis of rotationAxes) {
      let rotationQuaternion: quat
      switch (axis) {
        case RotationAxis.X:
          rotationQuaternion = this.xAxisCalculator.resetRotation(
            this.getRightVector(),
            this.getForwardVector(),
            this.getTargetToCameraVector(),
            this.getUpVector()
          )
          break
        case RotationAxis.Y:
          {
            let upVector: vec3
            if (this.getUpVector().dot(VEC_DOWN) > ALMOST_ONE) {
              upVector = VEC_DOWN
            } else {
              upVector = VEC_UP
            }
            rotationQuaternion = this.yAxisCalculator.resetRotation(
              upVector,
              this.getForwardVector(),
              this.getTargetToCameraVector(),
              this.getRightVector().uniformScale(-1)
            )
          }
          break
        case RotationAxis.Z:
          rotationQuaternion = this.zAxisCalculator.resetRotation(
            this.getForwardVector(),
            this.getUpVector(),
            this.getCameraUpVector(),
            this.getRightVector()
          )
          break
        default:
          throw new Error(`Invalid axis: ${axis}`)
      }

      this.targetTransform.setWorldRotation(rotationQuaternion.multiply(this.targetTransform.getWorldRotation()))
    }
  }
}
