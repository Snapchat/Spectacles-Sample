require("LensStudio:TextInputModule");

import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class TextInputManager extends BaseScriptComponent {
  private static instance: TextInputManager;

  private options: TextInputSystem.KeyboardOptions;
  private currentTextTarget: Text | null = null;

  private onKeyboardStateChangedEvent = new Event<boolean>();
  public onKeyboardStateChanged: PublicApi<boolean> =
    this.onKeyboardStateChangedEvent.publicApi();

  static getInstance(): TextInputManager {
    if (this.instance) {
      return this.instance;
    } else {
      throw new Error(
        "TextInputManager instance not initialized. Please ensure it is added to a scene object."
      );
    }
  }

  onAwake() {
    this.options = new TextInputSystem.KeyboardOptions();
    this.options.enablePreview = false;
    this.options.keyboardType = TextInputSystem.KeyboardType.Text;
    this.options.returnKeyType = TextInputSystem.ReturnKeyType.Done;
    this.options.onTextChanged = (text: string, _: vec2) => {
      if (this.currentTextTarget !== null) {
        this.currentTextTarget.text = text;
      }
    };
    this.options.onReturnKeyPressed = () => {
      if (this.currentTextTarget !== null) {
        global.textInputSystem.dismissKeyboard();
      }
    };
    this.options.onKeyboardStateChanged = (isOpen: boolean) => {
      if (!isOpen) {
        this.currentTextTarget = null;
      }

      this.onKeyboardStateChangedEvent.invoke(isOpen);
    };

    TextInputManager.instance = this;
  }

  registerTextInput(toggle: ToggleButton, text: Text): void {
    toggle.onStateChanged.add((isToggledOn: boolean) => {
      if (isToggledOn) {
        this.currentTextTarget = text;
        print("Requesting keyboard... ");
        global.textInputSystem.requestKeyboard(this.options);
      } else {
        global.textInputSystem.dismissKeyboard();
      }
    });
  }
}
