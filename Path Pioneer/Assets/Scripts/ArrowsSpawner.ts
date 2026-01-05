import {CatmullRomSpline} from "./Helpers/CatmullRomSpline"
import {GetVectorsFromQuaternion} from "./Helpers/GetVectorsFromQuaternion"
import {LensInitializer} from "./LensInitializer"

interface SpawnedArrowData {
  pointPosition: vec3
  objects: SceneObject[]
  id: number
}

@component
export class ArrowsSpawner extends BaseScriptComponent {
  @input
  private mainCamera: Camera
  private mainCameraT: Transform

  @input
  private maxArrows: number

  @input
  private revealDistance: number = 1000

  @input
  private minimalDistanceBetweenArrows: number = 100

  @input
  private pfbSideArrow: ObjectPrefab

  @input
  private arrowMaterial: Material

  private updateEvent: SceneEvent
  private positions: vec3[] = []
  private spawnedArrows: SpawnedArrowData[] = []
  private nextId: number
  private vec3up: vec3 = vec3.up()
  private splinePoints: {position: vec3; rotation: quat}[] = []
  private pathLength: number

  start(arrowsPositions: vec3[], mySplinePoints: {position: vec3; rotation: quat}[], myPathLength: number) {
    this.clearState()
    this.nextId = 0

    this.splinePoints = mySplinePoints
    this.pathLength = myPathLength

    // clear some points from beginning and end
    const offset = 7
    if (arrowsPositions.length > offset + 1) {
      arrowsPositions = arrowsPositions.slice(offset - 1, arrowsPositions.length - 1)
    }
    if (arrowsPositions.length > offset + 1) {
      arrowsPositions = arrowsPositions.slice(0, -offset)
    }

    this.positions = arrowsPositions
    this.updateEvent.enabled = true
  }

  stop() {
    this.updateEvent.enabled = false
    this.clearState()
  }

  clearState() {
    this.spawnedArrows.forEach((i) => {
      i.objects.forEach((o) => {
        o.destroy()
      })
    })
    this.spawnedArrows = []
  }

  onAwake() {
    this.updateEvent = this.createEvent("UpdateEvent")
    this.updateEvent.enabled = false
    this.updateEvent.bind(() => {
      this.onUpdate()
    })
    this.mainCameraT = this.mainCamera.getTransform()
  }

  private onUpdate() {
    this.trySpawnNextArrows()
  }

  private getSpawnedArrowsCount() {
    return this.spawnedArrows.length
  }

  private getArrowsLimit() {
    return this.maxArrows
  }

  private tryGetNextArrowPositionAndRotation() {
    const currentOldest = this.tryGetOldestArrowPositionAndRotation()
    const currentOldestId = currentOldest ? currentOldest.id : -1
    if (this.nextId < this.positions.length && this.nextId != currentOldestId) {
      return this.positions[this.nextId]
    }
    return null
  }

  private tryGetOldestArrowPositionAndRotation() {
    if (this.spawnedArrows.length) {
      return this.spawnedArrows[0]
    }
    return null
  }

  private removeOldestArrow() {
    if (this.spawnedArrows.length == 0) {
      throw new Error("No arrows spawned")
    }
    this.spawnedArrows[0].objects.forEach((o) => o.destroy())
    this.spawnedArrows.shift()
  }

  private getDistanceOnSpline(posA: vec3, posB: vec3) {
    const tA = CatmullRomSpline.worldToSplineSpace(posA, this.splinePoints).t
    const tB = CatmullRomSpline.worldToSplineSpace(posB, this.splinePoints).t
    const dist = Math.abs(tA - tB) * this.pathLength
    return dist
  }

