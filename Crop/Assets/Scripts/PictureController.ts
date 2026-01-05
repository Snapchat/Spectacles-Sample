import {SIK} from "SpectaclesInteractionKit.lspkg/SIK"

@component
export class PictureController extends BaseScriptComponent {
  @input scannerPrefab: ObjectPrefab

  private isEditor = global.deviceInfoSystem.isEditor()

  private rightHand = SIK.HandInputData.getHand("right")
  private leftHand = SIK.HandInputData.getHand("left")

  private leftDown = false
  private rightDown = false

  onAwake() {
    this.rightHand.onPinchUp.add(this.rightPinchUp)
    this.rightHand.onPinchDown.add(this.rightPinchDown)
    this.leftHand.onPinchUp.add(this.leftPinchUp)
    this.leftHand.onPinchDown.add(this.leftPinchDown)
    if (this.isEditor) {
      this.createEvent("TouchStartEvent").bind(this.editorTest.bind(this))
    } else {
      const obj = this.getSceneObject()
      if (obj.getChildrenCount() > 0) {
        obj.getChild(0).destroy()
      }
    }
  }

  editorTest() {
    print("Creating Editor Scanner...")
    this.createScanner()
  }

  private leftPinchDown = () => {
    print("LEFT Pinch down")
    this.leftDown = true
    if (this.rightDown && this.isPinchClose()) {
      this.createScanner()
    }
  }

  private leftPinchUp = () => {
    print("LEFT Pinch up")
    this.leftDown = false
  }

  private rightPinchDown = () => {
    print("RIGHT Pinch down")
    this.rightDown = true
    if (this.leftDown && this.isPinchClose()) {
      this.createScanner()
    }
  }

  private rightPinchUp = () => {
    print("RIGHT Pinch up")
    this.rightDown = false
  }

  isPinchClose() {
    return this.leftHand.thumbTip.position.distance(this.rightHand.thumbTip.position) < 10
  }

  createScanner() {
    const scanner = this.scannerPrefab.instantiate(this.getSceneObject())
  }
}
