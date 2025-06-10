import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { LSTween } from "LSTween.lspkg/LSTween";
import Easing from "LSTween.lspkg/TweenJS/Easing";
import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation";

import { HandInputData } from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandInputData";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";

import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class SphereController extends BaseScriptComponent {
  @ui.separator
  @ui.label("Manages the UI and hand intereactions for the AI assistant")
  @ui.separator
  @input
  private hoverMat: Material;

  @input
  private orbInteractableObj: SceneObject;

  @input
  private orbObject: SceneObject;

  @input
  private orbVisualParent: SceneObject;

  @input
  private orbScreenPosition: SceneObject;

  @input
  private closeObj: SceneObject;

  @input
  private closeButtonInteractable: SceneObject;

  @input
  private worldSpaceText: Text;

  @input
  private screenSpaceText: Text;

  @input
  private uiParent: SceneObject;

  private wasInFOV: boolean = true;

  private interactable: Interactable;
  private manipulate: InteractableManipulation;
  private orbButton: PinchButton;
  private closeButton: PinchButton;

  // Get SIK data
  private handProvider: HandInputData = HandInputData.getInstance();
  private menuHand = this.handProvider.getHand("left");

  private trackedToHand: boolean = true;
  private wcfmp = WorldCameraFinderProvider.getInstance();

  private minimizedSize: vec3 = vec3.one().uniformScale(0.3);
  private fullSize: vec3 = vec3.one();

  public isActivatedEvent: Event<boolean> = new Event<boolean>();

  onAwake() {
    this.interactable = this.orbInteractableObj.getComponent(
      Interactable.getTypeName()
    );
    this.manipulate = this.orbInteractableObj.getComponent(
      InteractableManipulation.getTypeName()
    );
    this.orbButton = this.orbInteractableObj.getComponent(
      PinchButton.getTypeName()
    );
    this.closeButton = this.closeButtonInteractable.getComponent(
      PinchButton.getTypeName()
    );
    this.setIsTrackedToHand(true);
    this.createEvent("OnStartEvent").bind(this.init.bind(this));
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    this.hoverMat.mainPass.activeHover = 0;
    this.uiParent.enabled = false;
  }

  initializeUI() {
    this.uiParent.enabled = true;
  }

  private setIsTrackedToHand(value: boolean) {
    this.trackedToHand = value;
    this.manipulate.enabled = !value;
    if (value) {
      this.setOrbToScreenPosition(true);
      LSTween.scaleToLocal(
        this.orbObject.getTransform(),
        this.minimizedSize,
        600
      )
        .easing(Easing.Quadratic.InOut)
        .start();

      LSTween.scaleToLocal(
        this.closeObj.getTransform(),
        vec3.one().uniformScale(0.1),
        600
      )
        .easing(Easing.Quadratic.InOut)
        .onComplete(() => {
          this.closeButton.sceneObject.enabled = false;
        })
        .start();
      this.screenSpaceText.enabled = false;
      this.worldSpaceText.enabled = false;
    } else {
      LSTween.scaleToLocal(this.orbObject.getTransform(), this.fullSize, 400)
        .easing(Easing.Quadratic.InOut)
        .start();
      let worldPos = this.wcfmp.getForwardPosition(100);
      LSTween.moveToWorld(this.orbObject.getTransform(), worldPos, 600)
        .easing(Easing.Quadratic.InOut)
        .start();

      this.closeButton.sceneObject.enabled = true;
      LSTween.scaleToLocal(this.closeObj.getTransform(), vec3.one(), 600)
        .easing(Easing.Quadratic.InOut)
        .start();
      this.screenSpaceText.enabled = false;
      this.worldSpaceText.enabled = true;
    }

    this.isActivatedEvent.invoke(!value);
  }

  private init() {
    this.interactable.onHoverEnter.add(() => {
      LSTween.rawTween(200)
        .onUpdate((tweenData) => {
          let percent = tweenData.t as number;
          this.hoverMat.mainPass.activeHover = percent;
        })
        .start();
    });

    this.interactable.onHoverExit.add(() => {
      LSTween.rawTween(200)
        .onUpdate((tweenData) => {
          let percent = 1 - (tweenData.t as number);
          this.hoverMat.mainPass.activeHover = percent;
        })
        .start();
    });

    this.orbButton.onButtonPinched.add(() => {
      if (this.trackedToHand) {
        this.setIsTrackedToHand(false);
      }
    });

    this.closeButton.onButtonPinched.add(() => {
      if (!this.trackedToHand) {
        this.setIsTrackedToHand(true);
      }
    });
  }

  private onUpdate() {
    this.positionByHand();
    this.keepActiveOrbVisible();
  }

  private positionByHand() {
    let objectToTransform = this.orbObject.getTransform();
    if (!this.trackedToHand) {
      objectToTransform = this.closeObj.getTransform();
    }
    let handPosition = this.menuHand.pinkyKnuckle.position;
    let handRight = this.menuHand.indexTip.right;

    let curPosition = objectToTransform.getWorldPosition();
    let menuPosition = handPosition.add(handRight.uniformScale(4));

    if (global.deviceInfoSystem.isEditor()) {
      menuPosition = this.wcfmp.getWorldPosition().add(new vec3(0, -20, -25));
    }

    let nPosition = vec3.lerp(curPosition, menuPosition, 0.2);
    objectToTransform.setWorldPosition(nPosition);

    var billboardPos = this.wcfmp
      .getWorldPosition()
      .add(this.wcfmp.forward().uniformScale(5));
    billboardPos = billboardPos.add(this.wcfmp.right().uniformScale(-5));
    let dir = billboardPos.sub(menuPosition).normalize();
    objectToTransform.setWorldRotation(quat.lookAt(dir, vec3.up()));

    if (
      (!this.menuHand.isTracked() || !this.menuHand.isFacingCamera()) &&
      !global.deviceInfoSystem.isEditor()
    ) {
      objectToTransform.getSceneObject().enabled = false;
    } else {
      objectToTransform.getSceneObject().enabled = true;
    }
  }

  private setOrbToScreenPosition(inScrPos: boolean) {
    if (!inScrPos) {
      this.orbVisualParent.setParent(this.orbScreenPosition);
      this.orbVisualParent.getTransform().setLocalPosition(vec3.zero());
      LSTween.scaleFromToLocal(
        this.orbVisualParent.getTransform(),
        vec3.one().uniformScale(0.01),
        vec3.one().uniformScale(0.3),
        200
      ).start();
      this.screenSpaceText.enabled = true;
      this.worldSpaceText.enabled = false;
    } else {
      this.orbVisualParent.setParent(this.orbObject);
      this.orbVisualParent.getTransform().setLocalPosition(vec3.zero());
      LSTween.scaleToLocal(
        this.orbVisualParent.getTransform(),
        vec3.one(),
        200
      ).start();
      this.screenSpaceText.enabled = false;
      this.worldSpaceText.enabled = true;
    }
  }

  private keepActiveOrbVisible() {
    if (this.trackedToHand) {
      return;
    }
    let orbPos = this.orbObject.getTransform().getWorldPosition();
    let inFov = this.wcfmp.inFoV(orbPos);
    if (inFov !== this.wasInFOV) {
      this.setOrbToScreenPosition(inFov);
    }
    this.wasInFOV = inFov;
  }

  public setText(data: { text: string; completed: boolean }) {
    if (data.completed) {
      this.worldSpaceText.text = data.text;
      this.screenSpaceText.text = data.text;
    } else {
      this.worldSpaceText.text += data.text;
      this.screenSpaceText.text += data.text;
    }
  }
}
