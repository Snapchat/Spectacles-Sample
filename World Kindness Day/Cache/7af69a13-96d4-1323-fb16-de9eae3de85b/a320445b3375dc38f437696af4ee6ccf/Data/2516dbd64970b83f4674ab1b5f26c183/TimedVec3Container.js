"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimedVec3Container = void 0;
const SampleOps_1 = require("../../../Utils/SampleOps");
const TimeDataContainer_1 = require("./TimeDataContainer");
/**
 * Vec3 specialization of TimedDataContainer
 */
class TimedVec3Container extends TimeDataContainer_1.TimedDataContainer {
    constructor(windowMode, windowSize) {
        super(windowMode, windowSize, new SampleOps_1.Vec3SampleOps());
    }
    /**
     * @returns the velocity aggregated, using absolute distance between the vectors as delta values between the data points
     *
     * Tries to overcome the velocity measurement problem caused by data duplications
     * because of the different render and tracking frame rates:
     * Assuming closely even render frame rate, and frequent data duplications on every second frame,
     * calculates the delta between the current data and the one before the previous data
     * Averages these cross computed velocity values.
     * Requires at least 4 data elements to return valid velocity, othervise returns null
     *
     * ti - ith time point
     * di - ith data
     *
     *  t0    t2    t4
     *   ____   ____
     *  /    \ /    \
     * -|--|--|--|--|-
     *  d0 d0 d1 d1 d2
     *      \___/
     *     t1    t3
     */
    aggregateAbsoluteVelocity() {
        if (this.data.length < 4) {
            return null;
        }
        let velocitySum = 0;
        let count = 0;
        for (let i = 2; i < this.data.length; i++) {
            const delta = this.data[i].data.distance(this.data[i - 2].data);
            const deltaTime = this.data[i].timestamp - this.data[i - 2].timestamp;
            const velocity = delta / deltaTime;
            velocitySum += velocity;
            count++;
        }
        return velocitySum / count;
    }
    pushWithoutDuplicate(timestamp, data) {
        if (this.data.length === 0 || this.data[this.data.length - 1].data !== data) {
            this.pushData(timestamp, data);
        }
    }
}
exports.TimedVec3Container = TimedVec3Container;
//# sourceMappingURL=TimedVec3Container.js.map