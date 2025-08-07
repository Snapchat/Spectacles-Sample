import {
  PlacementMode,
  PlacementSettings,
} from "Surface Placement.lspkg/Scripts/PlacementSettings";

import { AnimationController } from "./AnimationController";
import { ButtonStateKey } from "GameController.lspkg/Scripts/ButtonState";
import { CharacterController } from "SpecsCharacterController.lspkg/Character Controller/Character Controller";
import { GameController } from "GameController.lspkg/GameController";
import { SurfacePlacementController } from "Surface Placement.lspkg/Scripts/SurfacePlacementController";

@component
export class SceneController extends BaseScriptComponent {
  @input
  @allowUndefined
  objectVisuals: SceneObject;

  @input characterController: CharacterController;
  @input animationController: AnimationController;
  @input cameraObj: SceneObject;

  @input("int")
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Near Surface", 0),
      new ComboBoxItem("Horizontal", 1),
    ])
  )
  placementSettingMode: number = 0;

  private transform: Transform = null;
  private camTrans: Transform = null;

  private surfacePlacement: SurfacePlacementController =
    SurfacePlacementController.getInstance();

  private gameController: GameController = GameController.getInstance();

  onAwake() {
    this.camTrans = this.cameraObj.getTransform();
    this.transform = this.getSceneObject().getTransform();
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    this.objectVisuals.enabled = false;

    //HACK: EDITOR TEST:
    this.createEvent("TapEvent").bind(() => {
      this.JumpButtonDown(true);
      //this.KickButtonDown(true);
      //this.PunchButtonDown(true);
    });
  }

  private onStart() {
    this.startPlacement();
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    this.gameController.scanForControllers();
    //register button presses
    this.gameController.onButtonStateChanged(
      ButtonStateKey.a,
      this.JumpButtonDown.bind(this)
    );
    this.gameController.onButtonStateChanged(
      ButtonStateKey.x,
      this.PunchButtonDown.bind(this)
    );
    this.gameController.onButtonStateChanged(
      ButtonStateKey.b,
      this.KickButtonDown.bind(this)
    );
    this.gameController.onButtonStateChanged(
      ButtonStateKey.y,
      this.sendRumble.bind(this)
    );
  }

  private sendRumble(pressed: boolean) {
    if (pressed) {
      this.gameController.sendRumble(20, 10);
    }
  }

  private JumpButtonDown(pressed: boolean) {
    if (pressed) {
      this.animationController.playJumpAnimation();
    }
  }

  private PunchButtonDown(pressed: boolean) {
    if (pressed) {
      this.animationController.playPunchAnimation();
    }
  }

  private KickButtonDown(pressed: boolean) {
    if (pressed) {
      this.animationController.playKickAnimation();
    }
  }

  startPlacement() {
    this.objectVisuals.enabled = false;
    var placementSettings = new PlacementSettings(PlacementMode.HORIZONTAL);
    if (this.placementSettingMode == 0) {
      placementSettings = new PlacementSettings(
        PlacementMode.NEAR_SURFACE,
        true, // use surface adjustment widget
        vec3.zero(), // offset in cm of widget from surface center
        this.onSliderUpdated.bind(this) // callback from widget height changes
      );
    }
    this.surfacePlacement.startSurfacePlacement(
      placementSettings,
      (pos, rot) => {
        this.onSurfaceDetected(pos, rot);
      }
    );
  }

  resetPlacement() {
    this.surfacePlacement.stopSurfacePlacement();
    this.startPlacement();
  }

  private onSliderUpdated(pos: vec3) {
    this.transform.setWorldPosition(pos);
  }

  private onSurfaceDetected(pos: vec3, rot: quat) {
    this.objectVisuals.enabled = true;
    this.transform.setWorldPosition(pos);
    this.transform.setWorldRotation(rot);
    this.characterController.setPosition(pos);
    this.characterController.setInputType(
      global.deviceInfoSystem.isEditor() ? 1 : 0
    );
  }

  private onUpdate() {
    var buttonState = this.gameController.getButtonState();
    if (!buttonState) {
      return;
    }
    //set button states in update instead of on value value changed since vertical and horizontal would come in at different times
    var moveSpeed = new vec2(
      Math.abs(buttonState.lx),
      Math.abs(buttonState.ly)
    ).distance(vec2.zero()); //0 - 1

    var joystickMoveDirection = new vec3(
      buttonState.lx,
      0,
      buttonState.ly
    ).normalize();

    // Convert joystick input into world space relative to camera’s facing direction
    var moveDir = this.camTrans
      .getWorldTransform()
      .multiplyDirection(joystickMoveDirection)
      .normalize();

    if (moveSpeed < 0.15) {
      moveSpeed = 0;
      moveDir = vec3.zero();
    }

    this.characterController.move(moveDir);
    this.characterController.setTargetSpeedModifier(moveSpeed);
  }
}
