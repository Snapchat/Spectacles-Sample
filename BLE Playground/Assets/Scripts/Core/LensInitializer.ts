/**
 * v1.0
 * Singleton.
 * This class starts the lens.
 * Initializes BleServiceHandler and ScanResultsHandler.
 * Selecting "isNoBleDebug" will utilize the debug renderer flow through the lens, without the ble service.
 * This is useful for debugging ui/art on device when you don't have the ble devices.
 */

import {BleServiceHandler} from "./BleServiceHandler"
import {ControllerFactory} from "./ControllerFactory"
import {ScanResultsManager} from "./ScanResultsManager"

@component
export class LensInitializer extends BaseScriptComponent {
  @input
  bleServiceHandler: BleServiceHandler

  @input
  scanResultsManager: ScanResultsManager

  @input
  controllerFactory: ControllerFactory

  @input
  isNoBleDebug: boolean

  public uiState = false

  private static instance: LensInitializer

  private constructor() {
    super()
  }

  public static getInstance(): LensInitializer {
    if (!LensInitializer.instance) {
      throw new Error("Trying to get LensInitializer instance, but it hasn't been set.  You need to call it later.")
    }
    return LensInitializer.instance
  }

  onAwake() {
    if (!LensInitializer.instance) {
      LensInitializer.instance = this
    } else {
      throw new Error("LensInitializer already has an instance.  Aborting.")
    }
    this.createEvent("OnStartEvent").bind(() => this.onStart())
  }

  onStart() {
    this.scanResultsManager.init(this.bleServiceHandler, this.controllerFactory)
  }
}
