"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmoothFollow = exports.SmoothFollowOptions = void 0;
const FunctionTimingUtils_1 = require("../../../../Utils/FunctionTimingUtils");
const mathUtils_1 = require("../../../../Utils/mathUtils");
const validate_1 = require("../../../../Utils/validate");
class SmoothFollowOptions {
    constructor(frame) {
        this.frame = frame;
    }
}
exports.SmoothFollowOptions = SmoothFollowOptions;
/**
 * SmoothFollow is a body dynamic behavior which when applied to a scene object,
 * makes it stay in the same relative horizontal position and distance to the
 * user's field of view as they turn their head left and right and move around.
 * It doesn't affect the positioning of the scene object when the user looks up
 * and down or changes elevation. Interpolation is handled by a spring-damper
 * in cylindrical coordinates.
 */
class SmoothFollow {
    constructor(options) {
        this.options = options;
        this.frame = this.options.frame;
        this.mainCamera = this.frame.worldCamera;
        this.cameraTransform = this.mainCamera.getTransform();
        this.transform = this.frame.parentTransform;
        this.fieldOfView = 26;
        this.visibleWidth = 20;
        this.minDistance = 25;
        this.maxDistance = 110;
        this.minElevation = -40;
        this.maxElevation = 40;
        this.translationTime = 0.35;
        this.rotationTime = 0.55;
        (0, validate_1.validate)(this.transform);
        this.target = vec3.zero();
        this.velocity = vec3.zero();
        this.omega = 0;
        this.heading = 0;
        this.dragging = false;
        this.initialRot = this.transform.getLocalRotation();
        this.heading = this.cameraHeading;
        this.worldRot = quat.angleAxis(this.heading, vec3.up()).multiply(this.initialRot);
        this.resize(this.frame.innerSize.x + this.frame.border * 2 + this.frame.constantPadding.x);
        (0, FunctionTimingUtils_1.setTimeout)(() => {
            this.clampPosition();
        }, 32);
    }
    startDragging() {
        this.dragging = true;
    }
    finishDragging() {
        this.dragging = false;
        this.clampPosition();
    }
    resize(visibleWidth) {
        this.visibleWidth = visibleWidth;
        this.clampPosition();
    }
    clampPosition() {
        // the initial goal of the follower is whereever it is relative to the
        // camera when the component gets enabled. the grab bar works by disabling
        // this component when grabbed, and reenables it when let go.
        if (this.dragging)
            return; // skip while actively scaling
        this.target = this.cartesianToCylindrical(this.worldToBody(this.worldPos));
        this.target.z = (0, mathUtils_1.clamp)(this.target.z, this.minDistance, this.maxDistance);
        this.target.z = Math.max(this.target.z, (1.1 * this.visibleWidth) / 2 / Math.tan((this.fieldOfView / 2) * mathUtils_1.DegToRad)); // handle very wide panels
        this.target.y = (0, mathUtils_1.clamp)(this.target.y, this.minElevation, this.maxElevation);
        const dist = new vec2(this.target.y, this.target.z).length;
        const halfFov = Math.atan((Math.tan((this.fieldOfView / 2) * mathUtils_1.DegToRad) * dist - this.visibleWidth / 2) / this.target.z);
        this.target.x = (0, mathUtils_1.clamp)(this.target.x, -halfFov, halfFov);
        this.velocity = vec3.zero();
        this.omega = 0;
    }
    onUpdate() {
        if (!this.dragging) {
            const pos = this.cartesianToCylindrical(this.worldToBody(this.worldPos));
            // y is special because target elevation is leashed between a range of values,
            // rather <than how x and z work where they are leashed to a single value.
            this.target.y = (0, mathUtils_1.clamp)(pos.y, this.minElevation, this.maxElevation);
            [pos.x, this.velocity.x] = (0, mathUtils_1.smoothDamp)(pos.x, this.target.x, this.velocity.x, this.translationTime, getDeltaTime());
            [pos.y, this.velocity.y] = (0, mathUtils_1.smoothDamp)(pos.y, this.target.y, this.velocity.y, this.translationTime, getDeltaTime());
            [pos.z, this.velocity.z] = (0, mathUtils_1.smoothDamp)(pos.z, this.target.z, this.velocity.z, this.translationTime, getDeltaTime());
            this.worldPos = this.bodyToWorld(this.cylindricalToCartesian(pos));
            [this.heading, this.omega] = (0, mathUtils_1.smoothDampAngle)(this.heading, this.cameraHeading, this.omega, this.rotationTime, getDeltaTime());
            // force billboard
            this.worldRot = quat.lookAt(this.cameraPos.sub(this.worldPos).normalize(), vec3.up()).multiply(this.initialRot);
        }
    }
    cartesianToCylindrical(v) {
        return new vec3(Math.atan2(-v.x, -v.z), v.y, Math.sqrt(v.x * v.x + v.z * v.z));
    }
    cylindricalToCartesian(v) {
        return new vec3(v.z * -Math.sin(v.x), v.y, v.z * -Math.cos(v.x));
    }
    worldToBody(v) {
        return quat.angleAxis(-this.cameraHeading, vec3.up()).multiplyVec3(v.sub(this.cameraPos));
    }
    bodyToWorld(v) {
        return quat.angleAxis(this.cameraHeading, vec3.up()).multiplyVec3(v).add(this.cameraPos);
    }
    get cameraHeading() {
        const forward = this.cameraTransform.getWorldTransform().multiplyDirection(new vec3(0, 0, -1));
        return Math.atan2(-forward.x, -forward.z);
    }
    get cameraPos() {
        return this.cameraTransform.getWorldPosition();
    }
    get worldRot() {
        (0, validate_1.validate)(this.transform);
        return this.transform.getWorldRotation();
    }
    set worldRot(value) {
        (0, validate_1.validate)(this.transform);
        this.transform.setWorldRotation(value);
    }
    get worldPos() {
        (0, validate_1.validate)(this.transform);
        return this.transform.getWorldPosition();
    }
    set worldPos(value) {
        (0, validate_1.validate)(this.transform);
        this.transform.setWorldPosition(value);
    }
}
exports.SmoothFollow = SmoothFollow;
//# sourceMappingURL=SmoothFollow.js.map