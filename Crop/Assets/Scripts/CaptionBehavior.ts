import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class CaptionBehavior extends BaseScriptComponent {
  @input captionText: Text
  @input scaleObj: SceneObject

  private trans: Transform
  private scaleTrans: Transform
  private startPos: vec3

  private scaleCancel: CancelSet = new CancelSet()

  onAwake() {
    this.trans = this.getSceneObject().getTransform()
    this.scaleTrans = this.scaleObj.getTransform()
    this.scaleTrans.setLocalScale(vec3.zero())
  }

  openCaption(text: string, pos: vec3, rot: quat) {
    this.startPos = pos
    this.captionText.text = text
    this.trans.setWorldPosition(pos)
    this.trans.setWorldRotation(rot)
    this.trans.setWorldScale(vec3.one().uniformScale(0.5))
    //animate in caption
    if (this.scaleCancel) this.scaleCancel.cancel()
    animate({
      easing: "ease-out-elastic",
      duration: 1,
      update: (t: number) => {
        this.scaleTrans.setLocalScale(vec3.lerp(vec3.zero(), vec3.one().uniformScale(1.33), t))
      },
      ended: null,
      cancelSet: this.scaleCancel
    })
  }
}
