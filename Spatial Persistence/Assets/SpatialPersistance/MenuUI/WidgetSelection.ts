import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { SnapToWorld } from "../WorldQuery/SnapToWorld";

export type WidgetSelectionEvent = {
  widgetIndex: number;
  position: vec3;
  rotation: quat;
};

@component
export class WidgetSelection extends BaseScriptComponent {
  @input
  private interactable: Interactable;

  private index: number;

  private interactableTransform: Transform;
  private cachedDragPosition: vec3;
  private cachedDragRotation: quat;

  private snapToWorld: SnapToWorld;

  private onSelectedEvent = new Event<WidgetSelectionEvent>();
  public readonly OnSelectedEvent = this.onSelectedEvent.publicApi();

  initialize(index: number) {
    this.snapToWorld = SnapToWorld.getInstance();

    this.index = index;
    this.interactableTransform = this.interactable.getTransform();

    this.interactable.onDragStart.add((eventData) => {
      this.snapToWorld.startManipulating(eventData);

      this.interactable.sceneObject.getComponent(
        Billboard.getTypeName()
      ).enabled = true;
    });

    // Had to cache the position in onDragUpdate as the ScreenTransform will enforce the layout position when onDragEnd is triggered
    this.interactable.onDragUpdate.add((eventData) => {
      this.snapToWorld.updateManipulating(eventData);

      this.cachedDragPosition = this.interactableTransform.getWorldPosition();
      this.cachedDragRotation = this.interactableTransform.getWorldRotation();
    });

    this.interactable.onDragEnd.add((eventData) => {
      let transformOnNoteInWorld = this.snapToWorld.getCurrentTransform();
      if (transformOnNoteInWorld) {
        this.cachedDragPosition = transformOnNoteInWorld.getWorldPosition();
        this.cachedDragRotation = transformOnNoteInWorld.getWorldRotation();
      }
      this.snapToWorld.endManipulating(eventData);

      this.interactable.sceneObject.getComponent(
        Billboard.getTypeName()
      ).enabled = false;
      this.interactable.sceneObject
        .getTransform()
        .setLocalRotation(quat.fromEulerAngles(0, 0, 0));
      this.onSelectedEvent.invoke({
        widgetIndex: this.index,
        position: this.cachedDragPosition,
        rotation: this.cachedDragRotation,
      });
    });
  }
}
