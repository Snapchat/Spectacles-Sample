"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovingAverageFilter = void 0;
/**
 * Implements a moving average algorithm. A window of specified length,
 * moves over the data, sample by sample, and the average is computed
 * over the data in the window.
 *
 * Source: https://www.mathworks.com/help/dsp/ug/sliding-window-method-and-exponential-weighting-method.html
 */
class MovingAverageFilter {
    constructor(windowLength, zero, average) {
        this.windowLength = windowLength;
        this.zero = zero;
        this.average = average;
        this.samples = [];
        this.clear();
    }
    /**
     * @inheritdoc
     */
    filter(sample, _timestamp) {
        if (this.samples.length === this.windowLength) {
            this.samples.shift();
        }
        this.samples.push(sample);
        return this.average(this.samples);
    }
    clear() {
        this.samples = [];
    }
    averageSample() {
        return this.average(this.samples);
    }
}
exports.MovingAverageFilter = MovingAverageFilter;
//# sourceMappingURL=MovingAverageFilter.js.map