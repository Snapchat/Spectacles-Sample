/**
 * This script manages hand events via Light Hand Event Listeners on light prefabs.
 * It enacts global hand controls across all listening lights based on whether
 * user camera is looking at one of an array of potential light positions.
 * This array is contributed to from the Gemini Depth Light Estimator
 * and a fallback Surface Detector on the light prefab Light Hand Event Listener.
 */

import {ToggleButton} from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import {AllHandTypes} from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandType"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"
import {CancelToken, clearTimeout, setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {HandHintSequence} from "../Core/HandHintSequence"
import {CameraQueryController} from "./CameraQueryController"
import {GeminiDepthLightEstimator} from "./GeminiDepthLightEstimator"
import {LightHandEventListener} from "./LightHandEventListener"

@component
export class LightHandInputManager extends BaseScriptComponent {
  @input
  cam: Camera

  @input
  handHintSequence: HandHintSequence

  @input
  cameraQueryController: CameraQueryController

  @input
  geminiDepthLightEstimator: GeminiDepthLightEstimator

  @input
  handToggle: ToggleButton

  private lightHandEventListeners: LightHandEventListener[]
  private gestureModule: GestureModule = require("LensStudio:GestureModule")
  private grabBeginLeftRemover: EventRegistration
  private grabBeginRightRemover: EventRegistration
  private grabEndLeftRemover: EventRegistration
  private grabEndRightRemover: EventRegistration

  private updateEvent: UpdateEvent

  private rightHand: TrackedHand
  private leftHand: TrackedHand

  private timeoutCancelToken: CancelToken
  private lightPlacedWithGeminiUnsubscribe: any
  private hintPlayed: boolean

  onAwake() {
    this.hintPlayed = false
    this.lightHandEventListeners = []
    this.createEvent("OnStartEvent").bind(() => this.init())
  }

  init() {
    this.subscribeToGrab()
    const handInputData = SIK.HandInputData
    this.rightHand = handInputData.getHand(AllHandTypes[0])
    this.leftHand = handInputData.getHand(AllHandTypes[1])

    this.updateEvent = this.createEvent("UpdateEvent")
    this.updateEvent.bind(() => this.onUpdate())
    this.updateEvent.enabled = true

    this.lightPlacedWithGeminiUnsubscribe = this.geminiDepthLightEstimator.lightPlaced.add(() =>
      this.onLightPlacedWithGemini()
    )
  }

  onLightPlacedWithSurfaceDetection(pos: vec3) {
    this.playHint()

    // Make a label for lights placed with surface detection as well
    this.geminiDepthLightEstimator.responseUI.loadWorldLabel("Light", pos, true)
  }

  onLightPlacedWithGemini() {
    this.playHint()
    this.geminiDepthLightEstimator.lightPlaced.remove(this.lightPlacedWithGeminiUnsubscribe)
  }

  private playHint() {
    if (!this.hintPlayed) {
      this.hintPlayed = true
      this.timeoutCancelToken = setTimeout(() => {
        clearTimeout(this.timeoutCancelToken)
        this.handHintSequence.startHandGrabHint()
      }, 1)
    }
  }

  onUpdate() {
    if (this.handToggle.isToggledOn && this.isCamLookingAtLight()) {
      let screenPoint: vec2 = undefined
      if (this.leftHand && this.leftHand.isTracked()) {
        screenPoint = this.cam.worldSpaceToScreenSpace(this.leftHand.indexTip.position)
      }
      if (this.rightHand && this.rightHand.isTracked()) {
        screenPoint = this.cam.worldSpaceToScreenSpace(this.rightHand.indexTip.position)
      }
      if (screenPoint) {
        this.lightHandEventListeners.forEach((light) => {
          light.selectColorGestureScreenSpacePos(screenPoint)
        })
      }
    }
  }

  addListener(lightHandEventListener: LightHandEventListener) {
    this.lightHandEventListeners.push(lightHandEventListener)
  }

  // Returns true if cam is looking at any light
  private isCamLookingAtLight() {
    for (let i = 0; i < this.geminiDepthLightEstimator.lightPositions.length; i++) {
      if (this.checkDot(this.geminiDepthLightEstimator.lightPositions[i])) {
        return true
      }
    }
    this.lightHandEventListeners.forEach((lightHandEventListener) => {
      if (lightHandEventListener.surfaceDetectionPosition !== undefined) {
        if (this.checkDot(lightHandEventListener.surfaceDetectionPosition)) {
          return true
        }
      }
    })
    return false
  }

  private checkDot(pos: vec3) {
    const dotThreshold = 0.7
    const camToLight = pos.sub(this.cam.getTransform().getWorldPosition()).normalize()
    const dot = this.cam.getTransform().back.dot(camToLight)
    if (dot > dotThreshold) {
      return true
    } else {
      return false
    }
  }

  // Called from RoomLightsUI
  onToggle(on: boolean) {
    this.lightHandEventListeners.forEach((light) => {
      light.resetBrightnessAndColorStates()
    })

    this.cameraQueryController.show(on)
    this.geminiDepthLightEstimator.show(on)
  }

  private subscribeToGrab() {
    if (!this.grabBeginLeftRemover) {
      this.grabBeginLeftRemover = this.gestureModule
        .getGrabBeginEvent(GestureModule.HandType.Left)
        .add(() => this.onGrabBegin())
    }
    if (!this.grabBeginRightRemover) {
      this.grabBeginRightRemover = this.gestureModule
        .getGrabBeginEvent(GestureModule.HandType.Right)
        .add(() => this.onGrabBegin())
    }
    if (!this.grabEndLeftRemover) {
      this.grabEndLeftRemover = this.gestureModule
        .getGrabEndEvent(GestureModule.HandType.Left)
        .add(() => this.onGrabEnd())
    }
    if (!this.grabEndRightRemover) {
      this.grabEndRightRemover = this.gestureModule
        .getGrabEndEvent(GestureModule.HandType.Right)
        .add(() => this.onGrabEnd())
    }
  }

  onGrabBegin() {
    if (this.handToggle.isToggledOn && this.isCamLookingAtLight()) {
      this.lightHandEventListeners.forEach((light) => {
        light.togglePowerFromGesture(false)
      })
    }
  }

  onGrabEnd() {
    if (this.handToggle.isToggledOn && this.isCamLookingAtLight()) {
      this.lightHandEventListeners.forEach((light) => {
        light.togglePowerFromGesture(true)
      })
    }
  }

  // private unsubscribeFromGrab() {
  //     if (this.grabBeginLeftRemover) {
  //         this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Left).remove(this.grabBeginLeftRemover);
  //         this.grabBeginLeftRemover = undefined;
  //     }

  //     if (this.grabBeginRightRemover) {
  //         this.gestureModule.getGrabBeginEvent(GestureModule.HandType.Right).remove(this.grabBeginRightRemover);
  //         this.grabBeginRightRemover = undefined;
  //     }

  //     if (this.grabEndLeftRemover) {
  //         this.gestureModule.getGrabEndEvent(GestureModule.HandType.Left).remove(this.grabEndLeftRemover);
  //         this.grabEndLeftRemover = undefined;
  //     }

  //     if (this.grabEndRightRemover) {
  //         this.gestureModule.getGrabEndEvent(GestureModule.HandType.Right).remove(this.grabEndRightRemover);
  //         this.grabEndRightRemover = undefined;
  //     }
  // }
}
