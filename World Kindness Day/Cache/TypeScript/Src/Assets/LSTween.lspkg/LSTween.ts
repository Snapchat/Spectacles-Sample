/**
 * You can find this package in the Asset Library. Make sure to import this package before you can use it.
 *
 * @example
 * ```js
 * import * as LSTween from "./LSTween/LSTween"
 * ```
 *
 * @packageDocumentation
 */

import { RotationInterpolationType } from "./RotationInterpolationType";
import Tween from "./TweenJS/Tween";
import { mainGroup } from "./TweenJS/mainGroup";
import now from "./TweenJS/Now";

export class LSTween {
  private static readonly instance: LSTween = new LSTween();

  private constructor() {
    let lsTweenObj = global.scene.createSceneObject("LSTweenUpdates");

    let lsTweenScriptComponent = lsTweenObj.createComponent("ScriptComponent");

    lsTweenScriptComponent.createEvent("UpdateEvent").bind(() => {
      mainGroup.update(now());
    });
  }
  /**
   *
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.rawTween(1000)
   *   .onUpdate(function (o) {
   *     print(o.t);
   *   })
   *   .start();
   * ```
   * @returns
   */
  public static rawTween(time: number): Tween {
    let tween = new Tween({ t: 0 }, mainGroup).to({ t: 1 }).duration(time);
    return tween;
  }
  /**
   *
   * @param material Material that you wish to change alpha
   * @param to Destination value you want your alpha to reach
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.alphaTo(material, 0.25, 1000.0).start();
   * ```
   * @returns
   */
  public static alphaTo(material: Material, to: number, time: number) {
    let mainPass = material.mainPass;
    let initColor = mainPass.baseColor.a;
    let toClamp = MathUtils.clamp(to, 0.0, 1.0);
    let tween = new Tween({ a: initColor }, mainGroup)
      .to({ a: toClamp }, time)
      .onUpdate((object) => {
        let color = mainPass.baseColor;
        color.a = object.a;
        mainPass.baseColor = color;
      });
    return tween;
  }
  /**
   *
   * @param material Material that you wish to change alpha
   * @param from Initial value of your alpha
   * @param to Destination value you want your alpha to reach
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.alphaFromTo(material, 0.0, 0.5, 1000.0).start();
   * ```
   * @returns
   */
  public static alphaFromTo(
    material: Material,
    from: number,
    to: number,
    time: number
  ) {
    let mainPass = material.mainPass;
    let fromClamp = MathUtils.clamp(from, 0.0, 1.0);
    let toClamp = MathUtils.clamp(to, 0.0, 1.0);
    let tween = new Tween({ a: fromClamp }, mainGroup)
      .to({ a: toClamp }, time)
      .onUpdate((object) => {
        let color = mainPass.baseColor;
        color.a = object.a;
        mainPass.baseColor = color;
      });
    return tween;
  }
  /**
   *
   * @param text Text that you wish to change alpha
   * @param to Destination value you want your alpha to reach
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.textAlphaTo(text, 0.25, 1000.0).start();
   * ```
   * @returns
   */
  public static textAlphaTo(text: Text, to: number, time: number) {
    let initColor = text.textFill.color.a;
    let toClamp = MathUtils.clamp(to, 0.0, 1.0);
    let tween = new Tween({ a: initColor }, mainGroup)
      .to({ a: toClamp }, time)
      .onUpdate((object) => {
        let color = text.textFill.color;
        color.a = object.a;
        text.textFill.color = color;
        let shadowColor = text.dropshadowSettings.fill.color;
        shadowColor.a = object.a;
        text.dropshadowSettings.fill.color = shadowColor;
        let outlineColor = text.outlineSettings.fill.color;
        outlineColor.a = object.a;
        text.outlineSettings.fill.color = outlineColor;
      });
    return tween;
  }
  /**
   *
   * @param text Text that you wish to change alpha
   * @param from Initial value of your alpha
   * @param to Destination value you want your alpha to reach
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.textAlphaFromTo(text, 0.0, 0.5, 1000.0).start();
   * ```
   * @returns
   */
  public static textAlphaFromTo(
    text: Text,
    from: number,
    to: number,
    time: number
  ) {
    let fromClamp = MathUtils.clamp(from, 0.0, 1.0);
    let toClamp = MathUtils.clamp(to, 0.0, 1.0);
    let tween = new Tween({ a: fromClamp }, mainGroup)
      .to({ a: toClamp }, time)
      .onUpdate((object) => {
        let color = text.textFill.color;
        color.a = object.a;
        text.textFill.color = color;
        let shadowColor = text.dropshadowSettings.fill.color;
        shadowColor.a = object.a;
        text.dropshadowSettings.fill.color = shadowColor;
      });
    return tween;
  }
  /**
   *
   * @param material Material that you wish to change color
   * @param to Destination value you want your color to reach
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.colorTo(material, new vec4(0,1,0,1), 1000.0).start();
   * ```
   * @returns
   */
  public static colorTo(material: Material, to: vec4, time: number) {
    let mainPass = material.mainPass;
    let initColor = mainPass.baseColor;
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        mainPass.baseColor = vec4.lerp(initColor, to, object.t);
      });
    return tween;
  }
  /**
   *
   * @param material Material that you wish to change color
   * @param from Initial value of your color
   * @param to Destination value you want your color to reach
   * @param time Duration of Tween in miliseconds
   * @returns
   * @example
   * ```typescript
   * LSTween.colorFromTo(material, new vec4(0,0,0,1), new vec4(0,1,0,1), 1000.0).start();
   * ```
   */
  public static colorFromTo(
    material: Material,
    from: vec4,
    to: vec4,
    time: number
  ) {
    let mainPass = material.mainPass;
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        mainPass.baseColor = vec4.lerp(from, to, object.t);
      });
    return tween;
  }
  /**
   *
   * @param text Text that you wish to change color
   * @param to Destination value you want your color to reach
   * @param time Duration of Tween in miliseconds
   * @returns
   * @example
   * ```typescript
   * LSTween.colorTextTo(text, new vec4(0,1,0,1), 1000.0).start();
   * ```
   */
  public static colorTextTo(text: Text, to: vec4, time: number) {
    let initColor = text.textFill.color;
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        text.textFill.color = vec4.lerp(initColor, to, object.t);
      });
    return tween;
  }
  /**
   *
   * @param text Text that you wish to change color
   * @param from Initial value of your color
   * @param to Destination value you want your color to reach
   * @param time Duration of Tween in miliseconds
   * @returns
   * @example
   * ```typescript
   * LSTween.colorTextFromTo(text, new vec4(0,0,0,1), new vec4(0,1,0,1), 1000.0).start();
   * ```
   */
  public static colorTextFromTo(
    text: Text,
    from: vec4,
    to: vec4,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        text.textFill.color = vec4.lerp(from, to, object.t);
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change position
   * @param offset This is an addition operation in local space. For example, passing new vec3(1,0,0) will make object move 1 unit in X from its start position
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.moveOffset(transform, new vec3(0,5,0), 1000.0).start();
   * ```
   * @returns
   */
  public static moveOffset(transform: Transform, offset: vec3, time: number) {
    let initPos = transform.getLocalPosition();
    let toPos = initPos.add(offset);
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setLocalPosition(vec3.lerp(initPos, toPos, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change position
   * @param to Destination position you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.moveToWorld(transform, new vec3(0,5,0), 1000.0).start();
   * ```
   * @returns
   */
  public static moveToWorld(transform: Transform, to: vec3, time: number) {
    let initPos = transform.getWorldPosition();
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setWorldPosition(vec3.lerp(initPos, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change position
   * @param from Initial position you want your object to start from
   * @param to Destination position you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.moveFromToWorld(transform, new vec3(0,0,0), new vec3(0,5,0), 1000.0).start();
   * ```
   * @returns
   */
  public static moveFromToWorld(
    transform: Transform,
    from: vec3,
    to: vec3,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setWorldPosition(vec3.lerp(from, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change position
   * @param to Destination position you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.moveToLocal(transform, new vec3(0,5,0), 1000.0).start();
   * ```
   * @returns
   */
  public static moveToLocal(transform: Transform, to: vec3, time: number) {
    let initPos = transform.getLocalPosition();
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setLocalPosition(vec3.lerp(initPos, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change position
   * @param from Initial position you want your object to start from
   * @param to Destination position you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.moveFromToLocal(transform, new vec3(0,0,0), new vec3(0,5,0), 1000.0).start();
   * ```
   * @returns
   */
  public static moveFromToLocal(
    transform: Transform,
    from: vec3,
    to: vec3,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setLocalPosition(vec3.lerp(from, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change rotation
   * @param offset Multiplies the offset value from current rotation
   * @param time Duration of Tween in miliseconds
   * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
   * @example
   * ```typescript
   * LSTween.rotateOffset(transform, quat.angleAxis(radians, axis), 1000.0).start();
   * ```
   * @returns
   */
  public static rotateOffset(
    transform: Transform,
    offset: quat,
    time: number,
    interpolationType: RotationInterpolationType = RotationInterpolationType.SLERP
  ) {
    let initRot = transform.getLocalRotation();
    let toRot = offset.multiply(initRot);
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        switch (interpolationType) {
          case RotationInterpolationType.LERP:
            transform.setLocalRotation(quat.lerp(initRot, toRot, object.t));
            break;
          case RotationInterpolationType.SLERP:
            transform.setLocalRotation(quat.slerp(initRot, toRot, object.t));
            break;
          default:
            transform.setLocalRotation(quat.slerp(initRot, toRot, object.t));
            break;
        }
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change rotation
   * @param to Destination quaternion you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
   * @example
   * ```typescript
   * LSTween.rotateToWorld(transform, quat.angleAxis(radians, axis), 1000.0).start();
   * ```
   * @returns
   */
  public static rotateToWorld(
    transform: Transform,
    to: quat,
    time: number,
    interpolationType: RotationInterpolationType = RotationInterpolationType.SLERP
  ) {
    let initRot = transform.getWorldRotation();
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        switch (interpolationType) {
          case RotationInterpolationType.LERP:
            transform.setWorldRotation(quat.lerp(initRot, to, object.t));
            break;
          case RotationInterpolationType.SLERP:
            transform.setWorldRotation(quat.slerp(initRot, to, object.t));
            break;
          default:
            transform.setWorldRotation(quat.slerp(initRot, to, object.t));
            break;
        }
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change rotation
   * @param from Initial quaternion you want your object to start from
   * @param to Destination quaternion you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
   * @example
   * ```typescript
   * LSTween.rotateFromToWorld(transform, quat.angleAxis(startRadian, axis), quat.angleAxis(destRadian, axis), 1000.0).start();
   * ```
   * @returns
   */
  public static rotateFromToWorld(
    transform: Transform,
    from: quat,
    to: quat,
    time: number,
    interpolationType: RotationInterpolationType = RotationInterpolationType.SLERP
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        switch (interpolationType) {
          case RotationInterpolationType.LERP:
            transform.setWorldRotation(quat.lerp(from, to, object.t));
            break;
          case RotationInterpolationType.SLERP:
            transform.setWorldRotation(quat.slerp(from, to, object.t));
            break;
          default:
            transform.setWorldRotation(quat.slerp(from, to, object.t));
            break;
        }
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change rotation
   * @param to Destination quaternion you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
   * @example
   * ```typescript
   * LSTween.rotateToLocal(transform, quat.angleAxis(radians, axis), 1000.0).start();
   * ```
   * @returns
   */
  public static rotateToLocal(
    transform: Transform,
    to: quat,
    time: number,
    interpolationType: RotationInterpolationType = RotationInterpolationType.SLERP
  ) {
    let initRot = transform.getLocalRotation();
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        switch (interpolationType) {
          case RotationInterpolationType.LERP:
            transform.setLocalRotation(quat.lerp(initRot, to, object.t));
            break;
          case RotationInterpolationType.SLERP:
            transform.setLocalRotation(quat.slerp(initRot, to, object.t));
            break;
          default:
            transform.setLocalRotation(quat.slerp(initRot, to, object.t));
            break;
        }
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change rotation
   * @param from Initial quaternion you want your object to start from
   * @param to Destination quaternion you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
   * @example
   * ```typescript
   * LSTween.rotateFromToLocal(transform, quat.angleAxis(startRadian, axis), quat.angleAxis(destRadian, axis), 1000.0).start();
   * ```
   * @returns
   */
  public static rotateFromToLocal(
    transform: Transform,
    from: quat,
    to: quat,
    time: number,
    interpolationType: RotationInterpolationType = RotationInterpolationType.SLERP
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        switch (interpolationType) {
          case RotationInterpolationType.LERP:
            transform.setLocalRotation(quat.lerp(from, to, object.t));
            break;
          case RotationInterpolationType.SLERP:
            transform.setLocalRotation(quat.slerp(from, to, object.t));
            break;
          default:
            transform.setLocalRotation(quat.slerp(from, to, object.t));
            break;
        }
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change scale
   * @param offset Multiplies the offset value from current scale
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.scaleOffset(transform, new vec3(2,2,2), 1000.0).start();
   * ```
   * @returns
   */
  public static scaleOffset(transform: Transform, offset: vec3, time: number) {
    let initScale = transform.getLocalScale();
    let toScale = initScale.mult(offset);
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setLocalScale(vec3.lerp(initScale, toScale, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change scale
   * @param to Destination scale you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.scaleToWorld(transform, new vec3(2,2,2), 1000.0).start();
   * ```
   * @returns
   */
  public static scaleToWorld(transform: Transform, to: vec3, time: number) {
    let initScale = transform.getWorldScale();
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setWorldScale(vec3.lerp(initScale, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change scale
   * @param from Initial scale you want your object to start from
   * @param to Destination scale you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.scaleFromToWorld(transform, new vec3(1,1,1), new vec3(2,2,2), 1000.0).start();
   * ```
   * @returns
   */
  public static scaleFromToWorld(
    transform: Transform,
    from: vec3,
    to: vec3,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setWorldScale(vec3.lerp(from, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change scale
   * @param to Destination scale you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.scaleToLocal(transform, new vec3(2,2,2), 1000.0).start();
   * ```
   * @returns
   */
  public static scaleToLocal(transform: Transform, to: vec3, time: number) {
    let initScale = transform.getLocalScale();
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setLocalScale(vec3.lerp(initScale, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param transform Transform object you want to change scale
   * @param from Initial scale you want your object to start from
   * @param to Destination scale you want your object to go to
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.scaleFromToLocal(transform, new vec3(1,1,1), new vec3(2,2,2), 1000.0).start();
   * ```
   * @returns
   */
  public static scaleFromToLocal(
    transform: Transform,
    from: vec3,
    to: vec3,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        transform.setLocalScale(vec3.lerp(from, to, object.t));
      });
    return tween;
  }
  /**
   *
   * @param sceneObject SceneObject you want to change enabled state
   * @param endValue End value of enabled state
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.enableChange(sceneObject, false, 1000.0).start();
   * ```
   * @returns
   */
  public static enableChange(
    sceneObject: SceneObject,
    endValue: boolean,
    time: number
  ) {
    let tween = new Tween(undefined, mainGroup)
      .to(undefined, time)
      .onComplete(() => {
        sceneObject.enabled = endValue;
      });
    return tween;
  }
  /**
   *
   * @param pass The pass you want to change the property of
   * @param property The property name in the pass you want to change
   * @param from Initial value of your property
   * @param to Destination value you want your property to reach
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.shaderColorPropertyFromTo(pass, "tintColor", new vec4(0,0,0,1), new vec4(1,1,1,1), 1000.0).start();
   * ```
   * @returns
   */
  public static shaderColorPropertyFromTo(
    pass: Pass,
    property: string,
    from: vec4,
    to: vec4,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        pass[property] = vec4.lerp(from, to, object.t);
      });
    return tween;
  }
  /**
   *
   * @param pass The pass you want to change the property of
   * @param property The property name in the pass you want to change
   * @param from Initial value of your property
   * @param to Destination value you want your property to reach
   * @param time Duration of Tween in miliseconds
   * @example
   * ```typescript
   * LSTween.shaderFloatPropertyFromTo(pass, "opacity", 0.0, 1.0, 1000.0).start();
   * ```
   * @returns
   */
  public static shaderFloatPropertyFromTo(
    pass: Pass,
    property: string,
    from: number,
    to: number,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        pass[property] = MathUtils.lerp(from, to, object.t);
      });
    return tween;
  }

  public static shaderFloatPropertyTo(
    pass: Pass,
    property: string,
    to: number,
    time: number
  ) {
    let initValue = pass[property];
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        pass[property] = MathUtils.lerp(initValue, to, object.t);
      });
    return tween;
  }

  public static shaderVec3PropertyFromTo(
    pass: Pass,
    property: string,
    from: vec3,
    to: vec3,
    time: number
  ) {
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        pass[property] = vec3.lerp(from, to, object.t);
      });
    return tween;
  }

  public static valueTo(value: number, to: number, time: number) {
    let initVal = value;
    let tween = new Tween({ v: initVal }, mainGroup)
      .to({ v: to }, time)
      .onUpdate((object) => {
        value = object.v;
      });
    return tween;
  }

  // public static vector3To(vectorValue: vec3, to: vec3, time: number)
  // {
  //   let initVal = vectorValue
  //   let tween = new Tween({ t: 0.0}, mainGroup)
  //     .to({ t: 1.0 }, time)
  //     .onUpdate((object) =>
  //     {
  //       vectorValue = vec3.lerp(initVal, to, object.t)
  //       print("LSTween: vec3 = " + vectorValue)
  //     })
  //     return tween
  // }

  public static vector3FromTo(
    vectorValue: vec3,
    from: vec3,
    to: vec3,
    time: number
  ) {
    let initVal = from;
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        vectorValue = vec3.lerp(initVal, to, object.t);
      });
    return tween;
  }

  public static rotateToLocalInDegrees(
    transform: Transform,
    to_in_degrees: vec3,
    time: number
  ) {
    let initRot_in_degrees = transform
      .getLocalRotation()
      .toEulerAngles()
      .uniformScale(MathUtils.RadToDeg);
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        let lerpedRot_in_degrees = vec3.lerp(
          initRot_in_degrees,
          to_in_degrees,
          object.t
        );
        transform.setLocalRotation(
          quat.fromEulerVec(
            lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)
          )
        );
      });
    return tween;
  }

  public static rotateFromToLocalInDegrees(
    transform: Transform,
    from_in_degrees: vec3,
    to_in_degrees: vec3,
    time: number
  ) {
    // Set initial local rotation immediately
    transform.setLocalRotation(
      quat.fromEulerVec(from_in_degrees.uniformScale(MathUtils.DegToRad))
    );

    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        let lerpedRot_in_degrees = vec3.lerp(
          from_in_degrees,
          to_in_degrees,
          object.t
        );
        transform.setLocalRotation(
          quat.fromEulerVec(
            lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)
          )
        );
      });

    return tween;
  }

  public static rotateToWorldInDegrees(
    transform: Transform,
    to_in_degrees: vec3,
    time: number
  ) {
    let initRot_in_degrees = transform
      .getLocalRotation()
      .toEulerAngles()
      .uniformScale(MathUtils.RadToDeg);
    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        let lerpedRot_in_degrees = vec3.lerp(
          initRot_in_degrees,
          to_in_degrees,
          object.t
        );
        transform.setWorldRotation(
          quat.fromEulerVec(
            lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)
          )
        );
      });
    return tween;
  }

  public static rotateFromToWorldInDegrees(
    transform: Transform,
    from_in_degrees: vec3,
    to_in_degrees: vec3,
    time: number
  ) {
    // Set initial world rotation immediately
    transform.setWorldRotation(
      quat.fromEulerVec(from_in_degrees.uniformScale(MathUtils.DegToRad))
    );

    let tween = new Tween({ t: 0.0 }, mainGroup)
      .to({ t: 1.0 }, time)
      .onUpdate((object) => {
        let lerpedRot_in_degrees = vec3.lerp(
          from_in_degrees,
          to_in_degrees,
          object.t
        );
        transform.setWorldRotation(
          quat.fromEulerVec(
            lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)
          )
        );
      });

    return tween;
  }

  public static blendShapeValueTo(
    renderMeshVisual: RenderMeshVisual,
    blendShapeName,
    to: number,
    time: number
  ) {
    let initVal = renderMeshVisual.getBlendShapeWeight(blendShapeName);

    let tween = new Tween({ v: initVal }, mainGroup)
      .to({ v: to }, time)
      .onUpdate((object) => {
        renderMeshVisual.setBlendShapeWeight(blendShapeName, object.v);
      });
    return tween;
  }

  public static blendShapeValueFromTo(
    renderMeshVisual: RenderMeshVisual,
    blendShapeName,
    from: number,
    to: number,
    time: number
  ) {
    renderMeshVisual.setBlendShapeWeight(blendShapeName, from);

    let tween = new Tween({ v: 0.0 }, mainGroup)
      .to({ v: 1.0 }, time)
      .onUpdate((object) => {
        let lerpedVal = MathUtils.lerp(from, to, object.v);
        renderMeshVisual.setBlendShapeWeight(blendShapeName, lerpedVal);
      });
    return tween;
  }
}
