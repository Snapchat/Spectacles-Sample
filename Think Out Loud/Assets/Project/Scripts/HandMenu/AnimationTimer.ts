import { RotationInterpolationType } from "LSTween.lspkg/RotationInterpolationType";
import Easing from "LSTween.lspkg/TweenJS/Easing";
import { LSTween } from "LSTween.lspkg/LSTween";

/**
 * AnimationTimer - Animates scale and rotation with looping
 * Animates from A to B and back to A continuously
 */
@component
export class AnimationTimer extends BaseScriptComponent {
    @input
    @hint("Minimum rotation values in degrees")
    minRotation: vec3 = new vec3(-45, -45, -45);

    @input
    @hint("Maximum rotation values in degrees")
    maxRotation: vec3 = new vec3(45, 45, 45);

    @input
    @hint("Minimum scale values")
    minScale: vec3 = new vec3(0.5, 0.5, 0.5);

    @input
    @hint("Maximum scale values")
    maxScale: vec3 = new vec3(2, 2, 2);

    @input
    @hint("Animation time in seconds for complete loop (A→B→A)")
    @widget(new SliderWidget(0.5, 5.0, 0.1))
    animationTime: number = 1.5;

    private transform: Transform;
    private isAnimating: boolean = false;
    private currentScaleTween: any = null;
    private currentRotationTween: any = null;

  onAwake() {
    this.transform = this.getTransform();
    if (!this.transform) {
      print("AnimationTimer: No transform found on object");
      return;
    }

    // Set initial values
    this.transform.setLocalScale(this.minScale);
    this.transform.setLocalPosition(new vec3(0, 0, 0));

    // Start animation
    this.startAnimation();
  }

  onEnable() {
    // Restart animation when object is enabled
    this.resetToInitial();
    this.startAnimation();
    print("AnimationTimer: Object enabled - animation restarted");
  }

    private startAnimation() {
        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;
        this.animateToMax();
    }

    private animateToMax() {
        if (!this.isAnimating) {
            return;
        }

        print("AnimationTimer: Animating to max values");

        // Convert rotation degrees to radians
        const startRotation = quat.fromEulerAngles(
            this.minRotation.x * MathUtils.DegToRad,
            this.minRotation.y * MathUtils.DegToRad,
            this.minRotation.z * MathUtils.DegToRad
        );

        const endRotation = quat.fromEulerAngles(
            this.maxRotation.x * MathUtils.DegToRad,
            this.maxRotation.y * MathUtils.DegToRad,
            this.maxRotation.z * MathUtils.DegToRad
        );

        // Set initial rotation
        this.transform.setLocalRotation(startRotation);

        // Calculate half time for each direction
        const halfTime = (this.animationTime * 1000) / 2;

        // Animate scale to max
        this.currentScaleTween = LSTween.scaleFromToLocal(this.transform, this.minScale, this.maxScale, halfTime)
            .easing(Easing.Circular.InOut)
            .onStart(() => {
                print("AnimationTimer: Scale animation to max started");
            })
            .onComplete(() => {
                print("AnimationTimer: Scale animation to max completed");
                this.animateToMin();
            })
            .start();

        // Animate rotation to max
        this.currentRotationTween = LSTween.rotateFromToLocal(this.transform, startRotation, endRotation, halfTime, RotationInterpolationType.SLERP)
            .easing(Easing.Cubic.In)
            .onStart(() => {
                print("AnimationTimer: Rotation animation to max started");
            })
            .onComplete(() => {
                print("AnimationTimer: Rotation animation to max completed");
            })
            .start();
    }

    private animateToMin() {
        if (!this.isAnimating) {
            return;
        }

        print("AnimationTimer: Animating to min values");

        // Convert rotation degrees to radians
        const startRotation = quat.fromEulerAngles(
            this.maxRotation.x * MathUtils.DegToRad,
            this.maxRotation.y * MathUtils.DegToRad,
            this.maxRotation.z * MathUtils.DegToRad
        );

        const endRotation = quat.fromEulerAngles(
            this.minRotation.x * MathUtils.DegToRad,
            this.minRotation.y * MathUtils.DegToRad,
            this.minRotation.z * MathUtils.DegToRad
        );

        // Set initial rotation
        this.transform.setLocalRotation(startRotation);

        // Calculate half time for each direction
        const halfTime = (this.animationTime * 1000) / 2;

        // Animate scale to min
        this.currentScaleTween = LSTween.scaleFromToLocal(this.transform, this.maxScale, this.minScale, halfTime)
            .easing(Easing.Circular.InOut)
            .onStart(() => {
                print("AnimationTimer: Scale animation to min started");
            })
            .onComplete(() => {
                print("AnimationTimer: Scale animation to min completed");
                print("AnimationTimer: Complete loop finished");
                this.isAnimating = false;
            })
            .start();

        // Animate rotation to min
        this.currentRotationTween = LSTween.rotateFromToLocal(this.transform, startRotation, endRotation, halfTime, RotationInterpolationType.SLERP)
            .easing(Easing.Cubic.In)
            .onStart(() => {
                print("AnimationTimer: Rotation animation to min started");
            })
            .onComplete(() => {
                print("AnimationTimer: Rotation animation to min completed");
            })
            .start();
    }

    /**
     * Stop the animation
     */
    public stopAnimation() {
        this.isAnimating = false;
        
        if (this.currentScaleTween) {
            this.currentScaleTween.stop();
            this.currentScaleTween = null;
        }
        
        if (this.currentRotationTween) {
            this.currentRotationTween.stop();
            this.currentRotationTween = null;
        }
        
        print("AnimationTimer: Animation stopped");
    }

    /**
     * Start the animation
     */
    public startAnimationManually() {
        this.startAnimation();
    }

    /**
     * Reset to initial state
     */
    public resetToInitial() {
        this.stopAnimation();
        this.transform.setLocalScale(this.minScale);
        
        const initialRotation = quat.fromEulerAngles(
            this.minRotation.x * MathUtils.DegToRad,
            this.minRotation.y * MathUtils.DegToRad,
            this.minRotation.z * MathUtils.DegToRad
        );
        this.transform.setLocalRotation(initialRotation);
        
        print("AnimationTimer: Reset to initial state");
    }
}
