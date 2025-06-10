import {LensConfig} from "SpectaclesInteractionKit.lspkg/Utils/LensConfig"
import {UpdateDispatcher} from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher"

/**
 * Activates a graphic when the users internet connection is lost.
 */
@component
export class NoInternetDisplay extends BaseScriptComponent {
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher

  @input private target: SceneObject

  private onAwake(): void {
    this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(() => {
      this.update()
    })
  }

  private update(): void {
    if (!global.deviceInfoSystem.isInternetAvailable()) {
      this.target.enabled = true
    } else {
      this.target.enabled = false
    }
  }
}
