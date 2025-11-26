export type ContainerParentConfig = {
  target: SceneObject
}

// auto parenting
// to prevent collisions with existing ancestry
// hardcoded hash appended to name used across container components
// generated beforehand and will remain static, actual values not important, except that they match across components
const SECRET_HASH = "a43675b3f"
export const FRAME_PARENT_NAME = "ContainerParent" + SECRET_HASH
export const forceContainerParent = (options: ContainerParentConfig): SceneObject => {
  const thisObject = options.target
  const currentParent = thisObject.getParent()
  let containerParent: SceneObject
  if (currentParent === null || currentParent?.name !== FRAME_PARENT_NAME) {
    containerParent = global.scene.createSceneObject(FRAME_PARENT_NAME)
    if (currentParent !== null) {
      containerParent.setParent(currentParent)
    }
    thisObject.setParentPreserveWorldTransform(containerParent)
  } else {
    containerParent = currentParent
  }

  return containerParent
}
