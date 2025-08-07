import {GridLayout, LayoutDirection} from "../GridLayout/GridLayout"
import {ScrollWindow, VisibleWindow} from "../ScrollWindow/ScrollWindow"

@component
export class ScrollLayout extends BaseScriptComponent {
  @input("int")
  @hint("Number of Rows")
  rows: number = 3
  @input("int")
  @hint("Number of Columns")
  columns: number = 2

  @input("vec2", "{32,32}")
  @hint("Size of content in single cell in local space")
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

  @input("vec3", "{0,0,0}")
  @hint("Full local transform offset for the whole grid")
  gridOffset: vec3 = vec3.zero()

  public gridLayoutObject: SceneObject = global.scene.createSceneObject("GridLayout")
  public gridLayout: GridLayout
  public scrollWindow: ScrollWindow

  private initialized: boolean = false

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.initialize)
  }

  /**
   *
   * initialization function, must run once
   *
   */
  initialize = () => {
    if (this.initialized) return

    // re-parent children to gridLayoutObject
    while (this.sceneObject.children.length > 0) {
      const child = this.sceneObject.children[0]
      child.setParent(this.gridLayoutObject)
    }

    // create and initialize grid layout component
    this.gridLayout = this.gridLayoutObject.createComponent(GridLayout.getTypeName())
    this.gridLayout.columns = this.columns
    this.gridLayout.rows = this.rows
    this.gridLayout.cellSize = this.cellSize
    this.gridLayout.cellPadding = this.cellPadding
    this.gridLayout.layoutBy = this.layoutBy
    this.gridLayoutObject.setParent(this.sceneObject)
    this.gridLayout.initialize()

    // create and initialize scrollWindow component
    this.scrollWindow = this.sceneObject.createComponent(ScrollWindow.getTypeName())
    this.scrollWindow.initialize()

    // then initialize scrollWindow
    // and reposition gridLayout content to be at start of scroll
    // based on layout direction
    if (this.layoutBy === LayoutDirection.Row) {
      this.scrollWindow.setWindowSize(
        new vec2(
          this.gridLayout.totalColumns * this.gridLayout.totalCellSize.x,
          this.rows * this.gridLayout.totalCellSize.y
        )
      )

      this.gridLayout.transform.setLocalPosition(
        new vec3(
          0,
          this.gridLayout.totalRows * this.gridLayout.totalCellSize.y * 0.5 +
            this.rows * this.gridLayout.totalCellSize.y * -0.5,

          0
        ).add(this.gridOffset)
      )

      this.scrollWindow.horizontal = false
      this.scrollWindow.vertical = true
    } else {
      this.scrollWindow.setWindowSize(
        new vec2(
          this.columns * this.gridLayout.totalCellSize.x,
          this.gridLayout.totalRows * this.gridLayout.totalCellSize.y
        )
      )

      this.gridLayout.transform.setLocalPosition(
        new vec3(
          -this.gridLayout.totalColumns * this.gridLayout.totalCellSize.x * 0.5 +
            this.columns * this.gridLayout.totalCellSize.x * 0.5,
          0,
          0
        ).add(this.gridOffset)
      )
      this.scrollWindow.horizontal = true
      this.scrollWindow.vertical = false
      this.scrollWindow.scrollPositionNormalized = new vec2(-1, 0)
    }

    this.scrollWindow.setScrollDimensions(
      new vec2(
        this.gridLayout.totalColumns * this.gridLayout.totalCellSize.x,
        this.gridLayout.totalRows * this.gridLayout.totalCellSize.y
      )
    )

    // scroll to beginning
    if (this.layoutBy === LayoutDirection.Row) {
      this.scrollWindow.scrollPositionNormalized = new vec2(0, 1)
    } else {
      this.scrollWindow.scrollPositionNormalized = new vec2(-1, 0)
    }

    this.initialized = true
  }

  /**
   * move to given row
   * @param row destination for move
   * @param duration optional parameter for tween duration, leave undefined if immediate
   */
  gotoRow = (row: number, duration?: number) => {
    const currentScrollPos = this.scrollWindow.scrollPosition
    const halfWindowHeight = this.scrollWindow.getWindowSize().y * 0.5
    currentScrollPos.y =
      row * this.gridLayout.totalCellSize.y -
      this.gridLayout.totalRows * this.gridLayout.totalCellSize.y * 0.5 +
      halfWindowHeight

    if (currentScrollPos.y > this.scrollWindow.getScrollDimensions().y * 0.5 - halfWindowHeight)
      currentScrollPos.y = this.scrollWindow.getScrollDimensions().y * 0.5 - halfWindowHeight

    if (duration) {
      this.scrollWindow.tweenTo(currentScrollPos, duration)
    } else {
      this.scrollWindow.scrollPosition = currentScrollPos
    }
  }

  /**
   * move to given column
   * @param column destination for move
   * @param duration optional parameter for tween duration, leave undefined if immediate
   */
  gotoColumn = (column: number, duration?: number) => {
    const currentScrollPos = this.scrollWindow.scrollPosition
    const halfWindowWidth = this.scrollWindow.getWindowSize().x * 0.5
    currentScrollPos.x =
      this.gridLayout.totalColumns * this.gridLayout.totalCellSize.x * 0.5 -
      column * this.gridLayout.totalCellSize.x -
      halfWindowWidth

    if (currentScrollPos.x < this.scrollWindow.getScrollDimensions().x * -0.5 + halfWindowWidth)
      currentScrollPos.x = this.scrollWindow.getScrollDimensions().x * -0.5 + halfWindowWidth

    if (duration) {
      this.scrollWindow.tweenTo(currentScrollPos, duration)
    } else {
      this.scrollWindow.scrollPosition = currentScrollPos
    }
  }

  /**
   * AABB test cell at Z depth 0 to check if in viewport
   * @param column or X position in layout of cell
   * @param row or Y position in layout of cell
   * @returns true if any part of cell is in viewport and false if it is fully out
   */
  isCellInViewport = (column: number, row: number): boolean => {
    let gridPos: vec3 | vec2 = this.gridLayout.calculateChildPosition(column, row)
    gridPos = new vec2(gridPos.x, gridPos.y)
    const visibleWindow: VisibleWindow = this.scrollWindow.getVisibleWindow()
    const gridOffset = this.gridLayout.transform.getLocalPosition()
    const currentPos = gridPos.add(new vec2(gridOffset.x, gridOffset.y))
    const cellSize = this.gridLayout.totalCellSize
    const cellMin = currentPos.sub(cellSize.uniformScale(0.5))
    const cellMax = currentPos.add(cellSize.uniformScale(0.5))

    let inViewport = false

    if (
      cellMin.x < visibleWindow.topRight.x &&
      cellMax.x > visibleWindow.bottomLeft.x &&
      cellMin.y < visibleWindow.topRight.y &&
      cellMax.y > visibleWindow.bottomLeft.y
    ) {
      // in x
      inViewport = true
    }

    return inViewport
  }
}
