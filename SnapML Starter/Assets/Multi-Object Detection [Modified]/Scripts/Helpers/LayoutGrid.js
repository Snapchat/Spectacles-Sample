// LayoutGrid.js
// v 1.0.2
// Event: Lens Initialized
// Creates a grid layout of children elements with specified settings


//@input vec4 paddings = {0,0,0,0}
//@input vec2 cellSize = {1,1}
//@input vec2 spacing = {0,0}

//@input string startCorner = "TOP_LEFT" {"widget":"combobox", "values": [{"label" : "Top Left", "value" : "TOP_LEFT"}, {"label" : "Top Right", "value" : "TOP_RIGHT"}, {"label" : "Bottom Right", "value" : "BOTTOM_RIGHT"}, {"label" : "Bottom Left", "value" : "BOTTOM_LEFT"}]}
//@input int startAxis = 0 {"widget":"combobox", "values": [{"label" : "X", "value" : 0}, {"label" : "Y", "value" : 1}]}
//@input string childAlignment = "MIDDLE_CENTER" {"widget":"combobox", "values": [{"label" : "Top Left", "value" : "TOP_LEFT"}, {"label" : "Top Center", "value" : "TOP_CENTER"}, {"label" : "Top Right", "value" : "TOP_RIGHT"}, {"label" : "Middle Right", "value" : "MIDDLE_RIGHT"}, {"label" : "Bottom Right", "value" : "BOTTOM_RIGHT"}, {"label" : "Bottom Center", "value" : "BOTTOM_CENTER"}, {"label" : "Bottom Left", "value" : "BOTTOM_LEFT"}, {"label" : "Middle Left", "value" : "MIDDLE_LEFT"}, {"label" : "Middle Center", "value" : "MIDDLE_CENTER"}]}

//@input int constraint = 0 {"widget":"combobox", "values": [{"label" : "Flexible", "value" : 0}, {"label" : "Fixed column count", "value" : 1}, {"label" : "Fixed row count", "value" : 2}]}
//@input int columns = 5 {"showIf": "constraint", "showIfValue" : "1"}
//@input int rows = 2 {"showIf": "constraint", "showIfValue" : "2"}

//@ui {"widget":"separator"}
//@input bool additional {"label":"Additional Settings"}
//@input  bool initializeOnStart = true  {"hint" : "Disable if you don't need to initialize it later from another script", "showIf" : "additional"}
//@input bool resizeParent  {"hint" : "Enable if you want to resize parent around children", "showIf" : "additional"}
//@input bool ignoreDisabled {"hint" : "Exclude disabled children objects from the grid", "showIf" : "additional"}


// constants
const ALIGNMENTS = {
    TOP_LEFT: new vec2(-1.0, 1.0),
    TOP_CENTER: new vec2(0, 1.0),
    TOP_RIGHT: new vec2(1.0, 1.0),
    MIDDLE_RIGHT: new vec2(1.0, 0.0),
    BOTTOM_RIGHT: new vec2(1.0, -1.0),
    BOTTOM_CENTER: new vec2(0.0, -1.0),
    BOTTOM_LEFT: new vec2(-1.0, -1.0),
    MIDDLE_LEFT: new vec2(-1.0, 0.0),
    MIDDLE_CENTER: new vec2(0.0, 0.0),
};

const AXIS = {
    X: "x",
    Y: "y"
};
// end constants

//parameters
var parentScreenTransform;
var layoutElements = [];
var elementCount = 0;

var initialized = false;

// initialize parent and children
function initialize() {
    var parent = script.getSceneObject();
    parentScreenTransform = parent.getComponent("ScreenTransform");

    if (parentScreenTransform == null) {
        print("[Layout grid], Error, a LayoutGroup script should be attached to a SceneObject with a ScreenTransform Component");
        return;
    }

    layoutElements = [];
    for (var i = 0; i < parent.getChildrenCount(); i++) {
        var child = parent.getChild(i);
        if (child.enabled || !script.ignoreDisabled) {
            var st = child.getComponent("ScreenTransform");
            if (st != null) {
                layoutElements.push(st);
            } else {
                print("[Layout grid], Warning, child " + i + " doesn't have ScreenTransform Component");
            }
        }
    }
    elementCount = layoutElements.length;
    initialized = true;
}

