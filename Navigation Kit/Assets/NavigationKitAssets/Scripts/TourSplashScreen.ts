import {delayAFrame} from "./DelayAFrame"
import {PanelManager} from "./PanelManager"

/**
 * Shows a splash screen and initializes the scene for an indoor experience.
 */
@component
export class TourSplashScreen extends BaseScriptComponent {
  @input firstLocation: LocatedAtComponent
  @input disableOnBoot: SceneObject[]
  @input enableOnTourStart: SceneObject[]
  @input disableOnTourStart: SceneObject[]
  @input loadingIndicator: SceneObject
  @input panelManager: PanelManager

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(async () => {
      this.loadingIndicator.enabled = true

      this.disableOnBoot.forEach(async (e) => {
        await delayAFrame()
        e.enabled = false
      })

      this.firstLocation.onFound.add(async () => {
        this.enableOnTourStart.forEach((e) => (e.enabled = true))
        this.disableOnTourStart.forEach((e) => (e.enabled = false))
        await delayAFrame()
        this.panelManager.setMinimized(true, true)
      })

      this.firstLocation.onReady.add(() => {
        this.loadingIndicator.enabled = false
      })
    })
  }
}
