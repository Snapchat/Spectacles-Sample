// ConstrainBody.js
// Version: 1.0.1
// Event: On Awake
// Description: Constrains a SceneObject in space. Configure in the Inspector panel.


//@input SceneObject target
/** @type {SceneObject} */
var target = script.target || script.getSceneObject();

//@ui {"widget":"separator", "label":""}

/** @enum {string} */
var ConstraintType = {
    None: "None",
    StartingValue: "Starting Value",
    MinMaxRange: "Min Max Range",
};

/** @enum {string} */
var ModeType = {
    Local: "Local",
    World: "World",
    Mesh: "Mesh",
};

//@input string mode = "Local" {"widget":"combobox", "values":[{"label":"Local", "value":"Local"}, {"label":"World", "value":"World"}, {"label":"Mesh", "value":"Mesh"}]}
/** @type {ModeType} */
var mode = script.mode;

//@input Component.RenderMeshVisual meshVisualConstraint {"showIf":"mode", "showIfValue":"Mesh"}
/** @type {RenderMeshVisual} */
var meshVisualConstraint = script.meshVisualConstraint;

//@ui {"widget":"separator", "label":""}

//@input string xConstraint = "None" {"widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Starting Value", "value":"Starting Value"}, {"label":"Min / Max Range", "value":"Min Max Range"}]}

//@input vec2 xRange {"label": "X Min / Max", "showIf":"xConstraint", "showIfValue":"Min Max Range"}


//@ui {"widget":"separator", "label":""}


//@input string yConstraint = "None" {"widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Starting Value", "value":"Starting Value"}, {"label":"Min / Max Range", "value":"Min Max Range"}]}

//@input vec2 yRange {"label": "Y Min / Max", "showIf":"yConstraint", "showIfValue":"Min Max Range"}

//@ui {"widget":"separator", "label":""}

//@input string zConstraint = "None" {"widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Starting Value", "value":"Starting Value"}, {"label":"Min / Max Range", "value":"Min Max Range"}]}

//@input vec2 zRange {"label": "Z Min / Max", "showIf":"zConstraint", "showIfValue":"Min Max Range"}



//@ui {"widget":"separator", "label":""}

//@ui {"widget":"label", "label":"This will be improved a lot :)"}

//@input string rotationConstraint = "None" {"widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Starting Value", "value":"Starting Value"}]}
/** @type {ConstraintType} */
var rotationConstraint = script.rotationConstraint;



var transform = target.getTransform();

function clamp(val, min, max) {
    return Math.min(Math.max(max, min), Math.max(val, Math.min(min, max)));
}

var relativePosition = new vec3(0.5, 0.5, 0.5);

var startingLocalRotation = transform.getLocalRotation();

/** @type {(FixedConstraint|RangeConstraint)[]} */
var localPosConstraints = [];
/** @type {(FixedConstraint|RangeConstraint)[]} */
var worldPosConstraints = [];

/**
 * @class
 * @param {string} name 
 * @param {vec3} startVec 
 */
function FixedConstraint(name, startVec) {
    this.name = name;
    this.value = startVec[name];
    this.startValue = this.value;
    this.currentT = 0.5;
}

/**
 * 
 * @param {vec3} newVec 
 * @param {vec3} relativeVec 
 */
FixedConstraint.prototype.updateValue = function(newVec, relativeVec) {
    newVec[this.name] = this.startValue;
    relativeVec[this.name] = this.currentT;
};

FixedConstraint.prototype.setT = function(vec, relativeVec) {
    vec[this.name] = this.startValue;
    relativeVec[this.name] = this.currentT;
};

/**
 * @class
 * @param {string} name
 * @param {vec3} startVec 
 * @param {vec2} rangeVec 
 */
function RangeConstraint(name, startVec, rangeVec) {
    this.name = name;
    this.value = startVec[this.name];
    this.min = rangeVec.x;
    this.max = rangeVec.y;
    this.currentT = inverseLerp(this.min, this.max, this.value);
}

/**
 * 
 * @param {vec3} newVec 
 * @param {vec3} relativeVec 
 */
