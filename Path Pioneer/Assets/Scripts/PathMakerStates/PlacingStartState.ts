import {SurfaceDetection} from "../../Surface Detection/Scripts/SurfaceDetection"
import {GetVectorsFromQuaternion} from "../Helpers/GetVectorsFromQuaternion"
import {LinearAlgebra} from "../Helpers/LinearAlgebra"
import {LensInitializer} from "../LensInitializer"
import {LineController} from "../LineController"
import {SoundController} from "../SoundController"

export class PlacingStartState {
  constructor(
    protected ownerScript: ScriptComponent,
    protected surfaceDetection: SurfaceDetection,
    protected startLinePrefab: ObjectPrefab,
    protected cameraTransform: Transform,
    protected startLineForwardDisplace: number,
    protected onStartPlaced: (startPosition: vec3, startRotation: quat, startObject: SceneObject) => void
  ) {}

  protected startLineTransform: Transform | undefined

  start() {
    this.surfaceDetection.startGroundCalibration(
      (pos, rot) => {
        this.onPlacing(pos, rot)
      },
      (pos, rot) => {
        this.onPlaced(pos, rot)
      }
    )

    this.startLineTransform = this.startLinePrefab.instantiate(this.ownerScript.getSceneObject()).getTransform()
    const startLineController = this.startLineTransform.getSceneObject().getComponent(LineController.getTypeName())
    if (!startLineController) {
      throw new Error(`StartFinishLine cannot be found on object: ${this.startLineTransform.getSceneObject().name}`)
    }
    startLineController.init(true)

    this.hideStartLine()
  }

  onPlacing(pos: vec3, rot: quat) {
    // Rot is upside down and turned around
    const {forward, right, up} = GetVectorsFromQuaternion.getInstance().getVectorsFromQuaternion(rot)
    rot = quat.angleAxis(-Math.PI / 2, right).multiply(rot)
    rot = quat.angleAxis(Math.PI, up).multiply(rot)

    // Displaces obj away from surface placement ui
    pos = this.displaceAwayFromCamera(pos)

    this.setStartLineTransform(pos, rot)
  }

  onPlaced(pos: vec3, rot: quat) {
    // Bug: this rot does not match onPlacing one frame earlier
    const {forward, right, up} = GetVectorsFromQuaternion.getInstance().getVectorsFromQuaternion(rot)
    rot = quat.angleAxis(Math.PI, up).multiply(rot)

    // Displaces obj away from surface placement ui
    pos = this.displaceAwayFromCamera(pos)
    LensInitializer.getInstance().setFloorOffsetFromCamera(pos)

    this.onStartPlaced(pos, rot, this.startLineTransform.getSceneObject())

    SoundController.getInstance().playSound("stopCreatePath")
  }

  private displaceAwayFromCamera(pos: vec3) {
    return pos.add(LinearAlgebra.flatNor(this.cameraTransform.back).uniformScale(30))
  }

  private setStartLineTransform(pos: vec3, rot: quat) {
    this.startLineTransform.setWorldPosition(pos)
    this.startLineTransform.setWorldRotation(rot)
  }

  private hideStartLine() {
    this.startLineTransform.setWorldPosition(this.cameraTransform.getWorldPosition().add(vec3.up().uniformScale(1000)))
  }

  stop() {}
}
