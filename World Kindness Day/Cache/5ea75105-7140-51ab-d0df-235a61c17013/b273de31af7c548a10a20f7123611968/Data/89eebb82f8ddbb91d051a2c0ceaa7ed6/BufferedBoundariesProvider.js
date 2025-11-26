"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferedBoundariesProvider = void 0;
const BoundariesProvider_1 = require("./BoundariesProvider");
/**
 * Computes a boundary by adding a buffer around another boundariesProvider
 */
class BufferedBoundariesProvider extends BoundariesProvider_1.BoundariesProvider {
    /**
     * Computes a boundary by adding a buffer around another boundariesProvider
     * @param toBuffer - The BoundariesProvider to buffer
     * @param initialBuffer - The amount of buffer to apply
     */
    constructor(toBuffer, initialBuffer) {
        super();
        this.toBuffer = toBuffer;
        this.initialBuffer = initialBuffer;
        this._buffer = initialBuffer;
    }
    /**
     * Get the amount of buffer being applied
     */
    get buffer() {
        return this._buffer;
    }
    /**
     * Set the amount of buffer being applied
     * @param newBuffer - The new value
     */
    set buffer(newBuffer) {
        this._buffer = newBuffer;
    }
    get boundaries() {
        return Rect.create(this.toBuffer.boundaries.left - this.buffer.left, this.toBuffer.boundaries.right + this.buffer.right, this.toBuffer.boundaries.bottom - this.buffer.bottom, this.toBuffer.boundaries.top + this.buffer.top);
    }
}
exports.BufferedBoundariesProvider = BufferedBoundariesProvider;
//# sourceMappingURL=BufferedBoundariesProvider.js.map