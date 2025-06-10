import { Colors } from "Scripts/Helpers/Colors"
import { Logger } from "../Helpers/Logger"

@component
export class LightStatusVisual extends BaseScriptComponent {

    @input
    sliderRmv:RenderMeshVisual

    @input
    sphereRmv:RenderMeshVisual

    private on: boolean
    private brightness: number
    private color: vec4

    private sliderMat:Material
    private sphereMat:Material

    onAwake() {
        this.sliderMat = this.sliderRmv.mainMaterial.clone();
        this.sliderRmv.mainMaterial = this.sliderMat;

        this.sphereMat = this.sphereRmv.mainMaterial.clone();
        this.sphereRmv.mainMaterial = this.sphereMat;

        this.brightness = 1;
        this.color = Colors.black();
    }

    turnOn(on: boolean) {
        this.on = on;
        Logger.getInstance().log("LinkButtonColorState turnOn " + on);
        if (on) {
            this.mergeBrightnessAndColor(this.brightness, this.color);
        } else {
            this.mergeBrightnessAndColor(0, this.color);
        }
    }

    setBrightness(brightness: number) {
        // store our brightness
        this.brightness = brightness;
        this.mergeBrightnessAndColor(this.brightness, this.color);
    }

    setColor(col: vec4) {
        // store our color 
        this.color = col;
        this.mergeBrightnessAndColor(this.brightness, this.color);
    }

    getSphereMat(){
        return this.sphereMat;
    }

    private mergeBrightnessAndColor(brightness:number, color:vec4){
        let localBrightness = brightness;
        if(!this.on){
            localBrightness = 0;
        }

        let blackColor = Colors.black();

        // Mix our color and black to mimic brightness
        let mergedColor = color.uniformScale(localBrightness).add(blackColor.uniformScale(1-localBrightness));
        this.sphereMat.mainPass.customColor = mergedColor;
        this.sphereMat.mainPass.customColor = mergedColor;

        this.sliderRmv.mainMaterial.mainPass.Tweak_N3 = color;
    }

    getColor() {
        return this.color;
    }
}