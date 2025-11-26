"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoOpFilter = void 0;
/**
 * A filter that does nothing.
 */
class NoOpFilter {
    filter(sample, _timestamp) {
        return sample;
    }
}
exports.NoOpFilter = NoOpFilter;
//# sourceMappingURL=Filter.js.map