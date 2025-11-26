import NativeLogger from "./NativeLogger"

const TAG = "BinaryHeap"
const log = new NativeLogger(TAG)

/**
 * A generic binary heap implementation that supports efficient priority operations.
 *
 * This data structure maintains elements in a partially ordered heap structure, enabling O(log n) push, pop, and remove
 * operations. The ordering is determined by the provided comparison function.
 *
 * @template T The type of elements stored in the heap.
 *
 * @remarks
 * The type parameter `T` must be suitable for use as a key in a JavaScript `Map`:
 * - If `T` is a primitive (`string`, `number`, `symbol`), values are compared by value.
 * - If `T` is an object, values are compared by reference (object identity).
 * - Each element must be uniquely identifiable - two objects with identical properties are considered different keys if
 *   they are different object references.
 *
 * Duplicate values (by reference or primitive value) are not supported; only the most recently added instance will be
 * tracked.
 *
 * Example usage:
 * ```typescript
 * const heap = new BinaryHeap<number>((a, b) => a - b)
 * ```
 */
export default class BinaryHeap<T> {
  private heap: T[] = []
  private compare: (a: T, b: T) => number
  private indexMap: Map<T, number> = new Map()

  /**
   * Creates a new binary heap.
   *
   * @param compareFn A function that defines the heap ordering.
   *        Should return a negative number if `a` should be higher priority than `b`,
   *        a positive number if `a` should be lower priority than `b`,
   *        or zero if they have equal priority.
   */
  constructor(compareFn: (a: T, b: T) => number) {
    this.compare = compareFn
  }

  /**
   * Builds a heap from an array of items in O(n) time.
   *
   * @param items The array of items to build the heap from.
   */
  buildHeap(items: T[]): void {
    this.heap = [...items]
    this.indexMap.clear()

    for (let i = 0; i < this.heap.length; i++) {
      this.indexMap.set(this.heap[i], i)
    }

    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.sinkDown(i)
    }
  }

  /**
   * Gets the number of elements in the heap.
   *
   * @returns The number of elements in the heap.
   */
  get size(): number {
    return this.heap.length
  }

  /**
   * Adds a new element to the heap.
   *
   * @param value The element to add to the heap.
   */
  push(value: T): void {
    if (this.indexMap.has(value)) {
      log.f("Duplicate values are not supported in the heap")
    }

    this.heap.push(value)
    const index = this.heap.length - 1
    this.indexMap.set(value, index)
    this.bubbleUp(index)
  }

  /**
   * Removes and returns the highest priority element from the heap.
   *
   * @returns The highest priority element in the heap.
   */
  pop(): T {
    if (this.heap.length === 0) {
      log.f("Cannot pop from an empty heap")
    }

    const result = this.heap[0]
    this.indexMap.delete(result)

    if (this.heap.length === 1) {
      this.heap.pop()
      return result
    }

    const end = this.heap.pop()!
    this.heap[0] = end
    this.indexMap.set(end, 0)
    this.sinkDown(0)

    return result
  }

  /**
   * Returns the highest priority element without removing it.
   *
   * @returns The highest priority element in the heap.
   */
  peek(): T {
    if (this.heap.length === 0) {
      log.f("Cannot peek at an empty heap")
    }

    return this.heap[0]
  }

  /**
   * Removes a specific element from the heap.
   *
   * @param value The element to remove.
   * @returns True if the element was found and removed, false otherwise.
   */
  remove(value: T): boolean {
    const index = this.indexMap.get(value)
    if (index === undefined) return false

    this.indexMap.delete(value)

    if (index === this.heap.length - 1) {
      this.heap.pop()
      return true
    }

    const end = this.heap.pop()!
    if (end !== value) {
      this.heap[index] = end
      this.indexMap.set(end, index)

      if (this.compare(end, value) < 0) {
        this.bubbleUp(index)
      } else {
        this.sinkDown(index)
      }
    }

    return true
  }

  /**
   * Removes all elements from the heap.
   */
  clear(): void {
    this.heap.length = 0
    this.indexMap.clear()
  }

  /**
   * Checks if a value exists in the heap.
   *
   * @param value The value to check for.
   * @returns True if the value exists in the heap, false otherwise.
   */
  has(value: T): boolean {
    return this.indexMap.has(value)
  }

  /**
   * Rebalances an element in the heap after its value or comparison-affecting properties have changed.
   *
   * @param value The element to rebalance in the heap
   * @returns True if the element was found and rebalanced, false otherwise.
   */
  rebalance(value: T): boolean {
    const index = this.indexMap.get(value)
    if (index === undefined) return false

    this.bubbleUp(index)
    this.sinkDown(index)

    return true
  }

  private bubbleUp(index: number): void {
    const heap = this.heap
    const element = heap[index]

    while (index > 0) {
      const parentIndex = (index - 1) >> 1
      const parent = heap[parentIndex]

      if (this.compare(element, parent) >= 0) {
        break
      }

      heap[parentIndex] = element
      heap[index] = parent

      this.indexMap.set(element, parentIndex)
      this.indexMap.set(parent, index)

      index = parentIndex
    }
  }

  private sinkDown(index: number): void {
    const heap = this.heap
    const length = heap.length
    const element = heap[index]

    while (true) {
      const leftChildIndex = 2 * index + 1
      const rightChildIndex = leftChildIndex + 1
      let smallestChildIndex = index

      if (leftChildIndex < length && this.compare(heap[leftChildIndex], heap[smallestChildIndex]) < 0) {
        smallestChildIndex = leftChildIndex
      }

      if (rightChildIndex < length && this.compare(heap[rightChildIndex], heap[smallestChildIndex]) < 0) {
        smallestChildIndex = rightChildIndex
      }

      if (smallestChildIndex === index) {
        break
      }

      const smallestChild = heap[smallestChildIndex]
      heap[index] = smallestChild
      heap[smallestChildIndex] = element

      this.indexMap.set(smallestChild, index)
      this.indexMap.set(element, smallestChildIndex)

      index = smallestChildIndex
    }
  }
}
