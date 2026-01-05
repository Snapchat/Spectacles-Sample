import {Slider} from "SpectaclesInteractionKit.lspkg/Components/UI/Slider/Slider"

// The SliderControlInput class defines the input components
// necessary for the proper functioning of the SliderControl class.

@component
export class SliderControlInput extends BaseScriptComponent {
  // Slider component used for user interaction to adjust one of the RGB
  // color parameters for the object whose color is being modified
  @input
  readonly slider: Slider
}
