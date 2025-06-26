/**
 * v1.0
 * This class handles Ble Service start and stop scan events. 
 * It configures what we're scanning for, and how those results are displayed.
 * It manages the scan toggle button ui state. 
 * It makes sure we're not scanning and connecting at the same time. 
 */

import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { ButtonFeedback_ForceVisualState } from "../Helpers/ButtonFeedback_ForceVisualState";
import { reportError } from "../Helpers/ErrorUtils";
import { HelperFuntions } from "../Helpers/HelperFunctions";
import { Logger } from "../Helpers/Logger";
import { LensInitializer } from "./LensInitializer";
import { CancelToken, clearTimeout, setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

@component
export class BleServiceHandler extends BaseScriptComponent {
    @input
    bluetoothModule: Bluetooth.BluetoothCentralModule

    @input
    scanToggle: ToggleButton

    @input
    scanToggleButtonFeedback_ForceVisualState: ButtonFeedback_ForceVisualState

    get startScan() {
        return this.startScanEvent.publicApi();
    }
    get scanResult() {
        return this.scanResultEvent.publicApi();
    }
    get stopScan(){
        return this.stopScanEvent.publicApi();
    }

    private startScanEvent: Event = new Event();
    private scanResultEvent: Event<any> = new Event();
    private stopScanEvent: Event = new Event();

    // Note: these are type Bluetooth.ScanResult, not type ScanResult
    private allScanSessionBluetoothScanResults: Bluetooth.ScanResult[];

    private isScanning: boolean;

    private timeoutCancelToken: CancelToken

    onAwake() {
        this.isScanning = false;
        this.allScanSessionBluetoothScanResults = [];
    }

    // Called from the UI Scan toggle button and when code sets scanToggle.isToggledOn
    onScanToggle(on: boolean) {
        if (on) {
            this.onStartScan();
        } else {
            this.onStopScan();
        }

        // This reinforces button state if state is set using code (eg "this.scanToggle.isToggledOn = false")
        this.scanToggleButtonFeedback_ForceVisualState.onCodeChangeButtonState();
    }

    private onStartScan() {
        // Reset
        this.isScanning = true;

        // Debug or Editor
        if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
            Logger.getInstance().log("BleServiceHandler onStartScan in editor or debug.");
            this.startScanEvent.invoke();
            this.timeoutCancelToken = setTimeout(() => {
                clearTimeout(this.timeoutCancelToken);
                this.scanToggle.isToggledOn = false;
                this.onScanResult(undefined);
            }, .5);
        }
        // Ble on Device
        else {
            Logger.getInstance().log("BleServiceHandler onStartScan on Spectacles - multiple devices flow.");

            // This empty filter returns every result
            let genericFilter = new Bluetooth.ScanFilter();

            let scanSettings = new Bluetooth.ScanSettings();
            scanSettings.uniqueDevices = true;
            scanSettings.timeoutSeconds = 10;

            // Note: startScan is an async function.  You can use the following syntax OR async/await syntax.  
            this.bluetoothModule.startScan(
                [genericFilter],
                scanSettings,
                // I hit this predicate function with EVERY scan result
                // If this.predicate returns true ANYWHERE IN THE ENSUING CALLSTACK, the scan will stop
                // If this.predicate returns false ANYWHERE IN THE ENSUING CALLSTACK, the scan will continue until timeout
                (result) => this.predicate(result))
                // Note: if you use the second error callback parameter in .then, your error will catch there INSTEAD of in catch -- use one or the other.
                .then((result) => {
                    // Fires ONLY when the predicate resolves with true
                    this.scanToggle.isToggledOn = false;
                    Logger.getInstance().log("this.bluetoothModule.startScan scan is over -- success -- .then " + result);
                })
                .catch((error) => {
                    // Fires on calling bluetoothModule.stopScan() AND on scan timing out
                    this.scanToggle.isToggledOn = false;
                    Logger.getInstance().log("this.bluetoothModule.startScan scan is over -- stop, timeout, or error -- .catch " + error);
                    reportError(error);
                })
        }
    }

    private predicate(result?: Bluetooth.ScanResult) {
        Logger.getInstance().log("bleServiceHandler predicate " + result);

        // NOTE: If you return true in this event stack, 
        // the scan will receive "true" from the predicate, 
        // and the scan will stop.
        this.onScanResult(result);
        // Returning "false" from the predicate continues the scan until timeout 
        return false;
    }

    // Determine if we add result to our lists, which we can act on when the scan stops
    private onScanResult(scanResult?: Bluetooth.ScanResult) {
        Logger.getInstance().log("BleServiceHandler onScanResults\n" + scanResult);

        // Debug or Editor
        if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
            this.scanToggle.isToggledOn = false;
            Logger.getInstance().log("BleServiceHandler onScanResults in editor debug\n" + scanResult);
            let testCount = 30;
            for (let i = 0; i < testCount; i++) {
                this.scanResultEvent.invoke(scanResult);
            }
        }
        // Ble on Device 
        else if (scanResult) {
            // Logger.getInstance().log("BleServiceHandler onScanResults is defined\n" + scanResult.deviceName);
            // Note: I'm filtering out undefined and empty results from display 
            if (scanResult.deviceName !== undefined && scanResult.deviceName !== "") { // && scanResult.deviceName !== "Seos") {
                if (this.allScanSessionBluetoothScanResults.length > 0) {
                    // Check if this results is already stored from a prior scan session. 
                    let alreadyExists: boolean = false;
                    for (let i = 0; i < this.allScanSessionBluetoothScanResults.length; i++) {
                        if (HelperFuntions.uint8ArrayCompare(scanResult.deviceAddress, this.allScanSessionBluetoothScanResults[i].deviceAddress)) {
                            Logger.getInstance().log("BleServiceHandler onScanResults in loop same address as\n" + this.allScanSessionBluetoothScanResults[i].deviceAddress);
                            alreadyExists = true;
                            break;
                        }
                    }
                    if (!alreadyExists) {
                        this.addScanResult(scanResult);
                    }
                } else {
                    this.addScanResult(scanResult);
                }
            } else {
                // Logger.getInstance().log("BleServiceHandler onScanResults deviceName is undefined or empty: \n" + scanResult.deviceName);
            }
        }
    }

    // Add result to our lists to act on when the scan stops
    private addScanResult(scanResult: Bluetooth.ScanResult) {
        this.allScanSessionBluetoothScanResults.push(scanResult);
        this.scanResultEvent.invoke(scanResult);
        Logger.getInstance().log("BleServiceHandler onScanResults pushing\n" + scanResult.deviceName);
    }

    // Called from scanToggle, which could be set by user or by code.
    private onStopScan() {
        Logger.getInstance().log("BleServiceHandler onStopScan isScanning " + this.isScanning);
        if (this.isScanning) {
            if (!global.deviceInfoSystem.isEditor()) {
                this.bluetoothModule.stopScan();
            }
            this.isScanning = false;
            this.stopScanEvent.invoke();
        }
    }
}