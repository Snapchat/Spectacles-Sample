/**
 * Exposes distance-based events.
 */
@component
export class DistanceEventsTS extends BaseScriptComponent {
  @input
  @hint("Target to measure distance from")
  target!: SceneObject

  @input
  @hint("Distances that will trigger events when crossed (in meters)")
  distances: number[] = []

  @input
  @hint("Script components (like DistanceEventsCallbacks) that have the callback functions")
  events: ScriptComponent[] = []

  @input
  @hint("Function names to call on the corresponding event scripts (e.g. 'onDistanceThresholdCrossed')")
  eventFunctions: string[] = []

  @input
  @hint("Whether to trigger when distance becomes greater than threshold (true) or less than threshold (false)")
  triggerOnGreaterThan: boolean = true

  private _ranges: DistanceRange[] = []
  private _distanceToTarget: number = 0
  private _triggeredDistances: Set<number> = new Set()

  // Initialize with the proper pattern
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })

    this.createEvent("UpdateEvent").bind(() => {
      this.onUpdate()
    })
  }

  onStart(): void {
    if (!this.target) {
      print("No target set for DistanceEvents - please set a target object")
      return
    }

    // Setup the distance/event pairs from inspector values
    this.setupDistanceEvents()
  }

  /**
   * Sets up distance events based on inspector values
   *
   * How to use:
   * 1. Add distances to the "distances" array (e.g., 1, 2, 3 for 1m, 2m, 3m thresholds)
   * 2. For each distance, add a corresponding script component (like DistanceEventsCallbacks) to the "events" array
   * 3. For each script component, add the function name you want to call (e.g., "onDistanceThresholdCrossed") to the "eventFunctions" array
   */
  private setupDistanceEvents(): void {
    // Clear any existing ranges
    this.clearRanges()

    // Validate that we have matching arrays
    if (this.distances.length === 0) {
      print("No distances defined for DistanceEvents")
      return
    }

    if (this.distances.length !== this.events.length || this.events.length !== this.eventFunctions.length) {
      print("Error in DistanceEvents: Distances, events, and eventFunctions arrays must have the same length")
      return
    }

    // Create a range for each distance/event pair
    for (let i = 0; i < this.distances.length; i++) {
      const distance = this.distances[i]
      const eventScript = this.events[i]
      const functionName = this.eventFunctions[i]

      if (!eventScript || !functionName) {
        print(`Warning: Missing event script or function name for distance ${distance}`)
        continue
      }

      // Create a threshold check range
      // If triggerOnGreaterThan is true, trigger when distance > threshold
      // Otherwise, trigger when distance < threshold
      const minDistance = this.triggerOnGreaterThan ? distance : 0
      const maxDistance = this.triggerOnGreaterThan ? Number.MAX_VALUE : distance

      const range = this.addRange(minDistance, maxDistance)

      // Add event listener
      range.addOnEnterRangeListener(() => {
        // Only trigger if we haven't triggered for this distance yet
        if (!this._triggeredDistances.has(distance)) {
          this._triggeredDistances.add(distance)

          // Call the event function
          if (eventScript && (eventScript as any)[functionName]) {
            ;(eventScript as any)[functionName]()
          }
        }
      })

      // Add exit listener to reset trigger state when leaving the range
      range.addOnExitRangeListener(() => {
        this._triggeredDistances.delete(distance)
      })
    }
  }

  onUpdate(): void {
    if (!this.target) return

    const myPosition = this.sceneObject.getTransform().getWorldPosition()
    const targetPosition = this.target.getTransform().getWorldPosition()

    // Calculate distance manually
    const dx = targetPosition.x - myPosition.x
    const dy = targetPosition.y - myPosition.y
    const dz = targetPosition.z - myPosition.z
    this._distanceToTarget = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // Update all ranges
    for (const range of this._ranges) {
      range.update(this._distanceToTarget)
    }
  }

  /**
   * Reset all triggered distances, allowing them to trigger again
   */
  resetTriggeredDistances(): void {
    this._triggeredDistances.clear()
  }

  /**
   * Add a distance range with associated events.
   * @param minDistance The minimum distance for the range
   * @param maxDistance The maximum distance for the range
   * @returns The created DistanceRange object for event binding
   */
  addRange(minDistance: number, maxDistance: number): DistanceRange {
    const range = new DistanceRange(minDistance, maxDistance)
    this._ranges.push(range)
    return range
  }

  /**
   * Clear all registered distance ranges.
   */
  clearRanges(): void {
    this._ranges = []
  }

  /**
   * Get the current distance to the target.
   */
  getDistanceToTarget(): number {
    return this._distanceToTarget
  }
}

