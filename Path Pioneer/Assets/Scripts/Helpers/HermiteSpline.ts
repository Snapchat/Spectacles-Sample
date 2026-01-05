export namespace HermiteSpline {
  type Vector3 = [number, number, number]

  export function interpolateHermite(
    pointA: vec3, // Start point
    forwardA: vec3, // Forward direction at A
    pointB: vec3, // End point
    forwardB: vec3, // Forward direction at B
    resolution: number, // Number of points in the curve
    tangentScale: number // the scale of the curve
  ): vec3[] {
    const curve: vec3[] = []

    resolution = Math.max(2, resolution) // Ensure at least 2 points

    // Scale the forward vectors to control curve shape
    const tangentA: Vector3 = [forwardA.x * tangentScale, forwardA.y * tangentScale, forwardA.z * tangentScale]
    const tangentB: Vector3 = [forwardB.x * tangentScale, forwardB.y * tangentScale, forwardB.z * tangentScale]

    for (let i = 0; i < resolution; i++) {
      const t: number = i / (resolution - 1) // Normalize t in range [0, 1]

      // Hermite basis functions
      const h1 = 2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1 // Blends P0
      const h2 = -2 * Math.pow(t, 3) + 3 * Math.pow(t, 2) // Blends P1
      const h3 = Math.pow(t, 3) - 2 * Math.pow(t, 2) + t // Blends T0
      const h4 = Math.pow(t, 3) - Math.pow(t, 2) // Blends T1

      // Compute interpolated point
      const x = h1 * pointA.x + h2 * pointB.x + h3 * tangentA[0] + h4 * tangentB[0]
      const y = h1 * pointA.y + h2 * pointB.y + h3 * tangentA[1] + h4 * tangentB[1]
      const z = h1 * pointA.z + h2 * pointB.z + h3 * tangentA[2] + h4 * tangentB[2]

      curve.push(new vec3(x, y, z))
    }

    return curve
  }

  export function drawCurve(posA: vec3, fwdA: vec3, posB: vec3, fwdB: vec3, myResolution?: number) {
    const dir = posA.sub(posB)
    const mag = dir.length

    let resolution = myResolution ? myResolution : Math.floor(mag / 20)
    resolution = Math.max(resolution, 5)

    const curveScale = Math.max(50, resolution * 50)

    const curvePoints: vec3[] = HermiteSpline.interpolateHermite(posA, fwdA, posB, fwdB, resolution, curveScale)

    return curvePoints
  }
}
