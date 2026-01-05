// MLOutputDecoder.js
// Version: 2.0.0
// Event: OnAwake
// Description: Configures MLComponent and decodes output

// Public api:
//
// add onDetectionsUpdated event callback
// script.onDetectionsUpdated.add(callback);

// get total class count
// script.getClassCount()

// get class name by index
// script.getClassLabel(index)

// enable or disable detection of certain class by index
// script.setClassEnabled(index, true)

//inputs
//@input bool mlSettings {"label": "ML Settings"}
//@input Asset.MLAsset model {"label": "ML Model", "showIf" : "mlSettings", "hint": "Object Detection ML Model"}
/** @type {MLAsset} */
var model = script.model;

//@input Asset.Texture inputTexture {"hint": "Texture passed to ML model input, Device Camera Texture",  "showIf" : "mlSettings"}
/** @type {Texture} */
var inputTexture = script.inputTexture;
//@ui {"widget" : "separator"}
/*
@typedef ClassSettings
@property {string} label
@property {boolean} enabled
*/

//@input ClassSettings[] classSettings  {"hint" : "Specify classes labels to be used by otehr scripts, if not set will be referenced by class index"}
/** @type {[string, boolean]} */
var classSettings = script.classSettings;

//@ui {"widget" : "separator"}
//@input bool processingSettings = false {"label" : "NMS Settings"}

//@input float scoreThreshold = 0.4 {"widget" : "slider", "min" : 0, "max" : 1, "step" : 0.05, "showIf": "processingSettings"}
/** @type {number} */
var scoreThreshold = script.scoreThreshold;

//@input float iouThreshold = 0.65 {"widget" : "slider", "min" : 0, "max" : 1, "step" : 0.05,  "showIf": "processingSettings"}
/** @type {number} */
var iouThreshold = script.iouThreshold;
//@ui {"widget" : "separator"}
//@input bool modelInfo {"label": "Print Debug"}
//@input Component.Text text {"label" : "Debug Text", "showIf" : "modelInfo"}

var DetectionHelpers = require("Modules/DetectionHelpersModule");
var Events = require("Modules/EventModule");

const EventWrapper = Events.EventWrapper;

const anchors = [
  [
    [144, 300],
    [304, 220],
    [288, 584]
  ],
  [
    [568, 440],
    [768, 972],
    [1836, 1604]
  ],
  [
    [48, 64],
    [76, 144],
    [160, 112]
  ]
];

const strides = [16, 32, 8];

/**
 * @typedef {[number, number]} GridEntry
 */
/** @type {GridEntry[][][]}*/
var grids = [];
/** @type {[number, number, number, number]}*/
var boxes = [];
/** @type {number[]}*/
var scores = [];
/** @type {vec3} */
var inputShape;
/** @type {MLComponent} */
var mlComponent;
/** @type {OutputPlaceholder[]} */
var outputs;
/** @type {InputPlaceholder[]} */
var inputs;
/** @type {number} */
var classCount = classSettings.length;

/** @type {EventWrapper} List of callbacks to call once detections were processed */
var onDetectionsUpdated = new EventWrapper();

/**
 * create ml component
 */
function init() {
  if (!script.model) {
    print("Error, please set ML Model asset input");
    return;
  }
  mlComponent = script.getSceneObject().createComponent("MLComponent");
  mlComponent.model = model;
  mlComponent.onLoadingFinished = onLoadingFinished;
  mlComponent.inferenceMode = MachineLearning.InferenceMode.Accelerator;
  mlComponent.build([]);
}

/**
 * configures inputs and outputs, starts running ml component
 */
function onLoadingFinished() {
  outputs = mlComponent.getOutputs();
  inputs = mlComponent.getInputs();

  printInfo("Model built");

  // build grids
  for (var i = 0; i < outputs.length; i++) {
    var shape = outputs[i].shape;
    grids.push(makeGrid(shape.x, shape.y));
  }
  inputShape = inputs[0].shape;
  inputs[0].texture = inputTexture;
  // run on update
  mlComponent.runScheduled(true, MachineLearning.FrameTiming.Update, MachineLearning.FrameTiming.Update);
  // process outputs on script update (after ml update)
  script.createEvent("UpdateEvent").bind(onUpdate);
}

