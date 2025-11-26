/**
 * Used to check if an Object reference has been destroyed on the LensCore side
 * @param reference - the reference to check, typically a SceneObject or Component
 * @returns - the same reference if not destroyed on the LensCore side, or null if destroyed
 */
export function getSafeReference<T extends SceneObject | Component | Text | ScriptComponent>(
  reference: T | null
): T | null {
  if (reference && !isNull(reference)) {
    return reference
  }

  return null
}
