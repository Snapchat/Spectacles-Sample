"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPool = void 0;
const NativeLogger_1 = require("./NativeLogger");
/**
 * A generic object pool for recycling objects to reduce pressure on the garbage collector.
 */
class ObjectPool {
    constructor(config) {
        this.items = [];
        this.borrowedItems = new Set();
        this._capacity = 0;
        this.factory = config.factory;
        this.onGet = config.onGet;
        this.onRelease = config.onRelease;
        this.growthFactor = config.growthFactor ?? 0.5;
        this.minGrowthAmount = config.minGrowthAmount ?? 10;
        const tag = config.parentTag ? `${config.parentTag}:ObjectPool` : "ObjectPool";
        this.log = new NativeLogger_1.default(tag);
        if (config.initialCapacity && config.initialCapacity > 0) {
            this.grow(config.initialCapacity);
        }
    }
    /**
     * The total number of objects managed by this pool (both available and in use).
     */
    get capacity() {
        return this._capacity;
    }
    /**
     * The number of objects that are currently "checked out" of the pool.
     */
    get inUse() {
        return this.borrowedItems.size;
    }
    /**
     * The number of objects currently available in the pool.
     */
    get available() {
        return this.items.length;
    }
    /**
     * Retrieves an object from the pool. If the pool is empty, it will automatically grow to create new objects.
     * @returns An object of type T.
     */
    pop() {
        this.ensureCapacity();
        const item = this.items.pop();
        this.borrowedItems.add(item);
        if (this.onGet) {
            this.onGet(item);
        }
        return item;
    }
    /**
     * Returns an object to the pool, making it available for reuse.
     * @param item The object to return to the pool.
     */
    push(item) {
        if (!this.borrowedItems.delete(item)) {
            this.log.e("Object being released was not part of the borrowed set. Double-release or invalid object detected.");
            return;
        }
        if (this.onRelease) {
            this.onRelease(item);
        }
        this.items.push(item);
    }
    /**
     * Executes a callback for each **available** item in the pool.
     * @param callback The function to execute for each item.
     */
    forEach(callback) {
        this.items.forEach(callback);
    }
    /**
     * Allows the pool to be used in `for...of` loops, iterating over **available** items.
     */
    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }
    /**
     * Explicitly adds a specified number of new objects to the pool.
     * @param amount The number of new objects to create.
     */
    prewarm(amount) {
        if (amount <= 0) {
            this.log.e(`Invalid prewarm amount: ${amount}. Must be positive.`);
            return;
        }
        this.grow(amount);
    }
    /**
     * Forcibly returns all borrowed items to the pool.
     *
     * This is a powerful tool for preventing memory leaks. By calling this at the beginning of a frame or a top-level
     * operation, you ensure that any objects that were not explicitly released are reclaimed.
     */
    reset() {
        for (const item of this.borrowedItems) {
            if (this.onRelease) {
                this.onRelease(item);
            }
            this.items.push(item);
        }
        this.borrowedItems.clear();
    }
    /**
     * Returns an object with the current pool statistics.
     * @returns An object containing capacity, available, inUse, and utilizationRate.
     */
    getStats() {
        return {
            capacity: this._capacity,
            available: this.available,
            inUse: this.inUse,
            utilizationRate: this._capacity > 0 ? this.inUse / this._capacity : 0
        };
    }
    ensureCapacity(minRequired = 1) {
        if (this.items.length >= minRequired) {
            return;
        }
        const growAmount = Math.max(this.minGrowthAmount, Math.ceil(this._capacity * this.growthFactor), minRequired - this.items.length);
        this.log.d(`Pool growing: required=${minRequired}, available=${this.items.length}, inUse=${this.inUse}. Growing by \
${growAmount}.`);
        this.grow(growAmount);
        this.log.d(`Pool grown: new capacity is ${this.capacity}.`);
    }
    grow(amount) {
        this._capacity += amount;
        for (let i = 0; i < amount; i++) {
            this.items.push(this.factory());
        }
    }
}
exports.ObjectPool = ObjectPool;
//# sourceMappingURL=ObjectPool.js.map