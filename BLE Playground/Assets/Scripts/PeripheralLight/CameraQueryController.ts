import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {GeminiDepthLightEstimator} from "./GeminiDepthLightEstimator"

@component
export class CameraQueryController extends BaseScriptComponent {
  @input
  private button: PinchButton

  @input
  private geminiDepthLightEstimator: GeminiDepthLightEstimator

  private tr: Transform
  private shownLocalPosition: vec3
  private hiddenLocalPosition: vec3

  onAwake() {
    this.tr = this.getTransform()
    this.shownLocalPosition = vec3.zero()
    this.hiddenLocalPosition = new vec3(0, 3000, 0)
    this.tr.setLocalPosition(this.hiddenLocalPosition)

    this.createEvent("OnStartEvent").bind(() => this.init())
  }

  private init() {
    this.button.onButtonPinched.add(() => {
      this.geminiDepthLightEstimator.requestAllPositions()
    })
  }

  show(val: boolean) {
    const pos = val ? this.shownLocalPosition : this.hiddenLocalPosition
    this.tr.setLocalPosition(pos)
  }
}
