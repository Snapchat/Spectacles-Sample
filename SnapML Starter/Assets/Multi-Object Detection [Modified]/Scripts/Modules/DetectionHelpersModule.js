// NmsIou.js
// Version: 0.0.1
// Event: OnAwake
// Description: Implements non-maximum suppression and intersection over union algorithms.

/**
 * @class
 * @param {[number, number, number, number]} bbox - bbox coordinates in screen space
 * @param {number} score - detection score
 * @param {number} index - class index
 * @param {string} [label] - class label
 */

var Detection = function(bbox, score, index, label) {
    this.bbox = bbox;
    this.score = score;
    this.index = index;
    this.label = label == undefined ? "class_" + index : label;
};
/**
 * @returns {string}
 */
Detection.prototype.toString = function() {
    return "Class: " + this.label + " Score: " + this.score.toFixed(5) + " Bounding Box: " + this.bbox;
};
/**
 * @returns {Rect}
 */
Detection.prototype.getScreenRect = function() {
    //bbox - x, y, w, h
    var x = this.bbox[0] * 2.0 - 1.0;
    var y = 1.0 - 2 * this.bbox[1];
    // bbox is in screen space, rect is in local space 
    return Rect.create(
        x - this.bbox[2],
        x + this.bbox[2],
        y - this.bbox[3],
        y + this.bbox[3]);
};

/**
 * @returns vec2
 */
Detection.prototype.getScreenPos = function() {
    //bbox - x, y, w, h
    return new vec2(this.bbox[0], this.bbox[1]);
    // bbox is in screen space, rect is in local space 
};

/**
 * @param {number[][]} boxes 
 * @param {number[]} scores 
 * @param {number} scoreThresh 
 * @param {number} iouThresh 
 * @returns {Detection[]}
 */
function nms(boxes, scores, scoreThresh, iouThresh) {
    var result = [];
    var candidates = [];

    for (var i = 0; i < boxes.length; i++) {
        if (scores[i].score > scoreThresh) {
            candidates.push(new Detection(boxes[i], scores[i].score, scores[i].cls));
        }
    }

    candidates.sort(compareByScoreReversed);

    while (candidates.length > 0) {
        var currentBox = candidates.shift();
        result.push(currentBox);
        candidates.forEach(function(item) {
            if (currentBox.class == item.class) {
                var IOU = iou(currentBox.bbox, item.bbox);
                if (IOU >= iouThresh) {
                    candidates = candidates.filter(function(x) {
                        return x != item;
                    });
                }
            }
        });
    }

    return result;
}

/**
 * compares iou of two boxes represented with [centerX, centerY, width, height]
 * @param {number[]} box1 
 * @param {number[]} box2 
 * @returns {number}
 */
function iou(box1, box2) {
    var xi1 = Math.max(box1[0] - box1[2] / 2, box2[0] - box2[2] / 2);
    var yi1 = Math.max(box1[1] - box1[3] / 2, box2[1] - box2[3] / 2);

    var xi2 = Math.min(box1[0] + box1[2] / 2, box2[0] + box2[2] / 2);
    var yi2 = Math.min(box1[1] + box1[3] / 2, box2[1] + box2[3] / 2);

    var iarea = Math.max(xi2 - xi1, 0) * Math.max(yi2 - yi1, 0);

    var b1area = box1[2] * box1[3];
    var b2area = box2[2] * box2[3];
    var uarea = b1area + b2area - iarea;

    return iarea / uarea;
}

/**
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
function compareByScoreReversed(a, b) {
    return b.score - a.score;
}


module.exports.nms = nms;
module.exports.iou = iou;
module.exports.compareByScoreReversed = compareByScoreReversed;

module.exports.Detection = Detection;