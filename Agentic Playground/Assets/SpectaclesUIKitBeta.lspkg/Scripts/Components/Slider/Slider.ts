import {DragInteractorEvent} from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import animate, {CancelSet, mix} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {withAlpha} from "SpectaclesInteractionKit.lspkg/Utils/color"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {clamp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import {Callback, createCallbacks} from "../../Utility/SceneUtilities"
import {RoundedRectangleVisual} from "../../Visuals/RoundedRectangle/RoundedRectangleVisual"
import {COLORS, Visual} from "../../Visuals/Visual"
import {StateName} from "../Element"
import {VisualElement} from "../VisualElement"

const log = new NativeLogger("Slider")

const KNOB_Z_OFFSET: number = 0.01

const KNOB_ANIMATION_DURATION: number = 0.2

const DEFAULT_BACKGROUND_COLOR = COLORS.darkGray.uniformScale(0.66)
const DEFAULT_KNOB_COLOR = withAlpha(COLORS.lightGray.uniformScale(0.8), 1)
const DEFAULT_KNOB_HOVER = withAlpha(COLORS.lightGray.uniformScale(1.2), 1)
const DEFAULT_KNOB_ACTIVE = new vec4(0.85, 0.8, 0.5, 1)

/**
 * Represents a slider component that allows users to select a value within a specified range.
 * The slider includes a draggable knob and emits events when the value changes or interaction finishes.
 *
 * @remarks
 * - The slider's value is constrained between 0 and 1.
 * - The knob's position is updated based on the current value.
 * - The component supports animations for knob position updates.
 *
 * @extends VisualElement
 */
@component
export class Slider extends VisualElement {
  @input
  private _knobSize: vec2 = vec2.one()

  @input
  @widget(new SliderWidget(0, 1, 0.01))
  private _defaultValue: number = 0

  @input
  @hint("Enable this to add functions from another script to this component's callbacks")
  protected addCallbacks: boolean = false
  @input
  @showIf("addCallbacks")
  @label("On Value Changed Callbacks")
  private onValueChangedCallbacks: Callback[] = []
  @input
  @showIf("addCallbacks")
  @label("On Knob Moved Finished Callbacks")
  private onFinishedCallbacks: Callback[] = []
  protected override _autoHighlight: boolean = false

  private _knobVisual: Visual

  private _intermediateValue: number = this._defaultValue
  private _currentValue: number = this._intermediateValue
  private _knobPosition: number = this.getKnobPositionFromValue(this._currentValue)
  private _initialDragPosition: vec3 | null = null
  private _initialPlanecastPosition: vec3 | null = null
  private _initialCursorPosition: vec3 | null = null
  private _currentCursorPosition: vec3 | null = null

  private _updateKnobPositionCancelSet: CancelSet = new CancelSet()

  private onKnobMovedEvent: Event<number> = new Event()
  public readonly onKnobMoved: PublicApi<number> = this.onKnobMovedEvent.publicApi()
  private onValueChangedEvent: Event<number> = new Event()
  public readonly onValueChanged: PublicApi<number> = this.onValueChangedEvent.publicApi()
  private onFinishedEvent: Event<void> = new Event()
  public readonly onFinished: PublicApi<void> = this.onFinishedEvent.publicApi()

  /**
   * Gets the visual representation of the slider's knob.
   *
   * @returns {Visual} The visual object representing the knob.
   */
  get knobVisual(): Visual {
    return this._knobVisual
  }

  /**
   * Sets the visual representation of the slider's knob.
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
      this._knobPosition = this.getKnobPositionFromValue(this._currentValue)
      this.updateKnobPosition(this._knobPosition)
    }
  }

  /**
   * Gets a value indicating whether the slider component is draggable.
   *
   * @returns {boolean} always return true, as it is always draggable.
   */
  get isDraggable(): boolean {
    return true
  }

  /**
   * Gets the current value of the slider.
   *
   * @returns {number} The current value.
   */
  get currentValue(): number {
    return this._currentValue
  }

  /**
   * Sets the current value of the slider.
   *
   * @param value - The new value to set, which should be between 0 and 1.
   *
   * If the value is outside the range [0, 1], a warning is logged and the value is not set.
   * If the value is the same as the current value, a debug message is logged and the value is not set.
   * Otherwise, the current value is updated, a debug message is logged, the knob position is updated,
   * and the onValueChangedEvent is invoked.
   */
  set currentValue(value: number) {
    this.updateCurrentValue(value)
  }

  updateCurrentValue(value, shouldAnimate: boolean = false) {
    if (value < 0 || value > 1) {
      log.w(`Value ${value} should be between 0 and 1`)
      return
    }
    if (value === this._currentValue) {
      log.d(`slider ${this.sceneObject.name} value is already set to ${this._currentValue}`)
      return
    }
    this._currentValue = value
    this._knobPosition = this.getKnobPositionFromValue(this._currentValue)
    log.d(`slider ${this.sceneObject.name} value changed to ${this._currentValue}`)
    this.updateKnobPosition(this._knobPosition, shouldAnimate)
    this.onValueChangedEvent.invoke(this._currentValue)
    this.onFinishedEvent.invoke()
  }

  /**
   * Initializes the slider component. This method sets up the visual and knob visual elements
   * if they are not already defined, and ensures the default value is within the valid range.
   */
  initialize() {
    if (this._defaultValue < 0 || this._defaultValue > 1) {
      throw new Error(`Default value ${this._defaultValue} should be between 0 and 1`)
    }

    super.initialize()

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
      const currentDragPosition = this.getInteractionPosition(dragEvent.interactor)
      const dragDelta = currentDragPosition.sub(this._initialDragPosition).x
      const newValue = clamp(this._currentValue + dragDelta / (this.size.x - this._knobSize.x), 0, 1)
      const valueChanged = this._intermediateValue !== newValue
      if (valueChanged) {
        this._intermediateValue = newValue
        log.d(`slider ${this.sceneObject.name} updating to ${this._intermediateValue}`)
        this._knobPosition = this.getKnobPositionFromValue(this._intermediateValue)
        this.updateKnobPosition(this._knobPosition)
        this.onValueChangedEvent.invoke(this._intermediateValue)
      }
      if (valueChanged) {
        const delta = dragEvent.interactor.planecastPoint.sub(this._initialPlanecastPosition)
        this._currentCursorPosition = this._initialCursorPosition.add(delta)
      }
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
        const currentDragPosition = this.getInteractionPosition(dragEvent.interactor)
        const dragDelta = currentDragPosition.sub(this._initialDragPosition).x
        this._intermediateValue = clamp(this._currentValue + dragDelta / (this.size.x - this._knobSize.x), 0, 1)
      }
      const valueChanged = this._currentValue !== this._intermediateValue
      if (valueChanged) {
        this._currentValue = this._intermediateValue
        log.d(`slider ${this.sceneObject.name} value changed to ${this._currentValue}`)
        this.onValueChangedEvent.invoke(this._currentValue)
      }
      this._knobPosition = this.getKnobPositionFromValue(this._currentValue)
      this.updateKnobPosition(this._knobPosition)
      SIK.CursorController.getCursorByInteractor(dragEvent.interactor).cursorPosition = null
      this.onFinishedEvent.invoke()
    }
    super.onInteractableDragEnd(dragEvent)
  }

  private updateKnobPosition(value: number, shouldAnimate: boolean = false) {
    if (!this._knobVisual) {
      return
    }
    if (shouldAnimate) {
      const currentValue = this._knobVisual.transform.getLocalPosition().x
      const delta = value - currentValue
      const duration = Math.abs(delta) * KNOB_ANIMATION_DURATION
      this._updateKnobPositionCancelSet.cancel()
      animate({
        duration: duration,
        cancelSet: this._updateKnobPositionCancelSet,
        update: (t) => {
          const knobPositionX = mix(currentValue, value, t)
          this._knobVisual.transform.setLocalPosition(new vec3(knobPositionX, 0, KNOB_Z_OFFSET))
          const knobValue = (knobPositionX + this.size.x / 2) / this.size.x
          this.onKnobMovedEvent.invoke(knobValue)
        }
      })
    } else {
      this._knobVisual.transform.setLocalPosition(new vec3(value, 0, KNOB_Z_OFFSET))
      const knobValue = (value + this.size.x / 2) / this.size.x
      this.onKnobMovedEvent.invoke(knobValue)
    }
  }

  protected setState(stateName: StateName) {
    super.setState(stateName)
    this._knobVisual?.setState(stateName)
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

  private getKnobPositionFromValue(value: number): number {
    return (value - 0.5) * (this.size.x - this.knobSize.x)
  }
}
