/**
 * MatchTransform - Simple utility to match transform of one object to another
 * Used for positioning timer and menu objects
 */
@component
export class MatchTransform extends BaseScriptComponent {
  public target: SceneObject;

  @input
  @hint("Position offset relative to the target's position")
  positionOffset: vec3 = new vec3(0, 0, 0);

  @input
  @hint("Use lerping for smooth position transitions")
  usePositionLerp: boolean = true;

  @input
  @hint("Speed for moving towards the target's position (when lerping is enabled)")
  @widget(new SliderWidget(0.1, 20.0, 0.1))
  positionLerpSpeed: number = 8.0;

  @input
  @hint("Use lerping for smooth rotation transitions")
  useRotationLerp: boolean = true;

  @input
  @hint("Speed for rotating towards the target's rotation (when lerping is enabled)")
  @widget(new SliderWidget(0.1, 20.0, 0.1))
  rotationLerpSpeed: number = 6.0;

  @input
  @hint("Whether to match the target's rotation")
  matchRotation: boolean = true;

  @input
  @hint("Whether to match the target's scale")
  matchScale: boolean = false;

  onAwake() {
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  onUpdate() {
    if (!this.target) {
      return; // Target will be set programmatically by HandMenu
    }
    this.updateTransform();
  }

  private updateTransform() {
    const myTransform = this.getTransform();
    const targetTransform = this.target.getTransform();

    // Update Position with proper local offset
    const targetPos = targetTransform.getWorldPosition();
    const targetRot = targetTransform.getWorldRotation();
    
    // Transform offset by target's rotation to get local space offset
    const rotatedOffset = this.rotateVectorByQuaternion(this.positionOffset, targetRot);
    const finalPos = new vec3(
      targetPos.x + rotatedOffset.x,
      targetPos.y + rotatedOffset.y,
      targetPos.z + rotatedOffset.z
    );
    
    const currentPos = myTransform.getWorldPosition();
    let newPos = this.usePositionLerp
      ? this.lerpVector(currentPos, finalPos, this.positionLerpSpeed * getDeltaTime())
      : finalPos;
    myTransform.setWorldPosition(newPos);

    // Update Rotation
    if (this.matchRotation) {
      const currentRot = myTransform.getWorldRotation();
      let newRot = this.useRotationLerp
        ? quat.slerp(currentRot, targetRot, this.rotationLerpSpeed * getDeltaTime())
        : targetRot;
      myTransform.setWorldRotation(newRot);
    }

    // Update Scale (optional)
    if (this.matchScale) {
      const targetScale = targetTransform.getWorldScale();
      const currentScale = myTransform.getLocalScale();
      let newScale = this.lerpVector(currentScale, targetScale, this.positionLerpSpeed * getDeltaTime());
      myTransform.setLocalScale(newScale);
    }
  }

  private lerpVector(a: vec3, b: vec3, t: number): vec3 {
    const clampedT = Math.max(0, Math.min(1, t));
    return new vec3(
      a.x + (b.x - a.x) * clampedT,
      a.y + (b.y - a.y) * clampedT,
      a.z + (b.z - a.z) * clampedT
    );
  }

  /**
   * Set target programmatically
   */
  public setTarget(target: SceneObject): void {
    this.target = target;
  }

  /**
   * Set position offset programmatically
   */
  public setPositionOffset(offset: vec3): void {
    this.positionOffset = offset;
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
}
