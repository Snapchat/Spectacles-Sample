import {CancelToken, clearTimeout, setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {Tooltip} from "../Tooltip"
import {StateEvent} from "../Utility/InteractableStateMachine"
import {findAllChildComponents} from "../Utility/SceneUtilities"
import {Visual} from "../Visuals/Visual"
import {Element, StateName} from "./Element"

/**
 * This constant determines how long the user must hover or interact with an element before the tooltip appears.
 */
const TOOLTIP_ACTIVATION_DELAY = 1000 //in milliseconds

/**
 * Represents an abstract base class for visual elements in the UI framework.
 * This class extends the `Element` class and provides functionality for managing
 * a visual representation (`Visual`) and handles initialization and event binding for the visual element.
 *
 * @abstract
 */
@component
export abstract class VisualElement extends Element {
  @input
  @hint("Automatic highlight")
  protected _autoHighlight: boolean = false

  protected _visual: Visual
  protected needsUpdate: boolean = false

  private tooltip: Tooltip
  private tooltipCancelToken: CancelToken

  /**
   * Gets the associated `Visual` instance for this component.
   *
   * @returns {Visual} The `Visual` instance linked to this component.
   */
  get visual(): Visual {
    return this._visual
  }

  /**
   * Sets the visual element for this component. If a previous visual element exists,
   * it will be destroyed before assigning the new one. Ensures that the new visual
   * element is only set if it differs from the current one.
   *
   * @param value - The new `Visual` instance to be assigned.
   */
  set visual(value: Visual) {
    if (value !== this._visual) {
      if (this._visual) {
        this._visual.destroy()
      }
      this._visual = value
      this.needsUpdate = true
      // If it has been initialized, reinitialize the visual element
      // If not, it will be initialzed via Start method
      if (this.initialized) {
        this.initialize()
      }
    }
  }

  /**
   * Gets the size of the visual element.
   *
   * @returns {vec3} The size of the visual element.
   */
  get size(): vec3 {
    return this._size
  }

  /**
   * @returns current size
   */
  set size(size: vec3) {
    super.size = size
    this._visual.size = size
  }

  /**
   * Initializes the visual element and its associated properties and events.
   *
   * @override
   */
  initialize(): void {
    if (this._initialized && !this.needsUpdate) {
      return
    }

    this.createDefaultVisual()

    this._visual.autoHighlight = this._autoHighlight
    this._visual.onScaleChanged.add((scaleArgs) => {
      this.childrenContainer.getTransform().setLocalScale(scaleArgs.current)
    })
    this._visual.onPositionChanged.add((positionArgs) => {
      this.childrenContainer.getTransform().setLocalPosition(positionArgs.current)
    })
    this._visual.onDestroyed.add(() => {
      this._visual = null
    })

    this._visual.initialize()

    super.initialize()

    this._visual.sceneObject.setParent(this.sceneObject)
    this._visual.collider = this.collider

    if (!this.tooltip) {
      const tooltipComponents = findAllChildComponents(
        this.sceneObject,
        Tooltip.getTypeName() as unknown as keyof ComponentNameMap
      )
      if (tooltipComponents.length > 0) {
        this.registerTooltip(tooltipComponents[0] as Tooltip)
      }
    }

    if (this.needsUpdate) {
      this.size = this._size
      this.setState(this.stateName)
    }

    this.needsUpdate = false
  }

  /**
   * Registers a tooltip instance with the current component
   *
   * @param tooltip - The Tooltip instance to associate with this component.
   */
  registerTooltip(tooltip: Tooltip): void {
    this.tooltip = tooltip
    this.tooltip.setOn(false)
  }

  protected abstract createDefaultVisual(): void

  protected release(): void {
    this._visual?.destroy()
    super.release()
  }

  protected setState(stateName: StateName): void {
    this._visual?.setState(stateName)
    super.setState(stateName)
  }

  protected onInteractableHovered(stateEvent: StateEvent): void {
    this.setTooltipState(true)
    super.onInteractableHovered(stateEvent)
  }

  protected onInteractableToggledHovered(stateEvent: StateEvent): void {
    this.setTooltipState(true)
    super.onInteractableToggledHovered(stateEvent)
  }

  protected onInteractableDefault(stateEvent: StateEvent): void {
    this.setTooltipState(false)
    super.onInteractableDefault(stateEvent)
  }

  protected onInteractableToggledDefault(stateEvent: StateEvent): void {
    this.setTooltipState(false)
    super.onInteractableToggledDefault(stateEvent)
  }

  private setTooltipState(isOn: boolean): void {
    if (this.tooltip) {
      if (isOn) {
        this.tooltipCancelToken = setTimeout(() => {
          this.tooltip.setOn(true)
        }, TOOLTIP_ACTIVATION_DELAY)
      } else {
        clearTimeout(this.tooltipCancelToken)
      }
      this.tooltip.setOn(false)
    }
  }
}
