import {ARNavigation} from "SpectaclesNavigationKit.lspkg/ARNavigationComponent/Scripts/ARNavigation"

/**
 * For indoor experiences, the {@link ARNavigation} component may be confusing before localising against the
 * the group. This script is designed to block it being turned on until that has happened.
 */
@component
export class OnlyShowArrowAfterGroupLocalization extends BaseScriptComponent {
  @input locationGroup: CustomLocationGroupComponent
  @input navigator: ARNavigation

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.start())
  }

  private start(): void {
    this.navigator.blockActivation = true
    this.navigator.setVisible(false)

    this.locationGroup.getSceneObject().children.forEach((c) => {
      const locatedAt = c.getComponent("LocatedAtComponent")
      if (!isNull(locatedAt)) {
        locatedAt.onFound.add(() => this.enableNavigator())
      }
    })
  }

  private enableNavigator(): void {
    this.navigator.blockActivation = false
  }
}
