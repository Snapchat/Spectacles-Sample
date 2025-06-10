import { HeartRateMonitorData } from "../Core/PeripheralTypeData";
import { reportError } from "../Helpers/ErrorUtils";
import { Logger } from "../Helpers/Logger";

@component
export class HeartRateController extends BaseScriptComponent {

    @input
    text: Text

    private bluetoothGatt: Bluetooth.BluetoothGatt = undefined;
    private baseService: Bluetooth.BluetoothGattService = undefined;
    private heartRateCharacteristic: Bluetooth.BluetoothGattCharacteristic = undefined;

    init(myBluetoothGatt: Bluetooth.BluetoothGatt) {
        this.bluetoothGatt = myBluetoothGatt;
        if (this.bluetoothGatt) {
            Logger.getInstance().log("HeartRateController gatt defined " + this.bluetoothGatt);

            try {
                this.baseService = this.bluetoothGatt.getService(HeartRateMonitorData._serviceUUIDHR);
                if (this.baseService) {
                    Logger.getInstance().log("HeartRateController base service defined " + this.baseService);

                    try {
                        this.heartRateCharacteristic = this.baseService.getCharacteristic(HeartRateMonitorData._charUUIDHR);
                        if (this.heartRateCharacteristic) {
                            Logger.getInstance().log("HeartRateController char defined " + this.heartRateCharacteristic.uuid);
                            this.registerHeartRate();
                        }
                    } catch (error) {
                        reportError(error);
                    }
                }
            } catch (error) {
                reportError(error);
            }
        } else {
            Logger.getInstance().log("HeartRateController gatt undefined " + this.bluetoothGatt);
        }
    }

    registerHeartRate() {
        this.heartRateCharacteristic.registerNotifications((arg) => this.heartRateNotification(arg))
            .catch((error) => {
                Logger.getInstance().log("HeartRateController reg error " + error);

            }).then(() => {
                Logger.getInstance().log("HeartRateController reg then");
            })
    }

    heartRateNotification(val: Uint8Array) {
        Logger.getInstance().log("HeartRateController heartRateNotification val " + val);

        if (val) {
            if (val.length > 0) {
                Logger.getInstance().log("HeartRateController heartRateNotification val len " + val.length);
                this.text.text = val[1].toString();
            }
        }
    }
}