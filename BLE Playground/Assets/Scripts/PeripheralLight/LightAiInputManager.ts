import { OpenAI } from "Remote Service Gateway.lspkg/HostedExternal/OpenAI";
import { ASRQueryController } from "AiPlayground/Scripts/ASRQueryController";
import { LightAiJsonEventEmitter } from "./LightAiJsonEventEmitter";
import { LightAiEventListener } from "./LightAiEventListener";
import { reportError } from "Scripts/Helpers/ErrorUtils";
import { Logger } from "../Helpers/Logger";
import { RemoteServiceGatewayCredentials } from "Remote Service Gateway.lspkg/RemoteServiceGatewayCredentials";

@component
export class LightAiInputManager extends BaseScriptComponent {
    @input
    asrQueryController: ASRQueryController

    @input
    private textDisplay: Text;

    @input
    lightAiJsonEventEmitter: LightAiJsonEventEmitter

    @input
    remoteServiceGatewayCredentials: RemoteServiceGatewayCredentials

    private instructions: string;
    private lightAiEventListeners: LightAiEventListener[];
    private aiLightDataCount: number;
    private loopLength: number;

    onAwake() {
        this.lightAiEventListeners = [];
        this.aiLightDataCount = 5;
        this.loopLength = 5;

        this.instructions = this.definePrompt();
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    onStart() {
        this.asrQueryController.onQueryEvent.add((query) => {
            this.makeRequest(query);
        });
    }

    // Called from RoomLightsUI
    onToggle(on: boolean) {
        if (on) {
            this.asrQueryController.show();
            if (this.remoteServiceGatewayCredentials.apiToken.includes("[PUT YOUR KEY HERE]") || this.remoteServiceGatewayCredentials.apiToken === "") {
                this.textDisplay.text = "\nError: Add token to\nRemote Service Gateway Credentials."
                return;
            } else {
                this.textDisplay.text = "Pinch the microphone and\nsay a color theme!";
            }
        } else {
            this.asrQueryController.hide();
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
        if (this.remoteServiceGatewayCredentials.apiToken.includes("[PUT YOUR KEY HERE]") || this.remoteServiceGatewayCredentials.apiToken === "") {
            return;
        }
        this.textDisplay.text = query + " Coming up...";
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
            this.textDisplay.text = query + " Starting now!";
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