import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"
import {PanelManager} from "./PanelManager"

/**
 * If the panel is left maximized when the user is moving, minimize it to allow for easier
 * movement.
 */
@component
export class DismissOnWalkAway extends BaseScriptComponent {
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher

  @input private user: SceneObject
  @input private mapMinimizer: PanelManager
  @input
  @hint("Distance in centimeters")
  private dismissDistance = 200
  @input
  @allowUndefined
  private radiusDisplay: SceneObject

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.radiusDisplay?.getTransform().setLocalScale(vec3.one().uniformScale(this.dismissDistance * 2))
    })
    this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(() => this.update())
  }

  private update(): void {
    if (this.mapMinimizer.isMinimized) {
      return
    }

    const currentUserPosition = this.user.getTransform().getWorldPosition()
    const panelPosition = this.mapMinimizer.getTransform().getWorldPosition()

    if (panelPosition.distance(currentUserPosition) > this.dismissDistance) {
      this.mapMinimizer.setMinimized(true)
    }
  }
}
