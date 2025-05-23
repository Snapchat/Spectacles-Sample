import SIKLogLevelProvider from "../../Providers/InteractionConfigurationProvider/SIKLogLevelProvider"
import {InteractionManager} from "../InteractionManager/InteractionManager"
import {LogLevelConfiguration} from "./LogLevelConfiguration"

const TAG = "SIKLogLevelConfiguration"

/**
 * Allows the user to select the log level filter for SIK types from a lens studio component.
 */
@component
export class SIKLogLevelConfiguration extends LogLevelConfiguration {
  // TODO: Should we rename this back to Configuration? Or keep the debug logic in InteractionManager (which isn't a component)?
  private SIKLogLevelProvider = SIKLogLevelProvider.getInstance()
  private interactionManager = InteractionManager.getInstance()

  @input
  private _debugModeEnabled: boolean = false

  onAwake() {
    this.SIKLogLevelProvider.logLevel = this.logLevelFilter
    this.createEvent("OnStartEvent").bind(() => {
      this.debugModeEnabled = this._debugModeEnabled
    })
  }

  set debugModeEnabled(enabled: boolean) {
    this._debugModeEnabled = enabled

    this.interactionManager.debugModeEnabled = enabled
  }

  get debugModeEnabled(): boolean {
    return this._debugModeEnabled
  }
}
