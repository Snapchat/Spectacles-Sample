import {BaseToggleGroup} from "./BaseToggleGroup"
import {Toggleable} from "./Toggleable"
import {ToggleSelectionColorDropdown} from "./ToggleSelectionColorDropdown"

/**
 * Represents a dropdown group of toggles where clicking the first element opens/closes the dropdown.
 *
 * @extends BaseToggleGroup
 */
@component
export class ToggleGroupSelectionColorDropdown extends BaseToggleGroup {
  @input
  private _toggles: ToggleSelectionColorDropdown[] = []

  @input
  panel: SceneObject = null

  private _isDropdownOpen: boolean = false
  private _selectedIndex: number = 0
  private _setupComplete: boolean = false

  constructor() {
    super()
    // Allow all toggles to be off to control visibility manually
    this.allowAllTogglesOff = true
  }

  get toggleables(): Toggleable[] {
    return this._toggles
  }

  /**
   * Gets the currently selected index in the dropdown
   */
  get selectedIndex(): number {
    return this._selectedIndex
  }

  /**
   * Gets whether the dropdown is currently open
   */
  get isDropdownOpen(): boolean {
    return this._isDropdownOpen
  }

  onAwake() {
    print("ToggleGroupSelectionColorDropdown onAwake called")
    super.onAwake()
    this.createEvent("OnStartEvent").bind(() => {
      print("OnStartEvent triggered")
      this.setupDropdownBehavior()
    })
  }

  private setupDropdownBehavior() {
    if (this._setupComplete) {
      print("Setup already complete, skipping")
      return
    }

    if (this._toggles.length === 0) {
      print("No toggles found in dropdown group")
      return
    }

    print("Setting up dropdown with " + this._toggles.length + " toggles")

    // Check if all toggles are initialized
    let allInitialized = true
    this._toggles.forEach((toggle, index) => {
      if (!toggle.initialized) {
        print("Toggle " + index + " not yet initialized")
        allInitialized = false
        // Wait for this toggle to initialize
        toggle.onInitialized.add(() => {
          print("Toggle " + index + " now initialized, retrying setup")
          this.setupDropdownBehavior()
        })
      }
    })

    if (!allInitialized) {
      print("Not all toggles initialized, waiting for initialization...")
      return
    }

    print("All toggles initialized, proceeding with setup")
    print("Toggles array length: " + this._toggles.length)

    // Debug: Check each toggle
    for (let i = 0; i < this._toggles.length; i++) {
      const toggle = this._toggles[i]
      if (toggle) {
        print("Toggle " + i + " exists, sceneObject: " + (toggle.sceneObject ? "YES" : "NO"))
        if (toggle.sceneObject) {
          print("Toggle " + i + " sceneObject name: " + toggle.sceneObject.name)
          print("Toggle " + i + " sceneObject enabled: " + toggle.sceneObject.enabled)
        }
      } else {
        print("Toggle " + i + " is null/undefined")
      }
    }

    this._setupComplete = true

    // Set up our custom dropdown behavior
    this._toggles.forEach((toggle, index) => {
      print("Setting up toggle " + index)

      // Make sure each toggle is converted to toggle mode
      toggle.convertToToggle()

      // Add our custom dropdown behavior
      toggle.onFinished.add((explicit: boolean) => {
        if (!explicit) return

        print("Toggle " + index + " clicked, dropdown open: " + this._isDropdownOpen)

        if (index === 0) {
          // First toggle controls dropdown open/close
          this.toggleDropdown()
        } else {
          // Other toggles select and close dropdown
          this.selectOption(index)
          this.closeDropdown()
        }
      })
    })

    // Initialize dropdown state - only first toggle visible
    print("Initializing dropdown state")
    this.closeDropdown()
  }

  private toggleDropdown() {
    print("Toggle dropdown called, current state: " + this._isDropdownOpen)
    if (this._isDropdownOpen) {
      this.closeDropdown()
    } else {
      this.openDropdown()
    }
  }

  private openDropdown() {
    this.panel.enabled = true
    print("Opening dropdown")
    print("Current toggles array length: " + this._toggles.length)
    this._isDropdownOpen = true

    // Show all toggles
    for (let i = 0; i < this._toggles.length; i++) {
      const toggle = this._toggles[i]
      print("Processing toggle index " + i + " of " + this._toggles.length)

      if (toggle) {
        print("Toggle " + i + " exists")
        if (toggle.sceneObject) {
          print("Toggle " + i + " has sceneObject, enabling it")
          toggle.sceneObject.enabled = true
          print("Enabled toggle " + i + " - sceneObject.enabled = " + toggle.sceneObject.enabled)
        } else {
          print("Toggle " + i + " has no sceneObject")
        }
      } else {
        print("Toggle " + i + " is null/undefined")
      }
    }

    print("Finished opening dropdown")
  }

  private closeDropdown() {
    this.panel.enabled = false
    print("Closing dropdown")
    print("Current toggles array length: " + this._toggles.length)
    this._isDropdownOpen = false

    // Hide all toggles except the first one
    for (let i = 0; i < this._toggles.length; i++) {
      const toggle = this._toggles[i]
      print("Processing toggle index " + i + " of " + this._toggles.length)

      if (toggle) {
        if (toggle.sceneObject) {
          if (i === 0) {
            toggle.sceneObject.enabled = true
            print("Kept toggle 0 enabled - sceneObject.enabled = " + toggle.sceneObject.enabled)
          } else {
            toggle.sceneObject.enabled = false
            print("Disabled toggle " + i + " - sceneObject.enabled = " + toggle.sceneObject.enabled)
          }
        } else {
          print("Toggle " + i + " has no sceneObject")
        }
      } else {
        print("Toggle " + i + " is null/undefined")
      }
    }

    print("Finished closing dropdown")
  }

  private selectOption(selectedIndex: number) {
    print("Selecting option " + selectedIndex)
    this._selectedIndex = selectedIndex

    // Update the first toggle's text to match the selected option
    this.updateFirstToggleText()
    print("Updated first toggle text to match selection " + selectedIndex)
  }

  private updateFirstToggleText() {
    if (this._toggles.length === 0 || this._selectedIndex >= this._toggles.length) {
      print("Cannot update text - invalid toggle array or selected index")
      return
    }

    const firstToggle = this._toggles[0]
    const selectedToggle = this._toggles[this._selectedIndex]

    // Get text content from the selected toggle
    const selectedTextContent = selectedToggle.getTextContent()
    print("Selected toggle text content: " + selectedTextContent.text1 + ", " + selectedTextContent.text2)

    // Update the first toggle with the selected text
    firstToggle.updateText(selectedTextContent.text1 || undefined, selectedTextContent.text2 || undefined)
    print("Updated first toggle text")
  }

  /**
   * Override the base class method to prevent default toggle group behavior
   */
  registerToggleable(toggleable: Toggleable, value: any = null) {
    // Don't call the parent method to avoid its event handling
    // Just store the toggleable in our array
    print("Custom registerToggleable called")
  }

  /**
   * Override the base class method to prevent default toggle group behavior
   */
  deregisterToggleable(toggleable: Toggleable) {
    // Don't call the parent method to avoid removing from our array
    print("Custom deregisterToggleable called (ignoring)")
  }
}
