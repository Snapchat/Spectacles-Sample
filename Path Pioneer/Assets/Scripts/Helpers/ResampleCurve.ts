export namespace ResampleCurve {
  // Computes Euclidean distance between two points (supports 2D & 3D)
  function distance(a: vec3, b: vec3): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dz = (b.z ?? 0) - (a.z ?? 0)
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  // Linear interpolation between two points
  function interpolate(a: vec3, b: vec3, t: number): vec3 {
    return new vec3(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
      a.z !== undefined && b.z !== undefined ? a.z + (b.z - a.z) * t : undefined
    )
  }

  // Resampling function
  export function resampleCurve(points: vec3[], targetCount: number): vec3[] {
    if (points.length < 2 || targetCount < 2) return points

    // Step 1: Compute cumulative distances along the curve
    const distances: number[] = new Array(points.length).fill(0)
    let totalLength = 0

    for (let i = 1; i < points.length; i++) {
      totalLength += distance(points[i - 1], points[i])
      distances[i] = totalLength
    }

    const segmentLength = totalLength / targetCount
    const resampled: vec3[] = [points[0]]

    // Step 2: Use binary search to quickly find the segment for interpolation
    let currentDistance = segmentLength
    for (let j = 1; j < targetCount; j++) {
      let low = 0,
        high = points.length - 1

      // Binary search to find the segment that contains currentDistance
      while (low < high - 1) {
        const mid = Math.floor((low + high) / 2)
        if (distances[mid] < currentDistance) {
          low = mid
        } else {
          high = mid
        }
      }

      // Interpolate between `low` and `high`
      const segmentT = (currentDistance - distances[low]) / (distances[high] - distances[low])
      resampled.push(interpolate(points[low], points[high], segmentT))

      currentDistance += segmentLength
    }

    resampled.push(points[points.length - 1]) // Ensure last point is included
    return resampled
  }
}
