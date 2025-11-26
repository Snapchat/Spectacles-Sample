"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec3SampleOps = exports.Vec2SampleOps = exports.ScalarSampleOps = void 0;
/**
 * Defines mathematical operations for
 * a scalar filter sample.
 */
class ScalarSampleOps {
    uniformScale(value, scale) {
        return value * scale;
    }
    add(first, second) {
        return first + second;
    }
    sub(first, second) {
        return first - second;
    }
    magnitude(of) {
        return Math.abs(of);
    }
    zero() {
        return 0;
    }
}
exports.ScalarSampleOps = ScalarSampleOps;
/**
 * Defines mathematical operations for
 * a vec2 filter sample.
 */
class Vec2SampleOps {
    /** @inheritdoc */
    uniformScale(value, scale) {
        return value.uniformScale(scale);
    }
    /** @inheritdoc */
    add(first, second) {
        return first.add(second);
    }
    /** @inheritdoc */
    sub(first, second) {
        return first.sub(second);
    }
    /** @inheritdoc */
    magnitude(of) {
        return of.length;
    }
    /** @inheritdoc */
    zero() {
        return vec2.zero();
    }
}
exports.Vec2SampleOps = Vec2SampleOps;
/**
 * Defines mathematical operations for
 * a vec3 filter sample.
 */
class Vec3SampleOps {
    uniformScale(value, scale) {
        return value.uniformScale(scale);
    }
    add(first, second) {
        return first.add(second);
    }
    sub(first, second) {
        return first.sub(second);
    }
    magnitude(of) {
        return of.length;
    }
    zero() {
        return vec3.zero();
    }
}
exports.Vec3SampleOps = Vec3SampleOps;
//# sourceMappingURL=SampleOps.js.map