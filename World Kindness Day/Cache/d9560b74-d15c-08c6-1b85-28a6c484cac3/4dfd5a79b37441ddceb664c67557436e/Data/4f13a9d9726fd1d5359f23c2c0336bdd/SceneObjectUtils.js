"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS = void 0;
exports.findSceneObjectByName = findSceneObjectByName;
exports.isDescendantOf = isDescendantOf;
exports.findComponentInChildren = findComponentInChildren;
exports.findAllComponentsInChildren = findAllComponentsInChildren;
exports.findScriptComponentInChildren = findScriptComponentInChildren;
exports.findAllScriptComponentsInChildren = findAllScriptComponentsInChildren;
exports.findComponentInParents = findComponentInParents;
exports.findAllComponentsInParents = findAllComponentsInParents;
exports.findScriptComponentInParents = findScriptComponentInParents;
exports.findAllScriptComponentsInParents = findAllScriptComponentsInParents;
exports.findComponentInSelfOrParents = findComponentInSelfOrParents;
exports.findAllComponentsInSelfOrParents = findAllComponentsInSelfOrParents;
exports.findScriptComponentInSelfOrParents = findScriptComponentInSelfOrParents;
exports.findAllScriptComponentsInSelfOrParents = findAllScriptComponentsInSelfOrParents;
exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS = 16;
exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS = 16;
/**
 * Searches for a SceneObject with the given name in the tree rooted at the given root SceneObject.
 *
 * @param root - The root SceneObject of the tree to search.
 * @param name - The name of the SceneObject to search for.
 * @returns The first SceneObject with the given name if it exists in the tree, or undefined otherwise.
 */
function findSceneObjectByName(root, name) {
    if (root === null) {
        const rootObjectCount = global.scene.getRootObjectsCount();
        let current = 0;
        while (current < rootObjectCount) {
            const result = findSceneObjectByName(global.scene.getRootObject(current), name);
            if (result) {
                return result;
            }
            current += 1;
        }
    }
    else {
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.getChildrenCount(); i++) {
            const child = root.getChild(i);
            const result = findSceneObjectByName(child, name);
            if (result) {
                return result;
            }
        }
    }
    return null;
}
/**
 * Checks if a {@link SceneObject} is a descendant of another.
 * @param sceneObject - the potential descendant.
 * @param root - the potential ascendant.
 * @returns true, if sceneObject is a descendant of root,
 * otherwise, returns false.
 */
function isDescendantOf(sceneObject, root) {
    if (sceneObject === root) {
        return true;
    }
    const parent = sceneObject.getParent();
    if (parent === null) {
        return false;
    }
    return isDescendantOf(parent, root);
}
/**
 * Recursively searches for the first component of a specific type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param componentType - The type of component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns The first component found, or null if none exists.
 */
