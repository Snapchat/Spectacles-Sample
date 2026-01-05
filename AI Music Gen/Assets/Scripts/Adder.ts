import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {SelectionController} from "./SelectionController"
@component
export class Adder extends BaseScriptComponent {
  @input
  private _adderButton: RectangleButton
  @input
  private _labelText: Text
  @input
  private _emojiDisplay: Text
  private _selectionController: SelectionController

  private _prompt: string = ""
  private _emoji: string = ""

  private onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this._adderButton.initialize()
      this._adderButton.onTriggerUp.add(() => {
        this._selectionController.addToList(this._prompt, this._emoji)
      })
    })
  }

  init(prompt: string, emoji: string) {
    this._prompt = prompt
    this._emoji = emoji
    this._labelText.text = this._prompt
    this._emojiDisplay.text = emoji
  }

  addSelectionController(selectionController: SelectionController) {
    this._selectionController = selectionController
  }
}
