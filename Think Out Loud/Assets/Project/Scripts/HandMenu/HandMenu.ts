import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand";
import { SIK } from "SpectaclesInteractionKit.lspkg/SIK";
import { LSTween } from "LSTween.lspkg/LSTween";
import Easing from "LSTween.lspkg/TweenJS/Easing";
import { MatchTransform } from "../Utils/MatchTransform";
import { AnimationTimer } from "./AnimationTimer";

/**
 * Simple Hand Menu Controller
 * Instantiates hand menu at wrist position when right hand palm is facing camera
 * Uses direct positioning logic similar to MenuPositioner
 */
@component
export class HandMenu extends BaseScriptComponent {
  @input
  @hint("Hand menu prefab to instantiate")
  handMenuPrefab: ObjectPrefab;

  @input
  @hint("Timer prefab to instantiate during delay period")
  timerPrefab: ObjectPrefab;


  @input
  @hint("Head pose target for positioning calculations")
  headPoseTarget: SceneObject;

  @input
  @hint("Position offset from wrist (X, Y, Z)")
  positionOffset: vec3 = new vec3(0.3, 0.1, 0.0);

  @input
  @hint("Delay before showing menu when palm is detected (seconds)")
  @widget(new SliderWidget(0.1, 3.0, 0.1))
  showDelay: number = 0.5;

  @input
  @hint("Delay before hiding menu when palm is lost (seconds)")
  @widget(new SliderWidget(0.1, 3.0, 0.1))
  hideDelay: number = 1.0;

  @input
  @hint("Initial scale for menu (starting scale)")
  @widget(new SliderWidget(0.0, 2.0, 0.1))
  initialScale: number = 0.0;

  @input
  @hint("End scale for menu (target scale)")
  @widget(new SliderWidget(0.1, 3.0, 0.1))
  endScale: number = 1.0;

  @input
  @hint("Animation time for scaling and positioning (in seconds)")
  @widget(new SliderWidget(0.1, 2.0, 0.1))
  animationTime: number = 0.5;

  @input
  @hint("Enable scaling animation on reveal")
  enableScaling: boolean = true;



