import { RectangleButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton";
import { RoundButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RoundButton";
import { TextInputField } from "SpectaclesUIKit.lspkg/Scripts/Components/TextInputField/TextInputField";
import { SwitchToggleGroup } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/SwitchToggleGroup";

@component
export class HandMenuReferences extends BaseScriptComponent {
  @input
  @hint("Text input field for status text")
  textStatusInputField: TextInputField;

  @input
  @hint("Rectangle button for exiting ping connections")
  exitPingButton: RectangleButton;

  @input
  @hint("Rectangle button for interactions")
  closeButton: RoundButton;

  @input
  @hint("Rectangle button for interactions")
  updateStatusButton: RectangleButton;

  @input
  @hint("Switch toggle group for status options")
  switchToggleGroupSubStatus: SwitchToggleGroup;

  @input
  @hint("Default material for normal/denied ping state")
  pingDefaultMaterial: Material;
  
  @input
  @hint("Material for accepted ping state")
  pingAcceptedMaterial: Material;
  
  @input
  @hint("Array of scene objects with MeshRenderVisual for ping material swapping")
  pingMaterialTargets: SceneObject[] = [];

}
