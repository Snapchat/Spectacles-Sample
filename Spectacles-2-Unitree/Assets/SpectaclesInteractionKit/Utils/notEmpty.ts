/**
 * Checks for null or undefined and asserts that the value is neither.
 * Designed to be used as part of a {@link Array.Filter} call.
 *
 * @param value - Value to be tested.
 * @returns - True if it is neither null not undefined.
 */
export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined
}
