// Add your peripheral here
// NOTE: use 0x for the short version of the uuid

/**
 * Note: Hue ble connection not officially documented by Hue. 
 * To really dig in on the Hue side, look into their developer program and using wifi connection with their 
 * hub and official api (which works with the hub over wifi)
 */
export namespace HueLightData{
    export const _commonDeviceNameSubstring:string = "hue";
    export const _baseServiceUUID:string = "932C32BD-0000-47A2-835A-A8D455B859DD";
    export const _powerCharacteristicUUID:string = "932C32BD-0002-47A2-835A-A8D455B859DD";
    export const _brightnessCharacteristicUUID:string = "932C32BD-0003-47A2-835A-A8D455B859DD";
    export const _colorCharacteristicUUID:string = "932C32BD-0005-47A2-835A-A8D455B859DD";
}

/**
 * Note: this *should* work with any heart rate monitor data.  
 * We have tested with Polar band and the apple watch via mobile app Blue Heart
 */
export namespace HeartRateMonitorData{
    export const _commonDeviceNameSubstring:string = "polar";
    export const _serviceUUIDHR:string = "0x180D"; //"0000180D-0000-1000-8000-00805F9B34FB";
    export const _charUUIDHR:string = "0x2A37"; 
}

/**
 * Note: This is an amazing sensor with TONS of capabilities to easily prototype with.
 * I highly recommend this for hackathons.  There is a:
 * Weather Service 
 * User Interface Service 
 * Motion Service 
 * Sound Service
 * Documentation: https://nordicsemiconductor.github.io/Nordic-Thingy52-FW/documentation/firmware_architecture.html#fw_arch_ble_services
 */
export namespace Thingy52Data{
    export const _commonDeviceNameSubstring:string = "thingy";
    export const _weatherServiceUUID:string = "EF680200-9B35-4933-9B10-52FFA9740042";
    export const _temperatureCharUUID:string = "EF680201-9B35-4933-9B10-52FFA9740042";
    export const _pressureCharUUID:string = "EF680202-9B35-4933-9B10-52FFA9740042";
    export const _humidityCharUUID:string = "EF680203-9B35-4933-9B10-52FFA9740042";
    export const _airqualityCharUUID:string = "EF680204-9B35-4933-9B10-52FFA9740042";
    export const _colorCharUUID:string = "EF680205-9B35-4933-9B10-52FFA9740042"; // environmental light intensity/colors

    export const _motionServiceUUID:string = "EF680400-9B35-4933-9B10-52FFA9740042";
    export const _quaternionCharUUID:string = "EF680404-9B35-4933-9B10-52FFA9740042";
}