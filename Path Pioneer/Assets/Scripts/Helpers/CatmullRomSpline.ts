export namespace CatmullRomSpline {
  /**
   * Computes a point on a Catmull-Rom spline.
   * @param t - A value between 0 and 1 representing the interpolation parameter.
   * @param p0 - The first control point (used for tangents).
   * @param p1 - The starting point of the segment.
   * @param p2 - The ending point of the segment.
   * @param p3 - The last control point (used for tangents).
   * @returns The interpolated point on the curve.
   */
  function catmullRom(t: number, p0: vec3, p1: vec3, p2: vec3, p3: vec3): vec3 {
    const t2 = t * t
    const t3 = t2 * t

    const x =
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3)

    const y =
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)

    const z =
      0.5 *
      (2 * p1.z +
        (-p0.z + p2.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3)

    return new vec3(x, y, z)
  }

  /**
   * Generates a list of points along a Catmull-Rom spline, including rotation quaternions.
   * @param controlPoints - An array of control points.
   * @param resolution - The number of points to generate per segment.
   * @returns An array of points along the spline, each with a rotation quaternion.
   */
  export function generateSpline(controlPoints: vec3[], resolution: number): {position: vec3; rotation: quat}[] {
    if (controlPoints.length < 2) {
      throw new Error("At least two control points are required to generate a spline.")
    }

    const points: {position: vec3; rotation: quat}[] = []

    for (let i = 0; i < controlPoints.length - 1; i++) {
      const p0 = controlPoints[i - 1] || controlPoints[i]
      const p1 = controlPoints[i]
      const p2 = controlPoints[i + 1]
      const p3 = controlPoints[i + 2] || controlPoints[i + 1]

      for (let j = 0; j < resolution; j++) {
        // <=
        const t = j / resolution
        const position = catmullRom(t, p0, p1, p2, p3)

        // Compute tangent vector for rotation
        const tangent = catmullRom(t + 0.01, p0, p1, p2, p3)

        const forward = new vec3(tangent.x - position.x, tangent.y - position.y, tangent.z - position.z).normalize()

        const up = vec3.up()
        const right = up.cross(forward)
        const adjustedUp = forward.cross(right)

        const rotation = quat.lookAt(forward, adjustedUp)
        points.push({position, rotation})
      }
    }
    return points
  }

  /**
   * Converts a position in world space to spline space.
   * @param position - The position in world space.
   * @param splinePoints - The generated spline points.
   * @returns An object containing the spline space parameter t (0 to 1) and the relative distance (dx, dy, dz).
   */
  export function worldToSplineSpace(
    position: vec3,
    splinePoints: {position: vec3; rotation: quat}[]
  ): {t: number; dx: number; dy: number; dz: number} {
    if (splinePoints.length < 2) {
      throw new Error("Spline must have at least two points to calculate spline space.")
    }

    let closestIndex = 0
    let closestDistance = Infinity

    // Find the closest point on the spline
    for (let i = 0; i < splinePoints.length; i++) {
      const dx = position.x - splinePoints[i].position.x
      const dy = position.y - splinePoints[i].position.y
      const dz = position.z - splinePoints[i].position.z
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    // Compute the relative distance (dx, dy, dz) to the closest point
    const closestPoint = splinePoints[closestIndex].position
    const dx = position.x - closestPoint.x
    const dy = position.y - closestPoint.y
    const dz = position.z - closestPoint.z

    // Map the closest index to spline space (0 to 1)
    const t = closestIndex / (splinePoints.length - 1)

    return {t, dx, dy, dz}
  }

  /**
   * Converts a parameter t in spline space to world space.
   * @param t - A value between 0 and 1 representing the spline space parameter.
   * @param splinePoints - The generated spline points.
   * @returns The corresponding point in world space.
   */
  export function splineSpaceToWorld(
    t: number,
    splinePoints: {position: vec3; rotation: quat}[]
  ): {position: vec3; rotation: quat} {
    if (splinePoints.length < 2) {
      throw new Error("Spline must have at least two points to calculate world space.")
    }

    const clampedT = Math.max(0, Math.min(1, t))
    const index = clampedT * (splinePoints.length - 1)
    const lowerIndex = Math.floor(index)
    const upperIndex = Math.min(lowerIndex + 1, splinePoints.length - 1)
    const localT = index - lowerIndex

    const p1 = splinePoints[lowerIndex]
    const p2 = splinePoints[upperIndex]

    const position = new vec3(
      p1.position.x + (p2.position.x - p1.position.x) * localT,
      p1.position.y + (p2.position.y - p1.position.y) * localT,
      p1.position.z + (p2.position.z - p1.position.z) * localT
    )

    const rotation = new quat(
      p1.rotation.x + (p2.rotation.x - p1.rotation.x) * localT,
      p1.rotation.y + (p2.rotation.y - p1.rotation.y) * localT,
      p1.rotation.z + (p2.rotation.z - p1.rotation.z) * localT,
      p1.rotation.w + (p2.rotation.w - p1.rotation.w) * localT
    )

    return {position, rotation}
  }
}
