"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenTransformBoundariesProvider = void 0;
const SceneObjectBoundariesProvider_1 = require("./SceneObjectBoundariesProvider");
/**
 * Wraps screen transform boundaries
 */
class ScreenTransformBoundariesProvider extends SceneObjectBoundariesProvider_1.SceneObjectBoundariesProvider {
    getBoundaries() {
        if (!this.sceneObject.enabled) {
            return Rect.create(0, 0, 0, 0);
        }
        return this.createScreenTransformRectBoundaries(this.screenTransform);
    }
}
exports.ScreenTransformBoundariesProvider = ScreenTransformBoundariesProvider;
//# sourceMappingURL=ScreenTransformBoundariesProvider.js.map