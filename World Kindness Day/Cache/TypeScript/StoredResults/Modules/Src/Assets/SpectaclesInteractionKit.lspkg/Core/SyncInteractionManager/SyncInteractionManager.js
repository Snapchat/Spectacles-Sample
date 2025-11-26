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
exports.SyncInteractionManager = void 0;
exports.serializeInputState = serializeInputState;
exports.parseInputState = parseInputState;
var __selfType = requireType("./SyncInteractionManager");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const InteractorCursor_1 = require("../../Components/Interaction/InteractorCursor/InteractorCursor");
const CursorControllerProvider_1 = require("../../Providers/CursorControllerProvider/CursorControllerProvider");
const SyncKitBridge_1 = require("../../Utils/SyncKitBridge");
const InteractionManager_1 = require("../InteractionManager/InteractionManager");
const Interactor_1 = require("../Interactor/Interactor");
const SyncInteractor_1 = require("../SyncInteractor/SyncInteractor");
// The key for storing interactor events in the realtime datastore.
const SYNC_INTERACTOR_EVENT_KEY = "_SyncInteractorEvent";
const SYNC_LEFT_HAND_INTERACTOR_INDEX = 0;
const SYNC_RIGHT_HAND_INTERACTOR_INDEX = 1;
const SYNC_MOBILE_INTERACTOR_INDEX = 2;
const SYNC_MOUSE_INTERACTOR_INDEX = 3;
const INDEX_BY_INTERACTOR_INPUT_TYPE = new Map([
    [Interactor_1.InteractorInputType.LeftHand, SYNC_LEFT_HAND_INTERACTOR_INDEX],
    [Interactor_1.InteractorInputType.RightHand, SYNC_RIGHT_HAND_INTERACTOR_INDEX],
    [Interactor_1.InteractorInputType.Mobile, SYNC_MOBILE_INTERACTOR_INDEX],
    [Interactor_1.InteractorInputType.Mouse, SYNC_MOUSE_INTERACTOR_INDEX]
]);
const SIK_SYNC_KIT_BRIDGE = SyncKitBridge_1.SyncKitBridge.getInstance();
const SIK_INTERACTION_MANAGER = InteractionManager_1.InteractionManager.getInstance();
/**
 * SyncInteractionManager propagates interaction events to and from different connections within the same
 * Connected Lens session. In order to use the SyncInteractionManager, SpectaclesSyncKit must also be present
 * in the Scene Hierarchy. Enabling this component with SpectaclesSyncKit set up will allow devs to subscribe to
 * onSyncHover / onSyncTrigger / onSyncDrag events of Interactables.
 */
