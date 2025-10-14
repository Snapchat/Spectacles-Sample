import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { HandInputData } from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandInputData";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import animate, {
  CancelSet,
} from "SpectaclesInteractionKit.lspkg/Utils/animate";

@component
export class HandDockedMenu extends BaseScriptComponent {
  private menuButtons: SceneObject[] = [];
  private menuButtonTransforms: Transform[] = [];
  private buttonAnimations: CancelSet[] = [];

  private isShown: boolean = false;

  @input
  public buttonHorizontalSpacing: number = 1;

  private handProvider: HandInputData = SIK.HandInputData;
  private menuHand = this.handProvider.getHand("left");

  private mCamera = WorldCameraFinderProvider.getInstance();

  onAwake() {
    for (
      let index = 0;
      index < this.getSceneObject().getChildrenCount();
      index++
    ) {
      this.menuButtons[index] = this.getSceneObject().getChild(index);
      this.menuButtonTransforms[index] = this.getSceneObject()
        .getChild(index)
        .getTransform();
    }

    this.layoutMenu();

    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));

    let delay = this.createEvent("DelayedCallbackEvent");
    delay.bind(() => {
      if (global.deviceInfoSystem.isEditor()) {
        this.showMenu();
      } else {
        this.hideMenu();
      }
    });
    delay.reset(0.25);
  }

  onUpdate() {
    this.positionMenu();
    this.checkforMenuActivation();
  }

  layoutMenu() {
    for (let index = 0; index < this.menuButtons.length; index++) {
      let buttonTransform = this.menuButtonTransforms[index];
      buttonTransform.setLocalPosition(
        new vec3(this.buttonHorizontalSpacing * (index + 1), 0, 0)
      );
      buttonTransform.setLocalRotation(quat.quatIdentity());
    }
  }

  checkforMenuActivation() {
    if (global.deviceInfoSystem.isEditor()) {
      return;
    }

    if (this.menuHand.isTracked() && this.menuHand.isFacingCamera()) {
      if (!this.isShown) {
        this.showMenu();
      }
    } else {
      if (this.isShown) {
        this.hideMenu();
      }
    }
  }

  positionMenu() {
    let handPosition = this.menuHand.pinkyKnuckle.position;
    let handRight = this.menuHand.indexTip.right;

    let curPosition = this.getSceneObject().getTransform().getWorldPosition();
    let menuPosition = handPosition.add(handRight.uniformScale(1.5));

    if (global.deviceInfoSystem.isEditor()) {
      menuPosition = this.mCamera.getWorldPosition().add(new vec3(0, -20, -25));
    }

    let nPosition = vec3.lerp(curPosition, menuPosition, 0.2);
    this.getSceneObject().getTransform().setWorldPosition(nPosition);

    var billboardPos = this.mCamera
      .getWorldPosition()
      .add(this.mCamera.forward().uniformScale(5));
    billboardPos = billboardPos.add(this.mCamera.right().uniformScale(-5));
    let dir = billboardPos.sub(menuPosition).normalize();
    this.getSceneObject()
      .getTransform()
      .setWorldRotation(quat.lookAt(dir, vec3.up()));
  }

  showMenu() {
    this.isShown = true;
    for (var i = 0; i < this.menuButtons.length; i++) {
      let btn = this.menuButtons[i];
      btn.enabled = true;

      if (i < this.buttonAnimations.length) {
        this.buttonAnimations[i]();
      } else {
        this.buttonAnimations[i] = new CancelSet();
      }

      animate({
        cancelSet: this.buttonAnimations[i],
        duration: 0.2,
        delayFrames: i * 4,
        update: (t: number) => {
          //btn.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial.mainPass.opacity = MathUtils.lerp(0, 1, t)
          let s = MathUtils.lerp(1.0, 1.3, t);
          btn.getTransform().setLocalScale(new vec3(s, s, s));
        },
      });
    }
  }

  hideMenu() {
    this.isShown = false;
    this.menuButtons.forEach((btn) => {
      btn.enabled = false;
    });
  }
}
