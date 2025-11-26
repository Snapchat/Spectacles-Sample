"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interactable = exports.TargetingVisual = exports.SyncInteractionType = void 0;
var __selfType = requireType("./Interactable");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const InteractionConfigurationProvider_1 = require("../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider");
const Event_1 = require("../../../Utils/Event");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const SceneObjectUtils_1 = require("../../../Utils/SceneObjectUtils");
const SyncKitBridge_1 = require("../../../Utils/SyncKitBridge");
const TAG = "Interactable";
/**
 * Relevant only to lenses that use SpectaclesSyncKit when it has SyncInteractionManager in its prefab.
 * Setting an Interactable's acceptableInputType to a non-All value results in the Interactable only being
 * able to be interacted with by a specific user.
 * Host means that only the host of the session can interact.
 * Local means only the user with the same connection ID as the
 * Interactable's localConnectionId can interact.
 * HostAndLocal means that the host or the local user can interact.
 */
var SyncInteractionType;
(function (SyncInteractionType) {
    SyncInteractionType[SyncInteractionType["None"] = 0] = "None";
    SyncInteractionType[SyncInteractionType["Host"] = 1] = "Host";
    SyncInteractionType[SyncInteractionType["Local"] = 2] = "Local";
    SyncInteractionType[SyncInteractionType["Other"] = 4] = "Other";
    SyncInteractionType[SyncInteractionType["HostAndLocal"] = 3] = "HostAndLocal";
    SyncInteractionType[SyncInteractionType["All"] = 7] = "All";
})(SyncInteractionType || (exports.SyncInteractionType = SyncInteractionType = {}));
/**
 * TargetingVisual is a bitflag that determines the targeting visual representation.
 */
var TargetingVisual;
(function (TargetingVisual) {
    TargetingVisual[TargetingVisual["None"] = 0] = "None";
    TargetingVisual[TargetingVisual["Cursor"] = 1] = "Cursor";
    TargetingVisual[TargetingVisual["Ray"] = 2] = "Ray";
})(TargetingVisual || (exports.TargetingVisual = TargetingVisual = {}));
/**
 * This class represents an interactable object that can respond to various interaction events such as hover, trigger,
 * and drag. It provides event handlers for these interactions and uses the InteractionConfigurationProvider for
 * configuration.
 */
