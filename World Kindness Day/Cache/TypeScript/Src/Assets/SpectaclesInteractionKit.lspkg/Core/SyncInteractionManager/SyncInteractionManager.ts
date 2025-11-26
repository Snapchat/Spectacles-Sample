import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractorCursor} from "../../Components/Interaction/InteractorCursor/InteractorCursor"
import {InputState} from "../../Components/UI/ContainerFrame/ContainerFrame"
import {CursorControllerProvider} from "../../Providers/CursorControllerProvider/CursorControllerProvider"
import {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import {SyncKitBridge} from "../../Utils/SyncKitBridge"
import {InteractionManager} from "../InteractionManager/InteractionManager"
import BaseInteractor from "../Interactor/BaseInteractor"
import {Interactor, InteractorInputType} from "../Interactor/Interactor"
import {DispatchableEventArgs, InteractableEventName} from "../Interactor/InteractorEvent"
import {SyncInteractor, SyncInteractorState} from "../SyncInteractor/SyncInteractor"

export type SyncInteractorEvent = {
  connectionId: string
  eventName: string
  targetId: string
  syncInteractorState: SyncInteractorState
}

// The key for storing interactor events in the realtime datastore.
const SYNC_INTERACTOR_EVENT_KEY = "_SyncInteractorEvent"

const SYNC_LEFT_HAND_INTERACTOR_INDEX = 0
const SYNC_RIGHT_HAND_INTERACTOR_INDEX = 1
const SYNC_MOBILE_INTERACTOR_INDEX = 2
const SYNC_MOUSE_INTERACTOR_INDEX = 3

const INDEX_BY_INTERACTOR_INPUT_TYPE = new Map<InteractorInputType, number>([
  [InteractorInputType.LeftHand, SYNC_LEFT_HAND_INTERACTOR_INDEX],
  [InteractorInputType.RightHand, SYNC_RIGHT_HAND_INTERACTOR_INDEX],
  [InteractorInputType.Mobile, SYNC_MOBILE_INTERACTOR_INDEX],
  [InteractorInputType.Mouse, SYNC_MOUSE_INTERACTOR_INDEX]
])

const SIK_SYNC_KIT_BRIDGE = SyncKitBridge.getInstance()
const SIK_INTERACTION_MANAGER = InteractionManager.getInstance()

/**
 * SyncInteractionManager propagates interaction events to and from different connections within the same
 * Connected Lens session. In order to use the SyncInteractionManager, SpectaclesSyncKit must also be present
 * in the Scene Hierarchy. Enabling this component with SpectaclesSyncKit set up will allow devs to subscribe to
 * onSyncHover / onSyncTrigger / onSyncDrag events of Interactables.
 */
@component
export class SyncInteractionManager extends BaseScriptComponent {
  /**
   * If enabled, the SyncInteractionManager will instantiate InteractorCursors for each connection in the session,
   * allowing users to understand where other users are targeting.
   */
  @input
  enableSyncCursors: boolean = true

  private readonly persistence: RealtimeStoreCreateOptions.Persistence = RealtimeStoreCreateOptions.Persistence.Session

  private cursorController: CursorControllerProvider = CursorControllerProvider.getInstance()
  private interactionManager: InteractionManager = InteractionManager.getInstance()

  private syncKitBridge = SyncKitBridge.getInstance()

  private readonly customNetworkId: string = "SyncInteractionManager"

  private sessionController: any

  private syncInteractorsByConnectionId: Map<string, SyncInteractor[]> = new Map<string, SyncInteractor[]>()

  private syncEntity: any

  constructor() {
    super()

    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  private onStart() {
    this.sessionController = this.syncKitBridge.sessionController
    if (this.sessionController === undefined) {
      throw new Error(
        "SpectaclesSyncKit's SessionController cannot be found. Cannot use SyncInteractionManager to sync interaction events across connections. " +
          "Please check that SpectaclesSyncKit has properly been set up if this lens is a Connected Lens. " +
          "If this lens is not meant to be a Connected Lens, please disable the SyncInteractionManager SceneObject."
      )
    }

    this.syncEntity = new this.syncKitBridge.SyncEntity(
      this,
      undefined,
      false,
      this.persistence,
      new this.syncKitBridge.networkIdTools.NetworkIdOptions(
        this.syncKitBridge.networkIdTools.NetworkIdType.Custom,
        this.customNetworkId
      )
    )

    this.sessionController.onUserJoinedSession.add(
      (session: MultiplayerSession, userInfo: ConnectedLensModule.UserInfo) => {
        // If we have somehow already created Interactors for this connectionId, ignore this signal.
        if (this.syncInteractorsByConnectionId.get(userInfo.connectionId) !== undefined) {
          return
        }

        const syncInteractors = []
        for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
          const interactor = this.sceneObject.createComponent(SyncInteractor.getTypeName())
          syncInteractors.push(interactor)

          if (this.enableSyncCursors) {
            const cursor = this.sceneObject.createComponent(InteractorCursor.getTypeName())
            cursor.interactor = interactor as BaseInteractor

            this.cursorController.registerCursor(cursor, interactor)
          }
        }

        this.syncInteractorsByConnectionId.set(userInfo.connectionId, syncInteractors)
      }
    )

    this.sessionController.onUserLeftSession.add(
      (session: MultiplayerSession, userInfo: ConnectedLensModule.UserInfo) => {
        const syncInteractors = this.syncInteractorsByConnectionId.get(userInfo.connectionId)

        if (syncInteractors !== undefined) {
          for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
            const cursor = this.cursorController.getCursorByInteractor(syncInteractors[i])
            if (cursor !== null) {
              cursor.destroy()
            }
            syncInteractors[i].destroy()
          }

          this.syncInteractorsByConnectionId.delete(userInfo.connectionId)
        }
      }
    )

    this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this))
  }

  private setupConnectionCallbacks(): void {
    this.createEvent("UpdateEvent").bind(this.update.bind(this))

    this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this))
  }

  // Whenever the local InteractionManager dispatches an event, propagate that event to the realtime datastore.
  private update() {
    this.disableSyncCursors()

    const dispatchEventsArgs = this.interactionManager.dispatchEventArgs

    const dispatchEventStrings = []
    for (const pendingEvent of dispatchEventsArgs) {
      dispatchEventStrings.push(JSON.stringify(this.serializeEventDispatch(pendingEvent)))
    }

    // Store this frame's events into a string array using the connectionId as key.
    this.syncEntity.currentStore.putStringArray(
      `${this.sessionController.getLocalConnectionId()}${SYNC_INTERACTOR_EVENT_KEY}`,
      dispatchEventStrings
    )
  }

  // Whenever another connection's InteractionManager dispatches an event, process the event strings from the realtime datastore.
  private processStoreUpdate(
    session: MultiplayerSession,
    store: GeneralDataStore,
    key: string,
    info: ConnectedLensModule.RealtimeStoreUpdateInfo
  ) {
    const connectionId = info.updaterInfo.connectionId
    const updatedByLocal = connectionId === this.sessionController.getLocalConnectionId()
    if (key.endsWith(SYNC_INTERACTOR_EVENT_KEY) && !updatedByLocal) {
      // If the event comes from a new connection, create SyncInteractors for that connection.
      const isNewConnection = !this.syncInteractorsByConnectionId.has(connectionId)

      if (isNewConnection) {
        const syncInteractors = []

        for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
          const interactor = this.sceneObject.createComponent(SyncInteractor.getTypeName())
          syncInteractors.push(interactor)

          if (this.enableSyncCursors) {
            const cursor = this.sceneObject.createComponent(InteractorCursor.getTypeName())
            cursor.interactor = interactor as BaseInteractor

            this.cursorController.registerCursor(cursor, interactor)
          }
        }

        this.syncInteractorsByConnectionId.set(connectionId, syncInteractors)
      }

      // Retrieve the batched array of stringified events during another user's frame.
      const eventStringArray = store.getStringArray(key)

      // Parse the stringified events into SyncInteractorEvents and dispatch them to the local InteractionManager.
      const parsedEvents = this.parseEventDispatch(eventStringArray)
      this.dispatchSyncInteractorEvents(parsedEvents)
    }
  }

  private dispatchSyncInteractorEvents(events: SyncInteractorEvent[]): void {
    const activeInteractors: Interactor[] = []
    // For each event propagated from a different connection, dispatch an event to the local InteractionManager.
    for (const event of events) {
      let syncInteractors = this.syncInteractorsByConnectionId.get(event.connectionId)
      const inputType = event.syncInteractorState.inputType
      const index = INDEX_BY_INTERACTOR_INPUT_TYPE.get(inputType)

      // If we are receiving events before receiving onUserJoinedSession somehow, ensure that the Interactors are created.
      if (syncInteractors === undefined) {
        syncInteractors = []
        for (let i = 0; i < INDEX_BY_INTERACTOR_INPUT_TYPE.size; i++) {
          const interactor = this.sceneObject.createComponent(SyncInteractor.getTypeName())
          syncInteractors.push(interactor)

          const cursor = this.sceneObject.createComponent(InteractorCursor.getTypeName())
          cursor.interactor = interactor as BaseInteractor

          this.cursorController.registerCursor(cursor, interactor)
        }

        this.syncInteractorsByConnectionId.set(event.connectionId, syncInteractors)
      }

      if (index === undefined) {
        throw new Error("Unrecognized inputType detected from synced event.")
      }

      const syncInteractor = syncInteractors[index]

      const cursor = this.cursorController.getCursorByInteractor(syncInteractor)
      if (cursor !== null) {
        cursor.enabled = true
      }

      const interactable = this.findInteractableById(event.targetId)

      // If the Interactable from a propagated event does not exist in the local instance, ignore the event.
      if (interactable !== null) {
        activeInteractors.push(syncInteractor)

        const dispatchableEventArgs: DispatchableEventArgs = {
          interactor: syncInteractor,
          target: interactable,
          eventName: event.eventName as InteractableEventName,
          connectionId: event.connectionId
        }

        // Set the state of the SyncInteractor so that any callbacks that reference the event Interactor will still function.
        syncInteractor.interactorState = event.syncInteractorState

        this.interactionManager.dispatchEvent(dispatchableEventArgs)
      }
    }

    for (const syncInteractors of this.syncInteractorsByConnectionId.values()) {
      for (const syncInteractor of syncInteractors) {
        if (!activeInteractors.includes(syncInteractor)) {
          syncInteractor.resetState()
        }
      }
    }
  }

  private serializeEventDispatch(event: DispatchableEventArgs): DispatchableEventArgsSerialized {
    if (event.connectionId === null || event.connectionId === undefined) {
      throw new Error(
        "Missing connection ID detected in an event before propagation. Please check that SyncKit has been set up properly in the scene."
      )
    }
    return {
      interactor: serializeInteractor(event.interactor),
      target: serializeInteractable(event.target),
      eventName: event.eventName,
      origin: serializeInteractable(event.origin ?? null),
      connectionId: event.connectionId
    }
  }

  private parseEventDispatch(eventStringArray: string[]): SyncInteractorEvent[] {
    const events: SyncInteractorEvent[] = []

    // Parse each individual string into a SyncInteractorEvent.
    for (const eventString of eventStringArray) {
      const parsedJson = JSON.parse(eventString) as DispatchableEventArgsSerialized

      const connectionId = parsedJson.connectionId
      const eventName = parsedJson.eventName
      const targetId = parsedJson.target!.id

      const interactorState = parseInteractor(parsedJson.interactor)

      const event: SyncInteractorEvent = {
        connectionId: connectionId,
        eventName: eventName,
        targetId: targetId,
        syncInteractorState: interactorState
      }

      events.push(event)
    }

    return events
  }

  // [SyncInteractable] This function works under the assumption that all Interactables are instantiated in every connection.
  // Further refinement to linking Interactables across connections w/o developer friction will happen on future iterations.
  private findInteractableById(id: string): Interactable | null {
    const interactable = this.interactionManager.getInteractableByInteractableId(id)

    return interactable
  }

  private disableSyncCursors() {
    const syncInteractorsArray = this.syncInteractorsByConnectionId.values()
    for (const syncInteractors of syncInteractorsArray) {
      for (const syncInteractor of syncInteractors) {
        if (syncInteractor.currentInteractable === null) {
          const cursor = this.cursorController.getCursorByInteractor(syncInteractor)
          if (cursor !== null) {
            cursor.enabled = false
          }
        }
      }
    }
  }
}

