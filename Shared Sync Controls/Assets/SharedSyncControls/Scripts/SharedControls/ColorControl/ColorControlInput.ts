import {SliderControlInput} from "./SliderControl/SliderControlInput"

// The ColorControlInput class defines the input components
// necessary for the proper functioning of the ColorControl class.
@component
export class ColorControlInput extends BaseScriptComponent {
  // Root scene object that serves as the container for the color control UI
  @input
  readonly root: SceneObject

  // RenderMeshVisual component representing the mesh of the object whose color is controlled
  @input
  readonly objectMesh: RenderMeshVisual

  // Array of SliderControlInput components used to adjust RGB color parameters
  @input
  readonly sliderControlsInput: SliderControlInput[]
}