  private leftHand: TrackedHand;
  private rightHand: TrackedHand;
  private currentHandMenu: SceneObject | null = null;
  private currentTimer: SceneObject | null = null; // Instantiated timer object
  private timerMatchTransform: MatchTransform | null = null; // MatchTransform component on timer
  private wristTargetObject: SceneObject | null = null; // Target object for timer positioning
  private isShowingPalm: boolean = false;
  private showDelayedEvent: DelayedCallbackEvent | null = null;
  private hideDelayedEvent: DelayedCallbackEvent | null = null;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart();
    });
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  onStart() {
    // Initialize hand tracking
    this.initializeHands();
    
    // Initialize timer with MatchTransform
    this.initializeTimer();
    
    print("HandMenu: Initialized hand tracking and timer");
  }

  private initializeHands() {
    try {
      this.leftHand = SIK.HandInputData.getHand("left");
      this.rightHand = SIK.HandInputData.getHand("right");
      print("HandMenu: Hands initialized successfully");
    } catch (error) {
      print("HandMenu: Error initializing hands - " + error);
    }
  }

  private initializeTimer() {
    if (!this.timerPrefab) {
      print("HandMenu: No timer prefab assigned");
      return;
    }

    // Create wrist target object for timer positioning
    this.wristTargetObject = global.scene.createSceneObject("WristTarget");
    print("HandMenu: Timer system initialized - ready to instantiate timer prefab");
  }

  onUpdate() {
    if (!this.leftHand || !this.rightHand) {
      return;
    }

    // Update wrist target position continuously
    if (this.wristTargetObject && this.rightHand.isTracked) {
      this.wristTargetObject.getTransform().setWorldPosition(this.rightHand.indexKnuckle.position);
    }

    // Check if right hand is showing palm
    const isRightPalmShowing = this.rightHand.isTracked && this.rightHand.isFacingCamera();
    
    if (isRightPalmShowing && !this.isShowingPalm) {
      // Only show timer if menu is not already visible
      if (!this.currentHandMenu || !this.currentHandMenu.enabled) {
        this.isShowingPalm = true;
        this.cancelHideDelay();
        this.scheduleShowMenu();
      }
    } else if (!isRightPalmShowing && this.isShowingPalm) {
      // Stopped showing palm - but don't hide menu, just stop showing timer
      this.isShowingPalm = false;
      this.cancelHideDelay();
      // Don't schedule hide menu - keep menu visible
    }
  }

  private scheduleShowMenu() {
    if (this.showDelayedEvent) {
      return; // Already scheduled
    }

    print("HandMenu: Scheduling menu show with delay: " + this.showDelay + "s");
    
    // Show timer during delay
    this.showTimer();
    
    this.showDelayedEvent = this.createEvent("DelayedCallbackEvent");
    this.showDelayedEvent.bind(() => {
      this.hideTimer();
      this.showMenu();
      this.showDelayedEvent = null;
    });
    this.showDelayedEvent.reset(this.showDelay);
  }

  private scheduleHideMenu() {
    if (this.hideDelayedEvent) {
      return; // Already scheduled
    }

    print("HandMenu: Scheduling menu hide with delay: " + this.hideDelay + "s");
    
    this.hideDelayedEvent = this.createEvent("DelayedCallbackEvent");
    this.hideDelayedEvent.bind(() => {
      this.hideMenu();
      this.hideDelayedEvent = null;
    });
    this.hideDelayedEvent.reset(this.hideDelay);
  }

  private cancelShowDelay() {
    if (this.showDelayedEvent) {
      this.showDelayedEvent.enabled = false;
      this.showDelayedEvent = null;
      this.hideTimer();
      print("HandMenu: Cancelled show delay and hid timer");
    }
  }

  private cancelHideDelay() {
    if (this.hideDelayedEvent) {
      this.hideDelayedEvent.enabled = false;
      this.hideDelayedEvent = null;
      print("HandMenu: Cancelled hide delay");
    }
  }

  private showTimer() {
    if (!this.timerPrefab) {
      print("HandMenu: No timer prefab assigned");
      return;
    }

    // Reuse existing timer or instantiate new one
    if (!this.currentTimer) {
      this.currentTimer = this.timerPrefab.instantiate(null);
      if (!this.currentTimer) {
        print("HandMenu: Failed to instantiate timer prefab");
        return;
      }

      // Get or create MatchTransform component on timer
      this.timerMatchTransform = this.currentTimer.getComponent(MatchTransform.getTypeName());
      if (!this.timerMatchTransform) {
        this.timerMatchTransform = this.currentTimer.createComponent(MatchTransform.getTypeName());
        print("HandMenu: Created MatchTransform component on timer");
      }

      // Set timer target to wrist target object
      this.timerMatchTransform.target = this.wristTargetObject;
      this.timerMatchTransform.positionOffset = new vec3(0, 0, 0); // No offset for timer
    }

    this.currentTimer.enabled = true;
    
    // Restart timer animation each time
    const animationTimer = this.currentTimer.getComponent(AnimationTimer.getTypeName());
    if (animationTimer) {
      // Call the public method to restart animation
      (animationTimer as AnimationTimer).startAnimationManually();
      print("HandMenu: Timer animation restarted");
    }
    
    print("HandMenu: Timer shown");
  }

  private hideTimer() {
    if (!this.currentTimer) {
      return;
    }

    this.currentTimer.enabled = false;
    print("HandMenu: Timer hidden");
  }

  private showMenu() {
    if (this.currentHandMenu && this.currentHandMenu.enabled) {
      print("HandMenu: Menu already visible");
      return;
    }

    if (!this.handMenuPrefab) {
      print("HandMenu: No hand menu prefab assigned");
      return;
    }

    if (!this.rightHand.isTracked) {
      print("HandMenu: Right hand not tracked, cannot show menu");
      return;
    }

    // Reuse existing menu or instantiate new one
    if (!this.currentHandMenu) {
      this.currentHandMenu = this.handMenuPrefab.instantiate(null);
      if (!this.currentHandMenu) {
        print("HandMenu: Failed to instantiate menu");
        return;
      }
    }

    // Enable and position menu
    this.currentHandMenu.enabled = true;
    this.positionMenuAtWrist();

    print("HandMenu: Menu shown at wrist position with offset");
  }

  /**
   * Position menu at hand position initially, then animate to offset position with scaling
   */
  private positionMenuAtWrist() {
    if (!this.currentHandMenu) {
      return;
    }

    if (!this.headPoseTarget) {
      print("HandMenu: No head pose target assigned for menu positioning");
      return;
    }

    if (!this.rightHand.isTracked) {
      print("HandMenu: Right hand not tracked for positioning");
      return;
    }

    // Get hand position (starting position)
    const handPosition = this.rightHand.indexKnuckle.position;
    
    // Calculate target position using head pose target as base
    const targetPosition = this.calculatePositionWithOffset(this.headPoseTarget.getTransform().getWorldPosition(), this.positionOffset);
    if (!targetPosition) {
      print("HandMenu: Could not calculate position");
      return;
    }

    // Enable menu
    this.currentHandMenu.enabled = true;
    print("HandMenu: Menu object enabled");

    // Position menu at hand position initially
    this.currentHandMenu.getTransform().setWorldPosition(handPosition);
    print(`HandMenu: Positioned at hand - ${handPosition.x.toFixed(2)}, ${handPosition.y.toFixed(2)}, ${handPosition.z.toFixed(2)}`);

    // Handle scaling and positioning animation based on enableScaling setting
    if (this.enableScaling) {
      this.animateScaleAndPosition(handPosition, targetPosition);
    } else {
      // Set menu to end scale and target position immediately (no animation)
      const menuTransform = this.currentHandMenu.getTransform();
      const fullScale = new vec3(this.endScale, this.endScale, this.endScale);
      menuTransform.setLocalScale(fullScale);
      menuTransform.setWorldPosition(targetPosition);
      print(`HandMenu: Menu scale set to ${this.endScale} and positioned at target immediately (animation disabled)`);
    }
  }

  /**
   * Calculate the target position based on head pose position and offset (like MenuPositioner)
   */
  private calculatePositionWithOffset(headPosition: vec3, offset: vec3): vec3 | null {
    if (!this.headPoseTarget) {
      print("HandMenu: No head pose target for position calculation");
      return null;
    }

    const headTransform = this.headPoseTarget.getTransform();
    const headPos = headTransform.getWorldPosition();
    
    // Get head rotation for orientation
    const headRotation = headTransform.getWorldRotation();
    
    // Get the forward direction from head pose
    const forward = this.getForwardVector(headRotation);
    const flattenedForward = this.normalizeVector(new vec3(forward.x, 0, forward.z));
    
    // Get the right direction from head pose
    const right = this.getRightVector(headRotation);
    const flattenedRight = this.normalizeVector(new vec3(right.x, 0, right.z));
    
    // Calculate new position using the flattened directions (like MenuPositioner)
    return new vec3(
      headPos.x + flattenedRight.x * offset.x + offset.y * 0 + flattenedForward.x * offset.z,
      headPos.y + flattenedRight.y * offset.x + offset.y * 1 + flattenedForward.y * offset.z,
      headPos.z + flattenedRight.z * offset.x + offset.y * 0 + flattenedForward.z * offset.z
    );
  }

  /**
   * Animate menu scale and position simultaneously from hand to offset position
   */
  private animateScaleAndPosition(startPosition: vec3, endPosition: vec3) {
    if (!this.currentHandMenu) {
      print("HandMenu: No menu object for scale and position animation");
      return;
    }

    const menuTransform = this.currentHandMenu.getTransform();
    const startScale = new vec3(this.initialScale, this.initialScale, this.initialScale);
    const endScale = new vec3(this.endScale, this.endScale, this.endScale);
    const duration = this.animationTime * 1000; // Convert to milliseconds

    // Set initial scale
    menuTransform.setLocalScale(startScale);

    // Animate scale and position simultaneously
    LSTween.scaleToLocal(menuTransform, endScale, duration)
      .easing(Easing.Quadratic.Out)
      .start();

    LSTween.moveToWorld(menuTransform, endPosition, duration)
      .easing(Easing.Quadratic.Out)
      .onComplete(() => {
        print(`HandMenu: Scale and position animation completed - menu at scale ${this.endScale} and target position`);
      })
      .start();

    print(`HandMenu: Started scale and position animation from ${this.initialScale} to ${this.endScale} over ${this.animationTime}s`);
    print(`HandMenu: Animating from hand position to offset position over ${this.animationTime}s`);
  }

  /**
   * Get the forward vector from a rotation
   */
  private getForwardVector(rotation: quat): vec3 {
    return this.rotateVectorByQuaternion(new vec3(0, 0, 1), rotation);
  }

  /**
   * Get the right vector from a rotation
   */
  private getRightVector(rotation: quat): vec3 {
    return this.rotateVectorByQuaternion(new vec3(1, 0, 0), rotation);
  }

  /**
   * Rotate a vector by a quaternion
   */
  private rotateVectorByQuaternion(vector: vec3, rotation: quat): vec3 {
    const x = rotation.x;
    const y = rotation.y;
    const z = rotation.z;
    const w = rotation.w;

    // Apply the quaternion rotation to the vector
    const ix = w * vector.x + y * vector.z - z * vector.y;
    const iy = w * vector.y + z * vector.x - x * vector.z;
    const iz = w * vector.z + x * vector.y - y * vector.x;
    const iw = -x * vector.x - y * vector.y - z * vector.z;

    const result = new vec3(
      ix * w + iw * -x + iy * -z - iz * -y,
      iy * w + iw * -y + iz * -x - ix * -z,
      iz * w + iw * -z + ix * -y - iy * -x
    );

    return result;
  }

  /**
   * Normalize a vector to unit length
   */
  private normalizeVector(v: vec3): vec3 {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

    if (length < 0.0001) {
      return new vec3(0, 0, 0);
    }

    return new vec3(
      v.x / length,
      v.y / length,
      v.z / length
    );
  }

  private hideMenu() {
    if (!this.currentHandMenu) {
      return;
    }

    print("HandMenu: Hiding menu");
    this.currentHandMenu.enabled = false;
    // Don't set to null - keep for reuse
  }

  /**
   * Public method to manually show menu (for testing)
   */
  public showMenuManually() {
    this.cancelHideDelay();
    this.scheduleShowMenu();
  }

  /**
   * Public method to manually hide menu
   */
  public hideMenuManually() {
    this.cancelShowDelay();
    this.scheduleHideMenu();
  }
}
