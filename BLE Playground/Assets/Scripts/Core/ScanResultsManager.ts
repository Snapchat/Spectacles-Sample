/**
 * v1.0
 * This class subscribes to bleServiceHandler scan events, and 
 * is responsible for spawning, filtering, and attempting to serially auto connect to known scan results.
 */

import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { HelperFuntions } from "../Helpers/HelperFunctions";
import { Logger } from "../Helpers/Logger";
import { BleServiceHandler } from "./BleServiceHandler";
import { ControllerFactory } from "./ControllerFactory";
import { LensInitializer } from "./LensInitializer";
import { HeartRateMonitorData, HueLightData, Thingy52Data } from "./PeripheralTypeData";
import { ScanResult, ScanResultType } from "./ScanResult";

@component
export class ScanResultsManager extends BaseScriptComponent {

    @input
    gridParent: SceneObject

    @input
    scanResultPfb: ObjectPrefab

    @input
    filterButtonToggle: ToggleButton

    private bleServiceHandler: BleServiceHandler
    private controllerFactory: ControllerFactory

    private scanResultSpots: SceneObject[]

    // Organizing in order to filter active scan results by type. 
    // Note: These are ScanResult type, not Bluetooth.ScanResult type  
    // Active = assigned a value, by not necessarily show.  
    // If filtering by known results, we hide the unknown results
    private lightScanResults: ScanResult[] // light type
    private hrmScanResults: ScanResult[] // hrm type
    private climateScanResults: ScanResult[] // climate type
    private unknownScanResults: ScanResult[] // unknown type
    private untypedScanResults: ScanResult[] // preconnection

    // These are the scan results we will try to auto connect to when the scan stops 
    private autoConnectScanResults: ScanResult[]
    private autoConnectIndex:number

