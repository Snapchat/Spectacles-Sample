export const enum LayoutDirection {
  "Row" = 0,
  "Column" = 1
}

/**
 * position callback arguments
 */
export class PositionCallbackArgs {
  row: number
  column: number
}

interface PositionCallback {
  (args: PositionCallbackArgs): vec3
}

/**
 *
 * Low Level Layout Component
 * Set a base CellSize in local space
 * Define a number of Rows And Columns
 * And it will create a list or grid in the specified shape
 *
 */
@component
export class GridLayout extends BaseScriptComponent {
  @input("int")
  @hint("Number of Rows")
  rows: number = 3
  @input("int")
  @hint("Number of Columns")
  columns: number = 2

  @input("vec2", "{32,32}")
  @hint("Size of a single cell in local space")
  cellSize: vec2 = new vec2(32, 32)

  @input("vec4", "{0,0,0,0}")
  @hint(
    "<p>Add'l size added to a given side of a cell.</p><p>Clockwise from left:</p><code> Left, Top, Right, Bottom </code>"
  )
  cellPadding: vec4 = new vec4(0, 0, 0, 0)

  @input("number", "0")
  @widget(new ComboBoxWidget([new ComboBoxItem("Row", 0), new ComboBoxItem("Column", 1)]))
  @hint(
    "<h3>Layout by Row:</h3><p>start at top left, layout top row, then second from top row, etc. Overflows vertically. </p> <h3>Layout by Column:</h3> <p>start at top left, layout left column, then second from left column, etc. Overflows horizontally.</p>"
  )
  layoutBy: LayoutDirection

  transform: Transform = this.getTransform()

  private children: SceneObject[] = []

  private initialized: boolean = false

  private showDebug = false

  /**
   * callback for each child on layout
   * @input row, column
   * use for advanced positioning per item
   */
  public positionCallback: PositionCallback | null = null

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize)
  }

  /**
   * initialization function
   * call on next line after programmatically creating component
   * to prevent a flash of unstyled content
   */
  initialize = (): void => {
    if (this.initialized) return

    this.layout()

    this.createEvent("UpdateEvent").bind(this.update)

    this.initialized = true
  }

  get isInitialized(): boolean {
    return this.initialized
  }

  /**
   * call this function to lay out the children of this scene object
   * according to the parameters set in the component
   * will change their local transform
   */
  layout = () => {
    this.children = this.sceneObject.children
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      const transform = child.getTransform()
      let column, row
      if (this.layoutBy === LayoutDirection.Column) {
        column = Math.floor(i / this.rows)
        row = i % this.rows
      } else {
        column = i % this.columns
        row = Math.floor(i / this.columns)
      }

      const layoutPosition = this.calculateChildPosition(column, row)
      layoutPosition.x = layoutPosition.x + (this.cellPadding.x + this.cellPadding.z) * 0.5 - this.cellPadding.z
      layoutPosition.y = layoutPosition.y - (this.cellPadding.y + this.cellPadding.w) * 0.5 + this.cellPadding.w
      transform.setLocalPosition(layoutPosition)
    }
  }

  get totalCellSize(): vec2 {
    const totalSize = vec2.zero()
    totalSize.x = this.cellSize.x + this.cellPadding.x + this.cellPadding.z
    totalSize.y = this.cellSize.y + this.cellPadding.y + this.cellPadding.w
    return totalSize
  }

  get aabbMin(): vec3 {
    const totalCellSize = this.totalCellSize
    const leftEdge = this.columns * totalCellSize.x * -0.5
    let rowCount
    if (this.layoutBy === LayoutDirection.Row) {
      rowCount = Math.ceil(this.children.length / this.columns)
    } else if (this.layoutBy === LayoutDirection.Column) {
      rowCount = Math.min(this.children.length, this.rows)
    }
    const bottomEdge = this.rows * totalCellSize.y * 0.5 + rowCount * -totalCellSize.y
    return this.transform.getWorldTransform().multiplyPoint(new vec3(leftEdge, bottomEdge, 0))
  }

  get aabbMax(): vec3 {
    const totalCellSize = this.totalCellSize
    const topEdge = this.rows * totalCellSize.y * 0.5
    let columnCount
    if (this.layoutBy === LayoutDirection.Row) {
      columnCount = Math.min(this.children.length, this.columns)
    } else if (this.layoutBy === LayoutDirection.Column) {
      columnCount = Math.ceil(this.children.length / this.rows)
    }
    const rightEdge = this.columns * totalCellSize.x * -0.5 + columnCount * totalCellSize.x
    return this.transform.getWorldTransform().multiplyPoint(new vec3(rightEdge, topEdge, 0))
  }

  /**
   * @returns total number of rows in grid
   */
  get totalRows(): number {
    return this.layoutBy === LayoutDirection.Row ? Math.ceil(this.children.length / this.columns) : this.rows
  }

  /**
   * @returns total number of columns in grid
   */
  get totalColumns(): number {
    return this.layoutBy === LayoutDirection.Column ? Math.ceil(this.children.length / this.rows) : this.columns
  }

  /**
   *
   * @param x x index of target
   * @param y y index of target
   * @returns SceneObject at x, y in grid
   */
  getCellSceneObject = (x: number, y: number): SceneObject => {
    let i
    if (this.layoutBy === LayoutDirection.Column) {
      i = x * this.rows
      i += y % this.rows
    } else {
      i = y * this.columns
      i += x % this.columns
    }
    return this.children[i]
  }

  /**
   *
   * @param gridColumn of target cell
   * @param gridRow of target cell
   * @returns position of cell at column and row
   */
  calculateChildPosition(gridColumn: number, gridRow: number): vec3 {
    const baseX = this.columns * this.totalCellSize.x * -0.5
    const baseY = this.rows * this.totalCellSize.y * 0.5

    let position = vec3.zero()

    position.y = baseY - gridRow * this.totalCellSize.y - this.totalCellSize.y * 0.5
    position.x = baseX + gridColumn * this.totalCellSize.x + this.totalCellSize.x * 0.5

    if (this.positionCallback) {
      const offset = this.repositionFunction({column: gridColumn, row: gridRow})
      position = position.add(offset)
    }

    return position
  }

  private repositionFunction = (args: PositionCallbackArgs): vec3 => {
    return this.positionCallback(args)
  }

  private update = () => {
    if (this.showDebug) {
      this.debugRender()
    }
  }

  /**
   * internal only debug render helper
   * to remove before distribution
   */
  private debugRender = () => {
    const worldPos = this.getTransform().getWorldPosition()
    for (let i = 0; i < this.children.length; i++) {
      let column, row
      if (this.layoutBy === LayoutDirection.Column) {
        column = Math.floor(i / this.rows)
        row = i % this.rows
      } else {
        column = i % this.columns
        row = Math.floor(i / this.columns)
      }

      const layoutPosition = this.calculateChildPosition(column, row)

      const totalCellSize = this.totalCellSize
      global.debugRenderSystem.drawBox(
        layoutPosition.add(worldPos),
        totalCellSize.x,
        totalCellSize.y,
        totalCellSize.x,
        new vec4(1, 1, 1, 1)
      )
    }

    global.debugRenderSystem.drawSphere(this.aabbMin, 4, new vec4(1, 0, 0, 1))
    global.debugRenderSystem.drawSphere(this.aabbMax, 4, new vec4(1, 0, 0, 1))
    global.debugRenderSystem.drawSphere(this.transform.getWorldPosition(), 4, new vec4(0, 1, 1, 1))
  }
}
