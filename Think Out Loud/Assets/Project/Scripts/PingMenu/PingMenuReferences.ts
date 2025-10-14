import { RectangleButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton";

@component
export class PingMenuReferences extends BaseScriptComponent {

  @input
  @hint("Rectangle button for accepting ping requests")
  acceptButton: RectangleButton;

  @input
  @hint("Rectangle button for rejecting ping requests") 
  rejectButton: RectangleButton;
  
  @input
  @hint("Text component showing who is pinging")
  pingerNameText: Text;
}
