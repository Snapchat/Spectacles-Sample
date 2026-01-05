// The HandSynchronizationInput class serves as a component that provides
// input parameters for the HandSynchronization class
@component
export class HandSynchronizationInput extends BaseScriptComponent {
  // Input property representing the scene object to be synchronized with the hand
  @input
  readonly box: SceneObject
}
