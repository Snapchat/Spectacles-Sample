import {ToggleGroup} from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/ToggleGroup"

/**
 * UISectionManager - Simple script to manage UI sections with a ToggleGroup
 *
 * When a toggle is selected in the ToggleGroup, it activates the corresponding
 * section SceneObject and deactivates all others.
 *
 * Usage: Assign the ToggleGroup and an array of SceneObjects to switch between.
 */
@component
export class UISectionManager extends BaseScriptComponent {
  @input
  @hint("ToggleGroup component that controls the section switching")
  public toggleGroup: ToggleGroup

  @input
  @hint("Array of SceneObjects representing the UI sections (index matches toggle index)")
  public uiSections: SceneObject[]

  @input
  @hint("Enable debug logging")
  public enableDebugLogs: boolean = true

  @input
  @hint("Index of the default section to show on start (-1 for none)")
  @widget(new SliderWidget(-1, 10, 1))
  public defaultSectionIndex: number = 0

  onAwake() {
    this.log("UISectionManager initializing...")

    // Validate inputs
    if (!this.toggleGroup) {
      this.logError("ToggleGroup not assigned! Please assign in Inspector.")
      return
    }

    if (!this.uiSections || this.uiSections.length === 0) {
      this.logError("No UI sections assigned! Please assign SceneObjects in Inspector.")
      return
    }

    // Setup toggle group callback
    this.setupToggleGroupCallback()

    // Set default section on start
    this.createEvent("OnStartEvent").bind(() => {
      this.setDefaultSection()
    })

    this.log(`UI Section Manager configured with ${this.uiSections.length} sections`)
  }

  /**
   * Setup the ToggleGroup callback to handle section switching
   */
  private setupToggleGroupCallback() {
    if (!this.toggleGroup.onToggleSelected) {
      this.logError("ToggleGroup doesn't have onToggleSelected callback available")
      return
    }

    // Add callback for when a toggle is selected
    this.toggleGroup.onToggleSelected.add((args) => {
      this.onToggleSelected(args)
    })

    this.log("ToggleGroup callback registered successfully")
  }

  /**
   * Handle toggle selection and switch UI sections
   */
  private onToggleSelected(args: any) {
    try {
      // Get the selected toggle's index from the ToggleGroup
      const selectedIndex = this.getToggleIndex(args.toggleable)

      if (selectedIndex === -1) {
        this.logError("Could not determine selected toggle index")
        return
      }

      this.log(`Toggle ${selectedIndex} selected - switching to section ${selectedIndex}`)

      // Switch to the selected section
      this.switchToSection(selectedIndex)
    } catch (error) {
      this.logError(`Error handling toggle selection: ${error}`)
    }
  }

  /**
   * Get the index of the selected toggle from the ToggleGroup
   */
  private getToggleIndex(selectedToggleable: any): number {
    try {
      // Since we can't get the toggles array directly, we'll use the SceneObject name
      // or try to match against our expected button names
      const toggleName = selectedToggleable.sceneObject.name
      this.log(`Selected toggle name: ${toggleName}`)

      // Try to extract index from common naming patterns
      if (toggleName.includes("ButtonImageSection") || toggleName.includes("Value 0")) {
        return 0
      } else if (toggleName.includes("ButtonVideoSection") || toggleName.includes("Value 1")) {
        return 1
      } else if (toggleName.includes("ButtonAudioSection") || toggleName.includes("Value 2")) {
        return 2
      } else if (toggleName.includes("ButtonComposite") || toggleName.includes("Value 3")) {
        return 3
      } else if (
        toggleName.includes("ButtonSharing") ||
        toggleName.includes("Sharing") ||
        toggleName.includes("Value 4")
      ) {
        return 4
      }

      // Fallback: try to extract number from name
      const match = toggleName.match(/(\d+)/)
      if (match) {
        const index = parseInt(match[1])
        if (index >= 0 && index < this.uiSections.length) {
          return index
        }
      }

      // If we can't determine from name, log the issue
      this.logError(`Could not determine index from toggle name: ${toggleName}`)
      return -1
    } catch (error) {
      this.logError(`Error getting toggle index: ${error}`)
      return -1
    }
  }

  /**
   * Switch to the specified UI section
   */
  private switchToSection(sectionIndex: number) {
    // Validate section index
    if (sectionIndex < 0 || sectionIndex >= this.uiSections.length) {
      this.logError(`Invalid section index: ${sectionIndex}. Valid range: 0-${this.uiSections.length - 1}`)
      return
    }

    // Deactivate all sections first
    this.deactivateAllSections()

    // Activate the selected section
    const targetSection = this.uiSections[sectionIndex]
    if (targetSection) {
      targetSection.enabled = true
      this.log(` Section ${sectionIndex} activated: ${targetSection.name}`)
    } else {
      this.logError(`Section ${sectionIndex} is null/undefined`)
    }
  }

  /**
   * Deactivate all UI sections
   */
  private deactivateAllSections() {
    for (let i = 0; i < this.uiSections.length; i++) {
      const section = this.uiSections[i]
      if (section) {
        section.enabled = false
        this.log(`Section ${i} deactivated: ${section.name}`)
      }
    }
  }

  /**
   * Set the default section on start
   */
  private setDefaultSection() {
    if (this.defaultSectionIndex >= 0 && this.defaultSectionIndex < this.uiSections.length) {
      this.log(`Setting default section: ${this.defaultSectionIndex}`)
      this.switchToSection(this.defaultSectionIndex)
    } else {
      this.log("No default section set or invalid index - all sections deactivated")
      this.deactivateAllSections()
    }
  }

  /**
   * Public method to manually switch to a section (for external scripts)
   */
  public switchToSectionManually(sectionIndex: number) {
    this.switchToSection(sectionIndex)
  }

  /**
   * Public method to get the currently active section index
   */
  public getActiveSectionIndex(): number {
    for (let i = 0; i < this.uiSections.length; i++) {
      if (this.uiSections[i] && this.uiSections[i].enabled) {
        return i
      }
    }
    return -1 // No section active
  }

  /**
   * Public method to manually switch to a section without using toggles
   */
  public selectToggle(toggleIndex: number) {
    // Since we don't have direct access to toggle selection,
    // we'll just switch the section directly
    this.log(`Manually switching to section ${toggleIndex}`)
    this.switchToSection(toggleIndex)
  }

  /**
   * Debug: Log all sections and their current state
   */
  public debugLogSections() {
    this.log("=== UI SECTIONS DEBUG ===")
    for (let i = 0; i < this.uiSections.length; i++) {
      const section = this.uiSections[i]
      if (section) {
        this.log(`Section ${i}: ${section.name} - Enabled: ${section.enabled}`)
      } else {
        this.log(`Section ${i}: NULL/UNDEFINED`)
      }
    }
    this.log("=== END DEBUG ===")
  }

  /**
   * Logging helpers
   */
  private log(message: string) {
    if (this.enableDebugLogs) {
      print(`[UISectionManager] ${message}`)
    }
  }

  private logError(message: string) {
    print(`[UISectionManager] ERROR: ${message}`)
  }
}
