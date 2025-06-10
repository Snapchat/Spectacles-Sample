/**
 * @module EventModule
 * Module providing helper classes for using javascript based events.
 * @author Snap Inc.
 * @version 1.0.1
 * 
 * ====  Example ====
 * @example
 * 
 * // Import module
 * var eventModule = require("./EventModule");
 *
 * // Event Wrapper
 * var myEvent = new eventModule.EventWrapper(); 
 * 
 * // Add callback to the event
 * myEvent.add(function(arg){
 *     print("event triggered with param: " + arg);
 * });
 * 
 * // Trigger the event
 * myEvent.trigger("hello!");
 * 
 * 
 * // Keyed Event Wrapper
 * var keyedEvent = new eventModule.KeyedEventWrapper();
 * 
 * // Add callback for "eventA"
 * keyedEvent.add("eventA", function(){
 *     print("eventA was triggered!");
 * });
 * 
 * // Add callback for "eventB"
 * keyedEvent.add("eventB", function(){
 *     print("eventB was triggered!");
 * });
 * 
 * // Trigger the events
 * keyedEvent.trigger("eventA");
 * keyedEvent.trigger("eventB");
 * 
 * ====  API ====
 * @api
 * 
 * class EventWrapper()
 *      Simple implementation of an event class. Add callbacks to be notified when the event is triggered.
 * 
 * EventWrapper.add(function callback): function
 *      Add a callback function to this event. The callback function will be executed when this event is triggered.
 * 
 * EventWrapper.remove(function callback)
 *      Remove a callback function from this event.
 * 
 * EventWrapper.trigger(arguments...)
 *      Trigger the event so that all callbacks are executed. All arguments given will be passed to the callbacks.
 * 
 * 
 * 
 * class KeyedEventWrapper()
 *      Simple implementation of a key-based event class.
 * 
 * KeyedEventWrapper.getWrapper(string key, boolean createIfMissing=false)
 *      Return an EventWrapper for the given `key`.
 *      The EventWrapper holds all callbacks added with the same `key`, and is triggered when `trigger` is called with the same `key`.
 * 
 * KeyedEventWrapper.add(string key, function callback): function
 *      Add a callback function tied to the given `key`.
 *      The callback function will be executed when this KeyedEventWrapper is triggered using the same `key`.
 * 
 * KeyedEventWrapper.remove(string key, function callback)
 *      Remove a callback function tied to the given `key`.
 * 
 * KeyedEventWrapper.addAny(function callback): function
 *      Add a callback function that will be executed any time a trigger occurs.
 *      The first argument for the callback function is the key, the rest of the arguments are what get passed to the trigger. 
 * 
 * KeyedEventWrapper.removeAny(function callback): function
 *     Remove a callback function that was added using `addAny()`.
 * 
 * KeyedEventWrapper.trigger(string key, arguments...)
 *      Trigger all callback functions that were added using the same `key`. 
 *      All arguments after `key` will be passed to the callback functions.
 * 
 */

if (!isNull(script)) {
    throw ("Warning! EventModule is a script module. Import this module to your script using:\nvar events = require(\"./EventModule\");\nThis script should not be added to a SceneObject.");
}

/**
 * Simple implementation of an event class. Add callbacks to be notified when the event is triggered.
 * @class
 * @template {} [T0=void] arg0 type
 * @template {} [T1=void] arg1 type
 * @template {} [T2=void] arg2 type
 * @template {} [T3=void] arg3 type
 */
function EventWrapper() {
    /**
     * @private
     * @type {((arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void)[]}
     */
    this._callbacks = [];
}

/**
 * Add a callback function to this event. The callback function will be executed when this event is triggered.
 * @param {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} callback Callback function to execute when the event is triggered
 * @returns {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} Callback passed in, can be used with `remove()`
 */
EventWrapper.prototype.add = function(callback) {
    if (typeof callback === "function") {
        this._callbacks.push(callback);
        return callback;
    } else {
        throw ("Trying to add invalid callback type to EventWrapper. You must add a function.");
    }
};

/**
 * @deprecated Use `add` instead
 * @private
 * Add a callback function to this event. The callback function will be executed when this event is triggered.
 * @param {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} callback Callback function to execute when the event is triggered
 * @returns {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} Callback passed in, can be used with `remove()`
 */
EventWrapper.prototype.addCallback = function(callback) {
    return this.add(callback);
};

/**
 * Remove a callback function from this event.
 * @param {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} callback Callback function to remove
 */
EventWrapper.prototype.remove = function(callback) {
    var ind = this._callbacks.indexOf(callback);
    if (ind > -1) {
        this._callbacks.splice(ind, 1);
    } else {
        print("Trying to remove callback from EventWrapper, but the callback hasn't been added.");
    }
};

/**
 * @deprecated Use `remove` instead
 * @private
 * Remove a callback function from this event.
 * @param {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} callback Callback function to remove
 */
