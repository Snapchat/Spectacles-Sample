import {InteractableOutlineFeedback} from "SpectaclesInteractionKit.lspkg/Components/Helpers/InteractableOutlineFeedback"
import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {ToggleButton} from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import {TextInputManager} from "../TextInputManager"
import {Widget} from "../Widget"

@component
export class Note extends BaseScriptComponent {
  @input private _textField: Text
  @input private _editToggle: ToggleButton
  @input private deleteButton: PinchButton
  @input private noteInteractable: Interactable
  @input private noteMesh: RenderMeshVisual
  @input
  @hint("Outline material that appears when the note is being edited")
  private editOutlineMaterial: Material

  private lastHoveredTime: number = -1
  private timeToShowButtonsAfterHover = 2
  private outlineFeedback: InteractableOutlineFeedback

  private widget: Widget
  private meshMaterial: Material

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
  }

  private onStart() {
    this.meshMaterial = this.noteMesh.mainMaterial.clone()
    this.noteMesh.mainMaterial = this.meshMaterial

    this.widget = this.sceneObject.getComponent(Widget.getTypeName())

    this.deleteButton.onButtonPinched.add(() => {
      this.widget.delete()
    })

    this.noteInteractable.onHoverUpdate.add(() => {
      this.lastHoveredTime = getTime()
    })

    this.outlineFeedback = this.sceneObject.getComponent(InteractableOutlineFeedback.getTypeName())

    this._editToggle.onStateChanged.add((isToggledOn: boolean) => {
      if (isToggledOn) {
        this.outlineFeedback.enabled = false
        this.addEditOutline()
      } else {
        this.removeEditOutline()
        this.outlineFeedback.enabled = true
      }
    })

    TextInputManager.getInstance().onKeyboardStateChanged.add((isOpen: boolean) => {
      if (!isOpen && this._editToggle.isToggledOn) {
        this._editToggle.isToggledOn = false
      }
    })
  }

  private onUpdate() {
    if (getTime() - this.timeToShowButtonsAfterHover < this.lastHoveredTime) {
      this._editToggle.getSceneObject().enabled = true
      this.deleteButton.getSceneObject().enabled = true
    } else {
      this._editToggle.getSceneObject().enabled = false
      this.deleteButton.getSceneObject().enabled = false
    }
  }

  /**
   * Set the editing state of the voice note
   * @param isEditing - the editing state
   */
  public toggleEditButton(isEditing: boolean): void {
    if (this._editToggle.isToggledOn === isEditing) {
      return
    }

    this._editToggle.toggle()
  }

  public get textField(): Text {
    return this._textField
  }

  public set textField(textField: Text) {
    this._textField = textField
  }

  public get editToggle(): ToggleButton {
    return this._editToggle
  }

  public set editToggle(editToggle: ToggleButton) {
    this._editToggle = editToggle
  }

  private addEditOutline(): void {
    const matCount = this.noteMesh.getMaterialsCount()

    let addMaterial = true
    for (let k = 0; k < matCount; k++) {
      const material = this.noteMesh.getMaterial(k)

      if (material.isSame(this.editOutlineMaterial)) {
        addMaterial = false
        break
      }
    }

    if (addMaterial) {
      const materials = this.noteMesh.materials
      materials.unshift(this.editOutlineMaterial)
      this.noteMesh.materials = materials
    }
  }

  private removeEditOutline(): void {
    const materials = []

    const matCount = this.noteMesh.getMaterialsCount()

    for (let k = 0; k < matCount; k++) {
      const material = this.noteMesh.getMaterial(k)

      if (material.isSame(this.editOutlineMaterial)) {
        continue
      }

      materials.push(material)
    }

    this.noteMesh.clearMaterials()

    for (let k = 0; k < materials.length; k++) {
      this.noteMesh.addMaterial(materials[k])
    }
  }
}
