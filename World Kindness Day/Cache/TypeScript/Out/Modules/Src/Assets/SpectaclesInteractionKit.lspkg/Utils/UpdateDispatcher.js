"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchedDelayedEvent = exports.DispatchedUpdateEvent = exports.BaseDispatchedEvent = exports.UpdateDispatcher = void 0;
const BinaryHeap_1 = require("./BinaryHeap");
const mathUtils_1 = require("./mathUtils");
const NativeLogger_1 = require("./NativeLogger");
const ObjectPool_1 = require("./ObjectPool");
//export {UpdateDispatcherDebug as UpdateDispatcher} // Debug - With performance metrics
const TAG = "UpdateDispatcher";
const log = new NativeLogger_1.default(TAG);
const UPDATE_POOL_PREALLOCATE_COUNT = 100;
const LATE_UPDATE_POOL_PREALLOCATE_COUNT = 100;
const DELAYED_EVENT_POOL_PREALLOCATE_COUNT = 50;
const PRIORITY_CHANGE_POOL_PREALLOCATE_COUNT = 10;
const POOL_GROWTH_FACTOR = 0.33;
const POOL_GROWTH_MIN = 10;
const PENDING_ARRAY_PREALLOCATE_COUNT = 10;
const DISPATCHER_ACCESS_TOKEN = Symbol("dispatcherAccess"); // Used for "friend class" access
const DEFAULT_PRIORITY = 0;
/**
 * The UpdateDispatcher manages different types of events (Update, LateUpdate, and Delayed) with priority-based
 * execution ordering. It uses object pooling for memory efficiency and provides a safe API for scheduling,
 * prioritizing, and removing events.
 */
