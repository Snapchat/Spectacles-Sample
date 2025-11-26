"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * BistableThreshold tracks the state of a value over time,
 * and determines which side of the threshold the value is
 * in. It is superior to a typical single-value threshold
 * in being resistant to noise and jitter because it
 * "resists" change.
 *
 * The "edge" of the BistableThreshold has an "activate" side
 * and a "deactivate" side, and adjusting the difference
 * between them will make the threshold more or less resistant
 * to change.
 */
class BistableThreshold {
    constructor(config) {
        this.config = config;
        this.state = null;
        this.direction = this.config.edgeActivate > this.config.edgeDeactivate ? 1 : -1;
    }
    /**
     * update the Threshold and return a boolean if the state
     * changed, or null if it did not
     *
     * @param newVal
     */
    update(newVal) {
        switch (this.state) {
            case null:
                if (this.direction * newVal > this.direction * this.config.edgeActivate) {
                    this.state = true;
                    return true;
                }
                else if (this.direction * newVal < this.direction * this.config.edgeDeactivate) {
                    this.state = false;
                    return false;
                }
                return null;
            case true:
                if (this.direction * newVal < this.direction * this.config.edgeDeactivate) {
                    this.state = false;
                    return false;
                }
                return null;
            case false:
                if (this.direction * newVal > this.direction * this.config.edgeActivate) {
                    this.state = true;
                    return true;
                }
                return null;
        }
    }
    /**
     * update a system of thresholds together, maininting the bistability
     * of each as well as the bistability of the system as a whole
     *
     * @param {...any} system
     */
    static updateSystem(...system) {
        // check the first state, if it's null, the system hasn't updated
        const [firstThreshold, firstValue] = system[0];
        const firstUpdated = firstThreshold.update(firstValue);
        const firstState = firstThreshold.getState();
        /*
         * update each state, tracking if any of them updated, and if all
         * of them have the same state
         */
        let anyUpdated = firstUpdated !== null;
        let allStatesEqual = true;
        for (let i = 1; i < system.length; i++) {
            // update the threshold
            const [threshold, value] = system[i];
            const update = threshold.update(value);
            const state = threshold.getState();
            allStatesEqual &&= state === firstState;
            anyUpdated ||= update !== null;
        }
        // if any have updated, then the system has updated as a whole
        return anyUpdated && allStatesEqual ? firstState : null;
    }
    /**
     * get the current state of the Threshold. This is less useful than the
     * update method since it only tells us the current state, not if it
     * has changed recently
     */
    getState() {
        return this.state;
    }
    /**
     * Clear the state of the threshold, returning to null for the state
     */
    clearState() {
        this.state = null;
    }
}
exports.default = BistableThreshold;
//# sourceMappingURL=BistableThreshold.js.map