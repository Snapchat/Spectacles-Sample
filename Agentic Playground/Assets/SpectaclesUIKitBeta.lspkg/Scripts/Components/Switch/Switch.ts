import {DragInteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import animate, {CancelSet, mix} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {clamp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {StateEvent} from "../../Utility/InteractableStateMachine"
import {Callback, createCallbacks} from "../../Utility/SceneUtilities"
import {RoundedRectangleVisual} from "../../Visuals/RoundedRectangle/RoundedRectangleVisual"
import {COLORS, Visual} from "../../Visuals/Visual"
import {StateName} from "../Element"
import {Toggleable} from "../Toggle/Toggleable"
import {VisualElement} from "../VisualElement"

const SWITCH_PROGRESSION_AUDIO_TRACK: AudioTrackAsset = requireAsset(
  "../../../Audio/SliderProgressionAudioTrack.wav"
) as AudioTrackAsset

const SWITCH_PROGRESSION_AUDIO_VOLUME: number = 1

const log = new NativeLogger("Switch")

const KNOB_Z_OFFSET: number = 0.01

const KNOB_ANIMATION_DURATION: number = 0.2

const DEFAULT_BACKGROUND_COLOR = COLORS.darkGray.uniformScale(0.66)

const DEFAULT_KNOB_COLOR = withAlpha(COLORS.lightGray.uniformScale(0.8), 1)
const DEFAULT_KNOB_HOVER = withAlpha(COLORS.lightGray.uniformScale(1.2), 1)
const DEFAULT_KNOB_ACTIVE = new vec4(0.85, 0.8, 0.5, 1)

/**
 * The `Switch` class represents a togglable switch component in the Spectacles UI Kit.
 * It extends the `VisualElement` class and implements the `Toggleable` interface.
 * This class provides functionality for managing the switch's state, appearance,
 * and interaction behavior.
 *
 * @extends VisualElement
 * @implements Toggleable
 */
@component
export class Switch extends VisualElement implements Toggleable {
  @input
  private _knobSize: vec2 = vec2.one()

  @input
  private _triggerToCycle: boolean = false

  @input
  @showIf("triggerToCycle")
  @widget(new ComboBoxWidget([new ComboBoxItem("Normal", 0), new ComboBoxItem("Reverse", 1)]))
  private _direction: number = 0

  @input("int")
  @hint("The number of states the switch can have. Must be a whole number greater than 1.")
  private _numberOfStates: number = 2

  @input("int")
  @hint("The default state of the switch. Must be a whole number between 0 and `numberOfStates - 1`.")
  private _defaultState: number = 0

  @input
  @hint("Enable this to add functions from another script to this component's callbacks")
  protected addCallbacks: boolean = false
  @input
  @showIf("addCallbacks")
  @label("On Value Changed Callbacks")
  private onValueChangedCallbacks: Callback[] = []
  @input
  @showIf("addCallbacks")
  @label("On Finished Callbacks")
  private onFinishedCallbacks: Callback[] = []

  protected override _autoHighlight: boolean = false

  private _isDraggable: boolean = true

  private _switchProgressionAudioTrack: AudioTrackAsset = SWITCH_PROGRESSION_AUDIO_TRACK
  private _swicthProgressionAudioVolume: number = SWITCH_PROGRESSION_AUDIO_VOLUME

  private readonly _trackLength: number = this.size.x - this._knobSize.x

  private _knobVisual: Visual

  private _intermediateKnobPosition: number = 0
  private _intermediateState: number = this._defaultState
  private _currentState: number = this._intermediateState
  private _knobPosition: number = this.getKnobPositionFromState(this._currentState)

  private _initialDragPosition: vec3 | null = null
  private _initialPlanecastPosition: vec3 | null = null
  private _initialCursorPosition: vec3 | null = null
  private _currentCursorPosition: vec3 | null = null

  private readonly _stateInterval = (1.0 / (this._numberOfStates - 1)) * this._trackLength

  private _updateKnobPositionCancelSet: CancelSet = new CancelSet()

  private onKnobMovedEvent: Event<number> = new Event<number>()
  public readonly onKnobMoved: PublicApi<number> = this.onKnobMovedEvent.publicApi()
  private onValueChangedEvent: Event<number> = new Event<number>()
  public readonly onValueChanged: PublicApi<number> = this.onValueChangedEvent.publicApi()
  private onFinishedEvent: Event<boolean> = new Event<boolean>()
  public readonly onFinished: PublicApi<boolean> = this.onFinishedEvent.publicApi()

  /**
   * Gets the visual representation of the switch's knob.
   *
   * @returns {Visual} The visual object representing the knob.
   */
  get knobVisual(): Visual {
    return this._knobVisual
  }

  /**
   * Sets the visual representation of the switch's knob.
   * If a previous visual exists, it will be destroyed before assigning the new one.
   *
   * @param value - The new visual to be assigned to the knob.
   */
  set knobVisual(value: Visual) {
    if (value !== this._knobVisual) {
      if (this._knobVisual) {
        this._knobVisual.destroy()
      }
      this._knobVisual = value
    }
  }

  /**
   * Gets the size of the knob.
   *
   * @returns {vec2} The size of the knob.
   */
  get knobSize(): vec2 {
    return this._knobSize
  }

  /**
   * Sets the size of the knob.
   * If the new size is different from the current size, it updates the knob size.
   *
   * @param value - The new size of the knob.
   */
  set knobSize(size: vec2) {
    if (size !== this._knobSize) {
      this._knobSize = size
      this.updateKnobSize()
      this._knobPosition = this.getKnobPositionFromState(this._currentState)
      this.updateKnobPosition(this._knobPosition)
    }
  }

  /**
   * Sets whether the component is draggable and updates the drag event handlers accordingly.
   *
   * @param value - A boolean indicating whether the component should be draggable.
   *                If `true`, drag event handlers are added; if `false`, they are removed.
   */
  set isDraggable(value: boolean) {
    if (this.isDraggable !== value) {
      this._isDraggable = value
      if (this._isDraggable) {
        log.d("Adding drag handlers")
        this.interactable.onDragStart.add(this.onInteractableDragStartHandler)
        this.interactable.onDragUpdate.add(this.onInteractableDragUpdateHandler)
        this.interactable.onDragEnd.add(this.onInteractableDragEndHandler)
      } else {
        log.d("Removing drag handlers")
        this.interactable.onDragStart.remove(this.onInteractableDragStartHandler)
        this.interactable.onDragUpdate.remove(this.onInteractableDragUpdateHandler)
        this.interactable.onDragEnd.remove(this.onInteractableDragEndHandler)
      }
    }
  }

  /**
   * Gets a value indicating whether the switch component is draggable.
   *
   * @returns {boolean} True if the switch component is draggable; otherwise, false.
   */
  get isDraggable(): boolean {
    return this._isDraggable
  }

  /**
   * Gets the current state of the switch.
   *
   * @returns {number} The current state.
   */
  get currentState(): number {
    return this._currentState
  }

  /**
   * Sets the current state of the switch.
   *
   * @param state - The new state to set. Must be a whole number between 0 and `numberOfStates - 1`.
   *
   * - If the state is less than 0 or greater than or equal to `numberOfStates`, a warning is logged and the state is not changed.
   * - If the state is not a whole number, a warning is logged and the state is not changed.
   * - If the state is already the current state, a debug message is logged and the state is not changed.
   *
   * When the state is successfully changed:
   * - The knob position is updated based on the new state.
   */
  set currentState(state: number) {
    if (state < 0 || state >= this._numberOfStates) {
      log.w(`New state ${state} should be between 0 and ${this._numberOfStates - 1}`)
      return
    }
    if (state % 1 !== 0) {
      log.w(`New state ${state} should be a whole number`)
      return
    }
    if (this._currentState === state) {
      log.d(`Switch ${this.sceneObject.name} state is already set to ${state}`)
      return
    }
    this._currentState = state
    this._knobPosition = this.getKnobPositionFromState(this._currentState)
    log.d(`switch ${this.sceneObject.name} value changed to ${this._currentState}`)
    this.updateKnobPosition(this._knobPosition, true)
    this.onValueChangedEvent.invoke(this._currentState)
    this.onFinishedEvent.invoke(true)
  }

  /**
   * Gets the current state of the switch.
   *
   * @returns {boolean} - Returns `true` if the switch's current state is not set to 0, otherwise `false`.
   */
  get isOn(): boolean {
    return this.currentState !== 0
  }

  /**
   * Sets the state of the switch to either "on" or "off".
   *
   * @param on - A boolean value indicating whether the switch should be turned on (`true`) or off (`false`).
   */
  set isOn(on: boolean) {
    this.setOn(on, false)
  }

  /**
   * Converts the current component to a toggle switch.
   * This method sets the component to cycle through two states and updates the knob position accordingly.
   */
  convertToToggle(): void {
    this._triggerToCycle = true
    this.interactable.enableInstantDrag = false
    this._numberOfStates = 2
    this._knobPosition = this.getKnobPositionFromState(this._currentState)
    this.updateKnobPosition(this._knobPosition, true)
  }

  /**
   * Toggles the switch to the on/off state.
   *
   * This method sets the current state of the switch to 1 or 0 and updates the knob position accordingly.
   * @param on - A boolean value indicating the desired toggle state.
   */
  toggle(on: boolean): void {
    this.setOn(on, true)
  }

  /**
   * Initializes the Switch component. This method sets up the visual and knob visual elements,
   * validates the default state, and ensures the component is ready for use. If the component
   * has already been initialized, it will return early.
   */
  initialize() {
    if (this._numberOfStates <= 1) {
      throw new Error(`Number of states must be a whole number greater than 1`)
    }
    if (this._defaultState < 0 || this._defaultState >= this._numberOfStates) {
      throw new Error(
        `Default state ${this._defaultState} is out of bounds for number of states ${this._numberOfStates}`
      )
    }

    super.initialize()

    this.interactable.enableInstantDrag = this.isDraggable && !this._triggerToCycle

    this._knobVisual.sceneObject.setParent(this._visual.sceneObject)
    this._visual.onDestroyed.add(() => {
      this._knobVisual = null
    })
    this._knobVisual.onDestroyed.add(() => {
      this._knobVisual = null
    })

    this.updateKnobSize()
    this.updateKnobPosition(this._knobPosition)
  }

  protected createDefaultVisual(): void {
    if (!this._visual) {
      const defaultVisual: RoundedRectangleVisual = new RoundedRectangleVisual(this.sceneObject)
      defaultVisual.baseDefaultColor = DEFAULT_BACKGROUND_COLOR
      defaultVisual.baseHoverColor = DEFAULT_BACKGROUND_COLOR
      defaultVisual.baseActiveColor = DEFAULT_BACKGROUND_COLOR
      defaultVisual.borderSize = 0.1
      defaultVisual.hasBorder = true
      this._visual = defaultVisual
    }

    if (!this._knobVisual) {
      const defaultKnobVisual: RoundedRectangleVisual = new RoundedRectangleVisual(
        global.scene.createSceneObject("SliderKnob")
      )
      defaultKnobVisual.isBaseGradient = false
      defaultKnobVisual.baseDefaultColor = DEFAULT_KNOB_COLOR
      defaultKnobVisual.baseHoverColor = DEFAULT_KNOB_HOVER
      defaultKnobVisual.baseActiveColor = DEFAULT_KNOB_ACTIVE
      defaultKnobVisual.cornerRadius = (this._visual as RoundedRectangleVisual).cornerRadius - this._visual.borderSize
      defaultKnobVisual.initialize()
      this._knobVisual = defaultKnobVisual
    }
  }

  protected setUpEventCallbacks(): void {
    if (this.addCallbacks) {
      this.onValueChanged.add(createCallbacks(this.onValueChangedCallbacks))
      this.onFinished.add(createCallbacks(this.onFinishedCallbacks))
      super.setUpEventCallbacks()
    }
  }

  protected release(): void {
    this._updateKnobPositionCancelSet.cancel()
    this._knobVisual?.destroy()
    this._knobVisual = null
    super.release()
  }

  protected onInteractableTriggered(stateEvent: StateEvent) {
    super.onInteractableTriggered(stateEvent)
    if (!this._isDragged) {
      if (this._triggerToCycle) {
        if (this._direction === 0) {
          this._currentState = (this._currentState + 1) % this._numberOfStates
        } else if (this._direction === 1) {
          this._currentState = (this._currentState - 1 + this._numberOfStates) % this._numberOfStates
        }
        this._knobPosition = this.getKnobPositionFromState(this._currentState)
        this.updateKnobPosition(this._knobPosition, true)
        log.d(`switch ${this.sceneObject.name} value changed to ${this._currentState}`)
        this.onValueChangedEvent.invoke(this._currentState)
        this.onFinishedEvent.invoke(true)
      } else {
        this._intermediateKnobPosition =
          this.getInteractionPosition(stateEvent.event?.interactor).x + this._trackLength / 2
        const triggerState = clamp(
          Math.round(this._intermediateKnobPosition / this._stateInterval),
          0,
          this._numberOfStates - 1
        )
        if (triggerState !== this._currentState) {
          this._currentState = triggerState
          this._knobPosition = this.getKnobPositionFromState(this._currentState)
          this.updateKnobPosition(this._knobPosition, true)
          log.d(`switch ${this.sceneObject.name} value changed to ${this._currentState}`)
          this.onValueChangedEvent.invoke(this._currentState)
        }
        this.onFinishedEvent.invoke(true)
      }
    }
  }

  protected onInteractableDragStart(dragEvent: DragInteractorEvent): void {
    super.onInteractableDragStart(dragEvent)
    this._initialDragPosition = this.getInteractionPosition(dragEvent.interactor)
    this._initialPlanecastPosition = dragEvent.interactor.planecastPoint
    this._initialCursorPosition = this._currentCursorPosition = SIK.CursorController.getCursorByInteractor(
      dragEvent.interactor
    ).cursorPosition
  }

  protected onInteractableDragUpdate(dragEvent: DragInteractorEvent): void {
    if (this._isDragged) {
      const initialKnobPosition =
        (this._currentState / (this._numberOfStates - 1)) * this._trackLength - this._trackLength / 2
      const currentDragPosition = this.getInteractionPosition(dragEvent.interactor)
      const dragDelta = currentDragPosition.sub(this._initialDragPosition).x
      this._intermediateKnobPosition = clamp(
        initialKnobPosition + dragDelta,
        -this._trackLength / 2,
        this._trackLength / 2
      )
      const deltaState = (this._intermediateKnobPosition - initialKnobPosition) / this._stateInterval
      const newState = clamp(this._currentState + Math.round(deltaState), 0, this._numberOfStates - 1)
      const stateChanged = newState !== this._intermediateState
      if (stateChanged) {
        this._intermediateState = newState
        this._knobPosition = this.getKnobPositionFromState(this._intermediateState)
        this.updateKnobPosition(this._knobPosition, true)
        this.playAudioTrack(this._switchProgressionAudioTrack, this._swicthProgressionAudioVolume)
        this.onValueChangedEvent.invoke(this._intermediateState)
      }

      const delta = dragEvent.interactor.planecastPoint.sub(this._initialPlanecastPosition)
      this._currentCursorPosition = this._initialCursorPosition.add(delta)
      if (this.transform.getLocalRotation().toEulerAngles().z === 0) {
        SIK.CursorController.getCursorByInteractor(dragEvent.interactor).cursorPosition = new vec3(
          this._currentCursorPosition.x,
          this._initialCursorPosition.y,
          this._currentCursorPosition.z
        )
      } else {
        SIK.CursorController.getCursorByInteractor(dragEvent.interactor).cursorPosition = new vec3(
          this._initialCursorPosition.x,
          this._currentCursorPosition.y,
          this._currentCursorPosition.z
        )
      }
    }
    super.onInteractableDragUpdate(dragEvent)
  }

  protected onInteractableDragEnd(dragEvent: DragInteractorEvent): void {
    if (this._isDragged) {
      if (dragEvent.interactor.targetHitPosition) {
        const initialKnobPosition =
          (this._currentState / (this._numberOfStates - 1)) * this._trackLength - this._trackLength / 2
        const currentDragPosition = this.getInteractionPosition(dragEvent.interactor)
        const dragDelta = currentDragPosition.sub(this._initialDragPosition).x
        this._intermediateKnobPosition = clamp(
          initialKnobPosition + dragDelta,
          -this._trackLength / 2,
          this._trackLength / 2
        )
        const deltaState = (this._intermediateKnobPosition - initialKnobPosition) / this._stateInterval
        this._intermediateState = clamp(this._currentState + Math.round(deltaState), 0, this._numberOfStates - 1)
      }
      const stateChanged = this._currentState !== this._intermediateState
      if (stateChanged) {
        this._currentState = this._intermediateState
        log.d(`switch ${this.sceneObject.name} value changed to ${this._currentState}`)
        this.onValueChangedEvent.invoke(this._currentState)
      }
      this._knobPosition = this.getKnobPositionFromState(this._currentState)
      this.updateKnobPosition(this._knobPosition, true)
      SIK.CursorController.getCursorByInteractor(dragEvent.interactor).cursorPosition = null
      this.onFinishedEvent.invoke(true)
    }
    super.onInteractableDragEnd(dragEvent)
  }

  private updateKnobPosition(value: number, shouldAnimate: boolean = false) {
    if (!this._knobVisual) {
      return
    }
    if (shouldAnimate) {
      const currentValue = this._knobVisual.transform.getLocalPosition().x
      const delta = (value - currentValue) / this._trackLength
      const duration = Math.abs(delta) * KNOB_ANIMATION_DURATION
      this._updateKnobPositionCancelSet.cancel()
      animate({
        duration: duration,
        cancelSet: this._updateKnobPositionCancelSet,
        update: (t) => {
          const knobPosX = mix(currentValue, value, t)
          this._knobVisual.transform.setLocalPosition(new vec3(knobPosX, 0, KNOB_Z_OFFSET))
          this.onKnobMovedEvent.invoke((knobPosX + this.size.x / 2) / this.size.x)
        }
      })
    } else {
      this._knobVisual.transform.setLocalPosition(new vec3(value, 0, KNOB_Z_OFFSET))
      this.onKnobMovedEvent.invoke((value + this.size.x / 2) / this.size.x)
    }
  }

  protected setState(stateName: StateName) {
    super.setState(stateName)
    this._knobVisual?.setState(stateName)
  }

  private setOn(on: boolean, explicit: boolean) {
    if (on && this._currentState === 0) {
      this._currentState = 1
      this._knobPosition = this.getKnobPositionFromState(this._currentState)
      this.updateKnobPosition(this._knobPosition, true)
      this.onValueChangedEvent.invoke(this._currentState)
      this.onFinishedEvent.invoke(explicit)
    } else if (!on && this._currentState > 0) {
      this._currentState = 0
      this._knobPosition = this.getKnobPositionFromState(this._currentState)
      this.updateKnobPosition(this._knobPosition, true)
      this.onValueChangedEvent.invoke(this._currentState)
      this.onFinishedEvent.invoke(explicit)
    }
  }

  private updateKnobSize() {
    this._knobVisual.size = this._visual.hasBorder
      ? new vec3(
          this._knobSize.x - this._visual.borderSize * 2,
          this._knobSize.y - this._visual.borderSize * 2,
          this.size.z
        )
      : new vec3(this._knobSize.x, this._knobSize.y, this.size.z)
  }

  private getKnobPositionFromState(state: number): number {
    return (state / (this._numberOfStates - 1) - 0.5) * this._trackLength
  }
}