let SyncInteractionManager = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SyncInteractionManager = _classThis = class extends _classSuper {
        __initialize() {
            super.__initialize();
            /**
             * If enabled, the SyncInteractionManager will instantiate InteractorCursors for each connection in the session,
             * allowing users to understand where other users are targeting.
             */
            this.enableSyncCursors = this.enableSyncCursors;
            this.persistence = RealtimeStoreCreateOptions.Persistence.Session;
            this.cursorController = CursorControllerProvider_1.CursorControllerProvider.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.customNetworkId = "SyncInteractionManager";
            this.syncInteractorsByConnectionId = new Map();
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
        }
        constructor() {
            super();
            /**
             * If enabled, the SyncInteractionManager will instantiate InteractorCursors for each connection in the session,
             * allowing users to understand where other users are targeting.
             */
            this.enableSyncCursors = this.enableSyncCursors;
            this.persistence = RealtimeStoreCreateOptions.Persistence.Session;
            this.cursorController = CursorControllerProvider_1.CursorControllerProvider.getInstance();
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
            this.customNetworkId = "SyncInteractionManager";
            this.syncInteractorsByConnectionId = new Map();
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
        }
        onStart() {
            this.sessionController = this.syncKitBridge.sessionController;
            if (this.sessionController === undefined) {
                throw new Error("SpectaclesSyncKit's SessionController cannot be found. Cannot use SyncInteractionManager to sync interaction events across connections. " +
                    "Please check that SpectaclesSyncKit has properly been set up if this lens is a Connected Lens. " +
                    "If this lens is not meant to be a Connected Lens, please disable the SyncInteractionManager SceneObject.");
            }
            this.syncEntity = new this.syncKitBridge.SyncEntity(this, undefined, false, this.persistence, new this.syncKitBridge.networkIdTools.NetworkIdOptions(this.syncKitBridge.networkIdTools.NetworkIdType.Custom, this.customNetworkId));
            this.sessionController.onUserJoinedSession.add((session, userInfo) => {
                // If we have somehow already created Interactors for this connectionId, ignore this signal.
                if (this.syncInteractorsByConnectionId.get(userInfo.connectionId) !== undefined) {
                    return;
                }
                const syncInteractors = [];
                for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
                    const interactor = this.sceneObject.createComponent(SyncInteractor_1.SyncInteractor.getTypeName());
                    syncInteractors.push(interactor);
                    if (this.enableSyncCursors) {
                        const cursor = this.sceneObject.createComponent(InteractorCursor_1.InteractorCursor.getTypeName());
                        cursor.interactor = interactor;
                        this.cursorController.registerCursor(cursor, interactor);
                    }
                }
                this.syncInteractorsByConnectionId.set(userInfo.connectionId, syncInteractors);
            });
            this.sessionController.onUserLeftSession.add((session, userInfo) => {
                const syncInteractors = this.syncInteractorsByConnectionId.get(userInfo.connectionId);
                if (syncInteractors !== undefined) {
                    for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
                        const cursor = this.cursorController.getCursorByInteractor(syncInteractors[i]);
                        if (cursor !== null) {
                            cursor.destroy();
                        }
                        syncInteractors[i].destroy();
                    }
                    this.syncInteractorsByConnectionId.delete(userInfo.connectionId);
                }
            });
            this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this));
        }
        setupConnectionCallbacks() {
            this.createEvent("UpdateEvent").bind(this.update.bind(this));
            this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this));
        }
        // Whenever the local InteractionManager dispatches an event, propagate that event to the realtime datastore.
        update() {
            this.disableSyncCursors();
            const dispatchEventsArgs = this.interactionManager.dispatchEventArgs;
            const dispatchEventStrings = [];
            for (const pendingEvent of dispatchEventsArgs) {
                dispatchEventStrings.push(JSON.stringify(this.serializeEventDispatch(pendingEvent)));
            }
            // Store this frame's events into a string array using the connectionId as key.
            this.syncEntity.currentStore.putStringArray(`${this.sessionController.getLocalConnectionId()}${SYNC_INTERACTOR_EVENT_KEY}`, dispatchEventStrings);
        }
        // Whenever another connection's InteractionManager dispatches an event, process the event strings from the realtime datastore.
        processStoreUpdate(session, store, key, info) {
            const connectionId = info.updaterInfo.connectionId;
            const updatedByLocal = connectionId === this.sessionController.getLocalConnectionId();
            if (key.endsWith(SYNC_INTERACTOR_EVENT_KEY) && !updatedByLocal) {
                // If the event comes from a new connection, create SyncInteractors for that connection.
                const isNewConnection = !this.syncInteractorsByConnectionId.has(connectionId);
                if (isNewConnection) {
                    const syncInteractors = [];
                    for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
                        const interactor = this.sceneObject.createComponent(SyncInteractor_1.SyncInteractor.getTypeName());
                        syncInteractors.push(interactor);
                        if (this.enableSyncCursors) {
                            const cursor = this.sceneObject.createComponent(InteractorCursor_1.InteractorCursor.getTypeName());
                            cursor.interactor = interactor;
                            this.cursorController.registerCursor(cursor, interactor);
                        }
                    }
                    this.syncInteractorsByConnectionId.set(connectionId, syncInteractors);
                }
                // Retrieve the batched array of stringified events during another user's frame.
                const eventStringArray = store.getStringArray(key);
                // Parse the stringified events into SyncInteractorEvents and dispatch them to the local InteractionManager.
                const parsedEvents = this.parseEventDispatch(eventStringArray);
                this.dispatchSyncInteractorEvents(parsedEvents);
            }
        }
        dispatchSyncInteractorEvents(events) {
            const activeInteractors = [];
            // For each event propagated from a different connection, dispatch an event to the local InteractionManager.
            for (const event of events) {
                let syncInteractors = this.syncInteractorsByConnectionId.get(event.connectionId);
                const inputType = event.syncInteractorState.inputType;
                const index = INDEX_BY_INTERACTOR_INPUT_TYPE.get(inputType);
                // If we are receiving events before receiving onUserJoinedSession somehow, ensure that the Interactors are created.
                if (syncInteractors === undefined) {
                    syncInteractors = [];
                    for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
                        const interactor = this.sceneObject.createComponent(SyncInteractor_1.SyncInteractor.getTypeName());
                        syncInteractors.push(interactor);
                        const cursor = this.sceneObject.createComponent(InteractorCursor_1.InteractorCursor.getTypeName());
                        cursor.interactor = interactor;
                        this.cursorController.registerCursor(cursor, interactor);
                    }
                    this.syncInteractorsByConnectionId.set(event.connectionId, syncInteractors);
                }
                if (index === undefined) {
                    throw new Error("Unrecognized inputType detected from synced event.");
                }
                const syncInteractor = syncInteractors[index];
                const cursor = this.cursorController.getCursorByInteractor(syncInteractor);
                if (cursor !== null) {
                    cursor.enabled = true;
                }
                const interactable = this.findInteractableById(event.targetId);
                // If the Interactable from a propagated event does not exist in the local instance, ignore the event.
                if (interactable !== null) {
                    activeInteractors.push(syncInteractor);
                    const dispatchableEventArgs = {
                        interactor: syncInteractor,
                        target: interactable,
                        eventName: event.eventName,
                        connectionId: event.connectionId
                    };
                    // Set the state of the SyncInteractor so that any callbacks that reference the event Interactor will still function.
                    syncInteractor.interactorState = event.syncInteractorState;
                    this.interactionManager.dispatchEvent(dispatchableEventArgs);
                }
            }
            for (const syncInteractors of this.syncInteractorsByConnectionId.values()) {
                for (const syncInteractor of syncInteractors) {
                    if (!activeInteractors.includes(syncInteractor)) {
                        syncInteractor.resetState();
                    }
                }
            }
        }
        serializeEventDispatch(event) {
            if (event.connectionId === null || event.connectionId === undefined) {
                throw new Error("Missing connection ID detected in an event before propagation. Please check that SyncKit has been set up properly in the scene.");
            }
            return {
                interactor: serializeInteractor(event.interactor),
                target: serializeInteractable(event.target),
                eventName: event.eventName,
                origin: serializeInteractable(event.origin ?? null),
                connectionId: event.connectionId
            };
        }
        parseEventDispatch(eventStringArray) {
            const events = [];
            // Parse each individual string into a SyncInteractorEvent.
            for (const eventString of eventStringArray) {
                const parsedJson = JSON.parse(eventString);
                const connectionId = parsedJson.connectionId;
                const eventName = parsedJson.eventName;
                const targetId = parsedJson.target.id;
                const interactorState = parseInteractor(parsedJson.interactor);
                const event = {
                    connectionId: connectionId,
                    eventName: eventName,
                    targetId: targetId,
                    syncInteractorState: interactorState
                };
                events.push(event);
            }
            return events;
        }
        // [SyncInteractable] This function works under the assumption that all Interactables are instantiated in every connection.
        // Further refinement to linking Interactables across connections w/o developer friction will happen on future iterations.
        findInteractableById(id) {
            const interactable = this.interactionManager.getInteractableByInteractableId(id);
            return interactable;
        }
        disableSyncCursors() {
            const syncInteractorsArray = this.syncInteractorsByConnectionId.values();
            for (const syncInteractors of syncInteractorsArray) {
                for (const syncInteractor of syncInteractors) {
                    if (syncInteractor.currentInteractable === null) {
                        const cursor = this.cursorController.getCursorByInteractor(syncInteractor);
                        if (cursor !== null) {
                            cursor.enabled = false;
                        }
                    }
                }
            }
        }
    };
    __setFunctionName(_classThis, "SyncInteractionManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SyncInteractionManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SyncInteractionManager = _classThis;
})();
exports.SyncInteractionManager = SyncInteractionManager;
function serializeVec3(vec, isWorld = true) {
    if (vec === null) {
        return null;
    }
    if (isWorld) {
        vec = SIK_SYNC_KIT_BRIDGE.worldVec3ToLocationVec3(vec);
    }
    return {
        x: vec.x,
        y: vec.y,
        z: vec.z
    };
}
function parseVec3(object, isWorld = true) {
    if (object === null) {
        return null;
    }
    let vec = new vec3(object.x, object.y, object.z);
    if (isWorld) {
        vec = SIK_SYNC_KIT_BRIDGE.locationVec3ToWorldVec3(vec);
    }
    return vec;
}
function serializeQuat(quat, isWorld = true) {
    if (quat === null) {
        return null;
    }
    if (isWorld) {
        quat = SIK_SYNC_KIT_BRIDGE.worldQuatToLocationQuat(quat);
    }
    return {
        w: quat.w,
        x: quat.x,
        y: quat.y,
        z: quat.z
    };
}
function parseQuat(object, isWorld = true) {
    if (object === null) {
        return null;
    }
    let quaternion = new quat(object.w, object.x, object.y, object.z);
    if (isWorld) {
        quaternion = SIK_SYNC_KIT_BRIDGE.locationQuatToWorldQuat(quaternion);
    }
    return quaternion;
}
// [SyncInteractable] This function works under the assumption that all Interactables are instantiated in every connection.
// Further refinement to linking Interactables across connections w/o developer friction will happen on future iterations.
function serializeInteractable(interactable) {
    if (interactable === null) {
        return null;
    }
    const id = SIK_INTERACTION_MANAGER.getInteractableIdByInteractable(interactable);
    if (id === null) {
        throw new Error(`Missing networkID on Interactable of SceneObject: ${interactable.sceneObject.name}`);
    }
    return {
        id: id
    };
}
function parseInteractable(object) {
    if (object === null) {
        return null;
    }
    return SIK_INTERACTION_MANAGER.getInteractableByInteractableId(object.id);
}
// Collider and TriangleHit are much harder to mock, so the raycast hit will only include simpler types.
function serializeRaycastHit(hit) {
    if (hit === null) {
        return null;
    }
    return {
        position: serializeVec3(hit.position),
        distance: hit.distance,
        normal: serializeVec3(hit.normal),
        skipRemaining: hit.skipRemaining,
        t: hit.t
    };
}
function serializeInputState(state) {
    return {
        isHovered: state.isHovered,
        rawHovered: state.rawHovered,
        isPinching: state.isPinching,
        position: serializeVec3(state.position, false),
        innerInteractableActive: state.innerInteractableActive
    };
}
function parseInputState(object) {
    return {
        isHovered: object.isHovered,
        rawHovered: object.rawHovered,
        isPinching: object.isPinching,
        position: parseVec3(object.position, false),
        innerInteractableActive: object.innerInteractableActive
    };
}
function parseRaycastHit(object) {
    if (object === null) {
        return null;
    }
    return {
        position: parseVec3(object.position),
        distance: object.distance,
        collider: null,
        normal: parseVec3(object.normal),
        skipRemaining: object.skipRemaining,
        t: object.t,
        triangle: null,
        getTypeName: null,
        isOfType: null,
        isSame: null
    };
}
function serializeInteractableHitInfo(hitInfo) {
    if (hitInfo === null) {
        return null;
    }
    return {
        interactable: serializeInteractable(hitInfo.interactable),
        localHitPosition: serializeVec3(hitInfo.localHitPosition, false),
        hit: serializeRaycastHit(hitInfo.hit),
        targetMode: hitInfo.targetMode
    };
}
function parseInteractableHitInfo(object) {
    if (object === null) {
        return null;
    }
    return {
        interactable: parseInteractable(object.interactable),
        localHitPosition: parseVec3(object.localHitPosition, false),
        hit: parseRaycastHit(object.hit),
        targetMode: object.targetMode
    };
}
function serializeInteractables(interactables) {
    const serializedInteractables = [];
    for (const interactable of interactables) {
        serializedInteractables.push(serializeInteractable(interactable));
    }
    return serializedInteractables;
}
function parseInteractables(objects) {
    const interactables = [];
    for (const object of objects) {
        const interactable = parseInteractable(object);
        if (interactable !== null) {
            interactables.push(interactable);
        }
    }
    return interactables;
}
function serializeInteractor(interactor) {
    return {
        startPoint: serializeVec3(interactor.startPoint),
        endPoint: serializeVec3(interactor.endPoint),
        planecastPoint: serializeVec3(interactor.planecastPoint),
        direction: serializeVec3(interactor.direction),
        orientation: serializeQuat(interactor.orientation),
        distanceToTarget: interactor.distanceToTarget,
        targetHitPosition: serializeVec3(interactor.targetHitPosition),
        targetHitInfo: serializeInteractableHitInfo(interactor.targetHitInfo),
        maxRaycastDistance: interactor.maxRaycastDistance,
        activeTargetingMode: interactor.activeTargetingMode,
        interactionStrength: interactor.interactionStrength,
        isTargeting: interactor.isTargeting(),
        isActive: interactor.isActive(),
        currentInteractable: serializeInteractable(interactor.currentInteractable),
        previousInteractable: serializeInteractable(interactor.previousInteractable),
        currentTrigger: interactor.currentTrigger,
        previousTrigger: interactor.previousTrigger,
        currentDragVector: serializeVec3(interactor.currentDragVector),
        previousDragVector: serializeVec3(interactor.previousDragVector),
        planecastDragVector: serializeVec3(interactor.planecastDragVector),
        dragType: interactor.dragType,
        inputType: interactor.inputType,
        hoveredInteractables: serializeInteractables(interactor.hoveredInteractables)
    };
}
function parseInteractor(object) {
    return {
        startPoint: parseVec3(object.startPoint),
        endPoint: parseVec3(object.endPoint),
        planecastPoint: parseVec3(object.planecastPoint),
        direction: parseVec3(object.direction),
        orientation: parseQuat(object.orientation),
        distanceToTarget: object.distanceToTarget,
        targetHitPosition: parseVec3(object.targetHitPosition),
        targetHitInfo: parseInteractableHitInfo(object.targetHitInfo),
        maxRaycastDistance: object.maxRaycastDistance,
        activeTargetingMode: object.activeTargetingMode,
        interactionStrength: object.interactionStrength,
        isTargeting: object.isTargeting,
        isActive: object.isActive,
        currentInteractable: parseInteractable(object.currentInteractable),
        previousInteractable: parseInteractable(object.previousInteractable),
        currentTrigger: object.currentTrigger,
        previousTrigger: object.previousTrigger,
        currentDragVector: parseVec3(object.currentDragVector),
        previousDragVector: parseVec3(object.previousDragVector),
        planecastDragVector: parseVec3(object.planecastDragVector),
        dragType: object.dragType,
        inputType: object.inputType,
        hoveredInteractables: parseInteractables(object.hoveredInteractables)
    };
}
//# sourceMappingURL=SyncInteractionManager.js.map