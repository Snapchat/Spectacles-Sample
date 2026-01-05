import {Conversions} from "../Conversions"
import {EasingFunctions} from "../Helpers/EasingFunctions"
import {FinishSmoothPath} from "../Helpers/FinishSmoothPath"
import {GetVectorsFromQuaternion} from "../Helpers/GetVectorsFromQuaternion"
import {HermiteSpline} from "../Helpers/HermiteSpline"
import {LinearAlgebra} from "../Helpers/LinearAlgebra"
import {ResampleCurve} from "../Helpers/ResampleCurve"
import {LensInitializer} from "../LensInitializer"
import {LineController} from "../LineController"
import {PathBuilder} from "../PathBuilder"
import {PathmakingPlayerFeedback} from "../PathmakingPlayerFeedback"
import {LookAtFloorBehavior} from "../PathPrevewBehaviors/LookAtFloorBehavior"
import {PaintOnFloorBehavior} from "../PathPrevewBehaviors/PaintOnFloorBehavior"
import {PlayerPaceCalculator} from "../PlayerPaceCalculator"
import {UI} from "../UI"
import {IPathMakerState} from "./IPathMakerState"

export class BuildingPathState implements IPathMakerState {
  constructor(
    protected ownerScript: ScriptComponent,
    protected cameraTransform: Transform,
    protected cameraOffsetTransform: Transform,
    protected pathRmv: RenderMeshVisual,
    protected pathDistanceText: Text,
    protected startPosition: vec3,
    protected startRotation: quat,
    protected startObject: SceneObject,
    protected ui: UI,
    protected paceCalculator: PlayerPaceCalculator,
    protected pathmakingPlayerFeedback: PathmakingPlayerFeedback,
    protected bigMoveDistanceThreshold: number,
    protected hermiteResolution: number,
    protected resampleResoluton: number,
    protected onFinishAsSprint: (
      startPosition: vec3,
      startRotation: quat,
      startObject: SceneObject,
      pathPoints: vec3[],
      lastVisualPoints: vec3[]
    ) => void,
    protected onFinishAsLoop: (
      startPosition: vec3,
      startRotation: quat,
      startObject: SceneObject,
      splinePoints: {position: vec3; rotation: quat}[]
    ) => void
  ) {
    this.startTransform = this.startObject.getTransform()
  }

  protected previewZOffset = 300
  protected static distanceToMakeLoopXZ = 200
  protected static distanceToMakeLoopY = 50
  protected startTransform: Transform

  // To clear on stop()
  protected finishClickedRemover: (() => void) | undefined
  protected loopClickedRemover: (() => void) | undefined
  protected resetClickedRemover: (() => void) | undefined
  protected updateEvent: SceneEvent | undefined
  protected trailHeadTransform: Transform | undefined

  // To clear on start()
  protected prevCameraPositionForVisual: vec3 | undefined
  protected prevCameraPositionForPath: vec3 | undefined
  protected prevTrailHeadPos: vec3 | undefined
  protected prevTrailHeadRot: quat | undefined
  protected previewLookPoints: vec3[] = []
  protected paintPts: vec3[] = []
  protected lookPts: vec3[] = []
  protected previewPoints: vec3[] = []
  protected pathPoints: vec3[] = []
  protected pathLength: number = 0
  protected visualTargetCrossedStartLine = false
  protected cameraCrossedStartLine = false
  protected cameraMovedFromStartLine = false

  protected isUiShown: boolean = false
  protected isLoop: boolean = false

  protected paintPreview: PaintOnFloorBehavior
  protected lookPreview: LookAtFloorBehavior

  private smallMoveDistanceThreshold = 3

