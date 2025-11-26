"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimedDataContainer = exports.WindowMode = exports.TimedData = void 0;
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const TAG = "TimedDataContainer";
/**
 * Custom data with timestamp
 */
class TimedData {
    constructor(timestamp, data) {
        this.timestamp = timestamp;
        this.data = data;
    }
}
exports.TimedData = TimedData;
/**
 * Window modes for TimedDataContainer
 * TIME - data window slides based on timestamps and the given window size in time units (seconds)
 * FRAME = data window slides based on element (data frame) number
 */
var WindowMode;
(function (WindowMode) {
    WindowMode[WindowMode["TIME"] = 0] = "TIME";
    WindowMode[WindowMode["FRAME"] = 1] = "FRAME";
})(WindowMode || (exports.WindowMode = WindowMode = {}));
/**
 * Manages custom data within a time or frame based window
 */
class TimedDataContainer {
    constructor(_windowMode, _windowSize, sampleOps) {
        this._windowMode = _windowMode;
        this._windowSize = _windowSize;
        this.sampleOps = sampleOps;
        // Native Logging
        this.log = new NativeLogger_1.default(TAG);
        this.data = [];
        /**
         * State variable to check if warning notification has already been logged
         * in case a timestamp is pushed with data value
         * different than the previous for the same timestamp.
         * This notification will be logged only once per a lens start avoiding
         * excessive frame by frame log spam.
         */
        this.notifiedRepeatedTimestampPush = false;
    }
    /**
     * @returns the size of the container,
     * number of contained elements
     */
    get size() {
        return this.data.length;
    }
    /**
     * @returns the currently set window size of the container,
     * time interval or frame number depending on the windowMode
     */
    get windowSize() {
        return this._windowSize;
    }
    /**
     * @returns the currently set window mode of the container
     */
    get windowMode() {
        return this._windowMode;
    }
    /**
     * sets the window size in time unit or frame number
     * depending on the windowMode
     * @param windowSize - time unit or frame number
     */
    setWindowSize(windowSize) {
        this._windowSize = windowSize;
    }
    /**
     * clears the data array
     */
    clear() {
        this.data = [];
    }
    /**
     * Updates the container by removing the outdated elements
     * from the front of the data array.
     * In FRAME windowMode, only the last windowSize elements are kept
     * In TIME mode, the elements older than windowSize
     * are removed from the frint of the array (relative to the current timestamp parameter)
     * @param timestamp - current timestamp
     */
    updateQueue(timestamp) {
        if (timestamp < 0) {
            throw new Error("Timestamps should not be negative");
        }
        if (this._windowMode === WindowMode.TIME) {
            const begin = timestamp - this._windowSize;
            while (this.data.length > 0 && this.data[0].timestamp < begin) {
                this.data.shift();
            }
        }
        else {
            while (this.data.length > this._windowSize) {
                this.data.shift();
            }
        }
    }
    /**
     * adds new data to the container with timestamp
     * updates the data array
     * @param timestamp - timestamp of the data
     * @param data - custom data
     */
    pushData(timestamp, data) {
        if (timestamp < 0) {
            throw new Error("Timestamps should not be negative");
        }
        if (this.data.length > 0) {
            const backData = this.data[this.data.length - 1];
            if (timestamp < backData.timestamp) {
                throw new Error("Timestamps should be monotonic");
            }
            if (timestamp === backData.timestamp) {
                if (!this.notifiedRepeatedTimestampPush && data !== backData.data) {
                    this.log.w("Data arrived with repeated timestamp and different data");
                    this.notifiedRepeatedTimestampPush = true;
                }
                return;
            }
        }
        this.data.push(new TimedData(timestamp, data));
        this.updateQueue(timestamp);
    }
    /**
     * @returns the average of the contained elements,
     * or null if no data contained
     */
    average() {
        if (this.data.length === 0) {
            return null;
        }
        let sum = this.sampleOps.zero();
        for (let i = 0; i < this.data.length; i++) {
            sum = this.sampleOps.add(sum, this.data[i].data);
        }
        return this.sampleOps.uniformScale(sum, 1 / this.data.length);
    }
}
exports.TimedDataContainer = TimedDataContainer;
//# sourceMappingURL=TimeDataContainer.js.map