import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {WidgetSelection, WidgetSelectionEvent} from "./WidgetSelection"

@component
export class WidgetSelectionUI extends BaseScriptComponent {
  @input
  private widgetSelections: ObjectPrefab[]
  @input
  private itemsOffset: number = 5
  @input widgetSelectionParent: SceneObject

  private onAddEvent = new Event<WidgetSelectionEvent>()
  public readonly onAdd: PublicApi<WidgetSelectionEvent> = this.onAddEvent.publicApi()

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  onStart() {
    const xStart = 0

    for (let i = 0; i < this.widgetSelections.length; i++) {
      const widgetSelection = this.widgetSelections[i].instantiate(this.widgetSelectionParent)
      const screenTransform = widgetSelection.getComponent("Component.ScreenTransform")
      screenTransform.offsets.setCenter(new vec2(xStart + this.itemsOffset * i, 0))
      const widget = widgetSelection.getComponent(WidgetSelection.getTypeName())
      widget.initialize(i)
      widget.OnSelectedEvent.add((event) => this.onSelectionTriggered(event))
      widgetSelection.enabled = true
    }
  }

  private onSelectionTriggered(event: WidgetSelectionEvent) {
    this.onAddEvent.invoke(event)
  }
}
