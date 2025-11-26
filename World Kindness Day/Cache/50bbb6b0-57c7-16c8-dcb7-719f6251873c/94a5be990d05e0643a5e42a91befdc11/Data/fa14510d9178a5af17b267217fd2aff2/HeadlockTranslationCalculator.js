"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * HeadlockTranslationCalculator is used to calculate the center of the sphere used when calculating the target's position relative to the pitch/yaw orientation of the camera.
 */
class HeadlockTranslationCalculator {
    constructor(config) {
        // Controls the behavior of the sphere following along the flat plane defined by vec3.up().
        this._xzEnable = true;
        this._xzEasing = 1;
        // Controls the behavior of the sphere following along the line defined by vec3.up().
        this._yEnable = true;
        this._yEasing = 1;
        // If the user is 'close enough' to the center of the sphere, we avoid moving the sphere to decrease jitter
        this._translationBuffer = 0;
        this.center = config.center;
        this.duration = config.duration;
        this.xzEnable = config.xzEnabled ?? true;
        this.xzEasing = config.xzEasing ?? 1;
        this.yEnable = config.yEnabled ?? true;
        this.yEasing = config.yEasing ?? 1;
        this.translationBuffer = config.translationBuffer ?? 0;
    }
    get xzEnable() {
        return this._xzEnable;
    }
    set xzEnable(enabled) {
        this._xzEnable = enabled;
    }
    get yEnable() {
        return this._yEnable;
    }
    set yEnable(enabled) {
        this._yEnable = enabled;
    }
    get xzEasing() {
        return this._xzEasing;
    }
    set xzEasing(easing) {
        this._xzEasing = easing;
    }
    get yEasing() {
        return this._yEasing;
    }
    set yEasing(easing) {
        this._yEasing = easing;
    }
    get translationBuffer() {
        return this._translationBuffer;
    }
    set translationBuffer(bufferDistance) {
        this._translationBuffer = bufferDistance;
    }
    /**
     * Returns the current center of the sphere.
     */
    getCenter() {
        return this.center;
    }
    /**
     * Updates the center of the sphere and returns the offset vector to move the target by.
     * @param cameraPosition - the current world position of the camera
     */
    updateCenter(cameraPosition) {
        const oldCenter = new vec3(this.center.x, this.center.y, this.center.z);
        // Test below implementation once everything is working.
        // const oldCenter = this.center
        if (cameraPosition.sub(this.center).length < this.translationBuffer) {
            return vec3.zero();
        }
        if (this.xzEnable) {
            const cameraPositionXZ = cameraPosition.projectOnPlane(vec3.up());
            const centerXZ = this.center.projectOnPlane(vec3.up());
            let offset;
            if (this.xzEasing !== 1) {
                const timeRatio = getDeltaTime() / this.duration;
                const interpolatedXZ = vec3.lerp(centerXZ, cameraPositionXZ, this.xzEasing * timeRatio);
                offset = interpolatedXZ.sub(centerXZ);
            }
            else {
                offset = cameraPositionXZ.sub(centerXZ);
            }
            this.center = this.center.add(offset);
        }
        if (this.yEnable) {
            const cameraPositionY = cameraPosition.y;
            const centerY = this.center.y;
            let offset;
            if (this.yEasing !== 1) {
                const timeRatio = getDeltaTime() / this.duration;
                const interpolatedY = MathUtils.lerp(centerY, cameraPositionY, this.yEasing * timeRatio);
                offset = interpolatedY - centerY;
            }
            else {
                offset = cameraPositionY - centerY;
            }
            this.center = this.center.add(vec3.up().uniformScale(offset));
        }
        return this.center.sub(oldCenter);
    }
}
exports.default = HeadlockTranslationCalculator;
//# sourceMappingURL=HeadlockTranslationCalculator.js.map