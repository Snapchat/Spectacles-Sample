import { InteractableOutlineFeedback } from "SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableOutlineFeedback"
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event"

/**
 * A simple button using SpectaclesInteractionKit events to signal user intent to delete a certain area.
 */
@component
export class AreaDeleteButton extends BaseScriptComponent {
  @input
  private textComponent: Text
  @input
  private buttonMesh: RenderMeshVisual

  private confirmButtonMesh: RenderMesh

  private interactable: Interactable

  private isInitialized: boolean = false

  private onSelectEvent: Event<void> = new Event<void>()
  readonly onSelect: PublicApi<void> = this.onSelectEvent.publicApi()

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    )

    this.interactable.onTriggerEnd.add((event) => {
      this.onSelectEvent.invoke()
    })
  }

  /**
   * Initializes the delete button with a mesh for its confirming state and the area selection button associated with it
   * @param confirmButtonMesh - Button mesh for its confirming state
   * @param targetAreaButton - The area selection button of the same area
   */
  public initialize(
    confirmButtonMesh: RenderMesh,
    targetAreaButton: RenderMeshVisual
  ) {
    this.confirmButtonMesh = confirmButtonMesh

    const outlineFeedback = this.sceneObject.getComponent(
      InteractableOutlineFeedback.getTypeName()
    )
    outlineFeedback.meshVisuals.push(targetAreaButton)

    this.isInitialized = true
  }

  /**
   * Set the delete button to its confirming state, where the area deletion will be executed once the button is triggered again
   */
  public setIsConfirming() {
    if (!this.isInitialized) {
      throw new Error("AreaDeleteButton.initialize() haven't been called")
    }

    this.textComponent.text = "Confirm"
    this.buttonMesh.mesh = this.confirmButtonMesh
    this.buttonMesh.getTransform().setLocalScale(new vec3(0.6, 1, 1))
  }
}
