import Event, {PublicApi, unsubscribe} from "../../../Utils/Event"

import {DragInteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import {DragType} from "../../../Core/Interactor/Interactor"
import {Interactable} from "../../Interaction/Interactable/Interactable"
import NativeLogger from "../../../Utils/NativeLogger"
import animate from "../../../Utils/animate"
import {createCallback} from "../../../Utils/InspectorCallbacks"
import {validate} from "../../../Utils/validate"

const TAG = "Slider"

/**
 * Describes the current state of the slider.
 */
export type SliderState = {
  // The current drag vector provided by the slider's underlying Interactable
  dragVector: vec3 | null

  // The raw value of the knob's position as an offset from the slider center along the track's axis.
  rawValue: number

  // The raw value of the knob's position, snapped to the nearest slider step.
  snappedValue: number

  // The actual numeric value displayed by the slider.
  displayValue: number
}

/**
 * Describes the current bounds and orientation of the slider track (the path of the slider knob).
 */
export type TrackState = {
  trackMin: number
  trackMax: number
  trackSize: number
  trackDirection: vec3
}
export type SliderBounds = {
  start: vec3
  end: vec3
  minAnchor: Rect
  maxAnchor: Rect
}
export type DragUpdate = {
  dragVector: vec3
  dragPoint: vec3
}

/**
 * This class represents a numerical slider control powered by Interaction Kit's hand tracking interactions. It allows users to adjust a value by sliding a handle along a track.
 */
@component
export class Slider extends BaseScriptComponent {
  @input
  @hint("The minimum numeric value of the slider")
  private _minValue: number = 0
  @input
  @hint("The maximum numeric value of the slider")
  private _maxValue: number = 1
  @input
  @hint("The initial numeric value of the slider")
  startValue: number = 0.5
  @input
  @hint(
    "Enable this to change the slider's value in steps rather than continuously",
  )
  stepBehavior: boolean = false
  @input
  @hint("The size of the steps that the slider's value will be changed in.")
  @showIf("stepBehavior", true)
  private _stepSize: number = 0

  @input
  @showIf("isToggleable", true)
  @hint("The duration of the toggle animation in seconds.")
  toggleDuration: number = 0.2

  @ui.separator
  @input
  @hint("The position of the slider knob when the minimum value is reached.")
  sliderMin!: SceneObject
  @input
  @hint("The position of the slider knob when the maximum value is reached.")
  sliderMax!: SceneObject
  @input("SceneObject")
  @hint(
    "The SceneObject representing the knob of the slider which will be moved along the path between the positions provided by sliderMin and sliderMax when the value is updated. Please ensure the SceneObject has an Interactable component attached.",
  )
  private _sliderKnob: SceneObject | undefined

  @ui.separator
  @input
  @hint(
    "Enable this to add functions from another script to this component's callback events",
  )
  editEventCallbacks: boolean = false

  @ui.group_start("On Hover Enter Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on hover enter")
  @allowUndefined
  private customFunctionForOnHoverEnter: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called on hover enter",
  )
  @allowUndefined
  private onHoverEnterFunctionNames: string[] = []
  @ui.group_end
  @ui.group_start("On Hover Exit Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on hover exit")
  @allowUndefined
  private customFunctionForOnHoverExit: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called on hover exit",
  )
  @allowUndefined
  private onHoverExitFunctionNames: string[] = []
  @ui.group_end
  @ui.group_start("On Slide Start Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on slide start")
  @allowUndefined
  private customFunctionForOnSlideStart: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called on slide start",
  )
  @allowUndefined
  private onSlideStartFunctionNames: string[] = []
  @ui.group_end
  @ui.group_start("On Slide End Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on slide end")
  @allowUndefined
  private customFunctionForOnSlideEnd: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called on slide end",
  )
  @allowUndefined
  private onSlideEndFunctionNames: string[] = []
  @ui.group_end
  @ui.group_start("On Value Update Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on value update")
  @allowUndefined
  private customFunctionForOnValueUpdate: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called on value update",
  )
  @allowUndefined
  private onValueUpdateFunctionNames: string[] = []
  @ui.group_end
  @ui.group_start("On Min Value Reached Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on min value reached")
  @allowUndefined
  private customFunctionForOnMinValueReached: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called when minimum value is reached",
  )
  @allowUndefined
  private onMinValueReachedFunctionNames: string[] = []
  @ui.group_end
  @ui.group_start("On Max Value Reached Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("The script containing functions to be called on max value reached")
  @allowUndefined
  private customFunctionForOnMaxValueReached: ScriptComponent | undefined
  @input
  @hint(
    "The names for the functions on the provided script, to be called when maximum value is reached",
  )
  @allowUndefined
  private onMaxValueReachedFunctionNames: string[] = []
  @ui.group_end
  private log = new NativeLogger(TAG)

  private _startPosition!: vec3
  private _endPosition!: vec3

  private sliderBounds!: SliderBounds
  private minBound!: vec2
  private maxBound!: vec2

  private trackState: TrackState | null = null
  private sliderState: SliderState | null = null

  private sliderKnobScreenTransform: ScreenTransform | undefined

  private interactable: Interactable | null = null

  private unsubscribeBag: unsubscribe[] = []

  private isDragging = false

  // Events
  private onHoverEnterEvent: Event = new Event()
  private onHoverExitEvent: Event = new Event()
  private onSlideStartEvent: Event<number> = new Event<number>()
  private onSlideEndEvent: Event<number> = new Event<number>()
  private onMinValueReachedEvent: Event<number> = new Event<number>()
  private onMaxValueReachedEvent: Event<number> = new Event<number>()
  private onValueUpdateEvent: Event<number> | null = null

  onHoverEnter!: PublicApi<void>
  onHoverExit!: PublicApi<void>
  onSlideStart!: PublicApi<number>
  onSlideEnd!: PublicApi<number>
  onValueUpdate!: PublicApi<number>
  onMinValueReached!: PublicApi<number>
  onMaxValueReached!: PublicApi<number>

  transform!: Transform

  onAwake(): void {
    validate(this.sliderKnob)

    this.interactable = this.sliderKnob.getComponent(Interactable.getTypeName())
    this.sliderKnobScreenTransform = this.sliderKnob.getComponent(
      "Component.ScreenTransform",
    )

    this.transform = this.getTransform()

    this.sliderBounds = {
      start: this.transform
        .getInvertedWorldTransform()
        .multiplyPoint(this.sliderMin.getTransform().getWorldPosition()),
      end: this.transform
        .getInvertedWorldTransform()
        .multiplyPoint(this.sliderMax.getTransform().getWorldPosition()),
      minAnchor: this.sliderMin.getComponent("Component.ScreenTransform")
        .anchors,
      maxAnchor: this.sliderMax.getComponent("Component.ScreenTransform")
        .anchors,
    }

    this._startPosition = this.sliderBounds.start
    this._endPosition = this.sliderBounds.end

    this.minBound = this.sliderBounds.minAnchor.getCenter()
    this.maxBound = this.sliderBounds.maxAnchor.getCenter()

    this.trackState = this.getTrackState()
    this.sliderState = this.getInitialSliderState()

    this.onValueUpdateEvent = new Event<number>((value) => {
      if (value >= this._maxValue) {
        this.onMaxValueReachedEvent.invoke(this._maxValue)
      } else if (value <= this._minValue) {
        this.onMinValueReachedEvent.invoke(this._minValue)
      }
    })

    this.onHoverEnter = this.onHoverEnterEvent.publicApi()
    this.onHoverExit = this.onHoverExitEvent.publicApi()
    this.onSlideStart = this.onSlideStartEvent.publicApi()
    this.onSlideEnd = this.onSlideEndEvent.publicApi()
    this.onValueUpdate = this.onValueUpdateEvent.publicApi()
    this.onMinValueReached = this.onMinValueReachedEvent.publicApi()
    this.onMaxValueReached = this.onMaxValueReachedEvent.publicApi()

    if (this._minValue > this._maxValue || this._maxValue < this._minValue) {
      throw new Error(
        "Error: SliderComponent's maxValue must be less than its minValue.",
      )
    }
    if (
      this._stepSize < 0 ||
      this._stepSize > this._maxValue - this._minValue
    ) {
      throw new Error(
        "Error: SliderComponent's stepSize must be greater than or equal to 0, and less than its value range.",
      )
    }
    this.updateUI()

    // Waiting for the OnStartEvent ensures that Interactable components are initialized before we add slider callbacks.
    this.createEvent("OnStartEvent").bind(() => {
      if (!this.interactable) {
        throw new Error(
          "Slider Knob must contain an Interactable component for the slider to work - please ensure that one is added to the SceneObject.",
        )
      }
      if (!this.sliderKnobScreenTransform) {
        throw new Error(
          "Slider Knob must be a Screen Transform for the slider to work - please ensure that one is added to the SceneObject.",
        )
      }
      this.setupInteractable()
    })

    this.createEvent("OnDestroyEvent").bind(() => {
      this.unsubscribeCallbacks()
    })

    if (this.editEventCallbacks) {
      if (this.customFunctionForOnHoverEnter) {
        this.onHoverEnter.add(
          createCallback<void>(
            this.customFunctionForOnHoverEnter,
            this.onHoverEnterFunctionNames,
          ),
        )
      }

      if (this.customFunctionForOnHoverExit) {
        this.onHoverExit.add(
          createCallback<void>(
            this.customFunctionForOnHoverExit,
            this.onHoverExitFunctionNames,
          ),
        )
      }

      if (this.customFunctionForOnSlideStart) {
        this.onSlideStart.add(
          createCallback<number>(
            this.customFunctionForOnSlideStart,
            this.onSlideStartFunctionNames,
          ),
        )
      }

      if (this.customFunctionForOnSlideEnd) {
        this.onSlideEnd.add(
          createCallback<number>(
            this.customFunctionForOnSlideEnd,
            this.onSlideEndFunctionNames,
          ),
        )
      }

      if (this.customFunctionForOnValueUpdate) {
        this.onValueUpdate.add(
          createCallback<number>(
            this.customFunctionForOnValueUpdate,
            this.onValueUpdateFunctionNames,
          ),
        )
      }

      if (this.customFunctionForOnMinValueReached) {
        this.onMinValueReached.add(
          createCallback<number>(
            this.customFunctionForOnMinValueReached,
            this.onMinValueReachedFunctionNames,
          ),
        )
      }

      if (this.customFunctionForOnMaxValueReached) {
        this.onMaxValueReached.add(
          createCallback<number>(
            this.customFunctionForOnMaxValueReached,
            this.onMaxValueReachedFunctionNames,
          ),
        )
      }
    }
  }

  get minValue(): number {
    return this._minValue
  }

  set minValue(value: number) {
    if (value >= this._maxValue) {
      this.log.e(
        `Could not set minimum value to ${value} as it cannot be greater than or equal to the maximum value: ${this._maxValue}`,
      )
      return
    }
    validate(this.sliderState)

    this._minValue = value
    let displayValue = this.sliderState.displayValue
    if (value > this.sliderState.displayValue) {
      this.log.w(
        `Setting current value ${this.sliderState.displayValue} to the new minimum value ${value} provided as it is now out of range.`,
      )
      displayValue = value
    }
    this.updateSliderStateFromDisplayValue(displayValue)
  }

  get maxValue(): number {
    return this._maxValue
  }

  set maxValue(value: number) {
    if (value <= this._minValue) {
      this.log.e(
        `Could not set maximum value to ${value} as it cannot be less than or equal to the minimum value: ${this._minValue}`,
      )
      return
    }
    validate(this.sliderState)

    this._maxValue = value
    let displayValue = this.sliderState.displayValue
    if (value < this.sliderState.displayValue) {
      this.log.w(
        `Setting current value ${this.sliderState.displayValue} to the new maximum value ${value} provided as it is now out of range.`,
      )
      displayValue = value
    }
    this.updateSliderStateFromDisplayValue(displayValue)
  }
  get currentValue(): number | null {
    return this.sliderState?.displayValue ?? null
  }
  set currentValue(value: number) {
    if (value < this._minValue) {
      this.log.w(
        `Slider value will be set to the minimum value: ${this._minValue} as the provided value ${value} was less than the minimum value allowed.`,
      )
      value = this._minValue
    } else if (value > this._maxValue) {
      this.log.w(
        `Slider value will be set to the maximum value: ${this._maxValue} as the provided value ${value} was greater than the maximum value allowed.`,
      )
      value = this._maxValue
    }
    this.updateSliderStateFromDisplayValue(value)
  }

  get stepSize(): number {
    return this._stepSize
  }
  set stepSize(stepSize: number) {
    if (stepSize > this._maxValue - this._minValue) {
      this.log.e(
        `Could not set step size to ${stepSize} as it must be less than the slider's value range.`,
      )
      return
    } else if (stepSize < 0) {
      this.log.e(
        `Could not set step size to ${stepSize} as it must be greater than or equal to 0.`,
      )
      return
    }
    this._stepSize = stepSize
  }

  get startPosition(): vec3 | null {
    return this._startPosition
  }

  set startPosition(position: vec3) {
    this._startPosition = position
    this.trackState = this.getTrackState()
    this.updateSliderState(null)
  }

  get endPosition(): vec3 | null {
    return this._endPosition
  }
  set endPosition(position: vec3) {
    this._endPosition = position
    this.trackState = this.getTrackState()
    this.updateSliderState(null)
  }

  get sliderKnob(): SceneObject | undefined {
    return this._sliderKnob
  }

  private getInitialSliderState(): SliderState {
    const rawValue = this.calculateRawValueFromDisplayValue(this.startValue)
    const displayValue = this.getSteppedDisplayValue(this.startValue)
    const snappedValue = this.calculateRawValueFromDisplayValue(displayValue)

    return {
      dragVector: null,
      rawValue: rawValue,
      snappedValue: snappedValue,
      displayValue: displayValue,
    }
  }

  private getTrackState(): TrackState {
    const direction = this._endPosition.sub(this._startPosition).normalize()

    const min = -this._startPosition.length
    const max = this._endPosition.length

    return {
      trackMin: min,
      trackMax: max,
      trackSize: max - min,
      trackDirection: direction,
    }
  }

  /**
   * Sets up event callbacks for behavior on the Interactable's interaction events.
   */
  private setupInteractable() {
    if (this.interactable === null) {
      throw new Error(
        "Slider Knob must contain an Interactable component for the slider to work - please ensure that one is added to the SceneObject.",
      )
    }

    // If this is not a slider with step size, enable instant dragging for more responsive behavior.
    if (this.stepSize === 0) {
      this.interactable.enableInstantDrag = true
    }

    this.unsubscribeBag.push(
      this.interactable.onHoverEnter.add(() => {
        this.onHoverEnterEvent.invoke()
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onHoverExit.add(() => {
        this.onHoverExitEvent.invoke()
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onDragStart.add((event: DragInteractorEvent) => {
        validate(this.sliderState)
        validate(event.planecastDragVector)
        validate(event.interactor.planecastPoint)

        this.onSlideStartEvent.invoke(this.sliderState.displayValue)
        this.isDragging = true
        this.updateSliderState({
          dragVector:
            event.interactor.dragType !== DragType.Touchpad
              ? event.planecastDragVector
              : event.dragVector,
          dragPoint: event.interactor.planecastPoint,
        })
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onDragUpdate.add((event: DragInteractorEvent) => {
        validate(event.planecastDragVector)
        validate(event.interactor.planecastPoint)

        this.updateSliderState({
          dragVector:
            event.interactor.dragType !== DragType.Touchpad
              ? event.planecastDragVector
              : event.dragVector,
          dragPoint: event.interactor.planecastPoint,
        })
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onDragEnd.add(() => {
        validate(this.sliderState)
        this.onSlideEndEvent.invoke(this.sliderState.displayValue)
        this.isDragging = false
        this.updateSliderState(null)
      }),
    )

    this.unsubscribeBag.push(
      this.interactable.onTriggerEnd.add(() => {
        this.toggleSliderState()
      }),
    )
  }

  private calculateRawValueFromDragVector(dragVector: vec3 | null) {
    validate(this.sliderState)

    if (dragVector === null) {
      return this.sliderState.rawValue
    }
    validate(this.trackState)

    dragVector = this.transform
      .getInvertedWorldTransform()
      .multiplyDirection(dragVector)
    return MathUtils.clamp(
      this.sliderState.rawValue +
        this.trackState.trackDirection.dot(dragVector),
      this.trackState.trackMin,
      this.trackState.trackMax,
    )
  }

  private calculateDisplayValueFromRawValue(rawValue: number): number {
    validate(this.trackState)

    const displayValue = MathUtils.remap(
      rawValue,
      this.trackState.trackMin,
      this.trackState.trackMax,
      this._minValue,
      this._maxValue,
    )
    return this.getSteppedDisplayValue(displayValue)
  }

  private calculateRawValueFromDisplayValue(displayValue: number): number {
    validate(this.trackState)

    return MathUtils.remap(
      displayValue,
      this._minValue,
      this._maxValue,
      this.trackState.trackMin,
      this.trackState.trackMax,
    )
  }

  private getSteppedDisplayValue(displayValue: number): number {
    return this._stepSize > 0
      ? this._minValue +
          Math.round((displayValue - this._minValue) / this._stepSize) *
            this._stepSize
      : displayValue
  }

  /**
   * Updates SliderState representing the most updated version of the slider, using the drag vector if active.
   * @param dragUpdate - the drag vector provided by the Interactor, or null if a drag is not active.
   */
  private updateSliderState(dragUpdate: DragUpdate | null) {
    validate(this.sliderState)

    if (dragUpdate === null) {
      this.sliderState.dragVector = null
      return
    }

    const localizedDragPoint = this.transform
      .getInvertedWorldTransform()
      .multiplyPoint(dragUpdate.dragPoint)

    // Check that the drag point is between the start/end points.
    const dragPointCheck = this.checkOutsideTrackBoundary(localizedDragPoint)

    if (dragPointCheck === -1) {
      this.currentValue = this.minValue
      return
    } else if (dragPointCheck === 1) {
      this.currentValue = this.maxValue
      return
    }

    const rawValue = this.calculateRawValueFromDragVector(dragUpdate.dragVector)
    const displayValue = this.calculateDisplayValueFromRawValue(rawValue)
    const snappedValue = this.calculateRawValueFromDisplayValue(displayValue)

    if (this.sliderState.displayValue !== displayValue) {
      this.onValueUpdateEvent?.invoke(displayValue)
    }

    this.sliderState = {
      dragVector: dragUpdate.dragVector,
      rawValue: rawValue,
      snappedValue: snappedValue,
      displayValue: displayValue,
    }
    this.updateUI()
  }

  // Check if a local point is to the left of the start point (-1) or the right of the end point (1).
  private checkOutsideTrackBoundary(localPoint: vec3): -1 | 0 | 1 {
    validate(this.trackState)

    const isPastStartPoint =
      localPoint
        .sub(this.sliderBounds.start)
        .angleTo(this.trackState.trackDirection) >
      Math.PI / 2

    const isPastEndPoint =
      localPoint
        .sub(this.sliderBounds.end)
        .angleTo(this.trackState.trackDirection) <
      Math.PI / 2

    if (isPastStartPoint) {
      return -1
    }

    if (isPastEndPoint) {
      return 1
    }

    return 0
  }

  private toggleSliderState() {
    if (this.isDragging) {
      return
    }
    validate(this.currentValue)

    const initialValue = this.currentValue

    if (this.stepSize === this.maxValue - this.minValue) {
      if (initialValue === this.minValue) {
        this.currentValue = this.maxValue
      } else if (initialValue === this.maxValue) {
        this.currentValue = this.minValue
      }

      this.animateToggleUI(initialValue < this.currentValue)
    }
  }

  private animateToggleUI(toggledOn: boolean): void {
    animate({
      duration: this.toggleDuration,
      easing: "ease-out-cubic",
      update: (t) => {
        validate(this.sliderKnobScreenTransform)
        validate(this.minBound)
        validate(this.maxBound)

        const lerpValue = toggledOn ? t : 1 - t
        this.sliderKnobScreenTransform.anchors.setCenter(
          vec2.lerp(this.minBound, this.maxBound, lerpValue),
        )
      },
    })
  }

  /**
   * Updates SliderState representing the most updated version of the slider, using a provided display value.
   * @param displayValue - the desired display value.
   */
  private updateSliderStateFromDisplayValue(displayValue: number) {
    validate(this.sliderState)
    const snappedValue = this.calculateRawValueFromDisplayValue(displayValue)

    if (displayValue !== this.sliderState.displayValue) {
      this.onValueUpdateEvent?.invoke(displayValue)
    }

    this.sliderState = {
      dragVector: null,
      rawValue: snappedValue,
      snappedValue: snappedValue,
      displayValue: displayValue,
    }
    this.updateUI()
  }

  /**
   * Updates the slider UI based on the snapped value, by moving the knob's position.
   */
  private updateUI(): void {
    validate(this.sliderKnobScreenTransform)
    validate(this.sliderState)
    validate(this.trackState)

    this.sliderKnobScreenTransform.anchors.setCenter(
      vec2.lerp(
        this.minBound,
        this.maxBound,
        (this.sliderState.snappedValue - this.trackState.trackMin) /
          this.trackState.trackSize,
      ),
    )
  }

  /**
   * Unsubscribes all the slider-specific callbacks to the Interactable component before this component is destroyed.
   */
  unsubscribeCallbacks(): void {
    this.unsubscribeBag.forEach((unsubscribeCallback: () => void) => {
      unsubscribeCallback()
    })
    this.unsubscribeBag = []
  }
}