RangeConstraint.prototype.updateValue = function(newVec, relativeVec) {
    this.value = clamp(this.min, this.max, newVec[this.name]);
    this.currentT = inverseLerp(this.min, this.max, this.value);
    newVec[this.name] = this.value;
    relativeVec[this.name] = this.currentT;
};

/**
 * 
 * @param {vec3} vec 
 * @param {vec3} relativeVec 
 */
RangeConstraint.prototype.setT = function(vec, relativeVec) {
    this.currentT = relativeVec[this.name];
    this.value = lerp(this.min, this.max, this.currentT);
    vec[this.name] = this.value;
    relativeVec[this.name] = this.currentT;
};

/**
 * 
 * @param {string} name 
 * @returns 
 */
function createLocalConstraint(name) {
    switch (script[name + "Constraint"]) {
        case ConstraintType.StartingValue:
            return new FixedConstraint(name, transform.getLocalPosition());
        case ConstraintType.MinMaxRange:
            return new RangeConstraint(name, transform.getLocalPosition(), script[name + "Range"]);
    }
}

function createLocalPosConstraints() {
    addIfTruthy(localPosConstraints, createLocalConstraint("x"));
    addIfTruthy(localPosConstraints, createLocalConstraint("y"));
    addIfTruthy(localPosConstraints, createLocalConstraint("z"));
}

/**
 * 
 * @param {string} name 
 * @returns 
 */
function createWorldConstraint(name) {
    switch (script[name + "Constraint"]) {
        case ConstraintType.StartingValue:
            return new FixedConstraint(name, transform.getWorldPosition());
        case ConstraintType.MinMaxRange:
            return new RangeConstraint(name, transform.getWorldPosition(), script[name+"Range"]);
    }
}

function createWorldPosConstraints() {
    addIfTruthy(worldPosConstraints, createWorldConstraint("x"));
    addIfTruthy(worldPosConstraints, createWorldConstraint("y"));
    addIfTruthy(worldPosConstraints, createWorldConstraint("z"));
}

/**
 * @class
 * @param {MeshVisual} meshVisual
 * @param {Transform} transform
 */
function MeshConstraint(meshVisual, transform) {
    this.meshVis = meshVisual;
    this.transform = transform;
    this.meshVisTransform = this.meshVis.getTransform();
    this.meshLocalMax = this.meshVis.mesh.aabbMax;
    this.meshLocalMin = this.meshVis.mesh.aabbMin;
    this.origWorldToMesh = this.meshVisTransform.getInvertedWorldTransform();
    this.startMeshPos = this.origWorldToMesh.multiplyPoint(this.transform.getWorldPosition());

    /** @type {(FixedConstraint|RangeConstraint)[]} */
    this.constraints = [];
}

/**
 * @param {FixedConstraint|RangeConstraint} constraint
 */
MeshConstraint.prototype.addConstraint = function(constraint) {
    addIfTruthy(this.constraints, constraint);
};

MeshConstraint.prototype.addFixedConstraint = function(name) {   
    this.addConstraint(new FixedConstraint(name, this.startMeshPos));
};

MeshConstraint.prototype.addRangeConstraint = function(name, additionalRange) {
    var rangeVec = new vec2(this.meshLocalMin[name], this.meshLocalMax[name]).add(additionalRange);
    this.addConstraint(new RangeConstraint(name, this.startMeshPos, rangeVec));
};

MeshConstraint.prototype.updateValue = function(worldPos, relativeVec) {
    var worldToMesh = this.meshVisTransform.getInvertedWorldTransform();
    var meshPos = worldToMesh.multiplyPoint(worldPos);
    
    for (var i=0; i<this.constraints.length; i++) {
        this.constraints[i].updateValue(meshPos, relativeVec);
    }

    var meshToWorld = this.meshVisTransform.getWorldTransform();
    var newWorldPos = meshToWorld.multiplyPoint(meshPos);
    worldPos["x"] = newWorldPos["x"];
    worldPos["y"] = newWorldPos["y"];
    worldPos["z"] = newWorldPos["z"];
};

