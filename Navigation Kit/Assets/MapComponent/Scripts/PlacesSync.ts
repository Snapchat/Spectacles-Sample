import {NavigationDataComponent} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/NavigationDataComponent"
import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"

/**
 * Provides common functionality between classes that wish to sync {@link Place}s
 */
export abstract class PlacesSync<T> extends BaseScriptComponent {
  @input protected navigationComponent: NavigationDataComponent

  protected onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.start()
    })
  }

  protected start(): void {
    this.navigationComponent.onPlacesUpdated.add(() => {
      this.refresh()
    })
  }

  /**
   * Checks the passed list of representatives and the list of all {@link Place}s to be mapped.
   * Calls {@link added} and {@link remove} with lists of updates to be made to the synced class.
   */
  protected checkAddedAndRemoved(current: T[]): void {
    const removed: T[] = []
    const places = this.navigationComponent.places
    let added: Place[] = [...places]

    for (let i = 0; i < current.length; i++) {
      const existing = current[i]
      let found: Place = null

      for (let j = 0; j < places.length; j++) {
        if (this.isRepresentative(existing, places[j])) {
          found = places[j]
        }
      }

      if (isNull(found)) {
        removed.push(existing)
      } else {
        added = added.filter((m) => m !== found)
      }
    }

    added = added.filter((m) => !isNull(m))
    this.add(added)
    this.remove(removed)
  }

  /**
   * Called when a the list of places has been updated and the synced class will need to be refreshed.
   */
  protected abstract refresh(): void

  /**
   * Called from {@link checkAddedAndRemoved} is finished and these members are to be removed.
   */
  protected abstract remove(removed: T[]): void

  /**
   * Called from {@link checkAddedAndRemoved} is finished and these {@link Place}s should be added to the synced class.
   */
  protected abstract add(added: Place[]): T[]

  /**
   * A comparison check whether the existing class is a representative of the {@link Place} provided.
   * @remarks - Call many times, must be lightweight.
   *
   * @param exiting - An already existing member of the synced list of {@link Place} representatives.
   * @param place - The {@link Place} to be compared to.
   */
  protected abstract isRepresentative(exiting: T, place: Place): boolean
}