    onAwake() {
        this.scanResultSpots = [];

        this.lightScanResults = [];
        this.hrmScanResults = [];
        this.climateScanResults = [];
        this.unknownScanResults = [];
        this.untypedScanResults = [];

        this.autoConnectScanResults = [];
        this.autoConnectIndex = 0;

        // Do SIK operations in start to give SIK a frame to initialize
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    onStart() {
        // Note: because scroll needs an item count on enabled, and is not yet dynamic, 
        // Scan result spots are instantiated in the gridParent GridContentCreator
        // You can change the count in the GridContentCreator editor field items count
        this.scanResultSpots = this.gridParent.children;
    }

    init(myBleServiceHandler: BleServiceHandler, myControllerFactory: ControllerFactory) {
        this.bleServiceHandler = myBleServiceHandler;
        this.controllerFactory = myControllerFactory;
        this.bleServiceHandler.startScan.add(() => this.onStartScan());
        this.bleServiceHandler.scanResult.add((arg) => this.onScanResult(arg));
        this.bleServiceHandler.stopScan.add(() => this.onStopScan());
    }

    // Added to bleServiceHandler startScan event
    onStartScan() {

    }

    // Added to bleServiceHandler scanResults event
    onScanResult(myScanResult: Bluetooth.ScanResult) {
        let nextScanResultSpot = this.getNextScanResultSpot();
        // Logger.getInstance().log("ScanResultsHandler onScanResult " + myScanResult + " next spot " + nextScanResultSpot + " spots " + this.scanResultSpots.length);

        let myParent: SceneObject | null = nextScanResultSpot ? nextScanResultSpot : null;
        let show: boolean = nextScanResultSpot ? true : false;

        let newSo = this.scanResultPfb.instantiate(myParent);

        let screenTransform = newSo.getComponent("Component.ScreenTransform");
        screenTransform.offsets.setCenter(new vec2(0, 0));
        newSo.enabled = true;

        let scanResult = newSo.getComponent("ScriptComponent") as ScanResult;
        scanResult.init(this, this.bleServiceHandler, this.controllerFactory, myScanResult, show);

        // All scan results begin as untyped until they are connected to and interrogated
        this.untypedScanResults.push(scanResult);
        this.organizeScanResults();

        // let msg = show ? "ScanResultsHandler onScanResult initializing scan result." : "ScanResultsHandler onScanResult is out of spots.  Initializing and hiding scan result.  Filter to see (if it's known).";
        // Logger.getInstance().log(msg);
    }

    // Added to bleServiceHandler stopScan event 
    onStopScan() {
        // reset
        this.autoConnectScanResults = [];
        this.autoConnectIndex = 0; 

        for (let i = 0; i < this.untypedScanResults.length; i++) {
            if (HelperFuntions.strIncludes(this.untypedScanResults[i].deviceName,
                [HueLightData._commonDeviceNameSubstring,
                HeartRateMonitorData._commonDeviceNameSubstring,
                Thingy52Data._commonDeviceNameSubstring])) {
                    this.autoConnectScanResults.push(this.untypedScanResults[i]);
            }
        }

        this.tryNextAutoConnect(undefined);
    }

    // Called from onStopScan and scanResult
    tryNextAutoConnect(lastScanResult:ScanResult){
        if(this.autoConnectScanResults.length > 0){
            if(this.autoConnectIndex === 0){
                // Try first auto connection 
                this.autoConnectScanResults[this.autoConnectIndex].tryConnect()
                this.autoConnectIndex++;
            }else if(this.autoConnectIndex < this.autoConnectScanResults.length){
                // Esure we were called by the last autoconnection in our sequence
                if(lastScanResult !== undefined){
                    if(HelperFuntions.uint8ArrayCompare(lastScanResult.deviceAddress, this.autoConnectScanResults[this.autoConnectIndex-1].deviceAddress)){
                        this.autoConnectScanResults[this.autoConnectIndex].tryConnect();
                        this.autoConnectIndex++;
                    }
                } 
            }
        }
    }

    private getNextScanResultSpot() {
        let count = this.lightScanResults.length + this.hrmScanResults.length + this.climateScanResults.length;

        if (!this.filterButtonToggle.isToggledOn) {
            count += this.unknownScanResults.length + this.untypedScanResults.length;
        }

        if (count < this.scanResultSpots.length) {
            return this.scanResultSpots[count];
        } else {
            return undefined;
        }
    }

    // Called from button toggle
    onFilterToggle(on: boolean) {
        // Logger.getInstance().log("ScanResultsHandler onFilterToggle " + on + " unknown " + this.unknownScanResults.length);
        this.organizeScanResults();
    }

    private organizeScanResults() {
        // Logger.getInstance().log("ScanResultsHandler organizeScanResults " + this.filterButtonToggle.isToggledOn);

        // Put all the untyped at the end and hide them 
        for (let i = 0; i < this.untypedScanResults.length; i++) {
            this.untypedScanResults[i].reparent(this.scanResultSpots[this.scanResultSpots.length - 1]);
            this.untypedScanResults[i].show(false);
        }
        // Put all the unknowns at the end and hide them 
        for (let i = 0; i < this.unknownScanResults.length; i++) {
            this.unknownScanResults[i].reparent(this.scanResultSpots[this.scanResultSpots.length - 1]);
            this.unknownScanResults[i].show(false);
        }
        // Put lights and hrms at the begining and show them
        for (let i = 0; i < this.scanResultSpots.length; i++) {
            let lightEndIndex = this.lightScanResults.length - 1;
            let hrmEndIndex = this.lightScanResults.length + this.hrmScanResults.length - 1;
            let climateEndIndex = this.lightScanResults.length + this.hrmScanResults.length + this.climateScanResults.length - 1;
            if (i <= lightEndIndex) {
                this.lightScanResults[i].reparent(this.scanResultSpots[i]);
                this.lightScanResults[i].show(true);
            }
            // Then place hrm 
            else if (i <= hrmEndIndex) {
                let hrmIndex = i - this.lightScanResults.length;
                this.hrmScanResults[hrmIndex].reparent(this.scanResultSpots[i]);
                this.hrmScanResults[hrmIndex].show(true);
            }
            // Then place climate
            else if (i <= climateEndIndex) {
                let climateIndex = i - (this.lightScanResults.length + this.hrmScanResults.length);
                this.climateScanResults[climateIndex].reparent(this.scanResultSpots[i]);
                this.climateScanResults[climateIndex].show(true);
            }
        }

        // Place the unknowns and untyped after lights and hrm
        for (let i = 0; i < this.scanResultSpots.length; i++) {
            let unknownStartIndex = this.lightScanResults.length + this.hrmScanResults.length + this.climateScanResults.length;
            if (i >= unknownStartIndex) {
                let unknownEndIndex = this.lightScanResults.length + this.hrmScanResults.length + this.climateScanResults.length + this.unknownScanResults.length - 1;
                let untypedEndIndex = this.lightScanResults.length + this.hrmScanResults.length + this.climateScanResults.length + this.unknownScanResults.length + this.untypedScanResults.length - 1;
                if (i <= unknownEndIndex) {
                    let unknownIndex = i - this.lightScanResults.length - this.hrmScanResults.length - this.climateScanResults.length;
                    this.unknownScanResults[unknownIndex].reparent(this.scanResultSpots[i]);
                    // Deciding to actually show unknowns, since they're still connected
                    this.unknownScanResults[unknownIndex].show(true);
                } else if (i <= untypedEndIndex) {
                    let untypedIndex = i - this.lightScanResults.length - this.hrmScanResults.length - this.climateScanResults.length - this.unknownScanResults.length;
                    this.untypedScanResults[untypedIndex].reparent(this.scanResultSpots[i]);
                    // Hide untyped if filtering
                    this.untypedScanResults[untypedIndex].show(!this.filterButtonToggle.isToggledOn);
                }
            }
        }
    }

    // Called from Scan result to register once it knows its type
    registerScanResultType(scanResult: ScanResult, type: string) {
        // Logger.getInstance().log("ScanResultsHandler registerScanResultType");

        // Now that we're typed, remove us from the untyped array 
        for (let i = 0; i < this.untypedScanResults.length; i++) {
            if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
                if (scanResult.getSceneObject().uniqueIdentifier.includes(this.untypedScanResults[i].getSceneObject().uniqueIdentifier)) {
                    // Logger.getInstance().log("ScanResultsHandler register in editor or debug splicing " + i + " from untyped");
                    this.untypedScanResults.splice(i, 1);
                    break;
                }
            } else {
                if (HelperFuntions.uint8ArrayCompare(scanResult.deviceAddress, this.untypedScanResults[i].deviceAddress)) {
                    // Logger.getInstance().log("ScanResultsHandler register splicing " + i + " from untyped");
                    this.untypedScanResults.splice(i, 1);
                    break;
                }
            }
        }

        if (type === ScanResultType.Light) {
            this.lightScanResults.push(scanResult);
        } else if (type === ScanResultType.Hrm) {
            this.hrmScanResults.push(scanResult);
        } else if (type === ScanResultType.Climate) {
            this.climateScanResults.push(scanResult);
        } else if (type === ScanResultType.Unknown) {
            this.unknownScanResults.push(scanResult);
        } else {
            Logger.getInstance().log("ScanResultsHandler register an unrecognized type");
        }
        this.organizeScanResults();
        // Logger.getInstance().log("ScanResultsHandler register untyped " + this.untypedScanResults.length + " light " + this.lightScanResults.length + " hrm " + this.hrmScanResults.length + " unknown " + this.unknownScanResults.length);

        // Logger.getInstance().log("ScanResultsHandler register would call organizeScanResults " + this.filterButtonToggle.isToggledOn);
    }

