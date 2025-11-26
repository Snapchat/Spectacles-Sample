import { LSTween } from "../../LSTween";
import { RotationInterpolationType } from "../../RotationInterpolationType";

@component
export class Example_ChainTween extends BaseScriptComponent {
  onAwake() {
    let transform = this.getTransform();
    let initScale = transform.getLocalScale();

    let rotateTween = LSTween.rotateOffset(
      transform,
      quat.angleAxis(MathUtils.DegToRad * 45, vec3.up()),
      1000,
      RotationInterpolationType.LERP
    ).onEveryStart((o) => {
      transform.setLocalScale(initScale);
    });

    let scaleTween = LSTween.scaleOffset(
      transform,
      vec3.one().uniformScale(2),
      1000
    );

    rotateTween.chain(scaleTween);
    scaleTween.chain(rotateTween);

    rotateTween.start();
  }
}
