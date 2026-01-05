/**
 * Collects a series of positions and detects sharp turns using the dot product.
 */
@component
export class SharpTurnTShen extends BaseScriptComponent {
  @input
  @hint("Number of frames to skip between position checks")
  step: number = 10

  @input
  @hint("Number of frames to store for tracking movement")
  frameCount: number = 30

  @input
  @hint("Minimum distance between vertices to record a new position")
  minVertexDistance: number = 0.001

  @input
  @hint("Enable debug logging")
  debug: boolean = false

  // Events
  private _onTurn: (() => void)[] = []

  // Internal tracking variables
  private _positions: vec3[] = []
  private _currentIndex: number = 0
  private _newestDirection: vec3 = new vec3(0, 0, 0)
  private _oldestDirection: vec3 = new vec3(0, 0, 0)

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate()
    })

    // Initialize positions array
    this._positions = new Array(this.frameCount).fill(null).map(() => new vec3(0, 0, 0))
  }

  onStart(): void {
    // Initialize the first position
    this._positions[this._currentIndex] = this.sceneObject.getTransform().getWorldPosition()
  }

  onUpdate(): void {
    // Get current position
    const currentPos = this.sceneObject.getTransform().getWorldPosition()

    // Only record position if moved enough
    if (this.getDistance(currentPos, this._positions[this._currentIndex]) > this.minVertexDistance) {
      // Move to the next index, looping around if necessary
      this._currentIndex = (this._currentIndex + 1) % this.frameCount
      this._positions[this._currentIndex] = currentPos

      // Ensure there are enough points for direction calculations
      if (this._currentIndex >= this.step) {
        // Calculate directions
        const prevIndex = (this._currentIndex - 1 + this.frameCount) % this.frameCount
        const oldIndex = (this._currentIndex - this.step + this.frameCount) % this.frameCount

        this._newestDirection = this.subtractVectors(this._positions[this._currentIndex], this._positions[prevIndex])

        this._oldestDirection = this.subtractVectors(this._positions[this._currentIndex], this._positions[oldIndex])

        // Detect sharp turn using dot product
        const dotProduct = this.detectDotProduct(this._newestDirection, this._oldestDirection)

        if (this.debug) {
          print("Dot Product: " + dotProduct.toFixed(4))
        }

        // Check if a sharp turn has occurred (dot product < -0.1)
        if (dotProduct < -0.1) {
          if (this.debug) {
            print("Transform has sharp turned!")
          }

          // Trigger the turn event
          this.triggerOnTurn()
        }
      }
    }
  }

  /**
   * Calculate the dot product between two direction vectors.
   * @param newestDirection The newest direction vector
   * @param oldestDirection The oldest direction vector
   * @returns The dot product (negative values indicate sharp turns)
   */
  private detectDotProduct(newestDirection: vec3, oldestDirection: vec3): number {
    // Normalize the vectors
    const normalized1 = this.normalizeVector(newestDirection)
    const normalized2 = this.normalizeVector(oldestDirection)

    // Calculate dot product
    return this.dotProduct(normalized1, normalized2)
  }

  /**
   * Calculate the dot product between two vectors.
   */
  private dotProduct(v1: vec3, v2: vec3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  /**
   * Normalize a vector to unit length.
   */
  private normalizeVector(v: vec3): vec3 {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)

    if (length < 0.0001) {
      return new vec3(0, 0, 0)
    }

    return new vec3(v.x / length, v.y / length, v.z / length)
  }

  /**
   * Calculate the distance between two points.
   */
  private getDistance(a: vec3, b: vec3): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dz = b.z - a.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Subtract two vectors.
   */
  private subtractVectors(a: vec3, b: vec3): vec3 {
    return new vec3(a.x - b.x, a.y - b.y, a.z - b.z)
  }

  /**
   * Add a listener for the turn event.
   * @param callback The function to call when a sharp turn is detected
   */
  addOnTurnListener(callback: () => void): void {
    this._onTurn.push(callback)
  }

  /**
   * Remove a listener for the turn event.
   * @param callback The function to remove
   */
  removeOnTurnListener(callback: () => void): void {
    this._onTurn = this._onTurn.filter((cb) => cb !== callback)
  }

  /**
   * Trigger all registered turn callbacks.
   */
  private triggerOnTurn(): void {
    for (const callback of this._onTurn) {
      callback()
    }
  }
}
