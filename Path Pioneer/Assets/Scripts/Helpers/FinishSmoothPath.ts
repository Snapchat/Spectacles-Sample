import {CatmullRomSpline} from "./CatmullRomSpline"
import {HermiteSpline} from "./HermiteSpline"
import {LinearAlgebra} from "./LinearAlgebra"
import {ResampleCurve} from "./ResampleCurve"

export namespace FinishSmoothPath {
  export function finishSmoothPath(
    pathPoints: vec3[],
    finishTransform: Transform,
    cameraTransform: Transform,
    offset: number,
    hermiteResolution: number,
    resampleResoluton: number
  ) {
    const a = LinearAlgebra.getNextPathPointAndFwd(pathPoints, cameraTransform, offset)
    const finishPoints = HermiteSpline.drawCurve(
      a.pos,
      a.fwd,
      finishTransform.getWorldPosition(),
      finishTransform.forward,
      hermiteResolution
    )

    pathPoints = pathPoints.concat(finishPoints)

    pathPoints = ResampleCurve.resampleCurve(pathPoints, Math.floor(pathPoints.length / resampleResoluton))

    // Generate spline
    const splinePoints = CatmullRomSpline.generateSpline(pathPoints, resampleResoluton)

    return {pathPoints, splinePoints}
  }
}
