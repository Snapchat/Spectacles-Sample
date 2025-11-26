"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceContainerParent = exports.FRAME_PARENT_NAME = void 0;
// auto parenting
// to prevent collisions with existing ancestry
// hardcoded hash appended to name used across container components
// generated beforehand and will remain static, actual values not important, except that they match across components
const SECRET_HASH = "a43675b3f";
exports.FRAME_PARENT_NAME = "ContainerParent" + SECRET_HASH;
const forceContainerParent = (options) => {
    const thisObject = options.target;
    const currentParent = thisObject.getParent();
    let containerParent;
    if (currentParent === null || currentParent?.name !== exports.FRAME_PARENT_NAME) {
        containerParent = global.scene.createSceneObject(exports.FRAME_PARENT_NAME);
        if (currentParent !== null) {
            containerParent.setParent(currentParent);
        }
        thisObject.setParentPreserveWorldTransform(containerParent);
    }
    else {
        containerParent = currentParent;
    }
    return containerParent;
};
exports.forceContainerParent = forceContainerParent;
//# sourceMappingURL=ForceContainerParent.js.map