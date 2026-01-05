import {BubbleAnimationControllerInput} from "../BubbleAnimationController/BubbleAnimationControllerInput"

// The HighFiveControllerInput class is a component that provides
// input dependencies for the HighFiveController class
@component
export class HighFiveControllerInput extends BaseScriptComponent {
  // Input property representing the controller responsible for bubble animations
  @input
  readonly bubbleAnimationControllerInput: BubbleAnimationControllerInput
}
