// Note: If you are having trouble writing to hue bulb, you can try resetting bulb via Power Cycling:
// Power off: Turn off the power to the bulb for 10 seconds (either at the wall switch or by unplugging the lamp). 
// Power on: Turn the power back on and leave it on for 3 seconds. 
// Power off: Turn the power off again for 10 seconds. 
// Repeat: Repeat the on and off cycle until the bulb flashes, with each on period lasting 3 seconds and each off period lasting 10 seconds. 
// Confirm reset: The bulb should blink or cycle colors to indicate a successful reset. 

import { LensInitializer } from "../Core/LensInitializer";
import { HueLightData } from "../Core/PeripheralTypeData";
import { CursorVisualHelper } from "../Helpers/CursorVisualHelper";
import { reportError } from "../Helpers/ErrorUtils";
import { LightStatusVisual } from "./LightStatusVisual";
import { Logger } from "../Helpers/Logger";
import { UniqueColorService } from "../Helpers/UniqueColorService";
import { GeminiDepthLightEstimatorListener } from "./GeminiDepthLightEstimatorListener";

// Store state data in two formats - for the debug visual, and bytes for the ble light
// To reduce ble message count on drag, store the next brightness or color, and only set it once the last value is recieved
export interface LightState {
    powerBool: boolean;
    powerByteArray: Uint8Array;
    brightnessNum: number;
    brightnessByteArray: Uint8Array;
    nextBrightnessNum: number;
    preFlashBrightnessNum: number;
    colorVec: vec4;
    colorByteArray: Uint8Array;
    nextColorVec: vec4;
}

@component
export class HueEventEmitter extends BaseScriptComponent {

    @input
    lightStatusVisual: LightStatusVisual

    private updateFlashEvent: SceneEvent;

    // Spectacles
    private bluetoothGatt: Bluetooth.BluetoothGatt;
    private baseService: Bluetooth.BluetoothGattService;
    private powerCharacteristic: Bluetooth.BluetoothGattCharacteristic;
    private brightnessCharacteristic: Bluetooth.BluetoothGattCharacteristic;
    private colorCharacteristic: Bluetooth.BluetoothGattCharacteristic;

    private state: LightState;
    private inSetBrightnessState: boolean;
    private inSetColorState: boolean;

    private geminiDepthLightEstimatorListener: GeminiDepthLightEstimatorListener

    private safeBytes = [];

    private settingStartColor: boolean;

    onAwake() {
        this.settingStartColor = true;
        this.inSetBrightnessState = false;
        this.inSetColorState = false;

        // NOTE BUG: first bytes > 127 will crash - fix is coming
        // Define safe bytes for Hue bulb
        for (let i = 1; i <= 0x7F; i++) this.safeBytes.push(i); // ASCII range
        // for (let i = 0xC2; i <= 0xF4; i++) safeBytes.push(i); // Valid UTF-8 leading bytes

        this.state = {} as LightState;

        this.updateFlashEvent = this.createEvent("UpdateEvent");
        this.updateFlashEvent.enabled = false;
        this.updateFlashEvent.bind(() => {
            this.onUpdateFlash();
        });
    }

    init(myBluetoothGatt: any, startColor: vec4, geminiDepthLightEstimatorListener: GeminiDepthLightEstimatorListener) {
        this.geminiDepthLightEstimatorListener = geminiDepthLightEstimatorListener;

        this.bluetoothGatt = undefined;
        this.baseService = undefined;
        this.powerCharacteristic = undefined;
        this.brightnessCharacteristic = undefined;
        this.colorCharacteristic = undefined;

        // Initialize state
        this.state.powerBool = true;
        this.state.powerByteArray = new Uint8Array(1);
        this.state.brightnessNum = 1;
        this.state.brightnessByteArray = new Uint8Array(1);
        this.state.nextBrightnessNum = undefined; // Undefined flags no next brightness
        this.state.preFlashBrightnessNum = undefined;
        this.state.colorVec = startColor;
        this.state.colorByteArray = new Uint8Array(4); // We don't know the color yet
        this.state.nextColorVec = undefined; // Undefined flags no next color

        // Set status visual 
        this.lightStatusVisual.setColor(this.state.colorVec);

        // Register this visual with the Unique Color Service, which uses it to choose a unique start color for subsequent lights
        UniqueColorService.getInstance().registerLightVisualMat(this.lightStatusVisual.getSphereMat());

        if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
            return;
        }

