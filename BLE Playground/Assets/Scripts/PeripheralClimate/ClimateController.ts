import {Thingy52Data} from "../Core/PeripheralTypeData"
import {reportError} from "../Helpers/ErrorUtils"
import {Logger} from "../Helpers/Logger"

@component
export class ClimateController extends BaseScriptComponent {
  @input
  temperatureValueText: Text

  @input
  humidityValueText: Text

  @input
  airqualityValueText: Text

  @input
  rotationBox: SceneObject

  private bluetoothGatt: Bluetooth.BluetoothGatt = undefined
  private weatherService: Bluetooth.BluetoothGattService = undefined
  private temperatureCharacteristic: Bluetooth.BluetoothGattCharacteristic = undefined
  private humidityCharacteristic: Bluetooth.BluetoothGattCharacteristic = undefined
  private airQualityCharacteristic: Bluetooth.BluetoothGattCharacteristic = undefined

  onAwake() {}

  init(myBluetoothGatt: Bluetooth.BluetoothGatt) {
    this.bluetoothGatt = myBluetoothGatt
    if (this.bluetoothGatt) {
      Logger.getInstance().log("ClimateController gatt defined " + this.bluetoothGatt)

      try {
        this.weatherService = this.bluetoothGatt.getService(Thingy52Data._weatherServiceUUID)
        if (this.weatherService) {
          Logger.getInstance().log("ClimateController weather service defined " + this.weatherService)

          try {
            this.temperatureCharacteristic = this.weatherService.getCharacteristic(Thingy52Data._temperatureCharUUID)
            if (this.temperatureCharacteristic) {
              Logger.getInstance().log(
                "ClimateController temperatureCharacteristic defined " + this.temperatureCharacteristic.uuid
              )
              this.registerTemperature()
            }
          } catch (error) {
            reportError(error)
          }

          try {
            this.humidityCharacteristic = this.weatherService.getCharacteristic(Thingy52Data._humidityCharUUID)
            if (this.humidityCharacteristic) {
              Logger.getInstance().log(
                "ClimateController humidityCharacteristic defined " + this.humidityCharacteristic.uuid
              )
              this.registerHumidity()
            }
          } catch (error) {
            reportError(error)
          }

          try {
            this.airQualityCharacteristic = this.weatherService.getCharacteristic(Thingy52Data._airqualityCharUUID)
            if (this.airQualityCharacteristic) {
              Logger.getInstance().log(
                "ClimateController airQualityCharacteristic defined " + this.airQualityCharacteristic.uuid
              )
              this.registerAirQuality()
            }
          } catch (error) {
            reportError(error)
          }
        }
      } catch (error) {
        reportError(error)
      }
    } else {
      Logger.getInstance().log("ClimateController gatt undefined " + this.bluetoothGatt)
    }
  }

  registerTemperature() {
    this.temperatureCharacteristic
      .registerNotifications((arg) => this.temperatureNotification(arg))
      .catch((error) => {
        Logger.getInstance().log("ClimateController registerTemperature error " + error)
      })
      .then(() => {
        Logger.getInstance().log("ClimateController registerTemperature then")
      })
  }

  temperatureNotification(val: Uint8Array) {
    Logger.getInstance().log("ClimateController temperatureNotification val " + val)
    if (val) {
      if (val.length > 0) {
        Logger.getInstance().log("ClimateController temperatureNotification val len " + val.length)
        this.temperatureValueText.text = val[0].toString()
      }
    }
  }

  registerHumidity() {
    this.humidityCharacteristic
      .registerNotifications((arg) => this.humidityNotification(arg))
      .catch((error) => {
        Logger.getInstance().log("ClimateController registerHumidity error " + error)
      })
      .then(() => {
        Logger.getInstance().log("ClimateController registerHumidity then")
      })
  }

  humidityNotification(val: Uint8Array) {
    Logger.getInstance().log("ClimateController humidityNotification val " + val)
    if (val) {
      if (val.length > 0) {
        Logger.getInstance().log("ClimateController humidityNotification val len " + val.length)
        this.humidityValueText.text = val[0].toString() + "%"
      }
    }
  }

  registerAirQuality() {
    this.airQualityCharacteristic
      .registerNotifications((arg) => this.airQualityNotification(arg))
      .catch((error) => {
        Logger.getInstance().log("ClimateController registerAirQuality error " + error)
      })
      .then(() => {
        Logger.getInstance().log("ClimateController registerAirQuality then")
      })
  }

  airQualityNotification(val: Uint8Array) {
    Logger.getInstance().log("ClimateController airQualityNotification val " + val)
    if (val) {
      if (val.length > 0) {
        Logger.getInstance().log("ClimateController airQualityNotification val len " + val.length)
        this.airqualityValueText.text = (val[0] + val[1]).toString()
      }
    }
  }
}
