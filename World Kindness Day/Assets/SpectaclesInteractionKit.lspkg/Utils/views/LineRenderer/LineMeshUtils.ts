//Line vertices have 11 coords - 3 position, 3 previous, 3 tangent, and 2 uv
export type lineVertex = [number, number, number, number, number, number, number, number, number, number, number]

/**
 * Shifts vertices so that we can join corners of line segments w/ miter
 * @param prevSegment direction of previous vertex
 * @param nextSegment direction of next vertex
 * @param widthOffset offset of the width
 * @returns miterOffset - add or subtract this from a vertex to get offset needed
 */
export function getMiterOffset(prevSegment: vec3, nextSegment: vec3, widthOffset: number): vec3 {
  const tangent = prevSegment.add(nextSegment).normalize()
  const miter = new vec3(-tangent.y, tangent.x, 0)
  const normalA = new vec3(-prevSegment.y, prevSegment.x, 0)
  const scaleWidth = widthOffset / miter.dot(normalA)
  return miter.uniformScale(scaleWidth)
}

export function getSegmentNormalized(currentPoint: vec3, nextPoint: vec3) {
  return currentPoint.sub(nextPoint).normalize()
}

export function getTangent(prevSegment: vec3, nextSegment: vec3) {
  return prevSegment.add(nextSegment).normalize()
}

export function getEndWidth(current: vec3, next: vec3, widthAtVertex: number) {
  const direction = next.sub(current)
  const normalizedDir = new vec3(-direction.y, direction.x, 0).normalize()
  return normalizedDir.uniformScale(widthAtVertex)
}

/**
 * Builds a segment of the line using its MeshBuilder
 * @param point the position coordinates for the point
 * @param tangent of the connecting line segments
 * @param uv_v desired v coordinate for the vertex's uv map
 * vertices are shifted for thickness in the shader
 */
export function buildSegment(point: vec3, prevSegment: vec3, tangent: vec3, uv_v: number): number[] {
  return [
    //left vertices and tangent
    point.x,
    point.y,
    point.z,
    prevSegment.x,
    prevSegment.y,
    prevSegment.z,
    tangent.x,
    tangent.y,
    tangent.z,
    //left uv
    0,
    uv_v,

    //right vertices and tangent
    point.x,
    point.y,
    point.z,
    prevSegment.x,
    prevSegment.y,
    prevSegment.z,
    tangent.x,
    tangent.y,
    tangent.z,
    //right uv
    1,
    uv_v
  ]
}

// Sets up data for a single line vertex, for use in setVertexInterleaved
export function buildVertex(position: vec3, prevSegment: vec3, tangent: vec3, uv_u: number, uv_v: number): lineVertex {
  return [
    position.x,
    position.y,
    position.z,
    prevSegment.x,
    prevSegment.y,
    prevSegment.z,
    tangent.x,
    tangent.y,
    tangent.z,
    uv_u,
    uv_v
  ]
}
