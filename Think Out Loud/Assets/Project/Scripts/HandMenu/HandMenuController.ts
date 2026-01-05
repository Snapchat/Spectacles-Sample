import {AvailabilityState} from "../HeadLabel/HeadLabelObjectController"
import {HeadLabelUpdater} from "../HeadLabel/HeadLabelUpdater"
import {PingMenu} from "../PingMenu/PingMenu"
import {HandMenuReferences} from "./HandMenuReferences"

/**
 * Controller that connects the hand menu UI to the head label system.
 * Handles user input from the hand menu and updates the head label accordingly.
 */
@component
export class HandMenuController extends BaseScriptComponent {
  @input
  @hint("Reference to the hand menu UI components")
  handMenuReferences: HandMenuReferences

  @input
  @hint("Default status messages")
  defaultStatusMessages: string[] = [
    "Ready to connect!",
    "Open for collaboration",
    "Looking for teammates",
    "Exploring ideas",
    "Building something cool"
  ]

  @input
  @hint("Sub-status options")
  subStatusOptions: string[] = ["Available", "Busy", "Away", "Do Not Disturb"]

  @input
  @hint("Reference to the ping menu")
  pingMenu: PingMenu

  private currentStatusText: string = "Hello from Spectacles!"
  private currentSubStatus: string = "Available"
  private currentAvailability: AvailabilityState = AvailabilityState.Available

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }

  onStart() {
    if (!this.handMenuReferences) {
      print(" HandMenuController: No hand menu references assigned")
      return
    }

    // Wait for HeadLabelUpdater to be available
    this.waitForHeadLabelUpdater()
  }

  private waitForHeadLabelUpdater() {
    const headLabelUpdater = HeadLabelUpdater.getInstance()

    if (!headLabelUpdater) {
      print("⏳ HandMenuController: Waiting for HeadLabelUpdater...")
      // Retry in next frame
      const retryEvent = this.createEvent("DelayedCallbackEvent")
      retryEvent.bind(() => {
        this.waitForHeadLabelUpdater()
      })
      retryEvent.reset(0.1)
      return
    }

    print(" HandMenuController: HeadLabelUpdater found, setting up...")

    // Wait for head label to be ready before setting up UI
    headLabelUpdater.onMyHeadLabelReady(() => {
      print(" HandMenuController: Head label ready, setting up UI connections")

      // Get current values from head label via manager
      const headLabelData = headLabelUpdater.getMyHeadLabelData()
      if (headLabelData) {
        this.currentStatusText = headLabelData.statusText
        this.currentSubStatus = headLabelData.subStatus
        this.currentAvailability = headLabelData.availability
      }

      this.setupUIConnections()
      this.updateUIFromCurrentState()
    })
  }

  private setupUIConnections() {
    // Connect status text input field
    if (this.handMenuReferences.textStatusInputField) {
      // Set initial text
      this.handMenuReferences.textStatusInputField.text = this.currentStatusText

      // Listen for text changes
      this.handMenuReferences.textStatusInputField.onTextChanged.add((newText: string) => {
        this.onStatusTextChanged(newText)
      })

      print(" HandMenuController: Connected status text input field")
    }

    // Connect update status button
    if (this.handMenuReferences.updateStatusButton) {
      this.handMenuReferences.updateStatusButton.onTriggerUp.add(() => {
        this.onUpdateStatusButtonPressed()
      })

      print(" HandMenuController: Connected update status button")
    }

    // Connect availability toggle group
    if (this.handMenuReferences.switchToggleGroupSubStatus) {
      // Set initial selection - turn on the appropriate toggle using the toggle() method
      const toggles = this.handMenuReferences.switchToggleGroupSubStatus.toggleables
      if (toggles && toggles.length > this.currentAvailability) {
        // Turn off all toggles first
        toggles.forEach((toggle) => (toggle.isOn = false))
        // Then turn on the correct one using toggle() method for explicit change
        toggles[this.currentAvailability].toggle(true)
      }

      // Listen for selection changes
      this.handMenuReferences.switchToggleGroupSubStatus.onToggleSelected.add((args: any) => {
        // Find index of selected toggle
        const toggles = this.handMenuReferences.switchToggleGroupSubStatus.toggleables
        const index = toggles.indexOf(args.toggleable)
        if (index !== -1) {
          this.onAvailabilityChanged(index)
        }
      })

      print(" HandMenuController: Connected availability toggle group")
    }

    // Connect close button
    if (this.handMenuReferences.closeButton) {
      this.handMenuReferences.closeButton.onTriggerUp.add(() => {
        this.onCloseButtonPressed()
      })

      print(" HandMenuController: Connected close button")
    }

    // Connect exit ping button
    if (this.handMenuReferences.exitPingButton) {
      this.handMenuReferences.exitPingButton.onTriggerUp.add(() => {
        this.onExitPingButtonPressed()
      })

      print(" HandMenuController: Connected exit ping button")
    }
  }

  private updateUIFromCurrentState() {
    // Update text input field
    if (this.handMenuReferences.textStatusInputField) {
      this.handMenuReferences.textStatusInputField.text = this.currentStatusText
    }

    // Update availability toggle
    if (this.handMenuReferences.switchToggleGroupSubStatus) {
      const toggles = this.handMenuReferences.switchToggleGroupSubStatus.toggleables
      if (toggles && toggles.length > this.currentAvailability) {
        // Turn off all toggles first
        toggles.forEach((toggle) => (toggle.isOn = false))
        // Then turn on the correct one using toggle() method for explicit change
        toggles[this.currentAvailability].toggle(true)
      }
    }
  }

  private onStatusTextChanged(newText: string) {
    if (!newText || newText.trim() === "") {
      // Use a random default message if empty
      const randomIndex = Math.floor(Math.random() * this.defaultStatusMessages.length)
      newText = this.defaultStatusMessages[randomIndex]

      // Update the input field with the default message
      if (this.handMenuReferences.textStatusInputField) {
        this.handMenuReferences.textStatusInputField.text = newText
      }
    }

    this.currentStatusText = newText
    print(` HandMenuController: Status text changed to "${newText}"`)

    // Don't update immediately - wait for update button press
  }

  private onUpdateStatusButtonPressed() {
    print(" HandMenuController: Update status button pressed")
    print(` HandMenuController: Current status text: "${this.currentStatusText}"`)
    print(` HandMenuController: Current sub-status: "${this.currentSubStatus}"`)

    const headLabelUpdater = HeadLabelUpdater.getInstance()
    if (!headLabelUpdater) {
      print(" HandMenuController: HeadLabelUpdater not available")
      this.provideFeedback("Error: System not ready")
      return
    }

    // Update head label with current values via manager
    headLabelUpdater.updateMyHeadLabelStatus(this.currentStatusText, this.currentSubStatus)

    // Provide visual feedback
    this.provideFeedback("Status Updated!")
  }

  private onAvailabilityChanged(index: number) {
    this.currentAvailability = index as AvailabilityState
    this.currentSubStatus = this.subStatusOptions[index] || "Available"

    print(` HandMenuController: Availability changed to ${this.currentSubStatus} (${index})`)

    const headLabelUpdater = HeadLabelUpdater.getInstance()
    if (!headLabelUpdater) {
      print(" HandMenuController: HeadLabelUpdater not available")
      return
    }

    // Update head label immediately for availability changes
    headLabelUpdater.updateMyHeadLabelAvailability(this.currentAvailability)
    headLabelUpdater.updateMyHeadLabelStatus(this.currentStatusText, this.currentSubStatus)

    // Provide visual feedback
    this.provideFeedback(`Status: ${this.currentSubStatus}`)
  }

  private onExitPingButtonPressed() {
    print(" HandMenuController: Exit ping button pressed")

    if (!this.pingMenu) {
      print(" HandMenuController: No ping system controller assigned")
      this.provideFeedback("Ping system not available")
      return
    }

    // Get all active ping connections and exit them
    const activeConnections = this.pingMenu.getActivePingConnections()

    if (activeConnections.length === 0) {
      this.provideFeedback("No active ping connections")
      return
    }

    // Exit all active connections
    activeConnections.forEach((userId) => {
      this.pingMenu.exitPingConnection(userId)
    })

    // Reset local head label materials to default immediately
    const headLabelUpdater = HeadLabelUpdater.getInstance()
    if (headLabelUpdater) {
      const headLabelManager = headLabelUpdater.getHeadLabelManager()
      if (headLabelManager) {
        const myHeadLabel = headLabelManager.getMyHeadLabel()
        if (myHeadLabel) {
          print(" HandMenuController: Resetting local head label material to default")
          myHeadLabel.updatePingVisual(false)
        }
      }
    }

    // Also reset hand menu ping material targets to default
    if (
      this.handMenuReferences.pingDefaultMaterial &&
      this.handMenuReferences.pingMaterialTargets &&
      this.handMenuReferences.pingMaterialTargets.length > 0
    ) {
      this.handMenuReferences.pingMaterialTargets.forEach((target, index) => {
        if (target) {
          const renderMeshVisual = target.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
          if (renderMeshVisual) {
            renderMeshVisual.mainMaterial = this.handMenuReferences.pingDefaultMaterial
            print(` HandMenuController: Reset hand menu target ${index} to default material`)
          }
        }
      })
    }

    this.provideFeedback(`Exited ${activeConnections.length} ping connection(s)`)

    print(` HandMenuController: Exited ${activeConnections.length} ping connections`)
  }

  private onCloseButtonPressed() {
    print(" HandMenuController: Close button pressed")

    // Simply disable this scene object to close the menu
    this.sceneObject.enabled = false
    print(" HandMenuController: Menu closed")
  }

  private provideFeedback(message: string) {
    print(` HandMenuController: Feedback - ${message}`)

    // Apply visual feedback material if available
    if (
      this.handMenuReferences.pingAcceptedMaterial &&
      this.handMenuReferences.pingMaterialTargets &&
      this.handMenuReferences.pingMaterialTargets.length > 0
    ) {
      let targetsUpdated = 0
      const renderMeshVisuals: RenderMeshVisual[] = []

      // Apply feedback material to all targets using RenderMeshVisual Material 1
      this.handMenuReferences.pingMaterialTargets.forEach((target, index) => {
        if (target) {
          const renderMeshVisual = target.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
          if (renderMeshVisual) {
            // Set Material 1 as shown in the screenshot
            renderMeshVisual.mainMaterial = this.handMenuReferences.pingAcceptedMaterial
            renderMeshVisuals.push(renderMeshVisual)
            targetsUpdated++
            print(` HandMenuController: Applied feedback material to target ${index} RenderMeshVisual.mainMaterial`)
          } else {
            print(` HandMenuController: Ping material target ${index} has no RenderMeshVisual component`)
          }
        } else {
          print(` HandMenuController: Ping material target ${index} is null`)
        }
      })

      // Reset to default material after a short delay (0.5 seconds)
      if (renderMeshVisuals.length > 0) {
        const resetEvent = this.createEvent("DelayedCallbackEvent")
        resetEvent.bind(() => {
          renderMeshVisuals.forEach((renderMeshVisual) => {
            if (renderMeshVisual && this.handMenuReferences.pingDefaultMaterial) {
              renderMeshVisual.mainMaterial = this.handMenuReferences.pingDefaultMaterial
            }
          })
          print(` HandMenuController: Reset ${renderMeshVisuals.length} targets to default material after feedback`)
        })
        resetEvent.reset(0.5)
      }

      print(
        ` HandMenuController: Applied feedback material to ${targetsUpdated}/${this.handMenuReferences.pingMaterialTargets.length} hand menu targets`
      )
    }

    // You could also trigger sound effects or other feedback here
  }

  /**
   * Public method to set a custom status message
   */
  public setStatusMessage(message: string) {
    this.currentStatusText = message

    if (this.handMenuReferences.textStatusInputField) {
      this.handMenuReferences.textStatusInputField.text = message
    }

    const headLabelUpdater = HeadLabelUpdater.getInstance()
    if (headLabelUpdater) {
      headLabelUpdater.updateMyHeadLabelStatus(message, this.currentSubStatus)
    }
  }

  /**
   * Public method to set availability
   */
  public setAvailability(state: AvailabilityState) {
    this.currentAvailability = state
    this.currentSubStatus = this.subStatusOptions[state] || "Available"

    if (this.handMenuReferences.switchToggleGroupSubStatus) {
      const toggles = this.handMenuReferences.switchToggleGroupSubStatus.toggleables
      if (toggles && toggles.length > state) {
        // Turn off all toggles first
        toggles.forEach((toggle) => (toggle.isOn = false))
        // Then turn on the correct one using toggle() method for explicit change
        toggles[state].toggle(true)
      }
    }

    const headLabelUpdater = HeadLabelUpdater.getInstance()
    if (headLabelUpdater) {
      headLabelUpdater.updateMyHeadLabelAvailability(state)
      headLabelUpdater.updateMyHeadLabelStatus(this.currentStatusText, this.currentSubStatus)
    }
  }
}
