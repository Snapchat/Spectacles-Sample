"use strict";
/**
 * Event class with typed event arguments
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(...callbacks) {
        this.subscribers = callbacks.filter((cb) => cb !== undefined);
    }
    /**
     * Register an event handler
     *
     * @param handler to register
     * @returns the function to invoke when unsubscribing from the event.
     */
    add(handler) {
        this.subscribers.push(handler);
        return () => this.remove(handler);
    }
    /**
     * Unregister an event handler
     *
     * @param handler to remove
     */
    remove(handler) {
        this.subscribers = this.subscribers.filter((h) => {
            return h !== handler;
        });
    }
    /**
     * Invoke the event and notify handlers
     *
     * @param arg Event args to pass to the handlers
     */
    invoke(arg) {
        this.subscribers.forEach((handler) => {
            handler(arg);
        });
    }
    /**
     * Construct an object to serve as the publicApi of this
     * event. This makes it so an event can be used as "pre-bound"
     * function, and also prevents "invoke" from being called externally
     */
    publicApi() {
        const fn = this.add.bind(this); // Can add callbacks directly or invoke add.
        const addRemoveObject = { add: this.add.bind(this), remove: this.remove.bind(this) };
        const publicApi = Object.assign(fn, addRemoveObject);
        return publicApi;
    }
}
exports.default = Event;
//# sourceMappingURL=Event.js.map