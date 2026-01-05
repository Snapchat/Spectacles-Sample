import {ARNavigation} from "SpectaclesNavigationKit.lspkg/ARNavigationComponent/Scripts/ARNavigation"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {CustomLocationPlacesImageDisplay} from "./CustomLocationPlacesImageDisplay"
import {delayAFrame} from "./DelayAFrame"
import {PanelManager} from "./PanelManager"

/**
 * Selects a project variant.
 */
@component
export class ProjectVariantSelector extends BaseScriptComponent {
  @input("int")
  @widget(new ComboBoxWidget([new ComboBoxItem("Indoors", 0), new ComboBoxItem("Outdoors", 1)]))
  private variantType: VariantType = VariantType.Indoors

  @input private navigationComponent: NavigationDataComponent
  @input private arNavigation: ARNavigation
  @input private panelManager: PanelManager
  @input private imageDisplay: CustomLocationPlacesImageDisplay
  @input private indoorObjects: SceneObject[] = []
  @input private outdoorObjects: SceneObject[] = []
  @input private uiRoot: SceneObject
  @input private indoorMinimapScale = 1
  @input private indoorPromptDistance = 5

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.start())
  }

  private async start(): Promise<void> {
    await delayAFrame()
    if (this.variantType === VariantType.Indoors) {
      this.initializeIndoors()
    } else {
      this.initializeOutdoors()
    }
  }

  private async initializeIndoors(): Promise<void> {
    this.uiRoot.enabled = true
    await delayAFrame()
    this.indoorObjects.forEach((e) => (e.enabled = true))
    this.panelManager.setMinimized(false)
    this.arNavigation.hereRadius = 0.5
    this.panelManager.minimizedScale = this.indoorMinimapScale
    this.imageDisplay.distanceToPrompt = this.indoorPromptDistance
  }

  private async initializeOutdoors(): Promise<void> {
    this.uiRoot.enabled = true
    await delayAFrame()
    const userPosition = this.navigationComponent.getUserPosition()
    userPosition.initializeGeoLocationUpdates(GeoLocationAccuracy.Navigation, 1.0)

    this.outdoorObjects.forEach((e) => (e.enabled = true))
    this.panelManager.setMinimized(false)
  }
}

enum VariantType {
  Indoors = 0,
  Outdoors = 1
}
