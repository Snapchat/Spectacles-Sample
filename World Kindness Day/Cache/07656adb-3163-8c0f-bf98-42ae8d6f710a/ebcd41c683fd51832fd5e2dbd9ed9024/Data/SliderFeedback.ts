import {Interactable} from "../../Components/Interaction/Interactable/Interactable"
import {Slider} from "../../Components/UI/Slider/Slider"
import {validate} from "../../Utils/validate"

const SLIDER_LEVEL_MIN: number = 0.1
const SLIDER_LEVEL_MAX: number = 0.9

/**
 * This class provides visual feedback for a slider component. It manages the appearance of the slider's knob and track
 * based on interaction events and the slider's value.
 */
@component
export class SliderFeedback extends BaseScriptComponent {
  /**
   * The RenderMeshVisual component of the slider track that visualizes the slider's value. This mesh will have its
   * material's level property updated to reflect the current slider position, and its pinch property modified during
   * interaction events to provide additional visual feedback.
   */
  @input
  @hint(
    "The RenderMeshVisual component of the slider track that visualizes the slider's value. This mesh will have its \
material's level property updated to reflect the current slider position, and its pinch property modified during \
interaction events to provide additional visual feedback."
  )
  renderMeshVisual!: RenderMeshVisual

  /**
   * Reference to the SceneObject containing the slider's interactive knob. This object must have an Interactable
   * component attached to allow user interaction.
   */
  @input
  @hint(
    "Reference to the SceneObject containing the slider's interactive knob. This object must have an Interactable \
component attached to allow user interaction."
  )
  knobObject!: SceneObject

  private interactable: Interactable | null = null
  private slider: Slider | null = null
  private currentValue: number = 0

  onAwake(): void {
    this.init()
  }

  private init = (): void => {
    if (isNull(this.renderMeshVisual)) {
      throw new Error("No RenderMeshVisual component attached to this entity!")
    }

    if (isNull(this.knobObject)) {
      throw new Error("No knobObject attached to this entity!")
    }

    this.renderMeshVisual.mainMaterial = this.renderMeshVisual.getMaterial(0).clone()

    this.createEvent("OnStartEvent").bind(() => {
      this.interactable = this.knobObject.getComponent(Interactable.getTypeName())

      if (isNull(this.interactable)) {
        throw new Error("Interactable component not found in this entity!")
      }

      this.slider = this.getSceneObject().getComponent(Slider.getTypeName())

      if (isNull(this.slider)) {
        throw new Error("No Slider component attached to this entity!")
      }

      validate(this.slider)
      validate(this.renderMeshVisual)
      this.currentValue = this.slider.startValue

      this.renderMeshVisual.mainPass.level = this.getSliderLevelFromValue(this.slider.currentValue ?? 0)

      this.setupSliderCallbacks()
    })
  }

  private getSliderLevelFromValue = (value: number): number => {
    validate(this.slider)
    if (value <= this.slider.minValue) {
      return 0
    } else if (value >= this.slider.maxValue) {
      return 1
    } else {
      const progress = (value - this.slider.minValue) / (this.slider.maxValue - this.slider.minValue)
      return SLIDER_LEVEL_MIN + (SLIDER_LEVEL_MAX - SLIDER_LEVEL_MIN) * progress
    }
  }

  private setupSliderCallbacks = (): void => {
    validate(this.interactable)
    validate(this.slider)
    validate(this.renderMeshVisual)
    this.interactable.onTriggerStart.add(() => {
      this.renderMeshVisual.mainPass.pinch = 1.0
      this.renderMeshVisual.mainPass.level = this.currentValue
    })
    this.interactable.onTriggerEnd.add(() => {
      this.renderMeshVisual.mainPass.pinch = 0.0
    })
    this.interactable.onTriggerEndOutside.add(() => {
      this.renderMeshVisual.mainPass.pinch = 0.0
    })

    this.interactable.onTriggerCanceled.add(() => {
      this.renderMeshVisual.mainPass.pinch = 0.0
    })

    this.interactable.onSyncTriggerStart.add(() => {
      this.renderMeshVisual.mainPass.pinch = 1.0
      this.renderMeshVisual.mainPass.level = this.currentValue
    })
    this.interactable.onSyncTriggerEnd.add(() => {
      this.renderMeshVisual.mainPass.pinch = 0.0
    })
    this.interactable.onSyncTriggerEndOutside.add(() => {
      this.renderMeshVisual.mainPass.pinch = 0.0
    })
    this.interactable.onSyncTriggerCanceled.add(() => {
      this.renderMeshVisual.mainPass.pinch = 0.0
    })

    this.slider.onValueUpdate.add((value) => {
      this.currentValue = value
      this.renderMeshVisual.mainPass.level = this.getSliderLevelFromValue(value)
    })
  }
}
