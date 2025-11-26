"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionPlane = void 0;
var __selfType = requireType("./InteractionPlane");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const animate_1 = require("../../../Utils/animate");
const LensConfig_1 = require("../../../Utils/LensConfig");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const Interactable_1 = require("../Interactable/Interactable");
const DEFAULT_LERP_OFFSET_CM = 5;
const DEFAULT_INTERACTION_ZONE_DISTANCE_CM = 15;
const DEFAULT_DIRECT_ZONE_DISTANCE_CM = 7.5;
const DEFAULT_BEHIND_ZONE_DISTANCE_CM = 15;
const TAG = "InteractionPlane";
/**
 * An InteractionPlane defines a zone which triggers near field targeting logic for HandInteractors.
 * An InteractionPlane should be added to any 2D UIs with high button density, such as ContainerFrame menus.
 * Only one InteractionPlane should be added per UI (ContainerFrame adds an InteractionPlane by default).
 */
let InteractionPlane = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractionPlane = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
             * - 0: Cursor (default)
             * - 1: Ray
             * - 2: None
             */
            this.targetingVisual = this.targetingVisual;
            /**
             * The size of the interaction plane along the local X and Y axes. Defines the rectangular area of the plane where
             * hand interactions are detected. Larger values create a bigger interactive surface area.
             */
            this._planeSize = this._planeSize;
            /**
             * The depth of the plane's interaction zone along the local Z axis. Defines how far from the plane hand
             * interactions are detected. Hand interactions beyond this distance will not be detected. Larger values allow
             * interaction from greater distances.
             */
            this._proximityDistance = this._proximityDistance;
            /**
             * The maximum distance for Direct interaction with the plane.
             */
            this._directZoneDistance = this._directZoneDistance;
            /**
             * Enables visual debugging of the Interaction Plane.
             */
            this._drawDebug = this._drawDebug;
            /**
             * The maximum distance for detecting interactions behind the plane. Creates a failsafe/tolerance zone where
             * interactions can still be detected even if the user's hand accidentally penetrates through the plane.
             */
            this._behindDistance = this._behindDistance;
            /**
             *
             */
            this._lerpOffset = this._lerpOffset;
            /**
             * Local-space offset of the plane. Allows positioning the effective interaction plane relative to the host
             * SceneObject.
             */
            this._offset = this._offset;
            /**
             * Whether the direct zone in front of the interaction plane is enabled.
             * When the Interactor is within this direct zone, raycasts will be disabled.
             */
            this.enableDirectZone = true;
            this._collider = null;
            this._colliderRoot = null;
            this._colliderRootTransform = null;
            this.log = new NativeLogger_1.default(TAG);
        }
        __initialize() {
            super.__initialize();
            /**
             * Sets the preferred targeting visual. (Requires the V2 Cursor to be enabled on InteractorCursors).
             * - 0: Cursor (default)
             * - 1: Ray
             * - 2: None
             */
            this.targetingVisual = this.targetingVisual;
            /**
             * The size of the interaction plane along the local X and Y axes. Defines the rectangular area of the plane where
             * hand interactions are detected. Larger values create a bigger interactive surface area.
             */
            this._planeSize = this._planeSize;
            /**
             * The depth of the plane's interaction zone along the local Z axis. Defines how far from the plane hand
             * interactions are detected. Hand interactions beyond this distance will not be detected. Larger values allow
             * interaction from greater distances.
             */
            this._proximityDistance = this._proximityDistance;
            /**
             * The maximum distance for Direct interaction with the plane.
             */
            this._directZoneDistance = this._directZoneDistance;
            /**
             * Enables visual debugging of the Interaction Plane.
             */
            this._drawDebug = this._drawDebug;
            /**
             * The maximum distance for detecting interactions behind the plane. Creates a failsafe/tolerance zone where
             * interactions can still be detected even if the user's hand accidentally penetrates through the plane.
             */
            this._behindDistance = this._behindDistance;
            /**
             *
             */
            this._lerpOffset = this._lerpOffset;
            /**
             * Local-space offset of the plane. Allows positioning the effective interaction plane relative to the host
             * SceneObject.
             */
            this._offset = this._offset;
            /**
             * Whether the direct zone in front of the interaction plane is enabled.
             * When the Interactor is within this direct zone, raycasts will be disabled.
             */
            this.enableDirectZone = true;
            this._collider = null;
            this._colliderRoot = null;
            this._colliderRootTransform = null;
            this.log = new NativeLogger_1.default(TAG);
        }
        onAwake() {
            this.createEvent("OnDestroyEvent").bind(() => this.release());
            this.createEvent("OnEnableEvent").bind(() => {
                InteractionManager_1.InteractionManager.getInstance().registerInteractionPlane(this);
                if (this._updateEvent) {
                    this._updateEvent.enabled = true;
                }
            });
            this.createEvent("OnDisableEvent").bind(() => {
                InteractionManager_1.InteractionManager.getInstance().deregisterInteractionPlane(this);
                if (this._updateEvent) {
                    this._updateEvent.enabled = false;
                }
            });
            this.createEvent("OnStartEvent").bind(() => {
                const colliderRoot = global.scene.createSceneObject("InteractionPlaneColliderRoot");
                colliderRoot.setParent(this.sceneObject);
                this._colliderRoot = colliderRoot;
                this._colliderRootTransform = colliderRoot.getTransform();
                this._collider = colliderRoot.createComponent("ColliderComponent");
                this.buildMeshShape();
                this._collider.debugDrawEnabled = this.drawDebug;
                InteractionManager_1.InteractionManager.getInstance().registerInteractionPlane(this);
            });
            if (this.drawDebug) {
                this._updateEvent = LensConfig_1.LensConfig.getInstance().updateDispatcher.createUpdateEvent("InteractionPlaneUpdate", () => this.drawDebugPlane());
            }
        }
        release() {
            if (this._updateEvent) {
                LensConfig_1.LensConfig.getInstance().updateDispatcher.removeEvent(this._updateEvent);
                this._updateEvent = undefined;
            }
            InteractionManager_1.InteractionManager.getInstance().deregisterInteractionPlane(this);
        }
        // Manually create the mesh shape for the interaction zone to trigger NearField targeting.
        buildMeshShape() {
            if (this.collider === null) {
                return;
            }
            if (this.proximityDistance <= 0 || this.behindDistance <= 0 || this.planeSize.x <= 0 || this.planeSize.y <= 0) {
                this.log.f(`InteractionPlane must have proximityDistance, behindDistance, or planeSize set to positive values.`);
            }
            const shape = Shape.createBoxShape();
            shape.size = new vec3(this.planeSize.x + this.lerpOffset, this.planeSize.y + this.lerpOffset, (this.proximityDistance + this.lerpOffset) * 2);
            this.collider.shape = shape;
            if (this._colliderRootTransform !== null) {
                this._colliderRootTransform.setLocalPosition(this._offset);
            }
        }
        /**
         * Sets the size (in world units) of the plane's interaction zone along the local X and Y axes of the SceneObject.
         */
        set planeSize(size) {
            this._planeSize = size;
            this.buildMeshShape();
        }
        /**
         * @returns the size (in world units) of the plane's interaction zone along the local X and Y axes of the SceneObject.
         */
        get planeSize() {
            return this._planeSize;
        }
        /**
         * Sets the depth (in world units) of the plane's interaction zone along the local Z axis of the SceneObject.
         */
        set proximityDistance(distance) {
            this._proximityDistance = distance;
            this.buildMeshShape();
        }
        /**
         * Returns the depth (in world units) of the plane's interaction zone along the local Z axis of the SceneObject.
         */
        get proximityDistance() {
            return this._proximityDistance;
        }
        /**
         * Sets the depth (in world units) of the plane's direct interaction zone along the local Z axis of the SceneObject.
         */
        set directZoneDistance(distance) {
            this._directZoneDistance = distance;
        }
        /**
         * Returns the depth (in world units) of the plane's direct interaction zone along the local Z axis of the SceneObject.
         */
        get directZoneDistance() {
            return this._directZoneDistance;
        }
        /**
         * Sets the depth (in world units) of the plane's behind zone along the local Z axis of the SceneObject.
         */
        set behindDistance(distance) {
            this._behindDistance = distance;
            this.buildMeshShape();
        }
        /**
         * Returns the depth (in world units) of the plane's behind zone along the local Z axis of the SceneObject.
         */
        get behindDistance() {
            return this._behindDistance;
        }
        /**
         * Sets the depth (in world units) of the plane's lerp zone.
         */
        set lerpOffset(distance) {
            this._lerpOffset = distance;
            this.buildMeshShape();
        }
        /**
         * Returns the depth (in world units) of the plane's lerp zone.
         */
        get lerpOffset() {
            return this._lerpOffset;
        }
        /**
         * Sets if the interaction zone should be drawn via debug gizmos.
         */
        set drawDebug(enabled) {
            this._drawDebug = enabled;
            if (this.collider !== null) {
                this.collider.debugDrawEnabled = enabled;
            }
        }
        /**
         * @returns if the interaction zone should be drawn via debug gizmos.
         */
        get drawDebug() {
            return this._drawDebug;
        }
        /**
         * @returns a vec3 representing the normal vector of the plane.
         */
        get normal() {
            return this.getTransform().forward;
        }
        /**
         * Returns the collider of the InteractionPlane after initialization during OnStartEvent.
         * Returns null otherwise.
         */
        get collider() {
            return this._collider;
        }
        /**
         * Sets the local-space offset of the interaction plane (affects both collider placement and projection origin).
         */
        set offset(offset) {
            this._offset = offset;
            this.buildMeshShape();
        }
        /**
         * Returns the local-space offset of the interaction plane.
         */
        get offset() {
            return this._offset;
        }
        /**
         * Project a 3D point in world space onto the InteractionPlane.
         * @param point - a 3D point in world space
         * @returns - a ZoneProjection representing the point's projection onto the plane, the distance of the point from the plane (negative if behind the plane),
         *            a boolean checking if the point resides within the interaction zone of the plane (defined by size and proximityDistance),
         *            and a boolean checking if the point resides within the behind zone of the plane (right behind the plane),
         *            or null if the point does not project onto the plane.
         */
        projectPoint(point) {
            if (!this.enabled || !this.sceneObject.isEnabledInHierarchy) {
                return null;
            }
            // This logic uses the equation of t = ((p0-l0)·n)/(l·n) with l0 + l*t = the point of intersection.
            // l0 represents point, l represents direction, p0 represents plane origin, and n represents the plane normal.
            const transform = this.sceneObject.getTransform();
            const n = transform.forward;
            const r = transform.right;
            const u = transform.up;
            const s = transform.getWorldScale();
            const baseOrigin = transform.getWorldPosition();
            const worldOffset = r
                .uniformScale(this._offset.x * s.x)
                .add(u.uniformScale(this._offset.y * s.y))
                .add(n.uniformScale(this._offset.z * s.z));
            const po = baseOrigin.add(worldOffset);
            const v = po.sub(point);
            const l = n.uniformScale(-1);
            const t = v.dot(n) / l.dot(n);
            // Project the point onto the plane.
            const projectedPoint = point.add(l.uniformScale(t));
            // Get the local X and Y coordinates within the plane space to check if the point resides within the interaction zone.
            const d = projectedPoint.sub(po);
            const x = d.dot(r);
            const y = d.dot(u);
            // Get the distance of the original point from the plane.
            const distance = point.sub(projectedPoint).length * Math.sign(t);
            // Check if the point is in front of the plane, within the proximity distance threshold, and within the planeSize boundaries.
            const isWithinInteractionZone = distance >= 0 &&
                distance <= this.proximityDistance + this.lerpOffset &&
                Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
                Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset;
            // Check if the point is within the direct interaction distance threshold.
            const isWithinDirectZone = this.enableDirectZone &&
                distance >= 0 &&
                distance <= this.directZoneDistance &&
                Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
                Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset;
            // Check if the point is in behind the plane, within the behind zone distance threshold, and within the planeSize boundaries.
            const isWithinBehindZone = distance < 0 &&
                distance >= -this.behindDistance &&
                Math.abs(x) <= this.planeSize.x / 2 + this.lerpOffset &&
                Math.abs(y) <= this.planeSize.y / 2 + this.lerpOffset;
            const distanceToHorizontalEdge = Math.abs(x) - this.planeSize.x / 2;
            const horizontalLerpValue = distanceToHorizontalEdge > 0 ? 1 - Math.min(distanceToHorizontalEdge, this.lerpOffset) / this.lerpOffset : 1;
            const distanceToVerticalEdge = Math.abs(y) - this.planeSize.y / 2;
            const verticalLerpValue = distanceToVerticalEdge > 0 ? 1 - Math.min(distanceToVerticalEdge, this.lerpOffset) / this.lerpOffset : 1;
            const distanceToProximityEdge = distance - this.proximityDistance;
            const proximityLerpValue = distanceToProximityEdge > 0 ? 1 - Math.min(distanceToProximityEdge, this.lerpOffset) / this.lerpOffset : 1;
            const lerpValue = animate_1.easingFunctions["ease-in-out-sine"](Math.min(horizontalLerpValue, verticalLerpValue, proximityLerpValue));
            // If the point is within the interaction zone, return the plane projection data. Otherwise, return null.
            const planeProjection = {
                point: projectedPoint,
                distance: distance,
                isWithinInteractionZone: isWithinInteractionZone,
                isWithinBehindZone: isWithinBehindZone,
                isWithinDirectZone: isWithinDirectZone,
                lerpValue: lerpValue
            };
            return planeProjection;
        }
        checkRayIntersection(rayStart, rayEnd) {
            const po = this.sceneObject.getTransform().getWorldPosition();
            const n = this.sceneObject.getTransform().forward;
            const direction = rayEnd.sub(rayStart);
            const dot = direction.dot(n);
            if (Math.abs(dot) > 1e-6) {
                const w = rayStart.sub(po);
                const t = -n.dot(w) / dot;
                const intersectionPoint = rayStart.add(direction.uniformScale(t));
                const r = this.sceneObject.getTransform().right;
                const u = this.sceneObject.getTransform().up;
                // Get the local X and Y coordinates within the plane space to check if the point resides within the interaction zone.
                const d = intersectionPoint.sub(po);
                const x = d.dot(r);
                const y = d.dot(u);
                const withinX = Math.abs(x) <= this.planeSize.x / 2;
                const withinY = Math.abs(y) <= this.planeSize.y / 2;
                return withinX && withinY;
            }
            return false;
        }
        /**
         * Draws a debug visualization of the plane itself (not just the collider).
         * Also draws a box representing the proximityDistance.
         */
        drawDebugPlane() {
            if (!this.sceneObject || !this.drawDebug)
                return;
            const transform = this.sceneObject.getTransform();
            const po = transform.getWorldPosition();
            const s = transform.getWorldScale();
            const r = transform.right;
            const u = transform.up;
            const n = transform.forward;
            const halfX = (this.planeSize.x / 2) * s.x;
            const halfY = (this.planeSize.y / 2) * s.y;
            // Draw the plane rectangle
            const corners = [
                po.add(r.uniformScale(-halfX)).add(u.uniformScale(-halfY)), // Bottom Left
                po.add(r.uniformScale(halfX)).add(u.uniformScale(-halfY)), // Bottom Right
                po.add(r.uniformScale(halfX)).add(u.uniformScale(halfY)), // Top Right
                po.add(r.uniformScale(-halfX)).add(u.uniformScale(halfY)) // Top Left
            ];
            for (let i = 0; i < 4; i++) {
                const start = corners[i];
                const end = corners[(i + 1) % 4];
                global.debugRenderSystem.drawLine(start, end, new vec4(0, 1, 0, 1));
            }
            // Draw the proximityDistance box
            const halfZ = (this.proximityDistance / 2) * s.z;
            const boxCorners = [];
            for (const dz of [-halfZ, halfZ]) {
                for (const dy of [-halfY, halfY]) {
                    for (const dx of [-halfX, halfX]) {
                        boxCorners.push(po.add(r.uniformScale(dx)).add(u.uniformScale(dy)).add(n.uniformScale(dz)));
                    }
                }
            }
            const edges = [
                [0, 1],
                [1, 3],
                [3, 2],
                [2, 0], // bottom face
                [4, 5],
                [5, 7],
                [7, 6],
                [6, 4], // top face
                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7] // vertical edges
            ];
            for (const [i, j] of edges) {
                global.debugRenderSystem.drawLine(boxCorners[i], boxCorners[j], new vec4(0, 0.5, 1, 1));
            }
        }
    };
    __setFunctionName(_classThis, "InteractionPlane");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractionPlane = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractionPlane = _classThis;
})();
exports.InteractionPlane = InteractionPlane;
//# sourceMappingURL=InteractionPlane.js.map