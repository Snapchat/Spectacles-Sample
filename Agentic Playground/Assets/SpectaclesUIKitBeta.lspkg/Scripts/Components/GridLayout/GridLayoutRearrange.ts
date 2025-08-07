import {ButtonGrid} from "../Button/ButtonGrid"
import {InteractableManipulation} from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
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

/**
 * Represents the state of a dragged item
 */
class DragState {
  draggedObject: SceneObject | null = null
  originalIndex: number = -1
  originalPositions: vec3[] = []
  isDragging: boolean = false
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
export class GridLayoutRearrange extends BaseScriptComponent {
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

  @input("number", "0.8")
  @hint("Lerp speed for smooth rearrangement movement (0-1)")
  rearrangeLerpSpeed: number = 0.8

  @input("boolean", "true")
  @hint("Enable grid rearrangement functionality with InteractableManipulation")
  enableRearrangement: boolean = true

  transform: Transform = this.getTransform()

  private children: SceneObject[] = []
  private dragState: DragState = new DragState()
  private gridPlaneNormal: vec3 = vec3.forward()
  private gridPlaneCenter: vec3 = vec3.zero()

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
    this.createEvent("UpdateEvent").bind(this.update)
  }

  /**
   * initialization function
   * call on next line after programmatically creating component
   * to prevent a flash of unstyled content
   */
  initialize = (): void => {
    if (this.initialized) return

    this.layout()
    this.setupDragInteractions()

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
    
    // Update drag interactions when children change
    if (this.initialized && this.enableRearrangement) {
      this.setupDragInteractions()
    }
    
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

  /**
   * Sets up manipulation event listeners for all child objects with InteractableManipulation
   */
  private setupDragInteractions(): void {
    if (!this.enableRearrangement) return

    print("Setting up drag interactions for " + this.children.length + " children")

    this.children.forEach((child, index) => {
      print("Checking child " + index + " (" + child.name + ")")
      
      // Try to access InteractableManipulation component using proper syntax
      let manipulationComponent: any = null
      
      try {
        // Use type casting to get around TypeScript restrictions
        manipulationComponent = child.getComponent(
      InteractableManipulation.getTypeName()
    );
        print("Found InteractableManipulation component on child " + index)
      } catch (error) {
        print("Could not access InteractableManipulation on child " + index + ": " + error)
        
        // Fallback: Let's see what components are actually available
        try {
          const allComponents = child.getAllComponents()
          const componentNames = allComponents.map(comp => comp.getTypeName()).join(", ")
          print("Available components on child " + index + ": " + componentNames)
        } catch (debugError) {
          print("Could not list components: " + debugError)
        }
      }
      
      if (manipulationComponent && manipulationComponent.onManipulationStart) {
        // Create callback functions like your example
        const onManipulationStartCallback = () => {
          this.startDrag(child, index)
          print("Manipulation start callback triggered for index: " + index)
        }
        
        const onManipulationEndCallback = () => {
          this.endDrag()
          print("Manipulation end callback triggered for index: " + index)
        }
        
        // Add the event listeners to the manipulation component
        manipulationComponent.onManipulationStart.add(onManipulationStartCallback)
        manipulationComponent.onManipulationEnd.add(onManipulationEndCallback)
        
        print("Successfully connected manipulation events for child at index: " + index)
      } else {
        print("Warning: No valid InteractableManipulation component found on child at index: " + index)
      }
    })
  }

  /**
   * Starts dragging the specified child object
   */
  private startDrag(child: SceneObject, originalIndex: number): void {
    if (!this.enableRearrangement) return

    print("Starting drag for child at index: " + originalIndex)

    // Store all current local positions
    this.dragState.originalPositions = []
    for (let i = 0; i < this.children.length; i++) {
      this.dragState.originalPositions.push(this.children[i].getTransform().getLocalPosition())
    }

    this.dragState.draggedObject = child
    this.dragState.originalIndex = originalIndex
    this.dragState.isDragging = true

    print("Drag started successfully")
  }

  /**
   * Ends the dragging operation
   */
  private endDrag(): void {
    if (!this.dragState.isDragging || !this.dragState.draggedObject) return

    print("Ending drag")

    // Find closest grid position and snap there
    const draggedPos = this.dragState.draggedObject.getTransform().getLocalPosition()
    let closestIndex = 0
    let closestDistance = Number.MAX_VALUE

    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === this.dragState.draggedObject) continue
      const distance = draggedPos.distance(this.dragState.originalPositions[i])
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    // Rearrange the children array
    const draggedChild = this.children.splice(this.dragState.originalIndex, 1)[0]
    this.children.splice(closestIndex, 0, draggedChild)

    // Reset positions and layout normally
    this.layout()
    
    // Reset drag state
    this.dragState.isDragging = false
    this.dragState.draggedObject = null
    this.dragState.originalIndex = -1
    this.dragState.originalPositions = []

    print("Drag ended successfully")
  }

  /**
   * Check if other elements should be rearranged based on dragged object position
   */
  private checkForRearrangement(): void {
    if (!this.dragState.draggedObject) return

    const draggedPos = this.dragState.draggedObject.getTransform().getLocalPosition()
    
    // Find which original position this dragged object is closest to
    let closestIndex = 0
    let closestDistance = Number.MAX_VALUE

    for (let i = 0; i < this.dragState.originalPositions.length; i++) {
      if (i === this.dragState.originalIndex) continue // Skip its own original position
      
      const distance = draggedPos.distance(this.dragState.originalPositions[i])
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    // Use a more generous threshold for rearrangement
    const threshold = this.totalCellSize.x * 0.6
    if (closestDistance < threshold) {
      this.rearrangeOthersForDrag(closestIndex)
    }
  }

  /**
   * Rearrange other elements to make space for the dragged item
   */
  private rearrangeOthersForDrag(targetIndex: number): void {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === this.dragState.draggedObject) continue

      let newIndex = i
      
      // Determine where this item should move
      if (this.dragState.originalIndex < targetIndex) {
        // Dragging forward - shift items back
        if (i > this.dragState.originalIndex && i <= targetIndex) {
          newIndex = i - 1
        }
      } else {
        // Dragging backward - shift items forward  
        if (i >= targetIndex && i < this.dragState.originalIndex) {
          newIndex = i + 1
        }
      }

      // Clamp to valid range
      newIndex = Math.max(0, Math.min(this.dragState.originalPositions.length - 1, newIndex))

      // Move to the new position smoothly
      const targetPos = this.dragState.originalPositions[newIndex]
      const currentPos = this.children[i].getTransform().getLocalPosition()
      const newPos = vec3.lerp(currentPos, targetPos, this.rearrangeLerpSpeed)
      this.children[i].getTransform().setLocalPosition(newPos)
    }
  }

  private update = () => {
    // Continuously check for rearrangement when dragging
    if (this.dragState.isDragging) {
      this.checkForRearrangement()
      // Uncomment for debugging (will be very verbose)
      // print("Checking for rearrangement...")
    }
    
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
