import { Cube } from "./Cube";

const SERVICE_UUID = "0000FFE5-0000-1000-8000-00805F9B34FB";
const CHARACTERISTIC_UUID = "0000FFE6-0000-1000-8000-00805F9B34FB";

@component
export class BLEArduino extends BaseScriptComponent {
  @input bluetoothModule: Bluetooth.BluetoothCentralModule;
  @input screenText: Text;
  @input cube: Cube;

  private scanFilter = new Bluetooth.ScanFilter();
  private scanSetting = new Bluetooth.ScanSettings();

  onAwake() {
    this.scanFilter.serviceUUID = SERVICE_UUID;
    this.scanSetting.uniqueDevices = true;
    this.scanSetting.scanMode = Bluetooth.ScanMode.Balanced;
    this.scanSetting.timeoutSeconds = 1000;
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.startScan();
  }

  private startScan() {
    this.screenText.text = "Looking for device...";
    this.log("starting scan...");
    this.bluetoothModule
      .startScan(
        [this.scanFilter],
        this.scanSetting,
        (scanResult: Bluetooth.ScanResult) => {
          this.log("Found device: " + scanResult.deviceName);
          this.screenText.text = "Found device!\n" + scanResult.deviceName;
          return true;
        }
      )
      .then((scanResult) => {
        print("Scan result: " + scanResult.deviceName);
        this.bluetoothModule.stopScan().then(() => {
          this.connectGATT(scanResult);
        });
      })
      .catch((error) => {
        this.log("Error during scan: " + error);
      });
  }

  private async connectGATT(scanResult: Bluetooth.ScanResult) {
    this.log("Attempting connection: " + scanResult.deviceAddress);
    var gatt = await this.bluetoothModule.connectGatt(scanResult.deviceAddress);
    this.log("Got connection result...");
    let desiredService = gatt.getService(SERVICE_UUID);
    let desiredChar = desiredService.getCharacteristic(CHARACTERISTIC_UUID);
    gatt.onConnectionStateChangedEvent.add(async (connectionState) => {
      this.log("Connection state changed: " + connectionState.state);
      if (connectionState.state == Bluetooth.ConnectionState.Disconnected) {
        this.log("Disconnected from: " + scanResult.deviceName);
        this.screenText.text = "Disconnected...";
      }
      if (connectionState.state == Bluetooth.ConnectionState.Connected) {
        this.log("Connected to device: " + scanResult.deviceName);
        this.screenText.text = "Connected to:\n" + scanResult.deviceName;
        //send example value to Arduino
        this.log("writing value...");
        await desiredChar.writeValue(this.str2bin("HI FROM Spectacles"));
        this.log("done write!");
        desiredChar
          .registerNotifications((value) => {
            var message = this.bin2str(value);
            print("Notification: " + message);
            //message looks like "0.1, 0.2, 0.5"
            var numArray = message.split(",").map((x) => {
              return parseFloat(x);
            });
            //parse it into a number array
            this.cube.setRotationAngle(numArray);
          })
          .then(() => {
            this.log("Notifications registered successfully.");
            this.screenText.text = "Notifications registered!";
          })
          .catch((error) => {
            this.log("Error registering notifications: " + error);
          });
      }
    });
  }

  private bin2str(array: Uint8Array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }

  private str2bin(str: string) {
    const out = new Uint8Array(str.length);
    for (let i = 0; i < str.length; ++i) {
      out[i] = str.charCodeAt(i);
    }
    return out;
  }

  private log(message: string) {
    print("BLE TEST: " + message);
  }
}