/**
 * Represents a range of distances with associated events.
 */
export class DistanceRange {
  public minDistance: number
  public maxDistance: number

  private _insideRange: boolean = false
  private _wasInsideRange: boolean = false

  // Events
  private _onEnterRange: (() => void)[] = []
  private _onPercentInsideRange: ((percent: number) => void)[] = []
  private _onExitRange: (() => void)[] = []

  constructor(minDistance: number, maxDistance: number) {
    this.minDistance = minDistance
    this.maxDistance = maxDistance
  }

  /**
   * Update the range status based on a new distance.
   * @param distance The current distance to check against the range
   */
  update(distance: number): void {
    this._insideRange = distance >= this.minDistance && distance <= this.maxDistance

    // Trigger enter range event
    if (this._insideRange && !this._wasInsideRange) {
      this.triggerOnEnterRange()
    }

    // Trigger percent inside range event if inside the range
    if (this._insideRange) {
      // Calculate the percentage (0-1) of how far into the range we are
      // 0 = at max distance (edge of range), 1 = at min distance (deepest in range)
      const percent = Math.max(0, Math.min(1, (this.maxDistance - distance) / (this.maxDistance - this.minDistance)))
      this.triggerOnPercentInsideRange(percent)
    }

    // Trigger exit range event
    if (!this._insideRange && this._wasInsideRange) {
      this.triggerOnExitRange()
    }

    this._wasInsideRange = this._insideRange
  }

  /**
   * Add a listener for when entering the distance range.
   * @param callback The function to call when entering the range
   */
  addOnEnterRangeListener(callback: () => void): void {
    this._onEnterRange.push(callback)
  }

  /**
   * Add a listener for the percentage inside the distance range.
   * @param callback The function to call with the percentage (0-1)
   */
  addOnPercentInsideRangeListener(callback: (percent: number) => void): void {
    this._onPercentInsideRange.push(callback)
  }

  /**
   * Add a listener for when exiting the distance range.
   * @param callback The function to call when exiting the range
   */
  addOnExitRangeListener(callback: () => void): void {
    this._onExitRange.push(callback)
  }

  /**
   * Remove a listener for when entering the distance range.
   * @param callback The function to remove
   */
  removeOnEnterRangeListener(callback: () => void): void {
    this._onEnterRange = this._onEnterRange.filter((cb) => cb !== callback)
  }

  /**
   * Remove a listener for the percentage inside the distance range.
   * @param callback The function to remove
   */
  removeOnPercentInsideRangeListener(callback: (percent: number) => void): void {
    this._onPercentInsideRange = this._onPercentInsideRange.filter((cb) => cb !== callback)
  }

  /**
   * Remove a listener for when exiting the distance range.
   * @param callback The function to remove
   */
  removeOnExitRangeListener(callback: () => void): void {
    this._onExitRange = this._onExitRange.filter((cb) => cb !== callback)
  }

  /**
   * Trigger all registered enter range callbacks.
   */
  private triggerOnEnterRange(): void {
    for (const callback of this._onEnterRange) {
      callback()
    }
  }

  /**
   * Trigger all registered percent inside range callbacks.
   * @param percent The percentage (0-1) inside the range
   */
  private triggerOnPercentInsideRange(percent: number): void {
    for (const callback of this._onPercentInsideRange) {
      callback(percent)
    }
  }

  /**
   * Trigger all registered exit range callbacks.
   */
  private triggerOnExitRange(): void {
    for (const callback of this._onExitRange) {
      callback()
    }
  }
}
