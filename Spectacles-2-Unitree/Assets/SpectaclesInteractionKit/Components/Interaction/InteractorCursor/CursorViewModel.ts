import {Interactable} from "../../../Components/Interaction/Interactable/Interactable"
import {InteractableManipulation} from "../../../Components/Interaction/InteractableManipulation/InteractableManipulation"
import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import {
  Interactor,
  InteractorInputType,
  InteractorTriggerType,
  TargetingMode,
} from "../../../Core/Interactor/Interactor"
import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {HandInputData} from "../../../Providers/HandInputData/HandInputData"
import {InteractionConfigurationProvider} from "../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import animate, {CancelSet, easingFunctions} from "../../../Utils/animate"
import Event, {unsubscribe} from "../../../Utils/Event"
import NativeLogger from "../../../Utils/NativeLogger"
import {OneEuroFilterVec3} from "../../../Utils/OneEuroFilter"
import StateMachine from "../../../Utils/StateMachine"
import {ScrollView} from "../../UI/ScrollView/ScrollView"

export enum CursorState {
  Inactive = "Inactive",
  Idle = "Idle",
  Hovering = "Hovering",
  Manipulating = "Manipulating",
  Scrolling = "Scrolling",
}

export enum CursorInteractor {
  Primary,
  Secondary,
}

export type CursorViewState = (
  | {
      cursorEnabled: true
      cursorData: CursorData
    }
  | {
      cursorEnabled: false
    }
) &
  (
    | {
        lineEnabled: true
        lineData: ManipulateLineData
      }
    | {
        lineEnabled: false
      }
  )

export type CursorData = {
  position: vec3 | null
  interactionStrength: number | null
  isTriggering: boolean
  scale: number
}

export type ManipulateLineData = {
  origin: vec3
  endPoint: vec3
  delta: vec3 | null
}

const DISTANCE_SCALE_FACTOR = 10
const DEFAULT_INITIAL_DISTANCE = 160
const MIN_DISTANCE = 15
const DEFAULT_MANIPULATE_STRENGTH = 1
const DEFAULT_HOVER_ANIMATE_DURATION_SECONDS = 0.2
const DEFAULT_IDLE_ANIMATE_DURATION_SECONDS = 0.7

const DEFAULT_NEAR_FIELD_SCALE = 0.4
const DEFAULT_MID_FIELD_SCALE = 0.8
const DEFAULT_FAR_FIELD_SCALE = 1.2

const DEFAULT_NEAR_FIELD_THRESHOLD_CM = 70
const DEFAULT_MID_FIELD_THRESHOLD_CM = 130
const DEFAULT_FAR_FIELD_THRESHOLD_CM = 200

const DEFAULT_CURSOR_FILTER = {
  frequency: 60,
  dcutoff: 0.16,
  minCutoff: 0.5,
  beta: 0.2,
}

const TAG = "CursorViewModel"

/**
 * ViewModel for the InteractorCursor that uses a StateMachine to keep track of cursor updates & state changes.
 */
export class CursorViewModel {
  private interactionConfigurationProvider: InteractionConfigurationProvider =
    InteractionConfigurationProvider.getInstance()

  private camera = WorldCameraFinderProvider.getInstance()

  // Native Logging
  private log = new NativeLogger(TAG)

  private stateMachine = new StateMachine("CursorViewModel")

  private handProvider: HandInputData = HandInputData.getInstance()

  private interactionManager: InteractionManager =
    InteractionManager.getInstance()

  private onStateChangeEvent = new Event<CursorState>()
  public onStateChange = this.onStateChangeEvent.publicApi()
  private onCursorUpdateEvent = new Event<CursorViewState>()
  public onCursorUpdate = this.onCursorUpdateEvent.publicApi()

  private _cursorPosition: vec3 | null = null

  private currentInteractableUnsubscribeCallback: unsubscribe | null = null
  private currentInteractable: Interactable | null = null
  private currentManipulation: InteractableManipulation | null = null
  private isScrolling = false

  private cursorDistance = DEFAULT_INITIAL_DISTANCE

  private distanceCancelSet = new CancelSet()
  private isAnimating = false

  private scrollView: ScrollView | null = null

