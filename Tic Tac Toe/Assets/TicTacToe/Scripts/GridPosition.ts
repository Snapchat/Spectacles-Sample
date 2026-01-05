import {GRID_SPACING, GRID_X_OFFSET, GRID_Z_OFFSET} from "./constants"

@component
export class GridPosition extends BaseScriptComponent {
  @input
  layer: number
  @input
  row: number
  @input
  col: number

  constructor() {
    super()
    this.getTransform().setLocalPosition(
      new vec3(
        (this.col + 1) * -GRID_SPACING - GRID_X_OFFSET,
        (this.row + 1) * -GRID_SPACING,
        (this.layer + 1) * -GRID_SPACING - GRID_Z_OFFSET
      )
    )
  }

  getCoordinates() {
    return {
      layer: this.layer,
      row: this.row,
      col: this.col
    }
  }

  getPosition() {
    return this.getTransform().getWorldPosition()
  }
}
