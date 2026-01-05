import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {HandSynchronization} from "../HighFiveControls/HandSynchronization/HandSynchronization"
import {HandSynchronizationInput} from "../HighFiveControls/HandSynchronization/HandSynchronizationInput"
import {HighFiveController} from "../HighFiveControls/HighFiveController/HighFiveController"
import {HighFiveControllerInput} from "../HighFiveControls/HighFiveController/HighFiveControllerInput"
import {DataSynchronizationController} from "../HighFiveControls/SyncControls/DataSynchronizationController"

// The EntryPointMain class serves as the main entry point for
// initializing and start the synchronization and interaction processes

@component
export class EntryPointMain extends BaseScriptComponent {
  // Input for hand synchronization class
  @input
  readonly handSynchronizationInput: HandSynchronizationInput

  // Input for high-five controller class
  @input
  readonly highFiveControllerInput: HighFiveControllerInput

  // Instance of HandSynchronization, responsible for handling hand synchronization logic
  private handSynchronization: HandSynchronization

  // Instance of HighFiveController, responsible for handling high-five interactions
  private highFiveController: HighFiveController

  private dataSynchronizationController: DataSynchronizationController

  // Lifecycle method called when the component is initialized
  onAwake() {
    // Initialize instances with the provided input
    this.handSynchronization = new HandSynchronization(this.handSynchronizationInput)

    this.highFiveController = new HighFiveController(this.highFiveControllerInput)

    this.dataSynchronizationController = new DataSynchronizationController(
      this.handSynchronization,
      this.highFiveController
    )

    // Setup a callback for when the session starts in a mapped environment
    SessionController.getInstance().notifyOnStartColocated(() => {
      this.onStart()
    })
  }

  // Private method to start hands and data synchronization and high-five interactions
  private onStart() {
    this.handSynchronization.start()
    this.highFiveController.start()
    this.dataSynchronizationController.start()
  }
}
