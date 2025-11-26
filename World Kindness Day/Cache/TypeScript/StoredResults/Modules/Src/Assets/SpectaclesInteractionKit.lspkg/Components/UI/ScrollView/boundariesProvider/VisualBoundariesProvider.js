"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualBoundariesProvider = void 0;
const SceneObjectBoundariesProvider_1 = require("./SceneObjectBoundariesProvider");
/**
 * Computes boundaries for elements with BaseMeshVisual
 */
class VisualBoundariesProvider extends SceneObjectBoundariesProvider_1.SceneObjectBoundariesProvider {
    getBoundaries() {
        if (!this.sceneObject.enabled) {
            return Rect.create(0, 0, 0, 0);
        }
        return this.getNodeBoundaries(this.sceneObject);
    }
    getNodeBoundaries(node) {
        if (!node.enabled) {
            // Infinity doesn't work, but MAX_VALUE === Infinity
            return Rect.create(Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE);
        }
        const rect = this.createNodeRectBoundaries(node);
        for (const child of node.children) {
            const childRect = this.getNodeBoundaries(child);
            if (rect.left > childRect.left) {
                rect.left = childRect.left;
            }
            if (rect.right < childRect.right) {
                rect.right = childRect.right;
            }
            if (rect.bottom > childRect.bottom) {
                rect.bottom = childRect.bottom;
            }
            if (rect.top < childRect.top) {
                rect.top = childRect.top;
            }
        }
        return rect;
    }
    createNodeRectBoundaries(sceneObject) {
        const screenTransform = sceneObject.getComponent("Component.ScreenTransform");
        if (!screenTransform) {
            throw new Error(`Missing ScreenTransform attached to ${sceneObject.name}`);
        }
        const baseMeshVisual = sceneObject.getComponent("Component.BaseMeshVisual");
        if (!baseMeshVisual) {
            // Infinity doesn't work, but MAX_VALUE === Infinity
            return Rect.create(Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE);
        }
        return this.createScreenTransformRectBoundaries(screenTransform);
    }
}
exports.VisualBoundariesProvider = VisualBoundariesProvider;
//# sourceMappingURL=VisualBoundariesProvider.js.map