import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { AreaSelectionButton } from "./AreaSelectionButton";
import { ContainerFrame } from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame";
import { AreaDeleteButton } from "./AreaDeleteButton";

export const NEW_AREA_NAME = "New Area";

export type AreaSelectEvent = {
  areaName: string;
  isNew: boolean;
};

export type AreaDeleteEvent = {
  areaName: string;
  isConfirmed: boolean;
};

export type AreaClearEvent = {
  isConfirmed: boolean;
};

/**
 * A simple menu to create several AreaSelectionButtons to allow user to choose between several areas (or create a new area).
 */
@component
export class AreaSelectionMenu extends BaseScriptComponent {
  private areaSelectionButtonPrefab: ObjectPrefab;
  private areaDeleteButtonPrefab: ObjectPrefab;

  private capsuleButtonMesh: RenderMesh;

  private onAreaSelectEvent: Event<AreaSelectEvent> =
    new Event<AreaSelectEvent>();
  readonly onAreaSelect: PublicApi<AreaSelectEvent> =
    this.onAreaSelectEvent.publicApi();

  private onAreaDeleteEvent: Event<AreaDeleteEvent> =
    new Event<AreaDeleteEvent>();
  readonly onAreaDelete: PublicApi<AreaDeleteEvent> =
    this.onAreaDeleteEvent.publicApi();

  private onAreaClearEvent: Event<AreaClearEvent> = new Event<AreaClearEvent>();
  readonly onAreaClear: PublicApi<AreaClearEvent> =
    this.onAreaClearEvent.publicApi();

  private container = this.sceneObject
    .getParent()
    .getParent()
    .getComponent(ContainerFrame.getTypeName());

  onAwake() {
    this.areaSelectionButtonPrefab = requireAsset(
      "Prefabs/AreaSelectionButtonPrefab"
    ) as ObjectPrefab;
    this.areaDeleteButtonPrefab = requireAsset(
      "Prefabs/AreaDeleteButtonPrefab"
    ) as ObjectPrefab;

    this.capsuleButtonMesh = requireAsset(
      "SpectaclesInteractionKit.lspkg/Assets/Meshes/ButtonCapsuleMesh"
    ) as RenderMesh;

    if (this.capsuleButtonMesh == null) {
      throw new Error(
        "capsuleButtonMesh not found at SpectaclesInteractionKit.lspkg/Assets/Meshes/ButtonCapsuleMesh"
      );
    }
  }

  /**
   * Generates AreaSelectionButtons to represent all serialized areas to allow user to load into a certain area,
   * which will also instantiate previously serialized widgets through AreaManager's callback logic for onAreaSelectEvent.
   * @param areaNames - the names of all serialized areas available to load
   */
  public promptAreaSelection(areaNames: string[]) {
    const height = 3 * (areaNames.length - 1) + 6 + 6 + 4;
    this.container.innerSize = new vec2(this.container.innerSize.x, height);

    this.selectionEnabled = true;

    areaNames.push(NEW_AREA_NAME);

    let yOffset = height / 2 - 2;
    for (const areaName of areaNames) {
      const prefab = this.areaSelectionButtonPrefab.instantiate(
        this.sceneObject
      );

      const areaSelectionButton = prefab.getComponent(
        AreaSelectionButton.getTypeName()
      );

      if (areaName === NEW_AREA_NAME) {
        yOffset -= 3;
      }

      areaSelectionButton
        .getTransform()
        .setLocalPosition(new vec3(0, yOffset, 0));

      yOffset -= 3;

      areaSelectionButton.text = areaName;

      areaSelectionButton.onSelect.add(() => {
        this.selectionEnabled = false;

        // Add an extra AreaSelectionButton for new areas.
        // TODO: Add text input to area creation.
        if (areaName === NEW_AREA_NAME) {
          this.onAreaSelectEvent.invoke({
            areaName: this.findNextAreaName(areaNames),
            isNew: true,
          });
        } else {
          this.onAreaSelectEvent.invoke({ areaName: areaName, isNew: false });
        }
      });

      const material = prefab
        .getChild(0)
        .getComponent("RenderMeshVisual")
        .mainMaterial.clone();

      if (areaName === NEW_AREA_NAME) {
        // TODO: Finalize color.
        material.mainPass.baseColor = new vec4(
          158 / 255,
          142 / 255,
          0 / 255,
          1
        );
      } else {
        const deleteButtonObject = this.areaDeleteButtonPrefab.instantiate(
          this.sceneObject
        );
        deleteButtonObject
          .getTransform()
          .setLocalPosition(new vec3(-7, yOffset + 3, 0));
        const deleteButton = deleteButtonObject.getComponent(
          AreaDeleteButton.getTypeName()
        );
        deleteButton.initialize(
          this.capsuleButtonMesh,
          areaSelectionButton.buttonMesh
        );

        let isConfirmed = false;
        deleteButton.onSelect.add(() => {
          if (isConfirmed) {
            this.onAreaDeleteEvent.invoke({
              areaName: areaName,
              isConfirmed: isConfirmed,
            });
          } else {
            this.onAreaDeleteEvent.invoke({
              areaName: areaName,
              isConfirmed: isConfirmed,
            });
            isConfirmed = true;
            deleteButton.setIsConfirming();
          }
        });
      }

      prefab.getChild(0).getComponent("RenderMeshVisual").mainMaterial =
        material;
    }

    // Add an extra AreaSelectionButton to clear all previously serialized areas, then re-prompt for area selection.
    const prefab = this.areaSelectionButtonPrefab.instantiate(this.sceneObject);
    const clearAllDataButton = prefab.getComponent(
      AreaSelectionButton.getTypeName()
    );

    clearAllDataButton.text = "Clear All Data";

    clearAllDataButton.onSelect.add(() => {
      if (clearAllDataButton.text === "Clear All Data") {
        // TODO: Add text to the central text notification.
        this.onAreaClearEvent.invoke({ isConfirmed: false });
        clearAllDataButton.text = "Confirm";
      } else {
        this.onAreaClearEvent.invoke({ isConfirmed: true });
      }
    });

    yOffset -= 3;

    clearAllDataButton.getTransform().setLocalPosition(new vec3(0, yOffset, 0));

    const material = prefab
      .getChild(0)
      .getComponent("RenderMeshVisual")
      .mainMaterial.clone();
    material.mainPass.baseColor = new vec4(168 / 255, 34 / 255, 34 / 255, 1);
    prefab.getChild(0).getComponent("RenderMeshVisual").mainMaterial = material;
  }

  public close() {
    this.selectionEnabled = false;
  }

  private set selectionEnabled(enabled: boolean) {
    if (enabled) {
      this.clearAreaSelectionButtons();
    }
    this.container.sceneObject.enabled = enabled;

    // this.sceneObject.enabled = enabled;
  }

  private clearAreaSelectionButtons() {
    const children = this.sceneObject.children;

    for (const child of children) {
      child.destroy();
    }
  }

  private findNextAreaName(areaNames: string[]): string {
    let i = 1;
    let areaName = `Area ${i}`;

    while (areaNames.includes(areaName)) {
      i++;
      areaName = `Area ${i}`;
    }

    return areaName;
  }
}
