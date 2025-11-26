export const DEFAULT_MAX_PARENT_SEARCH_LEVELS: number = 16
export const DEFAULT_MAX_CHILD_SEARCH_LEVELS: number = 16

/**
 * Searches for a SceneObject with the given name in the tree rooted at the given root SceneObject.
 *
 * @param root - The root SceneObject of the tree to search.
 * @param name - The name of the SceneObject to search for.
 * @returns The first SceneObject with the given name if it exists in the tree, or undefined otherwise.
 */
export function findSceneObjectByName(root: SceneObject | null, name: string): SceneObject | null {
  if (root === null) {
    const rootObjectCount = global.scene.getRootObjectsCount()
    let current = 0
    while (current < rootObjectCount) {
      const result = findSceneObjectByName(global.scene.getRootObject(current), name)
      if (result) {
        return result
      }
      current += 1
    }
  } else {
    if (root.name === name) {
      return root
    }

    for (let i = 0; i < root.getChildrenCount(); i++) {
      const child = root.getChild(i)
      const result = findSceneObjectByName(child, name)
      if (result) {
        return result
      }
    }
  }
  return null
}
/**
 * Checks if a {@link SceneObject} is a descendant of another.
 * @param sceneObject - the potential descendant.
 * @param root - the potential ascendant.
 * @returns true, if sceneObject is a descendant of root,
 * otherwise, returns false.
 */
export function isDescendantOf(sceneObject: SceneObject, root: SceneObject): boolean {
  if (sceneObject === root) {
    return true
  }

  const parent = sceneObject.getParent()
  if (parent === null) {
    return false
  }

  return isDescendantOf(parent, root)
}

/**
 * Recursively searches for the first component of a specific type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param componentType - The type of component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns The first component found, or null if none exists.
 */
export function findComponentInChildren<T extends Component>(
  sceneObject: SceneObject,
  componentType: keyof ComponentNameMap,
  maxDepth: number = DEFAULT_MAX_CHILD_SEARCH_LEVELS
): T | null {
  function search(currentObject: SceneObject, currentDepth: number): T | null {
    if (currentDepth >= maxDepth) {
      return null
    }

    const childrenCount = currentObject.getChildrenCount()
    for (let i = 0; i < childrenCount; i++) {
      const child = currentObject.getChild(i)
      const component = child.getComponent(componentType) as T
      if (component) {
        return component
      }

      const foundInChildren = search(child, currentDepth + 1)
      if (foundInChildren) {
        return foundInChildren
      }
    }
    return null
  }
  return search(sceneObject, 0)
}

/**
 * Recursively finds all components of a specific type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param componentType - The type of component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns An array of all matching components found.
 */
export function findAllComponentsInChildren<T extends Component>(
  sceneObject: SceneObject,
  componentType: keyof ComponentNameMap,
  maxDepth: number = DEFAULT_MAX_CHILD_SEARCH_LEVELS
): T[] {
  const results: T[] = []
  function search(currentObject: SceneObject, currentDepth: number): void {
    if (currentDepth >= maxDepth) {
      return
    }

    const childrenCount = currentObject.getChildrenCount()
    for (let i = 0; i < childrenCount; i++) {
      const child = currentObject.getChild(i)
      const component = child.getComponent(componentType) as T
      if (component) {
        results.push(component)
      }
      search(child, currentDepth + 1)
    }
  }
  search(sceneObject, 0)
  return results
}

/**
 * Recursively searches for the first script component of a specific class type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns The first script component found, or null if none exists.
 */
export function findScriptComponentInChildren<T extends ScriptComponent>(
  sceneObject: SceneObject,
  scriptClass: new (...args: any[]) => T,
  maxDepth: number = DEFAULT_MAX_CHILD_SEARCH_LEVELS
): T | null {
  function search(currentObject: SceneObject, currentDepth: number): T | null {
    if (currentDepth >= maxDepth) {
      return null
    }
    const childrenCount = currentObject.getChildrenCount()
    for (let i = 0; i < childrenCount; i++) {
      const child = currentObject.getChild(i)
      for (const component of child.getComponents("Component.ScriptComponent") as ScriptComponent[]) {
        if (component instanceof scriptClass) {
          return component as T
        }
      }
      const foundInChildren = search(child, currentDepth + 1)
      if (foundInChildren) {
        return foundInChildren
      }
    }
    return null
  }
  return search(sceneObject, 0)
}

/**
 * Recursively finds all script components of a specific class type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns An array of all matching script components found.
 */