// The following functions are serialize/parse-related types and functions to help translate a dispatched event
// as SyncKit must use primitive types as the way to communicate via realtime datastore.

type Vec3Serialized = {
  x: number
  y: number
  z: number
} | null

type QuatSerialized = {
  w: number
  x: number
  y: number
  z: number
} | null

type InteractableSerialized = {
  id: string
} | null

type InputStateSerialized = {
  isHovered: boolean
  rawHovered: boolean
  isPinching: boolean
  position: Vec3Serialized
  innerInteractableActive: boolean
}

type RayCastHitSerialized = {
  position: Vec3Serialized
  distance: number
  normal: Vec3Serialized
  skipRemaining: boolean
  t: number
} | null

type InteractableHitInfoSerialized = {
  interactable: InteractableSerialized
  localHitPosition: Vec3Serialized
  hit: RayCastHitSerialized
  targetMode: number
} | null

type InteractorSerialized = {
  startPoint: Vec3Serialized
  endPoint: Vec3Serialized
  planecastPoint: Vec3Serialized
  direction: Vec3Serialized
  orientation: QuatSerialized
  distanceToTarget: number | null
  targetHitPosition: Vec3Serialized
  targetHitInfo: InteractableHitInfoSerialized
  maxRaycastDistance: number
  activeTargetingMode: number
  interactionStrength: number | null
  isTargeting: boolean
  isActive: boolean
  currentInteractable: InteractableSerialized
  previousInteractable: InteractableSerialized
  currentTrigger: number
  previousTrigger: number
  currentDragVector: Vec3Serialized
  previousDragVector: Vec3Serialized
  planecastDragVector: Vec3Serialized
  dragType: number | null
  inputType: number
  hoveredInteractables: InteractableSerialized[]
}

