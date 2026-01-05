import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {ColorControl} from "../SharedControls/ColorControl/ColorControl"
import {ColorControlInput} from "../SharedControls/ColorControl/ColorControlInput"
import {DataSynchronizationController} from "../SharedControls/SyncControls/DataSynchronizationController"
import {ValueControl} from "../SharedControls/ValueControl/ValueControl"
import {ValueControlInput} from "../SharedControls/ValueControl/ValueControlInput"

// The EntryPointMain class is responsible for initializing and managing color and value controls,
// as well as synchronizing data between these controls in an interactive scene environment.
@component
export class EntryPointMain extends BaseScriptComponent {
  // Input for color control class
  @input
  readonly colorControlInput: ColorControlInput

  // Input for value control class
  @input
  readonly valueControlInput: ValueControlInput

  // Instance of ColorControl, responsible for managing color-related interactions
  private colorControl: ColorControl

  // Instance of ValueControl, responsible for managing value-related interactions
  private valueControl: ValueControl

  private dataSynchronizationController: DataSynchronizationController

  // Lifecycle method called when the component is initialized
  onAwake() {
    // Initialize instances with the provided input
    this.colorControl = new ColorControl(this.colorControlInput)

    this.valueControl = new ValueControl(this.valueControlInput)

    this.dataSynchronizationController = new DataSynchronizationController(this.colorControl, this.valueControl)

    // Set up a callback to handle when the session is ready (user has connected to the session,
    // and the environment has been successfully mapped)
    SessionController.getInstance().notifyOnReady(() => {
      this.onStart()
    })
  }

  // Private method to start the color and value controls and their synchronization
  private onStart() {
    this.colorControl.start()
    this.valueControl.start()
    this.dataSynchronizationController.start()
  }
}
