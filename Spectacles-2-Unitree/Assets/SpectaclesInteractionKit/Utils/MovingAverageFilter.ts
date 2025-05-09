import Filter from "./Filter"

const TAG = "MovingAverageFilter"

/**
 * Implements a moving average algorithm. A window of specified length,
 * moves over the data, sample by sample, and the average is computed
 * over the data in the window.
 *
 * Source: https://www.mathworks.com/help/dsp/ug/sliding-window-method-and-exponential-weighting-method.html
 */
export class MovingAverageFilter<T> implements Filter<T> {
  private samples: T[] = []

  constructor(
    private windowLength: number,
    private zero: () => T,
    private average: (samples: T[]) => T
  ) {
    this.clear()
  }

  /**
   * @inheritdoc
   */
  filter(sample: T, _timestamp: number): T {
    if (this.samples.length === this.windowLength) {
      this.samples.shift()
    }
    this.samples.push(sample)

    return this.average(this.samples)
  }

  clear(): void {
    this.samples = []
  }

  averageSample(): T {
    return this.average(this.samples)
  }
}
