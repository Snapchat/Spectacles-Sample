"use strict";
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tween = void 0;
const Easing_1 = require("./Easing");
const Interpolation_1 = require("./Interpolation");
const Sequence_1 = require("./Sequence");
const mainGroup_1 = require("./mainGroup");
const Now_1 = require("./Now");
class Tween {
    constructor(object, group) {
        this._isPaused = false;
        this._pauseStart = 0;
        this._valuesStart = {};
        this._valuesEnd = {};
        this._valuesStartRepeat = {};
        this._duration = 1000;
        this._isDynamic = false;
        this._initialRepeat = 0;
        this._repeat = 0;
        this._yoyo = false;
        this._isPlaying = false;
        this._reversed = false;
        this._delayTime = 0;
        this._startTime = 0;
        this._easingFunction = Easing_1.default.Linear.None;
        this._interpolationFunction = Interpolation_1.default.Linear;
        // eslint-disable-next-line
        this._chainedTweens = [];
        this._onStartCallbackFired = false;
        this._onEveryStartCallbackFired = false;
        this._id = Sequence_1.default.nextId();
        this._isChainStopped = false;
        this._propertiesAreSetUp = false;
        this._goToEnd = false;
        this._object = object;
        if (typeof group === "object") {
            this._group = group;
            group.add(this);
        }
        // Use "true" to restore old behavior (will be removed in future release).
        else if (group === true) {
            this._group = mainGroup_1.mainGroup;
            mainGroup_1.mainGroup.add(this);
        }
    }
    getId() {
        return this._id;
    }
    isPlaying() {
        return this._isPlaying;
    }
    isPaused() {
        return this._isPaused;
    }
    getDuration() {
        return this._duration;
    }
    to(target, duration = 1000) {
        if (this._isPlaying)
            throw new Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");
        this._valuesEnd = target;
        this._propertiesAreSetUp = false;
        this._duration = duration < 0 ? 0 : duration;
        return this;
    }
    duration(duration = 1000) {
        this._duration = duration < 0 ? 0 : duration;
        return this;
    }
    dynamic(dynamic = false) {
        this._isDynamic = dynamic;
        return this;
    }
    start(time = (0, Now_1.default)(), overrideStartingValues = false) {
        if (this._isPlaying) {
            return this;
        }
        this._repeat = this._initialRepeat;
        if (this._reversed) {
            // If we were reversed (f.e. using the yoyo feature) then we need to
            // flip the tween direction back to forward.
            this._reversed = false;
            for (const property in this._valuesStartRepeat) {
                this._swapEndStartRepeatValues(property);
                this._valuesStart[property] = this._valuesStartRepeat[property];
            }
        }
        this._isPlaying = true;
        this._isPaused = false;
        this._onStartCallbackFired = false;
        this._onEveryStartCallbackFired = false;
        this._isChainStopped = false;
        this._startTime = time;
        this._startTime += this._delayTime;
        if (!this._propertiesAreSetUp || overrideStartingValues) {
            this._propertiesAreSetUp = true;
            // If dynamic is not enabled, clone the end values instead of using the passed-in end values.
            if (!this._isDynamic) {
                const tmp = {};
                for (const prop in this._valuesEnd)
                    tmp[prop] = this._valuesEnd[prop];
                this._valuesEnd = tmp;
            }
            this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, overrideStartingValues);
        }
        return this;
    }
    startFromCurrentValues(time) {
        return this.start(time, true);
    }
    _setupProperties(_object, _valuesStart, _valuesEnd, _valuesStartRepeat, overrideStartingValues) {
        for (const property in _valuesEnd) {
            const startValue = _object[property];
            const startValueIsArray = Array.isArray(startValue);
            const propType = startValueIsArray ? "array" : typeof startValue;
            let isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]);
            // If `to()` specifies a property that doesn't exist in the source object,
            // we should not set that property in the object
            if (propType === "undefined" || propType === "function") {
                continue;
            }
            // Check if an Array was provided as property value
            if (isInterpolationList) {
                const endValues = _valuesEnd[property];
                if (endValues.length === 0) {
                    continue;
                }
                // Handle an array of relative values.
                // Creates a local copy of the Array with the start value at the front
                const temp = [startValue];
                for (let i = 0, l = endValues.length; i < l; i += 1) {
                    const value = this._handleRelativeValue(startValue, endValues[i]);
                    if (isNaN(value)) {
                        isInterpolationList = false;
                        print("[Warning]Found invalid interpolation list. Skipping.");
                        break;
                    }
                    temp.push(value);
                }
                if (isInterpolationList) {
                    // if (_valuesStart[property] === undefined) { // handle end values only the first time. NOT NEEDED? setupProperties is now guarded by _propertiesAreSetUp.
                    _valuesEnd[property] = temp;
                    // }
                }
            }
            // handle the deepness of the values
            if ((propType === "object" || startValueIsArray) &&
                startValue &&
                !isInterpolationList) {
                _valuesStart[property] = startValueIsArray ? [] : {};
                const nestedObject = startValue;
                for (const prop in nestedObject) {
                    _valuesStart[property][prop] = nestedObject[prop];
                }
                // TODO? repeat nested values? And yoyo? And array values?
                _valuesStartRepeat[property] = startValueIsArray ? [] : {};
                let endValues = _valuesEnd[property];
                // If dynamic is not enabled, clone the end values instead of using the passed-in end values.
                if (!this._isDynamic) {
                    const tmp = {};
                    for (const prop in endValues)
                        tmp[prop] = endValues[prop];
                    _valuesEnd[property] = endValues = tmp;
                }
                this._setupProperties(nestedObject, _valuesStart[property], endValues, _valuesStartRepeat[property], overrideStartingValues);
            }
            else {
                // Save the starting value, but only once unless override is requested.
                if (typeof _valuesStart[property] === "undefined" ||
                    overrideStartingValues) {
                    _valuesStart[property] = startValue;
                }
                if (!startValueIsArray) {
                    // eslint-disable-next-line
                    // @ts-ignore FIXME?
                    _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
                }
                if (isInterpolationList) {
                    // eslint-disable-next-line
                    // @ts-ignore FIXME?
                    _valuesStartRepeat[property] = _valuesEnd[property].slice().reverse();
                }
                else {
                    _valuesStartRepeat[property] = _valuesStart[property] || 0;
                }
            }
        }
    }
    stop() {
        if (!this._isChainStopped) {
            this._isChainStopped = true;
            this.stopChainedTweens();
        }
        if (!this._isPlaying) {
            return this;
        }
        this._isPlaying = false;
        this._isPaused = false;
        if (this._onStopCallback) {
            this._onStopCallback(this._object);
        }
        return this;
    }
    end() {
        this._goToEnd = true;
        this.update(this._startTime + this._duration);
        return this;
    }
    pause(time = (0, Now_1.default)()) {
        if (this._isPaused || !this._isPlaying) {
            return this;
        }
        this._isPaused = true;
        this._pauseStart = time;
        return this;
    }
    resume(time = (0, Now_1.default)()) {
        if (!this._isPaused || !this._isPlaying) {
            return this;
        }
        this._isPaused = false;
        this._startTime += time - this._pauseStart;
        this._pauseStart = 0;
        return this;
    }
    stopChainedTweens() {
        for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            this._chainedTweens[i].stop();
        }
        return this;
    }
    group(group) {
        if (!group) {
            print("[Warning] - tween.group() without args has been removed, use group.add(tween) instead.");
            return this;
        }
        group.add(this);
        return this;
    }
    /**
     * Removes the tween from whichever group it is in.
     */
    remove() {
        this._group?.remove(this);
        return this;
    }
    delay(amount = 0) {
        this._delayTime = amount;
        return this;
    }
    repeat(times = 0) {
        this._initialRepeat = times;
        this._repeat = times;
        return this;
    }
    repeatDelay(amount) {
        this._repeatDelayTime = amount;
        return this;
    }
    yoyo(yoyo = false) {
        this._yoyo = yoyo;
        return this;
    }
    easing(easingFunction = Easing_1.default.Linear.None) {
        this._easingFunction = easingFunction;
        return this;
    }
    interpolation(interpolationFunction = Interpolation_1.default.Linear) {
        this._interpolationFunction = interpolationFunction;
        return this;
    }
    // eslint-disable-next-line
    chain(...tweens) {
        this._chainedTweens = tweens;
        return this;
    }
    onStart(callback) {
        this._onStartCallback = callback;
        return this;
    }
    onEveryStart(callback) {
        this._onEveryStartCallback = callback;
        return this;
    }
    onUpdate(callback) {
        this._onUpdateCallback = callback;
        return this;
    }
    onRepeat(callback) {
        this._onRepeatCallback = callback;
        return this;
    }
    onComplete(callback) {
        this._onCompleteCallback = callback;
        return this;
    }
    onStop(callback) {
        this._onStopCallback = callback;
        return this;
    }
    /**
     * @returns true if the tween is still playing after the update, false
     * otherwise (calling update on a paused tween still returns true because
     * it is still playing, just paused).
     *
     * @param autoStart - When true, calling update will implicitly call start()
     * as well. Note, if you stop() or end() the tween, but are still calling
     * update(), it will start again!
     */
    update(time = (0, Now_1.default)(), autoStart = Tween.autoStartOnUpdate) {
        if (this._isPaused)
            return true;
        let property;
        if (!this._goToEnd && !this._isPlaying) {
            if (autoStart)
                this.start(time, true);
            else
                return false;
        }
        this._goToEnd = false;
        if (time < this._startTime) {
            return true;
        }
        if (this._onStartCallbackFired === false) {
            if (this._onStartCallback) {
                this._onStartCallback(this._object);
            }
            this._onStartCallbackFired = true;
        }
        if (this._onEveryStartCallbackFired === false) {
            if (this._onEveryStartCallback) {
                this._onEveryStartCallback(this._object);
            }
            this._onEveryStartCallbackFired = true;
        }
        const elapsedTime = time - this._startTime;
        const durationAndDelay = this._duration + (this._repeatDelayTime ?? this._delayTime);
        const totalTime = this._duration + this._repeat * durationAndDelay;
        const calculateElapsedPortion = () => {
            if (this._duration === 0)
                return 1;
            if (elapsedTime > totalTime) {
                return 1;
            }
            const timesRepeated = Math.trunc(elapsedTime / durationAndDelay);
            const timeIntoCurrentRepeat = elapsedTime - timesRepeated * durationAndDelay;
            // TODO use %?
            // const timeIntoCurrentRepeat = elapsedTime % durationAndDelay
            const portion = Math.min(timeIntoCurrentRepeat / this._duration, 1);
            if (portion === 0 && elapsedTime === this._duration) {
                return 1;
            }
            return portion;
        };
        const elapsed = calculateElapsedPortion();
        const value = this._easingFunction(elapsed);
        // properties transformations
        this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);
        if (this._onUpdateCallback) {
            this._onUpdateCallback(this._object, elapsed);
        }
        if (this._duration === 0 || elapsedTime >= this._duration) {
            if (this._repeat > 0) {
                const completeCount = Math.min(Math.trunc((elapsedTime - this._duration) / durationAndDelay) + 1, this._repeat);
                if (isFinite(this._repeat)) {
                    this._repeat -= completeCount;
                }
                // Reassign starting values, restart by making startTime = now
                for (property in this._valuesStartRepeat) {
                    if (!this._yoyo && typeof this._valuesEnd[property] === "string") {
                        this._valuesStartRepeat[property] =
                            // eslint-disable-next-line
                            // @ts-ignore FIXME?
                            this._valuesStartRepeat[property] +
                                parseFloat(this._valuesEnd[property]);
                    }
                    if (this._yoyo) {
                        this._swapEndStartRepeatValues(property);
                    }
                    this._valuesStart[property] = this._valuesStartRepeat[property];
                }
                if (this._yoyo) {
                    this._reversed = !this._reversed;
                }
                this._startTime += durationAndDelay * completeCount;
                if (this._onRepeatCallback) {
                    this._onRepeatCallback(this._object);
                }
                this._onEveryStartCallbackFired = false;
                return true;
            }
            else {
                if (this._onCompleteCallback) {
                    this._onCompleteCallback(this._object);
                }
                for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                    // Make the chained tweens start exactly at the time they should,
                    // even if the `update()` method was called way past the duration of the tween
                    this._chainedTweens[i].start(this._startTime + this._duration, false);
                }
                this._isPlaying = false;
                return false;
            }
        }
        return true;
    }
    _updateProperties(_object, _valuesStart, _valuesEnd, value) {
        for (const property in _valuesEnd) {
            // Don't update properties that do not exist in the source object
            if (_valuesStart[property] === undefined) {
                continue;
            }
            const start = _valuesStart[property] || 0;
            let end = _valuesEnd[property];
            const startIsArray = Array.isArray(_object[property]);
            const endIsArray = Array.isArray(end);
            const isInterpolationList = !startIsArray && endIsArray;
            if (isInterpolationList) {
                _object[property] = this._interpolationFunction(end, value);
            }
            else if (typeof end === "object" && end) {
                // eslint-disable-next-line
                // @ts-ignore FIXME?
                this._updateProperties(_object[property], start, end, value);
            }
            else {
                // Parses relative end values with start as base (e.g.: +10, -3)
                end = this._handleRelativeValue(start, end);
                // Protect against non numeric properties.
                if (typeof end === "number") {
                    // eslint-disable-next-line
                    // @ts-ignore FIXME?
                    _object[property] = start + (end - start) * value;
                }
            }
        }
    }
    _handleRelativeValue(start, end) {
        if (typeof end !== "string") {
            return end;
        }
        if (end.charAt(0) === "+" || end.charAt(0) === "-") {
            return start + parseFloat(end);
        }
        return parseFloat(end);
    }
    _swapEndStartRepeatValues(property) {
        const tmp = this._valuesStartRepeat[property];
        const endValue = this._valuesEnd[property];
        if (typeof endValue === "string") {
            this._valuesStartRepeat[property] =
                this._valuesStartRepeat[property] + parseFloat(endValue);
        }
        else {
            this._valuesStartRepeat[property] = this._valuesEnd[property];
        }
        this._valuesEnd[property] = tmp;
    }
}
exports.Tween = Tween;
Tween.autoStartOnUpdate = false;
exports.default = Tween;
//# sourceMappingURL=Tween.js.map