function calculateShape() {

    var shape = {};
    var columnsFirst = script.constraint == 1;
    var rows = script.rows;
    var columns = script.columns;

    if (script.constraint == 0) {

        var parentSize = getActualSize(parentScreenTransform);
        //get how many would fit into 
        columns = Math.floor(parentSize.x / script.cellSize.x + script.spacing.x);
        rows = Math.floor(parentSize.y / script.cellSize.y + script.spacing.y);
        columnsFirst = script.startAxis == 0;
    }

    if (columnsFirst) {

        columns = Math.max(columns, 1);
        shape.columns = Math.min(columns, elementCount);
        shape.rows = Math.ceil(elementCount / columns);

    } else {

        rows = Math.max(rows, 1);
        shape.rows = Math.min(rows, elementCount);
        shape.columns = Math.ceil(elementCount / rows);
    }
    return shape;
}

function buildAxis(index, shape) {

    var name = script.startAxis != index ? AXIS.X : AXIS.Y;
    var maxValue = name == AXIS.X ? shape.columns : shape.rows;
    if (maxValue > elementCount) {
        maxValue = elementCount;
    }
    //finding start and end indices
    var dir = ALIGNMENTS[script.startCorner][name];

    return {
        name: name,
        start: dir == 1 ? maxValue - 1 : 0,
        end: dir == 1 ? -1 : maxValue,
        step: -1 * dir,
        count: maxValue
    };
}

function update() {
    if (!initialized) {
        print("[Layout Group] layout is not initialized yet, call script.api.initialize first");
        return;
    }
    var shape = calculateShape();

    var gridSize = calculateGridSize(shape.columns, shape.rows, script.cellSize, script.spacing, script.paddings);

    var startOffset = getStartOffset(gridSize);

    var axes = [buildAxis(0, shape), buildAxis(1, shape)];

    var count = 0;

    var i = axes[0].start;

    while (i != axes[0].end && count < layoutElements.length) {

        var j = axes[1].start;
        while (j != axes[1].end && count < layoutElements.length) {

            //calculate position            
            var pos = vec2.zero();

            pos[axes[0].name] = (script.cellSize[axes[0].name]) * (i + 0.5); // adding half size offset 
            pos[axes[1].name] = (script.cellSize[axes[1].name]) * (j + 0.5);

            if (axes[0].count > 1) {
                pos[axes[0].name] += script.spacing[axes[0].name] * i;
            }
            if (axes[1].count > 1) {
                pos[axes[1].name] += script.spacing[axes[1].name] * j;
            }

            pos[axes[0].name] += script.paddings[axes[0].name == AXIS.X ? "x" : "z"];
            pos[axes[1].name] += script.paddings[axes[1].name == AXIS.X ? "x" : "z"];

            pos[axes[0].name] += startOffset[axes[0].name];
            pos[axes[1].name] += startOffset[axes[1].name];

            //setting position
            layoutElements[count].anchors = Rect.create(0, 0, 0, 0);
            layoutElements[count].offsets.setSize(script.cellSize);
            layoutElements[count].offsets.setCenter(pos);

            count++;

            j = j + axes[1].step;
        }
        i = i + axes[0].step;
    }
}

function getStartOffset(gridSize) {

    var alignment = ALIGNMENTS[script.childAlignment];
    var offset = vec2.zero();
    offset.x = -gridSize.x * (alignment.x + 1.0) * 0.5;
    offset.y = -gridSize.y * (alignment.y + 1.0) * 0.5;

    var parentSize;

    if (script.resizeParent) {
        parentScreenTransform.anchors = Rect.create(0, 0, 0, 0);
        parentScreenTransform.offsets.setSize(gridSize);
        parentSize = gridSize;
    } else {
        parentSize = getActualSize(parentScreenTransform);
    }

    offset.x += parentSize.x / 2.0 * alignment.x;
    offset.y += parentSize.y / 2.0 * alignment.y;
    return offset;
}

function calculateGridSize(columns, rows, cellSize, spacing, paddings) {

    var width = columns * cellSize.x + (columns - 1) * spacing.x + paddings.x + paddings.y;
    var height = rows * cellSize.y + (rows - 1) * spacing.y + paddings.z + paddings.w;

    return new vec2(width, height);

}


function getActualSize(st) {

    var topRight = st.localPointToWorldPoint(ALIGNMENTS.TOP_RIGHT);
    var botLeft = st.localPointToWorldPoint(ALIGNMENTS.BOTTOM_LEFT);

    return new vec2(topRight.x - botLeft.x, topRight.y - botLeft.y);
}

function getContainerSize(st) {
    return getActualSize(st);
}

script.api.initialize = initialize;
script.api.update = update;
script.api.getContainerSize = getContainerSize;

if (script.initializeOnStart) {
    initialize();
    script.createEvent("UpdateEvent").bind(function(event) {
        update();
        script.removeEvent(event);
    });
}