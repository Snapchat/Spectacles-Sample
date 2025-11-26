"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
/**
 * ReplayEvent keeps a buffer of {@link bufferSize} events that are emitted for
 * each new subscriber.
 */
class ReplayEvent extends Event_1.default {
    constructor(bufferSize = 1, ...callbacks) {
        super(...callbacks);
        this.bufferSize = bufferSize;
        this._buffer = [];
        if (this.bufferSize < 1)
            throw new Error("Buffer size can't be < 1");
    }
    /**
     * Register an event handler
     *
     * @param handler to register
     * @returns the function to invoke when unsubscribing from the event.
     */
    add(handler) {
        super.add(handler);
        this._buffer.forEach((value) => {
            handler(value);
        });
        return () => {
            this.remove(handler);
        };
    }
    invoke(arg) {
        super.invoke(arg);
        this._buffer.push(arg);
        this.trimBuffer();
    }
    trimBuffer() {
        const currentBufferLength = this._buffer.length;
        if (currentBufferLength > this.bufferSize) {
            this._buffer = this._buffer.splice(currentBufferLength - this.bufferSize);
        }
    }
}
exports.default = ReplayEvent;
//# sourceMappingURL=ReplayEvent.js.map