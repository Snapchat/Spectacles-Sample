import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"

// The ValueControlInput class defines the input components
// necessary for the proper functioning of the ValueControl class.
@component
export class ValueControlInput extends BaseScriptComponent {
  // Root scene object that serves as the container for the value control UI
  @input
  readonly root: SceneObject

  // Text component used to display the current counter value
  @input
  readonly valueText: Text

  // PinchButton component for incrementing the counter value (value up button)
  @input
  readonly valueUpButton: PinchButton

  // PinchButton component for decrementing the counter value (value down button)
  @input
  readonly valueDownButton: PinchButton
}
