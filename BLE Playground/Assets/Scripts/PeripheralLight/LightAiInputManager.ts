import { OpenAI } from "Remote Service Gateway.lspkg/HostedExternal/OpenAI";
import { ASRQueryController } from "AiPlayground/Scripts/ASRQueryController";
import { LightAiJsonEventEmitter } from "./LightAiJsonEventEmitter";
import { LightAiEventListener } from "./LightAiEventListener";
import { reportError } from "Scripts/Helpers/ErrorUtils";
import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";
import { Logger } from "../Helpers/Logger";

@component
export class LightAiInputManager extends BaseScriptComponent {
    @input
    asrQueryController: ASRQueryController

    @input
    micSo: SceneObject

    @input
    private textDisplay: Text;

    @input
    lightAiJsonEventEmitter: LightAiJsonEventEmitter

    private micTr: Transform
    private instructions: string;
    private lightAiEventListeners: LightAiEventListener[];
    private aiLightDataCount: number;
    private loopLength: number;

    private shownOffset: vec3
    private hiddenOffset: vec3
    private cooldown: boolean

    onAwake() {
        this.cooldown = false;

        this.lightAiEventListeners = [];
        this.aiLightDataCount = 5;
        this.loopLength = 5;

        this.shownOffset = new vec3(0, -5, 1);
        this.hiddenOffset = new vec3(0, 3000, 0);

        this.instructions = this.definePrompt();
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    onStart() {
        this.micTr = this.micSo.getTransform();
        this.asrQueryController.onQueryEvent.add((query) => {
            this.makeRequest(query
            );
        });
    }

    // Ai is global to all lights
    // Toggling Ai for one turns them all on 
    onToggle(on: boolean, so: SceneObject) {
        if (this.cooldown === true) {
            return;
        }
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 3);

        this.lightAiEventListeners.forEach(light => {
            light.toggleButton.isToggledOn = on;
        });

        if (on) {
            this.micSo.setParent(so);
            this.micTr.setLocalPosition(this.shownOffset);
            this.textDisplay.text = "Pinch the microphone and say a color theme!";
        } else {
            this.micSo.setParent(this.getSceneObject());
            this.micTr.setLocalPosition(this.hiddenOffset);
            this.lightAiJsonEventEmitter.stopAnimation();
        }
    }

    addListener(lightAiEventListener: LightAiEventListener) {
        this.lightAiEventListeners.push(lightAiEventListener);
    }

    private definePrompt() {
        let indexMax = this.aiLightDataCount - 1;
        let str = "There are " + this.aiLightDataCount + " hue light bulbs. "
        str += "Return the color animation keyframes that match the theme the user requests in JSON format: "
        let jsonObj = {
            "keyframes":
                [
                    {
                        "lightIndex": 0, // Unique identifier
                        "brightness": .8, // From 0 to 1
                        "color": [.5, .3, .7], // R,G,B from 0 to 1
                        "time": 0, // In seconds
                    }
                ]
        };
        str += JSON.stringify(jsonObj);
        str += "The lightIndex should be from 0 to " + indexMax + ". "
        str += "Each light index should have 2-5 keyframes with a time in seconds from 0 to " + this.loopLength + ". "
        str += "Each light needs a keyframe to start at at second 0. "
        str += "Vary the timing and number of keyframes for each bulb -- all the keyframe times should be different. "
        str += "All of the colors should be complimentary and not the same. Use only colors that exactly match the theme. "
        str += "Use saturated or neon colors." 
        str += "Return only json. Do not return any other text."
        return str;
    }

    makeRequest(query: string) {
        this.textDisplay.text = query + " coming up...";
        OpenAI.chatCompletions({
            model: "gpt-4.1",
            messages: [
                {
                    role: "system",
                    content: this.instructions
                },
                {
                    role: "user",
                    content: query,
                }
            ],
            response_format: {
                type: "json_object",
            },
        }).then((response) => {
            this.textDisplay.text = query + " starting now!";
            this.cleanAndSendJson(response.choices[0].message.content);
        }).catch((error) => {
            reportError(error);
        })
    }

    private cleanAndSendJson(str: string) {
        if (str.startsWith("```json\n")) {
            str = str.substring('```json\n'.length);
        }
        if (str.endsWith("```")) {
            str = str.substring(0, str.length - "```".length)
        }
        // this.textDisplay.text = str;

        try {
            let jsonObj = JSON.parse(str);
            // Logger.getInstance().log("LightAiInputManager cleanJson done parsing! Starting animation for lights.");
            this.lightAiJsonEventEmitter.startAnimation(jsonObj, this.lightAiEventListeners, this.aiLightDataCount, this.loopLength);
        } catch (error) {
            reportError(error);
        }
    }
}