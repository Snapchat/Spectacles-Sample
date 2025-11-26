/**
 * You can find this package as part of LSTween in the Asset Library. Make sure to import this package before you can use it.
 * 
 * @example
 * ```typescript
 * import * as LSTween from "./LSTween/LSTween"
 * import { RotationInterpolationType } from "./LSTween/RotationInterpolationType";
 * 
 * LSTween.rotateToLocal(transform, quat.angleAxis(radians, axis), 1000.0, RotationInterpolationType.SLERP).start();
 * ```
 * 
 * @packageDocumentation
 */

export enum RotationInterpolationType {
  LERP = 0,
  SLERP = 1,
}