EventWrapper.prototype.removeCallback = function(callback) {
    this.remove(callback);
};

/**
 * Trigger the event so that all callbacks are executed. 
 * All arguments given will be passed to the callbacks.
 * @param {T0=} arg0 First argument to pass to callbacks
 * @param {T1=} arg1 Second argument to pass to callbacks
 * @param {T2=} arg2 Third argument to pass to callbacks
 * @param {T3=} arg3 Fourth argument to pass to callbacks
 * @param {...any=} extraArgs Additional arguments to pass to callbacks
 */
EventWrapper.prototype.trigger = function(arg0, arg1, arg2, arg3, extraArgs) {
    var callbacks = this._callbacks.slice();
    for (var i=0; i<callbacks.length; i++) {
        callbacks[i].apply(null, arguments);
    }
};

/**
 * Simple implementation of a key-based event class.
 * @class
 * @template {} [T0=void] arg0 type
 * @template {} [T1=void] arg1 type
 * @template {} [T2=void] arg2 type
 * @template {} [T3=void] arg3 type
 */
function KeyedEventWrapper() {
    /**
     * @private 
     * @type {Object.<string, EventWrapper<T0, T1, T2, T3>} 
     * */
    this._wrappers = {};
    /** 
     * @private
     * @type {EventWrapper<string, T0, T1, T2, T3>} 
     * */
    this._any = new EventWrapper();
}

/**
 * Return an EventWrapper for the given `key`.
 * The EventWrapper holds all callbacks added with the same `key`, and is triggered when `trigger` is called with the same `key`.
 * @param {string} key Key
 * @param {boolean=} createIfMissing If the wrapper is missing, a new one will be created.
 * @returns {EventWrapper<T0, T1, T2, T3>?} 
 */
KeyedEventWrapper.prototype.getWrapper = function(key, createIfMissing) {
    var wrapper = this._wrappers[key];
    if (!wrapper && createIfMissing) {
        wrapper = new EventWrapper();
        this._wrappers[key] = wrapper;
    }
    return wrapper || null;
};

/**
 * Add a callback function tied to the given `key`.
 * The callback function will be executed when this KeyedEventWrapper is triggered using the same `key`.
 * @param {string} key Key
 * @param {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3)=>void} callback Callback function to execute
 * @returns {(arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3)=>void} Callback passed in, can be used with `remove()`
 */
KeyedEventWrapper.prototype.add = function(key, callback) {
    return this.getWrapper(key, true).add(callback);
};

/**
 * Remove a callback function tied to the given `key`.
 * @param {string} key Key that was used to add the callback function
 * @param {(arg0:T0?, arg1:T1?, arg2:T2?)=>void} callback Callback function to remove
 */
KeyedEventWrapper.prototype.remove = function(key, callback) {
    var wrapper = this.getWrapper(key);
    if (wrapper) {
        wrapper.remove(callback);
    } else {
        print("Trying to remove callback from KeyedEventWrapper, but key hasn't been subscribed to: " + key);
    }
};

/**
 * Add a callback function that will be executed any time a trigger occurs.
 * The first argument for the callback function is the key, the rest of the arguments are what get passed to the trigger. 
 * @param {(key:string, arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} callback Callback function to execute when any trigger occurs
 * @returns {(key:string, arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} Callback passed in, can be used with `removeAny()`
 */
KeyedEventWrapper.prototype.addAny = function(callback) {
    return this._any.add(callback);
};

/**
 * Remove a callback function that was added using `addAny()`.
 * @param {(key:string, arg0:T0?, arg1:T1?, arg2:T2?, arg3:T3?)=>void} callback Callback function to remove
 */
KeyedEventWrapper.prototype.removeAny = function(callback) {
    this._any.remove(callback);
};

/**
 * Trigger all callback functions that were added using the same `key`. 
 * All arguments after `key` will be passed to the callback functions.
 * @param {string} key Key of the events to trigger
 * @param {T0=} arg0 First argument to pass to callbacks
 * @param {T1=} arg1 Second argument to pass to callbacks
 * @param {T2=} arg2 Third argument to pass to callbacks
 * @param {T3=} arg3 Fourth argument to pass to callbacks
 * @param {...any=} extraArgs Additional arguments to pass to callbacks
 */
KeyedEventWrapper.prototype.trigger = function(key, arg0, arg1, arg2, extraArgs) {
    var wrapper = this.getWrapper(key);
    if (wrapper) {
        var arglist = [];
        for (var i=1; i<arguments.length; i++) {
            arglist.push(arguments[i]);
        }
        
        wrapper.trigger.apply(wrapper, arglist);
    }
    this._any.trigger.apply(this._any, arguments);
};

module.exports.version = "1.0.1";
module.exports.EventWrapper = EventWrapper;
module.exports.KeyedEventWrapper = KeyedEventWrapper;