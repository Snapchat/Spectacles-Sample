/**
 * This class customizes a mesh visual to create an extendable capsule shape. It allows configuration of the capsule's
 * length, radius, and poly-count through various input properties.
 */
@component
export class CapsuleMeshCustomizer extends BaseScriptComponent {
  /**
   * The mesh visual to modify into an extendable capsule.
   */
  @input
  @hint("The mesh visual to modify into an extendable capsule.")
  private meshVisual!: RenderMeshVisual
  /**
   * The length of the capsule, excluding the end caps.
   */
  @input
  @hint("The length of the cylindric section of the capsule (not including the end caps).")
  private capsuleLength: number = 10.0
  /**
   * The radius of the end caps and the radius of the cylindric section.
   */
  @input
  @hint("The radius of the end caps and the radius of the cylindric section.")
  private radius: number = 1.0
  /**
   * The number of points per circle in the mesh. Increase for a higher poly-count mesh.
   */
  @input("int")
  @hint("The number of points per circle in the mesh. Increase for a higher poly-count mesh.")
  private radianStepCount: number = 16
  /**
   * The number of circles in the cylinder of the mesh. Increase for a higher poly-count mesh.
   */
  @input("int")
  @hint("The number of circles in the cylinder of the mesh. Increase for a higher poly-count mesh.")
  private cylinderStepCount: number = 16
  /**
   * The number of circles in the end cap of the capsule mesh. Increase for a higher poly-count mesh.
   */
  @input("int")
  @hint("The number of circles in the end cap of the capsule mesh. Increase for a higher poly-count mesh.")
  private endXStepCount: number = 32

  private uLength: number = Math.PI * this.radius * this.radius
  private endPointNormals: number[] = [1, 0, 0, -1, 0, 0]
  private endPointUVs: number[] = [0, 0.5, 0.5, 0.5]

  private builder: MeshBuilder = new MeshBuilder([
    {name: "position", components: 3},
    {name: "normal", components: 3, normalized: true},
    {name: "texture0", components: 2}
  ])