    selectMeAndDeselectOthers(selectedScanResult: ScanResult) {
        let allScanResults = this.lightScanResults.concat(this.hrmScanResults).concat(this.climateScanResults).concat(this.unknownScanResults).concat(this.untypedScanResults);
        // Logger.getInstance().log("ScanResultsHandler deselectAllExceptMe " + allScanResults.length);

        for (let i = 0; i < allScanResults.length; i++) {
            if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
                if (allScanResults[i].getSceneObject().uniqueIdentifier.includes(selectedScanResult.getSceneObject().uniqueIdentifier)) {
                    allScanResults[i].toggleButton.isToggledOn = true;
                    allScanResults[i].setSelectionBackgroundAndWidgetUi(true);
                } else {
                    allScanResults[i].toggleButton.isToggledOn = false;
                    allScanResults[i].setSelectionBackgroundAndWidgetUi(false);
                }
            } else {
                if (HelperFuntions.uint8ArrayCompare(allScanResults[i].deviceAddress, selectedScanResult.deviceAddress)) {
                    allScanResults[i].toggleButton.isToggledOn = true;
                    allScanResults[i].setSelectionBackgroundAndWidgetUi(true);
                } else {
                    allScanResults[i].toggleButton.isToggledOn = false;
                    allScanResults[i].setSelectionBackgroundAndWidgetUi(false);
                }
            }
        }
    }
}