type DispatchableEventArgsSerialized = {
  interactor: InteractorSerialized
  target: InteractableSerialized
  eventName: string
  origin: InteractableSerialized
  connectionId: string
}

function serializeVec3(vec: vec3 | null, isWorld = true): Vec3Serialized {
  if (vec === null) {
    return null
  }

  if (isWorld) {
    vec = SIK_SYNC_KIT_BRIDGE.worldVec3ToLocationVec3(vec)
  }

  return {
    x: vec.x,
    y: vec.y,
    z: vec.z
  }
}

function parseVec3(object: Vec3Serialized, isWorld = true): vec3 | null {
  if (object === null) {
    return null
  }

  let vec = new vec3(object.x, object.y, object.z)

  if (isWorld) {
    vec = SIK_SYNC_KIT_BRIDGE.locationVec3ToWorldVec3(vec)
  }

  return vec
}

function serializeQuat(quat: quat | null, isWorld = true): QuatSerialized {
  if (quat === null) {
    return null
  }

  if (isWorld) {
    quat = SIK_SYNC_KIT_BRIDGE.worldQuatToLocationQuat(quat)
  }

  return {
    w: quat.w,
    x: quat.x,
    y: quat.y,
    z: quat.z
  }
}

function parseQuat(object: QuatSerialized, isWorld = true): quat | null {
  if (object === null) {
    return null
  }

  let quaternion = new quat(object.w, object.x, object.y, object.z)

  if (isWorld) {
    quaternion = SIK_SYNC_KIT_BRIDGE.locationQuatToWorldQuat(quaternion)
  }

  return quaternion
}

