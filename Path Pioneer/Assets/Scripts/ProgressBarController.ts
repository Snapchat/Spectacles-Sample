@component
export class ProgressBarController extends BaseScriptComponent {
  @input private pointer: SceneObject
  @input private textComponent: Text

  @input private Mats: Material[]
  @input private BarMat: Material

  @input private initialProgress: number = 0
  @input private globalOpacity: number = 1

  @input private startPosScreenTransform: ScreenTransform
  @input private endPosScreenTransform: ScreenTransform

  private pointerScreenTransform: ScreenTransform
  private startPos: vec2
  private endPos: vec2

  onAwake() {
    this.pointerScreenTransform = this.pointer.getComponent("Component.ScreenTransform")
    if (!this.pointerScreenTransform) {
      throw new Error("Pointer is required to have screen transform")
    }
    this.startPos = this.startPosScreenTransform.anchors.getCenter()
    this.endPos = this.endPosScreenTransform.anchors.getCenter()
    this.setProgress(this.initialProgress)
  }

  setProgress(newProgress: number) {
    const newPointerPosition = MathUtils.remap(newProgress, 0, 1, this.startPos.x, this.endPos.x)
    this.pointerScreenTransform.anchors.setCenter(new vec2(newPointerPosition, this.startPos.y))
    this.BarMat.mainPass.currentPosition = newProgress
    const item = this.textComponent
    item.text = Math.floor(newProgress * 100) + "%"
  }
}
