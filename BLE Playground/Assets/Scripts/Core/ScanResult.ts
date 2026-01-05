/**
 * v1.0
 * This script displays and controls scan result status, connection state,
 * and widget state (if applicable)
 */

import {ToggleButton} from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import {Colors} from "../Helpers/Colors"
import {reportError} from "../Helpers/ErrorUtils"
import {Logger} from "../Helpers/Logger"
import {RotateScreenTransform} from "../Helpers/RotateScreenTransform"
import {BleServiceHandler} from "./BleServiceHandler"
import {ControllerFactory} from "./ControllerFactory"
import {LensInitializer} from "./LensInitializer"
import {ScanResultsManager} from "./ScanResultsManager"
import {Widget} from "./Widget"

enum ScanResultState {
  Idle = "idle", // We are not active
  ScanSuccess = "scan success", // We were seen in the scan
  Connecting = "connecting", // We are trying to connect to the ble device
  ConnectionSuccess = "connection success", // We connected
  ConnectionFailure = "connection failure", // We tried to connect, but failed
  Disconnected = "disconnection" // We were connected, but we were disconnected
}

export enum ScanResultType {
  Light = "light",
  Hrm = "hrm",
  Climate = "climate",
  Unknown = "unknown"
}

@component
export class ScanResult extends BaseScriptComponent {
  @input
  toggleButton: ToggleButton

  @input
  nameText: Text

  @input
  detailsText: Text

  @input
  vis: SceneObject

  @input
  connectionImage: Image

  @input
  iconImage: Image

  @input
  backgroundImage: Image

  @input
  lightTex: Texture

  @input
  hrmTex: Texture

  @input
  climateTex: Texture

  @input
  unknownTex: Texture

  @input
  connectionOnTex: Texture

  @input
  connectionOffTex: Texture

  @input
  connectionTryTex: Texture

  public deviceName: string
  public deviceAddress: Uint8Array

  private iconMat: Material
  private connectionMat: Material
  private backgroundMat: Material

  private so: SceneObject
  private screenTransform: ScreenTransform

  private connectionImage_RotateScreenTransformScript: RotateScreenTransform

  private scanResultsManager: ScanResultsManager
  private bluetoothGatt: Bluetooth.BluetoothGatt
  private bleServiceHandler: BleServiceHandler

  private controllerFactory: ControllerFactory
  private widget: Widget

  private onConnectionStateChangedEventRemover

  private type: ScanResultType
  private isFirstConnectAttempt: boolean

  onAwake() {
    this.type = undefined

    this.iconMat = this.iconImage.mainMaterial.clone()
    this.iconImage.mainMaterial = this.iconMat
    this.iconMat.mainPass.baseTex = this.unknownTex

    this.connectionMat = this.connectionImage.mainMaterial.clone()
    this.connectionImage.mainMaterial = this.connectionMat

    this.backgroundMat = this.backgroundImage.mainMaterial.clone()
    this.backgroundImage.mainMaterial = this.backgroundMat
    this.backgroundMat.mainPass.baseColor = Colors.grey()

    this.so = this.getSceneObject()
    this.screenTransform = this.so.getComponent("ScreenTransform")

    this.connectionImage_RotateScreenTransformScript = this.connectionImage
      .getSceneObject()
      .getComponent("ScriptComponent") as RotateScreenTransform
    this.widget = undefined
    this.onConnectionStateChangedEventRemover = undefined
    this.isFirstConnectAttempt = true
  }

  private setStatusMessage(msg: string) {
    const nameStr = "Name: " + this.deviceName
    const detailsStr = "\nStatus: " + msg
    this.nameText.text = nameStr
    this.detailsText.text = detailsStr
    Logger.getInstance().log(nameStr + "\n" + this.deviceAddress + "\n" + detailsStr)
  }

  // called from ScanResultsManager
  init(
    scanResultsManager: ScanResultsManager,
    bleServiceHandler: BleServiceHandler,
    controllerFactory: ControllerFactory,
    scanResult: Bluetooth.ScanResult,
    isShown: boolean
  ) {
    this.scanResultsManager = scanResultsManager
    this.bleServiceHandler = bleServiceHandler
    this.controllerFactory = controllerFactory

    this.deviceName = scanResult ? scanResult.deviceName : "testName"
    this.deviceAddress = scanResult ? scanResult.deviceAddress : new Uint8Array(0)

    this.vis.enabled = isShown
    this.setStatusMessage(ScanResultState.ScanSuccess)
  }

  reparent(parentSo: SceneObject) {
    this.so.setParent(parentSo)
    this.screenTransform.offsets.setCenter(new vec2(0, 0))
  }

  // called from ScanResultsHandler
  // We are hidden when we cannot fit in the scrollview or we are filtered
  show(show: boolean) {
    // This also disables button interactions
    // Logger.getInstance().log("scanResult show " + show);
    this.vis.enabled = show
  }

  // called from SIK button UI
  onToggleSelection(on: boolean) {
    // Logger.getInstance().log("scanResult onToggleSelection " + on);

    if (on) {
      // If we don't have a type yet, try to connect
      if (!this.type) {
        // Logger.getInstance().log("scanResult onToggleSelection no widget -- onTryConnecting");
        this.tryConnect()
      } else {
        // Logger.getInstance().log("scanResult onToggleSelection yes widget -- deselect all but me");
        if (this.bluetoothGatt && this.bluetoothGatt.connectionState.toString() === "0") {
          // We are on device, we have a type, but we were disconnected
          this.tryConnect()
        } else {
          // Either we are in the editor,
          // Or we have a type and we're connected
          // Deselect all others and select me
          this.scanResultsManager.selectMeAndDeselectOthers(this)
        }
      }
    } else {
      // Logger.getInstance().log("scanResult onToggleSelection off - deselecting");
      this.setSelectionBackgroundAndWidgetUi(false)
    }
  }

