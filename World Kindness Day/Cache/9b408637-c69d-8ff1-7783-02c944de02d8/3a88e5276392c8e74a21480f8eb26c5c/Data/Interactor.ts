import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {InteractableHitInfo} from "../../Providers/TargetProvider/TargetProvider"
import {PublicApi} from "../../Utils/Event"

/**
 * Input types that discern a target interactable and translate events from their inputs
 */
export enum InteractorInputType {
  None = 0,
  LeftHand = 1 << 0,
  RightHand = 1 << 1,
  BothHands = LeftHand | RightHand,
  Mobile = 1 << 2,
  BtController = 1 << 3,
  CustomController = 1 << 4,
  Mouse = 1 << 5,
  Sync = 1 << 6,
  All = BothHands | Mobile | BtController | CustomController | Mouse
}

/**
 * TargetingMode is a bitflag that determines how an interactor is interacting with an interactable.
 * This is also used to determine whether a specific targeting mode can interact with an interactable.
 */
export enum TargetingMode {
  None = 0,
  Direct = 1 << 0,
  Indirect = 1 << 1,
  Poke = 1 << 2, // Poke is mutually exclusive with Direct and Indirect
  All = Direct | Indirect | Poke
}

/**
 * InteractorTriggerType is used to differentiate triggers,
 * such as a pinch and poke. For objects that only care about activation,
 * we can combine these types to make more generic functionality.
 *
 * Example:
 * The developer may want to trigger a sound effect when selected. We combine
 * both Pinch and Poke into Select so that all we have to look for is Select.
 */
export enum InteractorTriggerType {
  None = 0,
  Pinch = 1 << 0,
  Poke = 1 << 1,
  Select = Pinch | Poke
}

/**
 * DragType differentiates the type of drag vector that is being passed.
 * SixDof is used when the interactor is being moved in world space.
 * Touchpad is used when the interactor has some sort of touchpad to initiate drag events.
 */
export enum DragType {
  SixDof = 0,
  Touchpad = 1
}

/**
 * Defines available Interactor apis
 */
export interface Interactor {
  enabled: boolean

  inputType: InteractorInputType

  currentInteractable: Interactable | null

  previousInteractable: Interactable | null

  onCurrentInteractableChanged: PublicApi<Interactable | null>

  isTriggering: boolean

  wasTriggering: boolean

  currentTrigger: InteractorTriggerType

  previousTrigger: InteractorTriggerType

  currentDragVector: vec3 | null

  previousDragVector: vec3 | null

  planecastDragVector: vec3 | null

  /**
   * The type of drag vector that is currently being invoked.
   */
  dragType: DragType | null

  startPoint: vec3 | null

  endPoint: vec3 | null

  planecastPoint: vec3 | null

  deltaStartPosition: vec3 | null

  direction: vec3 | null

  orientation: quat | null

  distanceToTarget: number | null

  targetHitPosition: vec3 | null

  targetHitInfo: InteractableHitInfo | null

  maxRaycastDistance: number

  activeTargetingMode: TargetingMode

  interactionStrength: number | null

  drawDebug: boolean

  wasHoveringCurrentInteractable: boolean | null
  isHoveringCurrentInteractable: boolean | null

  hoveredInteractables: Interactable[]

  onTriggerStart: PublicApi<Interactable | null>
  onTriggerUpdate: PublicApi<Interactable | null>
  onTriggerEnd: PublicApi<Interactable | null>
  onTriggerCanceled: PublicApi<Interactable | null> // Maybe? Not sure.

  isTargeting(): boolean

  isActive(): boolean

  updateState(): void

  setInputEnabled(enabled: boolean): void

  raycastPlaneIntersection(interactable: Interactable | null): vec3 | null

  colliderPlaneIntersection(interactable: Interactable | null): vec3 | null

  positionPlaneIntersection(interactable: Interactable | null, position: vec3 | null): vec3 | null

  clearCurrentInteractable(): void

  currentInteractableChanged(): void

  isHoveringInteractable(interactable: Interactable): boolean

  isHoveringInteractableHierarchy(interactable: Interactable): boolean
}
