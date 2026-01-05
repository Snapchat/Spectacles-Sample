import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class InternetAvailabilityPopUp extends BaseScriptComponent {
  @input popup: SceneObject
  private _cancelAnim: (() => void) | null = null

  onAwake() {
    global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
      this.isInternetAvailable(args.isInternetAvailable)
    })
    this.isInternetAvailable(global.deviceInfoSystem.isInternetAvailable(), 0)
  }

  isInternetAvailable = (bool: boolean, timeOverride = 300) => {
    const rootObj = this.popup?.getChild(0)
    if (!rootObj) {
      return
    }

    const tr = rootObj.getTransform()
    const currentScale = tr.getLocalScale() || vec3.one()
    const targetScale = bool ? vec3.one().uniformScale(0.01) : vec3.one()
    const durationSec = (timeOverride ?? 300) / 1000

    if (this._cancelAnim) {
      this._cancelAnim()
      this._cancelAnim = null
    }

    if (durationSec <= 0) {
      tr.setLocalScale(targetScale)
      this.popup.enabled = !bool
      return
    }

    if (!bool) {
      this.popup.enabled = true
    }

    const sx = currentScale.x
    const sy = currentScale.y
    const sz = currentScale.z
    const ex = targetScale.x
    const ey = targetScale.y
    const ez = targetScale.z

    this._cancelAnim = animate({
      duration: durationSec,
      easing: bool ? "ease-out-cubic" : "ease-in-cubic",
      update: (t: number) => {
        const nx = sx + (ex - sx) * t
        const ny = sy + (ey - sy) * t
        const nz = sz + (ez - sz) * t
        tr.setLocalScale(new vec3(nx, ny, nz))
      },
      ended: () => {
        this._cancelAnim = null
        if (bool) {
          this.popup.enabled = false
        }
      }
    })
  }
}
