/**
 * v1.0
 * 
 */

import { HeartRateMonitorData, HueLightData, Thingy52Data } from "./PeripheralTypeData"
import { LightController } from "../PeripheralLight/LightController"
import { Widget } from "./Widget"
import { Logger } from "../Helpers/Logger"
import { LensInitializer } from "./LensInitializer"
import { HeartRateController } from "../PeripheralHeartRate/HeartRateController"
import { ScanResultType } from "./ScanResult"
import { reportError } from "../Helpers/ErrorUtils"
import { ClimateController } from "../PeripheralClimate/ClimateController"

@component
export class ControllerFactory extends BaseScriptComponent {
    @input
    pfbWidget: ObjectPrefab

    @input
    pfbLightController: ObjectPrefab

    @input
    pfbHeartRateMonitorController: ObjectPrefab

    @input
    pfbClimateController: ObjectPrefab

    @input
    node: SceneObject

    private localPositionOffset = new vec3(0, 0, .5);
    private localScaleMult = .75;

    private instantiateControllerContent(bluetoothGatt: Bluetooth.BluetoothGatt) {
        Logger.getInstance().log("controllerfactory instantiateControllerContent " + bluetoothGatt);
        if (!global.deviceInfoSystem.isEditor() && !LensInitializer.getInstance().isNoBleDebug) {
            let gatt: Bluetooth.BluetoothGatt = bluetoothGatt as Bluetooth.BluetoothGatt;

            try {
                let heartRateService = gatt.getService(HeartRateMonitorData._serviceUUIDHR);
                if (heartRateService) {
                    Logger.getInstance().log("Controllerfactory instantiateControllerContent hrm " + heartRateService);
                    return this.onFoundHRM(bluetoothGatt);
                }
            } catch (error) {
                reportError(error);
            }

            try {
                let climateService = gatt.getService(Thingy52Data._weatherServiceUUID);
                if (climateService) {
                    Logger.getInstance().log("Controllerfactory instantiateControllerContent climate " + climateService);
                    return this.onFoundClimate(bluetoothGatt);
                }
            } catch (error) {
                reportError(error);
            }

            try {
                let hueLightService = gatt.getService(HueLightData._baseServiceUUID);
                if (hueLightService) {
                    Logger.getInstance().log("Controllerfactory instantiateControllerContent getService light " + hueLightService);
                    return this.onFoundLight(bluetoothGatt);
                } 
            } catch (error) {
                reportError(error);

                // This is our last stop to return undefined, which signals that we don't have a controller for this connection
                // NOTE: If you add more trycatch's, you need to put this in your last catch
                Logger.getInstance().log("Controllerfactory instantiateControllerContent can't find controller");
                return undefined;
            }
        } else {
            // To debug ui in editor, this will spawn the ui, but it won't be functional
            // Select a random controller to test them all in editor
            let randomNumber = Math.random();
            Logger.getInstance().log("controllerfactory instantiateControllerContent debug " + randomNumber);

            if (randomNumber < .25) {
                return this.onFoundLight(undefined);
            } else if (randomNumber < .5) {
                return this.onFoundHRM(undefined);
            } else if (randomNumber < .75) {
                return this.onFoundClimate(undefined);
            } else {
                return undefined;
            }
        }
    }

    private onFoundLight(bluetoothGatt: Bluetooth.BluetoothGatt) {
        let widget = this.instantiateWidget();
        widget.init(this.node, ScanResultType.Light);

        let so = this.instantiateControllerContentHelper(this.pfbLightController, widget.getSceneObject());
        so.getTransform().setLocalScale(vec3.one().uniformScale(this.localScaleMult));
        let newLightController = so.getComponent("ScriptComponent") as LightController;
        if (newLightController) {
            newLightController.init(bluetoothGatt, widget);
        }
        return widget;
    }

    private onFoundHRM(bluetoothGatt: Bluetooth.BluetoothGatt) {
        let widget = this.instantiateWidget();
        widget.init(this.node, ScanResultType.Hrm);

        let so = this.instantiateControllerContentHelper(this.pfbHeartRateMonitorController, widget.getSceneObject());
        let newHeartRateController = so.getComponent("ScriptComponent") as HeartRateController;
        if (newHeartRateController) {
            newHeartRateController.init(bluetoothGatt);
        }
        return widget;
    }

    private onFoundClimate(bluetoothGatt: Bluetooth.BluetoothGatt){
        let widget = this.instantiateWidget();
        widget.init(this.node, ScanResultType.Climate);

        let so = this.instantiateControllerContentHelper(this.pfbClimateController, widget.getSceneObject());
        let newClimateController = so.getComponent("ScriptComponent") as ClimateController;
        if (newClimateController) {
            newClimateController.init(bluetoothGatt);
        }
        return widget;
    }

    private instantiateControllerContentHelper(pfb: ObjectPrefab, uiSo: SceneObject) {
        let so = pfb.instantiate(uiSo);
        let tr = so.getTransform();
        tr.setLocalPosition(this.localPositionOffset);
        tr.setLocalRotation(quat.quatIdentity());
        tr.setLocalScale(vec3.one());
        return so;
    }

    private instantiateWidget() {
        let so = this.pfbWidget.instantiate(null);
        let tr = so.getTransform();
        tr.setWorldPosition(this.node.getTransform().getWorldPosition());
        tr.setWorldRotation(this.node.getTransform().getWorldRotation());

        let widget = so.getComponent("ScriptComponent") as Widget;
        return widget;
    }

    create(bluetoothGatt: Bluetooth.BluetoothGatt) {
        // Returning the controllerUi instance means we found the controller for a service on the device 
        // Returning undefined means we did not find a controller for a service on this device
        return this.instantiateControllerContent(bluetoothGatt);
    }
}