import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {Singleton} from "SpectaclesInteractionKit.lspkg/Decorators/Singleton"
import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {TextInputField} from "./TextInputField"

/**
 * TextFieldInputManager helps manage functions across all TextInputFields
 * This class is created and handled automatically and dynamically
 * You should not have to add it manually
 * If you see it in the scene preview that is good!
 */
@Singleton
export class TextInputFieldManager {
  public static getInstance: () => TextInputFieldManager

  textInputFields: TextInputField[] = []
  active: Set<TextInputField> = new Set()
  recentlyClosed: boolean = false
  private fieldToInteractables: {[key: string]: Interactable} = {}
  private interactables: Set<Interactable> = new Set()
  private initialized: boolean = false

  public TextInputFieldManager() {
    if (!this.initialized) {
      this.initialize()
    }
  }

  /**
   * initialization function
   */
  initialize = () => {
    this.initialized = true
  }

  /**
   *
   * @param field add field to text manager
   */
  addField = (field: TextInputField) => {
    this.textInputFields.push(field)
    const interactable = field.interactable
    this.fieldToInteractables[field.uniqueIdentifier] = interactable
    this.interactables.add(interactable)
  }

  isRegisteredTextFieldInteractable = (interactable: Interactable): boolean => {
    return this.interactables.has(interactable)
  }

  /**
   *
   * @param field remove field from text manager
   */
  removeField = (field: TextInputField) => {
    const index = this.textInputFields.indexOf(field)
    const interactable = this.fieldToInteractables[field.uniqueIdentifier]
    this.interactables.delete(interactable)
    delete this.fieldToInteractables[field.uniqueIdentifier]
    if (index > -1) {
      this.textInputFields.splice(index, 1)
    }
  }

  /**
   * deselect all
   * @returns
   */
  deselectAll = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        for (const field of this.active.values()) {
          field.editMode(false)
        }
        this.recentlyClosed = true
        setTimeout(() => {
          this.recentlyClosed = false
        }, 750)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   *
   * @param field register this field as active
   */
  registerActive = (field: TextInputField) => {
    this.active.add(field)
  }

  /**
   *
   * @param field unregister this field as active
   */
  deregisterActive = (field: TextInputField) => {
    this.active.delete(field)
  }
}
