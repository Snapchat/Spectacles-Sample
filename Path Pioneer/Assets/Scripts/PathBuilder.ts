export namespace PathBuilder {
  export function buildFromPoints(points: vec3[], width: number): RenderMesh {
    const builder = new MeshBuilder([
      // vertex position (x,y,z)
      {name: "position", components: 3},
      // normal vector (x,y,z)
      {name: "normal", components: 3, normalized: true},
      // UV
      {name: "texture0", components: 2}
    ])

    builder.topology = MeshTopology.Triangles
    builder.indexType = MeshIndexType.UInt16

    const upVec = vec3.up()

    const verticesAndNormals: [[vec3, vec3, number], [vec3, vec3, number]][] = []
    const vertices: number[] = []

    let prevLeft: vec3 | null = null
    let prevRight: vec3 | null = null
    let lengthLeft: number = 0
    let lengthRight: number = 0

    for (let i = 0; i < points.length; i++) {
      let fwd: vec3 | undefined
      if (i < points.length - 1) {
        fwd = points[i + 1].sub(points[i])
      } else {
        fwd = points[i].sub(points[i - 1])
      }
      const up = upVec.projectOnPlane(fwd).normalize()
      const right = fwd.cross(up)
      if (fwd.length == 0) {
        continue
      }
      const rightScale = right.normalize().uniformScale(width / 2)
      const leftScale = rightScale.uniformScale(-1)

      const leftPoint = points[i].add(leftScale)
      const rightPoint = points[i].add(rightScale)

      if (prevLeft) {
        lengthLeft += leftPoint.distance(prevLeft)
      }
      if (prevRight) {
        lengthRight += rightPoint.distance(prevRight)
      }
      prevLeft = leftPoint
      prevRight = rightPoint
      verticesAndNormals.push([
        [leftPoint, up, lengthLeft],
        [rightPoint, up, lengthRight]
      ])
    }

    const maxDistance = Math.max(
      verticesAndNormals[verticesAndNormals.length - 1][0][2],
      verticesAndNormals[verticesAndNormals.length - 1][1][2]
    )

    for (let i = 0; i < verticesAndNormals.length; i++) {
      const uvLeftX = 0
      const uvRightX = 1
      const [leftPoint, leftUp, leftLength] = verticesAndNormals[i][0]
      const [rightPoint, rightUp, rightLength] = verticesAndNormals[i][1]
      const uvLeftY = Math.max(leftLength, rightLength) / width
      const uvRightY = Math.max(leftLength, rightLength) / width
      vertices.push(leftPoint.x, leftPoint.y, leftPoint.z, leftUp.x, leftUp.y, leftUp.z, uvLeftX, uvLeftY)
      vertices.push(rightPoint.x, rightPoint.y, rightPoint.z, rightUp.x, rightUp.y, rightUp.z, uvRightX, uvRightY)
    }

    builder.appendVerticesInterleaved(vertices)
    const indices: number[] = []

    for (let i = 0; i < verticesAndNormals.length - 1; i++) {
      const leftIndex = i * 2
      const rightIndex = i * 2 + 1
      const leftIndexNext = leftIndex + 2
      const rightIndexNext = rightIndex + 2
      indices.push(leftIndex, rightIndex, leftIndexNext)
      indices.push(rightIndexNext, leftIndexNext, rightIndex)
    }

    builder.appendIndices(indices)
    builder.updateMesh()

    return builder.getMesh()
  }
}