  start() {
    this.visualTargetCrossedStartLine = false
    this.prevCameraPositionForVisual = this.startPosition.uniformScale(1)
    this.prevCameraPositionForPath = LensInitializer.getInstance().getPlayerGroundPos()
    this.prevTrailHeadPos = undefined
    this.prevTrailHeadRot = undefined
    this.previewLookPoints = []
    this.paintPts = []
    this.lookPts = []
    this.previewPoints = []
    this.pathPoints = []
    this.pathLength = 0
    this.isLoop = false
    this.isUiShown = false
    const lineCtrl = this.startObject.getComponent(LineController.getTypeName())
    if (!lineCtrl) {
      throw new Error(`StartFinishLine cannot be found on object with name ${this.startObject.name}`)
    }
    lineCtrl.setRealVisual()
    this.ui.hideUi()
    this.ui.initLoopUi(this.startTransform)

    this.finishClickedRemover = this.ui.finishPathClicked.add(() => {
      this.onFinishAsSprint(
        this.startPosition,
        this.startRotation,
        this.startObject,
        this.pathPoints,
        this.previewPoints
      )
    })
    this.loopClickedRemover = this.ui.loopPathClicked.add(() => {
      const smoothPoints = FinishSmoothPath.finishSmoothPath(
        this.pathPoints,
        this.startTransform,
        this.cameraTransform,
        this.bigMoveDistanceThreshold,
        this.hermiteResolution,
        this.resampleResoluton
      )
      this.pathPoints = smoothPoints.pathPoints
      const splinePoints = smoothPoints.splinePoints

      this.pathRmv.enabled = false
      this.onFinishAsLoop(this.startPosition, this.startRotation, this.startObject, splinePoints)
    })

    this.addStartPointToPath()
    this.addStartPointToVisual()
    this.paintPreview = new PaintOnFloorBehavior(this.previewZOffset, this.cameraTransform)
    this.lookPreview = new LookAtFloorBehavior(this.previewZOffset, this.cameraTransform)
    this.paintPreview.start(this.displaceForward(this.prevCameraPositionForPath))
    this.lookPreview.start()
    this.paceCalculator.start(this.prevCameraPositionForPath)

    this.resetClickedRemover = this.ui.resetPathClicked.add(() => {
      this.reset()
    })

    this.pathmakingPlayerFeedback.start([
      this.startPosition.add(this.startTransform.forward.uniformScale(50)),
      this.startPosition
    ])
    this.updateEvent = this.ownerScript.createEvent("UpdateEvent")
    this.updateEvent.bind(() => {
      this.onUpdate()
    })
  }

  reset() {
    this.pathRmv.enabled = false
    this.startObject.destroy()
    this.pathmakingPlayerFeedback.stop()
  }

  stop() {
    this.finishClickedRemover?.()
    this.finishClickedRemover = undefined
    this.loopClickedRemover?.()
    this.loopClickedRemover = undefined
    this.resetClickedRemover?.()
    this.resetClickedRemover = undefined
    if (this.updateEvent) {
      this.ownerScript.removeEvent(this.updateEvent)
      this.updateEvent = undefined
    }
    if (this.trailHeadTransform) {
      this.trailHeadTransform.getSceneObject().destroy()
      this.trailHeadTransform = undefined
    }
    this.paintPreview.stop()
    this.lookPreview.stop()
    this.pathmakingPlayerFeedback.stop()
  }

