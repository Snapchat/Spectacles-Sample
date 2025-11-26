"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EPSILON_LENGTH = 1e-6;
/**
 * Represents a rotation around an arbitrary axis.
 */
class AxisAngle {
    /**
     * @param axis - the axis of the rotation
     * @param angle - the angle of the rotation
     */
    constructor(axis, angle) {
        this.axis = axis;
        this.angle = angle;
    }
    /**
     * @returns a new rotation created from 'this' where the angle is multiplied by the given factor.
     * @param factor - the factor to multiply the original rotation's angle with.
     */
    multipliedBy(factor) {
        return new AxisAngle(this.axis, factor * this.angle);
    }
    static applyRotation(axisAngle, vec3) {
        return quat.angleAxis(axisAngle.angle, axisAngle.axis).multiplyVec3(vec3);
    }
    /**
     * @returns the rotation between the directions of two vectors in the form of axis & angle
     * @param v1 - the direction to rotate from
     * @param v2 - the direction to rotate to
     */
    static getRotationBetween(v1, v2) {
        const v1unit = v1.normalize();
        const v2unit = v2.normalize();
        const cross = v1unit.cross(v2unit);
        const crossLength = cross.length;
        if (crossLength < EPSILON_LENGTH) {
            return new AxisAngle(vec3.right(), 0);
        }
        const dot = v1unit.dot(v2unit);
        const axis = cross.normalize();
        const angle = Math.atan2(crossLength, dot);
        return new AxisAngle(axis, angle);
    }
}
exports.default = AxisAngle;
//# sourceMappingURL=AxisAngle.js.map