// The following code is based on:
// https://github.com/WongKinYiu/yolov7/blob/44d8ab41780e24eba563b6794371f29db0902271/models/yolo.py#L416
/**
 *
 * @param {number} nx
 * @param {number} ny
 * @returns {GridEntry[][]}
 */
function makeGrid(nx, ny) {
  var grids = [];
  for (var dy = 0; dy < ny; dy++) {
    var grid = [];
    for (var dx = 0; dx < nx; dx++) {
      grid.push([dx, dy]);
    }
    grids.push(grid);
  }
  return grids;
}

/**
 *
 * @param {OutputPlaceholder[]} outputs
 * @returns
 */
function parseYolo7Outputs(outputs) {
  boxes = [];
  scores = [];
  var num_heads = outputs.length;
  for (var i = 0; i < num_heads; i++) {
    var output = outputs[i];
    var data = output.data;
    var shape = output.shape;
    var nx = shape.x;
    var ny = shape.y;
    var step = classCount + 4 + 1;

    // [nx, ny, 255] -> [nx, ny, n_anchors(3), n_outputs(classCount + 4 + 1)]
    for (var dy = 0; dy < ny; dy++) {
      for (var dx = 0; dx < nx; dx++) {
        for (var da = 0; da < anchors.length; da++) {
          var idx = dy * nx * anchors.length * step + dx * anchors.length * step + da * step;
          // 0-1: xy, 2-3: wh, 4: conf, 5-5+classCount: scores
          var x = data[idx];
          var y = data[idx + 1];
          var w = data[idx + 2];
          var h = data[idx + 3];
          var conf = data[idx + 4];

          if (conf > scoreThreshold) {
            // This code is simplified from:
            // https://github.com/WongKinYiu/yolov7/blob/44d8ab41780e24eba563b6794371f29db0902271/models/yolo.py#L59-L61
            x = (x * 2 - 0.5 + grids[i][dy][dx][0]) * strides[i];
            y = (y * 2 - 0.5 + grids[i][dy][dx][1]) * strides[i];
            w = w * w * anchors[i][da][0];
            h = h * h * anchors[i][da][1];

            var res = {cls: 0, score: 0};
            var box = [x / inputShape.x, y / inputShape.y, w / inputShape.y, h / inputShape.y];
            for (var nc = 0; nc < classCount; nc++) {
              if (!classSettings[nc].enabled) {
                continue;
              }
              var class_score = data[idx + 5 + nc] * conf;
              if (class_score > scoreThreshold && class_score > res.score) {
                res.cls = nc;
                res.score = class_score;
              }
            }
            if (res.score > 0) {
              boxes.push(box);
              scores.push(res);
            }
          }
        }
      }
    }
  }
  return [boxes, scores];
}
/**
 * process outputs on each update
 */

function onUpdate(eventData) {
  parseYolo7Outputs(outputs);

  var result = DetectionHelpers.nms(boxes, scores, scoreThreshold, iouThreshold).sort(
    DetectionHelpers.compareByScoreReversed
  );
  for (var i = 0; i < result.length; i++) {
    if (classSettings.length > result[i].index && classSettings[result[i].index].label) {
      result[i].label = classSettings[result[i].index].label;
    }
  }
  onDetectionsUpdated.trigger(result);
}

/**
 * @param {string} msg
 */
function printInfo(msg) {
  if (script.modelInfo) {
    print(msg);
  }
}
/**
 * returns a number of classes that model detects
 * @returns {number}
 */
function getClassCount() {
  return classCount;
}

function getClassLabel(index) {
  return classSettings[index].label ? classSettings[index].label : "class_" + index;
}

function setClassEnabled(index, value) {
  classSettings[index].enabled = value;
}

function getClassEnabled(index) {
  return classSettings[index].enabled;
}

//initialize

init();

//public api functions

script.onDetectionsUpdated = onDetectionsUpdated;
script.getClassCount = getClassCount;
script.getClassLabel = getClassLabel;
script.setClassEnabled = setClassEnabled;
script.getClassEnabled = getClassEnabled;
