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
exports.CapsuleMeshCustomizer = void 0;
var __selfType = requireType("./CapsuleMeshCustomizer");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * This class customizes a mesh visual to create an extendable capsule shape. It allows configuration of the capsule's
 * length, radius, and poly-count through various input properties.
 */
let CapsuleMeshCustomizer = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CapsuleMeshCustomizer = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * The mesh visual to modify into an extendable capsule.
             */
            this.meshVisual = this.meshVisual;
            /**
             * The length of the capsule, excluding the end caps.
             */
            this.capsuleLength = this.capsuleLength;
            /**
             * The radius of the end caps and the radius of the cylindric section.
             */
            this.radius = this.radius;
            /**
             * The number of points per circle in the mesh. Increase for a higher poly-count mesh.
             */
            this.radianStepCount = this.radianStepCount;
            /**
             * The number of circles in the cylinder of the mesh. Increase for a higher poly-count mesh.
             */
            this.cylinderStepCount = this.cylinderStepCount;
            /**
             * The number of circles in the end cap of the capsule mesh. Increase for a higher poly-count mesh.
             */
            this.endXStepCount = this.endXStepCount;
            this.uLength = Math.PI * this.radius * this.radius;
            this.endPointNormals = [1, 0, 0, -1, 0, 0];
            this.endPointUVs = [0, 0.5, 0.5, 0.5];
            this.builder = new MeshBuilder([
                { name: "position", components: 3 },
                { name: "normal", components: 3, normalized: true },
                { name: "texture0", components: 2 }
            ]);
        }
        __initialize() {
            super.__initialize();
            /**
             * The mesh visual to modify into an extendable capsule.
             */
            this.meshVisual = this.meshVisual;
            /**
             * The length of the capsule, excluding the end caps.
             */
            this.capsuleLength = this.capsuleLength;
            /**
             * The radius of the end caps and the radius of the cylindric section.
             */
            this.radius = this.radius;
            /**
             * The number of points per circle in the mesh. Increase for a higher poly-count mesh.
             */
            this.radianStepCount = this.radianStepCount;
            /**
             * The number of circles in the cylinder of the mesh. Increase for a higher poly-count mesh.
             */
            this.cylinderStepCount = this.cylinderStepCount;
            /**
             * The number of circles in the end cap of the capsule mesh. Increase for a higher poly-count mesh.
             */
            this.endXStepCount = this.endXStepCount;
            this.uLength = Math.PI * this.radius * this.radius;
            this.endPointNormals = [1, 0, 0, -1, 0, 0];
            this.endPointUVs = [0, 0.5, 0.5, 0.5];
            this.builder = new MeshBuilder([
                { name: "position", components: 3 },
                { name: "normal", components: 3, normalized: true },
                { name: "texture0", components: 2 }
            ]);
        }
        onAwake() {
            this.defineScriptEvents();
        }
        defineScriptEvents() {
            this.createEvent("OnStartEvent").bind(() => {
                this.init();
            });
        }
        init() {
            this.builder.topology = MeshTopology.Triangles;
            this.builder.indexType = MeshIndexType.UInt16;
            this.buildCapsule();
        }
        buildCircle(originX, radius, isEnd) {
            let points = [];
            let normals = [];
            let uvs = [];
            let uProportion;
            if (isEnd) {
                let arcLength;
                if (originX < 0) {
                    arcLength = (((this.radius + this.capsuleLength / 2 + originX) / this.radius) * this.uLength) / 4;
                }
                else {
                    arcLength =
                        ((1 - (this.radius + this.capsuleLength / 2 - originX) / this.radius) * this.uLength) / 4 + this.uLength / 4;
                }
                uProportion = arcLength;
            }
            else {
                uProportion = this.uLength / 4;
            }
            for (let i = -Math.PI / 2; i < 1.5 * Math.PI; i += Math.PI / this.radianStepCount) {
                const point = [originX, radius * Math.sin(i), radius * Math.cos(i)];
                const normal = [0, -radius * Math.sin(i), -radius * Math.cos(i)];
                const firstHalf = i <= Math.PI / 2;
                let u = uProportion / this.uLength;
                if (!firstHalf) {
                    u = 1 - u;
                }
                const uv = [u, 0.5 + radius * Math.sin(i) * 0.5];
                points = points.concat(point);
                normals = normals.concat(normal);
                uvs = uvs.concat(uv);
            }
            return [points, normals, uvs];
        }
        buildCylinder(length, radius) {
            let points = [];
            let normals = [];
            let uvs = [];
            for (let circleCount = 0; circleCount < this.cylinderStepCount; circleCount++) {
                const i = -length / 2 + (circleCount * length) / this.cylinderStepCount;
                const circleData = this.buildCircle(i, radius, false);
                points = points.concat(circleData[0]);
                normals = normals.concat(circleData[1]);
                uvs = uvs.concat(circleData[2]);
            }
            return [points, normals, uvs];
        }
        buildEndCap(originX, radius, isRight) {
            let points = [];
            let normals = [];
            let uvs = [];
            const step = radius / this.endXStepCount;
            for (let i = isRight ? step : -radius + step; i < (isRight ? radius : 0); i += step) {
                const crossSectionRadius = Math.sqrt(radius ** 2 - i ** 2);
                const circleData = this.buildCircle(i + originX, crossSectionRadius, true);
                points = points.concat(circleData[0]);
                for (let j = 0; j < this.radianStepCount * 2; j++) {
                    circleData[1][j * 3] = -i;
                }
                normals = normals.concat(circleData[1]);
                uvs = uvs.concat(circleData[2]);
            }
            return [points, normals, uvs];
        }
        // TODO: Investigate, circleIndexB is never used.
        linkCircleIndices(circleIndexA, _circleIndexB) {
            let indices = [];
            const numPoints = this.radianStepCount * 2;
            const firstIndex = circleIndexA * numPoints;
            for (let i = firstIndex; i < (circleIndexA + 1) * numPoints - 1; i++) {
                indices = indices.concat([i + 1, i + numPoints, i]);
                indices = indices.concat([i + 1, i + numPoints + 1, i + numPoints]);
            }
            const lastIndex = (circleIndexA + 1) * numPoints - 1;
            indices = indices.concat([
                firstIndex,
                lastIndex + numPoints,
                lastIndex,
                firstIndex,
                firstIndex + numPoints,
                lastIndex + numPoints
            ]);
            return indices;
        }
        linkCapsuleIndices() {
            let indices = [];
            const numCircles = (this.endXStepCount - 1) * 2 + this.cylinderStepCount;
            for (let i = 0; i < numCircles - 1; i++) {
                indices = indices.concat(this.linkCircleIndices(i, i + 1));
            }
            return indices;
        }
        linkEndIndices(endIndex, circleIndex, isRight) {
            let indices = [];
            const numPoints = this.radianStepCount * 2;
            const firstIndex = circleIndex * numPoints;
            for (let i = firstIndex; i < firstIndex + numPoints - 1; i++) {
                if (isRight) {
                    indices = indices.concat([i + 1, endIndex, i]);
                }
                else {
                    indices = indices.concat([endIndex, i + 1, i]);
                }
            }
            const lastIndex = (circleIndex + 1) * numPoints - 1;
            if (isRight) {
                indices = indices.concat([firstIndex, endIndex, lastIndex]);
            }
            else {
                indices = indices.concat([endIndex, firstIndex, lastIndex]);
            }
            return indices;
        }
        checkValid() {
            return this.radius === 0 || this.radianStepCount === 0 || this.cylinderStepCount === 0 || this.endXStepCount === 0;
        }
        buildCapsule() {
            if (this.checkValid()) {
                throw new Error("Step counts and radius must be positive, whole numbers.");
            }
            if (this.builder.getIndicesCount() !== 0) {
                this.builder.eraseIndices(0, this.builder.getIndicesCount());
            }
            if (this.builder.getVerticesCount() !== 0) {
                this.builder.eraseVertices(0, this.builder.getVerticesCount());
            }
            const leftEndCap = this.buildEndCap(-this.capsuleLength / 2, this.radius, false);
            const cylinder = this.buildCylinder(this.capsuleLength, this.radius);
            const rightEndCap = this.buildEndCap(this.capsuleLength / 2, this.radius, true);
            const endPoints = [
                [-this.capsuleLength / 2 - this.radius, 0, 0, this.capsuleLength / 2 + this.radius, 0, 0],
                this.endPointNormals,
                this.endPointUVs
            ];
            this.builder.appendVertices(leftEndCap);
            this.builder.appendVertices(cylinder);
            this.builder.appendVertices(rightEndCap);
            this.builder.appendVertices(endPoints);
            this.builder.appendIndices(this.linkCapsuleIndices());
            this.builder.appendIndices(this.linkEndIndices(this.builder.getVerticesCount() - 1, (this.endXStepCount - 1) * 2 + this.cylinderStepCount - 1, true));
            this.builder.appendIndices(this.linkEndIndices(this.builder.getVerticesCount() - 2, 0, false));
            if (this.builder.isValid()) {
                this.meshVisual.mesh = this.builder.getMesh();
                this.builder.updateMesh();
            }
            else {
                throw new Error("Invalid mesh, check parameters to ensure positive whole numbers for vertex counts!");
            }
        }
        setLength(newLength) {
            this.capsuleLength = newLength;
            this.buildCapsule();
        }
        setRadius(newRadius) {
            this.radius = newRadius;
            this.buildCapsule();
        }
        setRadianStepCount(newCount) {
            this.radianStepCount = newCount;
            this.buildCapsule();
        }
        setCylinderStepCount(newCount) {
            this.cylinderStepCount = newCount;
            this.buildCapsule();
        }
        setEndXStepCount(newCount) {
            this.endXStepCount = newCount;
            this.buildCapsule();
        }
    };
    __setFunctionName(_classThis, "CapsuleMeshCustomizer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CapsuleMeshCustomizer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CapsuleMeshCustomizer = _classThis;
})();
exports.CapsuleMeshCustomizer = CapsuleMeshCustomizer;
//# sourceMappingURL=CapsuleMeshCustomizer.js.map