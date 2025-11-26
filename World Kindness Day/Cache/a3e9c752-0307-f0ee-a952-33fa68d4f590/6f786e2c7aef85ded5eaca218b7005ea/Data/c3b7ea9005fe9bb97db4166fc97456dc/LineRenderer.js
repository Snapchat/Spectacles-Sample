"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./LineMeshUtils");
const View_1 = require("../View");
const color_1 = require("../../color");
const NativeLogger_1 = require("../../NativeLogger");
const DEFAULT_WIDTH = 1;
const UV_V_POSITION = 4;
const VERTEX_DATA_SIZE = 11;
const VERTICES_PER_POINT = 2;
const SEGMENT_DATA_SIZE = VERTEX_DATA_SIZE * VERTICES_PER_POINT;
const DEFAULT_RENDER_ORDER = 20;
const TAG = "LineRenderer";
/**
 * The LineRenderer is a custom component that draws a line in 3D space with RenderMeshVisual.
 * It uses MeshBuilder to programmatically generate a line strip given a list of points provided by the user.
 */
class LineRenderer extends View_1.default {
    constructor(config) {
        super(config);
        this.log = new NativeLogger_1.default(TAG);
        this._points = this.config.points ?? [];
        this._startWidth = this.config.startWidth ?? DEFAULT_WIDTH;
        this._endWidth = this.config.endWidth ?? DEFAULT_WIDTH;
        this._startColor = this.config.startColor ?? (0, color_1.YELLOW)(1);
        this._endColor = this.config.endColor ?? (0, color_1.YELLOW)(1);
        this._lookAtCamera = this.config.lookAtCamera ?? false;
        this.meshBuilder = this.setupMeshBuilder();
        this.meshVertexData = [];
        this.material = this.config.material.clone();
        // Create a container for the line mesh and parent it immediately to the scene object containing this component
        // Prevent hierarchy issues, such as having a component attached to a SceneObject that is parented to another scene object
        // Transformations should be done on the parent object rather than directly on the line renderer
        this.meshComponent = this.container.createComponent("Component.RenderMeshVisual");
        this.mesh = this.buildMesh();
        // Set up mesh component and material
        this.meshComponent.mesh = this.mesh;
        this.meshComponent.mainMaterial = this.material;
        this.meshComponent.mainMaterial.mainPass.blendMode = 0;
        this.meshComponent.setRenderOrder(DEFAULT_RENDER_ORDER);
        this.setupMaterial();
    }
    /**
     * Returns a shallow copy of the array of points that the LineRenderer will draw a line between.
     */
    get points() {
        return this._points.slice();
    }
    /**
     * Set the array of points that the LineRenderer will draw a line between.
     */
    set points(points) {
        this._points = points;
        //clear existing mesh data before rebuilding with provided points
        this.clearMesh();
        this.buildMesh();
    }
    /**
     * Gets the color of the line at the start.
     */
    get startColor() {
        return this._startColor;
    }
    /**
     * Sets the color of the line at the start.
     */
    set startColor(color) {
        this._startColor = color;
        this.material.mainPass.startColor = this._startColor;
    }
    /**
     * Gets the color of the line at the end.
     */
    get endColor() {
        return this._endColor;
    }
    /**
     * Sets the color of the line at the end.
     */
    set endColor(color) {
        this._endColor = color;
        this.material.mainPass.endColor = this._endColor;
    }
    /**
     * Gets the width of the line at the start.
     */
    get startWidth() {
        return this._startWidth;
    }
    /**
     * Sets the width of the line at the start.
     */
    set startWidth(newWidth) {
        this._startWidth = newWidth;
        this.material.mainPass.startWidth = this._startWidth;
    }
    /**
     * Gets the width of the line at the end.
     */
    get endWidth() {
        return this._endWidth;
    }
    /**
     * Sets the width of the line at the end.
     */
    set endWidth(newWidth) {
        this._endWidth = newWidth;
        this.material.mainPass.endWidth = this._endWidth;
    }
    get lookAtCamera() {
        return this._lookAtCamera;
    }
    set lookAtCamera(isEnabled) {
        this._lookAtCamera = isEnabled;
        this.material.mainPass.billboarding = this._lookAtCamera;
    }
    /**
     * Sets line to a single solid color instead of a gradient
     * @param color color of the line
     */
    setSolidColor(color) {
        this.startColor = color;
        this.endColor = color;
    }
    /**
     * Updates position of point (in this._points) at the indicated index
     * @param index (index in the points[] array) of the vertex to be changed
     * @param newPos the vertex's new position
     */
    updateVertexPosition(index, newPos) {
        if (index >= this._points.length) {
            this.log.w(`Index ${index} not in range for line with ${this._points.length} points!`);
            return;
        }
        // Modify points array
        this._points[index] = newPos;
        // Calculate where to shift mesh vertices at point
        let tangent;
        let prevPoint;
        let uv_v;
        if (index === 0) {
            prevPoint = this.points[index];
            tangent = this._points[index + 1].sub(this._points[index]).normalize();
            uv_v = 0;
        }
        else if (index === this._points.length - 1) {
            prevPoint = this.points[index - 1];
            tangent = this._points[index].sub(this._points[index - 1]).normalize();
            uv_v = 1;
        }
        else {
            // Get uv_v coords from mesh vertex data, use it to calculate uv, width, and miter
            prevPoint = this.points[index - 1];
            uv_v = this.meshVertexData[index * VERTICES_PER_POINT * VERTEX_DATA_SIZE + UV_V_POSITION];
            const prevSegment = utils.getSegmentNormalized(this._points[index - 1], this._points[index]);
            const nextSegment = utils.getSegmentNormalized(this._points[index], this._points[index + 1]);
            tangent = utils.getTangent(prevSegment, nextSegment);
        }
        const leftVertexData = utils.buildVertex(newPos, prevPoint, tangent, 0, uv_v);
        const rightVertexData = utils.buildVertex(newPos, prevPoint, tangent, 1, uv_v);
        this.meshBuilder.setVertexInterleaved(index * VERTICES_PER_POINT, leftVertexData);
        this.meshBuilder.setVertexInterleaved(index * VERTICES_PER_POINT + 1, rightVertexData);
        this.meshBuilder.updateMesh();
    }
    /**
     * Sets up mesh builder as a triangle strip with position coordinates and additional parameters: previous segment, direction, and uv.
     * These parameters are used to calculate thickness offset in the vertex shader, allowing us to avoid calls to the native layer when billboarding or changing width.
     * @returns meshBuilder with vertex configuration: position (3), prevSegment (3), direction (3), textureO (2)
     */
    setupMeshBuilder() {
        const meshBuilder = new MeshBuilder([
            { name: "position", components: 3 },
            { name: "prevSegment", components: 3 },
            { name: "direction", components: 3 },
            { name: "texture0", components: 2 }
        ]);
        meshBuilder.topology = MeshTopology.TriangleStrip;
        meshBuilder.indexType = MeshIndexType.None;
        return meshBuilder;
    }
    /**
     * Builds the line as a triangle strip mesh using MeshBuilder
     * @returns the mesh created by buildGeometry()
     */
    buildMesh() {
        this.buildGeometry();
        if (this.meshBuilder.isValid()) {
            this.meshBuilder.updateMesh();
            return this.meshBuilder.getMesh();
        }
        else {
            throw new Error("LineRenderer: mesh data invalid");
        }
    }
    /**
     * Clears all existing mesh data, used for when we want to reset points
     */
    clearMesh() {
        if (this.meshBuilder.isValid()) {
            this.meshVertexData = [];
        }
        if (this.meshBuilder.getVerticesCount()) {
            this.meshBuilder.eraseVertices(0, this.meshBuilder.getVerticesCount());
        }
    }
    /**
     * Builds geometry of a line as a triangle strip, using coordinates provided for segments
     * Updates the MeshBuilder with vertex information
     */
    buildGeometry() {
        if (this._points === undefined || this._points.length <= 1) {
            this.log.w("2 or more vertices must be provided in order to render a line!");
            return;
        }
        // Used to calculate uvs
        const totalLineLength = this.getLineLength();
        let lengthAtVertex = 0;
        // Used to calculate miter for bends in segments
        let segmentBefore = null;
        let segmentAfter = null;
        // Append all vertex data in one large array
        const vertexArraySize = this._points.length * SEGMENT_DATA_SIZE;
        const vertexData = Array(vertexArraySize);
        // Build each line segment
        let dataIndex = 0;
        for (let i = 0; i < this._points.length; i++) {
            let tangent;
            let prevSegment;
            let uv_v;
            // Start point - calculate width offset direction based on next vertex only
            if (i === 0) {
                prevSegment = tangent = this._points[i + 1].sub(this._points[i]).normalize();
                uv_v = 0;
            }
            // End point - calculate width offset direction based on previous vertex only
            else if (i === this._points.length - 1) {
                prevSegment = tangent = this._points[i].sub(this._points[i - 1]).normalize();
                uv_v = 1;
            }
            // Middle points
            else {
                // Calculate width at vertex, assuming linear change
                lengthAtVertex += this._points[i].distance(this._points[i - 1]);
                uv_v = lengthAtVertex / totalLineLength;
                // Get segment vectors to calculate miter
                if (segmentBefore === null) {
                    segmentBefore = this._points[i].sub(this._points[i - 1]).normalize();
                }
                segmentAfter = this._points[i + 1].sub(this._points[i]).normalize();
                prevSegment = segmentBefore;
                tangent = utils.getTangent(segmentBefore, segmentAfter);
                // Increment to next segment
                segmentBefore = segmentAfter;
            }
            vertexData.splice(dataIndex, SEGMENT_DATA_SIZE, ...utils.buildSegment(this._points[i], prevSegment, tangent, uv_v));
            if (i <= this._points.length - 1) {
                dataIndex += SEGMENT_DATA_SIZE;
            }
        }
        // Do only one call to native layer to save costs
        this.meshVertexData = vertexData;
        this.meshBuilder.appendVerticesInterleaved(this.meshVertexData);
        // Update mesh with changes once line building is complete
        this.meshBuilder.updateMesh();
    }
    /**
     * Calculates length of current line, used to interpolate gradients & width
     * @returns total length of line with segments indicated
     */
    getLineLength(numSegments = this._points.length) {
        let length = 0;
        for (let i = 0; i < numSegments - 1; i++) {
            length += this._points[i].distance(this._points[i + 1]);
        }
        return length;
    }
    /**
     * Sets up line material to enable gradients along the line
     */
    setupMaterial() {
        this.startColor = this._startColor;
        this.endColor = this._endColor;
        this.startWidth = this._startWidth;
        this.endWidth = this._endWidth;
    }
}
exports.default = LineRenderer;
//# sourceMappingURL=LineRenderer.js.map