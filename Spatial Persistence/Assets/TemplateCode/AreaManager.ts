import { unsubscribe } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { AreaPromptButton } from "./MenuUI/AreaPromptButton";
import { AreaSelectionMenu } from "./MenuUI/AreaSelectionMenu";
import { Widget } from "./Widget";
import { SerializationManager } from "./Serialization/SerializationManager";
import { AnchorManager } from "./SpatialPersistence/AnchorManager";
import {
  CancelToken,
  setTimeout,
} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { LoggerVisualization } from "SpatialAnchors.lspkg/SpatialPersistence/Logging";
import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation";
import { Anchor } from "SpatialAnchors.lspkg/Anchor";
import { AnchorComponent } from "SpatialAnchors.lspkg/AnchorComponent";
import { WidgetSelectionUI } from "./MenuUI/WidgetSelectionUI";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import {
  RecoverState,
  RecoverWidgetButton,
} from "./MenuUI/RecoverWidgetButton";
import { ToggleMenuButton } from "./MenuUI/ToggleMenuButton";
import { WidgetSelectionEvent } from "./MenuUI/WidgetSelection";
import { Note } from "./Notes/Note";
import { TextInputManager } from "./TextInputManager";

const CAMERA_GAZE_OFFSET_FACTOR = 60;

const LOCALIZATION_TIMEOUT_MS = 15000;

const WIDGET_PARENT_MESH_VISUAL_INDEX = 0;

const TOGGLE_MENU_BUTTON_AREA_SELECTION_POSITION = new vec3(8.7, 7, -1);
const TOGGLE_MENU_BUTTON_WIDGET_SELECTION_POSITION = new vec3(
  11.641,
  10.6958,
  -1
);

// Instruction strings
const LOCALIZATION_STRING = "Look and move around to help recognize the area.";
const CLEAR_ALL_AREAS_CONFIRMATION_STRING =
  "Please confirm to clear all areas from storage. Otherwise, select an area to load.";
const CLEAR_AREA_CONFIRMATION_STRING =
  "Please confirm to clear this area from storage. Otherwise, select an area to load.";
const RECOVERY_STRING =
  "Localization failed. Select the Recover button to begin the recovery process.";
const PLACE_ANCHOR_STRING =
  "Adjust Anchor to move widgets to their original location in the real world.";

class AreaRecord {
  public name: string;
  public id: string;
}

@component
export class AreaManager extends BaseScriptComponent {
  // Note UI Components
  @input
  private widgetSelectionUI: WidgetSelectionUI;
  @input
  private lockWidgetButton: RecoverWidgetButton;
  @input
  private areaPromptButton: AreaPromptButton;
  @input
  private areaSelectionMenu: AreaSelectionMenu;
  @input
  private toggleMenuButton: ToggleMenuButton;

  @input
  private widgetParent: SceneObject;

  @input
  private widgetPrefabs: ObjectPrefab[];

  @input
  private instructionText: Text;

  @input
  private textInputManager: TextInputManager;

  private widgets: Widget[] = [];

  // Current area selected by menu.
  private currentArea: AreaRecord;

  // All anchor logic is contianed within AnchorManager, AreaManager should only see the Anchor itself.
  private anchorManager: AnchorManager = AnchorManager.getInstance();

  private areaAnchor: Anchor;

  // Unsubscribe and cancel tokens for recovery callbacks (disable when finding anchor properly).
  private onAreaAnchorFoundUnsubscribe: unsubscribe;
  private areaAnchorFailureCancelToken: CancelToken;

  // All serialization handled here.
  private serializationManager: SerializationManager =
    SerializationManager.getInstance();

  // Use world camera for placing the object in front of the user's gaze.
  private cameraTransform =
    WorldCameraFinderProvider.getInstance().getTransform();

  private logger = LoggerVisualization.createLogger("AreaManager");
  private log = this.logger.log.bind(this.logger);

  private instructionTextSceneObject: SceneObject;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.instructionTextSceneObject = this.instructionText.sceneObject
      .getParent()
      .getParent();

