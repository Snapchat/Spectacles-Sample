/**
 * This can be used to delay the fetching of a property until needed
 *
 * @param getPropertyFunction The function to get the value of the property, when needed.
 * @returns a function that will return the value of getPropertyFunction, which will only be called once
 */

/**
 * @param getPropertyFunction
 */
export function lazyProperty<T>(getPropertyFunction: () => T): () => T {
  let lazyProperty: T | undefined

  return () => {
    if (lazyProperty === undefined) {
      lazyProperty = getPropertyFunction()
    }
    return lazyProperty
  }
}
