import { LSTween } from "LSTween.lspkg/LSTween";
import Easing from "LSTween.lspkg/TweenJS/Easing";

@component
export class InternetAvailabilityPopUp extends BaseScriptComponent {
  @input popup: SceneObject;

  onAwake() {
    global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
      this.isInternetAvailable(args.isInternetAvailable);
    });
    this.isInternetAvailable(global.deviceInfoSystem.isInternetAvailable(), 0);
  }

  isInternetAvailable = (bool: boolean, timeOverride = 300) => {
    if (bool) {
      LSTween.scaleToLocal(
        this.popup.getChild(0).getTransform(),
        vec3.one().uniformScale(0.01),
        timeOverride
      )
        .easing(Easing.Cubic.Out)
        .onComplete(() => {
          this.popup.enabled = false;
        })
        .start();
    } else {
      LSTween.scaleToLocal(
        this.popup.getChild(0).getTransform(),
        vec3.one(),
        timeOverride
      )
        .easing(Easing.Cubic.In)
        .start();
      this.popup.enabled = true;
    }
  };
}
