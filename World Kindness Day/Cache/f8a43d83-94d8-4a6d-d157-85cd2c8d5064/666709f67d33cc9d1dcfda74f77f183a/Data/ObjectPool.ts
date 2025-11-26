import NativeLogger from "./NativeLogger"

interface PoolStats {
  capacity: number
  available: number
  inUse: number
  utilizationRate: number
}

/**
 * Defines the configuration for creating an ObjectPool.
 */
export interface ObjectPoolConfig<T> {
  /**
   * A function that creates a new object for the pool. This is called when the pool needs to grow.
   */
  factory: () => T

  /**
   * An optional function that is called on an object immediately after it is retrieved from the pool. Use this to reset
   * the object's state.
   */
  onGet?: (item: T) => void

  /**
   * An optional function that is called when an object is returned to the pool. Use this to clean up or reset the
   * object's state.
   */
  onRelease?: (item: T) => void

  /**
   * The initial number of objects to create and pre-allocate in the pool.
   * @default 0
   */
  initialCapacity?: number

  /**
   * The factor by which the pool should grow when it runs out of items, based on its current capacity.
   * @default 0.5 (50%)
   */
  growthFactor?: number

  /**
   * The minimum number of new items to create when the pool needs to grow.
   * @default 10
   */
  minGrowthAmount?: number

  /**
   * An optional parent tag for hierarchical logging. If provided, logs will show as "parentTag:ObjectPool".
   * @default undefined
   */
  parentTag?: string
}

/**
 * A generic object pool for recycling objects to reduce pressure on the garbage collector.
 */
export class ObjectPool<T> {
  private items: T[] = []
  private borrowedItems = new Set<T>()
  private factory: () => T
  private onGet?: (item: T) => void
  private onRelease?: (item: T) => void
  private log: NativeLogger

  private growthFactor: number
  private minGrowthAmount: number
  private _capacity: number = 0

  constructor(config: ObjectPoolConfig<T>) {
    this.factory = config.factory
    this.onGet = config.onGet
    this.onRelease = config.onRelease
    this.growthFactor = config.growthFactor ?? 0.5
    this.minGrowthAmount = config.minGrowthAmount ?? 10

    const tag = config.parentTag ? `${config.parentTag}:ObjectPool` : "ObjectPool"
    this.log = new NativeLogger(tag)

    if (config.initialCapacity && config.initialCapacity > 0) {
      this.grow(config.initialCapacity)
    }
  }

  /**
   * The total number of objects managed by this pool (both available and in use).
   */
  get capacity(): number {
    return this._capacity
  }

  /**
   * The number of objects that are currently "checked out" of the pool.
   */
  get inUse(): number {
    return this.borrowedItems.size
  }

  /**
   * The number of objects currently available in the pool.
   */
  get available(): number {
    return this.items.length
  }

  /**
   * Retrieves an object from the pool. If the pool is empty, it will automatically grow to create new objects.
   * @returns An object of type T.
   */
  pop(): T {
    this.ensureCapacity()
    const item = this.items.pop()!

    this.borrowedItems.add(item)

    if (this.onGet) {
      this.onGet(item)
    }

    return item
  }

  /**
   * Returns an object to the pool, making it available for reuse.
   * @param item The object to return to the pool.
   */
  push(item: T): void {
    if (!this.borrowedItems.delete(item)) {
      this.log.e("Object being released was not part of the borrowed set. Double-release or invalid object detected.")
      return
    }

    if (this.onRelease) {
      this.onRelease(item)
    }

    this.items.push(item)
  }

  /**
   * Executes a callback for each **available** item in the pool.
   * @param callback The function to execute for each item.
   */
  forEach(callback: (item: T, index: number, array: T[]) => void): void {
    this.items.forEach(callback)
  }

  /**
   * Allows the pool to be used in `for...of` loops, iterating over **available** items.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]()
  }

  /**
   * Explicitly adds a specified number of new objects to the pool.
   * @param amount The number of new objects to create.
   */
  prewarm(amount: number): void {
    if (amount <= 0) {
      this.log.e(`Invalid prewarm amount: ${amount}. Must be positive.`)
      return
    }
    this.grow(amount)
  }

  /**
   * Forcibly returns all borrowed items to the pool.
   *
   * This is a powerful tool for preventing memory leaks. By calling this at the beginning of a frame or a top-level
   * operation, you ensure that any objects that were not explicitly released are reclaimed.
   */
  reset(): void {
    for (const item of this.borrowedItems) {
      if (this.onRelease) {
        this.onRelease(item)
      }
      this.items.push(item)
    }
    this.borrowedItems.clear()
  }

  /**
   * Returns an object with the current pool statistics.
   * @returns An object containing capacity, available, inUse, and utilizationRate.
   */
  getStats(): PoolStats {
    return {
      capacity: this._capacity,
      available: this.available,
      inUse: this.inUse,
      utilizationRate: this._capacity > 0 ? this.inUse / this._capacity : 0
    }
  }

  private ensureCapacity(minRequired: number = 1): void {
    if (this.items.length >= minRequired) {
      return
    }

    const growAmount = Math.max(
      this.minGrowthAmount,
      Math.ceil(this._capacity * this.growthFactor),
      minRequired - this.items.length
    )

    this.log.d(
      `Pool growing: required=${minRequired}, available=${this.items.length}, inUse=${this.inUse}. Growing by \
${growAmount}.`
    )
    this.grow(growAmount)
    this.log.d(`Pool grown: new capacity is ${this.capacity}.`)
  }

  private grow(amount: number): void {
    this._capacity += amount
    for (let i = 0; i < amount; i++) {
      this.items.push(this.factory())
    }
  }
}
