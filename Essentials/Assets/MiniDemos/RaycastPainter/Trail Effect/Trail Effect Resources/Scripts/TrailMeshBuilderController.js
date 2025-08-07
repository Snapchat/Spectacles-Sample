// TrailMeshBuilderController.js
// Version: 0.0.1
// Event: Initialized
// Description: creates a trail effect by defining two points.
// Pack: Refinement Pack

//@ui {"widget":"group_start", "label":"Trail Controls"}
//@input vec3 trailColor {"widget":"color"}
//@input float trailLength = 30
//@input Asset.Material trailMaterial
//@ui {"widget":"group_end"}


//@ui {"widget":"group_start", "label":"Cursor Control"}
//@input SceneObject cursorBase {"label":"Cursor Base"}
//@input SceneObject cursor {"label":"Cursor End"}
//@ui {"widget":"group_end"}

// Vars
var frameCount = 0;
var indicesBuffer;
var vertBuffer;
var isInitialized = false;
var renderMeshVisual;
var builder;
var tailLength;
var tailColor;

function initialize() {
    if (validateInputs()) {
        setMeshBuilder();
        script.resetTrail();
        isInitialized = true;
    }
}

function setMeshBuilder() {
    script.trailMaterial.mainPass.baseColor = setColorWithAlpha(script.trailColor, 1);
    renderMeshVisual = script.getSceneObject().createComponent("Component.RenderMeshVisual");
    renderMeshVisual.clearMaterials();
    renderMeshVisual.mainMaterial = script.trailMaterial;
    
    builder = new MeshBuilder([
        { name: "position", components: 3 },
        { name: "color", components: 4 },
    ]);
    builder.topology = MeshTopology.TriangleStrip;
    builder.indexType = MeshIndexType.UInt16;
    
    tailLength = script.trailLength;
    tailColor = [script.trailColor.r, script.trailColor.g, script.trailColor.b, 1];
}

script.hideTrail = function() {
    renderMeshVisual.enabled = false;
};

script.showTrail = function() {
    renderMeshVisual.enabled = true;
};

script.resetTrail = function() {
    var verticesCount = builder.getVerticesCount();
    var indicesCount = builder.getIndicesCount();
    if (verticesCount > 0) {
        builder.eraseVertices(0, verticesCount);
        builder.eraseIndices(0, indicesCount);
    }

    var loc = script.cursor.getTransform().getWorldPosition();
    var loc2 = script.cursorBase.getTransform().getWorldPosition();

    var origin = [[loc.x, loc.y, loc.z], tailColor];
    var origin2 = [[loc2.x, loc2.y, loc2.z], tailColor];

    indicesBuffer = [];
    vertBuffer = [];

    // PREPARE FIRST MESH
    for (var i = 0; i < tailLength; i++) {
        indicesBuffer.push(i);

        var vert = i % 2 == 0 ? origin : origin2;
        vertBuffer.push(vert);
        builder.appendVertices(vert);
    }
    builder.appendIndices(indicesBuffer);

    // BUILD FIRST MESH
    if (builder.isValid()) {
        renderMeshVisual.mesh = builder.getMesh();
        builder.updateMesh();
    } else {
        print("Mesh data invalid!");
    }

};

function onUpdate() {
    if (!isInitialized) {
        return;
    }

    frameCount++;

    if (frameCount % 1 == 0) {

        // Get draw positions
        var loc = script.cursor.getTransform().getWorldPosition();
        var loc2 = script.cursorBase.getTransform().getWorldPosition();

        // Remove tail vertices
        vertBuffer.shift();
        vertBuffer.shift();

        // Add new vertices
        vertBuffer = vertBuffer.concat([
            [[loc.x, loc.y, loc.z], tailColor],
            [[loc2.x, loc2.y, loc2.z], tailColor],
        ]);

        // Clear all vertices
        var verticesCount = builder.getVerticesCount();
        builder.eraseVertices(0, verticesCount);

        // Rebuild with new vertices
        for (var i=0; i < vertBuffer.length; i++) {
            // set color
            vertBuffer[i][1][3] = i/vertBuffer.length;

            builder.appendVertices(vertBuffer[i]);
        }

        if (builder.isValid()) {
            builder.updateMesh();
        } else {
            print("Mesh data invalid!");
        }

    }

}

function setColorWithAlpha(color, alpha) {
    return new vec4(color.x, color.y, color.z, alpha);
}

function validateInputs() {
    if (!script.trailMaterial) {
        print("TrailMeshBuilderController, ERROR: Please make sure to set a material for the trail effect.");
        return false;
    }
    if (!script.cursorBase) {
        print("TrailMeshBuilderController, ERROR: Please make sure to set a sceneobject to represent the cursor start position.");
        return false;
    }
    if (!script.cursor) {
        print("TrailMeshBuilderController, ERROR: Please make sure to set a sceneobject to represent the cursor end position.");
        return false;
    }
    return true;
}

initialize();

var event = script.createEvent("UpdateEvent");
event.bind(onUpdate);
