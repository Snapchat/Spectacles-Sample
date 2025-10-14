import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";

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
      const tr = this.popup.getChild(0).getTransform();
      const start = tr.getLocalScale();
      const end = vec3.one().uniformScale(0.01);
      animate({
        duration: (timeOverride ?? 300) / 1000,
        easing: "ease-out-cubic",
        update: (t) => {
          const x = start.x + (end.x - start.x) * t;
          const y = start.y + (end.y - start.y) * t;
          const z = start.z + (end.z - start.z) * t;
          tr.setLocalScale(new vec3(x, y, z));
        },
        ended: () => {
          this.popup.enabled = false;
        },
      });
    } else {
      const tr = this.popup.getChild(0).getTransform();
      const start = tr.getLocalScale();
      const end = vec3.one();
      animate({
        duration: (timeOverride ?? 300) / 1000,
        easing: "ease-in-cubic",
        update: (t) => {
          const x = start.x + (end.x - start.x) * t;
          const y = start.y + (end.y - start.y) * t;
          const z = start.z + (end.z - start.z) * t;
          tr.setLocalScale(new vec3(x, y, z));
        },
      });
      this.popup.enabled = true;
    }
  };
}