  // Called from BleServiceHandler
  public tryConnect() {
    Logger.getInstance().log("scanResult onTryConnect " + this.deviceName)
    this.setStatusMessage(ScanResultState.Connecting)
    this.connectionMat.mainPass.baseTex = this.connectionTryTex
    this.connectionImage_RotateScreenTransformScript.startRotate()

    if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
      this.onConnectSuccess()
    } else {
      this.bleServiceHandler.bluetoothModule
        .connectGatt(this.deviceAddress)
        .then((result) => {
          this.bluetoothGatt = result as Bluetooth.BluetoothGatt
          // Logger.getInstance().log("scanResult onTryConnect " + this.deviceName + " connectGatt .then " + this.bluetoothGatt);
          this.onConnectSuccess()
        })
        .catch((error) => {
          // print("scanResult onTryConnect " + this.deviceName + " .error " + error + " " + error.stack);
          reportError(error)
          this.onConnectFailure()
        })
    }
  }

  private onConnectSuccess() {
    Logger.getInstance().log("scanResult onConnectSuccess " + this.deviceName)
    this.checkFirstConnectAttempt()
    this.setStatusMessage(ScanResultState.ConnectionSuccess)
    this.setConnectionIconUi(true)

    if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
      if (!this.widget) {
        this.onWidgetAssigned(this.controllerFactory.create(undefined))
      } else {
        // We already have a widget from a prior connection attempt, so select us now
        this.scanResultsManager.selectMeAndDeselectOthers(this)
      }
    } else {
      if (!this.widget) {
        this.onConnectionStateChangedEventRemover = this.bluetoothGatt.onConnectionStateChangedEvent.add((arg) =>
          this.onConnectionStateChanged(arg)
        )
        this.onWidgetAssigned(this.controllerFactory.create(this.bluetoothGatt))
      } else {
        // We already have a widget from a prior connection attempt, so select us now
        this.scanResultsManager.selectMeAndDeselectOthers(this)
      }
    }
  }

  private onConnectFailure() {
    Logger.getInstance().log("scanResult onConnectFailure " + this.deviceName)
    this.checkFirstConnectAttempt()
    this.setStatusMessage(ScanResultState.ConnectionFailure)
    this.setConnectionIconUi(false)
  }

  private checkFirstConnectAttempt() {
    if (this.isFirstConnectAttempt) {
      this.isFirstConnectAttempt = false
      this.scanResultsManager.tryNextAutoConnect(this)
    }
  }

  private onWidgetAssigned(widget: Widget) {
    // Logger.getInstance().log("scanResult onWidgetAssigned widget " + widget);

    this.widget = widget
    if (this.widget) {
      // Logger.getInstance().log("scanResult onWidgetAssigned widget is defined " + widget + " type " + widget.getType());
      this.type = widget.getType()

      if (this.type === ScanResultType.Light) {
        this.iconMat.mainPass.baseTex = this.lightTex
      } else if (this.type === ScanResultType.Hrm) {
        this.iconMat.mainPass.baseTex = this.hrmTex
      } else if (this.type === ScanResultType.Climate) {
        this.iconMat.mainPass.baseTex = this.climateTex
      }
    } else {
      this.type = ScanResultType.Unknown
      this.iconMat.mainPass.baseTex = this.unknownTex
      // Logger.getInstance().log("ScanResult onWidgetAssigned widget is undefined, scanResult is unknown");
    }

    this.scanResultsManager.registerScanResultType(this, this.type)
    this.scanResultsManager.selectMeAndDeselectOthers(this)
  }

  private onConnectionStateChanged(arg: Bluetooth.ConnectionStateChangedEvent) {
    // This arg is an enum for connection states.
    // 0 = Disconnected
    // 1 = Connected
    // Logger.getInstance().log("onConnectionStateChanged: on connection state changed " + this.deviceName + " " + arg.state.toString());
    if (arg.state.toString() === "0") {
      this.setStatusMessage(ScanResultState.Disconnected)
      this.setConnectionIconUi(false)
    } else if (arg.state.toString() === "1") {
      this.setStatusMessage(ScanResultState.ConnectionSuccess)
      this.setConnectionIconUi(true)
    }
  }

  // Called from onToggleSelection and scanResultsHandler.deselectAllExceptMe
  setSelectionBackgroundAndWidgetUi(select: boolean) {
    // Logger.getInstance().log("scanResult selectUI " + select + " " + this.deviceName);
    if (this.widget) {
      // Logger.getInstance().log("scanResult selectUI widget is here turning ON " + this.deviceName);
      // widget will hide if it's not freed yet
      this.widget.show(select)
    }
    if (this.backgroundMat) {
      // Logger.getInstance().log("scanResult selectUI background is here turning " + select + " " + this.deviceName);
      this.backgroundMat.mainPass.baseColor = select ? Colors.white() : Colors.grey()
    }
  }

  private setConnectionIconUi(connected: boolean) {
    this.connectionMat.mainPass.baseTex = connected ? this.connectionOnTex : this.connectionOffTex
    this.connectionImage_RotateScreenTransformScript.endRotate()
  }
}