// [SyncInteractable] This function works under the assumption that all Interactables are instantiated in every connection.
// Further refinement to linking Interactables across connections w/o developer friction will happen on future iterations.
function serializeInteractable(interactable: Interactable | null): InteractableSerialized {
  if (interactable === null) {
    return null
  }

  const id = SIK_INTERACTION_MANAGER.getInteractableIdByInteractable(interactable)

  if (id === null) {
    throw new Error(`Missing networkID on Interactable of SceneObject: ${interactable.sceneObject.name}`)
  }

  return {
    id: id
  }
}

function parseInteractable(object: InteractableSerialized): Interactable | null {
  if (object === null) {
    return null
  }

  return SIK_INTERACTION_MANAGER.getInteractableByInteractableId(object.id)
}

// Collider and TriangleHit are much harder to mock, so the raycast hit will only include simpler types.
function serializeRaycastHit(hit: RayCastHit | null): RayCastHitSerialized {
  if (hit === null) {
    return null
  }

  return {
    position: serializeVec3(hit.position),
    distance: hit.distance,
    normal: serializeVec3(hit.normal),
    skipRemaining: hit.skipRemaining,
    t: hit.t
  } as RayCastHitSerialized
}

export function serializeInputState(state: InputState): InputStateSerialized {
  return {
    isHovered: state.isHovered,
    rawHovered: state.rawHovered,
    isPinching: state.isPinching,
    position: serializeVec3(state.position, false),
    innerInteractableActive: state.innerInteractableActive
  } as InputStateSerialized
}