        this.updateFlashEvent.enabled = false;

        this.bluetoothGatt = myBluetoothGatt as Bluetooth.BluetoothGatt;
        if (this.bluetoothGatt) {
            try {
                this.baseService = this.bluetoothGatt.getService(HueLightData._baseServiceUUID);
                if (this.baseService) {
                    // Logger.getInstance().log("HueLightController Found desired service: " + this.baseService.uuid);
                    try {
                        this.powerCharacteristic = this.baseService.getCharacteristic(HueLightData._powerCharacteristicUUID);
                        if (this.powerCharacteristic) {
                            // Logger.getInstance().log("HueLightController found char power " + this.powerCharacteristic);
                        }
                    } catch (error) {
                        reportError(error);
                    }

                    try {
                        this.brightnessCharacteristic = this.baseService.getCharacteristic(HueLightData._brightnessCharacteristicUUID);
                        if (this.brightnessCharacteristic) {
                            // Logger.getInstance().log("HueLightController found char brightness " + this.brightnessCharacteristic);
                        }
                    } catch (error) {
                        reportError(error);
                    }

                    try {
                        this.colorCharacteristic = this.baseService.getCharacteristic(HueLightData._colorCharacteristicUUID);
                        if (this.colorCharacteristic) {
                            this.setColor(startColor);
                            // Logger.getInstance().log("HueLightController found char color " + this.colorCharacteristic);
                        }
                    } catch (error) {
                        reportError(error);
                    }
                }
            } catch (error) {
                reportError(error);
            }
        } else {
            Logger.getInstance().log("HueLightController gatt undefined " + this.bluetoothGatt);
        }
    }

    // In this case, update only handles flash.  We enable/disable event to control flash
    private onUpdateFlash() {
        // Emphasize highs and lows
        let flash = Math.sin(7 * getTime());
        let rimCrush = .5;
        flash = rimCrush * (flash + 1);
        if (flash > rimCrush / 2) {
            flash += 1 - rimCrush / 2;
        }
        flash = Math.min(1, Math.max(flash, 0));

        // Note: here is a bug where values >127 (half brightness) are invalid after a UTF-8 conversion
        this.setNextBrightness(flash);
    }

    // true or false
    togglePower(on: boolean) {
        this.updateFlashEvent.enabled = false;

        this.state.powerBool = on;
        this.lightStatusVisual.turnOn(this.state.powerBool);

        if (this.state.powerByteArray !== undefined && this.state.powerByteArray.length > 0) {
            this.state.powerByteArray[0] = on ? 1 : 0;
            if (this.powerCharacteristic) {
                this.powerCharacteristic.writeValue(this.state.powerByteArray)
                    .then(() => {
                        // Logger.getInstance().log("HueLightController toggle power " + this.state.powerByteArray + "\n on char " + this.powerCharacteristic.uuid)
                    })
                    .catch((error) => {
                        reportError(error);
                    });
            } else {
                // Logger.getInstance().log("HueLightController power characteristic undefined " + this.powerCharacteristic);
            }
        }
    }

    // We need these states in order to minimize ble messages while dragging. 
    // However, sometimes we drop a read receipt - meaning the state is never reset to false 
    // So we reset the states when input buttons are toggled as a fallback. 
    resetBrightnessAndColorStates(){
        this.inSetBrightnessState = false;
        this.inSetColorState = false;
    }

    // Called from slider UI
    // From 0 to 1
    setBrightnessUI(val: number) {
        this.updateFlashEvent.enabled = false;
        this.setNextBrightness(val);
    }

    private setNextBrightness(val: number) {
        if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
            // Logger.getInstance().log("HueLightController setNextBrightness debug " + val);
            this.lightStatusVisual.setBrightness(val);
        }

        if (!this.inSetBrightnessState) {
            // If the next brightness is currently undefined, then set it and write
            // Logger.getInstance().log("HueLightController HERE setNextBrightness overwrite and call " + val);
            this.inSetBrightnessState = true;
            this.state.nextBrightnessNum = val;
            this.setBrightness(this.state.nextBrightnessNum);
        } else {
            // Else only set the next brightness -- the promise will write once the last message has been recieved
            // Logger.getInstance().log("HueLightController HERE setNextBrightness overwrite and don't call " + val);
            this.state.nextBrightnessNum = val;
        }
    }

    private setBrightness(val: number) {
        this.state.brightnessNum = val;

        // Logger.getInstance().log("HueLightController set brightness val " + val);

        // Brightness goes from 1 to 254
        this.state.brightnessByteArray = this.brightnessToHueByteArray(val);
        // Logger.getInstance().log("HueLightController set brightness int " + val + ", array used " + this.state.brightnessByteArray);

        if (this.brightnessCharacteristic) {
            // Logger.getInstance().log("HueLightController ABOUT TO set brightness " + this.state.brightnessByteArray + "\n on char " + this.brightnessCharacteristic.uuid);
            this.brightnessCharacteristic.writeValue(this.state.brightnessByteArray)
                .then(() => {
                    this.lightStatusVisual.setBrightness(this.state.brightnessNum);

                    // Reduce messages on drag by only sending the latest next brightness once the last brightness has been set
                    // Logger.getInstance().log("HueLightController HERE set brightness " + "\n on char " + this.brightnessCharacteristic.uuid + "\n int: " + this.state.brightnessByteArray);
                    if (this.state.nextBrightnessNum) {
                        // Logger.getInstance().log("HueLightController HERE calling set next brightness " + this.state.nextBrightnessNum + " at " + getTime());
                        let nextBrightnessNum = this.state.nextBrightnessNum;
                        this.state.nextBrightnessNum = undefined;
                        this.setBrightness(nextBrightnessNum);
                    } else {
                        this.inSetBrightnessState = false;
                        // Logger.getInstance().log("HueLightController HERE next brightness undefined - we're done setting the brightness.");
                    }
                })
                .catch((error) => {
                    reportError(error);
                })
        } else {
            // Logger.getInstance().log("HueLightController brightness characteristic is undefined");
            if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
                this.state.nextBrightnessNum = undefined;
            }
        }
    }

    // Called from LightUI.ts
    // rgba from 0 to 1
    setColorUI(color: vec4) {
        this.updateFlashEvent.enabled = false;

        if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
            // Logger.getInstance().log("HueLightController set debug color " + this.state.colorVec)
            this.lightStatusVisual.setColor(color);

        } else {
            // If the next color is currently undefined, then set it and write
            if (!this.inSetColorState) {
                // Logger.getInstance().log("HueLightController setColorRGB overwrite and call ONCE " + color);

                this.state.nextColorVec = color;
                this.inSetColorState = true;
                CursorVisualHelper.getInstance().showCursor(false);

                // Make the first call.  Subsequent calls will be made in the promise. 
                this.setColor(this.state.nextColorVec);
            }
            // Else only set the next color -- the promise will write once the last message has been recieved
            else {
                // Logger.getInstance().log("HueLightController setColorRGB overwrite and don't call MANY " + color);
                this.state.nextColorVec = color;
            }
        }
    }

    private setColor(color: vec4) {
        // Store state
        this.state.colorVec = color;

        // Convert color for ble light and store state
        let colorXY = this.RGBtoXY(color.r, color.g, color.b);
        this.state.colorByteArray = this.xyToByteArray(colorXY.x, colorXY.y);

        if (this.colorCharacteristic) {
            // Logger.getInstance().log("HueLightController about to set color " + this.state.colorByteArray + "\n on char " + this.colorCharacteristic.uuid)
            this.colorCharacteristic.writeValue(this.state.colorByteArray)
                .then(() => {
                    this.lightStatusVisual.setColor(this.state.colorVec);

                    if (this.settingStartColor) {
                        this.settingStartColor = false;
                        this.geminiDepthLightEstimatorListener.onHueSetStartColor();
                    }

                    // Reduce messages on drag by only sending the latest next color once the last color has been set
                    // Logger.getInstance().log("HueLightController set color " + this.state.colorByteArray + "\n on char " + this.colorCharacteristic.uuid);
                    if (this.state.nextColorVec) {
                        // Logger.getInstance().log("HueLightController calling set next color SOME " + this.state.colorByteArray + " at " + getTime());
                        let nextColorVec = this.state.nextColorVec;
                        this.state.nextColorVec = undefined; // This is a flag
                        this.setColor(nextColorVec);
                    } else {
                        this.inSetColorState = false;
                        CursorVisualHelper.getInstance().showCursor(true);

                        // Logger.getInstance().log("HueLightController next color undefined - we're done setting the color. ONCE");
                    }
                })
                .catch((error) => {
                    reportError(error);
                })
        } else {
            // Logger.getInstance().log("HueLightController color characteristic undefined");
            if (global.deviceInfoSystem.isEditor() || LensInitializer.getInstance().isNoBleDebug) {
                this.state.nextColorVec = undefined;
            }
        }
    }

    private xyToByteArray(x: number, y: number): Uint8Array {
        // Use the Y value of XYZ as brightness The Y value indicates the brightness of the converted color.

        // Scale to 16-bit unsigned range
        const x16 = Math.round(x * 0xFFFF);
        const y16 = Math.round(y * 0xFFFF);

        // Logger.getInstance().log("colors x16 " + x16 + " y16 " + y16);

        // Encode as little-endian byte array
        const data = new Uint8Array(4);
        data[0] = x16 & 0xFF;
        data[1] = (x16 >> 8) & 0xFF;
        data[2] = y16 & 0xFF;
        data[3] = (y16 >> 8) & 0xFF;

        // BUG: It SHOULD be to 255, but due to a serialization bug, we only have half the color range
        data[0] = Math.min(127, Math.max(1, data[0]));
        data[1] = Math.min(127, Math.max(1, data[1]));
        data[2] = Math.min(127, Math.max(1, data[2]));
        data[3] = Math.min(127, Math.max(1, data[3]));

        // Logger.getInstance().log("colors data " + data);
        return data;
    }

    private brightnessToHueByteArray(brightness: number): Uint8Array {
        // Clamp brightness between 0.0 and 1.0
        Logger.getInstance().log("brightnessToHueByteArray brightness " + brightness);
        brightness = Math.max(0, Math.min(1, brightness));

        // Due to a serialization bug, we only have half the brightness range
        // Scale brightness to 0–safeBytes[safeBytes.length - 1]
        const index = Math.round(brightness * (this.safeBytes.length - 1));
        const byte = this.safeBytes[index];
        Logger.getInstance().log("brightnessToHueByteArray byte " + byte);

        return new Uint8Array([byte]);
    }

    // Reference: https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/blob/00187a3db88dedd640f5ddfa8a474458dff4e1db/ApplicationDesignNotes/RGB%20to%20xy%20Color%20conversion.md
    private RGBtoXY(r: number, g: number, b: number) {
        // Clamp
        r = Math.max(0, Math.min(1, r));
        g = Math.max(0, Math.min(1, g));
        b = Math.max(0, Math.min(1, b));

        // Apply Gamma 
        r = (r > 0.04045) ? Math.pow((r + 0.055) / (1.0 + 0.055), 2.4) : (r / 12.92);
        g = (g > 0.04045) ? Math.pow((g + 0.055) / (1.0 + 0.055), 2.4) : (g / 12.92);
        b = (b > 0.04045) ? Math.pow((b + 0.055) / (1.0 + 0.055), 2.4) : (b / 12.92);

        // Convert to XYZ using the Wide RGB D65 conversion formula
        let X = r * 0.649926 + g * 0.103455 + b * 0.197109;
        let Y = r * 0.234327 + g * 0.743075 + b * 0.022598;
        let Z = r * 0.0000000 + g * 0.053077 + b * 1.035763;

        let cx = X / (X + Y + Z);
        let cy = Y / (X + Y + Z);

        // For the hue bulb the corners of the triangle are: 
        // Red: 0.675, 0.322 
        // Green: 0.4091, 0.518 
        // Blue: 0.167, 0.04

        // Clamp with the closest point on the color gamut triangle
        // TODO: find the closest valid point rather than clamping
        cx = Math.max(.167, Math.min(.675, cx));
        cy = Math.max(0.04, Math.min(0.518, cy));

        Logger.getInstance().log("HueLightController RGBtoXY " + cx + " " + cy);

        return new vec2(cx, cy);
    }

    setFlash(on: boolean) {
        Logger.getInstance().log("HueLightController setFlash " + on);

        if (on) {
            this.state.preFlashBrightnessNum = this.state.brightnessNum;
            this.updateFlashEvent.enabled = true;
        } else {
            this.updateFlashEvent.enabled = false;

            // Reset brightness
            this.state.nextBrightnessNum = undefined;
            this.setNextBrightness(this.state.preFlashBrightnessNum);
        }
    }
}