  private onUpdate() {
    if (getDeltaTime() < 0.00000000001) {
      // we're in a capture loop
      return
    }

    // Check pace
    const nPos = LensInitializer.getInstance().getPlayerGroundPos()
    const stats = this.paceCalculator.getPace(nPos)
    if (stats.pace < 13 && this.pathPoints.length > 4) {
      this.ensureUiShown()
    } else {
      this.ensureUiHidden()
    }

    // Make the high density visual ahead of us
    const smallMoved = nPos.sub(this.prevCameraPositionForVisual)
    const smallDistanceMoved = smallMoved.length
    const nPosVisual = this.displaceForward(nPos)

    this.setPreviewPoints(nPos, nPosVisual)

    if (smallDistanceMoved > this.smallMoveDistanceThreshold && this.checkVisualTargetCrossedStartLine(nPosVisual)) {
      // Make flat and vertical distance checks for loop viability
      const toStart = this.startPosition.sub(nPosVisual)
      const toStartY = toStart.y
      toStart.y = 0
      const toStartXZ = toStart.length

      if (
        toStartXZ < BuildingPathState.distanceToMakeLoopXZ &&
        Math.abs(toStartY) < BuildingPathState.distanceToMakeLoopY
      ) {
        if (this.pathPoints.length > 4) {
          this.ensureLoopUiShown()
        } else {
          this.ensureLoopUiHidden()
        }
      } else {
        this.ensureLoopUiHidden()
      }

      // Update old positions
      this.prevCameraPositionForVisual = nPos
    }

    // Make the low density path behind us
    // Because the start transform is the first point, start drawing once we've moved from start
    const bigMoved = nPos.sub(this.prevCameraPositionForPath)
    const bigDistanceMoved = bigMoved.length

    if (
      bigDistanceMoved > this.bigMoveDistanceThreshold &&
      this.checkCameraCrossedStartLine(nPos, 0) &&
      this.checkCameraMovedFromStartLine(nPos, this.bigMoveDistanceThreshold)
    ) {
      // Update our path distance
      this.pathLength += bigDistanceMoved
      const pathDistFt = Conversions.cmToFeet(this.pathLength)
      this.pathDistanceText.text = pathDistFt.toFixed(1) + "'"

      // Push a subset of points to the path array
      this.pathPoints.push(nPos)

      // Early on, cleanup the start points to curve smoothly from the center of the start line
      if (this.pathPoints.length == 7) {
        this.cleanupStartPointsToPath()
      }

      if (this.pathPoints.length > 2) {
        this.pathRmv.enabled = true
        this.pathRmv.mesh = PathBuilder.buildFromPoints(this.pathPoints, 60)
      }

      this.prevCameraPositionForPath = nPos
    }
  }

  setPreviewPoints(nPos: vec3, nPosVisual: vec3) {
    // To prevent visual from drawing from start back to player,
    // While cam has not yet passed start,
    // Ensure visual is really passed start, otherwise don't update
    const updatePreviewPoints = this.checkCameraCrossedStartLine(nPos, 0) ? true : this.checkCrossedStart(nPosVisual, 0)
    if (!updatePreviewPoints) {
      return
    }

    // If camera has not crossed start, but visual has
    // Adjust object count to our distance from start to visual
    let objCount = 6
    if (!this.checkCameraCrossedStartLine(nPos, 0) && this.checkCrossedStart(nPosVisual, 0)) {
      const distancePerObj = this.previewZOffset / objCount
      const availableDistance = nPosVisual.distance(this.startPosition)
      objCount = Math.floor(availableDistance / distancePerObj)
      objCount = Math.max(objCount, 2)
    }

    const startPos = this.checkCameraCrossedStartLine(nPos, 0) ? nPos : this.startPosition

    const lookBehavior = this.lookPreview.getBehavior()
    if (lookBehavior && lookBehavior.pos && lookBehavior.rot && lookBehavior.vel) {
      this.lookPts = this.drawCurveFromBehavior(startPos, lookBehavior)
    }

    const paintBehavior = this.paintPreview.getBehavior(nPosVisual)
    if (paintBehavior) {
      if (paintBehavior.pos) {
        this.paintPts.unshift(paintBehavior.pos)
        // Pop the points that are behind the camera
        for (let i = this.paintPts.length - 1; i >= 0; i--) {
          const camToPt = this.paintPts[i].sub(nPos).normalize()
          const camFwd = LinearAlgebra.flatNor(this.cameraTransform.back)

          // Snap all points to our current ground
          this.paintPts[i].y = nPos.y

          const dot = camToPt.dot(camFwd)
          if (dot < 0) {
            this.paintPts.pop()
          }
        }
      }
    }

    this.previewPoints = []
    const size = Math.min(this.lookPts.length, this.paintPts.length)
    if (size > 2) {
      // Array goes from head (index 0) to start position (index size-1)
      for (let i = 0; i < size; i++) {
        const t = 1 - i / (size - 1)
        const paintWeight = EasingFunctions.easeOutQuart(t)
        const lookWeight = 1 - paintWeight

        const pos = this.lookPts[i].uniformScale(lookWeight).add(this.paintPts[i].uniformScale(paintWeight))
        this.previewPoints.push(pos)
      }

      // Re-emphasize start position prior to resampling
      this.previewPoints.push(startPos)

      // Resample
      this.previewPoints = ResampleCurve.resampleCurve(this.previewPoints, objCount)

      this.pathmakingPlayerFeedback.update(this.previewPoints)
    }
  }

