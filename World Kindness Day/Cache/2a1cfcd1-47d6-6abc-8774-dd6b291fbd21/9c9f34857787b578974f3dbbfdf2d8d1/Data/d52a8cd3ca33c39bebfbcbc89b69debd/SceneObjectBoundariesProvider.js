"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneObjectBoundariesProvider = void 0;
const BoundariesProvider_1 = require("./BoundariesProvider");
/**
 * Apply a boundary by computing it from a Scene Object
 */
class SceneObjectBoundariesProvider extends BoundariesProvider_1.BoundariesProvider {
    /**
     * Apply a boundary by computing it from a Scene Object. Must have a ScreenTransform.
     * @param sceneObject - The scene object to compute using
     */
    constructor(sceneObject) {
        super();
        this.sceneObject = sceneObject;
        this.screenTransform = this.sceneObject.getComponent("Component.ScreenTransform");
        this.startingPosition = this.localPointToParentPoint(this.screenTransform, vec2.zero());
        if (!this.screenTransform) {
            throw new Error(`ScreenTransform missing in ${this.sceneObject.name}`);
        }
        const position = this.screenTransform.localPointToWorldPoint(vec2.zero());
        this.startingPosition = new vec2(position.x, position.y);
        this.startingBoundaries = this.getBoundaries();
    }
    get boundaries() {
        const offsetPosition = this.localPointToParentPoint(this.screenTransform, vec2.zero()).sub(this.startingPosition);
        return Rect.create(this.startingBoundaries.left + offsetPosition.x, this.startingBoundaries.right + offsetPosition.x, this.startingBoundaries.bottom + offsetPosition.y, this.startingBoundaries.top + offsetPosition.y);
    }
    /**
     * @returns local position in world units relative to the parent's center
     */
    get position() {
        return this.screenTransform.position;
    }
    /**
     * Sets local position in world units relative to the parent's center
     * @param position - desired position
     */
    set position(position) {
        this.screenTransform.position = position;
    }
    /**
     * Recomputes starting boundaries
     */
    recomputeStartingBoundaries() {
        this.startingPosition = this.localPointToParentPoint(this.screenTransform, vec2.zero());
        this.startingBoundaries = this.getBoundaries();
    }
    createScreenTransformRectBoundaries(screenTransform) {
        const topLeftCorner = this.localPointToParentPoint(screenTransform, new vec2(-1, 1));
        const bottomRightCorner = this.localPointToParentPoint(screenTransform, new vec2(1, -1));
        return Rect.create(topLeftCorner.x, bottomRightCorner.x, bottomRightCorner.y, topLeftCorner.y);
    }
    localPointToParentPoint(screenTransform, position) {
        const worldPoint = screenTransform.localPointToWorldPoint(position);
        const parentPoint = this.screenTransform.worldPointToParentPoint(worldPoint);
        return parentPoint;
    }
}
exports.SceneObjectBoundariesProvider = SceneObjectBoundariesProvider;
//# sourceMappingURL=SceneObjectBoundariesProvider.js.map