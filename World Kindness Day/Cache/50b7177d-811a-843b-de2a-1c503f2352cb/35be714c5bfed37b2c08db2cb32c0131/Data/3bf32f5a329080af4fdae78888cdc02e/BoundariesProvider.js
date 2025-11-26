"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundariesProvider = void 0;
/**
 * Base class to compute boundaries
 */
class BoundariesProvider {
    /**
     * @returns the size of the rectangle boundaries as (width, height).
     */
    get size() {
        return this.boundaries.getSize();
    }
}
exports.BoundariesProvider = BoundariesProvider;
//# sourceMappingURL=BoundariesProvider.js.map