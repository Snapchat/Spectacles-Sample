import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class Loading extends BaseScriptComponent {
  private loadingTrans: Transform
  private startScale: vec3

  onAwake() {
    this.loadingTrans = this.getSceneObject().getTransform()
    this.startScale = this.loadingTrans.getLocalScale()
    this.loadingTrans.setLocalScale(vec3.zero())
  }

  activateLoder(activate: boolean) {
    const currScale = this.loadingTrans.getLocalScale()
    const desiredScale = activate ? this.startScale : vec3.zero()
    animate({
      easing: "ease-out-elastic",
      duration: 0.5,
      update: (t) => {
        this.loadingTrans.setLocalScale(vec3.lerp(currScale, desiredScale, t))
      },
      ended: null,
      cancelSet: new CancelSet()
    })
  }
}
