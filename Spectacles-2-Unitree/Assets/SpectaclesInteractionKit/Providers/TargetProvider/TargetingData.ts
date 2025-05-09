/**
 * TargetingData structure, received from LensCore's Gesture Module API
 * Contains the normalized direction and the locus (origin) point of the ray,
 * both interpreted in world coordinate system
 */
export type TargetingData = {
  targetingDirectionInWorld: vec3
  targetingLocusInWorld: vec3
  intendsToTarget: boolean
}
