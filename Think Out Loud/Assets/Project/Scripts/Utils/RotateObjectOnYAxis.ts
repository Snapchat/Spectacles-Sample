import { LSTween } from "LSTween.lspkg/LSTween";
import { RotationInterpolationType } from "LSTween.lspkg/RotationInterpolationType";

@component
export class RotateObjectOnYAxis extends BaseScriptComponent {
  @input
  @hint("Rotation speed in degrees per second")
  @widget(new SliderWidget(10, 360, 1))
  rotationSpeed: number = 90;

  private transform: Transform;
  private currentRotation: number = 0;

  onAwake() {
    this.transform = this.getTransform();
    
    // Create update event for continuous rotation
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  onUpdate() {
    // Calculate rotation delta based on speed and delta time
    const deltaTime = getDeltaTime();
    const rotationDelta = this.rotationSpeed * deltaTime;
    
    // Apply rotation
    this.currentRotation += rotationDelta;
    const rotationRadians = this.currentRotation * MathUtils.DegToRad;
    const rotationQuat = quat.angleAxis(rotationRadians, vec3.up());
    this.transform.setLocalRotation(rotationQuat);
  }
}