function findComponentInChildren(sceneObject, componentType, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    function search(currentObject, currentDepth) {
        if (currentDepth >= maxDepth) {
            return null;
        }
        const childrenCount = currentObject.getChildrenCount();
        for (let i = 0; i < childrenCount; i++) {
            const child = currentObject.getChild(i);
            const component = child.getComponent(componentType);
            if (component) {
                return component;
            }
            const foundInChildren = search(child, currentDepth + 1);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
        return null;
    }
    return search(sceneObject, 0);
}
/**
 * Recursively finds all components of a specific type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param componentType - The type of component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns An array of all matching components found.
 */
function findAllComponentsInChildren(sceneObject, componentType, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    const results = [];
    function search(currentObject, currentDepth) {
        if (currentDepth >= maxDepth) {
            return;
        }
        const childrenCount = currentObject.getChildrenCount();
        for (let i = 0; i < childrenCount; i++) {
            const child = currentObject.getChild(i);
            const component = child.getComponent(componentType);
            if (component) {
                results.push(component);
            }
            search(child, currentDepth + 1);
        }
    }
    search(sceneObject, 0);
    return results;
}
/**
 * Recursively searches for the first script component of a specific class type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns The first script component found, or null if none exists.
 */
function findScriptComponentInChildren(sceneObject, scriptClass, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    function search(currentObject, currentDepth) {
        if (currentDepth >= maxDepth) {
            return null;
        }
        const childrenCount = currentObject.getChildrenCount();
        for (let i = 0; i < childrenCount; i++) {
            const child = currentObject.getChild(i);
            for (const component of child.getComponents("Component.ScriptComponent")) {
                if (component instanceof scriptClass) {
                    return component;
                }
            }
            const foundInChildren = search(child, currentDepth + 1);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
        return null;
    }
    return search(sceneObject, 0);
}
/**
 * Recursively finds all script components of a specific class type in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxDepth - Maximum search depth.
 * @returns An array of all matching script components found.
 */
function findAllScriptComponentsInChildren(sceneObject, scriptClass, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    const results = [];
    function search(currentObject, currentDepth) {
        if (currentDepth >= maxDepth) {
            return;
        }
        const childrenCount = currentObject.getChildrenCount();
        for (let i = 0; i < childrenCount; i++) {
            const child = currentObject.getChild(i);
            for (const component of child.getComponents("Component.ScriptComponent")) {
                if (component instanceof scriptClass) {
                    results.push(component);
                }
            }
            search(child, currentDepth + 1);
        }
    }
    search(sceneObject, 0);
    return results;
}
/**
 * Searches for the first component of a specific type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first component found, or null if none exists.
 */
function findComponentInParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent && levelsSearched < maxLevels) {
        const component = parent.getComponent(componentType);
        if (component) {
            return component;
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return null;
}
/**
 * Finds all components of a specific type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching components found.
 */
function findAllComponentsInParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const results = [];
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent && levelsSearched < maxLevels) {
        const component = parent.getComponent(componentType);
        if (component) {
            results.push(component);
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return results;
}
/**
 * Searches for the first script component of a specific class type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first script component found, or null if none exists.
 */
function findScriptComponentInParents(sceneObject, scriptClass, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent && levelsSearched < maxLevels) {
        for (const component of parent.getComponents("Component.ScriptComponent")) {
            if (component instanceof scriptClass) {
                return component;
            }
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return null;
}
/**
 * Finds all script components of a specific class type in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching script components found.
 */
function findAllScriptComponentsInParents(sceneObject, scriptClass, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const results = [];
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent && levelsSearched < maxLevels) {
        for (const component of parent.getComponents("Component.ScriptComponent")) {
            if (component instanceof scriptClass) {
                results.push(component);
            }
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return results;
}
/**
 * Searches for the first component on the SceneObject itself, then in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first component found, or null if none exists.
 */
function findComponentInSelfOrParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const selfComponent = sceneObject.getComponent(componentType);
    if (selfComponent) {
        return selfComponent;
    }
    return findComponentInParents(sceneObject, componentType, maxLevels);
}
/**
 * Finds all components on the SceneObject itself and in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching components found.
 */
function findAllComponentsInSelfOrParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const results = [];
    const selfComponent = sceneObject.getComponent(componentType);
    if (selfComponent) {
        results.push(selfComponent);
    }
    return results.concat(findAllComponentsInParents(sceneObject, componentType, maxLevels));
}
/**
 * Searches for the first script component on the SceneObject itself, then in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns The first script component found, or null if none exists.
 */
function findScriptComponentInSelfOrParents(sceneObject, scriptClass, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    for (const component of sceneObject.getComponents("Component.ScriptComponent")) {
        if (component instanceof scriptClass) {
            return component;
        }
    }
    return findScriptComponentInParents(sceneObject, scriptClass, maxLevels);
}
/**
 * Finds all script components on the SceneObject itself and in its parent hierarchy.
 *
 * @param sceneObject - The SceneObject to start the search from.
 * @param scriptClass - The constructor/class of the script component to search for.
 * @param maxLevels - Maximum number of parent levels to search.
 * @returns An array of all matching script components found.
 */
function findAllScriptComponentsInSelfOrParents(sceneObject, scriptClass, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const results = [];
    for (const component of sceneObject.getComponents("Component.ScriptComponent")) {
        if (component instanceof scriptClass) {
            results.push(component);
        }
    }
    return results.concat(findAllScriptComponentsInParents(sceneObject, scriptClass, maxLevels));
}
//# sourceMappingURL=SceneObjectUtils.js.map