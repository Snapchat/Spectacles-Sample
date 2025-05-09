/**
 * Searches for a SceneObject with the given name in the tree rooted at the given root SceneObject.
 *
 * @param root - The root SceneObject of the tree to search.
 * @param name - The name of the SceneObject to search for.
 * @returns The first SceneObject with the given name if it exists in the tree, or undefined otherwise.
 */
export function findSceneObjectByName(
  root: SceneObject | null,
  name: string
): SceneObject | null {
  if (root === null) {
    const rootObjectCount = global.scene.getRootObjectsCount()
    let current = 0
    while (current < rootObjectCount) {
      const result = findSceneObjectByName(
        global.scene.getRootObject(current),
        name
      )
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
export function isDescendantOf(
  sceneObject: SceneObject,
  root: SceneObject
): boolean {
  if (sceneObject === root) {
    return true
  }

  const parent = sceneObject.getParent()
  if (parent === null) {
    return false
  }

  return isDescendantOf(parent, root)
}
