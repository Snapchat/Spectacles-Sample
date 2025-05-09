/**
 * Information to draw a ray
 */
export type RaycastInfo = {
  direction: vec3
  locus: vec3
}

/**
 * Provides ray information in order to do ray casting
 */
export interface RayProvider {
  /**
   * Returns raycast information of ray
   */
  getRaycastInfo(): RaycastInfo

  /**
   * Returns whether the ray provider is an usable state or not (for instance, hands are not tracked)
   */
  isAvailable(): boolean

  /**
   * Reset function that can be called for instance when hands are not tracked to reset inner logics
   */
  reset(): void
}
