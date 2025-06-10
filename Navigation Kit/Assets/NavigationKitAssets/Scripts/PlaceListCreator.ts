import {ScrollView} from "SpectaclesInteractionKit.lspkg/Components/UI/ScrollView/ScrollView"
import {CancelToken, setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {CustomLocationPlacesImageDisplay} from "./CustomLocationPlacesImageDisplay"
import {PlaceListItem} from "./PlaceListItem"

/**
 * The script creates and keeps updated a list of {@link PlaceListItem}s to represent each of the {@link Place}s stored
 * in the {@link NavigationDataComponent}.
 */
@component
export class PlaceListCreator extends BaseScriptComponent {
  private spawned: PlaceListItem[] = []
  private spawnDelay: CancelToken | null = null

  @input
  private navigationComponent: NavigationDataComponent
  @input
  private itemPrefab: ObjectPrefab
  @input
  private contentRoot: SceneObject
  @input
  private scrollView: ScrollView
  @input
  @allowUndefined
  private imageDisplay: CustomLocationPlacesImageDisplay | null

  private onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.navigationComponent.onPlacesUpdated.add(() => {
        this.setDirty()
      })

      this.setDirty()
    })
  }

  private setDirty(): void {
    if (!isNull(this.spawnDelay)) {
      this.spawnDelay.cancelled = true
    }

    this.spawnDelay = setTimeout(() => {
      this.spawnList()
    }, 10)
  }

  private spawnList(): void {
    const yOffset = -5.4
    const yStart = yOffset

    this.spawned.forEach((e) => e?.sceneObject.destroy())
    this.spawned = []

    for (let i = 0; i < this.navigationComponent.places.length; i++) {
      const item = this.itemPrefab.instantiate(this.contentRoot)
      const screenTransform = item.getComponent("Component.ScreenTransform")
      screenTransform.offsets.setCenter(new vec2(0, yStart + yOffset * i))
      item.enabled = true

      const placeItem = item.getComponent(PlaceListItem.getTypeName())
      placeItem.initialize(this.navigationComponent.places[i], this.navigationComponent, this.imageDisplay)

      this.spawned.push(placeItem)
    }

    this.scrollView.recomputeBoundaries()
  }

  public setHoverOf(place: Place | null): void {
    this.spawned.forEach((s) => {
      s.hover = s.place === place
    })
  }
}
