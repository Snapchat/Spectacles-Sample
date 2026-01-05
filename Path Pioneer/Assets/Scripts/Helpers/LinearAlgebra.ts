export namespace LinearAlgebra {
  const vec3up = vec3.up()

  export function intersectLinePlane(
    linePoint: vec3, // Point on the line (x0, y0, z0)
    lineDir: vec3, // Direction vector of the line (a, b, c)
    planePoint: vec3, // Point on plane
    planeNormal: vec3 // Normal vector of the plane (A, B, C)
  ): vec3 | undefined {
    const [x0, y0, z0] = [linePoint.x, linePoint.y, linePoint.z]
    const [a, b, c] = [lineDir.x, lineDir.y, lineDir.z]
    const [x1, y1, z1] = [planePoint.x, planePoint.y, planePoint.z]
    const [A, B, C] = [planeNormal.x, planeNormal.y, planeNormal.z]

    // Compute plane D
    const planeD = A * x1 + B * y1 + C * z1

    // Compute the denominator: A*a + B*b + C*c
    const denominator = A * a + B * b + C * c

    // If the denominator is zero, the line is parallel to the plane
    if (denominator === 0) {
      return undefined // No intersection (or line lies in the plane)
    }

    // Compute t using the formula
    const t = (planeD - (A * x0 + B * y0 + C * z0)) / denominator

    // Compute the intersection point
    const x = x0 + a * t
    const y = y0 + b * t
    const z = z0 + c * t

    return new vec3(x, y, z)
  }

  export function linearlerp(start: number, end: number, t: number) {
    return (1 - t) * start + t * end
  }

  export function flatNor(nor: vec3) {
    nor.y = 0
    nor = nor.normalize()
    return nor
  }

  export function getFwdAToB(pointA: vec3, pointB: vec3) {
    let fwd = pointB.sub(pointA)
    fwd = fwd.normalize()
    return fwd
  }

  export function getOffsetPoint(point: vec3, fwd: vec3, offset: number) {
    return point.add(fwd.uniformScale(offset))
  }

  export function getLastPathFwd(points: vec3[], cameraTransform: Transform) {
    let fwd: vec3
    if (points.length > 1) {
      // Try to get the direction from second to last point to the last point
      fwd = LinearAlgebra.getFwdAToB(points[points.length - 2], points[points.length - 1])
    } else {
      // If we don't have enough points, use the camera forward
      fwd = LinearAlgebra.flatNor(cameraTransform.back)
    }

    return fwd
  }

  export function flippedRot(rot: quat, up: vec3) {
    return quat.angleAxis(Math.PI, up).multiply(rot)
  }

  export function getNextPathPointAndFwd(points: vec3[], cameraTransform: Transform, offset: number) {
    // Use the last path point, and last path forward and camera forward to offset the next point
    const lastPathFwd: vec3 = LinearAlgebra.getLastPathFwd(points, cameraTransform)
    const camFwd: vec3 = LinearAlgebra.flatNor(cameraTransform.back)
    const fwdForOffset = lastPathFwd.add(camFwd).normalize()
    const pos: vec3 = LinearAlgebra.getOffsetPoint(points[points.length - 1], fwdForOffset, offset)

    // Return the camera forward as the next point's forward
    return {pos, fwd: camFwd}
  }

  export function setPointY(pt: vec3, y: number) {
    pt.y = y
    return pt
  }

  export function computeCurveRotations(points: vec3[]): quat[] {
    if (points.length < 2) {
      return points.map((p) => quat.quatIdentity())
    }

    const result: quat[] = []

    for (let i = 0; i < points.length; i++) {
      let forward: vec3

      if (i === points.length - 1) {
        // Last looks to prior point
        forward = points[i - 1].sub(points[i])
      } else {
        // All else look from the last point
        forward = points[i].sub(points[i + 1])
      }

      forward = forward.normalize()
      const rotation = quat.lookAt(forward, vec3up)

      result.push(rotation)
    }

    return result
  }
}
