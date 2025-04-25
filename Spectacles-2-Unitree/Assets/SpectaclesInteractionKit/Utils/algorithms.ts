/**
 * Performs a BFS on a collection of root objects and their descendants.
 * It uses a predicate function to determine if an object in the scene graph meets certain conditions.
 *
 * @param rootObjects - The root objects to start the BFS from.
 * @param predicate - The predicate function to call on each object.
 * This function should take a SceneObject as an argument and return a boolean.
 * If the function returns true for an object, that object is immediately returned by the BFS function.
 * If it returns false, the search continues to the next object.
 * @returns the object returned by the predicate function, otherwise null.
 */
export function bfs<T>(
  rootObjects: SceneObject[],
  predicate: (sceneObject: SceneObject) => T
): T | null {
  for (const rootObject of rootObjects) {
    const queue = [rootObject]
    while (queue.length > 0) {
      const currentObject = queue.shift()
      if (currentObject !== undefined) {
        const result = predicate(currentObject)
        if (result !== null) {
          return result
        }

        const childrenCount = currentObject.getChildrenCount()
        for (let i = 0; i < childrenCount; i++) {
          queue.push(currentObject.getChild(i))
        }
      }
    }
  }

  return null
}

/**
 * Returns a filtered list of objects based on a collection of root objects and their descendants.
 * It uses a predicate function to determine if an object in the scene graph meets certain conditions.
 *
 * @param rootObjects - The root objects of each tree.
 * @param predicate - The predicate function to call on each object.
 * This function should take a SceneObject as an argument and return a boolean.
 * If the function returns true for an object, that object will be part of the final list.
 * If it returns false, the search continues to the next object.
 * @returns the collection of objects that match the the predicate function, otherwise an empty list.
 */
export function filterTrees<T>(
  rootObjects: SceneObject[],
  predicate: (sceneObject: SceneObject) => T
): T[] {
  const results: T[] = []
  for (const rootObject of rootObjects) {
    const queue = [rootObject]
    while (queue.length > 0) {
      const currentObject = queue.shift()
      if (currentObject !== undefined) {
        const result = predicate(currentObject)
        if (result !== null) {
          results.push(result)
        }

        const childrenCount = currentObject.getChildrenCount()
        for (let i = 0; i < childrenCount; i++) {
          queue.push(currentObject.getChild(i))
        }
      }
    }
  }

  return results
}

/**
 * Applies a function to all descendants of the root object.
 *
 * @param rootObject The root of the tree to apply the function to.
 * @param toApply This function is called with every scene object descended from rootObject as an argument.
 */
export function applyToDescendants(
  rootObject: SceneObject,
  toApply: (sceneObject: SceneObject) => void
): void {
  for (const childObject of rootObject.children) {
    applyToDescendants(childObject, toApply)
  }
  toApply(rootObject)
}
