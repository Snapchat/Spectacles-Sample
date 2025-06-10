import {Place} from "SpectaclesNavigationKit.lspkg/NavigationDataComponent/Place"
import {PlacesSync} from "./PlacesSync"
import {QuestMarkerController} from "./QuestMarkerController"
import {QuestMarkerPlace} from "./QuestMarkerPlace"

/**
 * A synchronization class used to keep all {@link Place}s held in the {@link NavigationDataComponent} synchronized with a
 * {@link QuestMarkerPlace} in the {@link QuestMarkerController}.
 */
@component
export class AddPlacesToQuestMarkers extends PlacesSync<QuestMarkerPlace> {
  private tracked: QuestMarkerPlace[] = []

  @input questMarkController: QuestMarkerController

  protected override start(): void {
    super.start()
    this.navigationComponent.onNavigationStarted.add((place) => {
      this.updateQuestMarkerSelected(place)
    })
  }

  private createId(): string {
    // return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    let uuid = ""
    let currentChar
    for (currentChar = 0; currentChar < /* 36 minus four hyphens */ 32; currentChar += 1) {
      switch (currentChar) {
        case 8:
        case 20:
          uuid += "-"
          uuid += ((Math.random() * 16) | 0).toString(16)
          break
        case 12:
          uuid += "-"
          uuid += "4"
          break
        case 16:
          uuid += "-"
          uuid += ((Math.random() * 4) | 8).toString(16) // Note the difference for this position
          break
        default:
          uuid += ((Math.random() * 16) | 0).toString(16)
      }
    }
    return "area-" + uuid
  }

  protected override refresh(): void {
    this.checkAddedAndRemoved(this.tracked)
  }

  protected override add(added: Place[]): QuestMarkerPlace[] {
    const newQuestMarks = added.map((m) => {
      const questMarker = new QuestMarkerPlace(m, this.createId())
      this.questMarkController.addQuestMark(questMarker, m)
      this.tracked.push(questMarker)

      return questMarker
    })

    return newQuestMarks
  }

  protected override remove(removed: QuestMarkerPlace[]): void {
    removed.forEach((m) => {
      this.questMarkController.removeQuestMark(m)
    })
    this.tracked = this.tracked.filter((m) => !removed.includes(m))
  }

  protected override isRepresentative(exiting: QuestMarkerPlace, place: Place): boolean {
    return exiting.place === place
  }

  private updateQuestMarkerSelected(selectedPlace: Place): void {
    this.tracked.forEach((m) => {
      m.selected = this.isRepresentative(m, selectedPlace)
    })
  }
}