  onAwake(): void {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  init(): void {
    this.builder.topology = MeshTopology.Triangles
    this.builder.indexType = MeshIndexType.UInt16

    this.buildCapsule()
  }

  private buildCircle(originX: number, radius: number, isEnd: boolean) {
    let points: number[] = []
    let normals: number[] = []
    let uvs: number[] = []

    let uProportion: number

    if (isEnd) {
      let arcLength: number
      if (originX < 0) {
        arcLength = (((this.radius + this.capsuleLength / 2 + originX) / this.radius) * this.uLength) / 4
      } else {
        arcLength =
          ((1 - (this.radius + this.capsuleLength / 2 - originX) / this.radius) * this.uLength) / 4 + this.uLength / 4
      }
      uProportion = arcLength
    } else {
      uProportion = this.uLength / 4
    }

    for (let i = -Math.PI / 2; i < 1.5 * Math.PI; i += Math.PI / this.radianStepCount) {
      const point = [originX, radius * Math.sin(i), radius * Math.cos(i)]
      const normal = [0, -radius * Math.sin(i), -radius * Math.cos(i)]

      const firstHalf = i <= Math.PI / 2

      let u = uProportion / this.uLength

      if (!firstHalf) {
        u = 1 - u
      }

      const uv = [u, 0.5 + radius * Math.sin(i) * 0.5]

      points = points.concat(point)
      normals = normals.concat(normal)
      uvs = uvs.concat(uv)
    }
    return [points, normals, uvs]
  }

  private buildCylinder(length: number, radius: number) {
    let points: number[] = []
    let normals: number[] = []
    let uvs: number[] = []

    for (let circleCount = 0; circleCount < this.cylinderStepCount; circleCount++) {
      const i = -length / 2 + (circleCount * length) / this.cylinderStepCount
      const circleData = this.buildCircle(i, radius, false)

      points = points.concat(circleData[0])
      normals = normals.concat(circleData[1])
      uvs = uvs.concat(circleData[2])
    }
    return [points, normals, uvs]
  }

  private buildEndCap(originX: number, radius: number, isRight: boolean) {
    let points: number[] = []
    let normals: number[] = []
    let uvs: number[] = []

    const step = radius / this.endXStepCount
    for (let i = isRight ? step : -radius + step; i < (isRight ? radius : 0); i += step) {
      const crossSectionRadius = Math.sqrt(radius ** 2 - i ** 2)
      const circleData = this.buildCircle(i + originX, crossSectionRadius, true)

      points = points.concat(circleData[0])

      for (let j = 0; j < this.radianStepCount * 2; j++) {
        circleData[1][j * 3] = -i
      }
      normals = normals.concat(circleData[1])
      uvs = uvs.concat(circleData[2])
    }

    return [points, normals, uvs]
  }

  // TODO: Investigate, circleIndexB is never used.
  private linkCircleIndices(circleIndexA: number, _circleIndexB: number) {
    let indices: number[] = []
    const numPoints = this.radianStepCount * 2

    const firstIndex = circleIndexA * numPoints
    for (let i = firstIndex; i < (circleIndexA + 1) * numPoints - 1; i++) {
      indices = indices.concat([i + 1, i + numPoints, i])
      indices = indices.concat([i + 1, i + numPoints + 1, i + numPoints])
    }
    const lastIndex = (circleIndexA + 1) * numPoints - 1
    indices = indices.concat([
      firstIndex,
      lastIndex + numPoints,
      lastIndex,
      firstIndex,
      firstIndex + numPoints,
      lastIndex + numPoints
    ])

    return indices
  }

  private linkCapsuleIndices() {
    let indices: number[] = []
    const numCircles = (this.endXStepCount - 1) * 2 + this.cylinderStepCount

    for (let i = 0; i < numCircles - 1; i++) {
      indices = indices.concat(this.linkCircleIndices(i, i + 1))
    }

    return indices
  }

  private linkEndIndices(endIndex: number, circleIndex: number, isRight: boolean) {
    let indices: number[] = []
    const numPoints = this.radianStepCount * 2

    const firstIndex = circleIndex * numPoints
    for (let i = firstIndex; i < firstIndex + numPoints - 1; i++) {
      if (isRight) {
        indices = indices.concat([i + 1, endIndex, i])
      } else {
        indices = indices.concat([endIndex, i + 1, i])
      }
    }
    const lastIndex = (circleIndex + 1) * numPoints - 1
    if (isRight) {
      indices = indices.concat([firstIndex, endIndex, lastIndex])
    } else {
      indices = indices.concat([endIndex, firstIndex, lastIndex])
    }

    return indices
  }

  private checkValid() {
    return this.radius === 0 || this.radianStepCount === 0 || this.cylinderStepCount === 0 || this.endXStepCount === 0
  }

  private buildCapsule() {
    if (this.checkValid()) {
      throw new Error("Step counts and radius must be positive, whole numbers.")
    }

    if (this.builder.getIndicesCount() !== 0) {
      this.builder.eraseIndices(0, this.builder.getIndicesCount())
    }
    if (this.builder.getVerticesCount() !== 0) {
      this.builder.eraseVertices(0, this.builder.getVerticesCount())
    }

    const leftEndCap = this.buildEndCap(-this.capsuleLength / 2, this.radius, false)
    const cylinder = this.buildCylinder(this.capsuleLength, this.radius)
    const rightEndCap = this.buildEndCap(this.capsuleLength / 2, this.radius, true)

    const endPoints = [
      [-this.capsuleLength / 2 - this.radius, 0, 0, this.capsuleLength / 2 + this.radius, 0, 0],
      this.endPointNormals,
      this.endPointUVs
    ]

    this.builder.appendVertices(leftEndCap)
    this.builder.appendVertices(cylinder)
    this.builder.appendVertices(rightEndCap)

    this.builder.appendVertices(endPoints)

    this.builder.appendIndices(this.linkCapsuleIndices())

    this.builder.appendIndices(
      this.linkEndIndices(
        this.builder.getVerticesCount() - 1,
        (this.endXStepCount - 1) * 2 + this.cylinderStepCount - 1,
        true
      )
    )
    this.builder.appendIndices(this.linkEndIndices(this.builder.getVerticesCount() - 2, 0, false))

    if (this.builder.isValid()) {
      this.meshVisual.mesh = this.builder.getMesh()
      this.builder.updateMesh()
    } else {
      throw new Error("Invalid mesh, check parameters to ensure positive whole numbers for vertex counts!")
    }
  }

  setLength(newLength: number): void {
    this.capsuleLength = newLength
    this.buildCapsule()
  }

  setRadius(newRadius: number): void {
    this.radius = newRadius
    this.buildCapsule()
  }

  setRadianStepCount(newCount: number): void {
    this.radianStepCount = newCount
    this.buildCapsule()
  }

  setCylinderStepCount(newCount: number): void {
    this.cylinderStepCount = newCount
    this.buildCapsule()
  }

  setEndXStepCount(newCount: number): void {
    this.endXStepCount = newCount
    this.buildCapsule()
  }
}
