/**
 * Manages the logic for the dragging behaviour, especially detects when dragging happens,
 * and provides the associated dragVector
 */
export class DragProvider {
  private _originPosition: vec3 | null = null
  private _isDragging = false
  private previousPosition = vec3.zero()
  private _currentDragVector: vec3 | null = null

  constructor(private dragThreshold: number) {
    if (dragThreshold < 0) {
      throw new Error("HandInteractor: DragThreshold can't be negative.")
    }
  }

  /**
   * @returns origin position for the drag
   */
  get originPosition(): vec3 | null {
    return this._originPosition
  }

  /**
   * @returns if dragging is happening or not
   */
  get isDragging(): boolean {
    return this._isDragging
  }

  /**
   * @returns the drag vector of the current frame
   */
  get currentDragVector(): vec3 | null {
    return this._currentDragVector
  }

  /**
   * Resets the dragging state
   */
  clear(): void {
    this._originPosition = null
    this._isDragging = false
    this._currentDragVector = null
  }

  /**
   * Detects if the interactor is being dragged and returns dragVector if that happens.
   * Detection algorithm: if the distance between the interaction point and the origin
   * position exceeds the dragging threshold, then dragging is happening.
   * @param currentPosition - position that is used to compute the drag vector
   * @returns the dragVector as a {@link vec3} if dragging and null otherwise
   */
  getDragVector(currentPosition: vec3 | null, enableInstantDrag: boolean | null): vec3 | null {
    if (currentPosition === null) {
      return null
    }

    if (!this._isDragging) {
      this._isDragging = this.isDragDetected(currentPosition, enableInstantDrag)
      this.previousPosition = currentPosition
      if (!this._isDragging) {
        return null
      }
    }

    const dragVector = currentPosition.sub(this.previousPosition)

    this.previousPosition = currentPosition
    this._currentDragVector = dragVector

    return dragVector
  }

  private isDragDetected(position: vec3, enableInstantDrag: boolean | null): boolean {
    if (this._originPosition === null) {
      this._originPosition = position
      return false
    }

    const originDelta = position.sub(this._originPosition)
    return originDelta.length >= this.dragThreshold || (enableInstantDrag ?? false)
  }
}
