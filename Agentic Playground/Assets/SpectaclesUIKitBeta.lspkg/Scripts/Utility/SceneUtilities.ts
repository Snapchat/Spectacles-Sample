import {Element} from "../Components/Element"

@typedef
export class Callback {
  @input
  @allowUndefined
  scriptComponent: ScriptComponent
  @input
  @allowUndefined
  functionName: string
}

/**
 * Searches for components with the given type in the tree rooted at the given root SceneObject.
 *
 * @param root - The root SceneObject of the tree to search.
 * @param name - The component typename to search for.
 * @returns An array of the components with that type
 */
export function findAllChildComponents(root: SceneObject | null, name: keyof ComponentNameMap): Component[] {
  const children = root?.children ?? getSceneRoots()
  const components = root?.getComponents(name) ?? []
  components.push(...children.flatMap((c) => findAllChildComponents(c, name)))
  return components
}

/**
 * Searches for components with the given type in the tree rooted at the given root SceneObject.
 *
 * @param root - The root SceneObject of the tree to search.
 * @param name - The component typename to search for.
 * @returns An array of the components with that type
 */
export function findComponentInAncestors(start: SceneObject, name: keyof ComponentNameMap): Component {
  let parent = start
  let component = null
  while (parent !== null) {
    component = parent.getComponent(name)
    if (component) break
    parent = parent.getParent()
  }

  return component
}

export function getElement(root: SceneObject): Element | null {
  const components = root.getComponents("ScriptComponent")
  for (let i = 0; i < components.length; i++) {
    const component = components[i]
    if (component instanceof Element) {
      return component
    }
  }
  return null
}

/**
 * Returns an array of all root objects in the scene.
 */
export function getSceneRoots(): SceneObject[] {
  const nodes: SceneObject[] = []
  for (let i = 0; i < global.scene.getRootObjectsCount(); i++) {
    nodes.push(global.scene.getRootObject(i))
  }
  return nodes
}

export function createCallbacks<T>(callbacks: Callback[]): (args: T) => void {
  if (callbacks === undefined || callbacks.length === 0) {
    return () => {}
  }
  return (args) => {
    for (let i = 0; i < callbacks.length; i++) {
      if ((callbacks[i].scriptComponent as any)[callbacks[i].functionName as any]) {
        ;(callbacks[i].scriptComponent as any)[callbacks[i].functionName as any](args)
      }
    }
  }
}
