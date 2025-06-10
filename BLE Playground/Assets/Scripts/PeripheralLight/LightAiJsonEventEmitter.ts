import { Logger } from "../Helpers/Logger";
import { LightAiEventListener } from "./LightAiEventListener";

export type LightKeyFrame = {
    lightIndex: number;
    brightness: number;
    color: [r: number, g: number, b: number];
    time: number;
}

export type LightKeyFrameSequence = {
    keyframes: LightKeyFrame[];
}

@component
export class LightAiJsonEventEmitter extends BaseScriptComponent {
    @input
    rmvs: RenderMeshVisual[]

    private mats: Material[];

    private lightKeyFrameSequence: LightKeyFrameSequence;
    private updateEvent: UpdateEvent;
    private startTime: number;
    private keyFramesPlayed: boolean[];
    private lightAiEventListeners: LightAiEventListener[];
    private aiLightDataCount: number; // The number of lights we have data for
    private loopLength: number;

    onAwake() {
        this.lightAiEventListeners = [];
        this.keyFramesPlayed = [];
        this.mats = [];
        for (let i = 0; i < this.rmvs.length; i++) {
            let mat = this.rmvs[i].mainMaterial.clone();
            this.rmvs[i].mainMaterial = mat;
            this.mats.push(mat);
        }

        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(() => this.onUpdate());
        this.updateEvent.enabled = false;
    }

    onUpdate() {
        let loopTime = getTime() - this.startTime;

        if (this.lightKeyFrameSequence === undefined
            || this.lightKeyFrameSequence.keyframes === undefined
            || this.lightKeyFrameSequence.keyframes.length === 0) {
            Logger.getInstance().log("WARNING: LightAiJsonEventEmitter onUpdate lightKeyFrameSequence not fully defined.");
            return;
        }

        for (let i = 0; i < this.lightKeyFrameSequence.keyframes.length; i++) {

            if (this.lightKeyFrameSequence.keyframes[i] !== undefined && this.lightKeyFrameSequence.keyframes[i].time !== undefined) {
                if (!this.keyFramesPlayed[i]) {
                    if (loopTime > this.lightKeyFrameSequence.keyframes[i].time) {
                        this.emitEvent(this.lightKeyFrameSequence.keyframes[i]);
                        this.keyFramesPlayed[i] = true;
                    }
                }
            } else {
                Logger.getInstance().log("WARNING: LightAiJsonEventEmitter onUpdate keframe not fully defined");
            }
        }
        if (loopTime > this.loopLength + 1.5) {
            // Logger.getInstance().log("LightAiJsonEventEmitter finished sequence - looping");
            this.resetLoop();
        }
    }

    private resetLoop() {
        this.keyFramesPlayed = [];
        for (let i = 0; i < this.lightKeyFrameSequence.keyframes.length; i++) {
            this.keyFramesPlayed.push(false);
        }
        this.startTime = getTime();
    }

    startAnimation(jsonObj: LightKeyFrameSequence, lightAiEventListeners: LightAiEventListener[], aiLightDataCount: number, loopLength: number) {
        this.aiLightDataCount = aiLightDataCount;
        this.loopLength = loopLength;
        this.lightAiEventListeners = lightAiEventListeners;
        this.lightKeyFrameSequence = jsonObj;
        this.resetLoop();
        this.updateEvent.enabled = true;
    }

    stopAnimation() {
        this.updateEvent.enabled = false;
    }

    private emitEvent(lightKeyFrame: LightKeyFrame) {
        // Logger.getInstance().log("LightAiJsonEventEmitter setLight " + lightKeyFrame + " " + lightKeyFrame.lightIndex + " " + lightKeyFrame.color + " " + lightKeyFrame.brightness + " " + lightKeyFrame.time);

        if (lightKeyFrame === undefined
            || lightKeyFrame.lightIndex === undefined
            || lightKeyFrame.brightness === undefined
            || lightKeyFrame.color === undefined) {
            Logger.getInstance().log("LightAiJsonEventEmitter WARNING: lightKeyFrame, index, brightness, or color undefined.");
            return;
        }

        // Because the ai instruction is sent when the websocket connects, the ai generates keyframes for a hardcoded number of lights.
        // If we have more lights than ai data, then one ai data will set multiple lights.
        for (let i = 0; i < this.lightAiEventListeners.length; i++) {
            let aiDataIndex = i % this.aiLightDataCount;
            if (lightKeyFrame.lightIndex === aiDataIndex) {
                this.lightAiEventListeners[i].onAiSetBrightnessAndColor(lightKeyFrame.brightness, lightKeyFrame.color[0], lightKeyFrame.color[1], lightKeyFrame.color[2]);

            }
        }

        // For debug sphere renderers in editor
        // if (this.mats.length > lightKeyFrame.lightIndex) {
        //     let rbga = new vec4(lightKeyFrame.color[0], lightKeyFrame.color[1], lightKeyFrame.color[2], lightKeyFrame.brightness);
        //     this.mats[lightKeyFrame.lightIndex].mainPass.baseColor = rbga;
        //     print("LightAiJsonEventEmitter DONE! " + rbga + " " + this.mats[lightKeyFrame.lightIndex].mainPass.baseColor);
        // }
    }
}
