export type GridPointCoordinate = {layer: number; row: number; col: number}
/**
 * Spatial grid for fast lookup of snapping points
 * Uses a flat map to quickly iterate over all points in a given radius
 */
export type CoordinateKey = `${number},${number},${number}`
export class SpatialGrid {
  // Map in the format of {`x,y,z` -> [{coords: vec3, layer: number, row: number, col: number}]}; example: {`100, 200, 300` => [{x: 100, y: 200, z: 300}, 3, 1, 2]}
  public grid = new Map<CoordinateKey, Array<{coords: vec3} & GridPointCoordinate>>()
  private cellSize = 25.0

  addPoint(coords: vec3, layer: number, row: number, col: number) {
    const key = this.getGridKey(coords)
    if (!this.grid.has(key)) {
      this.grid.set(key, [])
    }
    this.grid.get(key)!.push({coords, layer, row, col})
  }

  private getGridKey(coords: vec3): CoordinateKey {
    const x = Math.floor(coords.x / this.cellSize)
    const y = Math.floor(coords.y / this.cellSize)
    const z = Math.floor(coords.z / this.cellSize)
    return `${x},${y},${z}`
  }

  private getOffsetKey(centerKey: CoordinateKey, dx: number, dy: number, dz: number): CoordinateKey {
    const [x, y, z] = centerKey.split(",").map(Number)
    return `${x + dx},${y + dy},${z + dz}`
  }

  findClosestPoint(objectPos: vec3, snapDistance: number): ({coords: vec3} & GridPointCoordinate) | null {
    const searchRadius = Math.ceil(snapDistance / this.cellSize)
    const centerKey = this.getGridKey(objectPos)

    for (let dx = -searchRadius; dx <= searchRadius; dx++) {
      for (let dy = -searchRadius; dy <= searchRadius; dy++) {
        for (let dz = -searchRadius; dz <= searchRadius; dz++) {
          const key = this.getOffsetKey(centerKey, dx, dy, dz)
          const points = this.grid.get(key)
          if (points) {
            for (const point of points) {
              const distance = objectPos.distance(point.coords)
              if (distance < snapDistance) {
                return point
              }
            }
          }
        }
      }
    }
    return null
  }
}