    // Button events
    this.widgetSelectionUI.onAdd.add(this.addWidget.bind(this));
    this.lockWidgetButton.onRecover.add((event) => {
      if (event.state === RecoverState.Recover) {
        // When recovering an area, reset then create a new area anchor
        const offset = this.cameraTransform.back.uniformScale(
          CAMERA_GAZE_OFFSET_FACTOR
        );
        const position = this.cameraTransform.getWorldPosition().add(offset);
        const rotation = quat.lookAt(vec3.forward(), vec3.up());

        // The onAreaAnchorFound event should already be set up, no need to set up again.
        this.lockWidgetButton.recoverState = RecoverState.Save;
        this.recoveryMenuEnabled = false;

        this.setInstructionTextContent(
          "Look and move around to help recognize the area."
        );

        this.anchorManager.resetArea().then(() => {
          this.anchorManager.createAreaAnchor(position, rotation);
        });
      } else if (event.state === RecoverState.Save) {
        this.lockWidgetButton.recoverState = RecoverState.Recover;
        this.recoveryMenuEnabled = false;
        this.lockWidgetParent(true);
      }
    });

    this.areaPromptButton.onPrompt.add(() => {
      this.promptAreaSelection();
    });

    // Area UI Events
    this.areaSelectionMenu.onAreaSelect((event) => {
      this.selectArea(event.areaName, event.isNew);
    });
    this.areaSelectionMenu.onAreaDelete((event) => {
      if (event.isConfirmed) {
        this.setInstructionTextContent(null);
        this.serializationManager.deleteArea(event.areaName);
        this.promptAreaSelection();
      } else {
        this.setInstructionTextContent(CLEAR_AREA_CONFIRMATION_STRING);
      }
    });
    this.areaSelectionMenu.onAreaClear.add((event) => {
      if (event.isConfirmed) {
        this.setInstructionTextContent(null);
        this.serializationManager.clearAllData();
        this.promptAreaSelection();
      } else {
        this.setInstructionTextContent(CLEAR_ALL_AREAS_CONFIRMATION_STRING);
      }
    });

    this.toggleMenuButton.setTargetMenu(
      this.widgetSelectionUI.sceneObject.getParent().getParent().getParent()
    );

    this.widgetParent
      .getComponent(InteractableManipulation.getTypeName())
      .onManipulationStart.add(() => {
        this.widgetParent.getComponent(AnchorComponent.getTypeName()).enabled =
          false;
      });

    this.widgetParent
      .getComponent(InteractableManipulation.getTypeName())
      .onManipulationEnd.add(() => {
        if (global.deviceInfoSystem.isEditor()) {
          return;
        }

        // TODO: Investigate why sometimes anchor snaps back, for now, only use anchor component on initial frames.
        this.anchorManager
          .updateAreaAnchor(
            this.widgetParent.getTransform().getWorldPosition(),
            this.widgetParent.getTransform().getWorldRotation()
          )
          .then(() => {
            this.widgetParent.getComponent(
              AnchorComponent.getTypeName()
            ).enabled = false;
          });
      });

    // Hide the parent manipulation widget until anchor is ready.
    this.widgetParent.getComponent(Interactable.getTypeName()).enabled = false;
    this.widgetParent.getChild(WIDGET_PARENT_MESH_VISUAL_INDEX).enabled = false;

    // Immediately prompt user to select an area.
    this.promptAreaSelection();