export function parseInputState(object: InputStateSerialized): InputState {
  return {
    isHovered: object.isHovered,
    rawHovered: object.rawHovered,
    isPinching: object.isPinching,
    position: parseVec3(object.position, false),
    innerInteractableActive: object.innerInteractableActive
  } as InputState
}

function parseRaycastHit(object: RayCastHitSerialized): RayCastHit | null {
  if (object === null) {
    return null
  }

  return {
    position: parseVec3(object.position)!,
    distance: object.distance,
    collider: null!,
    normal: parseVec3(object.normal)!,
    skipRemaining: object.skipRemaining,
    t: object.t,
    triangle: null!,
    getTypeName: null!,
    isOfType: null!,
    isSame: null!
  }
}

function serializeInteractableHitInfo(hitInfo: InteractableHitInfo | null): InteractableHitInfoSerialized {
  if (hitInfo === null) {
    return null
  }

  return {
    interactable: serializeInteractable(hitInfo.interactable),
    localHitPosition: serializeVec3(hitInfo.localHitPosition, false),
    hit: serializeRaycastHit(hitInfo.hit),
    targetMode: hitInfo.targetMode
  }
}

function parseInteractableHitInfo(object: InteractableHitInfoSerialized): InteractableHitInfo | null {
  if (object === null) {
    return null
  }

  return {
    interactable: parseInteractable(object.interactable)!,
    localHitPosition: parseVec3(object.localHitPosition, false)!,
    hit: parseRaycastHit(object.hit)!,
    targetMode: object.targetMode
  }
}

function serializeInteractables(interactables: Interactable[]): InteractableSerialized[] {
  const serializedInteractables: {id: string}[] = []

  for (const interactable of interactables) {
    serializedInteractables.push(serializeInteractable(interactable)!)
  }

  return serializedInteractables
}

function parseInteractables(objects: InteractableSerialized[]) {
  const interactables: Interactable[] = []

  for (const object of objects) {
    const interactable = parseInteractable(object)
    if (interactable !== null) {
      interactables.push(interactable)
    }
  }

  return interactables
}

function serializeInteractor(interactor: Interactor): InteractorSerialized {
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
  }
}

function parseInteractor(object: InteractorSerialized): SyncInteractorState {
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
  }
}