  // Allows the developer to set position manually, setting to null whenever the developer wants to resume default behavior.
  positionOverride: vec3 | null = null

  /**
   * Currently using a one-euro filter optimized for reducing slow speed jitter.
   */
  private filter = new OneEuroFilterVec3(DEFAULT_CURSOR_FILTER)

  constructor(
    private enableCursorHolding: boolean,
    private enableFilter: boolean,
    private _interactor?: Interactor
  ) {
    // If passing an Interactor within the constructor, ensure the Interactor callbacks are setup correctly.
    if (_interactor !== undefined) {
      this.setInteractor(_interactor)
    }

    this.setupStateMachine()
  }

  setInteractor(interactor: Interactor): void {
    if (this.currentInteractableUnsubscribeCallback !== null) {
      this.currentInteractableUnsubscribeCallback()
      this.currentInteractableUnsubscribeCallback = null
    }

    this._interactor = interactor

    this.currentInteractableUnsubscribeCallback =
      this.interactor?.onCurrentInteractableChanged.add((interactable) => {
        this.currentInteractable = interactable
        this.currentManipulation =
          interactable !== null
            ? interactable.sceneObject.getComponent(
                InteractableManipulation.getTypeName()
              )
            : null
        this.isScrolling =
          interactable !== null
            ? this.checkScrollable(interactable.sceneObject)
            : false
      }) ?? null
  }

  private get interactor(): Interactor | null {
    return this._interactor ?? null
  }

  get cursorPosition(): vec3 | null {
    return this._cursorPosition
  }