    this.textInputManager.onKeyboardStateChanged.add((isOpen: boolean) => {
      if (!isOpen) {
        this.saveWidgets();
      }
    });
  }

  // Show/hide Note UI buttons.
  private set widgetMenuEnabled(enabled: boolean) {
    this.areaPromptButton.sceneObject.getParent().getParent().enabled = enabled;

    if (enabled === true) {
      this.toggleMenuButton.setFollowTarget(
        this.widgetSelectionUI.sceneObject.getParent().getTransform(),
        TOGGLE_MENU_BUTTON_WIDGET_SELECTION_POSITION,
        quat.quatIdentity()
      );
    }
  }

  private set recoveryMenuEnabled(enabled: boolean) {
    this.lockWidgetButton.sceneObject.getParent().getParent().enabled = enabled;
  }

  private spawnWidget(
    prefabIndex: number,
    widgetIndex: number,
    localPosition: vec3,
    localRotation: quat
  ): SceneObject {
    // Change to use mesh array instead?
    const objectPrefab = this.widgetPrefabs[prefabIndex];

    this.log(
      "Spawning new widget at position: " +
        localPosition +
        "w/ index:" +
        prefabIndex
    );

    const widgetObject = objectPrefab.instantiate(this.widgetParent);
    const transform = widgetObject.getTransform();

    // Place the widget in front of gaze.
    transform.setLocalTransform(
      mat4.compose(localPosition, localRotation, vec3.one())
    );

    const widget = widgetObject.getComponent(Widget.getTypeName());
    widget.prefabIndex = prefabIndex;
    widget.widgetIndex = widgetIndex;
    widget.onDelete.add((index) => {
      this.deleteWidget(widget);
    });
    widget.onUpdateContent.add(() => {
      this.saveWidgets();
    });
    this.widgets.push(widget);

    const manipulationComponent: InteractableManipulation =
      widgetObject.getComponent(InteractableManipulation.getTypeName());

    manipulationComponent.onManipulationEnd.add(() => {
      this.saveWidgets();
    });

    const noteComponent = widgetObject.getComponent(Note.getTypeName());

    this.textInputManager.registerTextInput(
      noteComponent.editToggle,
      noteComponent.textField
    );

    return widgetObject;
  }

  // Create a note instance in front of the user.
  private addWidget(event: WidgetSelectionEvent) {
    if (this.areaAnchor !== undefined || global.deviceInfoSystem.isEditor()) {
      const invertedWorldTransform = this.widgetParent
        .getTransform()
        .getInvertedWorldTransform();
      this.spawnWidget(
        event.widgetIndex,
        this.widgets.length,
        invertedWorldTransform.multiplyPoint(event.position),
        this.widgetParent
          .getTransform()
          .getWorldRotation()
          .invert()
          .multiply(event.rotation)
      );

      this.toggleOffAllVoiceNotes();

      this.saveWidgets();
    }
  }

  // Serialize the local transform of the notes relative to the parent SceneObject w/ AnchorComponent.
  private saveWidgets() {
    const widgetMats: mat3[] = [];
    const widgetTexts: string[] = [];
    const widgetMeshIndices: number[] = [];

    for (const widget of this.widgets) {
      const transform = widget.transform;

      const widgetPosition = transform.getLocalPosition();
      const widgetRotation = transform.getLocalRotation().toEulerAngles();
      const widgetScale = transform.getLocalScale();

      const widgetMat = new mat3();
      widgetMat.column0 = widgetPosition;
      widgetMat.column1 = widgetRotation;
      widgetMat.column2 = widgetScale;

      const widgetText = widget.text;

      this.log(
        `saveWidgets with positions:${widgetPosition} and text:${widgetText}`
      );

      widgetMats.push(widgetMat);
      widgetTexts.push(widgetText);
      widgetMeshIndices.push(widget.prefabIndex);
    }

    this.serializationManager.saveNotes(
      this.currentArea.name,
      widgetMats,
      widgetTexts,
      widgetMeshIndices
    );
  }

  private restoreWidgets() {
    this.clearWidgets();

    const serializedWidgetData = this.serializationManager.loadNotes(
      this.currentArea.name
    );
    const widgetMats = serializedWidgetData[0];
    const widgetTexts = serializedWidgetData[1];
    const widgetMeshIndices = serializedWidgetData[2];

    if (widgetMats.length !== widgetTexts.length) {
      // This shouldn't ever happen unless the storage is full.
      throw new Error(
        "Invalid persistent storage state for widget serialization."
      );
    }

    const numWidgets = widgetMats.length;

    for (let i = 0; i < numWidgets; i++) {
      const widgetObject = this.spawnWidget(
        widgetMeshIndices[i],
        i,
        widgetMats[i].column0,
        quat.fromEulerVec(widgetMats[i].column1)
      );

      const widget = widgetObject.getComponent(Widget.getTypeName());
      widget.transform.setLocalScale(widgetMats[i].column2);
      widget.text = widgetTexts[i];
    }
  }

  private clearWidgets() {
    if (this.areaAnchor !== undefined) {
      for (const widget of this.widgets) {
        widget.sceneObject.destroy();
      }

      this.widgets = [];
    }
  }

  private lockWidgetParent(isLocked: boolean) {
    this.widgetParent.getComponent(Interactable.getTypeName()).enabled =
      !isLocked;
    this.widgetParent.getChild(WIDGET_PARENT_MESH_VISUAL_INDEX).enabled =
      !isLocked;

    if (isLocked) {
      this.setInstructionTextContent(null);
    } else {
      this.setInstructionTextContent(PLACE_ANCHOR_STRING);
    }
  }

  // Show the Area UI and hide the note UI.
  private promptAreaSelection() {
    this.clearWidgets();
    this.lockWidgetParent(true);
    this.widgetMenuEnabled = false;
    this.recoveryMenuEnabled = false;
    this.areaAnchor = undefined;

    const areas = this.serializationManager.loadAreas();
    let areaNames = Object.keys(areas);
    // TODO: Check if actually want to sort this or just have the list sorted by creation order.
    // Won't actually be a relevant issue once we add text input for area selection.
    areaNames.sort();
    this.areaSelectionMenu.promptAreaSelection(areaNames);

    this.toggleMenuButton.setFollowTarget(
      this.areaSelectionMenu.sceneObject.getParent().getTransform(),
      new vec3(
        TOGGLE_MENU_BUTTON_AREA_SELECTION_POSITION.x,
        TOGGLE_MENU_BUTTON_AREA_SELECTION_POSITION.y + areaNames.length * 1.3,
        TOGGLE_MENU_BUTTON_AREA_SELECTION_POSITION.z
      ),
      quat.quatIdentity()
    );
  }

  // Send a request to the AnchorManager to create/find the new area anchor, prepare callback events.
  private selectArea(areaName: string, isNew: boolean) {
    let area: AreaRecord = new AreaRecord();
    area.name = areaName;
    if (isNew) {
      area.id = createAreaId();
    } else {
      area.id = this.serializationManager.loadAreas()[areaName];
    }
    this.currentArea = area;

    this.setInstructionTextContent(LOCALIZATION_STRING);

    this.anchorManager.selectArea(this.currentArea.id, () => {
      this.createAndFollowAnchor(isNew);
    });

    this.toggleMenuButton.sceneObject.enabled = false;
  }

  private createAndFollowAnchor(isNew: boolean) {
    // Create new area anchor based on user's current gaze.
    if (isNew) {
      const offset = this.cameraTransform.back.uniformScale(
        CAMERA_GAZE_OFFSET_FACTOR
      );
      const position = this.cameraTransform.getWorldPosition().add(offset);
      const rotation = quat.lookAt(vec3.forward(), vec3.up());
      this.anchorManager.createAreaAnchor(position, rotation);
    }

    // If we somehow try to switch areas before finding the anchor, make sure to clean up events.
    if (this.onAreaAnchorFoundUnsubscribe !== undefined) {
      this.onAreaAnchorFoundUnsubscribe();
    }
    this.onAreaAnchorFoundUnsubscribe =
      this.anchorManager.onAreaAnchorFound.add((anchor) => {
        this.onAreaAnchorFound(anchor);
      });
    if (!isNew) {
      // Start the recovery timer.
      this.areaAnchorFailureCancelToken = setTimeout(() => {
        this.promptRecovery();
      }, LOCALIZATION_TIMEOUT_MS);
    }
    // Serialize the areas to ensure notes stay in their area.
    const serializedAreas = this.serializationManager.loadAreas();
    if (!(this.currentArea.name in serializedAreas)) {
      serializedAreas[this.currentArea.name] = this.currentArea.id;
      this.serializationManager.saveAreas(serializedAreas);
    }

    if (global.deviceInfoSystem.isEditor() === true) {
      this.widgetMenuEnabled = true;
      this.widgetParent.enabled = true;
    }
  }

  private recoverArea() {
    this.lockWidgetButton.recoverState = RecoverState.Recover;
    this.recoveryMenuEnabled = true;

    this.setInstructionTextContent(RECOVERY_STRING);
  }

  // Initialize the world around the anchor.
  private onAreaAnchorFound(anchor: Anchor) {
    if (this.onAreaAnchorFoundUnsubscribe !== undefined) {
      this.onAreaAnchorFoundUnsubscribe();
    }
    if (this.areaAnchorFailureCancelToken !== undefined) {
      this.areaAnchorFailureCancelToken.cancelled = true;
    }

    this.setInstructionTextContent(null);

    this.log(
      `AreaManager: areaAnchor found w/ transform: ${anchor.toWorldFromAnchor}`
    );

    this.areaAnchor = anchor;

    this.log("Loaded mono-anchor" + anchor.id);

    // If we are loading from a recovery state, show the widget parent for adjustment.
    if (this.lockWidgetButton.recoverState === RecoverState.Save) {
      this.lockWidgetParent(false);
      this.recoveryMenuEnabled = true;

      this.setInstructionTextContent(null);
    } else {
      this.lockWidgetParent(true);
    }

    const anchorComponent = this.widgetParent.getComponent(
      AnchorComponent.getTypeName()
    );

    anchorComponent.anchor = anchor;
    // anchorComponent.enabled = false;

    // // For now, don't actually track anchor transform besides when setting up scene.
    // this.widgetParent
    //   .getTransform()
    //   .setWorldTransform(anchor.toWorldFromAnchor);

    // Instantiate the notes now that the area is ready + enable Note UI.
    this.restoreWidgets();
    this.widgetMenuEnabled = true;

    this.instructionTextSceneObject.enabled = false;

    this.toggleMenuButton.sceneObject.enabled = true;
  }

  private setInstructionTextContent(text: string | null) {
    const isNull = text === null;

    if (isNull) {
      this.instructionTextSceneObject.enabled = false;
      return;
    }

    this.instructionText.text = text;
    this.instructionTextSceneObject.enabled = true;
  }

  private promptRecovery() {
    this.areaAnchorFailureCancelToken = undefined;

    // Enter recovery mode for the area.
    this.recoverArea();
  }

  private toggleOffAllVoiceNotes(indexToExclude: number = -1): void {
    for (let index = 0; index < this.widgets.length; index++) {
      if (indexToExclude === index) {
        continue;
      }

      const voiceNoteComponent = this.widgets[index].sceneObject.getComponent(
        Note.getTypeName()
      );

      if (voiceNoteComponent == null) {
        continue;
      }

      voiceNoteComponent.toggleEditButton(false);
    }
  }

  /**
   * Delete a widget with the specified index
   * @param index - index of the widget that was assigned when it is spawned
   */
  public deleteWidget(widget: Widget) {
    if (this.areaAnchor !== undefined || global.deviceInfoSystem.isEditor()) {
      this.widgets.splice(this.widgets.indexOf(widget));

      widget.sceneObject.destroy();

      this.saveWidgets();
    }
  }
}

function createAreaId(): string {
  // return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  let uuid = "";
  let currentChar;
  for (
    currentChar = 0;
    currentChar < /* 36 minus four hyphens */ 32;
    currentChar += 1
  ) {
    switch (currentChar) {
      case 8:
      case 20:
        uuid += "-";
        uuid += ((Math.random() * 16) | 0).toString(16);
        break;
      case 12:
        uuid += "-";
        uuid += "4";
        break;
      case 16:
        uuid += "-";
        uuid += ((Math.random() * 4) | 8).toString(16); // Note the difference for this position
        break;
      default:
        uuid += ((Math.random() * 16) | 0).toString(16);
    }
  }
  return "area-" + uuid;
}