class UpdateDispatcher {
    constructor(script) {
        this.delayedEventsHeap = new BinaryHeap_1.default((a, b) => a.invokeAfterTime - b.invokeAfterTime);
        this.updateEventPool = new ObjectPool_1.ObjectPool({
            factory: () => {
                const event = new DispatchedUpdateEvent("", DEFAULT_PRIORITY);
                event.setName(`pooled_update_${event.id}`, DISPATCHER_ACCESS_TOKEN);
                return event;
            },
            initialCapacity: UPDATE_POOL_PREALLOCATE_COUNT,
            growthFactor: POOL_GROWTH_FACTOR,
            minGrowthAmount: POOL_GROWTH_MIN,
            parentTag: `${TAG}:Update`,
            onRelease: (event) => {
                event.enabled = true;
            }
        });
        this.lateUpdateEventPool = new ObjectPool_1.ObjectPool({
            factory: () => {
                const event = new DispatchedUpdateEvent("", DEFAULT_PRIORITY);
                event.setName(`pooled_late_update_${event.id}`, DISPATCHER_ACCESS_TOKEN);
                return event;
            },
            initialCapacity: LATE_UPDATE_POOL_PREALLOCATE_COUNT,
            growthFactor: POOL_GROWTH_FACTOR,
            minGrowthAmount: POOL_GROWTH_MIN,
            parentTag: `${TAG}:LateUpdate`,
            onRelease: (event) => {
                event.enabled = true;
            }
        });
        this.delayedEventPool = new ObjectPool_1.ObjectPool({
            factory: () => {
                const event = new DispatchedDelayedEvent("");
                event.setName(`pooled_delayed_${event.id}`, DISPATCHER_ACCESS_TOKEN);
                return event;
            },
            initialCapacity: DELAYED_EVENT_POOL_PREALLOCATE_COUNT,
            growthFactor: POOL_GROWTH_FACTOR,
            minGrowthAmount: POOL_GROWTH_MIN,
            parentTag: `${TAG}:Delayed`
        });
        this.priorityChangePool = new ObjectPool_1.ObjectPool({
            factory: () => ({
                event: null,
                priority: 0,
                pool: null
            }),
            initialCapacity: PRIORITY_CHANGE_POOL_PREALLOCATE_COUNT,
            growthFactor: POOL_GROWTH_FACTOR,
            minGrowthAmount: POOL_GROWTH_MIN,
            parentTag: `${TAG}:PriorityChange`
        });
        this.pendingUpdateEventSet = new Set();
        this.pendingLateUpdateEventSet = new Set();
        this.pendingEventSetsMap = new Map();
        this.recyclePoolMap = new Map();
        this.mainUpdateEvent = script.createEvent("UpdateEvent");
        this.mainUpdateEvent.bind(this.onUpdate.bind(this));
        this.mainLateUpdateEvent = script.createEvent("LateUpdateEvent");
        this.mainLateUpdateEvent.bind(this.onLateUpdate.bind(this));
        // Preallocate arrays, reset length to 0 to clear
        this.updateEvents = new Array(UPDATE_POOL_PREALLOCATE_COUNT);
        this.updateEvents.length = 0;
        this.lateUpdateEvents = new Array(LATE_UPDATE_POOL_PREALLOCATE_COUNT);
        this.lateUpdateEvents.length = 0;
        this.pendingDelayedEvents = new Array(PENDING_ARRAY_PREALLOCATE_COUNT);
        this.pendingDelayedEvents.length = 0;
        this.pendingPriorityChanges = new Array(PENDING_ARRAY_PREALLOCATE_COUNT);
        this.pendingPriorityChanges.length = 0;
        this.pendingEventSetsMap.set(this.updateEvents, this.pendingUpdateEventSet);
        this.pendingEventSetsMap.set(this.lateUpdateEvents, this.pendingLateUpdateEventSet);
        this.recyclePoolMap.set(this.updateEvents, this.updateEventPool);
        this.recyclePoolMap.set(this.lateUpdateEvents, this.lateUpdateEventPool);
    }
    /**
     * Creates an event that fires during the Update phase.
     * Higher priority values (larger numbers) will be processed earlier in the update cycle.
     *
     * @param name - Descriptive name for the event for debugging purposes.
     * @param callback - Optional callback to automatically bind to the event
     * @param priority - Optional priority value (default: 0). Higher values run first.
     * @returns The created update event.
     */
    createUpdateEvent(name, callback, priority = DEFAULT_PRIORITY) {
        if (priority < DEFAULT_PRIORITY) {
            log.f(`Priority must be greater than or equal to ${DEFAULT_PRIORITY}`);
        }
        const event = this.updateEventPool.pop();
        event.reset(name, callback, priority, true);
        this.pendingUpdateEventSet.add(event);
        return event;
    }
    /**
     * Creates an event that fires during the LateUpdate phase (after all Update events).
     * Higher priority values (larger numbers) will be processed earlier in the late update cycle.
     *
     * @param name - Descriptive name for the event for debugging purposes.
     * @param callback - Optional callback to automatically bind to the event
     * @param priority - Optional priority value (default: 0). Higher values run first.
     * @returns The created late update event.
     */
    createLateUpdateEvent(name, callback, priority = DEFAULT_PRIORITY) {
        if (priority < DEFAULT_PRIORITY) {
            log.f(`Priority must be greater than or equal to ${DEFAULT_PRIORITY}`);
        }
        const event = this.lateUpdateEventPool.pop();
        event.reset(name, callback, priority, true);
        this.pendingLateUpdateEventSet.add(event);
        return event;
    }
    /**
     * Changes the priority of an existing update event.
     * The event will be reordered in the execution sequence according to its new priority.
     *
     * @param event - The update event to modify.
     * @param priority - New priority value. Higher values run first.
     */
    setUpdateEventPriority(event, priority) {
        this.setEventPriority(this.updateEvents, event, priority);
    }
    /**
     * Changes the priority of an existing late update event.
     * The event will be reordered in the execution sequence according to its new priority.
     *
     * @param event - The late update event to modify.
     * @param priority - New priority value. Higher values run first.
     */
    setLateUpdateEventPriority(event, priority) {
        this.setEventPriority(this.lateUpdateEvents, event, priority);
    }
    /**
     * Marks an event for removal from the dispatcher.
     * The event will be removed during the next dispatch cycle.
     *
     * @param event - The event to remove (can be an update, late update, or delayed event)
     */
    removeEvent(event) {
        event.setMarkedForRemoval(true, DISPATCHER_ACCESS_TOKEN);
        event.clearCallback(DISPATCHER_ACCESS_TOKEN);
    }
    /**
     * Creates a delayed event that will be called after a specified time.
     * Events are removed from the dispatch queue after firing.
     * To reuse an event, keep a reference and call resetDelayedEvent().
     * If delayTimeSeconds is negative, the event is created but not scheduled to run, resetDelayedEvent() must be called.
     *
     * @param name - Descriptive name for the event for debugging purposes.
     * @param callback - Optional callback to automatically bind to the event.
     * @param delayTimeSeconds - The time in seconds to wait before firing the event, or negative to create without
     *                           scheduling.
     * @returns The created delayed event.
     */
    createDelayedEvent(name, callback, delayTimeSeconds = -1) {
        const event = this.delayedEventPool.pop();
        const shouldSchedule = event.reset(name, callback, delayTimeSeconds);
        if (shouldSchedule) {
            this.pendingDelayedEvents.push(event);
        }
        return event;
    }
    /**
     * Schedules a callback to be executed on the next frame.
     *
     * @param dispatcher - The UpdateDispatcher instance
     * @param name - Name for the event (useful for debugging)
     * @param callback - The function to execute on the next frame
     * @returns The created delayed event, which can be cancelled with removeEvent if needed
     */
    nextFrame(name, callback) {
        return this.createDelayedEvent(name, callback, 0);
    }
    /**
     * Reschedules a delayed event with a new delay time.
     * If the event is currently scheduled, it will be removed from the heap first.
     * If delayTimeSeconds is negative, the event is unscheduled without being rescheduled.
     *
     * @param event - The delayed event to reschedule.
     * @param delayTimeSeconds - The new time in seconds to wait before firing the event, or negative to unschedule
     *                           without rescheduling.
     */
    resetDelayedEvent(event, delayTimeSeconds = -1) {
        if (event.isScheduled && delayTimeSeconds < 0) {
            // Cancel an already scheduled event by removing it from the heap
            this.delayedEventsHeap.remove(event);
            event.setIsScheduled(false, DISPATCHER_ACCESS_TOKEN);
            return;
        }
        if (!event.isScheduled && delayTimeSeconds >= 0) {
            // Schedule an unscheduled event by adding it to the heap
            event.reset(event.name, event.callback, delayTimeSeconds);
            this.delayedEventsHeap.push(event);
            return;
        }
        if (event.isScheduled && delayTimeSeconds >= 0) {
            // Update timing of an already scheduled event and rebalance the heap if needed
            const oldInvokeTime = event.invokeAfterTime;
            event.reset(event.name, event.callback, delayTimeSeconds);
            if (oldInvokeTime !== event.invokeAfterTime) {
                this.delayedEventsHeap.rebalance(event);
            }
            return;
        }
    }
    onUpdate() {
        this.dispatchUpdateEvents(this.updateEvents);
        this.dispatchDelayedEvents();
    }
    onLateUpdate() {
        this.dispatchUpdateEvents(this.lateUpdateEvents);
    }
    insertEventWithPriority(events, event) {
        const eventsLength = events.length;
        const eventPriority = event.priority;
        if (eventPriority === DEFAULT_PRIORITY || eventsLength === 0) {
            // Adding a default priority event to the end always maintains order
            events.push(event);
            return;
        }
        if (eventPriority < events[eventsLength - 1].priority) {
            // New event has a lower priority than the last event, insert at the end
            events.push(event);
            return;
        }
        // Otherwise, find the correct position to insert the new event
        let insertAt = eventsLength;
        for (let i = 0; i < eventsLength; i++) {
            if (events[i].priority <= eventPriority) {
                insertAt = i;
                break;
            }
        }
        events.length++;
        for (let i = eventsLength; i > insertAt; i--) {
            events[i] = events[i - 1];
        }
        events[insertAt] = event;
    }
    setEventPriority(eventArray, updateEvent, priority) {
        if (updateEvent == null) {
            log.e("UpdateEvent cannot be null");
            return;
        }
        if (priority < DEFAULT_PRIORITY) {
            log.f(`Priority must be greater than or equal to ${DEFAULT_PRIORITY}`);
        }
        if (updateEvent.priority === priority) {
            return;
        }
        const change = this.priorityChangePool.pop();
        change.event = updateEvent;
        change.priority = priority;
        change.pool = eventArray;
        this.pendingPriorityChanges.push(change);
    }
    dispatchUpdateEvents(pool) {
        this.processPendingEventCreations();
        this.processPendingPriorityChanges();
        let activeCount = 0;
        const poolLength = pool.length;
        const recyclePool = this.recyclePoolMap.get(pool);
        for (let i = 0; i < poolLength; i++) {
            const event = pool[i];
            if (event.markedForRemoval) {
                event.clearCallback(DISPATCHER_ACCESS_TOKEN);
                recyclePool.push(event);
                continue;
            }
            // Compact the array by moving active events toward the beginning
            if (i !== activeCount) {
                pool[activeCount] = event;
            }
            if (event.enabled) {
                this.executeUpdateEvent(event, pool);
            }
            activeCount++;
        }
        if (activeCount < poolLength) {
            pool.length = activeCount;
        }
    }
    processPendingEventCreations() {
        // Process update event insertions
        const updateCount = this.pendingUpdateEventSet.size;
        for (const event of this.pendingUpdateEventSet) {
            this.insertEventWithPriority(this.updateEvents, event);
        }
        this.pendingUpdateEventSet.clear();
        // Process late update event insertions
        const lateUpdateCount = this.pendingLateUpdateEventSet.size;
        for (const event of this.pendingLateUpdateEventSet) {
            this.insertEventWithPriority(this.lateUpdateEvents, event);
        }
        this.pendingLateUpdateEventSet.clear();
        // Process delayed event insertions
        const delayedInsertionCount = this.pendingDelayedEvents.length;
        for (let i = 0; i < delayedInsertionCount; i++) {
            this.delayedEventsHeap.push(this.pendingDelayedEvents[i]);
        }
        this.pendingDelayedEvents.length = 0;
        const totalCount = updateCount + lateUpdateCount + delayedInsertionCount;
        if (totalCount > 0) {
            log.d(`Processed ${totalCount} queued event operations`);
        }
    }
    processPendingPriorityChanges() {
        const count = this.pendingPriorityChanges.length;
        if (count === 0) {
            return;
        }
        log.d(`Processing ${count} queued priority changes`);
        for (let i = 0; i < count; i++) {
            const change = this.pendingPriorityChanges[i];
            const { event, priority, pool } = change;
            if (event.priority === priority) {
                this.priorityChangePool.push(change);
                continue;
            }
            let currentIndex = -1;
            const poolLength = pool.length;
            for (let j = 0; j < poolLength; j++) {
                if (pool[j].id === event.id) {
                    currentIndex = j;
                    break;
                }
            }
            if (currentIndex === -1) {
                log.w(`Event ${event.name || "unnamed"} not found in event array`);
                this.priorityChangePool.push(change);
                continue;
            }
            for (let j = currentIndex; j < poolLength - 1; j++) {
                pool[j] = pool[j + 1];
            }
            pool.length--;
            event.setPriority(priority, DISPATCHER_ACCESS_TOKEN);
            this.insertEventWithPriority(pool, event);
            this.priorityChangePool.push(change);
        }
        this.pendingPriorityChanges.length = 0;
    }
    executeUpdateEvent(event, _pool) {
        try {
            event.invoke();
        }
        catch (error) {
            let logString = `Error in event "${event.name || "unnamed"}": ${error}`;
            if (error instanceof Error && error.stack) {
                const stack = SourceMaps.applyToStackTrace(error.stack);
                logString += `${stack}`;
            }
            log.e(logString);
        }
    }
    dispatchDelayedEvents() {
        const curTime = getTime();
        const heap = this.delayedEventsHeap;
        while (heap.size > 0 && heap.peek().invokeAfterTime < curTime) {
            const event = heap.pop();
            if (event.markedForRemoval) {
                event.clearCallback(DISPATCHER_ACCESS_TOKEN);
                this.delayedEventPool.push(event);
                continue;
            }
            // Set event.isScheduled to false before invoking the callback. If the event is reset during the callback,
            // event.isScheduled will be set to true, which is checked below to avoid recycling the event to the pool.
            event.setIsScheduled(false, DISPATCHER_ACCESS_TOKEN);
            this.executeDelayedEvent(event);
            if (!event.isScheduled) {
                this.delayedEventPool.push(event);
            }
        }
    }
    executeDelayedEvent(event) {
        try {
            event.invoke();
        }
        catch (error) {
            let logString = `Error in delayed event "${event.name || "unnamed"}": ${error}`;
            if (error instanceof Error && error.stack) {
                const stack = SourceMaps.applyToStackTrace(error.stack);
                logString += `${stack}`;
            }
            log.e(logString);
        }
    }
}
exports.UpdateDispatcher = UpdateDispatcher;
class BaseDispatchedEvent {
    constructor(name = "") {
        this.id = BaseDispatchedEvent.TIMES_CREATED++;
        this._markedForRemoval = false;
        this._name = name;
        this._callback = BaseDispatchedEvent.NO_OP;
    }
    /**
     * Associates a callback function with this event.
     * The provided function will be executed when the event is invoked.
     *
     * @param callback - The function to execute when this event is triggered
     */
    bind(callback) {
        this._callback = callback;
    }
    /**
     * Executes the callback function associated with this event.
     * Does nothing if no callback has been bound.
     */
    invoke() {
        this._callback();
    }
    /**
     * Returns the name of this event.
     */
    get name() {
        return this._name;
    }
    /**
     * Returns the callback of this event.
     */
    get callback() {
        return this._callback;
    }
    /**
     * Internal use only.
     */
    setName(value, accessToken) {
        if (accessToken !== DISPATCHER_ACCESS_TOKEN) {
            log.f("Unauthorized access to setName()");
        }
        this._name = value;
    }
    /**
     * Internal use only.
     */
    clearCallback(accessToken) {
        if (accessToken !== DISPATCHER_ACCESS_TOKEN) {
            log.f("Unauthorized access to clearCallback()");
        }
        this._callback = BaseDispatchedEvent.NO_OP;
    }
    /**
     * Internal use only.
     */
    get markedForRemoval() {
        return this._markedForRemoval;
    }
    /**
     * Internal use only.
     */
    setMarkedForRemoval(value, accessToken) {
        if (accessToken !== DISPATCHER_ACCESS_TOKEN) {
            log.f("Unauthorized access to setMarkedForRemoval()");
        }
        this._markedForRemoval = value;
    }
    superReset(name) {
        this._name = name;
        this._markedForRemoval = false;
        // We don't set `this.callback = BaseDispatchedEvent.NO_OP` here because reset delayed events need to keep their
        // callback binding.
    }
}
exports.BaseDispatchedEvent = BaseDispatchedEvent;
BaseDispatchedEvent.TIMES_CREATED = 0;
BaseDispatchedEvent.NO_OP = () => { };
class DispatchedUpdateEvent extends BaseDispatchedEvent {
    constructor(name, _priority = 0) {
        super(name);
        this._priority = _priority;
        this.enabled = true;
    }
    get priority() {
        return this._priority;
    }
    /**
     * Internal use only.
     */
    reset(name, callback, priority = DEFAULT_PRIORITY, enabled = true) {
        this.superReset(name);
        this._priority = priority;
        this.enabled = enabled;
        if (callback !== undefined) {
            this.bind(callback);
        }
    }
    /**
     * Internal use only.
     */
    setPriority(value, accessToken) {
        if (accessToken !== DISPATCHER_ACCESS_TOKEN) {
            log.f("Unauthorized access to setPriority()");
        }
        this._priority = value;
    }
}
exports.DispatchedUpdateEvent = DispatchedUpdateEvent;
class DispatchedDelayedEvent extends BaseDispatchedEvent {
    constructor(name) {
        super(name);
        this._isScheduled = false;
        this._invokeAfterTime = 0;
    }
    /**
     * Returns the time in seconds when this event will be invoked.
     */
    get invokeAfterTime() {
        return this._invokeAfterTime;
    }
    /**
     * Internal use only.
     * @returns true if the event was scheduled, false if it was not
     */
    reset(name, callback, delayTimeSeconds = -1) {
        this.superReset(name);
        if (callback !== undefined) {
            this.bind(callback);
        }
        if (delayTimeSeconds >= 0) {
            this._invokeAfterTime = getTime() + delayTimeSeconds;
            this._isScheduled = true;
            return true;
        }
        this._isScheduled = false;
        return false;
    }
    get isScheduled() {
        return this._isScheduled;
    }
    /**
     * Internal use only.
     */
    setIsScheduled(value, accessToken) {
        if (accessToken !== DISPATCHER_ACCESS_TOKEN) {
            log.f("Unauthorized access to set isScheduled()");
        }
        this._isScheduled = value;
    }
}
exports.DispatchedDelayedEvent = DispatchedDelayedEvent;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class UpdateDispatcherDebug extends UpdateDispatcher {
    constructor(script) {
        super(script);
        this.DEBUG_LOG_INTERVAL_SECONDS = 1.0;
        this.lastLogTime = 0;
        this.updateEventTimings = new Map();
        this.lateUpdateEventTimings = new Map();
        this.delayedEventTimings = new Map();
        this.frameStats = {
            frameCount: 0,
            totalFrameTime: 0,
            maxFrameTime: 0,
            lastResetTime: 0,
            sessionMaxFrameTime: 0
        };
        this.updateEventsThisFrame = 0;
        this.lateUpdateEventsThisFrame = 0;
        this.delayedEventsThisFrame = 0;
        this.maxUpdateEventsPerFrame = 0;
        this.maxLateUpdateEventsPerFrame = 0;
        this.maxDelayedEventsPerFrame = 0;
        this.poolToTimings = new Map();
        this.poolToCounter = new Map();
        this.poolToTimings.set(this.updateEvents, this.updateEventTimings);
        this.poolToTimings.set(this.lateUpdateEvents, this.lateUpdateEventTimings);
        this.poolToCounter.set(this.updateEvents, { counter: "updateEventsThisFrame" });
        this.poolToCounter.set(this.lateUpdateEvents, { counter: "lateUpdateEventsThisFrame" });
    }
    processFrameStats(startTime, isLateUpdate = false) {
        const endTime = getRealTimeNanos();
        const eventTimeSeconds = (endTime - startTime) / mathUtils_1.NANOSECONDS_PER_SECOND;
        if (!isLateUpdate) {
            this.frameStats.frameCount++;
        }
        this.frameStats.totalFrameTime += eventTimeSeconds;
        this.frameStats.maxFrameTime = Math.max(this.frameStats.maxFrameTime, eventTimeSeconds);
    }
    onUpdate() {
        this.updateEventsThisFrame = 0;
        this.delayedEventsThisFrame = 0;
        const startTime = getRealTimeNanos();
        super.onUpdate();
        this.processFrameStats(startTime);
        this.maxUpdateEventsPerFrame = Math.max(this.maxUpdateEventsPerFrame, this.updateEventsThisFrame);
        this.maxDelayedEventsPerFrame = Math.max(this.maxDelayedEventsPerFrame, this.delayedEventsThisFrame);
        this.tryLogDebugInfo();
        this.processTimes();
    }
    onLateUpdate() {
        this.lateUpdateEventsThisFrame = 0;
        const startTime = getRealTimeNanos();
        super.onLateUpdate();
        this.processFrameStats(startTime, true);
        this.maxLateUpdateEventsPerFrame = Math.max(this.maxLateUpdateEventsPerFrame, this.lateUpdateEventsThisFrame);
        this.processTimes();
    }
    processTimes() {
        this.updateEventTimings.forEach(this.processTiming, this);
        this.lateUpdateEventTimings.forEach(this.processTiming, this);
        this.delayedEventTimings.forEach(this.processTiming, this);
    }
    executeUpdateEvent(event, pool) {
        const timings = this.poolToTimings.get(pool);
        const counterInfo = this.poolToCounter.get(pool);
        this[counterInfo.counter]++;
        const startTime = getRealTimeNanos();
        super.executeUpdateEvent(event, pool);
        this.updateEventTiming(event, startTime, timings);
    }
    executeDelayedEvent(event) {
        this.delayedEventsThisFrame++;
        const startTime = getRealTimeNanos();
        super.executeDelayedEvent(event);
        this.updateEventTiming(event, startTime, this.delayedEventTimings);
    }
    createNewEventTiming() {
        return {
            count: 0,
            totalTime: 0,
            maxTime: 0,
            framesActive: 0,
            currentFrameTime: 0,
            maxFrameTime: 0,
            totalFrameTime: 0,
            currentFrameCount: 0,
            maxFrameCount: 0
        };
    }
    updateEventTiming(event, startTime, timings) {
        if (!event?.name) {
            return; // Early return if event or event.name is null/undefined
        }
        const eventElapsedSeconds = (getRealTimeNanos() - startTime) / mathUtils_1.NANOSECONDS_PER_SECOND;
        let timing = timings.get(event.name);
        if (!timing) {
            timing = this.createNewEventTiming();
            timings.set(event.name, timing);
        }
        timing.count++;
        timing.currentFrameCount++;
        timing.totalTime += eventElapsedSeconds;
        timing.maxTime = Math.max(timing.maxTime, eventElapsedSeconds);
        if (timing.currentFrameTime === 0) {
            timing.framesActive++;
        }
        timing.currentFrameTime += eventElapsedSeconds;
    }
    processTiming(timing) {
        if (timing.currentFrameTime > 0) {
            timing.totalFrameTime += timing.currentFrameTime;
            timing.maxFrameTime = Math.max(timing.maxFrameTime, timing.currentFrameTime);
            timing.maxFrameCount = Math.max(timing.maxFrameCount, timing.currentFrameCount);
            timing.currentFrameTime = 0;
            timing.currentFrameCount = 0;
        }
    }
    tryLogDebugInfo() {
        const currentTime = getTime();
        const timeSinceLastLog = currentTime - this.lastLogTime;
        if (timeSinceLastLog < this.DEBUG_LOG_INTERVAL_SECONDS) {
            return;
        }
        print(`${TAG} =====================================================================================================================`);
        print(TAG);
        this.lastLogTime = currentTime;
        const frameCount = this.frameStats.frameCount;
        if (frameCount > 0) {
            const avgFrameTime = this.frameStats.totalFrameTime / frameCount;
            this.frameStats.sessionMaxFrameTime = Math.max(this.frameStats.sessionMaxFrameTime, this.frameStats.maxFrameTime);
            print(`${TAG} Frame Statistics:`);
            print(`${TAG}  Average frame time: ${(avgFrameTime * 1000).toFixed(2)}ms`);
            print(`${TAG}  Worst frame time (last ${this.DEBUG_LOG_INTERVAL_SECONDS}s): ${(this.frameStats.maxFrameTime * 1000).toFixed(2)}ms`);
            print(`${TAG}  Worst frame time (entire session): ${(this.frameStats.sessionMaxFrameTime * 1000).toFixed(2)}ms`);
            print(TAG);
            this.frameStats.frameCount = 0;
            this.frameStats.totalFrameTime = 0;
            this.frameStats.maxFrameTime = 0;
            this.frameStats.lastResetTime = currentTime;
        }
        print(`${TAG} Pool Utilization:`);
        print(`${TAG}  Update Pool: ${this.updateEventPool.inUse}/${this.updateEventPool.capacity} used/total`);
        print(`${TAG}  Late Update Pool: ${this.lateUpdateEventPool.inUse}/${this.lateUpdateEventPool.capacity} used/total`);
        print(`${TAG}  Delayed Pool: ${this.delayedEventPool.inUse}/${this.delayedEventPool.capacity} used/total`);
        print(`${TAG}  Priority Change Pool: ${this.priorityChangePool.inUse}/${this.priorityChangePool.capacity} used/total`);
        print(TAG);
        print(`${TAG} Metrics explained:`);
        print(`${TAG}  AVG(ms): Average time per individual call`);
        print(`${TAG}  MAX(ms): Maximum time for any single call`);
        print(`${TAG}  AVG/FRAME: Average combined time of all same-named events in a frame`);
        print(`${TAG}  MAX/FRAME: Maximum combined time of all same-named events in any frame`);
        print(TAG);
        this.logEventPoolDiagnostics("Update", this.updateEventTimings, this.maxUpdateEventsPerFrame, this.updateEvents.length);
        print(TAG);
        this.logEventPoolDiagnostics("LateUpdate", this.lateUpdateEventTimings, this.maxLateUpdateEventsPerFrame, this.lateUpdateEvents.length);
        print(TAG);
        this.logEventPoolDiagnostics("Delayed", this.delayedEventTimings, this.maxDelayedEventsPerFrame, this.delayedEventsHeap.size);
        print(TAG);
        print(`${TAG} =====================================================================================================================`);
    }
    logEventPoolDiagnostics(poolName, timings, maxPerFrame, currentCount) {
        const NAME_COLUMN_WIDTH = 50; // Slightly reduce to make room for COUNT column
        const NAME_TEXT_MAX_LENGTH = 50;
        const COUNT_COLUMN_WIDTH = 6; // New column for per-frame counts
        const COLUMN_SEPARATOR = " | ";
        const NUMERIC_COLUMN_WIDTH = 10;
        const CALLS_COLUMN_WIDTH = 8;
        const DECIMAL_PLACES = 2;
        const MAX_TOP_EVENTS = 10;
        if (timings.size === 0) {
            return;
        }
        const events = Array.from(timings.entries())
            .map(([name, timing]) => ({
            name,
            count: timing.count,
            totalTime: timing.totalTime,
            avgTime: timing.totalTime / timing.count,
            maxTime: timing.maxTime,
            framesActive: timing.framesActive,
            avgTimePerFrame: timing.framesActive > 0 ? timing.totalFrameTime / timing.framesActive : 0,
            maxTimePerFrame: timing.maxFrameTime,
            maxFrameCount: timing.maxFrameCount
        }))
            .sort((a, b) => b.totalTime - a.totalTime);
        // Overall stats
        const totalEvents = events.reduce((sum, e) => sum + e.count, 0);
        const totalTime = events.reduce((sum, e) => sum + e.totalTime, 0);
        // Summary
        print(`${TAG} ${poolName} diagnostics: ${currentCount} events (${maxPerFrame} max/frame), ` +
            `${events.length} unique names, ${totalEvents} calls, ${(totalTime * 1000).toFixed(DECIMAL_PLACES)}ms total time`);
        // Top consumers
        const topEvents = events.slice(0, MAX_TOP_EVENTS);
        if (topEvents.length > 0) {
            print(`${TAG} ${poolName} top consumers:`);
            // Print header with COUNT column
            print(`${TAG}   ${"EVENT NAME".padEnd(NAME_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"COUNT".padStart(COUNT_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"CALLS\
".padStart(CALLS_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"TOTAL(ms)".padStart(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"\
AVG(ms)".padStart(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"MAX(ms)\
".padStart(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"AVG/FRAME\
".padStart(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"MAX/FRAME".padStart(NUMERIC_COLUMN_WIDTH)}`);
            print(`${TAG}   ${"-".repeat(NAME_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"-".repeat(COUNT_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"-".repeat(CALLS_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"-\
".repeat(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"-".repeat(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"-\
".repeat(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"-".repeat(NUMERIC_COLUMN_WIDTH)}${COLUMN_SEPARATOR}${"-\
".repeat(NUMERIC_COLUMN_WIDTH)}`);
            // Print each event with COUNT as a separate column
            topEvents.forEach((e) => {
                let displayName = e.name;
                if (displayName.length > NAME_TEXT_MAX_LENGTH) {
                    displayName = displayName.substring(0, NAME_TEXT_MAX_LENGTH - 3) + "...";
                }
                const name = displayName.padEnd(NAME_COLUMN_WIDTH);
                const frameCount = e.maxFrameCount.toString().padStart(COUNT_COLUMN_WIDTH);
                const count = e.count.toString().padStart(CALLS_COLUMN_WIDTH);
                const total = (e.totalTime * 1000).toFixed(DECIMAL_PLACES).padStart(NUMERIC_COLUMN_WIDTH);
                const avg = (e.avgTime * 1000).toFixed(DECIMAL_PLACES).padStart(NUMERIC_COLUMN_WIDTH);
                const max = (e.maxTime * 1000).toFixed(DECIMAL_PLACES).padStart(NUMERIC_COLUMN_WIDTH);
                const avgPerFrame = (e.avgTimePerFrame * 1000).toFixed(DECIMAL_PLACES).padStart(NUMERIC_COLUMN_WIDTH);
                const maxPerFrame = (e.maxTimePerFrame * 1000).toFixed(DECIMAL_PLACES).padStart(NUMERIC_COLUMN_WIDTH);
                print(`${TAG}   ${name}${COLUMN_SEPARATOR}${frameCount}${COLUMN_SEPARATOR}${count}${COLUMN_SEPARATOR}${total}${COLUMN_SEPARATOR}${avg}${COLUMN_SEPARATOR}\
${max}${COLUMN_SEPARATOR}${avgPerFrame}${COLUMN_SEPARATOR}${maxPerFrame}`);
            });
        }
    }
}
//# sourceMappingURL=UpdateDispatcher.js.map