  private setupStateMachine() {
    this.stateMachine.addState({
      name: CursorState.Inactive,
      onEnter: () => {
        this.onStateChangeEvent.invoke(CursorState.Inactive)

        // If we enter the inactive state due to direct targeting, set the cursor distance to be closer to hand for post-direct interaction.
        const isDirect =
          this.interactor !== null &&
          this.interactor.activeTargetingMode === TargetingMode.Direct
        this.cursorDistance = isDirect ? MIN_DISTANCE : DEFAULT_INITIAL_DISTANCE
      },
      transitions: [
        {
          nextStateName: CursorState.Idle,
          checkOnUpdate: () => {
            return (
              (this.checkVisibleTargetingState() &&
                this.interactor?.currentInteractable === null) ??
              false
            )
          },
        },
        {
          nextStateName: CursorState.Hovering,
          // If the interactor targets an object on the first frame of being active, jump immediately to the object to avoid jumpy cursor.
          checkOnUpdate: () => {
            return (
              this.checkVisibleTargetingState() &&
              this.interactor?.currentInteractable !== null
            )
          },
        },
      ],
    })

    this.stateMachine.addState({
      name: CursorState.Idle,
      onEnter: () => {
        this.onStateChangeEvent.invoke(CursorState.Idle)

        // When entering idle state with no Interactable target, lerp to the default distance
        const distance = Math.max(this.cursorDistance, MIN_DISTANCE)
        this.animateCursorDistance(
          distance,
          "ease-in-out-cubic",
          DEFAULT_IDLE_ANIMATE_DURATION_SECONDS
        )
      },
      onUpdate: (): void => {
        const position = this.getFarFieldCursorPosition()

        this.updateIndirectCursorPosition(
          this.interactor?.interactionStrength ?? null,
          position
        )
      },
      transitions: [
        {
          nextStateName: CursorState.Inactive,
          checkOnUpdate: () => {
            return !this.interactor || !this.checkVisibleTargetingState()
          },
        },
        {
          nextStateName: CursorState.Hovering,
          checkOnUpdate: () => {
            return this.interactor?.currentInteractable !== null
          },
          // Lerp to the targeted Interactable when transitioning to hover state
          onExecution: () => {
            const origin = this.interactor?.startPoint ?? null
            const hitPosition = this.interactor?.targetHitPosition ?? null

            if (origin === null || hitPosition === null) {
              return
            }

            const distance = origin.distance(hitPosition)

            this.animateCursorDistance(
              distance,
              "linear",
              DEFAULT_HOVER_ANIMATE_DURATION_SECONDS
            )
          },
        },
      ],
    })

    this.stateMachine.addState({
      name: CursorState.Hovering,
      onEnter: () => {
        this.onStateChangeEvent.invoke(CursorState.Hovering)
      },
      onUpdate: () => {
        // Cancel the animation if a trigger happens mid-animation
        if (
          this.isAnimating &&
          this.interactor?.currentTrigger !== InteractorTriggerType.None
        ) {
          this.cancelAnimation()
        }

        if (!this.isAnimating) {
          if (!this.interactor || !this.interactor.startPoint) {
            return
          }

          this.cursorDistance =
            this.interactor?.targetHitInfo?.hit.position.distance(
              this.interactor.startPoint
            ) ?? this.cursorDistance
        }

        const position = this.shouldCursorHold()
          ? this.getHeldCursorPosition()
          : this.getFarFieldCursorPosition()

        this.updateIndirectCursorPosition(
          this.interactor?.interactionStrength ?? null,
          position
        )
      },
      transitions: [
        {
          nextStateName: CursorState.Inactive,
          checkOnUpdate: () => {
            return !this.interactor || !this.checkVisibleTargetingState()
          },
        },
        {
          nextStateName: CursorState.Idle,
          checkOnUpdate: () => {
            return !this.interactor?.currentInteractable
          },
        },
        {
          nextStateName: CursorState.Manipulating,
          checkOnUpdate: () => {
            return (
              this.interactor?.currentTrigger !== InteractorTriggerType.None &&
              this.currentManipulation !== null
            )
          },
        },
        {
          nextStateName: CursorState.Scrolling,
          checkOnUpdate: () => {
            return (
              this.interactor?.currentTrigger !== InteractorTriggerType.None &&
              this.isScrolling &&
              this.interactor?.currentDragVector !== null
            )
          },
        },
      ],
      onExit: () => {
        this.cancelAnimation()
      },
    })

    this.stateMachine.addState({
      name: CursorState.Manipulating,
      onEnter: () => this.onStateChangeEvent.invoke(CursorState.Manipulating),
      onUpdate: () => {
        /**
         * We were showing the cursor held to center as a visual feedback if line is disabled,
         * But we disabled this by default in LAF-3485.
         */
        this.updateIndirectCursorPosition(
          DEFAULT_MANIPULATE_STRENGTH,
          this.getHeldCursorPosition()
        )
      },
      transitions: [
        {
          nextStateName: CursorState.Inactive,
          checkOnUpdate: () => {
            return !this.interactor || !this.checkVisibleTargetingState()
          },
        },
        {
          nextStateName: CursorState.Idle,
          checkOnUpdate: () => {
            return !this.interactor?.currentInteractable
          },
        },
        {
          nextStateName: CursorState.Hovering,
          checkOnUpdate: () => {
            return (
              this.interactor?.currentTrigger === InteractorTriggerType.None
            )
          },
        },
      ],
    })

    this.stateMachine.addState({
      name: CursorState.Scrolling,
      onEnter: () => this.onStateChangeEvent.invoke(CursorState.Scrolling),
      onUpdate: () => {
        const planecastPosition = this.getPlanecastCursorPosition()

        this.updateIndirectCursorPosition(
          this.interactor?.interactionStrength ?? null,
          planecastPosition
        )
      },

      transitions: [
        {
          nextStateName: CursorState.Inactive,
          checkOnUpdate: () => {
            return !this.interactor || !this.checkVisibleTargetingState()
          },
        },
        {
          nextStateName: CursorState.Idle,
          checkOnUpdate: () => {
            return (
              !this.interactor?.currentInteractable ||
              // If the planecasted point is not within the ScrollView's bounds, immediately switch to Idle to avoid a flicker.
              (!this.checkPlanecastWithinScrollView() &&
                this.interactor?.currentTrigger === InteractorTriggerType.None)
            )
          },
        },
        {
          nextStateName: CursorState.Hovering,
          checkOnUpdate: () => {
            return (
              this.interactor?.currentTrigger === InteractorTriggerType.None
            )
          },
        },
      ],
    })

    this.stateMachine.enterState(CursorState.Inactive)
  }

