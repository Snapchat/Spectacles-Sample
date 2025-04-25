/**
 * Interface for computing the additional rotation
 * on the targeting ray direction to make use of tracking in IR FoV
 */
export interface IrInteractionTransition {
  /**
   * Computes an extra rotation around the X axis of Situation space
   * based on the height of the hand point and the gaze pitch to make use of the ray in IR FoV range
   * @param gazePitchInDegrees - gaze pitch given in degrees
   * @param toWorldFromSituationSpace - situationSpace-to-world transformation
   * @param handPoint - hand point used for height estimation
   * @returns the rotation in degrees to be applied on targeting direction around X axis
   */
  computeXRotationInDegrees(
    gazePitchInDegrees: number,
    toWorldFromSituationSpace: mat4,
    handPoint: vec3
  ): number

  /**
   * Computes an extra rotation around the X axis of Situation space
   * based on the height of the hand point and the gaze pitch to make use of the ray in IR FoV range
   * @param gazePitchInRadians - gaze pitch given in radians
   * @param toWorldFromSituationSpace - situationSpace-to-world transformation
   * @param handPoint - hand point used for height estimation
   * @returns the rotation in radians to be applied on targeting direction around X axis
   */
  computeXRotationInRadians(
    gazePitchInRadians: number,
    toWorldFromSituationSpace: mat4,
    handPoint: vec3
  ): number
}
