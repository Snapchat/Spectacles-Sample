import {SurfaceDetection} from "../../Surface Detection/Scripts/SurfaceDetection"
import {FinishSmoothPath} from "../Helpers/FinishSmoothPath"
import {GetVectorsFromQuaternion} from "../Helpers/GetVectorsFromQuaternion"
import {LinearAlgebra} from "../Helpers/LinearAlgebra"
import {LineController} from "../LineController"
import {PathBuilder} from "../PathBuilder"
import {SoundController} from "../SoundController"
import {IPathMakerState} from "./IPathMakerState"

export class PlacingFinishState implements IPathMakerState {
  constructor(
    protected startObject: SceneObject,
    protected ownerScript: ScriptComponent,
    protected surfaceDetection: SurfaceDetection,
    protected finishPrefab: ObjectPrefab,
    protected cameraTransform: Transform,
    protected forwardDisplace: number,
    protected pathPoints: vec3[],
    protected visualPoints: vec3[],
    protected visualRmv: RenderMeshVisual,
    protected bigMoveDistanceThreshold: number,
    protected hermiteResolution: number,
    protected resampleResoluton: number,
    protected onFinishPlaced: (
      finishPosition: vec3,
      finishRotation: quat,
      finishObject: SceneObject,
      splinePoints: {position: vec3; rotation: quat}[]
    ) => void
  ) {}

  protected finishTransform: Transform

  start() {
    this.surfaceDetection.startGroundCalibration(
      (pos, rot) => {
        this.onPlacing(pos, rot)
      },
      (pos, rot) => {
        this.onPlaced(pos, rot)
      }
    )

    this.finishTransform = this.finishPrefab.instantiate(this.ownerScript.getSceneObject()).getTransform()
    const finishLineController = this.finishTransform.getSceneObject().getComponent(LineController.getTypeName())
    if (!finishLineController) {
      throw new Error(`FinishLineController not found on ${this.finishTransform.getSceneObject().name}`)
    } else {
      finishLineController.init(false)
      finishLineController.setHintVisual()
    }

    this.hideFinishLine()
  }

  onPlacing(pos: vec3, rot: quat) {
    // Rot is upside down and turned around
    const {forward, right, up} = GetVectorsFromQuaternion.getInstance().getVectorsFromQuaternion(rot)
    rot = quat.angleAxis(-Math.PI / 2, right).multiply(rot)
    rot = quat.angleAxis(Math.PI, up).multiply(rot)

    // Displaces obj away from surface placement ui
    pos = this.displaceAwayFromCamera(pos)

    this.setFinishLineTransform(pos, rot)

    this.updateArrowsVisual(pos)
  }

  onPlaced(pos: vec3, rot: quat) {
    // Bug: this rot does not match onPlacing one frame earlier
    const {forward, right, up} = GetVectorsFromQuaternion.getInstance().getVectorsFromQuaternion(rot)
    rot = quat.angleAxis(Math.PI, up).multiply(rot)

    // Displaces obj away from surface placement ui
    pos = this.displaceAwayFromCamera(pos)

    this.setFinishLineTransform(pos, rot)

    const smoothPoints = FinishSmoothPath.finishSmoothPath(
      this.pathPoints,
      this.finishTransform,
      this.cameraTransform,
      this.bigMoveDistanceThreshold,
      this.hermiteResolution,
      this.resampleResoluton
    )
    this.pathPoints = smoothPoints.pathPoints
    const splinePoints = smoothPoints.splinePoints

    this.onFinishPlaced(pos, rot, this.finishTransform.getSceneObject(), splinePoints)
    SoundController.getInstance().playSound("stopCreatePath")
  }

  private setFinishLineTransform(pos: vec3, rot: quat) {
    this.finishTransform.setWorldPosition(pos)
    this.finishTransform.setWorldRotation(rot)
  }

  stop() {
    this.visualRmv.enabled = false
  }

  private displaceAwayFromCamera(pos: vec3) {
    return pos.add(LinearAlgebra.flatNor(this.cameraTransform.back).uniformScale(30))
  }

  protected updateArrowsVisual(position: vec3) {
    const newArray = [this.pathPoints[this.pathPoints.length - 1], position]

    this.visualRmv.mesh = PathBuilder.buildFromPoints(newArray, 60)
  }

  private hideFinishLine() {
    this.finishTransform.setWorldPosition(this.cameraTransform.getWorldPosition().add(vec3.up().uniformScale(1000)))
  }
}