export function findAllScriptComponentsInChildren<T extends ScriptComponent>(
  sceneObject: SceneObject,
  scriptClass: new (...args: any[]) => T,
  maxDepth: number = DEFAULT_MAX_CHILD_SEARCH_LEVELS
): T[] {
  const results: T[] = []
  function search(currentObject: SceneObject, currentDepth: number): void {
    if (currentDepth >= maxDepth) {
      return
    }
    const childrenCount = currentObject.getChildrenCount()
    for (let i = 0; i < childrenCount; i++) {
      const child = currentObject.getChild(i)
      for (const component of child.getComponents("Component.ScriptComponent") as ScriptComponent[]) {
        if (component instanceof scriptClass) {
          results.push(component as T)
        }
      }
      search(child, currentDepth + 1)
    }
  }
  search(sceneObject, 0)
  return results
}

/**
 * Searches for the first component of a specific type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first component found, or null if none exists.
 */
export function findComponentInParents<T extends Component>(
  sceneObject: SceneObject,
  componentType: keyof ComponentNameMap,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T | null {
  let parent = sceneObject.getParent()
  let levelsSearched = 0
  while (parent && levelsSearched < maxLevels) {
    const component = parent.getComponent(componentType) as T
    if (component) {
      return component
    }
    parent = parent.getParent()
    levelsSearched++
  }
  return null
}

/**
 * Finds all components of a specific type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching components found.
 */
export function findAllComponentsInParents<T extends Component>(
  sceneObject: SceneObject,
  componentType: keyof ComponentNameMap,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T[] {
  const results: T[] = []
  let parent = sceneObject.getParent()
  let levelsSearched = 0
  while (parent && levelsSearched < maxLevels) {
    const component = parent.getComponent(componentType) as T
    if (component) {
      results.push(component)
    }
    parent = parent.getParent()
    levelsSearched++
  }
  return results
}

/**
 * Searches for the first script component of a specific class type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first script component found, or null if none exists.
 */
export function findScriptComponentInParents<T extends ScriptComponent>(
  sceneObject: SceneObject,
  scriptClass: new (...args: any[]) => T,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T | null {
  let parent = sceneObject.getParent()
  let levelsSearched = 0
  while (parent && levelsSearched < maxLevels) {
    for (const component of parent.getComponents("Component.ScriptComponent") as ScriptComponent[]) {
      if (component instanceof scriptClass) {
        return component as T
      }
    }
    parent = parent.getParent()
    levelsSearched++
  }
  return null
}

/**
 * Finds all script components of a specific class type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching script components found.
 */
export function findAllScriptComponentsInParents<T extends ScriptComponent>(
  sceneObject: SceneObject,
  scriptClass: new (...args: any[]) => T,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T[] {
  const results: T[] = []
  let parent = sceneObject.getParent()
  let levelsSearched = 0
  while (parent && levelsSearched < maxLevels) {
    for (const component of parent.getComponents("Component.ScriptComponent") as ScriptComponent[]) {
      if (component instanceof scriptClass) {
        results.push(component as T)
      }
    }
    parent = parent.getParent()
    levelsSearched++
  }
  return results
}

/**
 * Searches for the first component on the SceneObject itself, then in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first component found, or null if none exists.
 */
export function findComponentInSelfOrParents<T extends Component>(
  sceneObject: SceneObject,
  componentType: keyof ComponentNameMap,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T | null {
  const selfComponent = sceneObject.getComponent(componentType) as T
  if (selfComponent) {
    return selfComponent
  }
  return findComponentInParents<T>(sceneObject, componentType, maxLevels)
}

/**
 * Finds all components on the SceneObject itself and in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching components found.
 */
export function findAllComponentsInSelfOrParents<T extends Component>(
  sceneObject: SceneObject,
  componentType: keyof ComponentNameMap,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T[] {
  const results: T[] = []
  const selfComponent = sceneObject.getComponent(componentType) as T
  if (selfComponent) {
    results.push(selfComponent)
  }
  return results.concat(findAllComponentsInParents<T>(sceneObject, componentType, maxLevels))
}

/**
 * Searches for the first script component on the SceneObject itself, then in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first script component found, or null if none exists.
 */
export function findScriptComponentInSelfOrParents<T extends ScriptComponent>(
  sceneObject: SceneObject,
  scriptClass: new (...args: any[]) => T,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T | null {
  for (const component of sceneObject.getComponents("Component.ScriptComponent") as ScriptComponent[]) {
    if (component instanceof scriptClass) {
      return component as T
    }
  }
  return findScriptComponentInParents<T>(sceneObject, scriptClass, maxLevels)
}

/**
 * Finds all script components on the SceneObject itself and in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching script components found.
 */
export function findAllScriptComponentsInSelfOrParents<T extends ScriptComponent>(
  sceneObject: SceneObject,
  scriptClass: new (...args: any[]) => T,
  maxLevels: number = DEFAULT_MAX_PARENT_SEARCH_LEVELS
): T[] {
  const results: T[] = []
  for (const component of sceneObject.getComponents("Component.ScriptComponent") as ScriptComponent[]) {
    if (component instanceof scriptClass) {
      results.push(component as T)
    }
  }
  return results.concat(findAllScriptComponentsInParents<T>(sceneObject, scriptClass, maxLevels))
}