MeshConstraint.prototype.setT = function(worldPos, relativeVec) {
    var worldToMesh = this.meshVisTransform.getInvertedWorldTransform();
    var meshPos = worldToMesh.multiplyPoint(worldPos);

    for (var i=0; i<this.constraints.length; i++) {
        this.constraints[i].setT(meshPos, relativeVec);
    }

    var meshToWorld = this.meshVisTransform.getWorldTransform();
    var newWorldPos = meshToWorld.multiplyPoint(meshPos);
    worldPos["x"] = newWorldPos["x"];
    worldPos["y"] = newWorldPos["y"];
    worldPos["z"] = newWorldPos["z"];
};


function createMeshConstraints() {
    var meshConstraint = new MeshConstraint(meshVisualConstraint, transform);

    function createInnerMeshConstraint(name) {
        switch (script[name + "Constraint"]) {
            case ConstraintType.StartingValue:
                meshConstraint.addFixedConstraint(name);
                break;
            case ConstraintType.MinMaxRange:
                meshConstraint.addRangeConstraint(name, script[name+"Range"]);
                break;
        }
    }

    meshConstraint.addConstraint(createInnerMeshConstraint("x"));
    meshConstraint.addConstraint(createInnerMeshConstraint("y"));
    meshConstraint.addConstraint(createInnerMeshConstraint("z"));

    worldPosConstraints.push(meshConstraint);
}

switch (mode) {
    case ModeType.Local:
        createLocalPosConstraints();
        break;
    case ModeType.World:
        createWorldPosConstraints();
        break;
    case ModeType.Mesh:
        createMeshConstraints();
        break;
}


script.createEvent("LateUpdateEvent").bind(function(eventData) {
    if (localPosConstraints.length > 0) {
        var localPos = transform.getLocalPosition();
        for (var i=0; i<localPosConstraints.length; i++) {
            localPosConstraints[i].updateValue(localPos, relativePosition);
        }
        transform.setLocalPosition(localPos);
    }
    if (worldPosConstraints.length > 0) {
        var worldPos = transform.getWorldPosition();
        for (var j=0; j<worldPosConstraints.length; j++) {
            worldPosConstraints[j].updateValue(worldPos, relativePosition);
        }
        transform.setWorldPosition(worldPos);
    }

    // TODO: This needs to be done way better!
    if (rotationConstraint == ConstraintType.StartingValue) {
        transform.setLocalRotation(startingLocalRotation);
    }

    // Test
    var relPos = getRelativePosition();
    setRelativePosition(relPos);

});

/**
* Returns the ratio of `value` between `a` and `b`
* @param {number} a Lower Bound
* @param {number} b Upper Bound
* @param {number} value Value between `a` and `b`
* @returns {number} Ratio of `value` between `a` and `b`
*/
function inverseLerp(a, b, value) {
    return (value-a) / (b-a);
}

/**
* Returns the number between `a` and `b` determined by the ratio `t`
* @param {number} a Lower Bound
* @param {number} b Upper Bound
* @param {number} t Ratio [0-1]
* @returns {number} Number between `a` and `b` determined by ratio `t`
*/
function lerp(a, b, t) {
    return a + (b-a) * t;
}

function addIfTruthy(array, item) {
    if (item) {
        array.push(item);
    }
}

/**
 * Returns the positions relative to constraint space
 * @returns {vec3}
 */
function getRelativePosition() {
    return relativePosition;
}


/**
 * 
 * @param {vec3} relativePos 
 */
function setRelativePosition(relativePos) {
    relativePosition = relativePos.uniformScale(1);
    if (localPosConstraints.length > 0) {
        var localPos = transform.getLocalPosition();
        for (var i=0; i<localPosConstraints.length; i++) {
            localPosConstraints[i].setT(localPos, relativePosition);
        }
        transform.setLocalPosition(localPos);
    }
    if (worldPosConstraints.length > 0) {
        var worldPos = transform.getWorldPosition();
        for (var j=0; j<worldPosConstraints.length; j++) {
            worldPosConstraints[j].setT(worldPos, relativePosition);
        }
        transform.setWorldPosition(worldPos);
    }
    return relativePosition;
}

/**
 * @typedef ConstrainBody
 * @property {()=>vec3} getRelativePosition Returns the positions relative to constraint space
 * @property {(relativePos:vec)=>vec3} setRelativePosition
 */

script.getRelativePosition = getRelativePosition;
script.getRelativePosition = getRelativePosition;

script.setRelativePosition = setRelativePosition;
script.setRelativePosition = setRelativePosition;