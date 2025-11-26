/**
 * Represents a filter of some kind.
 */
export default interface Filter<T> {
  /**
   * Applies filter to a sample
   * @param sample - value to be filtered
   * @param timestamp - timestamp when the sample was measured
   */
  filter(sample: T, timestamp: number): T
}

/**
 * A filter that does nothing.
 */
export class NoOpFilter<T> implements Filter<T> {
  filter(sample: T, _timestamp: number): T {
    return sample
  }
}