let Interactable = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Interactable = _classThis = class extends _classSuper {
        constructor() {
            super();
            // Events
            this.onHoverEnterEvent = new Event_1.default();
            this.onHoverUpdateEvent = new Event_1.default();
            this.onHoverExitEvent = new Event_1.default();
            this.onInteractorHoverEnterEvent = new Event_1.default();
            this.onInteractorHoverExitEvent = new Event_1.default();
            this.onTriggerStartEvent = new Event_1.default();
            this.onTriggerUpdateEvent = new Event_1.default();
            this.onTriggerEndEvent = new Event_1.default();
            this.onTriggerEndOutsideEvent = new Event_1.default();
            this.onInteractorTriggerStartEvent = new Event_1.default();
            this.onInteractorTriggerEndEvent = new Event_1.default();
            this.onInteractorTriggerEndOutsideEvent = new Event_1.default();
            this.onDragStartEvent = new Event_1.default();
            this.onDragUpdateEvent = new Event_1.default();
            this.onDragEndEvent = new Event_1.default();
            this.onTriggerCanceledEvent = new Event_1.default();
            this.onSyncHoverEnterEvent = new Event_1.default();
            this.onSyncHoverUpdateEvent = new Event_1.default();
            this.onSyncHoverExitEvent = new Event_1.default();
            this.onSyncInteractorHoverEnterEvent = new Event_1.default();
            this.onSyncInteractorHoverExitEvent = new Event_1.default();
            this.onSyncTriggerStartEvent = new Event_1.default();
            this.onSyncTriggerUpdateEvent = new Event_1.default();
            this.onSyncTriggerEndEvent = new Event_1.default();
            this.onSyncTriggerEndOutsideEvent = new Event_1.default();
            this.onSyncInteractorTriggerStartEvent = new Event_1.default();
            this.onSyncInteractorTriggerEndEvent = new Event_1.default();
            this.onSyncInteractorTriggerEndOutsideEvent = new Event_1.default();
            this.onSyncTriggerCanceledEvent = new Event_1.default();
            this.onSyncDragStartEvent = new Event_1.default();
            this.onSyncDragUpdateEvent = new Event_1.default();
            this.onSyncDragEndEvent = new Event_1.default();
            this.interactionConfigurationProvider = InteractionConfigurationProvider_1.InteractionConfigurationProvider.getInstance();
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.syncKitBridge.createSyncEntity(this);
            // Native Logging
            this.log = new NativeLogger_1.default(TAG);
            /**
             * Called whenever the interactable enters the hovered state.
             */
            this.onHoverEnter = this.onHoverEnterEvent.publicApi();
            /**
             * Called whenever a new interactor hovers over this interactable.
             */
            this.onInteractorHoverEnter = this.onInteractorHoverEnterEvent.publicApi();
            /**
             * Called whenever an interactor remains hovering over this interactable.
             */
            this.onHoverUpdate = this.onHoverUpdateEvent.publicApi();
            /**
             *  Called whenever the interactable is no longer hovered.
             */
            this.onHoverExit = this.onHoverExitEvent.publicApi();
            /**
             * Called whenever an interactor exits hovering this interactable.
             */
            this.onInteractorHoverExit = this.onInteractorHoverExitEvent.publicApi();
            /**
             * Called whenever the interactable enters the triggered state.
             */
            this.onTriggerStart = this.onTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor triggers an interactable.
             */
            this.onInteractorTriggerStart = this.onInteractorTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor continues to trigger an interactable.
             */
            this.onTriggerUpdate = this.onTriggerUpdateEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is hovering it.
             */
            this.onTriggerEnd = this.onTriggerEndEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is not hovering it.
             */
            this.onTriggerEndOutside = this.onTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is hovering it.
             */
            this.onInteractorTriggerEnd = this.onInteractorTriggerEndEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is not hovering it.
             */
            this.onInteractorTriggerEndOutside = this.onInteractorTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is lost and was in a down event with this interactable.
             */
            this.onTriggerCanceled = this.onTriggerCanceledEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * has moved a minimum drag distance.
             */
            this.onDragStart = this.onDragStartEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * is moving.
             */
            this.onDragUpdate = this.onDragUpdateEvent.publicApi();
            /**
             * Called when an interactor was in a down event with this interactable and
             * was dragging.
             */
            this.onDragEnd = this.onDragEndEvent.publicApi();
            /**
             * The following onSync events are only invoked when in a Connected Lens with SpectaclesSyncKit present.
             * If another connected user invokes an onHoverEnter event, the local user will see an onSyncHoverEvent.
             * These events are useful for simple feedback scripts to allow other users to understand when an Interactable
             * is being interacted with another user already.
             */
            /**
             * Called whenever the interactable enters the hovered state from another connection.
             */
            this.onSyncHoverEnter = this.onSyncHoverEnterEvent.publicApi();
            /**
             * Called whenever a new interactor hovers over this interactable from another connection.
             */
            this.onSyncInteractorHoverEnter = this.onSyncInteractorHoverEnterEvent.publicApi();
            /**
             * Called whenever an interactor remains hovering over this interactable from another connection.
             */
            this.onSyncHoverUpdate = this.onSyncHoverUpdateEvent.publicApi();
            /**
             *  Called whenever the interactable is no longer hovered from another connection.
             */
            this.onSyncHoverExit = this.onSyncHoverExitEvent.publicApi();
            /**
             * Called whenever an interactor exits hovering this interactable from another connection.
             */
            this.onSyncInteractorHoverExit = this.onSyncInteractorHoverExitEvent.publicApi();
            /**
             * Called whenever the interactable enters the triggered state from another connection.
             */
            this.onSyncTriggerStart = this.onSyncTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor triggers an interactable from another connection.
             */
            this.onSyncInteractorTriggerStart = this.onSyncInteractorTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor continues to trigger an interactable from another connection.
             */
            this.onSyncTriggerUpdate = this.onSyncTriggerUpdateEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is hovering it from another connection.
             */
            this.onSyncTriggerEnd = this.onSyncTriggerEndEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is not hovering it from another connection.
             */
            this.onSyncTriggerEndOutside = this.onSyncTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is hovering it from another connection.
             */
            this.onSyncInteractorTriggerEnd = this.onSyncInteractorTriggerEndEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is not hovering it from another connection.
             */
            this.onSyncInteractorTriggerEndOutside = this.onSyncInteractorTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is lost and was in a down event with this interactable from another connection.
             */
            this.onSyncTriggerCanceled = this.onSyncTriggerCanceledEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * has moved a minimum drag distance from another connection.
             */
            this.onSyncDragStart = this.onSyncDragStartEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * is moving from another connection.
             */
            this.onSyncDragUpdate = this.onSyncDragUpdateEvent.publicApi();
            /**
             * Called when an interactor was in a down event with this interactable and
             * was dragging from another connection.
             */
            this.onSyncDragEnd = this.onSyncDragEndEvent.publicApi();
            // Interactor
            this._hoveringInteractor = Interactor_1.InteractorInputType.None;
            this._triggeringInteractor = Interactor_1.InteractorInputType.None;
            /**
             * Provides all colliders associated with this Interactable.
             */
            this.colliders = [];
            /**
             * Defines how an interactor can interact with this interactable.
             * Values are:
             * 1: Direct: Only allows close pinch interactions where a hand directly touches the Interactable.
             * 2: Indirect: Allows interactions from a distance with raycasting.
             * 3: Direct/Indirect: Supports both direct and indirect interaction methods.
             * 4: Poke: Enables finger poking interactions.
             * 7: All: Supports all targeting modes (Direct, Indirect, and Poke).
             */
            this.targetingMode = this.targetingMode;
            /**
             * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
             * - 0: Cursor (default)
             * - 1: Ray
             * - 2: None
             */
            this.targetingVisual = this.targetingVisual;
            /**
             * When enabled, this Interactable ignores any parent InteractionPlane and factors into the cursor's position and
             * targetingVisual. Use when the Interactable is parented for organization but not spatially within that plane.
             */
            this.ignoreInteractionPlane = this.ignoreInteractionPlane;
            /**
             * Defines the singular source of truth for feedback + UI + cursor components to poll to check
             * if the Interactable should exhibit sticky behavior during trigger
             * (cursor locks on Interactable, remains in active visual state even after de-hovering).
             */
            this.keepHoverOnTrigger = this.keepHoverOnTrigger;
            /**
             * Enable this to allow the Interactable to instantly be dragged on trigger rather than obeying the Interactor's
             * drag threshold.
             */
            this.enableInstantDrag = this.enableInstantDrag;
            /**
             * A flag that enables scroll interactions when this element is interacted with. When true, interactions with this
             * element can scroll a parent ScrollView that has content extending beyond its visible bounds.
             */
            this.isScrollable = this.isScrollable;
            /**
             * Determines whether this Interactable can be simultaneously controlled by multiple Interactors. When false, only
             * one Interactor type (e.g., left hand or right hand) can interact with this Interactable at a time, and subsequent
             * interaction attempts from different Interactors will be blocked. Set to true to enable interactions from multiple
             * sources simultaneously, such as allowing both hands to manipulate the Interactable at once.
             */
            this.allowMultipleInteractors = this.allowMultipleInteractors;
            /**
             * Enable Poke Directionality to help prevent accidental interactions when users approach from unwanted angles.
             */
            this.enablePokeDirectionality = this.enablePokeDirectionality;
            /**
             * Controls from which directions a poke interaction can trigger this Interactable along the X-axis:
             * - Left: Finger must approach from -X direction.
             * - Right: Finger must approach from +X direction.
             * - All: Accepts both directions.
             * - None: Disables X-axis poke detection.
             */
            this.acceptableXDirections = this.acceptableXDirections;
            /**
             * Controls from which directions a poke interaction can trigger this Interactable along the Y-axis:
             * - Top: Finger must approach from +Y direction
             * - Bottom: Finger must approach from -Y direction
             * - All: Accepts both directions
             * - None: Disables Y-axis poke detection
             */
            this.acceptableYDirections = this.acceptableYDirections;
            /**
             * Controls from which directions a poke interaction can trigger this Interactable along the Z-axis:
             * - Front: Finger must approach from +Z direction.
             * - Back: Finger must approach from -Z direction.
             * - All: Accepts both directions.
             * - None: Disables Z-axis poke detection.
             */
            this.acceptableZDirections = this.acceptableZDirections;
            /**
             * Determines if the Interactable should listen to filtered pinch events when targeted by a HandInteractor.
             * Filtered pinch events are more stable when the hand is quickly moving but may add latency in non-moving cases.
             * Most interactions should use raw pinch events by default.
             * Spatial interactions with large hand movement (such as dragging, scrolling) should use filtered pinch events.
             * If an Interactable has a parent Interactable that uses filtered pinch events,
             * the Interactable will also use filtered pinch events.
             */
            this.useFilteredPinch = this.useFilteredPinch;
            this._triggeringConnectionId = null;
            /**
             * Notifies the interactable that it is entering hover state
             * @param eventArgs - the interactor that is driving the event {@link Interactor}
             */
            this.hoverEnter = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onHoverEnterEvent : this.onSyncHoverEnterEvent;
                    event.invoke({ ...eventArgs, interactable: this });
                    this.log.v("InteractionEvent : " + "On Hover Enter Event");
                }
                this._hoveringInteractor |= eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorHoverEnterEvent : this.onSyncInteractorHoverEnterEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Hover Enter Event");
            };
            /**
             * Notifies the interactable that it is still hovering
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.hoverUpdate = (eventArgs) => {
                if (this._hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    return;
                }
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                const event = isLocalEvent ? this.onHoverUpdateEvent : this.onSyncHoverUpdateEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
            };
            /**
             * Notifies the interactable that it is exiting hover state
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.hoverExit = (eventArgs) => {
                this._hoveringInteractor &= ~eventArgs.interactor.inputType;
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                const event = isLocalEvent ? this.onInteractorHoverExitEvent : this.onSyncInteractorHoverExitEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Hover Exit Event");
                if (this._hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onHoverExitEvent : this.onSyncHoverExitEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Hover Exit Event");
                }
            };
            /**
             * Notifies the interactable that it is entering trigger state
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerStart = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === null) {
                    this._triggeringConnectionId = eventArgs.connectionId ?? null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                if (this._triggeringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onTriggerStartEvent : this.onSyncTriggerStartEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Trigger Start Event");
                }
                this._triggeringInteractor |= eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorTriggerStartEvent : this.onSyncInteractorTriggerStartEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Trigger Start Event");
            };
            /**
             * Notifies the interactable that it is still in a triggering state
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerUpdate = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                const event = isLocalEvent ? this.onTriggerUpdateEvent : this.onSyncTriggerUpdateEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.dragStartOrUpdate(eventArgs);
            };
            /**
             * Notifies the interactable that it is exiting trigger state  while the interactor is hovering it
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerEnd = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === eventArgs.connectionId) {
                    this._triggeringConnectionId = null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                this._triggeringInteractor &= ~eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorTriggerEndEvent : this.onSyncInteractorTriggerEndEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Trigger End Event");
                if (this._triggeringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onTriggerEndEvent : this.onSyncTriggerEndEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Trigger End Event");
                }
                this.dragEnd(eventArgs);
            };
            /**
             * Notifies the interactable that it is exiting trigger state while the interactor is not hovering it.
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerEndOutside = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === eventArgs.connectionId) {
                    this._triggeringConnectionId = null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                this._triggeringInteractor &= ~eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorTriggerEndOutsideEvent : this.onSyncInteractorTriggerEndOutsideEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Trigger End Outside Event");
                if (this._triggeringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onTriggerEndOutsideEvent : this.onSyncTriggerEndOutsideEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Trigger End Outside Event");
                }
                this.dragEnd(eventArgs);
            };
            /**
             * Notifies the interactable that it is a cancelled state with the interactor
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerCanceled = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === eventArgs.connectionId) {
                    this._triggeringConnectionId = null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                this._triggeringInteractor &= ~eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onTriggerCanceledEvent : this.onSyncTriggerCanceledEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Trigger Canceled Event");
                this.dragEnd(eventArgs);
            };
        }
        __initialize() {
            super.__initialize();
            // Events
            this.onHoverEnterEvent = new Event_1.default();
            this.onHoverUpdateEvent = new Event_1.default();
            this.onHoverExitEvent = new Event_1.default();
            this.onInteractorHoverEnterEvent = new Event_1.default();
            this.onInteractorHoverExitEvent = new Event_1.default();
            this.onTriggerStartEvent = new Event_1.default();
            this.onTriggerUpdateEvent = new Event_1.default();
            this.onTriggerEndEvent = new Event_1.default();
            this.onTriggerEndOutsideEvent = new Event_1.default();
            this.onInteractorTriggerStartEvent = new Event_1.default();
            this.onInteractorTriggerEndEvent = new Event_1.default();
            this.onInteractorTriggerEndOutsideEvent = new Event_1.default();
            this.onDragStartEvent = new Event_1.default();
            this.onDragUpdateEvent = new Event_1.default();
            this.onDragEndEvent = new Event_1.default();
            this.onTriggerCanceledEvent = new Event_1.default();
            this.onSyncHoverEnterEvent = new Event_1.default();
            this.onSyncHoverUpdateEvent = new Event_1.default();
            this.onSyncHoverExitEvent = new Event_1.default();
            this.onSyncInteractorHoverEnterEvent = new Event_1.default();
            this.onSyncInteractorHoverExitEvent = new Event_1.default();
            this.onSyncTriggerStartEvent = new Event_1.default();
            this.onSyncTriggerUpdateEvent = new Event_1.default();
            this.onSyncTriggerEndEvent = new Event_1.default();
            this.onSyncTriggerEndOutsideEvent = new Event_1.default();
            this.onSyncInteractorTriggerStartEvent = new Event_1.default();
            this.onSyncInteractorTriggerEndEvent = new Event_1.default();
            this.onSyncInteractorTriggerEndOutsideEvent = new Event_1.default();
            this.onSyncTriggerCanceledEvent = new Event_1.default();
            this.onSyncDragStartEvent = new Event_1.default();
            this.onSyncDragUpdateEvent = new Event_1.default();
            this.onSyncDragEndEvent = new Event_1.default();
            this.interactionConfigurationProvider = InteractionConfigurationProvider_1.InteractionConfigurationProvider.getInstance();
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.syncEntity = this.syncKitBridge.createSyncEntity(this);
            // Native Logging
            this.log = new NativeLogger_1.default(TAG);
            /**
             * Called whenever the interactable enters the hovered state.
             */
            this.onHoverEnter = this.onHoverEnterEvent.publicApi();
            /**
             * Called whenever a new interactor hovers over this interactable.
             */
            this.onInteractorHoverEnter = this.onInteractorHoverEnterEvent.publicApi();
            /**
             * Called whenever an interactor remains hovering over this interactable.
             */
            this.onHoverUpdate = this.onHoverUpdateEvent.publicApi();
            /**
             *  Called whenever the interactable is no longer hovered.
             */
            this.onHoverExit = this.onHoverExitEvent.publicApi();
            /**
             * Called whenever an interactor exits hovering this interactable.
             */
            this.onInteractorHoverExit = this.onInteractorHoverExitEvent.publicApi();
            /**
             * Called whenever the interactable enters the triggered state.
             */
            this.onTriggerStart = this.onTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor triggers an interactable.
             */
            this.onInteractorTriggerStart = this.onInteractorTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor continues to trigger an interactable.
             */
            this.onTriggerUpdate = this.onTriggerUpdateEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is hovering it.
             */
            this.onTriggerEnd = this.onTriggerEndEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is not hovering it.
             */
            this.onTriggerEndOutside = this.onTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is hovering it.
             */
            this.onInteractorTriggerEnd = this.onInteractorTriggerEndEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is not hovering it.
             */
            this.onInteractorTriggerEndOutside = this.onInteractorTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is lost and was in a down event with this interactable.
             */
            this.onTriggerCanceled = this.onTriggerCanceledEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * has moved a minimum drag distance.
             */
            this.onDragStart = this.onDragStartEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * is moving.
             */
            this.onDragUpdate = this.onDragUpdateEvent.publicApi();
            /**
             * Called when an interactor was in a down event with this interactable and
             * was dragging.
             */
            this.onDragEnd = this.onDragEndEvent.publicApi();
            /**
             * The following onSync events are only invoked when in a Connected Lens with SpectaclesSyncKit present.
             * If another connected user invokes an onHoverEnter event, the local user will see an onSyncHoverEvent.
             * These events are useful for simple feedback scripts to allow other users to understand when an Interactable
             * is being interacted with another user already.
             */
            /**
             * Called whenever the interactable enters the hovered state from another connection.
             */
            this.onSyncHoverEnter = this.onSyncHoverEnterEvent.publicApi();
            /**
             * Called whenever a new interactor hovers over this interactable from another connection.
             */
            this.onSyncInteractorHoverEnter = this.onSyncInteractorHoverEnterEvent.publicApi();
            /**
             * Called whenever an interactor remains hovering over this interactable from another connection.
             */
            this.onSyncHoverUpdate = this.onSyncHoverUpdateEvent.publicApi();
            /**
             *  Called whenever the interactable is no longer hovered from another connection.
             */
            this.onSyncHoverExit = this.onSyncHoverExitEvent.publicApi();
            /**
             * Called whenever an interactor exits hovering this interactable from another connection.
             */
            this.onSyncInteractorHoverExit = this.onSyncInteractorHoverExitEvent.publicApi();
            /**
             * Called whenever the interactable enters the triggered state from another connection.
             */
            this.onSyncTriggerStart = this.onSyncTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor triggers an interactable from another connection.
             */
            this.onSyncInteractorTriggerStart = this.onSyncInteractorTriggerStartEvent.publicApi();
            /**
             * Called whenever an interactor continues to trigger an interactable from another connection.
             */
            this.onSyncTriggerUpdate = this.onSyncTriggerUpdateEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is hovering it from another connection.
             */
            this.onSyncTriggerEnd = this.onSyncTriggerEndEvent.publicApi();
            /**
             * Called whenever the interactable exits the triggered state while the interactor is not hovering it from another connection.
             */
            this.onSyncTriggerEndOutside = this.onSyncTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is hovering it from another connection.
             */
            this.onSyncInteractorTriggerEnd = this.onSyncInteractorTriggerEndEvent.publicApi();
            /**
             * Called whenever an interactor is no longer triggering the interactable while the interactor is not hovering it from another connection.
             */
            this.onSyncInteractorTriggerEndOutside = this.onSyncInteractorTriggerEndOutsideEvent.publicApi();
            /**
             * Called whenever an interactor is lost and was in a down event with this interactable from another connection.
             */
            this.onSyncTriggerCanceled = this.onSyncTriggerCanceledEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * has moved a minimum drag distance from another connection.
             */
            this.onSyncDragStart = this.onSyncDragStartEvent.publicApi();
            /**
             * Called when an interactor is in a down event with this interactable and
             * is moving from another connection.
             */
            this.onSyncDragUpdate = this.onSyncDragUpdateEvent.publicApi();
            /**
             * Called when an interactor was in a down event with this interactable and
             * was dragging from another connection.
             */
            this.onSyncDragEnd = this.onSyncDragEndEvent.publicApi();
            // Interactor
            this._hoveringInteractor = Interactor_1.InteractorInputType.None;
            this._triggeringInteractor = Interactor_1.InteractorInputType.None;
            /**
             * Provides all colliders associated with this Interactable.
             */
            this.colliders = [];
            /**
             * Defines how an interactor can interact with this interactable.
             * Values are:
             * 1: Direct: Only allows close pinch interactions where a hand directly touches the Interactable.
             * 2: Indirect: Allows interactions from a distance with raycasting.
             * 3: Direct/Indirect: Supports both direct and indirect interaction methods.
             * 4: Poke: Enables finger poking interactions.
             * 7: All: Supports all targeting modes (Direct, Indirect, and Poke).
             */
            this.targetingMode = this.targetingMode;
            /**
             * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
             * - 0: Cursor (default)
             * - 1: Ray
             * - 2: None
             */
            this.targetingVisual = this.targetingVisual;
            /**
             * When enabled, this Interactable ignores any parent InteractionPlane and factors into the cursor's position and
             * targetingVisual. Use when the Interactable is parented for organization but not spatially within that plane.
             */
            this.ignoreInteractionPlane = this.ignoreInteractionPlane;
            /**
             * Defines the singular source of truth for feedback + UI + cursor components to poll to check
             * if the Interactable should exhibit sticky behavior during trigger
             * (cursor locks on Interactable, remains in active visual state even after de-hovering).
             */
            this.keepHoverOnTrigger = this.keepHoverOnTrigger;
            /**
             * Enable this to allow the Interactable to instantly be dragged on trigger rather than obeying the Interactor's
             * drag threshold.
             */
            this.enableInstantDrag = this.enableInstantDrag;
            /**
             * A flag that enables scroll interactions when this element is interacted with. When true, interactions with this
             * element can scroll a parent ScrollView that has content extending beyond its visible bounds.
             */
            this.isScrollable = this.isScrollable;
            /**
             * Determines whether this Interactable can be simultaneously controlled by multiple Interactors. When false, only
             * one Interactor type (e.g., left hand or right hand) can interact with this Interactable at a time, and subsequent
             * interaction attempts from different Interactors will be blocked. Set to true to enable interactions from multiple
             * sources simultaneously, such as allowing both hands to manipulate the Interactable at once.
             */
            this.allowMultipleInteractors = this.allowMultipleInteractors;
            /**
             * Enable Poke Directionality to help prevent accidental interactions when users approach from unwanted angles.
             */
            this.enablePokeDirectionality = this.enablePokeDirectionality;
            /**
             * Controls from which directions a poke interaction can trigger this Interactable along the X-axis:
             * - Left: Finger must approach from -X direction.
             * - Right: Finger must approach from +X direction.
             * - All: Accepts both directions.
             * - None: Disables X-axis poke detection.
             */
            this.acceptableXDirections = this.acceptableXDirections;
            /**
             * Controls from which directions a poke interaction can trigger this Interactable along the Y-axis:
             * - Top: Finger must approach from +Y direction
             * - Bottom: Finger must approach from -Y direction
             * - All: Accepts both directions
             * - None: Disables Y-axis poke detection
             */
            this.acceptableYDirections = this.acceptableYDirections;
            /**
             * Controls from which directions a poke interaction can trigger this Interactable along the Z-axis:
             * - Front: Finger must approach from +Z direction.
             * - Back: Finger must approach from -Z direction.
             * - All: Accepts both directions.
             * - None: Disables Z-axis poke detection.
             */
            this.acceptableZDirections = this.acceptableZDirections;
            /**
             * Determines if the Interactable should listen to filtered pinch events when targeted by a HandInteractor.
             * Filtered pinch events are more stable when the hand is quickly moving but may add latency in non-moving cases.
             * Most interactions should use raw pinch events by default.
             * Spatial interactions with large hand movement (such as dragging, scrolling) should use filtered pinch events.
             * If an Interactable has a parent Interactable that uses filtered pinch events,
             * the Interactable will also use filtered pinch events.
             */
            this.useFilteredPinch = this.useFilteredPinch;
            this._triggeringConnectionId = null;
            /**
             * Notifies the interactable that it is entering hover state
             * @param eventArgs - the interactor that is driving the event {@link Interactor}
             */
            this.hoverEnter = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onHoverEnterEvent : this.onSyncHoverEnterEvent;
                    event.invoke({ ...eventArgs, interactable: this });
                    this.log.v("InteractionEvent : " + "On Hover Enter Event");
                }
                this._hoveringInteractor |= eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorHoverEnterEvent : this.onSyncInteractorHoverEnterEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Hover Enter Event");
            };
            /**
             * Notifies the interactable that it is still hovering
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.hoverUpdate = (eventArgs) => {
                if (this._hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    return;
                }
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                const event = isLocalEvent ? this.onHoverUpdateEvent : this.onSyncHoverUpdateEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
            };
            /**
             * Notifies the interactable that it is exiting hover state
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.hoverExit = (eventArgs) => {
                this._hoveringInteractor &= ~eventArgs.interactor.inputType;
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                const event = isLocalEvent ? this.onInteractorHoverExitEvent : this.onSyncInteractorHoverExitEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Hover Exit Event");
                if (this._hoveringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onHoverExitEvent : this.onSyncHoverExitEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Hover Exit Event");
                }
            };
            /**
             * Notifies the interactable that it is entering trigger state
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerStart = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === null) {
                    this._triggeringConnectionId = eventArgs.connectionId ?? null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                if (this._triggeringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onTriggerStartEvent : this.onSyncTriggerStartEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Trigger Start Event");
                }
                this._triggeringInteractor |= eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorTriggerStartEvent : this.onSyncInteractorTriggerStartEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Trigger Start Event");
            };
            /**
             * Notifies the interactable that it is still in a triggering state
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerUpdate = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                const event = isLocalEvent ? this.onTriggerUpdateEvent : this.onSyncTriggerUpdateEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.dragStartOrUpdate(eventArgs);
            };
            /**
             * Notifies the interactable that it is exiting trigger state  while the interactor is hovering it
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerEnd = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === eventArgs.connectionId) {
                    this._triggeringConnectionId = null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                this._triggeringInteractor &= ~eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorTriggerEndEvent : this.onSyncInteractorTriggerEndEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Trigger End Event");
                if (this._triggeringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onTriggerEndEvent : this.onSyncTriggerEndEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Trigger End Event");
                }
                this.dragEnd(eventArgs);
            };
            /**
             * Notifies the interactable that it is exiting trigger state while the interactor is not hovering it.
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerEndOutside = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === eventArgs.connectionId) {
                    this._triggeringConnectionId = null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                this._triggeringInteractor &= ~eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onInteractorTriggerEndOutsideEvent : this.onSyncInteractorTriggerEndOutsideEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Interactor Trigger End Outside Event");
                if (this._triggeringInteractor === Interactor_1.InteractorInputType.None) {
                    const event = isLocalEvent ? this.onTriggerEndOutsideEvent : this.onSyncTriggerEndOutsideEvent;
                    event.invoke({
                        ...eventArgs,
                        interactable: this
                    });
                    this.log.v("InteractionEvent : " + "On Trigger End Outside Event");
                }
                this.dragEnd(eventArgs);
            };
            /**
             * Notifies the interactable that it is a cancelled state with the interactor
             * @param eventArgs - event parameters, with omitted interactable
             */
            this.triggerCanceled = (eventArgs) => {
                const isLocalEvent = this.checkLocalEvent(eventArgs);
                if (this._triggeringConnectionId === eventArgs.connectionId) {
                    this._triggeringConnectionId = null;
                }
                else if (this._triggeringConnectionId !== eventArgs.connectionId) {
                    return;
                }
                this._triggeringInteractor &= ~eventArgs.interactor.inputType;
                const event = isLocalEvent ? this.onTriggerCanceledEvent : this.onSyncTriggerCanceledEvent;
                event.invoke({
                    ...eventArgs,
                    interactable: this
                });
                this.log.v("InteractionEvent : " + "On Trigger Canceled Event");
                this.dragEnd(eventArgs);
            };
        }
        onAwake() {
            this.createEvent("OnDestroyEvent").bind(() => this.release());
            this.createEvent("OnEnableEvent").bind(() => {
                this.enableColliders(true);
            });
            this.createEvent("OnDisableEvent").bind(() => {
                this.enableColliders(false);
            });
            InteractionManager_1.InteractionManager.getInstance().registerInteractable(this);
        }
        release() {
            InteractionManager_1.InteractionManager.getInstance().deregisterInteractable(this);
        }
        /**
         * Returns the connection ID of the first triggering Interactor if in a Connected Lens.
         */
        get triggeringConnectionId() {
            return this._triggeringConnectionId;
        }
        /**
         * Interactors that are hovering this interactable
         */
        get hoveringInteractor() {
            return this._hoveringInteractor;
        }
        /**
         * Interactors that are triggering this interactable
         */
        get triggeringInteractor() {
            return this._triggeringInteractor;
        }
        /**
         * Notifies the interactable that it is in a dragged state with the interactor
         * @param eventArgs - event parameters, with omitted interactable
         */
        dragStartOrUpdate(eventArgs) {
            const currentDragVector = eventArgs.interactor.currentDragVector;
            if (currentDragVector === null) {
                return;
            }
            const previousDragVector = eventArgs.interactor.previousDragVector;
            const dragInteractorEvent = {
                ...eventArgs,
                interactable: this,
                dragVector: currentDragVector,
                planecastDragVector: eventArgs.interactor.planecastDragVector
            };
            const isLocalEvent = this.checkLocalEvent(eventArgs);
            if (previousDragVector === null) {
                const event = isLocalEvent ? this.onDragStartEvent : this.onSyncDragStartEvent;
                event.invoke(dragInteractorEvent);
                this.log.v("InteractionEvent : " + "On Drag Start Event");
            }
            else {
                const event = isLocalEvent ? this.onDragUpdateEvent : this.onSyncDragUpdateEvent;
                event.invoke(dragInteractorEvent);
            }
        }
        /**
         * Notifies the interactable that it is exiting a dragged state with the interactor
         * @param eventArgs - event parameters, with omitted interactable
         */
        dragEnd(eventArgs) {
            const previousDragVector = eventArgs.interactor.previousDragVector;
            if (previousDragVector === null) {
                return;
            }
            const isLocalEvent = this.checkLocalEvent(eventArgs);
            const event = isLocalEvent ? this.onDragEndEvent : this.onSyncDragEndEvent;
            event.invoke({
                ...eventArgs,
                interactable: this,
                dragVector: previousDragVector,
                planecastDragVector: eventArgs.interactor.planecastDragVector
            });
            this.log.v("InteractionEvent : " + "On Drag End Event");
        }
        /**
         * @returns if this Interactable is a descendant of the given Interactable.
         */
        isDescendantOf(interactable) {
            return (0, SceneObjectUtils_1.isDescendantOf)(this.sceneObject, interactable.sceneObject);
        }
        enableColliders(enable) {
            for (let i = 0; i < this.colliders.length; i++) {
                this.colliders[i].enabled = enable;
            }
        }
        checkLocalEvent(event) {
            const isLocalEvent = !event.connectionId || this.syncKitBridge.sessionController.getLocalConnectionId() === event.connectionId;
            return isLocalEvent;
        }
    };
    __setFunctionName(_classThis, "Interactable");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Interactable = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Interactable = _classThis;
})();
exports.Interactable = Interactable;
//# sourceMappingURL=Interactable.js.map