  private incrementNextId(currentPosition: vec3) {
    const currentOldest = this.tryGetOldestArrowPositionAndRotation()
    if (!currentOldest) {
      throw new Error(
        "Cannot increment next id. Current oldest is null. This potentially means that we tried to increment id before spawning the arrow"
      )
    }
    const currentOldestId = currentOldest.id
    while (
      this.nextId < this.positions.length &&
      this.getDistanceOnSpline(this.positions[this.nextId], currentPosition) < this.minimalDistanceBetweenArrows
    ) {
      this.nextId++
      if (this.nextId >= this.positions.length) {
        this.nextId = 0
      }
      if (this.nextId == currentOldestId) {
        break
      }
    }
  }

  private spawnNextArrow() {
    if (this.nextId >= this.positions.length) {
      throw new Error("No position to spawn next arrow")
    }
    const currentId = this.nextId
    const currentPosition = this.positions[currentId]
    let posA: vec3 = null
    let posB: vec3 = null
    if (this.positions.length > currentId + 1) {
      posA = this.positions[currentId]
      posB = this.positions[currentId + 1]
    } else {
      posA = this.positions[currentId - 1]
      posB = this.positions[currentId]
    }
    let fwd = posB.sub(posA)
    fwd = fwd.normalize()

    let up = this.vec3up.projectOnPlane(fwd)
    up = up.normalize()
    const rot = quat.lookAt(fwd, up)

    const {leftArrow, rightArrow} = this.instantiateSideArrowObj(currentPosition, rot) // pass pos and rot
    this.spawnedArrows.push({
      pointPosition: currentPosition,
      objects: [leftArrow, rightArrow],
      id: currentId
    })
    this.incrementNextId(currentPosition)
  }

  private instantiateSideArrowObj(position: vec3, rotation: quat) {
    const radius = 120
    const height = 45

    const {forward, right, up} = GetVectorsFromQuaternion.getInstance().getVectorsFromQuaternion(rotation)
    const rightPos = position.add(right.uniformScale(radius)).add(up.uniformScale(height))
    const leftPos = position.add(right.uniformScale(-radius)).add(up.uniformScale(height))

    const rightRot = quat.angleAxis(Math.PI / 3, forward).multiply(rotation)
    const leftRot = quat.angleAxis(-Math.PI / 3, forward).multiply(rotation)

    const leftArrow = this.pfbSideArrow.instantiate(null)
    leftArrow.getTransform().setWorldPosition(rightPos)
    leftArrow.getTransform().setWorldRotation(rightRot)
    // Hack to aid artist need to see realtime material changes to spawned arrow
    leftArrow.getChild(0).getChild(0).getComponent("RenderMeshVisual").mainMaterial = this.arrowMaterial

    const rightArrow = this.pfbSideArrow.instantiate(null)
    rightArrow.getTransform().setWorldPosition(leftPos)
    rightArrow.getTransform().setWorldRotation(leftRot)
    // Hack to aid artist need to see realtime material changes to spawned arrow
    rightArrow.getChild(0).getChild(0).getComponent("RenderMeshVisual").mainMaterial = this.arrowMaterial

    return {leftArrow, rightArrow}
  }

  private trySpawnNextArrows() {
    const currentPosition = LensInitializer.getInstance().getPlayerGroundPos()
    const spawnedArrowsCount = this.getSpawnedArrowsCount()
    const limit = this.getArrowsLimit()
    if (spawnedArrowsCount >= limit) {
      const nextArrow = this.tryGetNextArrowPositionAndRotation()
      if (isNull(nextArrow)) {
        return
      }
      const oldestArrow = this.tryGetOldestArrowPositionAndRotation()
      const toNext = this.getDistanceOnSpline(nextArrow, currentPosition)
      const toOldest = oldestArrow ? this.getDistanceOnSpline(oldestArrow.pointPosition, currentPosition) : Infinity
      if (toNext < toOldest && toNext < this.revealDistance) {
        this.removeOldestArrow()
        this.spawnNextArrow()
      }
    } else {
      const canSpawn = limit - spawnedArrowsCount
      for (let i = 0; i < canSpawn; i++) {
        const nextArrow = this.tryGetNextArrowPositionAndRotation()
        if (isNull(nextArrow)) {
          break
        }
        this.spawnNextArrow()
      }
    }
  }
}