  // This draws a curve from the look point to us
  drawCurveFromBehavior(startPos: vec3, behavior: {pos: vec3; rot: quat; vel: number}) {
    const posA = behavior.pos
    const fwdA = LinearAlgebra.flatNor(
      GetVectorsFromQuaternion.getInstance().getVectorsFromQuaternion(behavior.rot).forward
    )

    const posB = startPos
    const fwdB = LinearAlgebra.flatNor(this.cameraTransform.forward)

    const dir = posA.sub(posB)
    const mag = dir.length

    const resolution = Math.floor(mag / 15)
    const curveScale = Math.max(50, Math.min(resolution * 50, behavior.vel / 2))

    const curvePoints: vec3[] = HermiteSpline.interpolateHermite(posA, fwdA, posB, fwdB, resolution, curveScale)

    return curvePoints
  }

  private cleanupStartPointsToPath() {
    this.pathPoints = HermiteSpline.drawCurve(
      this.startPosition,
      this.startTransform.forward,
      this.pathPoints[this.pathPoints.length - 1],
      LinearAlgebra.flatNor(this.cameraTransform.back),
      this.hermiteResolution
    )
  }

  private addStartPointToPath() {
    this.pathPoints.push(this.startPosition.uniformScale(1))
  }

  private addStartPointToVisual() {
    this.previewPoints.unshift(this.startPosition)
  }

  private displaceForward(cameraPosOnSurface: vec3) {
    return cameraPosOnSurface.add(LinearAlgebra.flatNor(this.cameraTransform.back).uniformScale(this.previewZOffset))
  }

  private checkCameraMovedFromStartLine(cameraPosOnSurface: vec3, distance: number) {
    if (this.cameraMovedFromStartLine) {
      return true
    }
    this.cameraMovedFromStartLine = this.startPosition.distance(cameraPosOnSurface) > distance
    return this.cameraMovedFromStartLine
  }

  private checkCameraCrossedStartLine(cameraPosOnSurface: vec3, offset: number) {
    if (this.cameraCrossedStartLine) {
      return true
    }
    this.cameraCrossedStartLine = this.checkCrossedStart(cameraPosOnSurface, offset)
    return this.cameraCrossedStartLine
  }

  private checkCrossedStart(pos: vec3, offset: number) {
    const startLineForward = this.startTransform.forward
    const offsetStartPos = this.startPosition.add(startLineForward.uniformScale(offset))
    const cameraPosToStart = pos.sub(offsetStartPos)
    return startLineForward.angleTo(cameraPosToStart) <= Math.PI / 2
  }

  private checkBehindStart(pos: vec3, offset: number) {
    const startLineForward = this.startTransform.forward
    const offsetStartPos = this.startPosition.sub(startLineForward.uniformScale(offset))
    const cameraPosToStart = pos.sub(offsetStartPos)
    return startLineForward.angleTo(cameraPosToStart) > Math.PI / 2
  }

  private checkVisualTargetCrossedStartLine(targetPosOnSurface: vec3) {
    if (this.visualTargetCrossedStartLine) {
      return true
    }
    this.visualTargetCrossedStartLine = this.checkCrossedStart(targetPosOnSurface, 0)
    return this.visualTargetCrossedStartLine
  }

  private ensureUiShown() {
    if (this.isUiShown) {
      return
    }
    this.isUiShown = true
    this.ui.showDuringPathCreationUi()
  }

  private ensureUiHidden() {
    if (!this.isUiShown) {
      return
    }
    this.isUiShown = false
    this.ui.hideUi()
  }

  private ensureLoopUiShown() {
    if (this.isLoop) {
      return
    }
    this.isLoop = true
    this.ui.showLoopUi()
  }

  private ensureLoopUiHidden() {
    if (!this.isLoop) {
      return
    }
    this.isLoop = false
    this.ui.hideLoopUi()
  }
}
