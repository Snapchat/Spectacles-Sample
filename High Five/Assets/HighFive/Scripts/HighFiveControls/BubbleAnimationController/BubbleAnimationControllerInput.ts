// The BubbleAnimationControllerInput class is a component that manages
// input parameters for the BubbleAnimationController
@component
export class BubbleAnimationControllerInput extends BaseScriptComponent {
  // Input properties for the components involved in the bubble animation
  @input
  readonly outerGlow: RenderMeshVisual

  @input
  readonly bubbleSphere: RenderMeshVisual

  @input
  readonly overallBubble: SceneObject

  @input
  readonly wasHighFiveText: Text

  @input
  modelRim: Material

  @input
  colorID: number = 0
}