  private getPlanecastCursorPosition(): vec3 | null {
    if (this.interactor === null) {
      this.log.d(
        "Cursor failed to get planecast position due to null interactor, and will return null."
      )
      return null
    }

    const position = this.interactor.planecastPoint

    return this.shouldFilter() && position
      ? this.filter.filter(position, getTime())
      : position
  }

  private checkPlanecastWithinScrollView() {
    const cursorPos = this.getPlanecastCursorPosition()
    if (cursorPos === null) {
      return false
    }

    return (
      this.scrollView
        ?.getSceneObject()
        ?.getComponent("Component.ScreenTransform")
        ?.containsWorldPoint(cursorPos) ?? false
    )
  }

  /**
   * Calculates the position of the cursor based on the center of the targeting ray.
   * @returns the position of the cursor, or null if not applicable
   */
  private getFarFieldCursorPosition(): vec3 | null {
    const origin = this.interactor?.startPoint ?? null
    const direction = this.interactor?.direction ?? null
    if (this.interactor === null || origin === null || direction === null) {
      this.log.d(
        "Cursor failed to get far field position due to null interactor, origin, or direction, and will return null."
      )
      return null
    }
    const position = origin.add(direction.uniformScale(this.cursorDistance))
    return this.shouldFilter()
      ? this.filter.filter(position, getTime())
      : position
  }

  /**
   * Returns the held cursor position, where it's stuck to the center of target when currently selecting, or the hit position otherwise.
   * @returns the position of the held cursor, with the regular far field cursor position or null as a fallback if the target hit position cannot be found.
   */
  private getHeldCursorPosition(): vec3 | null {
    let position: vec3 | null

    if (!this.interactor) {
      return null
    }
    const isTriggering =
      (this.interactor.currentTrigger & InteractorTriggerType.Select) !== 0

    const wasTriggering =
      (this.interactor.previousTrigger & InteractorTriggerType.Select) !== 0

    if (isTriggering) {
      // While triggering, ensuring that the initial local position is maintained.
      position =
        this.interactor?.currentInteractable?.sceneObject
          .getTransform()
          .getWorldTransform()
          .multiplyPoint(
            this.interactor?.targetHitInfo?.localHitPosition ?? vec3.zero()
          ) ?? null
    } else if (wasTriggering && !isTriggering) {
      // On the frame that the Interactor stops triggering, maintain the same cursor position as previous frame to account for targeting changes.
      position = this.cursorPosition
    } else {
      // We calculate the direction from the interactor to the hit point, then use the stored cursor distance to respect animated distance.
      const origin = this.interactor.startPoint
      if (!origin) {
        return null
      }
      const direction = this.interactor.targetHitInfo?.hit.position
        ?.sub(origin)
        .normalize()

      if (!direction) {
        return null
      }

      position = origin.add(direction.uniformScale(this.cursorDistance))
    }

    if (position) {
      return this.shouldFilter()
        ? this.filter.filter(position, getTime())
        : position
    } else {
      return this.getFarFieldCursorPosition()
    }
  }

  /**
   * @returns if the cursor should be held to the hit position.
   * During manipulation, since the interactor is assumed to be triggered, we hold the cursor to maintain local offset.
   */
  private shouldCursorHold(): boolean {
    return (
      this.enableCursorHolding &&
      ((this.interactor &&
        (this.interactor.inputType & InteractorInputType.BothHands) !== 0) ??
        false)
    )
  }

  private shouldFilter(): boolean {
    return (
      this.enableFilter &&
      ((this.interactor &&
        (this.interactor.inputType & InteractorInputType.BothHands) !== 0) ??
        false)
    )
  }

  // Animates the cursor to move to a certain distance using easing functions
  private animateCursorDistance(
    distance: number,
    easing: keyof typeof easingFunctions,
    duration: number
  ) {
    // Ensure only one thing is modifying the cursor distance at a time
    this.distanceCancelSet.cancel()
    this.isAnimating = true

    const initialDistance = this.cursorDistance
    animate({
      cancelSet: this.distanceCancelSet,
      duration: duration,
      update: (t: number) => {
        this.cursorDistance = MathUtils.lerp(initialDistance, distance, t)
      },
      ended: () => {
        this.isAnimating = false
      },
      easing: easing,
    })
  }

