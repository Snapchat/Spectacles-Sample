import { LightController } from "./LightController";
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { SurfaceDetectionMod } from "Surface Detection [Modified]/Scripts/SurfaceDetectionMod";
import { Logger } from "../Helpers/Logger";
import { HandHintSequence } from "../Core/HandHintSequence";
import { AllHandTypes } from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandType";
import { GeminiDepthLightEstimatorListener } from "./GeminiDepthLightEstimatorListener";
import { LightHandInputManager } from "./LightHandInputManager";
import { ButtonFeedback_ForceVisualState } from "../Helpers/ButtonFeedback_ForceVisualState";

@component
export class LightHandEventListener extends BaseScriptComponent {

    @input
    cam: Camera

    @input
    lightController: LightController

    @input
    HandControlToggle: ToggleButton

    @input
    handControlButtonFeedback_ForceVisualState: ButtonFeedback_ForceVisualState

    @input
    handControlText: Text

    @input
    pfbSurfaceDetection: ObjectPrefab

    @input
    handHintSequence: HandHintSequence

    @input
    lightHandInputManager: LightHandInputManager

    private gestureModule: GestureModule = require('LensStudio:GestureModule');

    private grabBeginLeftRemover: EventRegistration
    private grabBeginRightRemover: EventRegistration
    private grabEndLeftRemover: EventRegistration
    private grabEndRightRemover: EventRegistration

    private isPlaced: boolean

    private updateEvent: UpdateEvent

    private rightHand: TrackedHand
    private leftHand: TrackedHand

    private lightWorldPosition: vec3

    private surfaceDetectionSo: SceneObject
    private surfaceDetectionMod: SurfaceDetectionMod

    private geminiDepthLightEstimatorListener: GeminiDepthLightEstimatorListener

    private tr: Transform

    onAwake() {
        this.tr = this.getTransform();
        this.lightWorldPosition = undefined;
        this.isPlaced = false;

        this.handControlText.text = "Hand Control OFF";
        this.lightHandInputManager.addListener(this);
    }

    init(geminiDepthLightEstimatorListener: GeminiDepthLightEstimatorListener) {
        this.geminiDepthLightEstimatorListener = geminiDepthLightEstimatorListener;

        this.subscribeToGrab();
        let handInputData = SIK.HandInputData;
        this.rightHand = handInputData.getHand(AllHandTypes[0]);
        this.leftHand = handInputData.getHand(AllHandTypes[1]);

        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(() => this.onUpdate());
        this.updateEvent.enabled = true;
    }

    onUpdate() {
        // update color
        if (this.HandControlToggle.isToggledOn && this.lightWorldPosition !== undefined) {
            let screenPoint = undefined;
            if (this.leftHand && this.leftHand.isTracked()) {
                screenPoint = this.cam.worldSpaceToScreenSpace(this.leftHand.indexTip.position);
            }
            if (this.rightHand && this.rightHand.isTracked()) {
                screenPoint = this.cam.worldSpaceToScreenSpace(this.rightHand.indexTip.position);
            }
            if (screenPoint) {
                this.lightController.selectColorGestureScreenSpacePos(screenPoint);
            }
        }
    }

    private isCamLookingAtLight() {
        let camToLight = this.lightWorldPosition.sub(this.cam.getTransform().getWorldPosition()).normalize();
        let dot = this.cam.getTransform().back.dot(camToLight);
        Logger.getInstance().log("InteractionHandler_Gesture dot " + dot);

        return dot > .6;
    }

    // Called from toggle button
    onToggleButton(on: boolean) {
        // one button enables them all -- cooldown in place
        this.lightController.resetBrightnessAndColorStates();
        this.handControlButtonFeedback_ForceVisualState.onCodeChangeButtonState();

        if (on) {
            this.handControlText.text = "Hand Control ON";

            // If haven't yet, and we're not in a cooldown, start placement flow 
            if (!this.isPlaced && !this.lightHandInputManager.cooldown) {
                Logger.getInstance().log("InteractionHandler_GestureLight toggle is on not placed " + on);

                // Try to place with ai. If fails, fallback to surface detection. 
                // let aiPos = this.lightAiDetectionRegistration.getLightWorldPosition();
                // if (aiPos) {
                //     this.onSurfaceDetected(aiPos, undefined);
                // } else {
                this.handHintSequence.startLookHint();

                let surfaceDetectionSo = this.pfbSurfaceDetection.instantiate(null);
                this.surfaceDetectionMod = surfaceDetectionSo.getChild(0).getComponent("ScriptComponent") as SurfaceDetectionMod;
                this.surfaceDetectionMod.init(this.cam.getSceneObject());
                this.surfaceDetectionMod.startGroundCalibration((pos, rot) => {
                    this.onSurfaceDetected(pos, rot);
                })
                // }
            } else {

            }
        } else {
            // Hand control disabled 
            this.handControlText.text = "Hand Control OFF";
        }

        if (!this.lightHandInputManager.cooldown) {
            this.lightHandInputManager.onToggle(on);
        }
    }

    trySetTempPosition(pos: vec3) {
        if (this.lightWorldPosition === undefined) {
            this.lightWorldPosition = pos;
        }
    }

    private onSurfaceDetected(pos: vec3, rot: quat) {
        // Logger.getInstance().log("InteractionHandler_GestureLight onSurfaceDetected " + pos);
        this.isPlaced = true;
        this.handHintSequence.endLookHint();
        this.handHintSequence.startHandGrabHint();
        this.lightWorldPosition = pos;

        this.lightHandInputManager.onSurfaceDetected(pos);
    }

    private subscribeToGrab() {
        if (!this.grabBeginLeftRemover) {
            this.grabBeginLeftRemover = this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Left).add(() => this.onGrabBegin());
        }
        if (!this.grabBeginRightRemover) {
            this.grabBeginRightRemover = this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Right).add(() => this.onGrabBegin());
        }
        if (!this.grabEndLeftRemover) {
            this.grabEndLeftRemover = this.gestureModule.getGrabEndEvent(GestureModule.HandType.Left).add(() => this.onGrabEnd());
        }
        if (!this.grabEndRightRemover) {
            this.grabEndRightRemover = this.gestureModule.getGrabEndEvent(GestureModule.HandType.Right).add(() => this.onGrabEnd());
        }
    }

    private unsubscribeFromGrab() {
        if (this.grabBeginLeftRemover) {
            this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Left).remove(this.grabBeginLeftRemover);
            this.grabBeginLeftRemover = undefined;
        }

        if (this.grabBeginRightRemover) {
            this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Right).remove(this.grabBeginRightRemover);
            this.grabBeginRightRemover = undefined;
        }

        if (this.grabEndLeftRemover) {
            this.gestureModule.getGrabEndEvent(GestureModule.HandType.Left).remove(this.grabEndLeftRemover);
            this.grabEndLeftRemover = undefined;
        }

        if (this.grabEndRightRemover) {
            this.gestureModule.getGrabEndEvent(GestureModule.HandType.Right).remove(this.grabEndRightRemover);
            this.grabEndRightRemover = undefined;
        }
    }

    onGrabBegin() {
        if (this.HandControlToggle.isToggledOn && this.lightWorldPosition !== undefined && this.isCamLookingAtLight()) {
            this.lightController.togglePowerFromGesture(false);
        }
    }

    onGrabEnd() {
        if (this.HandControlToggle.isToggledOn && this.lightWorldPosition !== undefined && this.isCamLookingAtLight()) {
            this.lightController.togglePowerFromGesture(true);
        }
    }
}