import {BoundariesProvider} from "./BoundariesProvider"

/**
 * Computes a boundary by adding a buffer around another boundariesProvider
 */
export class BufferedBoundariesProvider extends BoundariesProvider {
  private _buffer: Rect

  /**
   * Computes a boundary by adding a buffer around another boundariesProvider
   * @param toBuffer - The BoundariesProvider to buffer
   * @param initialBuffer - The amount of buffer to apply
   */
  constructor(
    readonly toBuffer: BoundariesProvider,
    readonly initialBuffer: Rect
  ) {
    super()

    this._buffer = initialBuffer
  }

  /**
   * Get the amount of buffer being applied
   */
  get buffer(): Rect {
    return this._buffer
  }

  /**
   * Set the amount of buffer being applied
   * @param newBuffer - The new value
   */
  set buffer(newBuffer: Rect) {
    this._buffer = newBuffer
  }

  get boundaries(): Rect {
    return Rect.create(
      this.toBuffer.boundaries.left - this.buffer.left,
      this.toBuffer.boundaries.right + this.buffer.right,
      this.toBuffer.boundaries.bottom - this.buffer.bottom,
      this.toBuffer.boundaries.top + this.buffer.top
    )
  }
}
