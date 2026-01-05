import {LSTween} from "LSTween.lspkg/LSTween"
import {RotationInterpolationType} from "LSTween.lspkg/RotationInterpolationType"
import Easing from "LSTween.lspkg/TweenJS/Easing"

@component
export class Example_PrefabInstantiateTween extends BaseScriptComponent {
  @input prefab: ObjectPrefab = null
  @input minRotation: vec3 = new vec3(-45, -45, -45)
  @input maxRotation: vec3 = new vec3(45, 45, 45)
  @input minScale: vec3 = new vec3(0.5, 0.5, 0.5)
  @input maxScale: vec3 = new vec3(2, 2, 2)
  @input animationTime: number = 1500

  onAwake() {
    if (!this.prefab) {
      print("Error: No prefab assigned")
      return
    }
    this.createAndAnimatePrefab()
  }

  private createAndAnimatePrefab() {
    // Create instance as child of this object
    const instance = this.prefab.instantiate(null)
    if (!instance) {
      print("Failed to instantiate prefab")
      return
    }

    const transform = instance.getTransform()
    if (!transform) {
      print("No transform found on prefab")
      return
    }

    // Ensure the object starts at a visible scale
    transform.setLocalScale(this.minScale)
    transform.setLocalPosition(new vec3(0, 0, 0))

    print("Starting scale animation from: " + this.minScale.toString() + " to " + this.maxScale.toString())

    // Changed from scaleOffset to scaleTo
    LSTween.scaleFromToLocal(transform, this.minScale, this.maxScale, this.animationTime)
      .easing(Easing.Circular.InOut)
      .onStart(() => {
        print("Scale animation started")
        print("Current scale: " + transform.getLocalScale().toString())
      })
      .onComplete(() => {
        print("Scale animation completed")
        print("Final scale: " + transform.getLocalScale().toString())
      })
      .start()

    // Create start and end rotations with conversion from degrees to radians
    const startRotation = quat.fromEulerAngles(
      this.minRotation.x * MathUtils.DegToRad,
      this.minRotation.y * MathUtils.DegToRad,
      this.minRotation.z * MathUtils.DegToRad
    )

    const endRotation = quat.fromEulerAngles(
      this.maxRotation.x * MathUtils.DegToRad,
      this.maxRotation.y * MathUtils.DegToRad,
      this.maxRotation.z * MathUtils.DegToRad
    )
    // Set initial rotation
    transform.setLocalRotation(startRotation)

    // Animate from start to end rotation
    LSTween.rotateFromToLocal(
      transform,
      startRotation,
      endRotation,
      this.animationTime,
      RotationInterpolationType.SLERP
    )
      .easing(Easing.Cubic.In)
      .onStart(() => print("Rotation animation started"))
      .onComplete(() => print("Rotation animation completed"))
      .start()
  }
}