  /**
   * Cancel the existing animation and set the isAnimating boolean to false,
   * allowing other functions ({@link getFarFieldCursorPosition} and {@link getHeldCursorPosition})
   * to modify {@link cursorDistance} to jump the cursor to the Interactable object
   */
  private cancelAnimation() {
    this.distanceCancelSet.cancel()
    this.isAnimating = false
  }

  // Check if interacted item is within a ScrollView
  private checkScrollable(sceneObject: SceneObject | null): boolean {
    if (sceneObject === null) {
      return false
    }

    const interactable =
      this.interactionManager.getInteractableBySceneObject(sceneObject)

    if (interactable !== null && interactable.isScrollable) {
      this.scrollView = sceneObject.getComponent(ScrollView.getTypeName())
      if (this.scrollView !== null) {
        return this.scrollView.contentLength > this.scrollView.scrollAreaSize.y
      }
    }

    return this.checkScrollable(sceneObject.getParent())
  }

  /**
   * When in indirect interaction mode while targeting an Interactable,
   * positions to interaction hit point if snapping.
   * If there is no origin, then hide the cursor instead.
   */
  private updateIndirectCursorPosition(
    interactionStrength: number | null,
    position: vec3 | null
  ): void {
    if (position !== null) {
      if (!this.isAnimating) {
        this.cursorDistance =
          this.interactor?.startPoint?.distance(position) ?? this.cursorDistance
      }

      this._cursorPosition = this.positionOverride ?? position

      this.onCursorUpdateEvent.invoke({
        cursorEnabled: true,
        cursorData: {
          position: this.cursorPosition,
          interactionStrength: interactionStrength ?? null,
          isTriggering:
            this.interactor?.currentTrigger !== InteractorTriggerType.None,
          scale: this.calculateCursorScale(),
        },
        lineEnabled: false,
      })
    }
  }

  // Check if the interactor is not in a state that should hide the cursor (poke or direct), as well as if the interactor is active/targeting.
  private checkVisibleTargetingState(): boolean {
    if (this.interactor?.enabled) {
      // If the interactor is targeting via direct pinch or poke (but not necessarily near field mode due to no plane), hide the cursor.
      const isVisibleTargetingMode =
        (this.interactor.activeTargetingMode &
          (TargetingMode.Poke | TargetingMode.Direct | TargetingMode.None)) ===
        0

      return (
        (isVisibleTargetingMode ||
          this.interactor.inputType === InteractorInputType.Mouse) &&
        this.interactor.isActive() &&
        this.interactor.isTargeting()
      )
    }

    return false
  }

  private calculateCursorScale(): number {
    if (this.cursorDistance > DEFAULT_FAR_FIELD_THRESHOLD_CM) {
      return DEFAULT_FAR_FIELD_SCALE
    } else if (
      this.cursorDistance > DEFAULT_MID_FIELD_THRESHOLD_CM &&
      this.cursorDistance <= DEFAULT_FAR_FIELD_THRESHOLD_CM
    ) {
      const scaleDifference = DEFAULT_FAR_FIELD_SCALE - DEFAULT_MID_FIELD_SCALE

      const t = MathUtils.remap(
        this.cursorDistance,
        DEFAULT_MID_FIELD_THRESHOLD_CM,
        DEFAULT_FAR_FIELD_THRESHOLD_CM,
        0,
        1
      )

      return DEFAULT_MID_FIELD_SCALE + scaleDifference * t
    } else if (
      this.cursorDistance > DEFAULT_NEAR_FIELD_THRESHOLD_CM &&
      this.cursorDistance <= DEFAULT_MID_FIELD_THRESHOLD_CM
    ) {
      const scaleDifference = DEFAULT_MID_FIELD_SCALE - DEFAULT_NEAR_FIELD_SCALE

      const t = MathUtils.remap(
        this.cursorDistance,
        DEFAULT_NEAR_FIELD_THRESHOLD_CM,
        DEFAULT_MID_FIELD_THRESHOLD_CM,
        0,
        1
      )

      return DEFAULT_NEAR_FIELD_SCALE + scaleDifference * t
    } else {
      return DEFAULT_NEAR_FIELD_SCALE
    }
  }
}
