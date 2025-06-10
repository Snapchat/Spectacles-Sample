import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import { TransformFollower } from "./TransformFollower"

/**
 * A simple button using SpectaclesInteractionKit events to signal user intent to select a certain area and load serialized content.
 */
@component
export class ToggleMenuButton extends BaseScriptComponent {
  private toggleButton = this.sceneObject.getComponent(
    ToggleButton.getTypeName()
  )

  private interactable = this.sceneObject.getComponent(
    Interactable.getTypeName()
  )

  private visuals: RenderMeshVisual[]

  private transformFollower: TransformFollower

  private targetMenu: SceneObject

  public onStateChanged

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    this.onStateChanged = this.toggleButton.onStateChanged
    this.toggleButton.onStateChanged.add(this.handleStateChanged.bind(this))

    this.visuals = [
      this.sceneObject.getChild(0).getComponent("Component.RenderMeshVisual"),
      this.sceneObject.getChild(1).getComponent("Component.RenderMeshVisual"),
    ]

    this.interactable.onHoverEnter.add(() => {
      this.visuals[0].mainMaterial.mainPass.hovered = 1
      this.visuals[1].mainMaterial.mainPass.hovered = 1
    })
    this.interactable.onHoverExit.add(() => {
      this.visuals[0].mainMaterial.mainPass.hovered = 0
      this.visuals[1].mainMaterial.mainPass.hovered = 0
    })

    this.transformFollower = this.sceneObject.getComponent(
      TransformFollower.getTypeName()
    )
  }

  private handleStateChanged(isToggledOn: boolean) {
    if (this.targetMenu == null) {
      return
    }

    this.targetMenu.enabled = isToggledOn
  }

  public setTargetMenu(targetMenu: SceneObject) {
    this.targetMenu = targetMenu
  }

  public setFollowTarget(
    followTarget: Transform,
    translationOffset: vec3,
    rotationOffset: quat
  ) {
    this.transformFollower.setTarget(
      followTarget,
      translationOffset,
      rotationOffset
    )
  }
}
